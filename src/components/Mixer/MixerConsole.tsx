import React from 'react';
import { AudioLayer } from '../../types';
import { ShieldCheck, Sliders } from 'lucide-react';

interface MixerConsoleProps {
  layers: AudioLayer[];
  masterVolume: number;
  onMasterVolumeChange: (vol: number) => void;
  onUpdateLayer: (id: string, partial: Partial<AudioLayer>) => void;
  onToggleMute: (id: string) => void;
  onToggleSolo: (id: string) => void;
  onToggleEnabled: (id: string) => void;
  isPlaying: boolean;
}

export const MixerConsole: React.FC<MixerConsoleProps> = ({
  layers,
  masterVolume,
  onMasterVolumeChange,
  onUpdateLayer,
  onToggleMute,
  onToggleSolo,
  onToggleEnabled,
  isPlaying,
}) => {
  const hasSolo = layers.some((l) => l.solo && l.enabled);

  return (
    <div id="mixer-console-container" className="bg-[#141210] border border-[#C5A05933] p-5 sm:p-6 space-y-6 shadow-xl">
      
      {/* Mixer Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#C5A05922] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-[#C5A05944] bg-[#1A1614] flex items-center justify-center text-[#C5A059]">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-serif italic text-[#C5A059]">
              Console de Mixagem Acústica
            </h3>
            <p className="text-[11px] text-[#D4CBBF] opacity-70">
              Controle individual de ganho, balanço estéreo e barramento de soma com limitador suave
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] uppercase font-mono tracking-widest text-[#C5A059] bg-[#1A1614] px-3 py-1.5 border border-[#C5A05933]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Proteção Anti-Clipping Ativa</span>
        </div>
      </div>

      {/* Mixer Channel Strips Layout */}
      <div className="overflow-x-auto pb-3">
        <div className="flex items-stretch gap-3 min-w-max">
          
          {/* Individual Layer Channel Strips */}
          {layers.map((layer, index) => {
            const isAudible = layer.enabled && !layer.mute && (!hasSolo || layer.solo);
            const peakLevelPercent = isPlaying && isAudible ? Math.round(layer.volume * 85 + Math.random() * 10) : 0;

            return (
              <div
                key={layer.id}
                id={`mixer-strip-${layer.id}`}
                className={`w-36 bg-[#1A1614] border p-3 flex flex-col justify-between space-y-3 transition-all ${
                  layer.enabled
                    ? layer.solo
                      ? 'border-[#C5A059] ring-1 ring-[#C5A059]/50'
                      : 'border-[#C5A05933]'
                    : 'border-[#C5A05911] opacity-50'
                }`}
              >
                {/* Strip Header */}
                <div className="space-y-1 text-center border-b border-[#C5A05922] pb-2">
                  <span className="w-5 h-5 mx-auto border border-[#C5A05944] bg-[#0F0E0D] text-[#C5A059] text-[9px] font-mono font-bold flex items-center justify-center">
                    0{index + 1}
                  </span>
                  <h4 className="text-[11px] font-serif italic text-[#D4CBBF] truncate" title={layer.name}>
                    {layer.name}
                  </h4>
                  <span className="text-[9px] text-[#C5A059] font-mono block truncate opacity-80">
                    {layer.type === 'binaural'
                      ? `${layer.leftFreq.toFixed(1)} / ${layer.rightFreq.toFixed(1)} Hz`
                      : `${layer.leftFreq.toFixed(1)} Hz`}
                  </span>
                </div>

                {/* Pan Slider */}
                <div className="space-y-1 text-center bg-[#0F0E0D] p-2 border border-[#C5A05922]">
                  <span className="text-[8px] uppercase tracking-widest text-[#D4CBBF] opacity-60 block">Pan</span>
                  <input
                    type="range"
                    min="-1"
                    max="1"
                    step="0.05"
                    value={layer.pan}
                    onChange={(e) => onUpdateLayer(layer.id, { pan: parseFloat(e.target.value) })}
                    className="w-full accent-[#C5A059] cursor-pointer h-1"
                  />
                  <span className="text-[9px] font-mono text-[#C5A059] block">
                    {layer.pan === 0
                      ? 'C'
                      : layer.pan < 0
                      ? `L${Math.abs(Math.round(layer.pan * 100))}`
                      : `R${Math.round(layer.pan * 100)}`}
                  </span>
                </div>

                {/* Vertical Fader & VU Meter */}
                <div className="flex items-center justify-center gap-3 py-1">
                  {/* Vertical Volume Slider */}
                  <div className="h-32 flex items-center">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={layer.volume}
                      onChange={(e) => onUpdateLayer(layer.id, { volume: parseFloat(e.target.value) })}
                      aria-label={`Volume da Camada ${layer.name}`}
                      className="accent-[#C5A059] cursor-pointer h-28"
                      style={{
                        writingMode: 'vertical-lr',
                        direction: 'rtl',
                        width: '24px',
                      }}
                    />
                  </div>

                  {/* Simulated VU Meter Bar */}
                  <div className="w-1.5 h-28 bg-[#0F0E0D] overflow-hidden flex flex-col justify-end p-px border border-[#C5A05933]">
                    <div
                      className="w-full transition-all duration-75"
                      style={{
                        height: `${peakLevelPercent}%`,
                        backgroundColor:
                          peakLevelPercent > 80
                            ? '#ef4444'
                            : peakLevelPercent > 50
                            ? '#C5A059'
                            : '#8A7A59',
                      }}
                    />
                  </div>
                </div>

                {/* Volume Readout */}
                <div className="text-center">
                  <span className="font-mono text-[10px] text-[#C5A059] bg-[#0F0E0D] px-2 py-0.5 border border-[#C5A05933]">
                    {Math.round(layer.volume * 100)}%
                  </span>
                </div>

                {/* Solo / Mute Buttons */}
                <div className="grid grid-cols-2 gap-1 pt-1">
                  <button
                    onClick={() => onToggleSolo(layer.id)}
                    className={`py-1 text-[9px] font-bold uppercase tracking-wider transition-colors ${
                      layer.solo
                        ? 'bg-[#C5A059] text-[#0F0E0D]'
                        : 'bg-[#0F0E0D] border border-[#C5A05933] text-[#D4CBBF] opacity-70 hover:opacity-100 hover:border-[#C5A059]'
                    }`}
                  >
                    Solo
                  </button>
                  <button
                    onClick={() => onToggleMute(layer.id)}
                    className={`py-1 text-[9px] font-bold uppercase tracking-wider transition-colors ${
                      layer.mute
                        ? 'bg-red-900/80 text-red-200 border border-red-700'
                        : 'bg-[#0F0E0D] border border-[#C5A05933] text-[#D4CBBF] opacity-70 hover:opacity-100 hover:border-[#C5A059]'
                    }`}
                  >
                    Mute
                  </button>
                </div>

                {/* Enable Checkbox */}
                <button
                  onClick={() => onToggleEnabled(layer.id)}
                  className={`w-full py-1 text-[9px] uppercase tracking-wider font-medium border transition-colors flex items-center justify-center gap-1 ${
                    layer.enabled
                      ? 'bg-[#1A1614] text-[#C5A059] border-[#C5A059]'
                      : 'bg-[#0F0E0D] text-[#D4CBBF] opacity-40 border-[#C5A05922]'
                  }`}
                >
                  {layer.enabled ? 'Ativa' : 'Inativa'}
                </button>

              </div>
            );
          })}

          {/* Master Bus Channel Strip */}
          <div
            id="mixer-strip-master"
            className="w-40 bg-[#1A1614] border border-[#C5A059] p-3.5 flex flex-col justify-between space-y-3 shadow-2xl"
          >
            {/* Master Strip Header */}
            <div className="space-y-1 text-center border-b border-[#C5A05933] pb-2">
              <span className="w-5 h-5 mx-auto border border-[#C5A059] bg-[#C5A059] text-[#0F0E0D] text-[10px] font-mono font-bold flex items-center justify-center">
                M
              </span>
              <h4 className="text-xs font-serif italic text-[#C5A059]">
                Master Geral
              </h4>
              <span className="text-[8px] text-[#C5A059] uppercase font-semibold tracking-[0.2em] block">
                Saída Estéreo
              </span>
            </div>

            {/* Limiter / Dynamics Indicator */}
            <div className="bg-[#0F0E0D] p-2 border border-[#C5A05933] text-center space-y-1">
              <span className="text-[8px] uppercase tracking-widest text-[#D4CBBF] opacity-60 block">Limitador</span>
              <div className="flex items-center justify-center gap-1.5 text-[9px] text-[#C5A059] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
                <span>Soft Clip -4dB</span>
              </div>
            </div>

            {/* Master Vertical Fader & Stereo VU Meter */}
            <div className="flex items-center justify-center gap-3 py-1">
              {/* Vertical Master Slider */}
              <div className="h-32 flex items-center">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={masterVolume}
                  onChange={(e) => onMasterVolumeChange(parseFloat(e.target.value))}
                  aria-label="Volume Master Geral"
                  className="accent-[#C5A059] cursor-pointer h-28"
                  style={{
                    writingMode: 'vertical-lr',
                    direction: 'rtl',
                    width: '26px',
                  }}
                />
              </div>

              {/* Dual Stereo Master VU Bars */}
              <div className="flex gap-1">
                {/* L Meter */}
                <div className="w-1.5 h-28 bg-[#0F0E0D] overflow-hidden flex flex-col justify-end p-px border border-[#C5A05933]">
                  <div
                    className="w-full transition-all duration-75"
                    style={{
                      height: `${isPlaying ? Math.round(masterVolume * 90 + Math.random() * 8) : 0}%`,
                      backgroundColor: masterVolume > 0.85 ? '#ef4444' : masterVolume > 0.6 ? '#C5A059' : '#8A7A59',
                    }}
                  />
                </div>
                {/* R Meter */}
                <div className="w-1.5 h-28 bg-[#0F0E0D] overflow-hidden flex flex-col justify-end p-px border border-[#C5A05933]">
                  <div
                    className="w-full transition-all duration-75"
                    style={{
                      height: `${isPlaying ? Math.round(masterVolume * 90 + Math.random() * 8) : 0}%`,
                      backgroundColor: masterVolume > 0.85 ? '#ef4444' : masterVolume > 0.6 ? '#C5A059' : '#8A7A59',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Master Value */}
            <div className="text-center">
              <span className="font-mono text-xs font-bold text-[#C5A059] bg-[#0F0E0D] px-2.5 py-1 border border-[#C5A059]">
                {Math.round(masterVolume * 100)}%
              </span>
            </div>

            {/* Master Reset Button */}
            <button
              onClick={() => onMasterVolumeChange(0.7)}
              className="w-full py-1.5 bg-[#0F0E0D] hover:bg-[#1A1614] text-[9px] uppercase tracking-widest font-semibold text-[#C5A059] border border-[#C5A05933] hover:border-[#C5A059] transition-colors"
            >
              Padrão (70%)
            </button>

          </div>

        </div>
      </div>

    </div>
  );
};
