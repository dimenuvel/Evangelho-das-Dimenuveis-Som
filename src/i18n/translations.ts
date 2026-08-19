export type Language = 'pt' | 'en';

export interface TranslationSchema {
  common: {
    close: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    rename: string;
    reset: string;
    export: string;
    import: string;
    active: string;
    inactive: string;
    loading: string;
    success: string;
    error: string;
    confirm: string;
    yes: string;
    no: string;
    play: string;
    pause: string;
    stop: string;
    resume: string;
    continuous: string;
    minutes: string;
    seconds: string;
    version: string;
    custom: string;
    learnMore: string;
  };
  header: {
    appSubtitle: string;
    appTitle: string;
    sessionState: string;
    activePresence: string;
    atRest: string;
    simpleMode: string;
    labMode: string;
    masterVolume: string;
    playAudio: string;
    pauseAudio: string;
    lightMode: string;
    darkMode: string;
    toggleTheme: string;
    guide: string;
    guideTooltip: string;
    headphonesNotice: string;
    langButton: string;
    switchLang: string;
  };
  footer: {
    disclaimer: string;
    themeLight: string;
    themeDark: string;
    appTour: string;
    conceptsAndNotices: string;
    presets: string;
    contact: string;
    contactTooltip: string;
    contactSubject: string;
    copyright: string;
  };
  simpleMode: {
    sevenDimenuveis: string;
    archetypesOfAttention: string;
    activeArchetype: string;
    binauralPulse: string;
    unison: string;
    baseTone: string;
    contemplativeTimer: string;
    continuousSession: string;
    startSession: string;
    pauseSession: string;
    resumeSession: string;
    stopSession: string;
    customizeInLab: string;
    sessionCompletedTitle: string;
    sessionCompletedDesc: string;
    activeVisualizer: string;
    expandToLabNotice: string;
    contemplativeFocusLabel: string;
  };
  labMode: {
    labBadge: string;
    layersTab: string;
    mixerTab: string;
    sessionTab: string;
    visualizerTab: string;
    diagnostics: string;
    activeLayers: string;
    addLayer: string;
    savePreset: string;
    presetsLibrary: string;
    diagnosticsTitle: string;
    sampleRate: string;
    audioContextState: string;
    activeOscillators: string;
    estimatedCpu: string;
    sessionPracticeCompletedTitle: string;
    sessionPracticeCompletedDesc: string;
    audioVisualizerTitle: string;
    audioVisualizerDesc: string;
    sessionTimerTitle: string;
    sessionTimerDesc: string;
    timerCustomMinutes: string;
    startTimer: string;
    fadeInOutNotice: string;
  };
  layerCard: {
    layer: string;
    enableLayer: string;
    disableLayer: string;
    clickToRename: string;
    solo: string;
    soloActive: string;
    mute: string;
    muted: string;
    duplicate: string;
    remove: string;
    binaural: string;
    binauralPair: string;
    monaural: string;
    monauralTone: string;
    ambientTexture: string;
    leftFrequency: string;
    leftChannel: string;
    rightFrequency: string;
    rightChannel: string;
    frequencyHz: string;
    centerFrequency: string;
    beatDifference: string;
    binauralBeatLabel: string;
    fineTune: string;
    waveform: string;
    sine: string;
    triangle: string;
    square: string;
    sawtooth: string;
    harmonicShortcuts: string;
    harmonicReference: string;
    volume: string;
    layerVolume: string;
    stereoPan: string;
    modulationLFO: string;
    rhythmicModulation: string;
    modulationRate: string;
    modulationDepth: string;
    depth: string;
    type: string;
    continuous: string;
    pulsed: string;
    continuousWave: string;
    rhythmicPulse: string;
    autoPan: string;
    autoPanDesc: string;
    bpmSync: string;
  };
  mixer: {
    consoleTitle: string;
    consoleDesc: string;
    acousticConsoleTitle: string;
    acousticConsoleDesc: string;
    antiClippingActive: string;
    masterFader: string;
    panLabel: string;
    panCenter: string;
    panLeft: string;
    panRight: string;
    channelVolume: string;
    stereoOutput: string;
    limiter: string;
    softClip: string;
    softLimiterNotice: string;
  };
  presets: {
    modalTitle: string;
    modalSubtitle: string;
    memoryTitle: string;
    memoryDesc: string;
    cancel: string;
    close: string;
    saveCurrent: string;
    savePresetTitle: string;
    saveCurrentConfig: string;
    recordPreset: string;
    presetNamePlaceholder: string;
    presetDescPlaceholder: string;
    saveButton: string;
    canonicalCategory: string;
    canonicalTitle: string;
    contemplativeCategory: string;
    contemplativeTitle: string;
    customCategory: string;
    myPresets: string;
    rename: string;
    deletePreset: string;
    noCustomPresets: string;
    loadPreset: string;
    load: string;
    reload: string;
    active: string;
    layersCount: string;
    exportJSON: string;
    importJSON: string;
    resetDefaults: string;
    restoreDefaults: string;
    resetConfirm: string;
    restoreConfirm: string;
    deleteConfirm: string;
    savedSuccess: string;
    resetSuccess: string;
    restoredSuccess: string;
    exportSuccess: string;
    importSuccess: string;
    invalidFileError: string;
  };
  guide: {
    title: string;
    subtitle: string;
    sevenDimenuveisTitle: string;
    sevenDimenuveisDesc: string;
    acousticTitle: string;
    acousticDesc: string;
    headphonesTitle: string;
    headphonesDesc: string;
    binauralPhenomenonTitle: string;
    binauralPhenomenonDesc: string;
    experimentalTitle: string;
    experimentalPoints: string[];
    viewTour: string;
    returnToLab: string;
  };
  tour: {
    next: string;
    prev: string;
    skip: string;
    startExperience: string;
    goToSimple: string;
    goToLab: string;
    steps: {
      step1Tag: string;
      step1Title: string;
      step1Subtitle: string;
      step1Desc: string;
      step1Point1Title: string;
      step1Point1Desc: string;
      step1Point2Title: string;
      step1Point2Desc: string;
      step1Point3Title: string;
      step1Point3Desc: string;
      step1Highlight: string;

      step2Tag: string;
      step2Title: string;
      step2Subtitle: string;
      step2Desc: string;
      step2Point1Title: string;
      step2Point1Desc: string;
      step2Point2Title: string;
      step2Point2Desc: string;
      step2Point3Title: string;
      step2Point3Desc: string;
      step2Highlight: string;

      step3Tag: string;
      step3Title: string;
      step3Subtitle: string;
      step3Desc: string;
      step3Point1Title: string;
      step3Point1Desc: string;
      step3Point2Title: string;
      step3Point2Desc: string;
      step3Point3Title: string;
      step3Point3Desc: string;
      step3Highlight: string;

      step4Tag: string;
      step4Title: string;
      step4Subtitle: string;
      step4Desc: string;
      step4Point1Title: string;
      step4Point1Desc: string;
      step4Point2Title: string;
      step4Point2Desc: string;
      step4Point3Title: string;
      step4Point3Desc: string;
      step4Highlight: string;
    };
  };
  visualizer: {
    spiral: string;
    circles: string;
    mirror: string;
    waveform: string;
    off: string;
    offTitle: string;
    offDesc: string;
    enableSpiral: string;
    goldenSpiral: string;
    concentricCircles: string;
    mirrorOscilloscope: string;
    harmonicWaveform: string;
    fullscreen: string;
    exitFullscreen: string;
    fullscreenContemplation: string;
    goldenSpiralTitle: string;
    sacredCirclesTitle: string;
    phaseMirrorTitle: string;
    oscilloscopeTitle: string;
  };
  dimenuveis: Record<number, {
    name: string;
    subtitle: string;
    description: string;
    contemplativeFocus: string;
    presetDescription: string;
  }>;
  contemplativePresetsData: Record<string, {
    name: string;
    description: string;
  }>;
  bands: {
    unison: { name: string; desc: string };
    delta: { name: string; desc: string };
    theta: { name: string; desc: string };
    alpha: { name: string; desc: string };
    beta: { name: string; desc: string };
    gamma: { name: string; desc: string };
  };
}

