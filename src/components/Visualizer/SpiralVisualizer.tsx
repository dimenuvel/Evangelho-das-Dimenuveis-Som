import React, { useEffect, useRef, useState } from 'react';
import { VisualizerMode } from '../../types';
import { AudioEngine } from '../../audio/AudioEngine';
import { Sparkles, Maximize2, Minimize2, Eye, EyeOff, Circle, Compass, Activity } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SpiralVisualizerProps {
  mode: VisualizerMode;
  onModeChange: (mode: VisualizerMode) => void;
  isPlaying: boolean;
  activeBeatHz?: number;
  dimenuvelColor?: string;
}

export const SpiralVisualizer: React.FC<SpiralVisualizerProps> = ({
  mode,
  onModeChange,
  isPlaying,
  activeBeatHz = 6.0,
  dimenuvelColor = '#d4af37',
}) => {
  const { isLight } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);

  // ResizeObserver for canvas pixel density and responsive scaling
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let resizeRafId: number | null = null;

    const handleResize = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const targetWidth = Math.round(rect.width * dpr);
      const targetHeight = Math.round(rect.height * dpr);

      if (targetWidth > 0 && targetHeight > 0) {
        if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
          canvas.width = targetWidth;
          canvas.height = targetHeight;
        }
      }
    };

    const ro = new ResizeObserver(() => {
      if (resizeRafId !== null) {
        cancelAnimationFrame(resizeRafId);
      }
      resizeRafId = requestAnimationFrame(handleResize);
    });

    ro.observe(container);
    handleResize();

    return () => {
      if (resizeRafId !== null) {
        cancelAnimationFrame(resizeRafId);
      }
      ro.disconnect();
    };
  }, [isFullscreen]);

  // Main Canvas render loop
  useEffect(() => {
    if (mode === 'off') {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const engine = AudioEngine.getInstance();
    let currentAngle = 0;
    let time = 0;
    const freqData = new Uint8Array(256);
    const timeData = new Uint8Array(256);

    const render = () => {
      const analyser = engine.getAnalyser();
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);

      // Background with slight fade trail for organic motion blur (adapts to light/dark)
      ctx.fillStyle = isLight ? 'rgba(250, 247, 242, 0.28)' : 'rgba(18, 17, 16, 0.22)';
      ctx.fillRect(0, 0, width, height);

      const effectiveGold = isLight ? '#8E6B23' : (dimenuvelColor || '#C5A059');

      const centerX = width / 2;
      const centerY = height / 2;
      const minDim = Math.min(width, height);

      // Get audio data
      let avgVolume = 0;

      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(freqData);
        analyser.getByteTimeDomainData(timeData);
        let sum = 0;
        for (let i = 0; i < freqData.length; i++) {
          sum += freqData[i];
        }
        avgVolume = sum / (freqData.length * 255); // 0 to 1
      }

      // Smooth idle breathing when stopped
      const pulseRate = isPlaying ? Math.max(0.1, activeBeatHz * 0.15) : 0.2;
      time += 0.016;
      currentAngle += (0.003 + avgVolume * 0.015);

      if (mode === 'spiral') {
        // --- 1. ESPIRAL ÁUREA (Golden Spiral) ---
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(currentAngle);

        const goldenRatio = 1.6180339887;
        const totalPoints = 260;
        const scaleFactor = (minDim * 0.44) / Math.pow(goldenRatio, 3.5);

        ctx.beginPath();
        for (let i = 0; i < totalPoints; i++) {
          const theta = i * 0.1;
          const r = scaleFactor * Math.exp(0.065 * theta) * (1 + avgVolume * 0.35 * Math.sin(theta * 3 + time * 2));
          const x = r * Math.cos(theta);
          const y = r * Math.sin(theta);

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.strokeStyle = effectiveGold;
        ctx.lineWidth = isLight ? 1.9 : 1.6;
        ctx.globalAlpha = isLight ? (0.55 + avgVolume * 0.45) : (0.4 + avgVolume * 0.6);
        ctx.stroke();

        // Spiral Node Beads (sacred points)
        const nodeStep = 18;
        for (let i = 8; i < totalPoints; i += nodeStep) {
          const theta = i * 0.1;
          const r = scaleFactor * Math.exp(0.065 * theta);
          const x = r * Math.cos(theta);
          const y = r * Math.sin(theta);
          const freqVal = freqData[(i * 2) % freqData.length] / 255;
          const nodeRadius = 2 + freqVal * 6 + Math.sin(time * 3 + i) * 1.5;

          ctx.beginPath();
          ctx.arc(x, y, Math.max(1.5, nodeRadius), 0, Math.PI * 2);
          ctx.fillStyle = i % 2 === 0 ? effectiveGold : (isLight ? '#382D20' : '#f5f0e6');
          ctx.globalAlpha = 0.6 + freqVal * 0.4;
          ctx.fill();
        }

        // Center nucleus
        ctx.beginPath();
        const centerPulse = 5 + avgVolume * 15 + Math.sin(time * 2) * 2;
        ctx.arc(0, 0, centerPulse, 0, Math.PI * 2);
        ctx.fillStyle = effectiveGold;
        ctx.globalAlpha = 0.85;
        ctx.fill();

        ctx.restore();

      } else if (mode === 'circles') {
        // --- 2. CÍRCULOS CONCÊNTRICOS (O Padrão — 7 Dimenúveis) ---
        const ringCount = 7;
        const maxRadius = minDim * 0.42;
        const colors = [
          '#e2e8f0', // Silêncio
          '#818cf8', // Visão
          '#38bdf8', // Mente
          '#34d399', // Coração
          '#fbbf24', // Vontade
          '#f97316', // Energia
          '#a87954', // Matéria
        ];

        for (let i = 0; i < ringCount; i++) {
          const baseR = (maxRadius / ringCount) * (i + 1);
          const freqVal = (freqData[i * 12] || 0) / 255;
          const breath = Math.sin(time * (1 + i * 0.2) + i) * (4 + avgVolume * 12);
          const r = baseR + breath + (freqVal * 15);

          ctx.beginPath();
          ctx.arc(centerX, centerY, Math.max(4, r), 0, Math.PI * 2);
          ctx.strokeStyle = colors[i % colors.length];
          ctx.lineWidth = i === 3 ? 2.2 : 1.4; // Accent Coração
          ctx.globalAlpha = 0.35 + (freqVal * 0.65) + (isPlaying ? 0.2 : 0);
          ctx.stroke();

          // Satellite particles on the ring
          const particleCount = 3 + i;
          for (let p = 0; p < particleCount; p++) {
            const pAngle = (p * (Math.PI * 2 / particleCount)) + currentAngle * (i % 2 === 0 ? 1 : -1) * (0.5 + i * 0.1);
            const px = centerX + r * Math.cos(pAngle);
            const py = centerY + r * Math.sin(pAngle);

            ctx.beginPath();
            ctx.arc(px, py, 2 + freqVal * 3, 0, Math.PI * 2);
            ctx.fillStyle = colors[i % colors.length];
            ctx.globalAlpha = 0.6 + freqVal * 0.4;
            ctx.fill();
          }
        }

      } else if (mode === 'mirror') {
        // --- 3. O ESPELHO (Dual Lissajous Stereo Phase Oscilloscope) ---
        ctx.save();
        ctx.translate(centerX, centerY);

        const points = 180;
        const radius = minDim * 0.35;
        const beatShift = time * (activeBeatHz || 4) * 0.4;

        ctx.beginPath();
        for (let i = 0; i < points; i++) {
          const t = (i / points) * Math.PI * 2;
          const waveSample = (timeData[i % timeData.length] - 128) / 128;
          const x = Math.sin(t * 2 + beatShift) * (radius * (0.8 + avgVolume * 0.4) + waveSample * 30);
          const y = Math.sin(t * 3 + beatShift * 0.8) * (radius * (0.8 + avgVolume * 0.4) + waveSample * 30);

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = effectiveGold;
        ctx.lineWidth = isLight ? 2.0 : 1.8;
        ctx.globalAlpha = 0.75 + avgVolume * 0.25;
        ctx.stroke();

        // Inverted mirror echo
        ctx.beginPath();
        for (let i = 0; i < points; i++) {
          const t = (i / points) * Math.PI * 2;
          const x = -Math.sin(t * 2 + beatShift) * (radius * 0.7);
          const y = Math.sin(t * 3 + beatShift * 0.8) * (radius * 0.7);

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = isLight ? '#6366F1' : '#c4b5fd';
        ctx.lineWidth = isLight ? 1.4 : 1.0;
        ctx.globalAlpha = isLight ? 0.5 : 0.35;
        ctx.stroke();

        ctx.restore();

      } else if (mode === 'waveform') {
        // --- 4. ONDA HARMÔNICA (Harmonic Ripple Ribbon) ---
        const slices = 120;
        const sliceWidth = width / slices;

        // Draw 3 layered harmonic flowing waves
        const waveLayers = [
          { color: effectiveGold, alpha: 0.8, heightScale: 50, speed: 2, yOffset: 0 },
          { color: isLight ? '#4F46E5' : '#818cf8', alpha: 0.5, heightScale: 35, speed: -1.5, yOffset: 15 },
          { color: isLight ? '#0284C7' : '#38bdf8', alpha: 0.4, heightScale: 25, speed: 3, yOffset: -15 },
        ];

        waveLayers.forEach((w) => {
          ctx.beginPath();
          ctx.moveTo(0, centerY + w.yOffset);

          for (let i = 0; i < slices; i++) {
            const timeSample = (timeData[(i * 2) % timeData.length] - 128) / 128;
            const x = i * sliceWidth;
            const sineHarmonic = Math.sin((i * 0.08) + time * w.speed);
            const y = centerY + w.yOffset + (sineHarmonic * (12 + avgVolume * w.heightScale)) + (timeSample * (15 + avgVolume * 40));
            ctx.lineTo(x, y);
          }

          ctx.strokeStyle = w.color;
          ctx.lineWidth = 2;
          ctx.globalAlpha = w.alpha + avgVolume * 0.3;
          ctx.stroke();
        });
      }

      ctx.restore();
      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [mode, isPlaying, activeBeatHz, dimenuvelColor]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      ref={containerRef}
      id="spiral-visualizer-container"
      className={`relative w-full overflow-hidden transition-all duration-300 border border-[#C5A05933] bg-[#0F0E0D] ${
        isFullscreen
          ? 'fixed inset-0 z-50 border-none bg-[#0F0E0D] flex flex-col justify-center items-center p-4'
          : 'h-64 sm:h-72 md:h-80'
      }`}
    >
      {/* Background Sacred Geometry Watermark */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5 bg-center bg-no-repeat"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, ${dimenuvelColor} 0%, transparent 70%)`,
        }}
      />

      {mode !== 'off' ? (
        <canvas
          ref={canvasRef}
          id="spiral-visualizer-canvas"
          className="w-full h-full block cursor-pointer"
          onClick={() => {
            // Cycle modes on canvas click
            const modes: VisualizerMode[] = ['spiral', 'circles', 'mirror', 'waveform'];
            const nextIdx = (modes.indexOf(mode) + 1) % modes.length;
            onModeChange(modes[nextIdx]);
          }}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-[#D4CBBF] p-6 text-center space-y-2">
          <EyeOff className="w-8 h-8 opacity-40 text-[#C5A059]" />
          <p className="text-sm font-serif italic tracking-wide text-[#C5A059]">Visualizador Desativado</p>
          <p className="text-xs text-[#D4CBBF] opacity-70">Economiza processamento e mantém a atenção puramente acústica.</p>
          <button
            id="enable-visualizer-btn"
            onClick={() => onModeChange('spiral')}
            className="mt-2 text-xs uppercase tracking-widest px-4 py-2 bg-[#1A1614] hover:bg-[#C5A059] hover:text-[#0F0E0D] text-[#C5A059] border border-[#C5A059] transition-colors"
          >
            Ativar Espiral
          </button>
        </div>
      )}

      {/* Visualizer Top Bar Controls */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        {/* Current Mode Badge */}
        <div className="flex items-center gap-1.5 bg-[#141210]/90 backdrop-blur-md px-3 py-1 border border-[#C5A05933] text-[10px] uppercase font-mono tracking-wider text-[#C5A059] pointer-events-auto">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>
            {mode === 'spiral' && 'Espiral Áurea (φ)'}
            {mode === 'circles' && 'O Padrão (7 Dimenúveis)'}
            {mode === 'mirror' && 'O Espelho (Estéreo)'}
            {mode === 'waveform' && 'Onda Harmônica'}
            {mode === 'off' && 'Desativado'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Mode Switcher Buttons */}
          <div className="flex items-center bg-[#141210]/90 backdrop-blur-md p-1 border border-[#C5A05933] gap-1">
            <button
              id="mode-spiral-btn"
              title="Espiral Áurea"
              onClick={() => onModeChange('spiral')}
              className={`p-1.5 text-xs transition-colors ${
                mode === 'spiral' ? 'bg-[#C5A059] text-[#0F0E0D]' : 'text-[#D4CBBF] opacity-60 hover:opacity-100 hover:text-[#C5A059]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
            </button>
            <button
              id="mode-circles-btn"
              title="O Padrão (Círculos)"
              onClick={() => onModeChange('circles')}
              className={`p-1.5 text-xs transition-colors ${
                mode === 'circles' ? 'bg-[#C5A059] text-[#0F0E0D]' : 'text-[#D4CBBF] opacity-60 hover:opacity-100 hover:text-[#C5A059]'
              }`}
            >
              <Circle className="w-3.5 h-3.5" />
            </button>
            <button
              id="mode-mirror-btn"
              title="O Espelho (Fases)"
              onClick={() => onModeChange('mirror')}
              className={`p-1.5 text-xs transition-colors ${
                mode === 'mirror' ? 'bg-[#C5A059] text-[#0F0E0D]' : 'text-[#D4CBBF] opacity-60 hover:opacity-100 hover:text-[#C5A059]'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
            </button>
            <button
              id="mode-waveform-btn"
              title="Onda Harmônica"
              onClick={() => onModeChange('waveform')}
              className={`p-1.5 text-xs transition-colors ${
                mode === 'waveform' ? 'bg-[#C5A059] text-[#0F0E0D]' : 'text-[#D4CBBF] opacity-60 hover:opacity-100 hover:text-[#C5A059]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
            <button
              id="mode-toggle-off-btn"
              title={mode === 'off' ? 'Ativar Visualizador' : 'Desativar Visualizador'}
              onClick={() => onModeChange(mode === 'off' ? 'spiral' : 'off')}
              className={`p-1.5 text-xs transition-colors ${
                mode === 'off' ? 'bg-red-900 text-red-200' : 'text-[#D4CBBF] opacity-60 hover:opacity-100 hover:text-[#C5A059]'
              }`}
            >
              {mode === 'off' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Fullscreen contemplation button */}
          <button
            id="fullscreen-visualizer-btn"
            title={isFullscreen ? 'Reduzir' : 'Modo Contemplação Tela Cheia'}
            onClick={toggleFullscreen}
            className="p-2 bg-[#141210]/90 backdrop-blur-md border border-[#C5A05933] text-[#D4CBBF] hover:text-[#C5A059] transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Subtle Live Audio Pulse Dot */}
      {isPlaying && mode !== 'off' && (
        <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-[#141210]/85 backdrop-blur-md px-3 py-1 border border-[#C5A05933] text-[10px] font-mono text-[#C5A059]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-ping" />
          <span>Frequência • {activeBeatHz > 0 ? `${activeBeatHz.toFixed(1)} Hz` : 'Uníssono'}</span>
        </div>
      )}
    </div>
  );
};
