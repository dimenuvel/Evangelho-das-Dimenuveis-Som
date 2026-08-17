import React, { useState } from 'react';
import {
  Compass,
  Headphones,
  Sliders,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  ShieldCheck,
  Radio,
  Eye,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface SplashScreenTourProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode?: (mode: 'simple' | 'lab') => void;
}

interface TourStep {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  points: { icon: React.ReactNode; title: string; desc: string }[];
  highlight?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 1,
    tag: 'Introdução & Propósito',
    title: 'Evangelho das Dimenúveis',
    subtitle: 'Laboratório de Som & Prática Contemplativa',
    description:
      'Um espaço acústico projetado para cultivar presença consciente, concentração profunda e serenidade através de frequências harmônicas, batimentos binaurais e geometria sonora.',
    points: [
      {
        icon: <Sparkles className="w-4 h-4 text-[#C5A059]" />,
        title: 'Áudio em Tempo Real',
        desc: 'Síntese sonora sintetizada diretamente pelo navegador via Web Audio API, sem streaming nem latência.',
      },
      {
        icon: <ShieldCheck className="w-4 h-4 text-[#C5A059]" />,
        title: 'Privacidade Total',
        desc: '100% local e privado — suas predefinições e sessões ficam armazenadas exclusivamente no seu dispositivo.',
      },
      {
        icon: <Headphones className="w-4 h-4 text-[#C5A059]" />,
        title: 'Isolamento Estéreo',
        desc: 'Utilize fones de ouvido para experienciar a separação física essencial dos batimentos binaurais.',
      },
    ],
    highlight: 'Ferramenta experimental para atenção e contemplação pessoal.',
  },
  {
    id: 2,
    tag: 'Navegação Simples',
    title: 'Modo Simples',
    subtitle: 'As Sete Dimenúveis Canônicas',
    description:
      'Acesse predefinições cuidadosamente afinadas com frequências base de 108Hz a 963Hz e pulsos binaurais dedicados para diferentes estados de atenção.',
    points: [
      {
        icon: <Compass className="w-4 h-4 text-[#C5A059]" />,
        title: '7 Estados Contemplativos',
        desc: 'Desde a Respiração Fundamental (108Hz) e Foco Lúcido (432Hz) até a Consciência Cósmica (963Hz).',
      },
      {
        icon: <Radio className="w-4 h-4 text-[#C5A059]" />,
        title: 'Temporizador Contemplativo',
        desc: 'Sessões programáveis de 5 a 60 minutos com transição suave (Fade In/Out) e sino meditativo de encerramento.',
      },
      {
        icon: <Eye className="w-4 h-4 text-[#C5A059]" />,
        title: 'Visualizadores Harmônicos',
        desc: 'Espiral Áurea (φ), Círculos Sagrados do Padrão e Espelho de Fase Estéreo com modo tela cheia.',
      },
    ],
    highlight: 'Ideal para sessões imediatas de meditação, foco e trabalho profundo.',
  },
  {
    id: 3,
    tag: 'Síntese Profissional',
    title: 'Modo Laboratório',
    subtitle: 'Mixer Multicamadas & Design Acústico',
    description:
      'Crie atmosferas personalizadas combinando múltiplos geradores sonoros independentes com afinação micrométrica e balanceamento estéreo.',
    points: [
      {
        icon: <Layers className="w-4 h-4 text-[#C5A059]" />,
        title: 'Múltiplas Camadas',
        desc: 'Sobreponha tons Binaurais, Isocrônicos, Frequências Solfeggio e Ruídos Acústicos (Rosa, Marrom, Chuva, Vento).',
      },
      {
        icon: <Sliders className="w-4 h-4 text-[#C5A059]" />,
        title: 'Console de Mixagem',
        desc: 'Controles individuais de volume, pan estéreo (L/R), Solo, Mute, VU meters e limitador suave anti-clipping.',
      },
      {
        icon: <Sparkles className="w-4 h-4 text-[#C5A059]" />,
        title: 'Memória & Exportação',
        desc: 'Salve suas próprias predefinições e exporte/importe arquivos JSON com sua biblioteca de sons.',
      },
    ],
    highlight: 'Liberdade total para pesquisadores, meditadores e produtores sonoros.',
  },
  {
    id: 4,
    tag: 'Diretrizes & Ética',
    title: 'Presença & Uso Consciente',
    subtitle: 'Abidar, Observar e Retornar ao Centro',
    description:
      'O Evangelho das Dimenúveis convida você a "Abidar" — permanecer e habitar a presença consciente sem julgamentos, deixando o som apoiar sua quietude.',
    points: [
      {
        icon: <Headphones className="w-4 h-4 text-[#C5A059]" />,
        title: 'Volume Confortável',
        desc: 'Mantenha o ganho em nível suave e confortável. O efeito binaural atua pela afinação e não pela intensidade.',
      },
      {
        icon: <ShieldCheck className="w-4 h-4 text-[#C5A059]" />,
        title: 'Aviso Experimental',
        desc: 'As frequências são contemplativas e artísticas; não substituem acompanhamento médico ou terapêutico.',
      },
      {
        icon: <Compass className="w-4 h-4 text-[#C5A059]" />,
        title: 'Explore no Seu Ritmo',
        desc: 'Alterne entre os modos Simples e Laboratório conforme sua necessidade no cabeçalho superior.',
      },
    ],
    highlight: 'Você está pronto para iniciar sua experiência sonora.',
  },
];

