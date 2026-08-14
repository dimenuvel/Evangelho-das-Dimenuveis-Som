import React, { useState, useRef } from 'react';
import { SoundPreset, AudioLayer } from '../../types';
import {
  X,
  BookmarkPlus,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  Edit2,
  Check,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface PresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  presets: SoundPreset[];
  currentPresetId?: string;
  onLoadPreset: (preset: SoundPreset) => void;
  onSavePreset: (name: string, description: string, layers: AudioLayer[], masterVolume: number) => void;
  onUpdatePreset: (id: string, updates: Partial<SoundPreset>) => void;
  onDeletePreset: (id: string) => void;
  onResetDefaults: () => void;
  onExportJSON: () => void;
  onImportJSON: (jsonStr: string) => { success: boolean; message: string; count?: number };
  currentLayers: AudioLayer[];
  masterVolume: number;
}

export const PresetModal: React.FC<PresetModalProps> = ({
  isOpen,
  onClose,
  presets,
  currentPresetId,
  onLoadPreset,
  onSavePreset,
  onUpdatePreset,
  onDeletePreset,
  onResetDefaults,
  onExportJSON,
  onImportJSON,
  currentLayers,
  masterVolume,
}) => {
  const [saveName, setSaveName] = useState('');
  const [saveDesc, setSaveDesc] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveName.trim()) return;
    onSavePreset(saveName, saveDesc, currentLayers, masterVolume);
    setSaveName('');
    setSaveDesc('');
    setShowSaveForm(false);
    setFeedback({ type: 'success', message: 'Predefinição pessoal salva localmente com sucesso!' });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleRename = (id: string) => {
    if (editName.trim()) {
      onUpdatePreset(id, { name: editName.trim() });
      setEditingId(null);
      setEditName('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = onImportJSON(content);
        if (result.success) {
          setFeedback({ type: 'success', message: result.message });
        } else {
          setFeedback({ type: 'error', message: result.message });
        }
        setTimeout(() => setFeedback(null), 4000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const canonicalPresets = presets.filter((p) => p.category === 'canonical');
  const contemplativePresets = presets.filter((p) => p.category === 'contemplative');
  const customPresets = presets.filter((p) => p.category === 'custom');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        id="preset-manager-modal"
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#141210] border border-[#C5A059] p-6 sm:p-8 text-[#D4CBBF] shadow-2xl space-y-6"
      >
        {/* Close Button */}
        <button
          id="close-preset-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 border border-[#C5A05933] bg-[#1A1614] text-[#D4CBBF] hover:text-[#C5A059] hover:border-[#C5A059] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-[#C5A05922] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-[#C5A059] bg-[#1A1614] flex items-center justify-center text-[#C5A059]">
              <BookmarkPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif italic text-[#C5A059]">
                Memória de Predefinições
              </h3>
              <p className="text-[10px] uppercase tracking-wider text-[#D4CBBF] opacity-70">
                Armazenamento local puro no navegador
              </p>
            </div>
          </div>

          <button
            id="toggle-save-form-btn"
            onClick={() => setShowSaveForm(!showSaveForm)}
            className="px-4 py-2 bg-[#C5A059] text-[#0F0E0D] text-xs uppercase tracking-widest font-bold hover:bg-[#d6b26a] transition-colors"
          >
            {showSaveForm ? 'Cancelar' : '+ Salvar Atual'}
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3 border flex items-center gap-2 text-xs font-medium animate-fade-in ${
              feedback.type === 'success'
                ? 'bg-[#1A1614] border-[#C5A059] text-[#C5A059]'
                : 'bg-red-950/60 border-red-800/60 text-red-300'
            }`}
          >
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-[#C5A059]" /> : <AlertCircle className="w-4 h-4" />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Save Current Preset Form */}
        {showSaveForm && (
          <form onSubmit={handleSave} className="p-4 bg-[#1A1614] border border-[#C5A05944] space-y-3 animate-fade-in">
            <h4 className="text-xs font-serif text-[#C5A059] uppercase tracking-wider">
              Salvar Configuração Atual
            </h4>
            <div className="space-y-2 text-xs">
              <input
                type="text"
                required
                placeholder="Nome da predefinição (ex: Meu Pulso Theta 6Hz)"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                className="w-full bg-[#0F0E0D] text-[#D4CBBF] px-3 py-2 border border-[#C5A05933] outline-none focus:border-[#C5A059]"
              />
              <input
                type="text"
                placeholder="Descrição breve ou intenção contemplativa (opcional)"
                value={saveDesc}
                onChange={(e) => setSaveDesc(e.target.value)}
                className="w-full bg-[#0F0E0D] text-[#D4CBBF] px-3 py-2 border border-[#C5A05933] outline-none focus:border-[#C5A059]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowSaveForm(false)}
                className="px-3 py-1.5 border border-[#C5A05933] text-[#D4CBBF] opacity-70 hover:opacity-100 text-xs uppercase tracking-wider"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#C5A059] text-[#0F0E0D] font-bold text-xs uppercase tracking-widest hover:bg-[#d6b26a]"
              >
                Gravar Predefinição
              </button>
            </div>
          </form>
        )}

        {/* 1. Custom User Presets Section */}
        {customPresets.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-serif">
              Minhas Predefinições ({customPresets.length})
            </span>
            <div className="space-y-2">
              {customPresets.map((preset) => (
                <div
                  key={preset.id}
                  className="p-3.5 bg-[#1A1614] border border-[#C5A05922] hover:border-[#C5A059] flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="space-y-0.5 min-w-0">
                    {editingId === preset.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleRename(preset.id)}
                          autoFocus
                          className="bg-[#0F0E0D] text-xs font-serif italic text-[#C5A059] px-2 py-0.5 border border-[#C5A059] outline-none"
                        />
                        <button onClick={() => handleRename(preset.id)} className="text-[#C5A059] p-1">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-serif italic text-[#C5A059] truncate">
                          {preset.name}
                        </h4>
                        <button
                          onClick={() => {
                            setEditingId(preset.id);
                            setEditName(preset.name);
                          }}
                          className="text-[#D4CBBF]/40 hover:text-[#C5A059]"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <p className="text-[11px] text-[#D4CBBF]/70 truncate">
                      {preset.description} • {preset.layers.length} camadas
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        onLoadPreset(preset);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0F0E0D] text-[10px] uppercase tracking-widest font-bold transition-colors"
                    >
                      Carregar
                    </button>
                    <button
                      onClick={() => onDeletePreset(preset.id)}
                      className="p-1.5 border border-red-900/40 text-red-400 hover:bg-red-950/60 transition-colors"
                      title="Excluir predefinição"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Canonical Seven Dimenúveis */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-serif">
            As Sete Dimenúveis Canônicas
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {canonicalPresets.map((preset) => (
              <div
                key={preset.id}
                className="p-3 bg-[#1A1614] border border-[#C5A05922] hover:border-[#C5A059] flex items-center justify-between gap-2 transition-colors"
              >
                <div className="space-y-0.5 min-w-0 text-xs">
                  <h4 className="font-serif italic text-[#C5A059] truncate">{preset.name}</h4>
                  <p className="text-[10px] text-[#D4CBBF]/70 line-clamp-1">{preset.description}</p>
                </div>
                <button
                  onClick={() => {
                    onLoadPreset(preset);
                    onClose();
                  }}
                  className="px-3 py-1 bg-[#0F0E0D] border border-[#C5A05944] hover:bg-[#C5A059] hover:text-[#0F0E0D] text-[#C5A059] text-[10px] uppercase tracking-widest font-bold shrink-0 transition-colors"
                >
                  Carregar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Contemplative Soundscapes */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-serif">
            Padrões Contemplativos Especiais
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {contemplativePresets.map((preset) => (
              <div
                key={preset.id}
                className="p-3 bg-[#1A1614] border border-[#C5A05922] hover:border-[#C5A059] flex items-center justify-between gap-2 transition-colors"
              >
                <div className="space-y-0.5 min-w-0 text-xs">
                  <h4 className="font-serif italic text-[#C5A059] truncate">{preset.name}</h4>
                  <p className="text-[10px] text-[#D4CBBF]/70 line-clamp-1">{preset.description}</p>
                </div>
                <button
                  onClick={() => {
                    onLoadPreset(preset);
                    onClose();
                  }}
                  className="px-3 py-1 bg-[#0F0E0D] border border-[#C5A05944] hover:bg-[#C5A059] hover:text-[#0F0E0D] text-[#C5A059] text-[10px] uppercase tracking-widest font-bold shrink-0 transition-colors"
                >
                  Carregar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Import / Export / Factory Reset Tools */}
        <div className="pt-3 border-t border-[#C5A05922] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            {/* Export JSON */}
            <button
              onClick={onExportJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1614] text-[#D4CBBF] hover:text-[#C5A059] border border-[#C5A05933] hover:border-[#C5A059] text-[10px] uppercase tracking-wider transition-colors"
              title="Baixar arquivo JSON com todas as predefinições"
            >
              <Download className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Exportar JSON</span>
            </button>

            {/* Import JSON */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1614] text-[#D4CBBF] hover:text-[#C5A059] border border-[#C5A05933] hover:border-[#C5A059] text-[10px] uppercase tracking-wider transition-colors"
              title="Carregar predefinições de arquivo JSON"
            >
              <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Importar JSON</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Reset Defaults */}
          <button
            onClick={() => {
              if (window.confirm('Deseja restaurar as predefinições de fábrica? Suas predefinições personalizadas serão limpas.')) {
                onResetDefaults();
                setFeedback({ type: 'success', message: 'Predefinições restauradas para o padrão!' });
                setTimeout(() => setFeedback(null), 3000);
              }
            }}
            className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#D4CBBF]/60 hover:text-[#C5A059] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrões</span>
          </button>
        </div>

      </div>
    </div>
  );
};
