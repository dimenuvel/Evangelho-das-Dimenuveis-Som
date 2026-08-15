# Laboratório de Som — Evangelho das Dimenúveis

> Espaço acústico e laboratório de experimentação sonora para cultivo de presença consciente, meditação profunda e harmonia geométrica.

[![Android App](https://img.shields.io/badge/Download-Android%20APK%20(v1)-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://github.com/dimenuvel/Evangelho-das-Dimenuveis-Som/releases/)

[![Web Audio API](https://img.shields.io/badge/Audio-Web%20Audio%20API-goldenrod)](#arquitetura-do-motor-de-áudio)
[![React 19](https://img.shields.io/badge/Framework-React%2019-61dafb)](#tecnologias)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%205-blue)](#tecnologias)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%204-38bdf8)](#tecnologias)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Site Oficial](https://img.shields.io/badge/Site-Evangelho%20das%20Dimenúveis-C5A059)](https://dimenuvel.github.io/Evangelho-das-Dimenuveis-site/)

> 📱 **Aplicativo Android Disponível**: Baixe a versão para Android (APK v1.5) diretamente na aba de [Releases no GitHub](https://github.com/dimenuvel/Evangelho-das-Dimenuveis-Som/releases/tag/v1.5).

---

## 🌌 Visão Geral

O **Laboratório de Som — Evangelho das Dimenúveis** é uma aplicação web de síntese acústica em tempo real, projetada para induzir estados de atenção plena (*Abidar*), foco sustentado e serenidade interior. 

Todo o áudio é sintetizado diretamente no navegador do usuário utilizando a **Web Audio API** nativa — sem transmissões de arquivos pesados (*streaming*), sem latência e com privacidade total de dados (100% *client-side*).

---

## ✨ Principais Funcionalidades

### 1. 🪐 Modo Simples (As Sete Dimenúveis Canônicas)
- Predefinições afinadas com fundamentais harmônicas e diferenciais binaurais dedicados:
  - **1ª Dimenúvel — Respiração Fundamental (108 Hz / 1.5 Hz Delta)**: Ancoragem corporal e relaxamento profundo.
  - **2ª Dimenúvel — Águas da Presença (216 Hz / 4.0 Hz Theta)**: Introspecção, quietude e fluidez mental.
  - **3ª Dimenúvel — Claridade do Vazio (324 Hz / 7.83 Hz Schumann)**: Ressonância telúrica e calma lúcida.
  - **4ª Dimenúvel — Foco Lúcido (432 Hz / 10.0 Hz Alpha)**: Concentração sustentada, estudo e trabalho consciente.
  - **5ª Dimenúvel — Pulso Vital (528 Hz / 14.0 Hz Beta)**: Vitalidade harmônica e restauração energética.
  - **6ª Dimenúvel — Silêncio Sagrado (648 Hz / 20.0 Hz Beta)**: Clareza intuitiva e descompressão de ruídos mentais.
  - **7ª Dimenúvel — Consciência Cósmica (963 Hz / 40.0 Hz Gamma)**: Transcendência, integração e presença pura.

### 2. 🎛️ Modo Laboratório (Mixer Multicamadas & Síntese Sonora)
- **Camadas Ilimitadas**: Criação e sobreposição de osciladores Binaurais, Isocrônicos, Solfeggio e Ruídos Contemplativos.
- **Mixer Master & Faixas de Canal**:
  - Ganho individual por camada com VU meter em tempo real.
  - Controle de Panorâmica Estéreo (L / R).
  - Solo e Mute instantâneos com transição suave.
  - Modulação de Amplitude (Tremolo) e Auto-Pan por LFO parametrizável.
- **Envelope & Anti-Clipping**:
  - Bus de soma com compressão dinâmica suave (*soft-knee limiter* a -2.0 dB).
  - Interpolação de parâmetros via `setTargetAtTime` e `exponentialRampToValueAtTime` (zero *clicks*, *pops* ou degraus de fase).

### 3. 🌀 Visualizadores Harmônicos de Geometria Sagrada
- **Espiral Áurea ($\phi$)**: Projeção logarítmica com dinâmica orbital responsiva ao volume e fase sonora.
- **Círculos do Padrão**: Anéis concêntricos de interferência acústica e modulação espacial.
- **Espelho de Fase Estéreo (Lissajous)**: Correlação de fase esquerda/direita para validação da separação binaural.
- Suporte a modo **Tela Cheia** com taxa de atualização suave a 60 FPS e consumo mínimo de CPU/GPU.

### 4. ⏳ Temporizador Contemplativo & Sino Tibetano
- Sessões programadas de 5, 10, 15, 20, 30 ou 60 minutos (ou intervalo customizado).
- Transições graduais de entrada (*Fade-in*) e saída (*Fade-out*).
- Sino meditativo harmônico sintetizado (série 432 Hz, 864 Hz, 1296 Hz) ao término da prática.

### 5. 💾 Gerenciador de Presets & Portabilidade
- Salvamento local no navegador (`localStorage`).
- Exportação e importação de arquivos de configuração em formato `.json`.
- Restauração rápida para as configurações canônicas de fábrica.

---

## 📐 Arquitetura do Motor de Áudio

```
                                [Oscilador L]  --> [Gain L] --\
                                                               --> [ChannelMerger] --> [Layer Gain] --> [AM VCA (LFO)] --> [Stereo Panner] --\
                                [Oscilador R]  --> [Gain R] --/                                                                               \
                                                                                                                                               --> [Summing Bus (0.65)] --> [Soft Limiter (-2 dB)] --> [Master Gain] --> [Analyser] --> [Destination]
[LFO Modulator] -------------> [LFO Gain] ----------------------------------------------------/                                                /
                \------------> [LFO Auto-Pan Gain] -----------------------------------------------------------------------/                 /
                                                                                                                                            /
                                [Monaural / Solfeggio Osc] -------------------------> [Layer Gain] --> [AM VCA (LFO)] --> [Stereo Panner] -/
```

### Principais Garantias de Estabilidade Acústica:
1. **Desacoplamento do React Lifecycle**: O `AudioContext` e todo o grafo de nós operam em uma instância *Singleton* (`AudioEngine`) fora da árvore de componentes do React.
2. **Interpolação Analógica Contínua**: Todos os ajustes de frequência e volume utilizam constantes de tempo calibradas (25ms), eliminando descontinuidades de forma de onda.
3. **VCA Não-Invertido**: A modulação de amplitude opera estritamente no intervalo $[1.0 - \text{depth}, 1.0]$, evitando reversões acidentais de fase sonora.
4. **Buffer Estático no Visualizador**: O loop do canvas reutiliza `Uint8Array` alocados previamente para evitar pausas de *Garbage Collector* em navegadores móveis (Android/WebKit).

---

## 🛠️ Tecnologias Utilizadas

- **Core**: [React 19](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Estilização**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Áudio**: Web Audio API nativa (`AudioContext`, `OscillatorNode`, `GainNode`, `ChannelMergerNode`, `StereoPannerNode`, `DynamicsCompressorNode`, `AnalyserNode`)

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18 ou superior
- [npm](https://www.npmjs.com/) ou [pnpm](https://pnpm.io/)

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/dimenuvel/Evangelho-das-Dimenuveis-Som.git
   cd Evangelho-das-Dimenuveis-Som
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse no navegador: `http://localhost:3000`

4. **Executar verificação de tipos (Linter):**
   ```bash
   npm run lint
   ```

5. **Gerar compilação de produção:**
   ```bash
   npm run build
   ```

---

## 🎧 Recomendações de Uso

- **Fones de Ouvido**: Para usufruir da modulação das ondas binaurais, utilize fones estéreo (um canal isolado para cada ouvido).
- **Volume Confortável**: Mantenha o volume em nível moderado e agradável. A indução das ondas cerebrais ocorre pela diferença de frequência e precisão harmônica, não pela intensidade sonora.
- **Aviso Contemplativo**: Esta é uma ferramenta experimental de arte e meditação, não constituindo tratamento médico ou terapêutico.

---

## 📜 Licença & Direitos

Distribuído sob a licença **MIT**. Consulte o arquivo [`LICENSE`](LICENSE) para mais detalhes.

© 2026 **Evangelho das Dimenúveis**  
Visite o portal oficial: [https://dimenuvel.github.io/Evangelho-das-Dimenuveis-site/](https://dimenuvel.github.io/Evangelho-das-Dimenuveis-site/)
