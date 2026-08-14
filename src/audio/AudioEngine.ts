import { AudioLayer, WaveformType } from '../types';

export interface AudioDiagnostics {
  state: AudioContextState | 'uninitialized';
  sampleRate: number;
  activeLayersCount: number;
  activeNodesCount: number;
  masterVolume: number;
  currentTime: number;
  limiterReductionDb: number;
}

interface LayerAudioNodes {
  layerId: string;
  oscLeft?: OscillatorNode;
  oscRight?: OscillatorNode;
  oscCenter?: OscillatorNode;
  gainLeft?: GainNode;
  gainRight?: GainNode;
  merger?: ChannelMergerNode;
  layerGain: GainNode;
  modGain: GainNode; // Dedicated non-inverting AM VCA
  panner: StereoPannerNode;
  lfoOsc?: OscillatorNode;
  lfoGain?: GainNode;
  lfoPanGain?: GainNode;
  isDisposing?: boolean;
}

/**
 * Central Audio Node & Graph Manager.
 * Persists independently of the React component lifecycle.
 * Manages AudioContext, node trees, and automation curves (setTargetAtTime & exponentialRampToValueAtTime).
 */
export class AudioEngine {
  private static instance: AudioEngine | null = null;

  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private layerSummingGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private analyser: AnalyserNode | null = null;
  
  private activeLayerNodes: Map<string, LayerAudioNodes> = new Map();
  private isPlaying: boolean = false;
  private currentMasterVolume: number = 0.7;
  private currentLayers: AudioLayer[] = [];
  
  private onStateChangeCallbacks: Set<(isPlaying: boolean) => void> = new Set();
  private onErrorCallbacks: Set<(err: string) => void> = new Set();

  private constructor() {
    // Singleton - persists outside React component tree
  }

  public static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  /**
   * Safe AudioContext initialization/resumption on user interaction.
   */
  public async init(): Promise<boolean> {
    try {
      if (!this.ctx) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) {
          throw new Error('Web Audio API não é suportada neste navegador.');
        }
        this.ctx = new AudioContextClass();

        const now = this.ctx.currentTime;

        // 1. Layer summing bus (calibrated to provide generous headroom for multiple harmonic layers)
        this.layerSummingGain = this.ctx.createGain();
        this.layerSummingGain.gain.setValueAtTime(0.65, now);

        // 2. Soft limiter / dynamics compressor to avoid digital clipping with multiple layers
        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-2.0, now);
        this.compressor.knee.setValueAtTime(12.0, now);
        this.compressor.ratio.setValueAtTime(12.0, now);
        this.compressor.attack.setValueAtTime(0.002, now); // 2ms fast transient catch
        this.compressor.release.setValueAtTime(0.12, now); // 120ms transparent recovery

        // 3. Master volume gain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.currentMasterVolume, now);

        // 4. Analyser for real-time visualization
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 512;
        this.analyser.smoothingTimeConstant = 0.85;