export const translations: Record<Language, TranslationSchema> = {
  pt: {
    common: {
      close: 'Fechar',
      cancel: 'Cancelar',
      save: 'Salvar',
      delete: 'Excluir',
      edit: 'Editar',
      rename: 'Renomear',
      reset: 'Restaurar Padrões',
      export: 'Exportar JSON',
      import: 'Importar JSON',
      active: 'Ativo',
      inactive: 'Inativo',
      loading: 'Carregando...',
      success: 'Sucesso',
      error: 'Erro',
      confirm: 'Confirmar',
      yes: 'Sim',
      no: 'Não',
      play: 'Iniciar Áudio',
      pause: 'Pausar Áudio',
      stop: 'Parar Áudio',
      resume: 'Retomar Áudio',
      continuous: 'Contínuo',
      minutes: 'min',
      seconds: 'seg',
      version: 'v1.3',
      custom: 'Personalizado',
      learnMore: 'Saiba mais',
    },
    header: {
      appSubtitle: 'Evangelho das Dimenúveis',
      appTitle: 'Laboratório de Som',
      sessionState: 'Estado de Sessão',
      activePresence: 'PRESENÇA ATIVA',
      atRest: 'EM REPOUSO',
      simpleMode: 'Simples',
      labMode: 'Laboratório',
      masterVolume: 'Volume Geral Master',
      playAudio: 'Iniciar Áudio',
      pauseAudio: 'Pausar Áudio',
      lightMode: 'Modo Claro (Luz Sacra)',
      darkMode: 'Modo Escuro (Trevas)',
      toggleTheme: 'Alternar Tema',
      guide: 'Guia',
      guideTooltip: 'Conceitos & Avisos',
      headphonesNotice: 'Fones recomendados para separação estereofônica de batimentos binaurais',
      langButton: 'EN',
      switchLang: 'Mudar para Inglês (English)',
    },
    footer: {
      disclaimer: 'As configurações são experimentais e contemplativas; não constituem tratamento médico.',
      themeLight: 'Modo Claro',
      themeDark: 'Modo Escuro',
      appTour: 'Tour do App',
      conceptsAndNotices: 'Conceitos & Avisos',
      presets: 'Predefinições',
      contact: 'Contato',
      contactTooltip: 'Enviar e-mail para samuel.tiem@proton.me',
      contactSubject: 'Contato — Laboratório de Som das Dimenúveis',
      copyright: '© Evangelho das Dimenúveis v1.5',
    },
    simpleMode: {
      sevenDimenuveis: 'As Sete Dimenúveis',
      archetypesOfAttention: 'Arquétipos de Atenção',
      activeArchetype: 'Arquétipo Ativo',
      binauralPulse: 'Pulso Binaural',
      unison: 'Uníssono',
      baseTone: 'Tom Base',
      contemplativeTimer: 'Temporizador Contemplativo',
      continuousSession: 'Sessão Contínua (Sem limite de tempo)',
      startSession: 'Iniciar Prática',
      pauseSession: 'Pausar Sessão',
      resumeSession: 'Retomar Sessão',
      stopSession: 'Encerrar Sessão',
      customizeInLab: 'Personalizar no Laboratório',
      sessionCompletedTitle: 'Sessão Contemplativa Concluída',
      sessionCompletedDesc: 'O som foi atenuado suavemente. Permaneça no silêncio da presença.',
      activeVisualizer: 'Visualizador de Geometria Harmônica',
      expandToLabNotice: 'Deseja modular parâmetros finos ou adicionar camadas sonoras?',
      contemplativeFocusLabel: 'Foco Contemplativo',
    },
    labMode: {
      labBadge: 'LABORATÓRIO',
      layersTab: 'Camadas Sonoras',
      mixerTab: 'Console de Mixagem',
      sessionTab: 'Sessão & Temporizador',
      visualizerTab: 'Visualizador Harmônico',
      diagnostics: 'Diagnósticos de Áudio',
      activeLayers: 'Camadas Ativas',
      addLayer: '+ Nova Camada',
      savePreset: 'Salvar Predefinição',
      presetsLibrary: 'Biblioteca',
      diagnosticsTitle: 'Telemetria do Motor de Áudio (Web Audio API)',
      sampleRate: 'Taxa de Amostragem',
      audioContextState: 'Estado do AudioContext',
      activeOscillators: 'Osciladores Sintetizados',
      estimatedCpu: 'Carga de Processamento',
      sessionPracticeCompletedTitle: 'Sessão de Prática Concluída',
      sessionPracticeCompletedDesc: 'Transição suave finalizada. A quietude permanece.',
      audioVisualizerTitle: 'Visualização da Geometria Sonora',
      audioVisualizerDesc: 'Representação em tempo real do campo de fase e harmonia acústica.',
      sessionTimerTitle: 'Temporizador de Imersão Contemplativa',
      sessionTimerDesc: 'Ajuste a duração da prática com transição acústica suave (Fade Out).',
      timerCustomMinutes: 'Duração Personalizada (minutos):',
      startTimer: 'Iniciar Temporizador',
      fadeInOutNotice: 'O sistema atenua os osciladores gradualmente nos últimos 15 segundos para evitar cortes abruptos.',
    },
    layerCard: {
      layer: 'Camada',
      enableLayer: 'Ativar Camada',
      disableLayer: 'Desativar Camada',
      clickToRename: 'Clique para renomear',
      solo: 'Solo',
      soloActive: 'Solo Ativo',
      mute: 'Mudo',
      muted: 'Mutado',
      duplicate: 'Duplicar',
      remove: 'Remover',
      binaural: 'Binaural (Estéreo)',
      binauralPair: 'Par Binaural (Estéreo)',
      monaural: 'Mono / Isocrônico',
      monauralTone: 'Tom Monoaural (Centro)',
      ambientTexture: 'Textura Sonora Contínua',
      leftFrequency: 'Canal Esquerdo (L)',
      leftChannel: 'Canal Esquerdo (L)',
      rightFrequency: 'Canal Direito (R)',
      rightChannel: 'Canal Direito (R)',
      frequencyHz: 'Frequência Central',
      centerFrequency: 'Frequência Central',
      beatDifference: 'Diferencial de Pulso (Batimento)',
      binauralBeatLabel: 'Pulso Binaural Resultante',
      fineTune: 'Ajuste Fino',
      waveform: 'Forma de Onda',
      sine: 'Senoidal',
      triangle: 'Triangular',
      square: 'Quadrada',
      sawtooth: 'Serra',
      harmonicShortcuts: 'Atalhos Harmônicos',
      harmonicReference: 'Referências Harmônicas Áureas & Pitagóricas',
      volume: 'Volume da Camada',
      layerVolume: 'Volume da Camada',
      stereoPan: 'Balanço Estéreo (Pan)',
      modulationLFO: 'Modulação de Amplitude (LFO)',
      rhythmicModulation: 'Modulação Rítmica (LFO)',
      modulationRate: 'Frequência do LFO',
      modulationDepth: 'Profundidade da Modulação',
      depth: 'Profundidade',
      type: 'Tipo',
      continuous: 'Contínua',
      pulsed: 'Pulsada',
      continuousWave: 'Onda Contínua',
      rhythmicPulse: 'Pulso Rítmico',
      autoPan: 'Auto-Pan Estéreo',
      autoPanDesc: 'Oscilação suave entre os ouvidos esquerdo e direito',
      bpmSync: 'Sincronizar BPM',
    },
    mixer: {
      consoleTitle: 'Console de Mixagem Acústica',
      consoleDesc: 'Controle individual de ganho, balanço estéreo e barramento de soma com limitador suave',
      acousticConsoleTitle: 'Console de Mixagem Acústica',
      acousticConsoleDesc: 'Controle individual de ganho, balanço estéreo e barramento de soma com limitador suave',
      antiClippingActive: 'Proteção Anti-Clipping Ativa',
      masterFader: 'Fader Master Geral',
      panLabel: 'Pan',
      panCenter: 'Centro',
      panLeft: 'Esq',
      panRight: 'Dir',
      channelVolume: 'Volume do Canal',
      stereoOutput: 'Saída Master Estéreo',
      limiter: 'Limitador Suave',
      softClip: 'Anti-Clipping',
      softLimiterNotice: 'Barramento calibrado para evitar distorção harmônica e proteger a audição.',
    },
    presets: {
      modalTitle: 'Memória de Predefinições',
      modalSubtitle: 'Armazenamento local puro no navegador',
      memoryTitle: 'Memória de Predefinições',
      memoryDesc: 'Armazenamento local puro no navegador',
      cancel: 'Cancelar',
      close: 'Fechar',
      saveCurrent: '+ Salvar Atual',
      savePresetTitle: 'Salvar Predefinição Atual',
      saveCurrentConfig: 'Salvar Configuração Sonora Atual',
      recordPreset: 'Gravar Predefinição',
      presetNamePlaceholder: 'Nome da predefinição...',
      presetDescPlaceholder: 'Descrição ou propósito contemplativo...',
      saveButton: 'Salvar na Memória Local',
      canonicalCategory: 'Canônicas — As Sete Dimenúveis',
      canonicalTitle: 'Canônicas — As Sete Dimenúveis',
      contemplativeCategory: 'Composições Contemplativas Especiais',
      contemplativeTitle: 'Composições Contemplativas Especiais',
      customCategory: 'Suas Predefinições Personalizadas',
      myPresets: 'Suas Predefinições',
      rename: 'Renomear',
      deletePreset: 'Excluir Predefinição',
      noCustomPresets: 'Nenhuma predefinição personalizada salva ainda. Crie e salve combinações no Laboratório.',
      loadPreset: 'Carregar Predefinição',
      load: 'Carregar',
      reload: 'Recarregar',
      active: 'Ativa',
      layersCount: 'camadas',
      exportJSON: 'Exportar Banco (JSON)',
      importJSON: 'Importar Banco (JSON)',
      resetDefaults: 'Restaurar Originais',
      restoreDefaults: 'Restaurar Originais',
      resetConfirm: 'Deseja restaurar as predefinições padrão? Suas predefinições personalizadas serão mantidas.',
      restoreConfirm: 'Deseja restaurar as predefinições padrão? Suas predefinições personalizadas serão mantidas.',
      deleteConfirm: 'Tem certeza que deseja excluir esta predefinição?',
      savedSuccess: 'Predefinição pessoal salva localmente com sucesso!',
      resetSuccess: 'Predefinições restauradas para o estado original.',
      restoredSuccess: 'Predefinições restauradas para o estado original.',
      exportSuccess: 'Arquivo JSON exportado com sucesso.',
      importSuccess: 'Predefinições importadas com sucesso!',
      invalidFileError: 'Arquivo JSON inválido ou corrompido.',
    },
    guide: {
      title: 'Guia Filosófico & Acústico',
      subtitle: 'Evangelho das Dimenúveis — Princípios do Som & Contemplação',
      sevenDimenuveisTitle: 'As Sete Dimenúveis do Som',
      sevenDimenuveisDesc: 'Cada dimenúvel é um portal de presença, associado a arquétipos de consciência e frequências de ressonância natural.',
      acousticTitle: 'Geometria Sonora & Harmonia Natural',
      acousticDesc: 'O laboratório utiliza relações matemáticas como a Proporção Áurea (φ 1.618), 432 Hz e a afinação pitagórica para criar padrões acústicos límpidos e equilibrados.',
      headphonesTitle: 'Uso de Fones de Ouvido',
      headphonesDesc: 'O fenômeno do batimento binaural ocorre quando o canal esquerdo e o direito recebem frequências ligeiramente distintas em isolamento acústico. O sistema neural integra as duas frequências e sintetiza a percepção rítmica diferencial.',
      binauralPhenomenonTitle: 'O Fenômeno do Batimento Binaural',
      binauralPhenomenonDesc: 'Descoberto acusticamente por Heinrich Wilhelm Dove em 1839, surge quando dois tons puros de frequências próximas são apresentados separadamente a cada ouvido.',
      experimentalTitle: 'Avisos & Conceitos',
      experimentalPoints: [
        'Ferramenta experimental de áudio para atenção, contemplação e prática pessoal.',
        'As Sete Dimenúveis são conceitos filosóficos e simbólicos do Evangelho, não diagnósticos nem prescrições neurológicas.',
      ],
      viewTour: 'Ver Tour do App',
      returnToLab: 'Entendido • Retornar ao Laboratório',
    },
    tour: {
      next: 'Próximo',
      prev: 'Anterior',
      skip: 'Pular Tour',
      startExperience: 'Iniciar Experiência',
      goToSimple: 'Iniciar no Modo Simples',
      goToLab: 'Abrir no Laboratório',
      steps: {
        step1Tag: 'Introdução & Propósito',
        step1Title: 'Evangelho das Dimenúveis',
        step1Subtitle: 'Laboratório de Som & Prática Contemplativa',
        step1Desc: 'Um espaço acústico projetado para cultivar presença consciente, concentração profunda e serenidade através de frequências harmônicas, batimentos binaurais e geometria sonora.',
        step1Point1Title: 'Áudio em Tempo Real',
        step1Point1Desc: 'Síntese sonora sintetizada diretamente pelo navegador via Web Audio API, sem streaming nem latência.',
        step1Point2Title: 'Privacidade Total',
        step1Point2Desc: '100% local e privado — suas predefinições e sessões ficam armazenadas exclusivamente no seu dispositivo.',
        step1Point3Title: 'Isolamento Estéreo',
        step1Point3Desc: 'Utilize fones de ouvido para experienciar a separação física essencial dos batimentos binaurais.',
        step1Highlight: 'Ferramenta experimental para atenção e contemplação pessoal.',

        step2Tag: 'Navegação Simples',
        step2Title: 'Modo Simples',
        step2Subtitle: 'As Sete Dimenúveis Canônicas',
        step2Desc: 'Acesse predefinições cuidadosamente afinadas com frequências base de 54Hz a 432Hz e pulsos binaurais dedicados para diferentes estados de atenção.',
        step2Point1Title: '7 Estados Contemplativos',
        step2Point1Desc: 'Desde a Quietude Fundamental (Silêncio) e Foco Lúcido (Mente) até a Ancoragem Corpórea (Matéria).',
        step2Point2Title: 'Temporizador Contemplativo',
        step2Point2Desc: 'Sessões programáveis de 5 a 60 minutos com transição suave (Fade In/Out) e sino meditativo de encerramento.',
        step2Point3Title: 'Visualizadores Harmônicos',
        step2Point3Desc: 'Espiral Áurea (φ), Círculos Sagrados do Padrão e Espelho de Fase Estéreo com modo tela cheia.',
        step2Highlight: 'Ideal para sessões imediatas de meditação, foco e trabalho profundo.',

        step3Tag: 'Síntese Profissional',
        step3Title: 'Modo Laboratório',
        step3Subtitle: 'Mixer Multicamadas & Design Acústico',
        step3Desc: 'Crie atmosferas personalizadas combinando múltiplos geradores sonoros independentes com afinação micrométrica e balanceamento estéreo.',
        step3Point1Title: 'Múltiplas Camadas',
        step3Point1Desc: 'Sobreponha tons Binaurais, Monaurais, Frequências Harmônicas e Ondas de Modulação LFO.',
        step3Point2Title: 'Console de Mixagem',
        step3Point2Desc: 'Controles individuais de volume, pan estéreo (L/R), Solo, Mute, VU meters e limitador suave anti-clipping.',
        step3Point3Title: 'Memória & Exportação',
        step3Point3Desc: 'Salve suas próprias predefinições e exporte/importe arquivos JSON com sua biblioteca de sons.',
        step3Highlight: 'Liberdade total para pesquisadores, meditadores e produtores sonoros.',

        step4Tag: 'Diretrizes & Ética',
        step4Title: 'Presença & Uso Consciente',
        step4Subtitle: 'Abidar, Observar e Retornar ao Centro',
        step4Desc: 'O Evangelho das Dimenúveis convida você a "Abidar" — permanecer e habitar a presença consciente sem julgamentos, deixando o som apoiar sua quietude.',
        step4Point1Title: 'Volume Confortável',
        step4Point1Desc: 'Mantenha o ganho em nível suave e confortável. O efeito binaural atua pela afinação e não pela intensidade.',
        step4Point2Title: 'Aviso Experimental',
        step4Point2Desc: 'As frequências são contemplativas e artísticas; não substituem acompanhamento médico ou terapêutico.',
        step4Point3Title: 'Explore no Seu Ritmo',
        step4Point3Desc: 'Alterne entre os modos Simples e Laboratório conforme sua necessidade no cabeçalho superior.',
        step4Highlight: 'Você está pronto para iniciar sua experiência sonora.',
      },
    },
    visualizer: {
      spiral: 'Espiral Áurea (φ)',
      circles: 'Círculos do Padrão',
      mirror: 'Espelho de Fase',
      waveform: 'Osciloscópio',
      off: 'Visualizador Desligado',
      offTitle: 'Visualizador Geométrico Desligado',
      offDesc: 'O motor de áudio continua gerando harmônicos em segundo plano.',
      enableSpiral: 'Ativar Espiral Áurea',
      goldenSpiral: 'Espiral Áurea (φ)',
      concentricCircles: 'Círculos do Padrão',
      mirrorOscilloscope: 'Espelho de Fase',
      harmonicWaveform: 'Osciloscópio Harmônico',
      fullscreen: 'Tela Cheia',
      exitFullscreen: 'Sair da Tela Cheia',
      fullscreenContemplation: 'Contemplação em Tela Cheia',
      goldenSpiralTitle: 'Espiral Áurea Proporcional',
      sacredCirclesTitle: 'Círculos Sagrados de Ressonância',
      phaseMirrorTitle: 'Espelho de Interferência de Fase',
      oscilloscopeTitle: 'Osciloscópio de Onda em Tempo Real',
    },
    dimenuveis: {
      1: {
        name: 'Silêncio',
        subtitle: '1ª Dimenúvel — O Ponto de Partida',
        description: 'Som mínimo e essencial. O espaço antes da manifestação e a quietude fundamental.',
        contemplativeFocus: 'Repouso da mente, quietude interior e percepção do vazio fecundo.',
        presetDescription: 'Som mínimo e essencial. Um tom sub-harmônico suave com pulso lento de 2 Hz.',
      },
      2: {
        name: 'Visão',
        subtitle: '2ª Dimenúvel — A Percepção Espacial',
        description: 'Ambiente espaçoso de transformação lenta. Abertura do campo perceptivo e amplitude.',
        contemplativeFocus: 'Observação sem apego, expansão do horizonte e contemplação.',
        presetDescription: 'Ambiente espaçoso com pulso de 6 Hz e harmônico brilhante de 432 Hz.',
      },
      3: {
        name: 'Mente',
        subtitle: '3ª Dimenúvel — O Padrão Lúcido',
        description: 'Padrões organizados e lúcidos. Harmonia matemática, clareza e discernimento sereno.',
        contemplativeFocus: 'Clareza de pensamento, presença consciente e ordenação interior.',
        presetDescription: 'Padrão lúcido e ordenado com pulso Alpha de 10 Hz e harmônico tríade de 216 Hz.',
      },
      4: {
        name: 'Coração',
        subtitle: '4ª Dimenúvel — A Ressonância Acolhedora',
        description: 'Modulação suave, calor e ressonância. A dimensão do acolhimento e da comunhão.',
        contemplativeFocus: 'Empatia, aceitação, serenidade cordial e dissolução de resistências.',
        presetDescription: 'Modulação calorosa baseada no tom ressonante de 136.1 Hz e pulso suave de 5.5 Hz.',
      },
      5: {
        name: 'Vontade',
        subtitle: '5ª Dimenúvel — A Direção e o Foco',
        description: 'Estrutura rítmica definida. O impulso da intenção consciente e da determinação serena.',
        contemplativeFocus: 'Foco sustentado, firmeza de propósito e presença ativa no agora.',
        presetDescription: 'Estrutura rítmica com pulso de 14 Hz e base sólida em 256 Hz.',
      },
      6: {
        name: 'Energia',
        subtitle: '6ª Dimenúvel — O Movimento Vibrante',
        description: 'Movimento e atividade rítmica expansiva. O dinamismo da criação e a força viva.',
        contemplativeFocus: 'Vitalidade desperta, circulação da atenção e dinamismo consciente.',
        presetDescription: 'Movimento vibrante com modulação dinâmica de 18 Hz e pulsação estéreo.',
      },
      7: {
        name: 'Matéria',
        subtitle: '7ª Dimenúvel — O Aterramento Profundo',
        description: 'Frequências graves, sustentadas e telúricas. O ancoramento no corpo e na realidade física.',
        contemplativeFocus: 'Aterramento corpóreo, peso agradável, estabilidade e presença sólida.',
        presetDescription: 'Frequências graves, sustentadas e telúricas com pulso delta de 3.5 Hz.',
      },
    },
    contemplativePresetsData: {
      'preset-espiral-aurea': {
        name: 'A Espiral Áurea (φ 1.618)',
        description: 'Camadas proporcionais à proporção áurea com 432 Hz como semente central.',
      },
      'preset-o-padrao': {
        name: 'O Padrão (Tríade Harmônica 528 Hz)',
        description: 'Exploração contemplativa da frequência de 528 Hz em tríade equilibrada.',
      },
      'preset-o-espelho': {
        name: 'O Espelho (Fases Cruzadas)',
        description: 'Dois pares binaurais opostos criando um campo sonoro tridimensional imersivo.',
      },
      'preset-respiracao-abidar': {
        name: 'Abidar — Respiração Contemplativa',
        description: 'Cadência lenta sincronizada em 6 respirações por minuto (0.1 Hz) para ancoramento na presença.',
      },
    },
    bands: {
      unison: {
        name: 'Uníssono',
        desc: 'Tom contínuo em fase idêntica em ambos os canais.',
      },
      delta: {
        name: 'Pulso Lento (Delta)',
        desc: 'Modulação profunda e repousante, sugerindo silêncio e aterramento.',
      },
      theta: {
        name: 'Pulso Suave (Theta)',
        desc: 'Oscilação fluida para contemplação, imaginação e interioridade.',
      },
      alpha: {
        name: 'Pulso Sereno (Alpha)',
        desc: 'Cadência equilibrada para presença lúcida e observação calma.',
      },
      beta: {
        name: 'Pulso Ativo (Beta)',
        desc: 'Ritmo focado e estruturado para atenção e vontade dirigida.',
      },
      gamma: {
        name: 'Pulso Rápido (Gamma)',
        desc: 'Vibração rápida e integradora para exploração de padrões complexos.',
      },
    },
  },
  en: {
    common: {
      close: 'Close',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      rename: 'Rename',
      reset: 'Reset Defaults',
      export: 'Export JSON',
      import: 'Import JSON',
      active: 'Active',
      inactive: 'Inactive',
      loading: 'Loading...',
      success: 'Success',
      error: 'Error',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
      play: 'Start Audio',
      pause: 'Pause Audio',
      stop: 'Stop Audio',
      resume: 'Resume Audio',
      continuous: 'Continuous',
      minutes: 'min',
      seconds: 'sec',
      version: 'v1.3',
      custom: 'Custom',
      learnMore: 'Learn more',
    },
    header: {
      appSubtitle: 'Gospel of Dimenuous',
      appTitle: 'Sound Laboratory',
      sessionState: 'Session State',
      activePresence: 'ACTIVE PRESENCE',
      atRest: 'AT REST',
      simpleMode: 'Simple',
      labMode: 'Laboratory',
      masterVolume: 'Master Volume',
      playAudio: 'Start Audio',
      pauseAudio: 'Pause Audio',
      lightMode: 'Light Mode (Sacred Light)',
      darkMode: 'Dark Mode (Deep Stillness)',
      toggleTheme: 'Toggle Theme',
      guide: 'Guide',
      guideTooltip: 'Concepts & Notices',
      headphonesNotice: 'Headphones recommended for binaural beat stereophonic separation',
      langButton: 'PT',
      switchLang: 'Mudar para Português (Portuguese)',
    },
    footer: {
      disclaimer: 'Settings are experimental and contemplative; they do not constitute medical treatment.',
      themeLight: 'Light Mode',
      themeDark: 'Dark Mode',
      appTour: 'App Tour',
      conceptsAndNotices: 'Concepts & Notices',
      presets: 'Presets',
      contact: 'Contact',
      contactTooltip: 'Send email to samuel.tiem@proton.me',
      contactSubject: 'Contact — Dimenuous Sound Laboratory',
      copyright: '© Gospel of Dimenuous v1.5',
    },
    simpleMode: {
      sevenDimenuveis: 'The Seven Dimenuous',
      archetypesOfAttention: 'Archetypes of Attention',
      activeArchetype: 'Active Archetype',
      binauralPulse: 'Binaural Pulse',
      unison: 'Unison',
      baseTone: 'Base Tone',
      contemplativeTimer: 'Contemplative Timer',
      continuousSession: 'Continuous Session (No time limit)',
      startSession: 'Start Practice',
      pauseSession: 'Pause Session',
      resumeSession: 'Resume Session',
      stopSession: 'End Session',
      customizeInLab: 'Customize in Laboratory',
      sessionCompletedTitle: 'Contemplative Session Completed',
      sessionCompletedDesc: 'The sound has faded out gently. Remain in the silence of presence.',
      activeVisualizer: 'Harmonic Geometry Visualizer',
      expandToLabNotice: 'Would you like to fine-tune modulation parameters or add sound layers?',
      contemplativeFocusLabel: 'Contemplative Focus',
    },
    labMode: {
      labBadge: 'LABORATORY',
      layersTab: 'Sound Layers',
      mixerTab: 'Mixer Console',
      sessionTab: 'Session & Timer',
      visualizerTab: 'Harmonic Visualizer',
      diagnostics: 'Audio Diagnostics',
      activeLayers: 'Active Layers',
      addLayer: '+ New Layer',
      savePreset: 'Save Preset',
      presetsLibrary: 'Library',
      diagnosticsTitle: 'Audio Engine Telemetry (Web Audio API)',
      sampleRate: 'Sample Rate',
      audioContextState: 'AudioContext State',
      activeOscillators: 'Synthesized Oscillators',
      estimatedCpu: 'Processing Load',
      sessionPracticeCompletedTitle: 'Practice Session Completed',
      sessionPracticeCompletedDesc: 'Gentle fade-out finished. Stillness remains.',
      audioVisualizerTitle: 'Sound Geometry Visualization',
      audioVisualizerDesc: 'Real-time representation of the phase field and acoustic harmony.',
      sessionTimerTitle: 'Contemplative Immersion Timer',
      sessionTimerDesc: 'Set practice duration with smooth acoustic transition (Fade Out).',
      timerCustomMinutes: 'Custom Duration (minutes):',
      startTimer: 'Start Timer',
      fadeInOutNotice: 'The system gently attenuates oscillators over the final 15 seconds to prevent sudden dropouts.',
    },
    layerCard: {
      layer: 'Layer',
      enableLayer: 'Enable Layer',
      disableLayer: 'Disable Layer',
      clickToRename: 'Click to rename',
      solo: 'Solo',
      soloActive: 'Solo Active',
      mute: 'Mute',
      muted: 'Muted',
      duplicate: 'Duplicate',
      remove: 'Remove',
      binaural: 'Binaural (Stereo)',
      binauralPair: 'Binaural Pair (Stereo)',
      monaural: 'Mono / Isochronic',
      monauralTone: 'Monaural Tone (Center)',
      ambientTexture: 'Continuous Ambient Texture',
      leftFrequency: 'Left Channel (L)',
      leftChannel: 'Left Channel (L)',
      rightFrequency: 'Right Channel (R)',
      rightChannel: 'Right Channel (R)',
      frequencyHz: 'Center Frequency',
      centerFrequency: 'Center Frequency',
      beatDifference: 'Pulse Differential (Beat)',
      binauralBeatLabel: 'Resulting Binaural Pulse',
      fineTune: 'Fine Tuning',
      waveform: 'Waveform',
      sine: 'Sine',
      triangle: 'Triangle',
      square: 'Square',
      sawtooth: 'Sawtooth',
      harmonicShortcuts: 'Harmonic Shortcuts',
      harmonicReference: 'Golden Ratio & Pythagorean Harmonic References',
      volume: 'Layer Volume',
      layerVolume: 'Layer Volume',
      stereoPan: 'Stereo Balance (Pan)',
      modulationLFO: 'Amplitude Modulation (LFO)',
      rhythmicModulation: 'Rhythmic Modulation (LFO)',
      modulationRate: 'LFO Frequency',
      modulationDepth: 'Modulation Depth',
      depth: 'Depth',
      type: 'Type',
      continuous: 'Continuous',
      pulsed: 'Pulsed',
      continuousWave: 'Continuous Wave',
      rhythmicPulse: 'Rhythmic Pulse',
      autoPan: 'Stereo Auto-Pan',
      autoPanDesc: 'Smooth spatial oscillation between left and right ears',
      bpmSync: 'BPM Sync',
    },
    mixer: {
      consoleTitle: 'Acoustic Mixing Console',
      consoleDesc: 'Individual gain control, stereo panning balance, and summation bus with soft limiter',
      acousticConsoleTitle: 'Acoustic Mixing Console',
      acousticConsoleDesc: 'Individual gain control, stereo panning balance, and summation bus with soft limiter',
      antiClippingActive: 'Anti-Clipping Protection Active',
      masterFader: 'Master Output Fader',
      panLabel: 'Pan',
      panCenter: 'Center',
      panLeft: 'Left',
      panRight: 'Right',
      channelVolume: 'Channel Volume',
      stereoOutput: 'Master Stereo Output',
      limiter: 'Soft Limiter',
      softClip: 'Anti-Clipping',
      softLimiterNotice: 'Summation bus calibrated to prevent harmonic clipping distortion and protect hearing.',
    },
    presets: {
      modalTitle: 'Preset Memory',
      modalSubtitle: 'Pure local storage in the browser',
      memoryTitle: 'Preset Memory',
      memoryDesc: 'Pure local storage in the browser',
      cancel: 'Cancel',
      close: 'Close',
      saveCurrent: '+ Save Current',
      savePresetTitle: 'Save Current Preset',
      saveCurrentConfig: 'Save Current Sound Configuration',
      recordPreset: 'Save Preset',
      presetNamePlaceholder: 'Preset name...',
      presetDescPlaceholder: 'Description or contemplative purpose...',
      saveButton: 'Save to Local Memory',
      canonicalCategory: 'Canonical — The Seven Dimenuous',
      canonicalTitle: 'Canonical — The Seven Dimenuous',
      contemplativeCategory: 'Special Contemplative Compositions',
      contemplativeTitle: 'Special Contemplative Compositions',
      customCategory: 'Your Custom Presets',
      myPresets: 'Your Custom Presets',
      rename: 'Rename',
      deletePreset: 'Delete Preset',
      noCustomPresets: 'No custom presets saved yet. Create and save sound combinations in the Laboratory.',
      loadPreset: 'Load Preset',
      load: 'Load',
      reload: 'Reload',
      active: 'Active',
      layersCount: 'layers',
      exportJSON: 'Export Library (JSON)',
      importJSON: 'Import Library (JSON)',
      resetDefaults: 'Reset Defaults',
      restoreDefaults: 'Reset Defaults',
      resetConfirm: 'Do you want to reset default presets? Your custom presets will be kept.',
      restoreConfirm: 'Do you want to reset default presets? Your custom presets will be kept.',
      deleteConfirm: 'Are you sure you want to delete this preset?',
      savedSuccess: 'Personal preset saved locally successfully!',
      resetSuccess: 'Presets restored to their original default state.',
      restoredSuccess: 'Presets restored to their original default state.',
      exportSuccess: 'JSON file exported successfully.',
      importSuccess: 'Presets imported successfully!',
      invalidFileError: 'Invalid or corrupted JSON file.',
    },
    guide: {
      title: 'Philosophical & Acoustic Guide',
      subtitle: 'Gospel of Dimenuous — Principles of Sound & Contemplation',
      sevenDimenuveisTitle: 'The Seven Dimenuous of Sound',
      sevenDimenuveisDesc: 'Each Dimenuous is a portal of presence, associated with consciousness archetypes and natural resonance frequencies.',
      acousticTitle: 'Sound Geometry & Natural Harmony',
      acousticDesc: 'The laboratory utilizes mathematical relationships such as the Golden Ratio (φ 1.618), 432 Hz, and Pythagorean tuning to produce limpid and balanced acoustic patterns.',
      headphonesTitle: 'Headphones Usage',
      headphonesDesc: 'The binaural beat phenomenon occurs when left and right channels receive slightly distinct frequencies under acoustic isolation. The neural system integrates both frequencies and synthesizes the differential rhythmic perception.',
      binauralPhenomenonTitle: 'The Binaural Beat Phenomenon',
      binauralPhenomenonDesc: 'Discovered acoustically by Heinrich Wilhelm Dove in 1839, it arises when two pure tones with near frequencies are presented separately to each ear.',
      experimentalTitle: 'Notices & Concepts',
      experimentalPoints: [
        'Experimental audio tool for attention, contemplation, and personal practice.',
        'The Seven Dimenuous are philosophical and symbolic concepts from the Gospel, not neurological diagnoses or clinical prescriptions.',
      ],
      viewTour: 'View App Tour',
      returnToLab: 'Understood • Return to Laboratory',
    },
    tour: {
      next: 'Next',
      prev: 'Previous',
      skip: 'Skip Tour',
      startExperience: 'Start Experience',
      goToSimple: 'Start in Simple Mode',
      goToLab: 'Open in Laboratory',
      steps: {
        step1Tag: 'Introduction & Purpose',
        step1Title: 'Gospel of Dimenuous',
        step1Subtitle: 'Sound Laboratory & Contemplative Practice',
        step1Desc: 'An acoustic space designed to cultivate conscious presence, deep concentration, and serenity through harmonic frequencies, binaural beats, and sound geometry.',
        step1Point1Title: 'Real-Time Audio Synthesis',
        step1Point1Desc: 'Audio synthesized directly by the browser via the Web Audio API, with zero streaming latency.',
        step1Point2Title: 'Total Privacy',
        step1Point2Desc: '100% local and private — your presets and sessions are stored exclusively on your device.',
        step1Point3Title: 'Stereo Isolation',
        step1Point3Desc: 'Use headphones to experience the essential physical separation of binaural beats.',
        step1Highlight: 'Experimental tool for attention and personal contemplation.',

        step2Tag: 'Simple Navigation',
        step2Title: 'Simple Mode',
        step2Subtitle: 'The Seven Canonical Dimenuous',
        step2Desc: 'Access carefully tuned presets with base frequencies from 54Hz to 432Hz and dedicated binaural pulses for different states of attention.',
        step2Point1Title: '7 Contemplative States',
        step2Point1Desc: 'From Fundamental Stillness (Silence) and Lucid Focus (Mind) to Corporeal Grounding (Matter).',
        step2Point2Title: 'Contemplative Timer',
        step2Point2Desc: 'Programmable sessions from 5 to 60 minutes with smooth transitions (Fade In/Out) and meditative closing bell.',
        step2Point3Title: 'Harmonic Visualizers',
        step2Point3Desc: 'Golden Spiral (φ), Sacred Pattern Circles, and Stereo Phase Mirror with full screen mode.',
        step2Highlight: 'Ideal for immediate meditation, focus, and deep work sessions.',

        step3Tag: 'Professional Synthesis',
        step3Title: 'Laboratory Mode',
        step3Subtitle: 'Multi-Layer Mixer & Acoustic Sound Design',
        step3Desc: 'Create customized atmospheres combining multiple independent sound generators with micrometric tuning and stereo balancing.',
        step3Point1Title: 'Multiple Layers',
        step3Point1Desc: 'Layer Binaural, Monaural, Harmonic Frequencies, and LFO Modulation Waves.',
        step3Point2Title: 'Mixer Console',
        step3Point2Desc: 'Individual volume controls, stereo pan (L/R), Solo, Mute, VU meters, and soft anti-clipping limiter.',
        step3Point3Title: 'Memory & Export',
        step3Point3Desc: 'Save your own presets and export/import JSON files with your sound library.',
        step3Highlight: 'Total freedom for researchers, meditators, and sound producers.',

        step4Tag: 'Guidelines & Ethics',
        step4Title: 'Presence & Conscious Practice',
        step4Subtitle: 'Abidar, Observe, and Return to Center',
        step4Desc: 'The Gospel of Dimenuous invites you to "Abidar" — to remain and inhabit conscious presence without judgment, allowing sound to support your stillness.',
        step4Point1Title: 'Comfortable Volume',
        step4Point1Desc: 'Keep gain at a soft, comfortable level. Binaural beats work through tuning rather than loudness.',
        step4Point2Title: 'Experimental Notice',
        step4Point2Desc: 'Frequencies are contemplative and artistic; they do not replace medical or therapeutic care.',
        step4Point3Title: 'Explore at Your Pace',
        step4Point3Desc: 'Switch between Simple and Laboratory modes whenever needed in the top header.',
        step4Highlight: 'You are ready to begin your sound experience.',
      },
    },
    visualizer: {
      spiral: 'Golden Spiral (φ)',
      circles: 'Pattern Circles',
      mirror: 'Phase Mirror',
      waveform: 'Oscilloscope',
      off: 'Visualizer Off',
      offTitle: 'Geometric Visualizer Disabled',
      offDesc: 'Audio engine continues generating harmonics in the background.',
      enableSpiral: 'Enable Golden Spiral',
      goldenSpiral: 'Golden Spiral (φ)',
      concentricCircles: 'Pattern Circles',
      mirrorOscilloscope: 'Phase Mirror',
      harmonicWaveform: 'Harmonic Oscilloscope',
      fullscreen: 'Full Screen',
      exitFullscreen: 'Exit Full Screen',
      fullscreenContemplation: 'Fullscreen Contemplation',
      goldenSpiralTitle: 'Proportional Golden Spiral',
      sacredCirclesTitle: 'Sacred Resonance Circles',
      phaseMirrorTitle: 'Phase Interference Mirror',
      oscilloscopeTitle: 'Real-Time Waveform Oscilloscope',
    },
    dimenuveis: {
      1: {
        name: 'Silence',
        subtitle: '1st Dimenuous — The Starting Point',
        description: 'Minimal and essential sound. The space before manifestation and fundamental stillness.',
        contemplativeFocus: 'Rest of the mind, inner quietude, and awareness of fertile emptiness.',
        presetDescription: 'Minimal and essential sound. A gentle sub-harmonic tone with slow 2 Hz pulse.',
      },
      2: {
        name: 'Vision',
        subtitle: '2nd Dimenuous — Spatial Perception',
        description: 'Spacious ambience of slow transformation. Opening of the perceptual field and amplitude.',
        contemplativeFocus: 'Observation without attachment, horizon expansion, and contemplation.',
        presetDescription: 'Spacious ambience with 6 Hz pulse and bright 432 Hz harmonic.',
      },
      3: {
        name: 'Mind',
        subtitle: '3rd Dimenuous — The Lucid Pattern',
        description: 'Organized and lucid patterns. Mathematical harmony, clarity, and serene discernment.',
        contemplativeFocus: 'Clarity of thought, conscious presence, and inner alignment.',
        presetDescription: 'Lucid and ordered pattern with Alpha 10 Hz pulse and 216 Hz triad harmonic.',
      },
      4: {
        name: 'Heart',
        subtitle: '4th Dimenuous — Welcoming Resonance',
        description: 'Gentle modulation, warmth, and resonance. The dimension of embrace and communion.',
        contemplativeFocus: 'Empathy, acceptance, cordial serenity, and dissolution of resistance.',
        presetDescription: 'Warm modulation based on resonant 136.1 Hz tone and gentle 5.5 Hz pulse.',
      },
      5: {
        name: 'Will',
        subtitle: '5th Dimenuous — Direction and Focus',
        description: 'Defined rhythmic structure. The impulse of conscious intention and serene determination.',
        contemplativeFocus: 'Sustained focus, steadfast purpose, and active presence in the now.',
        presetDescription: 'Rhythmic structure with 14 Hz pulse and solid base at 256 Hz.',
      },
      6: {
        name: 'Energy',
        subtitle: '6th Dimenuous — Vibrant Movement',
        description: 'Expansive rhythmic activity and movement. The dynamism of creation and vital force.',
        contemplativeFocus: 'Awakened vitality, circulation of attention, and conscious dynamism.',
        presetDescription: 'Vibrant movement with dynamic 18 Hz modulation and stereo pulsation.',
      },
      7: {
        name: 'Matter',
        subtitle: '7th Dimenuous — Deep Grounding',
        description: 'Deep, sustained, and telluric frequencies. Grounding into the physical body and reality.',
        contemplativeFocus: 'Bodily grounding, pleasant weight, stability, and solid presence.',
        presetDescription: 'Deep, sustained, telluric frequencies with 3.5 Hz delta pulse.',
      },
    },
    contemplativePresetsData: {
      'preset-espiral-aurea': {
        name: 'The Golden Spiral (φ 1.618)',
        description: 'Layers proportional to the golden ratio with 432 Hz as the central seed.',
      },
      'preset-o-padrao': {
        name: 'The Pattern (528 Hz Harmonic Triad)',
        description: 'Contemplative exploration of the 528 Hz frequency in a balanced triad.',
      },
      'preset-o-espelho': {
        name: 'The Mirror (Cross Phases)',
        description: 'Two opposing binaural pairs creating an immersive 3D spatial acoustic field.',
      },
      'preset-respiracao-abidar': {
        name: 'Abidar — Contemplative Breathing',
        description: 'Slow cadence synchronized at 6 breaths per minute (0.1 Hz) for grounding in presence.',
      },
    },
    bands: {
      unison: {
        name: 'Unison',
        desc: 'Continuous tone in identical phase in both channels.',
      },
      delta: {
        name: 'Slow Pulse (Delta)',
        desc: 'Deep and restful modulation, suggesting silence and grounding.',
      },
      theta: {
        name: 'Gentle Pulse (Theta)',
        desc: 'Fluid oscillation for contemplation, imagination, and interiority.',
      },
      alpha: {
        name: 'Serene Pulse (Alpha)',
        desc: 'Balanced cadence for lucid presence and calm observation.',
      },
      beta: {
        name: 'Active Pulse (Beta)',
        desc: 'Focused and structured rhythm for directed attention and will.',
      },
      gamma: {
        name: 'Fast Pulse (Gamma)',
        desc: 'Rapid and integrating vibration for exploring complex patterns.',
      },
    },
  },
};
