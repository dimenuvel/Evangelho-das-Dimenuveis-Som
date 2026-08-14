/**
 * Mathematical and acoustic helpers for the Evangelho das Dimenúveis Sound Laboratory.
 */

export const GOLDEN_RATIO = 1.618033988749895;

export interface BeatInfo {
  difference: number;
  rhythmBand: string;
  description: string;
}

/**
 * Calculates absolute binaural beat frequency difference in Hz.
 */
export function calculateBeatDifference(leftFreq: number, rightFreq: number): number {
  return Math.abs(leftFreq - rightFreq);
}

/**
 * Provides purely acoustic/rhythmic classification of the beat rate.
 * Note: These are acoustic rhythm brackets and philosophical contemplation references,
 * not clinical/medical claims.
 */
export function getBeatBandInfo(differenceHz: number): BeatInfo {
  const diff = Math.round(differenceHz * 100) / 100;
  
  if (diff === 0) {
    return {
      difference: 0,
      rhythmBand: 'Uníssono',
      description: 'Tom contínuo em fase idêntica em ambos os canais.',
    };
  }
  if (diff <= 3.9) {
    return {
      difference: diff,
      rhythmBand: 'Pulso Lento (Delta)',
      description: 'Modulação profunda e repousante, sugerindo silêncio e aterramento.',
    };
  }
  if (diff <= 7.9) {
    return {
      difference: diff,
      rhythmBand: 'Pulso Suave (Theta)',
      description: 'Oscilação fluida para contemplação, imaginação e interioridade.',
    };
  }
  if (diff <= 13.9) {
    return {
      difference: diff,
      rhythmBand: 'Pulso Sereno (Alpha)',
      description: 'Cadência equilibrada para presença lúcida e observação calma.',
    };
  }
  if (diff <= 29.9) {
    return {
      difference: diff,
      rhythmBand: 'Pulso Ativo (Beta)',
      description: 'Ritmo focado e estruturado para atenção e vontade dirigida.',
    };
  }
  return {
    difference: diff,
    rhythmBand: 'Pulso Rápido (Gamma)',
    description: 'Vibração rápida e integradora para exploração de padrões complexos.',
  };
}

/**
 * Harmonic reference frequencies for exploratory contemplation.
 */
export const HARMONIC_PRESETS = [
  { name: '432 Hz — Afinação Harmônica Natural', freq: 432, desc: 'Frequência de ressonância natural' },
  { name: '528 Hz — Padrão de Transformação', freq: 528, desc: 'Frequência do Padrão e clareza' },
  { name: '136.1 Hz — Tom Primordial', freq: 136.1, desc: 'Ressonância profunda e acolhedora' },
  { name: '216 Hz — Sub-harmônico de 432 Hz', freq: 216, desc: 'Oitava inferior de 432 Hz' },
  { name: '108 Hz — Aterramento Matéria', freq: 108, desc: 'Base telúrica e centragem' },
  { name: '256 Hz — Dó Científico (Verdi)', freq: 256, desc: 'Estrutura matemática pura' },
  { name: '144 Hz — Visão Espacial', freq: 144, desc: 'Harmônico de expansão perceptiva' },
];

/**
 * Format frequency with clean decimals.
 */
export function formatFrequency(hz: number): string {
  if (Number.isInteger(hz)) {
    return `${hz} Hz`;
  }
  return `${hz.toFixed(2).replace(/\.?0+$/, '')} Hz`;
}

/**
 * Converts BPM to Hz.
 */
export function bpmToHz(bpm: number): number {
  return bpm / 60;
}

/**
 * Converts Hz to BPM.
 */
export function hzToBpm(hz: number): number {
  return Math.round(hz * 60);
}

/**
 * Safely clamp a number.
 */
export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}
