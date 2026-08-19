import React from 'react';
import { BookOpen, ShieldAlert, Sparkles, Headphones, Compass } from 'lucide-react';
import { DIMENUVEIS_INFO } from '../../presets/dimenuveisPresets';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTour?: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose, onOpenTour }) => {
  const { isLight } = useTheme();
  const { t, getDimenuvelText, isEnglish } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        id="philosophical-guide-modal"
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#141210] border border-[#C5A059] p-6 sm:p-8 text-[#D4CBBF] shadow-2xl space-y-6"
      >
        {/* Title & Close Bar */}
        <div className="flex items-center justify-between gap-4 border-b border-[#C5A05922] pb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 border border-[#C5A059] bg-[#1A1614] flex items-center justify-center text-[#C5A059] shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif italic text-[#C5A059]">
                {t.guide.title}
              </h2>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4CBBF] opacity-70">
                {t.guide.subtitle}
              </p>
            </div>
          </div>

          <button
            id="close-guide-modal-btn"
            onClick={onClose}
            className="text-xs font-mono uppercase tracking-widest text-[#D4CBBF]/70 hover:text-[#C5A059] bg-transparent transition-colors px-2 py-1 shrink-0"
          >
            {isEnglish ? 'Close' : 'Fechar'}
          </button>
        </div>

        {/* Essential Disclaimers */}
        <div className="p-4 bg-[#1A1614] border border-[#C5A05944] text-xs text-[#D4CBBF] space-y-2">
          <div className="flex items-center gap-2 font-serif text-[#C5A059] uppercase tracking-wider text-[11px]">
            <ShieldAlert className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span>{t.guide.experimentalTitle}</span>
          </div>
          {t.guide.experimentalPoints.map((point, idx) => (
            <p key={idx} className="leading-relaxed opacity-80">
              • {point}
            </p>
          ))}
        </div>

        {/* Philosophical Concepts */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-[0.2em] font-serif text-[#C5A059] flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#C5A059]" />
            <span>{isEnglish ? 'Contemplative Pillars' : 'Os Pilares Contemplativos'}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#1A1614] border border-[#C5A05922]">
              <strong className="text-[#C5A059] font-serif italic block mb-1">
                {isEnglish ? 'The Spiral' : 'A Espiral'}
              </strong>
              <p className="text-[#D4CBBF]/80 leading-relaxed text-[11px]">
                {isEnglish
                  ? 'The motion of returning to the center at deeper levels of perception and presence.'
                  : 'O movimento de retorno ao centro em níveis mais profundos de percepção e presença.'}
              </p>
            </div>
            <div className="p-3 bg-[#1A1614] border border-[#C5A05922]">
              <strong className="text-[#C5A059] font-serif italic block mb-1">
                {isEnglish ? 'The Pattern' : 'O Padrão'}
              </strong>
              <p className="text-[#D4CBBF]/80 leading-relaxed text-[11px]">
                {isEnglish
                  ? 'The underlying mathematical harmony and relationship across all forms and resonances.'
                  : 'A harmonia e relação matemática subjacente a todas as formas e ressonâncias.'}
              </p>
            </div>
            <div className="p-3 bg-[#1A1614] border border-[#C5A05922]">
              <strong className="text-[#C5A059] font-serif italic block mb-1">
                {isEnglish ? 'The Mirror' : 'O Espelho'}
              </strong>
              <p className="text-[#D4CBBF]/80 leading-relaxed text-[11px]">
                {isEnglish
                  ? 'Lucid observation without judgment; sound as a mirror of inner attention.'
                  : 'A observação lúcida sem julgamento; o som como reflexo da própria atenção interna.'}
              </p>
            </div>
            <div className="p-3 bg-[#1A1614] border border-[#C5A05922]">
              <strong className="text-[#C5A059] font-serif italic block mb-1">
                {isEnglish ? 'Abidar' : 'Abidar'}
              </strong>
              <p className="text-[#D4CBBF]/80 leading-relaxed text-[11px]">
                {isEnglish
                  ? 'Remaining and inhabiting conscious presence in the now, without haste or demands.'
                  : 'Permanecer e habitar a presença consciente no agora, sem pressa e sem exigências.'}
              </p>
            </div>
          </div>
        </div>

        {/* The Seven Dimenúveis */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-[0.2em] font-serif text-[#C5A059] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>{t.guide.sevenDimenuveisTitle}</span>
          </h3>
          <div className="space-y-2">
            {DIMENUVEIS_INFO.map((d) => {
              const badgeColor = isLight ? d.accentColor : d.color;
              const localized = getDimenuvelText(d.id);
              return (
                <div
                  key={d.id}
                  className="p-3 bg-[#1A1614] border border-[#C5A05922] flex items-start gap-3"
                >
                  <span
                    className="w-7 h-7 flex items-center justify-center font-serif text-sm font-bold shrink-0 border"
                    style={{ color: badgeColor, borderColor: `${badgeColor}80`, backgroundColor: `${badgeColor}18` }}
                  >
                    {d.id}
                  </span>
                  <div className="space-y-0.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-serif italic font-bold text-[#C5A059]">{localized.name}</span>
                      <span className="text-[10px] font-mono text-[#D4CBBF]/75">({d.suggestedBaseFreq} Hz)</span>
                    </div>
                    <p className="text-[#D4CBBF] leading-relaxed text-[11px]">{localized.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Headphones & Acoustics */}
        <div className="p-3.5 bg-[#1A1614] border border-[#C5A05922] flex items-start gap-3 text-xs">
          <Headphones className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-serif italic text-[#C5A059] block">{t.guide.headphonesTitle}</span>
            <p className="text-[#D4CBBF]/80 leading-relaxed text-[11px]">
              {t.guide.headphonesDesc}
            </p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          {onOpenTour ? (
            <button
              id="guide-open-tour-btn"
              onClick={onOpenTour}
              className="px-4 py-2 border border-[#C5A05944] text-[#C5A059] hover:bg-[#C5A05911] text-xs uppercase tracking-widest transition-colors font-medium"
            >
              {t.guide.viewTour}
            </button>
          ) : <div />}
          <button
            id="acknowledge-guide-btn"
            onClick={onClose}
            className="px-6 py-2.5 bg-[#C5A059] text-[#0F0E0D] text-xs uppercase tracking-widest font-bold hover:bg-[#d6b26a] transition-colors"
          >
            {t.guide.returnToLab}
          </button>
        </div>
      </div>
    </div>
  );
};

