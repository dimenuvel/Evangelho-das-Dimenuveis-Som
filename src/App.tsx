import React, { useState } from 'react';
import { useAudioEngine } from './hooks/useAudioEngine';
import { usePresets } from './hooks/usePresets';
import { useSessionTimer } from './hooks/useSessionTimer';
import { VisualizerMode, SoundPreset } from './types';
import { Header } from './components/Header';
import { SimpleMode } from './components/SimpleMode/SimpleMode';
import { LabMode } from './components/LabMode/LabMode';
import { GuideModal } from './components/PhilosophicalGuide/GuideModal';
import { PresetModal } from './components/PresetManager/PresetModal';
import { SplashScreenTour } from './components/Tour/SplashScreenTour';
import { AlertCircle, X } from 'lucide-react';

export default function App() {
  const [currentMode, setCurrentMode] = useState<'simple' | 'lab'>('simple');
  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>('spiral');
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isPresetModalOpen, setIsPresetModalOpen] = useState<boolean>(false);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dimenuveis_tour_seen') !== 'true';
    }
    return false;
  });

  const handleCloseTour = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dimenuveis_tour_seen', 'true');
    }
    setIsTourOpen(false);
  };

  // Preset manager from localStorage
  const {
    presets,
    savePreset,
    updatePreset,
    deletePreset,
    resetToDefaults,
    exportPresetsJSON,
    importPresetsJSON,
  } = usePresets();

  // Audio Engine Hook initialized with first preset
  const {
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
    clearError,
  } = useAudioEngine(presets[0]);

  // Session Timer Hook
  const {
    selectedDuration,
    remainingSeconds,
    isTimerRunning,
    isFadingOut,
    completedSession,
    formatTime,
    startSession,
    pauseTimer,
    resumeTimer,
    stopTimer,
    dismissCompleted,
  } = useSessionTimer(
    isPlaying,
    (fadeInSec) => play(fadeInSec),
    (fadeOutSec, onComplete) => pause(fadeOutSec, onComplete),
    { fadeInSec: 1.0, fadeOutSec: 4.0, playChimeOnEnd: true }
  );

  const formattedTime = formatTime(remainingSeconds);

  const handleSelectPreset = (preset: SoundPreset) => {
    loadPreset(preset, isPlaying);
  };

  return (
    <div className="min-h-screen bg-[#0F0E0D] text-[#D4CBBF] font-sans antialiased flex flex-col selection:bg-[#C5A05933] selection:text-[#C5A059] bg-geometric-radial relative">
      
      {/* 1. Global Header */}
      <Header
        currentMode={currentMode}
        onModeChange={setCurrentMode}
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        onStop={() => {
          stopTimer();
          pause(0.2);
        }}
        masterVolume={masterVolume}
        onMasterVolumeChange={setMasterVolume}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* 2. Error Notification Banner (if any) */}
      {errorMessage && (
        <div className="max-w-4xl mx-auto mt-4 px-4 w-full">
          <div className="p-3 bg-[#1A1614] border border-red-800/80 text-red-300 text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button onClick={clearError} className="p-1 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Stage Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6">
        {currentMode === 'simple' ? (
          <SimpleMode
            currentPreset={currentPreset}
            layers={layers}
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            onStop={() => {
              stopTimer();
              pause(0.2);
            }}
            onSelectPreset={handleSelectPreset}
            onSwitchToLab={() => setCurrentMode('lab')}
            masterVolume={masterVolume}
            onMasterVolumeChange={setMasterVolume}
            visualizerMode={visualizerMode}
            onVisualizerModeChange={setVisualizerMode}
            isTimerRunning={isTimerRunning}
            remainingSeconds={remainingSeconds}
            selectedDuration={selectedDuration}
            isFadingOut={isFadingOut}
            completedSession={completedSession}
            formattedTime={formattedTime}
            onStartSession={startSession}
            onPauseTimer={pauseTimer}
            onResumeTimer={resumeTimer}
            onStopTimer={stopTimer}
            onDismissCompleted={dismissCompleted}
          />
        ) : (
          <LabMode
            layers={layers}
            masterVolume={masterVolume}
            onMasterVolumeChange={setMasterVolume}
            onUpdateLayer={updateLayer}
            onAddLayer={addLayer}
            onRemoveLayer={removeLayer}
            onDuplicateLayer={duplicateLayer}
            onToggleMute={toggleLayerMute}
            onToggleSolo={toggleLayerSolo}
            onToggleEnabled={toggleLayerEnabled}
            currentPreset={currentPreset}
            onOpenPresetsModal={() => setIsPresetModalOpen(true)}
            visualizerMode={visualizerMode}
            onVisualizerModeChange={setVisualizerMode}
            isPlaying={isPlaying}
            isTimerRunning={isTimerRunning}
            remainingSeconds={remainingSeconds}
            selectedDuration={selectedDuration}
            isFadingOut={isFadingOut}
            completedSession={completedSession}
            formattedTime={formattedTime}
            onStartSession={startSession}
            onPauseTimer={pauseTimer}
            onResumeTimer={resumeTimer}
            onStopTimer={stopTimer}
            onDismissCompleted={dismissCompleted}
          />
        )}
      </main>

      {/* 4. Footer with Geometric Balance Aesthetics */}
      <footer className="w-full border-t border-[#C5A05933] bg-[#0F0E0D] py-4 px-6 text-center text-xs text-[#D4CBBF]/60 space-y-2">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] uppercase tracking-[0.15em]">
          <div>
            As configurações são experimentais e contemplativas; não constituem tratamento médico.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[#C5A059]">
            <button
              id="footer-tour-btn"
              onClick={() => setIsTourOpen(true)}
              className="text-[#D4CBBF] opacity-70 hover:opacity-100 hover:text-[#C5A059] hover:underline tracking-widest transition-colors"
            >
              Tour do App
            </button>
            <span>//</span>
            <button
              id="footer-guide-btn"
              onClick={() => setIsGuideOpen(true)}
              className="hover:underline tracking-widest"
            >
              Conceitos & Avisos
            </button>
            <span>//</span>
            <button
              id="footer-presets-btn"
              onClick={() => setIsPresetModalOpen(true)}
              className="hover:underline tracking-widest"
            >
              Predefinições
            </button>
            <span>//</span>
            <a
              id="footer-copyright-link"
              href="https://dimenuvel.github.io/Evangelho-das-Dimenuveis-site/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C5A059] hover:underline tracking-widest transition-colors font-medium"
            >
              © Evangelho das Dimenúveis
            </a>
          </div>
        </div>
      </footer>

      {/* 5. Modals & Onboarding Tour */}
      <SplashScreenTour
        isOpen={isTourOpen}
        onClose={handleCloseTour}
        onSelectMode={(mode) => {
          setCurrentMode(mode);
          handleCloseTour();
        }}
      />

      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onOpenTour={() => {
          setIsGuideOpen(false);
          setIsTourOpen(true);
        }}
      />
      
      <PresetModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        presets={presets}
        currentPresetId={currentPreset.id}
        onLoadPreset={(p) => {
          handleSelectPreset(p);
          setIsPresetModalOpen(false);
        }}
        onSavePreset={savePreset}
        onUpdatePreset={updatePreset}
        onDeletePreset={deletePreset}
        onResetDefaults={resetToDefaults}
        onExportJSON={exportPresetsJSON}
        onImportJSON={importPresetsJSON}
        currentLayers={layers}
        masterVolume={masterVolume}
      />

    </div>
  );
}
