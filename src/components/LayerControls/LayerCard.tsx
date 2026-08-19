import React, { useState } from 'react';
import { AudioLayer, WaveformType, LayerType } from '../../types';
import { calculateBeatDifference, getBeatBandInfo, HARMONIC_PRESETS } from '../../audio/audioMath';
import {
  Volume2,
  Sliders,
  Copy,
  Trash2,
  Waves,
  Activity,
  Check,
  Edit2,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface LayerCardProps {
  layer: AudioLayer;
  index: number;
  totalLayers: number;
  onUpdate: (id: string, partial: Partial<AudioLayer>) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleMute: (id: string) => void;
  onToggleSolo: (id: string) => void;
  onToggleEnabled: (id: string) => void;
}

export const LayerCard: React.FC<LayerCardProps> = ({
  layer,
  index,
  totalLayers,
  onUpdate,
  onRemove,
  onDuplicate,
  onToggleMute,
  onToggleSolo,
  onToggleEnabled,
}) => {
  const { t, isEnglish } = useLanguage();
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(layer.name);
  const [bpmInputMode, setBpmInputMode] = useState(false);

  const beatDiff = layer.type === 'binaural' ? calculateBeatDifference(layer.leftFreq, layer.rightFreq) : 0;
  const beatInfo = getBeatBandInfo(beatDiff);

  const getLocalizedBandName = () => {
    if (beatDiff === 0) return t.bands.unison.name;
    if (beatDiff < 4) return t.bands.delta.name;
    if (beatDiff < 8) return t.bands.theta.name;
    if (beatDiff < 14) return t.bands.alpha.name;
    if (beatDiff < 30) return t.bands.beta.name;
    return t.bands.gamma.name;
  };

  const handleNameSave = () => {
    setIsEditingName(false);
    if (nameInput.trim()) {
      onUpdate(layer.id, { name: nameInput.trim() });
    } else {
      setNameInput(layer.name);
    }
  };

  const adjustFreq = (channel: 'left' | 'right' | 'both', delta: number) => {
    if (channel === 'left') {
      const next = Math.max(20, Math.min(2000, Math.round((layer.leftFreq + delta) * 100) / 100));
      onUpdate(layer.id, { leftFreq: next });
    } else if (channel === 'right') {
      const next = Math.max(20, Math.min(2000, Math.round((layer.rightFreq + delta) * 100) / 100));
      onUpdate(layer.id, { rightFreq: next });
    } else {
      const nextL = Math.max(20, Math.min(2000, Math.round((layer.leftFreq + delta) * 100) / 100));
      const nextR = Math.max(20, Math.min(2000, Math.round((layer.rightFreq + delta) * 100) / 100));
      onUpdate(layer.id, { leftFreq: nextL, rightFreq: nextR });
    }
  };

  const setHarmonicFreq = (hz: number) => {
    if (layer.type === 'binaural') {
      const currentDiff = Math.abs(layer.rightFreq - layer.leftFreq) || 6;
      onUpdate(layer.id, { leftFreq: hz, rightFreq: Math.round((hz + currentDiff) * 100) / 100 });
    } else {
      onUpdate(layer.id, { leftFreq: hz, rightFreq: hz });
    }
  };

  return (
    <div
      id={`layer-card-${layer.id}`}
      className={`bg-[#141210] border transition-all shadow-md overflow-hidden ${
        layer.enabled
          ? layer.solo
            ? 'border-[#C5A059] ring-1 ring-[#C5A059]/40'
            : 'border-[#C5A05933]'
          : 'border-[#C5A05911] opacity-50'
      }`}
    >
      {/* 1. Header Bar */}
      <div className="bg-[#1A1614] px-3 sm:px-4 py-2.5 sm:py-3 border-b border-[#C5A05922] flex items-center justify-between gap-2 sm:gap-3">
        
        {/* Left: Layer Number, Enable & Name */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 overflow-hidden">
          <input
            id={`layer-enable-check-${layer.id}`}
            type="checkbox"
            checked={layer.enabled}
            onChange={() => onToggleEnabled(layer.id)}
            title={layer.enabled ? (isEnglish ? 'Disable Layer' : 'Desativar Camada') : (isEnglish ? 'Enable Layer' : 'Ativar Camada')}
            className="w-4 h-4 accent-[#C5A059] cursor-pointer shrink-0"
          />

          <span className="w-5 h-5 sm:w-6 sm:h-6 border border-[#C5A05944] bg-[#0F0E0D] text-[#C5A059] text-[9px] sm:text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
            0{index + 1}
          </span>

          {isEditingName ? (
            <div className="flex items-center gap-1 min-w-0 flex-1">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onBlur={handleNameSave}
                onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                autoFocus
                className="bg-[#0F0E0D] text-xs font-serif italic text-[#C5A059] px-2 py-0.5 border border-[#C5A059] outline-none min-w-0 w-full max-w-[200px]"
              />
              <button onClick={handleNameSave} className="text-[#C5A059] p-1 shrink-0">
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => setIsEditingName(true)}
              className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group min-w-0 flex-1 overflow-hidden"
              title={isEnglish ? 'Click to rename' : 'Clique para renomear'}
            >
              <h4 className="text-xs sm:text-sm font-serif italic text-[#D4CBBF] group-hover:text-[#C5A059] transition-colors truncate">
                {layer.name}
              </h4>
              <Edit2 className="w-3 h-3 text-[#D4CBBF]/40 group-hover:text-[#C5A059] transition-colors shrink-0" />
            </div>
          )}
        </div>

        {/* Right: Quick Actions (Solo, Mute, Clone, Delete) */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Solo Button */}
          <button
            id={`layer-solo-btn-${layer.id}`}
            onClick={() => onToggleSolo(layer.id)}
            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-colors shrink-0 ${
              layer.solo
                ? 'bg-[#C5A059] text-[#0F0E0D]'
                : 'bg-[#0F0E0D] border border-[#C5A05933] text-[#D4CBBF]/60 hover:text-[#C5A059] hover:border-[#C5A059]'
            }`}
            title={isEnglish ? 'Solo (listen only to this layer)' : 'Solo (ouvir apenas esta camada)'}
          >
            SOLO
          </button>

          {/* Mute Button */}
          <button
            id={`layer-mute-btn-${layer.id}`}
            onClick={() => onToggleMute(layer.id)}
            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-colors shrink-0 ${
              layer.mute
                ? 'bg-red-900/80 text-red-200 border border-red-700'
                : 'bg-[#0F0E0D] border border-[#C5A05933] text-[#D4CBBF]/60 hover:text-[#C5A059] hover:border-[#C5A059]'
            }`}
            title={isEnglish ? 'Mute (silence layer)' : 'Mudo (silenciar camada)'}
          >
            MUTE
          </button>

          {/* Duplicate */}
          <button
            id={`layer-clone-btn-${layer.id}`}
            onClick={() => onDuplicate(layer.id)}
            className="p-1 sm:p-1.5 bg-[#0F0E0D] border border-[#C5A05933] text-[#D4CBBF]/60 hover:text-[#C5A059] hover:border-[#C5A059] transition-colors shrink-0"
            title={isEnglish ? 'Duplicate Layer' : 'Duplicar Camada'}
          >
            <Copy className="w-3 h-3" />
          </button>

          {/* Delete (if more than 1 layer) */}
          {totalLayers > 1 && (
            <button
              id={`layer-delete-btn-${layer.id}`}
              onClick={() => onRemove(layer.id)}
              className="p-1 sm:p-1.5 bg-[#0F0E0D] border border-[#C5A05933] text-[#D4CBBF]/60 hover:text-red-400 hover:border-red-500/50 transition-colors shrink-0"
              title={isEnglish ? 'Delete Layer' : 'Excluir Camada'}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Body: Frequency Controls & Audio Architecture */}
      <div className="p-4 sm:p-5 space-y-4 text-xs">
        
        {/* Layer Type & Waveform Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#C5A05922]">
          
          {/* Layer Type */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-[#D4CBBF] opacity-60 shrink-0">{t.layerCard.type}:</span>
            <select
              id={`layer-type-select-${layer.id}`}
              value={layer.type}
              onChange={(e) => onUpdate(layer.id, { type: e.target.value as LayerType })}
              className="bg-[#0F0E0D] text-[#C5A059] px-2.5 py-1 border border-[#C5A05933] text-xs uppercase tracking-wider outline-none cursor-pointer w-full sm:w-auto"
            >
              <option value="binaural">{t.layerCard.binauralPair}</option>
              <option value="monaural">{t.layerCard.monauralTone}</option>
              <option value="ambient">{t.layerCard.ambientTexture}</option>
            </select>
          </div>

          {/* Waveform Selector */}
          <div className="flex items-center gap-2 max-w-full overflow-hidden">
            <span className="text-[10px] uppercase tracking-widest text-[#D4CBBF] opacity-60 shrink-0">{t.layerCard.waveform}:</span>
            <div className="grid grid-cols-4 bg-[#0F0E0D] p-0.5 border border-[#C5A05933] gap-0.5 w-full sm:w-auto">
              {(['sine', 'triangle', 'square', 'sawtooth'] as WaveformType[]).map((w) => {
                const labels: Record<WaveformType, string> = {
                  sine: t.layerCard.sine,
                  triangle: t.layerCard.triangle,
                  square: t.layerCard.square,
                  sawtooth: t.layerCard.sawtooth,
                };
                return (
                  <button
                    key={w}
                    id={`layer-waveform-${layer.id}-${w}`}
                    type="button"
                    onClick={() => onUpdate(layer.id, { waveform: w })}
                    title={`${labels[w]} (${w})`}
                    className={`px-1.5 sm:px-2 py-1 text-[9px] sm:text-[10px] uppercase tracking-wider transition-colors text-center truncate ${
                      layer.waveform === w
                        ? 'bg-[#C5A059] text-[#0F0E0D] font-bold shadow-sm'
                        : 'text-[#D4CBBF] opacity-60 hover:opacity-100 hover:text-[#C5A059]'
                    }`}
                  >
                    {labels[w]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Frequencies Section */}
        {layer.type === 'binaural' ? (
          <div className="space-y-3 bg-[#1A1614] p-4 border border-[#C5A05933]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Left Channel */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] uppercase tracking-widest text-[#D4CBBF] opacity-70 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                    {t.layerCard.leftChannel}
                  </span>
                  <span className="font-mono font-bold text-[#C5A059]">{layer.leftFreq.toFixed(1)} Hz</span>
                </div>

                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="0.1"
                  value={layer.leftFreq}
                  onChange={(e) => onUpdate(layer.id, { leftFreq: parseFloat(e.target.value) })}
                  className="w-full accent-[#C5A059] cursor-pointer"
                />

                {/* Step buttons */}
                <div className="flex items-center justify-between gap-1 text-[10px] font-mono">
                  <button onClick={() => adjustFreq('left', -10)} className="px-1.5 py-0.5 bg-[#0F0E0D] text-[#D4CBBF]/70 hover:text-[#C5A059] border border-[#C5A05933]">-10</button>
                  <button onClick={() => adjustFreq('left', -1)} className="px-1.5 py-0.5 bg-[#0F0E0D] text-[#D4CBBF]/70 hover:text-[#C5A059] border border-[#C5A05933]">-1</button>
                  <button onClick={() => adjustFreq('left', -0.1)} className="px-1.5 py-0.5 bg-[#0F0E0D] text-[#D4CBBF]/70 hover:text-[#C5A059] border border-[#C5A05933]">-0.1</button>
                  <button onClick={() => adjustFreq('left', 0.1)} className="px-1.5 py-0.5 bg-[#0F0E0D] text-[#D4CBBF]/70 hover:text-[#C5A059] border border-[#C5A05933]">+0.1</button>
                  <button onClick={() => adjustFreq('left', 1)} className="px-1.5 py-0.5 bg-[#0F0E0D] text-[#D4CBBF]/70 hover:text-[#C5A059] border border-[#C5A05933]">+1</button>
                  <button onClick={() => adjustFreq('left', 10)} className="px-1.5 py-0.5 bg-[#0F0E0D] text-[#D4CBBF]/70 hover:text-[#C5A059] border border-[#C5A05933]">+10</button>
                </div>
              </div>

              {/* Right Channel */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] uppercase tracking-widest text-[#D4CBBF] opacity-70 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                    {t.layerCard.rightChannel}
                  </span>
                  <span className="font-mono font-bold text-[#C5A059]">{layer.rightFreq.toFixed(1)} Hz</span>
                </div>

                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="0.1"
                  value={layer.rightFreq}
                  onChange={(e) => onUpdate(layer.id, { rightFreq: parseFloat(e.target.value) })}
                  className="w-full accent-[#C5A059] cursor-pointer"
                />

                {/* Step buttons */}
                <div className="flex items-center justify-between gap-1 text-[10px] font-mono">
                  <button onClick={() => adjustFreq('right', -10)} className="px-1.5 py-0.5 bg-[#0F0E0D] text-[#D4CBBF]/70 hover:text-[#C5A059] border border-[#C5A05933]">-10</button>
                  <button onClick={() => adjustFreq('right', -1)} className="px-1.5 py-0.5 bg-[#0F0E0D] text-[#D4CBBF]/70 hover:text-[#C5A059] border border-[#C5A05933]">-1</button>
                  <button onClick={() => adjustFreq('right', -0.1)} className="px-1.5 py-0.5 bg-[#0F0E0D] text-[#D4CBBF]/70 hover:text-[#C5A059] border border-[#C5A05933]">-0.1</button>
                  <button onClick={() => adjustFreq('right', 0.1)} className="px-1.5 py-0.5 bg-[#0F0E0D] text-[#D4CBBF]/70 hover:text-[#C5A059] border border-[#C5A05933]">+0.1</button>
                  <button onClick={() => adjustFreq('right', 1)} className="px-1.5 py-0.5 bg-[#0F0E0D] text-[#D4CBBF]/70 hover:text-[#C5A059] border border-[#C5A05933]">+1</button>
                  <button onClick={() => adjustFreq('right', 10)} className="px-1.5 py-0.5 bg-[#0F0E0D] text-[#D4CBBF]/70 hover:text-[#C5A059] border border-[#C5A05933]">+10</button>
                </div>
              </div>

            </div>

            {/* Calculated Binaural Difference Capsule */}
            <div className="pt-2 border-t border-[#C5A05922] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-[#D4CBBF] opacity-60">{t.layerCard.binauralBeatLabel}:</span>
                <span className="font-mono font-bold text-sm text-[#C5A059]">
                  {beatDiff.toFixed(2)} Hz
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] bg-[#0F0E0D] px-2.5 py-0.5 border border-[#C5A05933]">
                {getLocalizedBandName()}
              </span>
            </div>
          </div>
        ) : (
          /* Single Frequency Slider for Monaural / Texture */
          <div className="space-y-2 bg-[#1A1614] p-4 border border-[#C5A05933]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] uppercase tracking-widest text-[#D4CBBF] opacity-60">{t.layerCard.centerFrequency}</span>
              <span className="font-mono font-bold text-[#C5A059]">{layer.leftFreq.toFixed(1)} Hz</span>
            </div>
            <input
              type="range"
              min="20"
              max="1500"
              step="0.5"
              value={layer.leftFreq}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onUpdate(layer.id, { leftFreq: val, rightFreq: val });
              }}
              className="w-full accent-[#C5A059] cursor-pointer"
            />
          </div>
        )}

        {/* Quick Harmonic Reference Buttons */}
        <div className="space-y-1.5">
          <span className="text-[9px] text-[#C5A059] uppercase tracking-[0.2em] font-semibold">
            {t.layerCard.harmonicReference}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {HARMONIC_PRESETS.slice(0, 5).map((h) => (
              <button
                key={h.freq}
                type="button"
                onClick={() => setHarmonicFreq(h.freq)}
                className="px-2.5 py-1 bg-[#0F0E0D] hover:bg-[#1A1614] text-[#C5A059] text-[10px] font-mono border border-[#C5A05933] hover:border-[#C5A059] transition-colors"
                title={h.desc}
              >
                {h.freq} Hz
              </button>
            ))}
          </div>
        </div>

        {/* Volume & Pan Strips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Volume */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] uppercase tracking-widest text-[#D4CBBF] opacity-60 flex items-center gap-1.5">
                <Volume2 className="w-3 h-3 text-[#C5A059]" />
                {t.layerCard.layerVolume}
              </span>
              <span className="font-mono text-[#C5A059]">{Math.round(layer.volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={layer.volume}
              onChange={(e) => onUpdate(layer.id, { volume: parseFloat(e.target.value) })}
              className="w-full accent-[#C5A059] cursor-pointer"
            />
          </div>

          {/* Pan */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] uppercase tracking-widest text-[#D4CBBF] opacity-60">{t.layerCard.stereoPan}</span>
              <span className="font-mono text-[#C5A059]">
                {layer.pan === 0
                  ? (isEnglish ? 'Center' : 'Centro')
                  : layer.pan < 0
                  ? `${isEnglish ? 'Left' : 'Esq'} ${Math.abs(Math.round(layer.pan * 100))}%`
                  : `${isEnglish ? 'Right' : 'Dir'} ${Math.round(layer.pan * 100)}%`}
              </span>
            </div>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.05"
              value={layer.pan}
              onChange={(e) => onUpdate(layer.id, { pan: parseFloat(e.target.value) })}
              className="w-full accent-[#C5A059] cursor-pointer"
            />
          </div>
        </div>

        {/* 3. Rhythm & Pulse Modulation Section */}
        <div className="bg-[#1A1614] p-4 border border-[#C5A05933] space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={layer.modulation.enabled}
                onChange={(e) =>
                  onUpdate(layer.id, {
                    modulation: { ...layer.modulation, enabled: e.target.checked },
                  })
                }
                className="w-3.5 h-3.5 accent-[#C5A059]"
              />
              <span className="text-xs uppercase tracking-wider font-semibold text-[#D4CBBF] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#C5A059]" />
                {t.layerCard.rhythmicModulation}
              </span>
            </label>

            {layer.modulation.enabled && (
              <button
                type="button"
                onClick={() => setBpmInputMode(!bpmInputMode)}
                className="text-[10px] uppercase tracking-wider text-[#C5A059] hover:underline"
              >
                {bpmInputMode ? (isEnglish ? 'Switch to Hz' : 'Alternar para Hz') : (isEnglish ? 'Switch to BPM' : 'Alternar para BPM')}
              </button>
            )}
          </div>

          {layer.modulation.enabled && (
            <div className="space-y-3 pt-1 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Rate Hz / BPM */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] uppercase tracking-widest text-[#D4CBBF] opacity-60">
                      {bpmInputMode ? (isEnglish ? 'Cadence (BPM)' : 'Cadência (BPM)') : (isEnglish ? 'Pulse Frequency (Hz)' : 'Frequência do Pulso (Hz)')}
                    </span>
                    <span className="font-mono text-[#C5A059]">
                      {bpmInputMode
                        ? `${Math.round(layer.modulation.rateHz * 60)} BPM`
                        : `${layer.modulation.rateHz.toFixed(2)} Hz`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={bpmInputMode ? '2' : '0.05'}
                    max={bpmInputMode ? '180' : '15'}
                    step={bpmInputMode ? '1' : '0.05'}
                    value={bpmInputMode ? Math.round(layer.modulation.rateHz * 60) : layer.modulation.rateHz}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      const rate = bpmInputMode ? val / 60 : val;
                      onUpdate(layer.id, {
                        modulation: {
                          ...layer.modulation,
                          rateHz: rate,
                          bpm: Math.round(rate * 60),
                        },
                      });
                    }}
                    className="w-full accent-[#C5A059] cursor-pointer"
                  />
                </div>

                {/* Depth */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] uppercase tracking-widest text-[#D4CBBF] opacity-60">{t.layerCard.depth}</span>
                    <span className="font-mono text-[#C5A059]">
                      {Math.round(layer.modulation.depth * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={layer.modulation.depth}
                    onChange={(e) =>
                      onUpdate(layer.id, {
                        modulation: {
                          ...layer.modulation,
                          depth: parseFloat(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-[#C5A059] cursor-pointer"
                  />
                </div>
              </div>

              {/* Mode: Continuous vs Pulse, Auto-pan */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#C5A05922] text-[10px] uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#D4CBBF] opacity-60">{t.layerCard.type}:</span>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdate(layer.id, {
                        modulation: { ...layer.modulation, mode: 'continuous' },
                      })
                    }
                    className={`px-2 py-1 border transition-colors ${
                      layer.modulation.mode === 'continuous'
                        ? 'bg-[#C5A059] text-[#0F0E0D] font-bold border-[#C5A059]'
                        : 'bg-[#0F0E0D] border-[#C5A05933] text-[#D4CBBF] hover:border-[#C5A059]'
                    }`}
                  >
                    {t.layerCard.continuous}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdate(layer.id, {
                        modulation: { ...layer.modulation, mode: 'pulse' },
                      })
                    }
                    className={`px-2 py-1 border transition-colors ${
                      layer.modulation.mode === 'pulse'
                        ? 'bg-[#C5A059] text-[#0F0E0D] font-bold border-[#C5A059]'
                        : 'bg-[#0F0E0D] border-[#C5A05933] text-[#D4CBBF] hover:border-[#C5A059]'
                    }`}
                  >
                    {t.layerCard.pulsed}
                  </button>
                </div>

                <label className="flex items-center gap-1.5 cursor-pointer text-[#D4CBBF] opacity-80 hover:opacity-100">
                  <input
                    type="checkbox"
                    checked={layer.modulation.autoPan}
                    onChange={(e) =>
                      onUpdate(layer.id, {
                        modulation: { ...layer.modulation, autoPan: e.target.checked },
                      })
                    }
                    className="w-3 h-3 accent-[#C5A059]"
                  />
                  <span>{t.layerCard.autoPan}</span>
                </label>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};