export const SplashScreenTour: React.FC<SplashScreenTourProps> = ({
  isOpen,
  onClose,
  onSelectMode,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const handleGoToStep = (index: number) => {
    setCurrentStepIndex(index);
  };

  return (
    <div
      id="splash-screen-tour-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div
        id="splash-tour-container"
        className="relative w-full max-w-2xl bg-[#141210] border border-[#C5A059] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Top Decorative Border Accent */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#C5A059] to-transparent"></div>

        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#C5A05922]">
          <div className="flex items-center gap-3">
            {/* Sacred Emblem Icon */}
            <div className="w-7 h-7 flex items-center justify-center border border-[#C5A059] rounded-full shrink-0">
              <div className="w-3.5 h-3.5 border-t-2 border-r-2 border-[#C5A059] rounded-full rotate-45"></div>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#C5A059] font-mono block">
                Guia de Boas-Vindas
              </span>
              <span className="text-xs font-serif italic text-[#D4CBBF]">
                Passo {currentStepIndex + 1} de {TOUR_STEPS.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="skip-tour-header-btn"
              onClick={handleSkip}
              className="text-[10px] uppercase tracking-widest text-[#D4CBBF] opacity-60 hover:opacity-100 hover:text-[#C5A059] px-2.5 py-1 transition-all"
            >
              Pular Introdução
            </button>
            <button
              id="close-tour-modal-btn"
              onClick={handleSkip}
              className="text-xs font-mono uppercase tracking-widest text-[#D4CBBF]/70 hover:text-[#C5A059] bg-transparent transition-colors px-2 py-1"
              title="Fechar Guia"
            >
              Fechar
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 text-[#D4CBBF]">
          
          {/* Step Category & Titles */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border border-[#C5A05944] bg-[#1A1614] text-[9px] uppercase font-mono tracking-widest text-[#C5A059]">
              <span>{currentStep.tag}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif italic text-[#C5A059] tracking-wide pt-1">
              {currentStep.title}
            </h2>
            <p className="text-xs uppercase tracking-[0.15em] text-[#D4CBBF] opacity-75 font-medium">
              {currentStep.subtitle}
            </p>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm leading-relaxed text-[#D4CBBF] opacity-90">
            {currentStep.description}
          </p>

          {/* Key Feature Cards */}
          <div className="grid grid-cols-1 gap-2.5">
            {currentStep.points.map((point, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#1A1614] border border-[#C5A05922] flex items-start gap-3 transition-colors hover:border-[#C5A05955]"
              >
                <div className="p-2 border border-[#C5A05933] bg-[#0F0E0D] shrink-0 mt-0.5">
                  {point.icon}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h4 className="text-xs font-serif italic text-[#C5A059]">
                    {point.title}
                  </h4>
                  <p className="text-[11px] leading-relaxed text-[#D4CBBF] opacity-80">
                    {point.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Highlight Banner */}
          {currentStep.highlight && (
            <div className="p-3 bg-[#1A1614] border border-[#C5A05944] text-[11px] text-[#C5A059] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] shrink-0"></span>
              <span className="font-mono tracking-wide">{currentStep.highlight}</span>
            </div>
          )}

        </div>

        {/* Footer Navigation Bar */}
        <div className="px-6 py-4 border-t border-[#C5A05922] bg-[#0F0E0D] flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Step Indicator Dots */}
          <div className="flex items-center gap-2">
            {TOUR_STEPS.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => handleGoToStep(idx)}
                aria-label={`Ir para passo ${idx + 1}`}
                className={`transition-all ${
                  idx === currentStepIndex
                    ? 'w-6 h-1.5 bg-[#C5A059]'
                    : 'w-1.5 h-1.5 bg-[#C5A05944] hover:bg-[#C5A05988]'
                }`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {!isFirstStep && (
              <button
                id="tour-prev-btn"
                onClick={handlePrev}
                className="px-4 py-2 border border-[#C5A05933] text-[#D4CBBF] hover:text-[#C5A059] hover:border-[#C5A059] text-xs uppercase tracking-widest font-medium transition-colors flex items-center gap-1.5"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Anterior</span>
              </button>
            )}

            <button
              id="tour-next-btn"
              onClick={handleNext}
              className="px-5 py-2 bg-[#C5A059] text-[#0F0E0D] hover:bg-[#d6b26a] text-xs uppercase tracking-widest font-bold transition-colors flex items-center gap-2 shadow-md"
            >
              {isLastStep ? (
                <>
                  <span>Entrar no Laboratório</span>
                  <Check className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Próximo</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