        // Routing: Layers -> Summing Gain -> Compressor/Limiter -> Master Gain -> Analyser -> Output
        this.layerSummingGain.connect(this.compressor);
        this.compressor.connect(this.masterGain);
        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
      }

      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      return true;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Erro ao inicializar o motor de áudio Web Audio.';
      console.error('AudioEngine init error:', e);
      this.notifyError(msg);
      return false;
    }
  }

  public getAudioContext(): AudioContext | null {
    return this.ctx;
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getMasterVolume(): number {
    return this.currentMasterVolume;
  }

  /**
   * Smoothly changes master volume with exponential response and zero clicks.
   */
  public setMasterVolume(vol: number, rampDuration = 0.03) {
    this.currentMasterVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      // setTargetAtTime provides natural first-order exponential smoothing without discontinuities
      this.masterGain.gain.setTargetAtTime(this.currentMasterVolume, now, rampDuration);
    }
  }

  /**
   * Diagnostic statistics for monitoring audio engine stability.
   */
  public getDiagnostics(): AudioDiagnostics {
    let nodeCount = 0;
    if (this.layerSummingGain) nodeCount += 4; // SummingGain, Compressor, MasterGain, Analyser
    for (const [, nodes] of this.activeLayerNodes.entries()) {
      if (nodes.oscLeft) nodeCount++;
      if (nodes.oscRight) nodeCount++;
      if (nodes.oscCenter) nodeCount++;
      if (nodes.gainLeft) nodeCount++;
      if (nodes.gainRight) nodeCount++;
      if (nodes.merger) nodeCount++;
      nodeCount += 3; // layerGain, modGain, panner
      if (nodes.lfoOsc) nodeCount++;
      if (nodes.lfoGain) nodeCount++;
      if (nodes.lfoPanGain) nodeCount++;
    }

    return {
      state: this.ctx ? this.ctx.state : 'uninitialized',
      sampleRate: this.ctx ? this.ctx.sampleRate : 0,
      activeLayersCount: this.activeLayerNodes.size,
      activeNodesCount: nodeCount,
      masterVolume: this.currentMasterVolume,
      currentTime: this.ctx ? Math.round(this.ctx.currentTime * 10) / 10 : 0,
      limiterReductionDb: this.compressor ? Math.round(this.compressor.reduction * 10) / 10 : 0,
    };
  }

  /**
   * Start playback with the provided layers using an exponential fade-in envelope.
   */
  public async play(layers: AudioLayer[], fadeInSec = 0.4): Promise<boolean> {
    const initialized = await this.init();
    if (!initialized || !this.ctx || !this.layerSummingGain || !this.masterGain) {
      return false;
    }

    this.currentLayers = layers;
    this.rebuildAllLayers(layers);

    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);

    if (fadeInSec > 0) {
      const targetVol = Math.max(0.0001, this.currentMasterVolume);
      this.masterGain.gain.setValueAtTime(0.0001, now);
      // Exponential ramp for perceptual linear loudness increase
      this.masterGain.gain.exponentialRampToValueAtTime(targetVol, now + Math.max(0.05, fadeInSec));
    } else {
      this.masterGain.gain.setValueAtTime(this.currentMasterVolume, now);
    }

    this.isPlaying = true;
    this.notifyStateChange();
    return true;
  }

  /**
   * Pause/Stop audio playback with an exponential fade-out to prevent pop artifacts.
   */
  public pause(fadeOutSec = 0.25, onComplete?: () => void) {
    if (!this.isPlaying || !this.ctx || !this.masterGain) {
      this.isPlaying = false;
      this.notifyStateChange();
      if (onComplete) onComplete();
      return;
    }

    const now = this.ctx.currentTime;
    if (fadeOutSec > 0) {
      this.masterGain.gain.cancelScheduledValues(now);
      const currentVal = Math.max(0.0001, this.masterGain.gain.value);
      this.masterGain.gain.setValueAtTime(currentVal, now);
      // Exponential ramp down to safe floor before disconnect
      this.masterGain.gain.exponentialRampToValueAtTime(0.00001, now + fadeOutSec);
      
      setTimeout(() => {
        this.stopAllOscillators();
        this.isPlaying = false;
        this.notifyStateChange();
        if (onComplete) onComplete();
      }, fadeOutSec * 1000 + 35);
    } else {
      this.stopAllOscillators();
      this.isPlaying = false;
      this.notifyStateChange();
      if (onComplete) onComplete();
    }
  }

  public stop() {
    this.pause(0.15);
  }

  /**
   * Update layers dynamically with smooth parameter interpolation without tearing down nodes.
   */
  public updateLayers(layers: AudioLayer[]) {
    this.currentLayers = layers;
    if (!this.isPlaying || !this.ctx) return;

    const activeSolo = layers.some((l) => l.solo && l.enabled);
    const layerIds = new Set(layers.map((l) => l.id));

    // 1. Smoothly fade out and dispose removed layers
    for (const [id, nodes] of this.activeLayerNodes.entries()) {
      if (!layerIds.has(id)) {
        this.fadeAndDisposeLayer(nodes, 0.035);
        this.activeLayerNodes.delete(id);
      }
    }

    // 2. Update existing layers or smoothly instantiate new ones
    for (const layer of layers) {
      const existing = this.activeLayerNodes.get(layer.id);
      if (existing) {
        this.updateLayerParameters(existing, layer, activeSolo);
      } else if (layer.enabled) {
        this.createAndStartLayer(layer, activeSolo, 0.04);
      }
    }
  }

  /**
   * Centralized parameter smoothing with zero-click guarantees using setTargetAtTime & exponential automation.
   */
  private updateLayerParameters(nodes: LayerAudioNodes, layer: AudioLayer, hasGlobalSolo: boolean) {
    if (!this.ctx || nodes.isDisposing) return;
    const now = this.ctx.currentTime;
    const isMuted = layer.mute || !layer.enabled || (hasGlobalSolo && !layer.solo);
    const targetGain = isMuted ? 0.00001 : Math.max(0.00001, layer.volume);

    // 1. Smooth Frequency Updates (exponential glide for natural musical pitch transitions)
    if (nodes.oscLeft && layer.leftFreq > 0) {
      nodes.oscLeft.frequency.cancelScheduledValues(now);
      nodes.oscLeft.frequency.setTargetAtTime(Math.max(1, layer.leftFreq), now, 0.025);
      if (nodes.oscLeft.type !== layer.waveform) {
        this.switchWaveformSmoothly(nodes, layer.waveform, targetGain);
      }
    }
    if (nodes.oscRight && layer.rightFreq > 0) {
      nodes.oscRight.frequency.cancelScheduledValues(now);
      nodes.oscRight.frequency.setTargetAtTime(Math.max(1, layer.rightFreq), now, 0.025);
      if (nodes.oscRight.type !== layer.waveform) {
        nodes.oscRight.type = layer.waveform;
      }
    }
    if (nodes.oscCenter && layer.leftFreq > 0) {
      nodes.oscCenter.frequency.cancelScheduledValues(now);
      nodes.oscCenter.frequency.setTargetAtTime(Math.max(1, layer.leftFreq), now, 0.025);
      if (nodes.oscCenter.type !== layer.waveform) {
        this.switchWaveformSmoothly(nodes, layer.waveform, targetGain);
      }
    }

    // 2. Smooth Pan Updates
    if (nodes.panner) {
      const clampedPan = Math.max(-1, Math.min(1, layer.pan));
      nodes.panner.pan.cancelScheduledValues(now);
      nodes.panner.pan.setTargetAtTime(clampedPan, now, 0.025);
    }

    // 3. Smooth Layer Gain Updates
    nodes.layerGain.gain.cancelScheduledValues(now);
    nodes.layerGain.gain.setTargetAtTime(targetGain, now, 0.025);

    // 4. Safe Tremolo / Amplitude Modulation & Auto-Pan
    if (nodes.lfoOsc && nodes.lfoGain) {
      nodes.lfoOsc.frequency.cancelScheduledValues(now);
      nodes.modGain.gain.cancelScheduledValues(now);
      nodes.lfoGain.gain.cancelScheduledValues(now);

      if (layer.modulation.enabled && !isMuted) {
        nodes.lfoOsc.frequency.setTargetAtTime(Math.max(0.01, layer.modulation.rateHz), now, 0.03);
        if (nodes.lfoOsc.type !== layer.modulation.waveform) {
          nodes.lfoOsc.type = layer.modulation.waveform;
        }

        // Clean amplitude modulation: depth D in [0, 1] scales gain strictly between (1 - D) and 1.0
        const depth = Math.max(0, Math.min(1, layer.modulation.depth));
        const baseModGain = 1.0 - (depth * 0.5);
        const lfoAmp = depth * 0.5;

        nodes.modGain.gain.setTargetAtTime(baseModGain, now, 0.025);
        nodes.lfoGain.gain.setTargetAtTime(lfoAmp, now, 0.025);

        if (nodes.lfoPanGain) {
          nodes.lfoPanGain.gain.cancelScheduledValues(now);
          const panDepth = layer.modulation.autoPan ? 0.6 * depth : 0;
          nodes.lfoPanGain.gain.setTargetAtTime(panDepth, now, 0.025);
        }
      } else {
        nodes.modGain.gain.setTargetAtTime(1.0, now, 0.025);
        nodes.lfoGain.gain.setTargetAtTime(0, now, 0.025);
        if (nodes.lfoPanGain) {
          nodes.lfoPanGain.gain.cancelScheduledValues(now);
          nodes.lfoPanGain.gain.setTargetAtTime(0, now, 0.025);
        }
      }
    }
  }

  /**
   * Micro-duck gain during waveform switch to eliminate phase jump clicks.
   */
  private switchWaveformSmoothly(nodes: LayerAudioNodes, newWaveform: WaveformType, targetGain: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    nodes.layerGain.gain.cancelScheduledValues(now);
    nodes.layerGain.gain.setTargetAtTime(0.0001, now, 0.008);
    
    setTimeout(() => {
      if (nodes.oscLeft) nodes.oscLeft.type = newWaveform;
      if (nodes.oscRight) nodes.oscRight.type = newWaveform;
      if (nodes.oscCenter) nodes.oscCenter.type = newWaveform;
      if (this.ctx) {
        const resumeNow = this.ctx.currentTime;
        nodes.layerGain.gain.cancelScheduledValues(resumeNow);
        nodes.layerGain.gain.setTargetAtTime(targetGain, resumeNow, 0.02);
      }
    }, 15);
  }

  /**
   * Rebuilds all active layers on initial play.
   */
  private rebuildAllLayers(layers: AudioLayer[]) {
    this.stopAllOscillators();
    if (!this.ctx || !this.layerSummingGain) return;

    const hasGlobalSolo = layers.some((l) => l.solo && l.enabled);
    for (const layer of layers) {
      if (layer.enabled) {
        this.createAndStartLayer(layer, hasGlobalSolo, 0.05);
      }
    }
  }

  /**
   * Creates audio graph for a single layer with an exponential envelope.
   */
  private createAndStartLayer(layer: AudioLayer, hasGlobalSolo: boolean, fadeInDuration = 0.04) {
    if (!this.ctx || !this.layerSummingGain) return;

    const now = this.ctx.currentTime;
    const isMuted = layer.mute || !layer.enabled || (hasGlobalSolo && !layer.solo);
    const targetGain = isMuted ? 0.00001 : Math.max(0.00001, layer.volume);

    // Layer Master Gain (envelope)
    const layerGain = this.ctx.createGain();
    layerGain.gain.setValueAtTime(0.0001, now);
    layerGain.gain.exponentialRampToValueAtTime(targetGain, now + fadeInDuration);

    // Modulation VCA (for clean tremolo)
    const modGain = this.ctx.createGain();
    const depth = layer.modulation.enabled && !isMuted ? Math.max(0, Math.min(1, layer.modulation.depth)) : 0;
    const baseModGain = 1.0 - (depth * 0.5);
    modGain.gain.setValueAtTime(baseModGain, now);

    // Stereo Panner
    const panner = this.ctx.createStereoPanner();
    const clampedPan = Math.max(-1, Math.min(1, layer.pan));
    panner.pan.setValueAtTime(clampedPan, now);

    const nodes: LayerAudioNodes = {
      layerId: layer.id,
      layerGain,
      modGain,
      panner,
    };

    if (layer.type === 'binaural') {
      // Independent left and right oscillators with ChannelMerger for strict stereo separation
      const merger = this.ctx.createChannelMerger(2);
      nodes.merger = merger;

      const oscLeft = this.ctx.createOscillator();
      oscLeft.type = layer.waveform;
      oscLeft.frequency.setValueAtTime(Math.max(10, layer.leftFreq), now);

      const gainLeft = this.ctx.createGain();
      gainLeft.gain.setValueAtTime(1.0, now);
      oscLeft.connect(gainLeft);
      gainLeft.connect(merger, 0, 0); // Left channel

      const oscRight = this.ctx.createOscillator();
      oscRight.type = layer.waveform;
      oscRight.frequency.setValueAtTime(Math.max(10, layer.rightFreq), now);

      const gainRight = this.ctx.createGain();
      gainRight.gain.setValueAtTime(1.0, now);
      oscRight.connect(gainRight);
      gainRight.connect(merger, 0, 1); // Right channel

      // Routing: Merger -> LayerGain -> ModGain -> Panner -> SummingBus
      merger.connect(layerGain);
      layerGain.connect(modGain);
      modGain.connect(panner);
      panner.connect(this.layerSummingGain);

      oscLeft.start(now);
      oscRight.start(now);

      nodes.oscLeft = oscLeft;
      nodes.oscRight = oscRight;
      nodes.gainLeft = gainLeft;
      nodes.gainRight = gainRight;
    } else {
      // Monaural or ambient layer
      const oscCenter = this.ctx.createOscillator();
      oscCenter.type = layer.waveform;
      oscCenter.frequency.setValueAtTime(Math.max(10, layer.leftFreq), now);

      oscCenter.connect(layerGain);
      layerGain.connect(modGain);
      modGain.connect(panner);
      panner.connect(this.layerSummingGain);

      oscCenter.start(now);
      nodes.oscCenter = oscCenter;
    }

    // Set up LFO Modulator
    const lfoOsc = this.ctx.createOscillator();
    lfoOsc.type = layer.modulation.waveform;
    lfoOsc.frequency.setValueAtTime(Math.max(0.01, layer.modulation.rateHz), now);

    const lfoGain = this.ctx.createGain();
    const lfoAmp = (layer.modulation.enabled && !isMuted) ? depth * 0.5 : 0;
    lfoGain.gain.setValueAtTime(lfoAmp, now);

    lfoOsc.connect(lfoGain);
    lfoGain.connect(modGain.gain);

    // Auto-pan LFO
    const lfoPanGain = this.ctx.createGain();
    const panDepth = (layer.modulation.enabled && layer.modulation.autoPan && !isMuted) ? 0.6 * depth : 0;
    lfoPanGain.gain.setValueAtTime(panDepth, now);
    lfoOsc.connect(lfoPanGain);
    lfoPanGain.connect(panner.pan);

    lfoOsc.start(now);

    nodes.lfoOsc = lfoOsc;
    nodes.lfoGain = lfoGain;
    nodes.lfoPanGain = lfoPanGain;

    this.activeLayerNodes.set(layer.id, nodes);
  }

  /**
   * Graceful exponential ramp down and disposal of a single layer without clicks.
   */
  private fadeAndDisposeLayer(nodes: LayerAudioNodes, fadeDuration = 0.035) {
    if (!this.ctx || nodes.isDisposing) return;
    nodes.isDisposing = true;
    const now = this.ctx.currentTime;

    try {
      nodes.layerGain.gain.cancelScheduledValues(now);
      const currentVal = Math.max(0.0001, nodes.layerGain.gain.value);
      nodes.layerGain.gain.setValueAtTime(currentVal, now);
      nodes.layerGain.gain.exponentialRampToValueAtTime(0.00001, now + fadeDuration);

      const stopTime = now + fadeDuration + 0.015;
      nodes.oscLeft?.stop(stopTime);
      nodes.oscRight?.stop(stopTime);
      nodes.oscCenter?.stop(stopTime);
      nodes.lfoOsc?.stop(stopTime);

      setTimeout(() => {
        try {
          nodes.oscLeft?.disconnect();
          nodes.oscRight?.disconnect();
          nodes.oscCenter?.disconnect();
          nodes.lfoOsc?.disconnect();
          nodes.gainLeft?.disconnect();
          nodes.gainRight?.disconnect();
          nodes.merger?.disconnect();
          nodes.lfoGain?.disconnect();
          nodes.lfoPanGain?.disconnect();
          nodes.modGain?.disconnect();
          nodes.layerGain?.disconnect();
          nodes.panner?.disconnect();
        } catch {
          // ignore
        }
      }, (fadeDuration + 0.05) * 1000);
    } catch {
      // ignore
    }
  }

  /**
   * Stops all active layer oscillators gracefully.
   */
  private stopAllOscillators() {
    for (const [, nodes] of this.activeLayerNodes.entries()) {
      this.fadeAndDisposeLayer(nodes, 0.025);
    }
    this.activeLayerNodes.clear();
  }

  /**
   * Plays a tranquil, soft meditation bell / chime synthesized using harmonic decay oscillators.
   */
  public playSessionEndChime() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const chimeGain = this.ctx.createGain();
      chimeGain.gain.setValueAtTime(0.0001, now);
      chimeGain.gain.exponentialRampToValueAtTime(0.3, now + 0.03);
      chimeGain.gain.exponentialRampToValueAtTime(0.00001, now + 4.2);
      chimeGain.connect(this.ctx.destination);

      // Fundamental harmonic series for singing bowl sound: 432 Hz, 864 Hz, 1296 Hz
      const freqs = [432, 864, 1296, 1728];
      const gains = [0.4, 0.22, 0.1, 0.04];

      freqs.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const partGain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        partGain.gain.setValueAtTime(gains[i], now);
        
        osc.connect(partGain);
        partGain.connect(chimeGain);
        osc.start(now);
        osc.stop(now + 4.5);
      });
    } catch (e) {
      console.warn('Chime playback error:', e);
    }
  }

  public subscribeStateChange(cb: (isPlaying: boolean) => void): () => void {
    this.onStateChangeCallbacks.add(cb);
    return () => this.onStateChangeCallbacks.delete(cb);
  }

  public subscribeError(cb: (err: string) => void): () => void {
    this.onErrorCallbacks.add(cb);
    return () => this.onErrorCallbacks.delete(cb);
  }

  private notifyStateChange() {
    this.onStateChangeCallbacks.forEach((cb) => cb(this.isPlaying));
  }

  private notifyError(err: string) {
    this.onErrorCallbacks.forEach((cb) => cb(err));
  }
}
