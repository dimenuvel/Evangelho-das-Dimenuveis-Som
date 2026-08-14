import { useState, useEffect, useRef, useCallback } from 'react';
import { AudioEngine } from '../audio/AudioEngine';

export interface TimerOptions {
  fadeInSec?: number;
  fadeOutSec?: number;
  playChimeOnEnd?: boolean;
}

export function useSessionTimer(
  isPlaying: boolean,
  onPlay: (fadeInSec?: number) => void,
  onPause: (fadeOutSec?: number, onComplete?: () => void) => void,
  options: TimerOptions = {}
) {
  const { fadeInSec = 1.0, fadeOutSec = 4.0, playChimeOnEnd = true } = options;

  // Selected duration in seconds (0 = infinite / continuous session)
  const [selectedDuration, setSelectedDuration] = useState<number>(0); 
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [completedSession, setCompletedSession] = useState<boolean>(false);

  const timerIntervalRef = useRef<number | null>(null);
  const fadeTriggeredRef = useRef<boolean>(false);

  // Clear interval helper
  const clearTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  // Format seconds to MM:SS
  const formatTime = useCallback((totalSec: number) => {
    if (totalSec <= 0) return '00:00';
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = Math.floor(totalSec % 60);

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Start session with chosen duration
  const startSession = useCallback(
    (durationSec: number) => {
      clearTimer();
      setCompletedSession(false);
      setIsFadingOut(false);
      fadeTriggeredRef.current = false;
      setSelectedDuration(durationSec);
      setRemainingSeconds(durationSec);

      if (durationSec > 0) {
        setIsTimerRunning(true);
      } else {
        setIsTimerRunning(false); // Continuous mode
      }

      onPlay(fadeInSec);
    },
    [clearTimer, fadeInSec, onPlay]
  );

  // Pause session timer
  const pauseTimer = useCallback(() => {
    clearTimer();
    setIsTimerRunning(false);
    onPause(0.2);
  }, [clearTimer, onPause]);

  // Resume session timer
  const resumeTimer = useCallback(() => {
    if (remainingSeconds > 0) {
      setIsTimerRunning(true);
    }
    onPlay(0.5);
  }, [onPlay, remainingSeconds]);

  // Stop and reset timer
  const stopTimer = useCallback(() => {
    clearTimer();
    setIsTimerRunning(false);
    setIsFadingOut(false);
    fadeTriggeredRef.current = false;
    setRemainingSeconds(selectedDuration);
    onPause(0.2);
  }, [clearTimer, onPause, selectedDuration]);

  // Timer tick effect
  useEffect(() => {
    if (isTimerRunning && selectedDuration > 0) {
      timerIntervalRef.current = window.setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            // Reached 0: session complete
            clearTimer();
            setIsTimerRunning(false);
            setIsFadingOut(false);
            setCompletedSession(true);

            // Trigger gentle stop and chime
            onPause(0.1, () => {
              if (playChimeOnEnd) {
                AudioEngine.getInstance().playSessionEndChime();
              }
            });
            return 0;
          }

          // Trigger smooth fade-out when reaching fade threshold
          if (prev <= fadeOutSec && !fadeTriggeredRef.current) {
            fadeTriggeredRef.current = true;
            setIsFadingOut(true);
            // Gradually lower master volume towards zero
            AudioEngine.getInstance().setMasterVolume(0, fadeOutSec);
          }

          return prev - 1;
        });
      }, 1000);
    } else {
      clearTimer();
    }

    return () => clearTimer();
  }, [clearTimer, fadeOutSec, isTimerRunning, onPause, playChimeOnEnd, selectedDuration]);

  // If external audio stopped unexpectedly, pause the timer too
  useEffect(() => {
    if (!isPlaying && isTimerRunning) {
      setIsTimerRunning(false);
      clearTimer();
    }
  }, [clearTimer, isPlaying, isTimerRunning]);

  const progressPercent = selectedDuration > 0 ? ((selectedDuration - remainingSeconds) / selectedDuration) * 100 : 0;

  return {
    selectedDuration,
    remainingSeconds,
    isTimerRunning,
    isFadingOut,
    completedSession,
    progressPercent,
    formatTime,
    startSession,
    pauseTimer,
    resumeTimer,
    stopTimer,
    setDuration: setSelectedDuration,
    dismissCompleted: () => setCompletedSession(false),
  };
}
