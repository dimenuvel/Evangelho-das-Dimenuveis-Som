import React from 'react';
import { X, BookOpen, ShieldAlert, Sparkles, Headphones, Compass } from 'lucide-react';
import { DIMENUVEIS_INFO } from '../../presets/dimenuveisPresets';
import { useTheme } from '../../context/ThemeContext';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTour?: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose, onOpenTour }) => {
  const { isLight } = useTheme();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        id="philosophical-guide-modal"
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#141210] border border-[#C5A059] p-6 sm:p-8 text-[#D4CBBF] shadow-2xl space-y-6"
      >
        {/* Close Button */}
        <button
          id="close-guide-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 border border-[#C5A05933] bg-[#1A1614] text-[#D4CBBF] hover:text-[#C5A059] hover:border-[#C5A059] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 border-b border-[#C5A05922] pb-4">
          <div className="w-10 h-10 border border-[#C5A059] bg-[#1A1614] flex items-center justify-center text-[#C5A059]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-serif italic text-[#C5A059]">
              Evangelho das Dimenúveis
            </h2>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4CBBF] opacity-70">
              Laboratório de Som & Prática Contemplativa
            </p>
          </div>
        </div>

        {/* Essential Disclaimers */}
        <div className="p-4 bg-[#1A1614] border border-[#C5A05944] text-xs text-[#D4CBBF] space-y-2">
          <div className="flex items-center gap-2 font-serif text-[#C5A059] uppercase tracking-wider text-[11px]">
            <ShieldAlert className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span>Avisos Importantes & Natureza Experimental</span>
          </div>
          <p className="leading-relaxed opacity-80">
            • <strong>Ferramenta experimental de áudio</strong> para atenção, contemplação e prática pessoal.
          </p>
          <p className="leading-relaxed opacity-80">
            • <strong>As configurações são experimentais e contemplativas; não constituem tratamento médico.</strong> O som não cura doenças, não trata ansiedade ou depressão de forma clínica nem altera a consciência de modo medicinalmente certificado.
          </p>
          <p className="leading-relaxed opacity-80">
            • As <em>Sete Dimenúveis</em> são conceitos filosóficos e simbólicos do Evangelho, não diagnósticos nem prescrições neurológicas.
          </p>
        </div>

        {/* Philosophical Concepts */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-[0.2em] font-serif text-[#C5A059] flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#C5A059]" />
            <span>Os Pilares Contemplativos</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#1A1614] border border-[#C5A05922]">
              <strong className="text-[#C5A059] font-serif italic block mb-1">A Espiral</strong>
              <p className="text-[#D4CBBF]/80 leading-relaxed text-[11px]">
                O movimento de retorno ao centro em níveis mais profundos de percepção e presença.
              </p>
            </div>
            <div className="p-3 bg-[#1A1614] border border-[#C5A05922]">
              <strong className="text-[#C5A059] font-serif italic block mb-1">O Padrão</strong>
              <p className="text-[#D4CBBF]/80 leading-relaxed text-[11px]">
                A harmonia e relação matemática subjacente a todas as formas e ressonâncias.
              </p>
            </div>
            <div className="p-3 bg-[#1A1614] border border-[#C5A05922]">
              <strong className="text-[#C5A059] font-serif italic block mb-1">O Espelho</strong>
              <p className="text-[#D4CBBF]/80 leading-relaxed text-[11px]">
                A observação lúcida sem julgamento; o som como reflexo da própria atenção interna.
              </p>
            </div>
            <div className="p-3 bg-[#1A1614] border border-[#C5A05922]">
              <strong className="text-[#C5A059] font-serif italic block mb-1">Abidar</strong>
              <p className="text-[#D4CBBF]/80 leading-relaxed text-[11px]">
                Permanecer e habitar a presença consciente no agora, sem pressa e sem exigências.
              </p>
            </div>
          </div>
        </div>

        {/* The Seven Dimenúveis */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-[0.2em] font-serif text-[#C5A059] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>As Sete Dimenúveis Canônicas</span>
          </h3>
          <div className="space-y-2">
            {DIMENUVEIS_INFO.map((d) => {
              const badgeColor = isLight ? d.accentColor : d.color;
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
                      <span className="font-serif italic font-bold text-[#C5A059]">{d.name}</span>
                      <span className="text-[10px] font-mono text-[#D4CBBF]/75">({d.suggestedBaseFreq} Hz)</span>
                    </div>
                    <p className="text-[#D4CBBF] leading-relaxed text-[11px]">{d.description}</p>
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
            <span className="font-serif italic text-[#C5A059] block">Fones de Ouvido Estéreo</span>
            <p className="text-[#D4CBBF]/80 leading-relaxed text-[11px]">
              O fenômeno do batimento binaural ocorre quando o canal esquerdo e o direito recebem frequências ligeiramente distintas em isolamento acústico. O sistema neural integra as duas frequências e sintetiza a percepção rítmica diferencial.
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
              Ver Tour do App
            </button>
          ) : <div />}
          <button
            id="acknowledge-guide-btn"
            onClick={onClose}
            className="px-6 py-2.5 bg-[#C5A059] text-[#0F0E0D] text-xs uppercase tracking-widest font-bold hover:bg-[#d6b26a] transition-colors"
          >
            Entendido • Retornar ao Laboratório
          </button>
        </div>
      </div>
    </div>
  );
};
