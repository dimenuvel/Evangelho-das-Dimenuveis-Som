import React, { useState } from 'react';
import { Play, Pause, Square, Sparkles, Clock, Sliders, Volume2, Info, ChevronRight, CheckCircle2 } from 'lucide-react';
import { DIMENUVEIS_INFO, CANONICAL_PRESETS } from '../../presets/dimenuveisPresets';
import { SoundPreset, AudioLayer, VisualizerMode } from '../../types';
import { calculateBeatDifference, getBeatBandInfo } from '../../audio/audioMath';
import { SpiralVisualizer } from '../Visualizer/SpiralVisualizer';
import { useTheme } from '../../context/ThemeContext';

interface SimpleModeProps {
  currentPreset: SoundPreset;
  layers: AudioLayer[];
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStop: () => void;
  onSelectPreset: (preset: SoundPreset) => void;
  onSwitchToLab: () => void;
  masterVolume: number;
  onMasterVolumeChange: (vol: number) => void;
  visualizerMode: VisualizerMode;
  onVisualizerModeChange: (mode: VisualizerMode) => void;
  // Timer props
  isTimerRunning: boolean;
  remainingSeconds: number;
  selectedDuration: number;
  isFadingOut: boolean;
  completedSession: boolean;
  formattedTime: string;
  onStartSession: (durationSec: number) => void;
  onPauseTimer: () => void;
  onResumeTimer: () => void;
  onStopTimer: () => void;
  onDismissCompleted: () => void;
}

const TIMER_PRESETS = [
  { label: 'Contínuo', sec: 0 },
  { label: '5 min', sec: 300 },
  { label: '10 min', sec: 600 },
  { label: '15 min', sec: 900 },
  { label: '20 min', sec: 1200 },
  { label: '30 min', sec: 1800 },
  { label: '45 min', sec: 2700 },
  { label: '60 min', sec: 3600 },
];

