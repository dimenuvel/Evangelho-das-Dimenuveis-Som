import { useState, useEffect, useCallback, useRef } from 'react';
import { AudioEngine } from '../audio/AudioEngine';
import { AudioLayer, SoundPreset } from '../types';
import { CANONICAL_PRESETS, createBlankLayer } from '../presets/dimenuveisPresets';

/**
 * Custom React hook bridging the UI state with the persistent AudioEngine.
 * AudioContext and the audio node graph are managed centrally in AudioEngine,
 * completely decoupled from React render and re-mount cycles.
 */
export function useAudioEngine(initialPreset: SoundPreset = CANONICAL_PRESETS[0]) {
  // Persistent singleton reference outside React render loop
  const engine = AudioEngine.getInstance();
  const engineRef = useRef<AudioEngine>(engine);

  const [isPlaying, setIsPlaying] = useState<boolean>(() => engine.getIsPlaying());
  const [masterVolume, setMasterVolumeState] = useState<number>(initialPreset.masterVolume || 0.7);
  const [layers, setLayersState] = useState<AudioLayer[]>(initialPreset.layers);
  const [currentPreset, setCurrentPreset] = useState<SoundPreset>(initialPreset);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Keep a stable ref to layers for async operations and uninterrupted callbacks
  const layersRef = useRef<AudioLayer[]>(layers);
  layersRef.current = layers;

  // Subscribe to audio engine events
  useEffect(() => {
    const eng = engineRef.current;
    const unsubState = eng.subscribeStateChange((playing) => {
      setIsPlaying(playing);
    });
    const unsubErr = eng.subscribeError((err) => {
      setErrorMessage(err);
    });

    return () => {
      unsubState();
      unsubErr();
    };
  }, []);

  // Update master volume with smooth exponential target curve
  const setMasterVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setMasterVolumeState(clamped);
    engineRef.current.setMasterVolume(clamped);
  }, []);

  // Update layers and dispatch parameter curves to active nodes
  const setLayers = useCallback((newLayersOrUpdater: AudioLayer[] | ((prev: AudioLayer[]) => AudioLayer[])) => {
    setLayersState((prev) => {
      const next = typeof newLayersOrUpdater === 'function' ? newLayersOrUpdater(prev) : newLayersOrUpdater;
      engineRef.current.updateLayers(next);
      return next;
    });
  }, []);

  // Start playback with smooth fade-in envelope
  const play = useCallback(async (fadeInSec = 0.4) => {
    setErrorMessage(null);
    const success = await engineRef.current.play(layersRef.current, fadeInSec);
    if (!success) {
      setErrorMessage('Não foi possível iniciar o áudio. Toque na tela para conceder permissão de áudio.');
    }
  }, []);

  // Pause playback with smooth exponential fade-out
  const pause = useCallback((fadeOutSec = 0.25, onComplete?: () => void) => {
    engineRef.current.pause(fadeOutSec, onComplete);
  }, []);

  // Toggle playback safely
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause(0.2);
    } else {
      play(0.4);
    }
  }, [isPlaying, pause, play]);

  // Load a complete preset with stable layer identity for smooth pitch glides
  const loadPreset = useCallback((preset: SoundPreset, autoPlayIfRunning = false) => {
    setCurrentPreset(preset);
    // Retain stable layer IDs for smooth parameter morphing instead of node rebuild
    const newLayers = preset.layers.map((l, index) => ({
      ...l,
      id: l.id || `preset-layer-${preset.id}-${index}`,
    }));
    
    setLayersState(newLayers);
    setMasterVolumeState(preset.masterVolume ?? 0.7);
    engineRef.current.setMasterVolume(preset.masterVolume ?? 0.7);
    
    if (isPlaying || autoPlayIfRunning) {
      engineRef.current.updateLayers(newLayers);
    }
  }, [isPlaying]);

  // Layer manipulation helpers
  const updateLayer = useCallback((layerId: string, partial: Partial<AudioLayer>) => {
    setLayers((prev) =>
      prev.map((l) => {
        if (l.id !== layerId) return l;
        return {
          ...l,
          ...partial,
          modulation: partial.modulation ? { ...l.modulation, ...partial.modulation } : l.modulation,
        };
      })
    );
  }, [setLayers]);

  const addLayer = useCallback(() => {
    setLayers((prev) => {
      const newLayer = createBlankLayer(`Camada ${prev.length + 1}`, prev.length);
      return [...prev, newLayer];
    });
  }, [setLayers]);

  const removeLayer = useCallback((layerId: string) => {
    setLayers((prev) => prev.filter((l) => l.id !== layerId));
  }, [setLayers]);

  const duplicateLayer = useCallback((layerId: string) => {
    setLayers((prev) => {
      const target = prev.find((l) => l.id === layerId);
      if (!target) return prev;
      const clone: AudioLayer = {
        ...target,
        id: `layer-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: `${target.name} (Cópia)`,
      };
      return [...prev, clone];
    });
  }, [setLayers]);

  const toggleLayerMute = useCallback((layerId: string) => {
    setLayers((prev) => prev.map((l) => (l.id === layerId ? { ...l, mute: !l.mute } : l)));
  }, [setLayers]);

  const toggleLayerSolo = useCallback((layerId: string) => {
    setLayers((prev) => prev.map((l) => (l.id === layerId ? { ...l, solo: !l.solo } : l)));
  }, [setLayers]);

  const toggleLayerEnabled = useCallback((layerId: string) => {
    setLayers((prev) => prev.map((l) => (l.id === layerId ? { ...l, enabled: !l.enabled } : l)));
  }, [setLayers]);

  return {
    engine: engineRef.current,
    isPlaying,
    masterVolume,
    setMasterVolume,
    layers,
    setLayers,
    currentPreset,
    loadPreset,
    play,
    pause,
    togglePlay,
    updateLayer,
    addLayer,
    removeLayer,
    duplicateLayer,
    toggleLayerMute,
    toggleLayerSolo,
    toggleLayerEnabled,
    errorMessage,
    clearError: () => setErrorMessage(null),
  };
}
