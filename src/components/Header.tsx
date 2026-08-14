import React from 'react';
import { Play, Pause, Square, Headphones, Volume2, Sliders, Sparkles, BookOpen } from 'lucide-react';

interface HeaderProps {
  currentMode: 'simple' | 'lab';
  onModeChange: (mode: 'simple' | 'lab') => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStop: () => void;
  masterVolume: number;
  onMasterVolumeChange: (vol: number) => void;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onModeChange,
  isPlaying,
  onTogglePlay,
  onStop,
  masterVolume,
  onMasterVolumeChange,
  onOpenGuide,
}) => {
  return (
    <header id="main-app-header" className="w-full bg-[#0F0E0DCC] backdrop-blur-md border-b border-[#C5A05933] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Left: Geometric Emblem & Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Geometric Balance Sacred Icon */}
            <div className="w-8 h-8 flex items-center justify-center border border-[#C5A059] rounded-full shrink-0">
              <div className="w-4 h-4 border-t-2 border-r-2 border-[#C5A059] rounded-full rotate-45"></div>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase opacity-60 font-medium text-[#D4CBBF]">
                Evangelho das Dimenúveis
              </span>
              <h1 className="text-base sm:text-lg font-serif italic text-[#C5A059] leading-tight tracking-wide">
                Laboratório de Som
              </h1>
            </div>
          </div>

          {/* Guide button on mobile */}
          <button
            id="mobile-guide-btn"
            onClick={onOpenGuide}
            title="Conceitos & Avisos"
            className="md:hidden p-2 rounded-full border border-[#C5A05944] text-[#C5A059] hover:bg-[#C5A05911] transition-colors"
          >
            <BookOpen className="w-4 h-4" />
          </button>
        </div>

        {/* Center & Right Controls */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-4 sm:gap-6">
          
          {/* Session State Indicator */}
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest opacity-40">Estado de Sessão</span>
            <span className="text-xs font-mono text-[#C5A059] font-medium tracking-wider">
              {isPlaying ? 'PRESENÇA ATIVA' : 'EM REPOUSO'}
            </span>
          </div>

          <div className="hidden lg:block h-8 w-px bg-[#C5A05933]"></div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-2">
            <button
              id="mode-switch-simple-btn"
              onClick={() => onModeChange('simple')}
              className={`px-4 py-1.5 text-xs uppercase tracking-widest transition-all font-medium ${
                currentMode === 'simple'
                  ? 'bg-[#C5A059] text-[#0F0E0D] font-bold shadow-sm'
                  : 'border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A05911]'
              }`}
            >
              Simples
            </button>

            <button
              id="mode-switch-lab-btn"
              onClick={() => onModeChange('lab')}
              className={`px-4 py-1.5 text-xs uppercase tracking-widest transition-all font-medium ${
                currentMode === 'lab'
                  ? 'bg-[#C5A059] text-[#0F0E0D] font-bold shadow-sm'
                  : 'border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A05911]'
              }`}
            >
              Laboratório
            </button>
          </div>

          <div className="h-6 sm:h-8 w-px bg-[#C5A05933]"></div>

          {/* Master Volume & Playback Controls */}
          <div className="flex items-center gap-3">
            {/* Master Volume Slider */}
            <div className="flex items-center gap-2 bg-[#1A1614] px-3 py-1.5 border border-[#C5A05933]">
              <Volume2 className="w-3.5 h-3.5 text-[#C5A059]" />
              <input
                id="master-volume-header-slider"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={masterVolume}
                onChange={(e) => onMasterVolumeChange(parseFloat(e.target.value))}
                aria-label="Volume Geral Master"
                className="w-16 sm:w-20 accent-[#C5A059] cursor-pointer"
              />
              <span className="text-[10px] font-mono text-[#C5A059] w-7 text-right">
                {Math.round(masterVolume * 100)}%
              </span>
            </div>

            {/* Circular Play / Stop Controls */}
            <div className="flex items-center gap-1.5">
              <button
                id="header-play-pause-btn"
                onClick={onTogglePlay}
                title={isPlaying ? 'Pausar Áudio' : 'Iniciar Áudio'}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  isPlaying
                    ? 'border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A05922]'
                    : 'bg-[#C5A059] text-[#0F0E0D] hover:bg-[#d6b26a]'
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current translate-x-0.5" />
                )}
              </button>

              {isPlaying && (
                <button
                  id="header-stop-btn"
                  onClick={onStop}
                  title="Parar áudio"
                  className="w-9 h-9 rounded-full border border-[#C5A05944] text-[#C5A059] hover:bg-[#C5A05922] flex items-center justify-center transition-colors"
                >
                  <Square className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Guide info button desktop */}
            <button
              id="desktop-guide-btn"
              onClick={onOpenGuide}
              title="Conceitos & Avisos Legais"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 border border-[#C5A05944] hover:bg-[#C5A05911] text-[#C5A059] text-xs uppercase tracking-widest transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Guia</span>
            </button>
          </div>

        </div>

      </div>

      {/* Persistent Headphones Recommendation Bar */}
      <div className="bg-[#0F0E0D] border-t border-[#C5A05922] py-1 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-[#D4CBBF] opacity-60">
          <Headphones className="w-3 h-3 text-[#C5A059]" />
          <span>Fones recomendados para separação estereofônica de batimentos binaurais</span>
        </div>
      </div>
    </header>
  );
};
