import React, { useState, useEffect } from 'react';
import { AudioLayer, SoundPreset, VisualizerMode } from '../../types';
import { LayerCard } from '../LayerControls/LayerCard';
import { MixerConsole } from '../Mixer/MixerConsole';
import { SpiralVisualizer } from '../Visualizer/SpiralVisualizer';
import { AudioEngine, AudioDiagnostics } from '../../audio/AudioEngine';
import {
  Layers,
  Sliders,
  Clock,
  Plus,
  BookmarkPlus,
  CheckCircle2,
  Eye,
  Activity,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { calculateBeatDifference, getBeatBandInfo } from '../../audio/audioMath';

interface LabModeProps {
  layers: AudioLayer[];
  masterVolume: number;
  onMasterVolumeChange: (vol: number) => void;
  onUpdateLayer: (id: string, partial: Partial<AudioLayer>) => void;
  onAddLayer: () => void;
  onRemoveLayer: (id: string) => void;
  onDuplicateLayer: (id: string) => void;
  onToggleMute: (id: string) => void;
  onToggleSolo: (id: string) => void;
  onToggleEnabled: (id: string) => void;
  currentPreset: SoundPreset;
  onOpenPresetsModal: () => void;
  visualizerMode: VisualizerMode;
  onVisualizerModeChange: (mode: VisualizerMode) => void;
  isPlaying: boolean;
  // Timer
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

export const LabMode: React.FC<LabModeProps> = ({
  layers,
  masterVolume,
  onMasterVolumeChange,
  onUpdateLayer,
  onAddLayer,
  onRemoveLayer,
  onDuplicateLayer,
  onToggleMute,
  onToggleSolo,
  onToggleEnabled,
  currentPreset,
  onOpenPresetsModal,
  visualizerMode,
  onVisualizerModeChange,
  isPlaying,
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
  const [activeTab, setActiveTab] = useState<'layers' | 'mixer' | 'session' | 'visualizer'>('layers');
  const [customTimerMins, setCustomTimerMins] = useState<number>(15);
  const [showDiagnostics, setShowDiagnostics] = useState<boolean>(false);
  const [diagnostics, setDiagnostics] = useState<AudioDiagnostics | null>(null);

  // Poll diagnostics periodically when open
  useEffect(() => {
    if (!showDiagnostics) return;
    const engine = AudioEngine.getInstance();
    const updateDiag = () => {
      setDiagnostics(engine.getDiagnostics());
    };
    updateDiag();
    const interval = setInterval(updateDiag, 250);
    return () => clearInterval(interval);
  }, [showDiagnostics, isPlaying]);

  // Summary calculations
  const activeLayersCount = layers.filter((l) => l.enabled && !l.mute).length;
  const primaryBinaural = layers.find((l) => l.type === 'binaural' && l.enabled);
  const beatDiff = primaryBinaural ? calculateBeatDifference(primaryBinaural.leftFreq, primaryBinaural.rightFreq) : 0;
  const beatInfo = getBeatBandInfo(beatDiff);

  return (
    <div id="lab-mode-container" className="max-w-6xl mx-auto space-y-6 pb-16">
      
      {/* Session Completed Alert */}
      {completedSession && (
        <div className="p-4 bg-[#1A1614] border border-[#C5A059] flex items-center justify-between shadow-xl animate-fade-in text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-[#C5A059] flex items-center justify-center text-[#C5A059] shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-serif font-bold text-[#C5A059] uppercase tracking-wider">Sessão de Prática Concluída</p>
              <p className="text-[#D4CBBF]/80 text-xs">Transição suave finalizada. A quietude permanece.</p>
            </div>
          </div>
          <button
            onClick={onDismissCompleted}
            className="px-4 py-1.5 border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A05922] text-xs uppercase tracking-widest transition-colors"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Top Laboratory Toolbar */}
      <div className="bg-[#141210] border border-[#C5A05933] p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        
        {/* Left: Active Preset & Summary */}
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex items-center gap-3 min-w-0 flex-wrap">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A059] border border-[#C5A05944] bg-[#1A1614] px-2.5 py-0.5 shrink-0">
              LABORATÓRIO
            </span>
            <h3 className="text-base font-serif italic text-[#C5A059] tracking-wide">
              {currentPreset.name}
            </h3>
          </div>
          {currentPreset.description && (
            <p className="text-xs text-[#D4CBBF]/85 leading-relaxed max-w-2xl">
              {currentPreset.description}
            </p>
          )}
          <p className="text-[11px] font-mono text-[#D4CBBF] opacity-70">
            {activeLayersCount} de {layers.length} camadas ativas // {beatDiff > 0 ? `Batimento: ${beatDiff.toFixed(1)} Hz (${beatInfo.rhythmBand})` : 'Modo Uníssono'}
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Add Layer Button */}
          <button
            id="lab-add-layer-btn"
            onClick={onAddLayer}
            className="flex items-center gap-2 px-4 py-2 bg-[#C5A059] text-[#0F0E0D] text-xs uppercase tracking-widest font-bold hover:bg-[#d6b26a] shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Camada</span>
          </button>

          {/* Presets Manager Button */}
          <button
            id="lab-open-presets-btn"
            onClick={onOpenPresetsModal}
            className="flex items-center gap-2 px-4 py-2 border border-[#C5A059] text-[#C5A059] text-xs uppercase tracking-widest hover:bg-[#C5A05911] transition-colors"
          >
            <BookmarkPlus className="w-4 h-4 text-[#C5A059]" />
            <span>Predefinições</span>
          </button>
        </div>

      </div>

      {/* Laboratory Navigation Tabs */}
      <div className="flex items-center gap-1 bg-[#0F0E0D] p-1.5 border border-[#C5A05933] overflow-x-auto">
        <button
          id="lab-tab-layers-btn"
          onClick={() => setActiveTab('layers')}
          className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-medium transition-all whitespace-nowrap ${
            activeTab === 'layers'
              ? 'bg-[#C5A059] text-[#0F0E0D] font-bold shadow-sm'
              : 'text-[#D4CBBF] hover:text-[#C5A059] hover:bg-[#C5A05911]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Camadas & Frequências ({layers.length})</span>
        </button>

        <button
          id="lab-tab-mixer-btn"
          onClick={() => setActiveTab('mixer')}
          className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-medium transition-all whitespace-nowrap ${
            activeTab === 'mixer'
              ? 'bg-[#C5A059] text-[#0F0E0D] font-bold shadow-sm'
              : 'text-[#D4CBBF] hover:text-[#C5A059] hover:bg-[#C5A05911]'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Mesa de Som (Mixer)</span>
        </button>

        <button
          id="lab-tab-session-btn"
          onClick={() => setActiveTab('session')}
          className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-medium transition-all whitespace-nowrap ${
            activeTab === 'session'
              ? 'bg-[#C5A059] text-[#0F0E0D] font-bold shadow-sm'
              : 'text-[#D4CBBF] hover:text-[#C5A059] hover:bg-[#C5A05911]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Sessão & Fade</span>
        </button>

        <button
          id="lab-tab-visualizer-btn"
          onClick={() => setActiveTab('visualizer')}
          className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-medium transition-all whitespace-nowrap ${
            activeTab === 'visualizer'
              ? 'bg-[#C5A059] text-[#0F0E0D] font-bold shadow-sm'
              : 'text-[#D4CBBF] hover:text-[#C5A059] hover:bg-[#C5A05911]'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Visualizador Sagrado</span>
        </button>
      </div>

      {/* Tab Content 1: Layers & Frequency Workshops */}
      {activeTab === 'layers' && (
        <div className="space-y-4 animate-fade-in">
          {layers.length === 0 ? (
            <div className="p-8 text-center bg-[#141210] border border-[#C5A05933] space-y-3">
              <p className="text-xs uppercase tracking-widest text-[#D4CBBF] opacity-60">Nenhuma camada sonora configurada.</p>
              <button
                onClick={onAddLayer}
                className="px-5 py-2.5 bg-[#C5A059] text-[#0F0E0D] text-xs uppercase tracking-widest font-bold hover:bg-[#d6b26a]"
              >
                Criar Primeira Camada
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {layers.map((layer, index) => (
                <LayerCard
                  key={layer.id}
                  layer={layer}
                  index={index}
                  totalLayers={layers.length}
                  onUpdate={onUpdateLayer}
                  onRemove={onRemoveLayer}
                  onDuplicate={onDuplicateLayer}
                  onToggleMute={onToggleMute}
                  onToggleSolo={onToggleSolo}
                  onToggleEnabled={onToggleEnabled}
                />
              ))}

              {/* Add layer bottom footer button */}
              <button
                id="add-layer-bottom-btn"
                onClick={onAddLayer}
                className="w-full py-4 border border-dashed border-[#C5A05944] hover:border-[#C5A059] text-[#C5A059] flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] font-medium transition-all bg-[#141210] hover:bg-[#1A1614]"
              >
                <Plus className="w-4 h-4 text-[#C5A059]" />
                <span>Adicionar Outra Camada Sonora</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: Mixer Console */}
      {activeTab === 'mixer' && (
        <div className="animate-fade-in">
          <MixerConsole
            layers={layers}
            masterVolume={masterVolume}
            onMasterVolumeChange={onMasterVolumeChange}
            onUpdateLayer={onUpdateLayer}
            onToggleMute={onToggleMute}
            onToggleSolo={onToggleSolo}
            onToggleEnabled={onToggleEnabled}
            isPlaying={isPlaying}
          />
        </div>
      )}

      {/* Tab Content 3: Session & Fade Configurations */}
      {activeTab === 'session' && (
        <div className="bg-[#141210] border border-[#C5A05933] p-6 sm:p-8 space-y-6 shadow-xl animate-fade-in">
          <div className="border-b border-[#C5A05922] pb-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] opacity-80">Prática Temporal</span>
            <h3 className="text-base sm:text-lg font-serif italic text-[#C5A059]">
              Temporizador & Atenuação Gradual da Sessão
            </h3>
            <p className="text-xs text-[#D4CBBF]/70 mt-1">
              Configure a duração da prática meditativa com atenuação suave ao término (sem cortes abruptos).
            </p>
          </div>

          {/* Quick timer preset buttons */}
          <div className="space-y-3">
            <span className="text-[10px] font-semibold text-[#C5A059] uppercase tracking-[0.2em]">
              Durações Rápidas
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: '5 Minutos', sec: 300 },
                { label: '10 Minutos', sec: 600 },
                { label: '15 Minutos', sec: 900 },
                { label: '20 Minutos', sec: 1200 },
                { label: '30 Minutos', sec: 1800 },
                { label: '45 Minutos', sec: 2700 },
                { label: '60 Minutos', sec: 3600 },
                { label: '90 Minutos', sec: 5400 },
              ].map((t) => (
                <button
                  key={t.sec}
                  onClick={() => onStartSession(t.sec)}
                  className={`p-3 border text-xs uppercase tracking-wider font-medium transition-all text-center ${
                    selectedDuration === t.sec && isTimerRunning
                      ? 'bg-[#C5A059] text-[#0F0E0D] font-bold border-[#C5A059]'
                      : 'bg-[#1A1614] text-[#D4CBBF] border-[#C5A05922] hover:border-[#C5A059] hover:bg-[#C5A05911]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Duration Input */}
          <div className="bg-[#1A1614] p-4 border border-[#C5A05933] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs uppercase tracking-widest font-semibold text-[#D4CBBF]">Duração Personalizada</h4>
              <p className="text-[10px] text-[#D4CBBF] opacity-60">Defina o tempo exato em minutos</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="180"
                value={customTimerMins}
                onChange={(e) => setCustomTimerMins(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 bg-[#0F0E0D] text-[#C5A059] font-mono px-3 py-1.5 border border-[#C5A05944] text-xs text-center outline-none"
              />
              <span className="text-xs text-[#D4CBBF] opacity-60">min</span>
              <button
                onClick={() => onStartSession(customTimerMins * 60)}
                className="px-4 py-1.5 bg-[#C5A059] text-[#0F0E0D] text-xs uppercase tracking-widest font-bold hover:bg-[#d6b26a] transition-colors"
              >
                Iniciar
              </button>
            </div>
          </div>

          {/* Active Session Status Box */}
          {selectedDuration > 0 && (
            <div className="bg-[#1A1614] p-4 border border-[#C5A059] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059]">
                  STATUS DA SESSÃO
                </span>
                <p className="text-xs font-semibold text-[#D4CBBF]">
                  {isFadingOut ? 'Atenuando som suavemente...' : isTimerRunning ? 'Sessão em andamento' : 'Sessão em pausa'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-xl font-bold text-[#C5A059] tracking-wider">
                  {formattedTime}
                </span>
                <button
                  onClick={onStopTimer}
                  className="px-3.5 py-1.5 border border-[#C5A05944] hover:bg-[#C5A05922] text-[#C5A059] text-xs uppercase tracking-widest transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Fade description note */}
          <div className="p-3 bg-[#0F0E0D] border border-[#C5A05922] text-[11px] text-[#D4CBBF]/60 leading-relaxed font-mono">
            // O som decai gradualmente nos últimos 4 segundos antes de atingir zero, com curva suave e harmonização ao silêncio.
          </div>
        </div>
      )}

      {/* Tab Content 4: Visualizer */}
      {activeTab === 'visualizer' && (
        <div className="space-y-4 animate-fade-in">
          <div className="border border-[#C5A05922] overflow-hidden">
            <SpiralVisualizer
              mode={visualizerMode}
              onModeChange={onVisualizerModeChange}
              isPlaying={isPlaying}
              activeBeatHz={beatDiff}
            />
          </div>
          <div className="p-4 bg-[#141210] border border-[#C5A05922] text-xs text-[#D4CBBF]/70 space-y-1">
            <h4 className="font-serif italic text-[#C5A059]">Visualizador Sagrado em Tempo Real</h4>
            <p className="text-[11px] leading-relaxed">
              O osciloscópio estéreo e o gerador da Espiral Áurea reagem diretamente à transformada de Fourier do barramento de áudio.
            </p>
          </div>
        </div>
      )}

      {/* Internal Audio Diagnostics (Non-Intrusive Engine Telemetry) */}
      <div className="border border-[#C5A05922] bg-[#141210]/60 overflow-hidden">
        <button
          id="toggle-audio-diagnostics-btn"
          type="button"
          onClick={() => setShowDiagnostics(!showDiagnostics)}
          className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-[#1A1614] transition-colors text-[10px] uppercase font-mono tracking-widest text-[#C5A059] opacity-80 hover:opacity-100"
        >
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Diagnóstico do Motor de Áudio (Web Audio API)</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#D4CBBF]/60 text-[9px]">
            <span>{showDiagnostics ? 'Ocultar' : 'Ver Métricas'}</span>
            {showDiagnostics ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        </button>

        {showDiagnostics && diagnostics && (
          <div className="p-4 border-t border-[#C5A05922] bg-[#0F0E0D] text-[11px] font-mono grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 animate-fade-in">
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase tracking-wider text-[#D4CBBF]/60 block">Contexto</span>
              <span className={`font-bold ${diagnostics.state === 'running' ? 'text-emerald-400' : 'text-[#C5A059]'}`}>
                {diagnostics.state.toUpperCase()}
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-[9px] uppercase tracking-wider text-[#D4CBBF]/60 block">Taxa Amostragem</span>
              <span className="text-[#D4CBBF] font-bold">
                {diagnostics.sampleRate > 0 ? `${diagnostics.sampleRate} Hz` : 'N/A'}
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-[9px] uppercase tracking-wider text-[#D4CBBF]/60 block">Camadas Ativas</span>
              <span className="text-[#C5A059] font-bold">
                {diagnostics.activeLayersCount}
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-[9px] uppercase tracking-wider text-[#D4CBBF]/60 block">Nós Web Audio</span>
              <span className="text-[#C5A059] font-bold">
                {diagnostics.activeNodesCount}
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-[9px] uppercase tracking-wider text-[#D4CBBF]/60 block">Ganho Master</span>
              <span className="text-[#D4CBBF] font-bold">
                {Math.round(diagnostics.masterVolume * 100)}%
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-[9px] uppercase tracking-wider text-[#D4CBBF]/60 block">Anti-Clipping</span>
              <span className="text-emerald-400 font-bold">
                {diagnostics.limiterReductionDb > 0 ? `-${diagnostics.limiterReductionDb} dB` : '0.0 dB'}
              </span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
