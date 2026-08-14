import { useState, useEffect, useCallback } from 'react';
import { SoundPreset, AudioLayer } from '../types';
import { ALL_DEFAULT_PRESETS, CANONICAL_PRESETS } from '../presets/dimenuveisPresets';

const STORAGE_KEY = 'dimenuveis_sound_lab_presets_v1';

export function usePresets() {
  const [presets, setPresets] = useState<SoundPreset[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as SoundPreset[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read presets from localStorage:', e);
    }
    return ALL_DEFAULT_PRESETS;
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
    } catch (e) {
      console.error('Failed to persist presets to localStorage:', e);
    }
  }, [presets]);

  // Save new custom preset
  const savePreset = useCallback((name: string, description: string, layers: AudioLayer[], masterVolume: number): SoundPreset => {
    const newPreset: SoundPreset = {
      id: `custom-preset-${Date.now()}`,
      name: name.trim() || 'Predefinição Pessoal',
      description: description.trim() || 'Configuração personalizada do Laboratório de Som.',
      category: 'custom',
      masterVolume,
      layers: JSON.parse(JSON.stringify(layers)),
      createdAt: new Date().toISOString(),
    };

    setPresets((prev) => [newPreset, ...prev]);
    return newPreset;
  }, []);

  // Update/Rename custom preset
  const updatePreset = useCallback((id: string, updates: Partial<SoundPreset>) => {
    setPresets((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  // Delete preset
  const deletePreset = useCallback((id: string) => {
    setPresets((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // Reset to initial canonical and contemplative presets
  const resetToDefaults = useCallback(() => {
    setPresets(ALL_DEFAULT_PRESETS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ALL_DEFAULT_PRESETS));
    } catch (e) {
      console.warn('Reset presets error:', e);
    }
  }, []);

  // Export all presets or custom presets as JSON
  const exportPresetsJSON = useCallback(() => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(presets, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `laboratorio-dimenuveis-presets-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [presets]);

  // Import presets from JSON
  const importPresetsJSON = useCallback((jsonString: string): { success: boolean; message: string; count?: number } => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) {
        return { success: false, message: 'O arquivo JSON não contém uma lista válida de predefinições.' };
      }

      // Validate presets structure
      const validPresets: SoundPreset[] = parsed.filter(
        (p) => p && typeof p.name === 'string' && Array.isArray(p.layers)
      ).map((p) => ({
        ...p,
        id: p.id || `imported-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        category: p.category || 'custom',
      }));

      if (validPresets.length === 0) {
        return { success: false, message: 'Nenhuma predefinição válida encontrada no arquivo.' };
      }

      setPresets((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newOnes = validPresets.filter((p) => !existingIds.has(p.id));
        return [...newOnes, ...prev];
      });

      return { success: true, message: `${validPresets.length} predefinições importadas com sucesso!`, count: validPresets.length };
    } catch (e) {
      return { success: false, message: 'Erro ao analisar arquivo JSON: Formato inválido.' };
    }
  }, []);

  return {
    presets,
    canonicalPresets: CANONICAL_PRESETS,
    customPresets: presets.filter((p) => p.category === 'custom'),
    contemplativePresets: presets.filter((p) => p.category === 'contemplative'),
    savePreset,
    updatePreset,
    deletePreset,
    resetToDefaults,
    exportPresetsJSON,
    importPresetsJSON,
  };
}
