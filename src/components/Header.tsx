import React from 'react';
import { Play, Pause, Headphones, Volume2, Sliders, Sparkles, BookOpen, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  currentMode: 'simple' | 'lab';
  onModeChange: (mode: 'simple' | 'lab') => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStop?: () => void;
  masterVolume: number;
  onMasterVolumeChange: (vol: number) => void;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onModeChange,
  isPlaying,
  onTogglePlay,
  masterVolume,
  onMasterVolumeChange,
  onOpenGuide,
}) => {
  const { theme, toggleTheme, isLight } = useTheme();

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

          {/* Quick buttons on mobile (Theme + Guide) */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              id="mobile-theme-toggle-btn"
              onClick={toggleTheme}
              title={isLight ? 'Modo Escuro (Trevas)' : 'Modo Claro (Luz Sacra)'}
              aria-label="Alternar tema"
              className="p-2 rounded-full border border-[#C5A05944] text-[#C5A059] hover:bg-[#C5A05911] transition-colors"
            >
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <button
              id="mobile-guide-btn"
              onClick={onOpenGuide}
              title="Conceitos & Avisos"
              className="p-2 rounded-full border border-[#C5A05944] text-[#C5A059] hover:bg-[#C5A05911] transition-colors"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center & Right Controls - Single Aligned Row Filling Full Width on Mobile & Flex on Desktop */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 w-full md:w-auto flex-nowrap">
          
          {/* Session State Indicator */}
          <div className="hidden xl:flex flex-col items-end shrink-0">
            <span className="text-[10px] uppercase tracking-widest opacity-40">Estado de Sessão</span>
            <span className="text-xs font-mono text-[#C5A059] font-medium tracking-wider">
              {isPlaying ? 'PRESENÇA ATIVA' : 'EM REPOUSO'}
            </span>
          </div>

          <div className="hidden xl:block h-8 w-px bg-[#C5A05933]"></div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              id="mode-switch-simple-btn"
              onClick={() => onModeChange('simple')}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm uppercase tracking-wider transition-all font-semibold whitespace-nowrap rounded-sm shadow-sm ${
                currentMode === 'simple'
                  ? 'bg-[#C5A059] text-[#0F0E0D] font-bold shadow-md'
                  : 'border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A05911]'
              }`}
            >
              Simples
            </button>

            <button
              id="mode-switch-lab-btn"
              onClick={() => onModeChange('lab')}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm uppercase tracking-wider transition-all font-semibold whitespace-nowrap rounded-sm shadow-sm ${
                currentMode === 'lab'
                  ? 'bg-[#C5A059] text-[#0F0E0D] font-bold shadow-md'
                  : 'border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A05911]'
              }`}
            >
              Laboratório
            </button>
          </div>

          {/* Master Volume Slider - Expands to Fill Available Space */}
          <div className="flex-1 sm:flex-initial flex items-center gap-2 bg-[#1A1614] px-2.5 sm:px-3.5 py-2 border border-[#C5A05944] min-w-0 rounded-sm">
            <Volume2 className="w-4 h-4 text-[#C5A059] shrink-0" />
            <input
              id="master-volume-header-slider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={masterVolume}
              onChange={(e) => onMasterVolumeChange(parseFloat(e.target.value))}
              aria-label="Volume Geral Master"
              className="w-full min-w-[50px] sm:w-28 md:w-32 accent-[#C5A059] cursor-pointer h-2"
            />
            <span className="text-[10px] sm:text-xs font-mono text-[#C5A059] w-7 sm:w-8 text-right shrink-0 font-medium">
              {Math.round(masterVolume * 100)}%
            </span>
          </div>

          {/* Play / Pause Control */}
          <button
            id="header-play-pause-btn"
            onClick={onTogglePlay}
            title={isPlaying ? 'Pausar Áudio' : 'Iniciar Áudio'}
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 transition-all shadow-md ${
              isPlaying
                ? 'border-2 border-[#C5A059] text-[#C5A059] hover:bg-[#C5A05922]'
                : 'bg-[#C5A059] text-[#0F0E0D] hover:bg-[#d6b26a]'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            ) : (
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current translate-x-0.5" />
            )}
          </button>

          {/* Theme Toggle Button Desktop */}
          <button
            id="desktop-theme-toggle-btn"
            onClick={toggleTheme}
            title={isLight ? 'Modo Escuro (Trevas)' : 'Modo Claro (Luz Sacra)'}
            aria-label="Alternar tema claro/escuro"
            className="hidden md:flex items-center gap-1.5 px-3 py-2 border border-[#C5A05944] hover:bg-[#C5A05911] text-[#C5A059] text-xs uppercase tracking-widest transition-colors shrink-0 rounded-sm"
          >
            {isLight ? (
              <>
                <Moon className="w-4 h-4" />
                <span className="hidden lg:inline text-[11px]">Escuro</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4" />
                <span className="hidden lg:inline text-[11px]">Claro</span>
              </>
            )}
          </button>

          {/* Guide info button desktop */}
          <button
            id="desktop-guide-btn"
            onClick={onOpenGuide}
            title="Conceitos & Avisos Legais"
            className="hidden md:flex items-center gap-1.5 px-3 py-2 border border-[#C5A05944] hover:bg-[#C5A05911] text-[#C5A059] text-xs uppercase tracking-widest transition-colors shrink-0 rounded-sm"
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-xs">Guia</span>
          </button>

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