export const SimpleMode: React.FC<SimpleModeProps> = ({
  currentPreset,
  layers,
  isPlaying,
  onTogglePlay,
  onStop,
  onSelectPreset,
  onSwitchToLab,
  masterVolume,
  onMasterVolumeChange,
  visualizerMode,
  onVisualizerModeChange,
  isTimerRunning,
  remainingSeconds,
  selectedDuration,
  isFadingOut,
  completedSession,
  formattedTime,
  onStartSession,
  onPauseTimer,
  onResumeTimer,
  onStopTimer,
  onDismissCompleted,
}) => {
  const { isLight } = useTheme();
  const [selectedTimerSec, setSelectedTimerSec] = useState<number>(0);

  // Active Dimenúvel info if linked
  const activeDimenuvel = DIMENUVEIS_INFO.find((d) => d.id === currentPreset.dimenuvelId) || DIMENUVEIS_INFO[0];

  // Calculate primary binaural difference from active binaural layers
  const primaryBinaural = layers.find((l) => l.type === 'binaural' && l.enabled);
  const beatDiff = primaryBinaural ? calculateBeatDifference(primaryBinaural.leftFreq, primaryBinaural.rightFreq) : 0;
  const beatInfo = getBeatBandInfo(beatDiff);

  const handleTimerSelect = (sec: number) => {
    setSelectedTimerSec(sec);
    if (isPlaying) {
      onStartSession(sec);
    }
  };

  const handleMainPlayToggle = () => {
    if (isPlaying) {
      onPauseTimer();
    } else {
      if (selectedTimerSec > 0 && remainingSeconds <= 0) {
        onStartSession(selectedTimerSec);
      } else if (selectedTimerSec > 0 && remainingSeconds > 0) {
        onResumeTimer();
      } else {
        onStartSession(0); // Continuous
      }
    }
  };

  return (
    <div id="simple-mode-container" className="max-w-6xl mx-auto space-y-6 pb-12">
      
      {/* Session Completed Alert Notification */}
      {completedSession && (
        <div className="p-4 bg-[#1A1614] border border-[#C5A059] flex items-center justify-between shadow-xl animate-fade-in text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-[#C5A059] flex items-center justify-center text-[#C5A059] shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-serif font-bold text-[#C5A059] uppercase tracking-wider">Sessão Contemplativa Concluída</p>
              <p className="text-[#D4CBBF]/80 text-xs">O som foi atenuado suavemente. Permaneça no silêncio da presença.</p>
            </div>
          </div>
          <button
            id="dismiss-session-btn"
            onClick={onDismissCompleted}
            className="px-4 py-1.5 border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A05922] text-xs uppercase tracking-widest transition-colors"
          >
            Fechar
          </button>
        </div>
      )}

      {/* 1. Seven Dimenúveis Selection Strip */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold opacity-90">
            As Sete Dimenúveis
          </span>
          <span className="text-[10px] uppercase tracking-[0.15em] text-[#D4CBBF] opacity-40">
            Arquétipos de Atenção
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {DIMENUVEIS_INFO.map((dim, idx) => {
            const isSelected = currentPreset.dimenuvelId === dim.id;
            const matchingPreset = CANONICAL_PRESETS.find((p) => p.dimenuvelId === dim.id);

            return (
              <button
                key={dim.id}
                id={`dimenuvel-select-btn-${dim.id}`}
                onClick={() => {
                  if (matchingPreset) {
                    onSelectPreset(matchingPreset);
                  }
                }}
                className={`relative p-3.5 border text-left transition-all group flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#1A1614] border-[#C5A059] shadow-md shadow-[#C5A059]/10'
                    : 'bg-[#141210] border-[#C5A05922] hover:border-[#C5A05966] hover:bg-[#1A1614]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-[#C5A059] opacity-80">
                    0{idx + 1}
                  </span>
                  <span className="text-xs font-serif font-bold" style={{ color: isLight ? dim.accentColor : dim.color }}>
                    {dim.symbol}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-serif font-bold text-[#D4CBBF] group-hover:text-[#FFFFFF] tracking-wide">
                    {dim.name}
                  </h4>
                  <p className="text-[10px] font-mono text-[#C5A059] opacity-70 mt-0.5">
                    {dim.suggestedBaseFreq} Hz
                  </p>
                </div>

                {isSelected && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C5A059]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Main Contemplation Stage */}
      <div className="bg-[#141210] border border-[#C5A05933] p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Top: Active Dimenúvel Identity */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C5A05922] pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center border border-[#C5A059] rounded-full text-[#C5A059] font-serif text-sm">
                {activeDimenuvel.symbol}
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] opacity-80">
                  Dimenúvel {activeDimenuvel.id} • {activeDimenuvel.subtitle}
                </span>
                <h3 className="text-xl sm:text-2xl font-serif italic text-[#C5A059] tracking-wide leading-tight">
                  {currentPreset.name}
                </h3>
              </div>
            </div>
            <p className="text-xs text-[#D4CBBF]/75 leading-relaxed max-w-xl">
              {activeDimenuvel.description}
            </p>
          </div>

          {/* Acoustic Frequency Metric Capsule */}
          <div className="bg-[#1A1614] p-4 border border-[#C5A05933] shrink-0 space-y-1.5 min-w-[220px]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] uppercase tracking-widest text-[#D4CBBF] opacity-60">Frequência Base:</span>
              <span className="font-mono font-bold text-[#C5A059]">
                {primaryBinaural ? `${primaryBinaural.leftFreq} Hz` : `${activeDimenuvel.suggestedBaseFreq} Hz`}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] uppercase tracking-widest text-[#D4CBBF] opacity-60">Batimento Binaural:</span>
              <span className="font-mono font-bold text-[#C5A059]">
                {beatDiff > 0 ? `${beatDiff.toFixed(1)} Hz` : 'Uníssono'}
              </span>
            </div>
            <div className="pt-1.5 border-t border-[#C5A05922] text-[10px] font-mono uppercase tracking-widest text-[#D4CBBF] opacity-70">
              {beatInfo.rhythmBand}
            </div>
          </div>
        </div>

        {/* 3. Visualizer Stage */}
        <div className="w-full border border-[#C5A05922] overflow-hidden">
          <SpiralVisualizer
            mode={visualizerMode}
            onModeChange={onVisualizerModeChange}
            isPlaying={isPlaying}
            activeBeatHz={beatDiff}
            dimenuvelColor={activeDimenuvel.color}
          />
        </div>

        {/* 4. Layer Architecture Summary Strips */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#C5A059] opacity-80">
            <span>Estrutura Harmônica das Camadas</span>
            <span>{layers.filter(l => l.enabled).length} Camadas Ativas</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {layers.map((l, index) => (
              <div
                key={l.id}
                className={`p-3 bg-[#1A1614] border transition-colors ${
                  l.enabled ? 'border-[#C5A05933]' : 'border-[#C5A05911] opacity-40'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono uppercase text-[#C5A059] font-semibold">
                    C0{index + 1}: {l.name}
                  </span>
                  <span className="text-[10px] font-mono text-[#D4CBBF]/60">
                    {l.type === 'binaural' ? `${l.leftFreq} / ${l.rightFreq} Hz` : `${l.leftFreq} Hz`}
                  </span>
                </div>
                <div className="h-1 bg-[#0F0E0D] relative overflow-hidden">
                  <div
                    className="h-full bg-[#C5A059] transition-all"
                    style={{ width: `${l.volume * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Session Controls & Timer Bar */}
        <div className="bg-[#1A1614] p-5 sm:p-6 border border-[#C5A05933] space-y-5">
          
          {/* Timer Presets Selection */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-medium">
                <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Duração da Prática</span>
              </span>
              {selectedDuration > 0 && (
                <span className="font-mono text-xs font-bold text-[#C5A059] tracking-wider">
                  {isFadingOut ? 'ATENUANDO SOM...' : formattedTime}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {TIMER_PRESETS.map((t) => {
                const isActive = selectedTimerSec === t.sec;
                return (
                  <button
                    key={t.sec}
                    id={`timer-preset-${t.sec}-btn`}
                    onClick={() => handleTimerSelect(t.sec)}
                    className={`px-3.5 py-1.5 text-[11px] uppercase tracking-wider font-medium transition-all ${
                      isActive
                        ? 'bg-[#C5A059] text-[#0F0E0D] font-bold shadow-sm'
                        : 'border border-[#C5A05933] text-[#D4CBBF] hover:border-[#C5A059] hover:bg-[#C5A05911]'
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Master Tactile Playback Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-[#C5A05922]">
            
            {/* Play / Stop Buttons */}
            <div className="flex items-center gap-3">
              <button
                id="simple-mode-main-play-btn"
                onClick={handleMainPlayToggle}
                className={`flex items-center justify-center gap-2.5 px-6 py-3 text-xs uppercase tracking-[0.2em] font-bold transition-all shadow-md active:scale-95 ${
                  isPlaying
                    ? 'border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A05922]'
                    : 'bg-[#C5A059] text-[#0F0E0D] hover:bg-[#d6b26a]'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pausar Prática</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Iniciar Contemplação</span>
                  </>
                )}
              </button>

              {isPlaying && (
                <button
                  id="simple-mode-stop-btn"
                  onClick={onStop}
                  title="Parar e Reiniciar"
                  className="p-3 border border-[#C5A05944] text-[#C5A059] hover:bg-[#C5A05922] transition-colors"
                >
                  <Square className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Master Volume */}
            <div className="flex items-center gap-3 bg-[#0F0E0D] px-4 py-2 border border-[#C5A05933]">
              <Volume2 className="w-4 h-4 text-[#C5A059]" />
              <input
                id="simple-mode-volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={masterVolume}
                onChange={(e) => onMasterVolumeChange(parseFloat(e.target.value))}
                aria-label="Volume Geral Master"
                className="w-24 sm:w-28 accent-[#C5A059] cursor-pointer"
              />
              <span className="text-xs font-mono text-[#C5A059] w-8 text-right">
                {Math.round(masterVolume * 100)}%
              </span>
            </div>

          </div>

        </div>

        {/* 6. Switch to Advanced Laboratory Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="text-[11px] text-[#D4CBBF] opacity-60">
            Deseja modular frequências independentes, sintetizar harmônicos ou configurar LFO?
          </div>
          <button
            id="go-to-lab-btn"
            onClick={onSwitchToLab}
            className="flex items-center gap-2 px-4 py-2 border border-[#C5A059] text-[#C5A059] text-xs uppercase tracking-widest hover:bg-[#C5A05911] transition-colors group self-start sm:self-auto"
          >
            <span>Laboratório Avançado</span>
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

      </div>

      {/* Contemplative Focus Footer Quote */}
      <div className="p-4 bg-[#141210] border border-[#C5A05922] text-center text-xs space-y-1">
        <p className="font-serif italic text-[#C5A059]">
          "{activeDimenuvel.contemplativeFocus}"
        </p>
        <p className="text-[9px] uppercase tracking-[0.2em] text-[#D4CBBF] opacity-40">
          Evangelho das Dimenúveis • O som como instrumento de observação e presença
        </p>
      </div>

    </div>
  );
};
