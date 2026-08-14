export type WaveformType = 'sine' | 'triangle' | 'square' | 'sawtooth';

export type ModulationMode = 'continuous' | 'pulse';

export type LayerType = 'binaural' | 'monaural' | 'ambient';

export type VisualizerMode = 'spiral' | 'circles' | 'mirror' | 'waveform' | 'off';

export interface ModulationConfig {
  enabled: boolean;
  rateHz: number; // Modulation frequency in Hz (0.05 Hz to 30 Hz)
  bpm: number; // Derived or synchronized BPM (rateHz * 60)
  depth: number; // 0.0 to 1.0 (0% to 100%)
  waveform: WaveformType;
  mode: ModulationMode;
  autoPan: boolean; // Stereo auto-pan modulation
}

export interface AudioLayer {
  id: string;
  name: string;
  type: LayerType;
  enabled: boolean;
  leftFreq: number; // In Hz
  rightFreq: number; // In Hz (for monaural, leftFreq = rightFreq)
  waveform: WaveformType;
  volume: number; // 0.0 to 1.0
  pan: number; // -1.0 (left) to 1.0 (right)
  mute: boolean;
  solo: boolean;
  modulation: ModulationConfig;
  color?: string;
  dimenuvelId?: number; // 1 to 7 if linked to a Dimenúvel
}

export interface DimenúvelInfo {
  id: number;
  name: string; // Silêncio, Visão, Mente, Coração, Vontade, Energia, Matéria
  subtitle: string;
  symbol: string;
  color: string;
  accentColor: string;
  description: string;
  contemplativeFocus: string;
  suggestedBaseFreq: number;
  suggestedBeatFreq: number;
}

export interface SoundPreset {
  id: string;
  name: string;
  dimenuvelId?: number;
  description: string;
  category: 'canonical' | 'contemplative' | 'custom';
  masterVolume: number;
  layers: AudioLayer[];
  createdAt?: string;
  isDefault?: boolean;
}

export interface SessionState {
  isActive: boolean;
  isPaused: boolean;
  totalDurationSeconds: number;
  remainingSeconds: number;
  fadeInDuration: number; // In seconds
  fadeOutDuration: number; // In seconds
  isFadingOut: boolean;
}
