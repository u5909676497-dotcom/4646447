import React, { useState, useEffect, useRef } from "react";
import {
  Terminal,
  RefreshCw,
  Cpu,
  Activity,
  Database,
  Check,
  Copy,
  Sparkles,
  AlertCircle,
  Trash2,
  Clock,
  LayoutGrid,
  Calendar,
  FileText,
  ChevronRight,
  Play,
  Server,
  Code,
  Palette,
  Sliders,
  Plus,
  TrendingUp,
  Save
} from "lucide-react";

interface LogEntry {
  id: number;
  timestamp: string;
  text: string;
  type: "info" | "success" | "warn" | "cmd";
}

interface CanvasNode {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
}

interface BlueprintItem {
  title: string;
  desc: string;
  icon: any;
  prompt: string;
}

export default function App() {
  // Language State
  const [lang, setLang] = useState<"ru" | "en">("ru");

  // Dynamic Theme Accent
  const [accent, setAccent] = useState<"cyan" | "emerald" | "amber" | "purple" | "rose">("cyan");

  // Time and uptime state
  const [currentTime, setCurrentTime] = useState<string>("");
  const [uptime, setUptime] = useState<number>(0);

  // Sparkline state (real-time performance monitoring simulation of React render speed/memory)
  const [sparklineData, setSparklineData] = useState<number[]>([15, 22, 18, 30, 25, 42, 35, 38, 28, 45, 32, 40, 55, 48, 50]);

  // Dictionary of translation entries
  const dictionary = {
    en: {
      appName: "Workspace Companion",
      appSubtitle: "AI Studio Sandbox & Prompt Blueprint Manager",
      statusRestored: "Restored",
      livePreview: "LIVE PREVIEW ACTIVE",
      healthCheck: "System Health Check",
      uptime: "UPTIME",
      reactEngine: "React Engine",
      active: "Active",
      tailwindCss: "Tailwind CSS",
      compiled: "Compiled",
      memoryLoad: "Memory Load",
      clusterPing: "Cluster Ping",
      pingBtn: "PING CLUSTER",
      runDiagBtn: "RUN DIAGNOSTICS",
      consoleTitle: "WORKSPACE_CONSOLE.SH",
      clearBtn: "CLEAR",
      consolePlaceholder: "Console cleared. Type commands or use buttons above to generate logs.",
      terminalInputPlaceholder: "type 'help', 'ping', 'system', 'diagnostics', 'theme emerald'...",
      executeBtn: "EXECUTE",
      blueprintHubTitle: "Application Blueprint Hub",
      blueprintHubDesc: "Select an optimized app blueprint below to automatically generate instructions, or create your own custom prompt templates using the creator form below.",
      optimizedTitle: "OPTIMIZED PROMPT BLUEPRINT INSTRUCTIONS",
      copyDisclaimer: "Copy this prompt, then type what else you want in the AI Studio prompt input to instruct our AI Agent to build your specific app right here!",
      copyBtn: "COPY PROMPT INSTRUCTIONS",
      copiedBtn: "COPIED BLUEPRINT!",
      tactilePlayground: "Tactile Sandbox Playground",
      tactileDesc: "Click inside the grid below to generate interactive system graph nodes. Adjust settings to customize sizes, connections, and palette styles.",
      lastEvent: "LAST EVENT",
      nodes: "NODES",
      clearCanvasBtn: "CLEAR CANVAS",
      clickAnywhere: "CLICK ANYWHERE TO LOG POSITION & GENERATE INTERACTIVE GRAPH NODES",
      footerStatus: "AI Studio Environment Operational Status: SECURE & COMPILING",
      footerCreated: "Created in AI Studio Workspace • 2026",
      
      // Theme Options & Settings Translation
      themeSelection: "Accent Color Theme",
      customBlueprintTitle: "Custom Blueprint Creator",
      customBlueprintDesc: "Create a tailored template. It will be added directly into your local Blueprint Hub list.",
      inputTitleLabel: "Blueprint Title",
      inputTitlePlaceholder: "e.g., Real-time Chat App",
      inputDescLabel: "Short Description",
      inputDescPlaceholder: "e.g., Serverless websocket communication canvas",
      inputPromptLabel: "Core Prompt Instructions",
      inputPromptPlaceholder: "Provide strict functional rules, design directives, and layouts...",
      addBlueprintBtn: "Add to Blueprint Hub",
      sandboxSettings: "Sandbox Canvas Settings",
      nodeSizeLabel: "Node Drawing Size",
      nodeColorLabel: "Color Mode",
      nodeLineStyle: "Connection Line Style",
      dashed: "Dashed Link",
      solid: "Solid Link",
      none: "No Lines",
      multiColor: "Multi-Color Palette",
      accentTheme: "Accent Theme Mode",
      systemActivity: "Real-time System Load",
      activityOscillation: "Reactive update speed tracking",
    },
    ru: {
      appName: "Workspace Companion",
      appSubtitle: "Песочница и менеджер шаблонов AI Studio",
      statusRestored: "Восстановлено",
      livePreview: "ПРЕВЬЮ АКТИВНО",
      healthCheck: "Проверка здоровья системы",
      uptime: "ВРЕМЯ РАБОТЫ",
      reactEngine: "Движок React",
      active: "Активен",
      tailwindCss: "Tailwind CSS",
      compiled: "Скомпилировано",
      memoryLoad: "Нагрузка памяти",
      clusterPing: "Пинг кластера",
      pingBtn: "ПИНГ КЛУСТЕРА",
      runDiagBtn: "ЗАПУСТИТЬ ДИАГНОСТИКУ",
      consoleTitle: "WORKSPACE_CONSOLE.SH",
      clearBtn: "ОЧИСТИТЬ",
      consolePlaceholder: "Консоль очищена. Введите команду или воспользуйтесь кнопками для генерации логов.",
      terminalInputPlaceholder: "введите 'help', 'ping', 'system', 'diagnostics', 'theme emerald'...",
      executeBtn: "ВЫПОЛНИТЬ",
      blueprintHubTitle: "Центр шаблонов приложений",
      blueprintHubDesc: "Выберите один из готовых шаблонов ниже для генерации инструкций, либо создайте свой уникальный шаблон в форме ниже.",
      optimizedTitle: "ОПТИМИЗИРОВАННЫЙ ПРОМПТ ДЛЯ ИИ-АГЕНТА",
      copyDisclaimer: "Скопируйте этот промпт, а затем укажите свои пожелания в поле ввода в чате снизу, чтобы наш ИИ-Кодер создал ваше приложение прямо здесь!",
      copyBtn: "СКОПИРОВАТЬ ИНСТРУКЦИИ",
      copiedBtn: "ШАБЛОН СКОПИРОВАН!",
      tactilePlayground: "Интерактивная песочница",
      tactileDesc: "Кликайте по сетке холста ниже для создания графических узлов. Регулируйте настройки размера, палитры и стилей соединений в панели справа.",
      lastEvent: "СОБЫТИЕ",
      nodes: "УЗЛЫ",
      clearCanvasBtn: "ОЧИСТИТЬ ХОЛСТ",
      clickAnywhere: "КЛИКНИТЕ В ЛЮБОМ МЕСТЕ ДЛЯ СОЗДАНИЯ СВЯЗАННЫХ ГРАФИЧЕСКИХ УЗЛОВ",
      footerStatus: "Статус окружения AI Studio: БЕЗОПАСНО И ГОТОВО К СБОРКЕ",
      footerCreated: "Создано в рабочем пространстве AI Studio • 2026",
      
      // Theme Options & Settings Translation
      themeSelection: "Цветовая тема акцента",
      customBlueprintTitle: "Конструктор пользовательских шаблонов",
      customBlueprintDesc: "Добавьте собственный шаблон. Он появится в общем списке и вы сможете использовать его для генерации.",
      inputTitleLabel: "Название шаблона",
      inputTitlePlaceholder: "например, Чат-приложение реального времени",
      inputDescLabel: "Краткое описание",
      inputDescPlaceholder: "например, Чат на веб-сокетах с интерактивным холстом",
      inputPromptLabel: "Инструкции и правила промпта",
      inputPromptPlaceholder: "Укажите детальные требования к дизайну, архитектуре и логике...",
      addBlueprintBtn: "Добавить в центр шаблонов",
      sandboxSettings: "Настройки песочницы",
      nodeSizeLabel: "Размер отрисовки узла",
      nodeColorLabel: "Цветовая гамма",
      nodeLineStyle: "Связующие линии",
      dashed: "Штриховая",
      solid: "Сплошная",
      none: "Без линий",
      multiColor: "Мультиколор палитра",
      accentTheme: "Цвет акцента темы",
      systemActivity: "Активность системы в реальном времени",
      activityOscillation: "Мониторинг частоты рендеринга",
    }
  };

  const ui = dictionary[lang];

  // Theme configuration styles mapping
  const themeStyles = {
    cyan: {
      text: "text-[#66fcf1]",
      bg: "bg-[#66fcf1]",
      border: "border-[#66fcf1]",
      borderLight: "border-[#66fcf1]/30",
      focusBorder: "focus:border-[#66fcf1]",
      bgLight: "bg-[#66fcf1]/10",
      textLight: "text-[#66fcf1]/80",
      glow: "shadow-[#66fcf1]/20",
      hex: "#66fcf1",
      gradient: "from-[#66fcf1] to-[#45f3ff]",
    },
    emerald: {
      text: "text-emerald-400",
      bg: "bg-emerald-400",
      border: "border-emerald-400",
      borderLight: "border-emerald-400/30",
      focusBorder: "focus:border-emerald-400",
      bgLight: "bg-emerald-400/10",
      textLight: "text-emerald-400/80",
      glow: "shadow-emerald-400/20",
      hex: "#34d399",
      gradient: "from-emerald-400 to-teal-400",
    },
    amber: {
      text: "text-amber-400",
      bg: "bg-amber-400",
      border: "border-amber-400",
      borderLight: "border-amber-400/30",
      focusBorder: "focus:border-amber-400",
      bgLight: "bg-amber-400/10",
      textLight: "text-amber-400/80",
      glow: "shadow-amber-400/20",
      hex: "#fbbf24",
      gradient: "from-amber-400 to-orange-400",
    },
    purple: {
      text: "text-purple-400",
      bg: "bg-purple-400",
      border: "border-purple-400",
      borderLight: "border-purple-400/30",
      focusBorder: "focus:border-purple-400",
      bgLight: "bg-purple-400/10",
      textLight: "text-purple-400/80",
      glow: "shadow-purple-400/20",
      hex: "#c084fc",
      gradient: "from-purple-400 to-fuchsia-400",
    },
    rose: {
      text: "text-rose-400",
      bg: "bg-rose-400",
      border: "border-rose-400",
      borderLight: "border-rose-400/30",
      focusBorder: "focus:border-rose-400",
      bgLight: "bg-rose-400/10",
      textLight: "text-rose-400/80",
      glow: "shadow-rose-400/20",
      hex: "#f43f5e",
      gradient: "from-rose-400 to-pink-500",
    },
  };

  const activeTheme = themeStyles[accent];

  // Terminal Logs State
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 1,
      timestamp: "08:52:01",
      text: "Initializing system recovery protocol...",
      type: "info",
    },
    {
      id: 2,
      timestamp: "08:52:02",
      text: "Detecting installed modules: React 19, Vite 6, Tailwind v4",
      type: "info",
    },
    {
      id: 3,
      timestamp: "08:52:03",
      text: "Workspace environment RESTORED successfully.",
      type: "success",
    },
    {
      id: 4,
      timestamp: "08:52:03",
      text: "AI Studio agent is ready. Enter 'help' for support.",
      type: "success",
    },
  ]);
  const [terminalInput, setTerminalInput] = useState<string>("");
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Custom blueprint construction form state
  const [newTitle, setNewTitle] = useState<string>("");
  const [newDesc, setNewDesc] = useState<string>("");
  const [newPrompt, setNewPrompt] = useState<string>("");

  // Sandbox adjustable variables
  const [nodeSize, setNodeSize] = useState<number>(14);
  const [nodeColorMode, setNodeColorMode] = useState<string>("multi");
  const [lineStyle, setLineStyle] = useState<"dashed" | "solid" | "none">("dashed");

  // Initial Blueprints Dictionary
  const [blueprints, setBlueprints] = useState<Record<string, BlueprintItem>>({
    planner: {
      title: lang === "en" ? "Task & Habit Tracker" : "Трекер задач и привычек",
      desc: lang === "en" ? "Minimalist, tactile personal task dashboard" : "Минималистичный, тактильный личный кабинет для задач",
      icon: Calendar,
      prompt: lang === "en" ? `Build a comprehensive Personal Task & Habit Tracker with:
- A minimalist Obsidian Slate dark-mode visual interface.
- Core task categories: Focus, Health, Learning, and Admin.
- Progress visualization: circular progress rings and a weekly streak grid.
- Features: Add/delete tasks, complete tasks with tactile spring animation, drag-and-drop prioritization, and local storage persistence.
- High accessibility, clear color contrast, and fluid responsive grid layouts.` : `Создай полноценный Трекер Задач и Привычек:
- Минималистичный темный интерфейс в стиле Obsidian Slate.
- Основные категории задач: Фокус, Здоровье, Обучение и Администрирование.
- Визуализация прогресса: круговые индикаторы и сетка еженедельной активности.
- Функционал: добавление/удаление задач, завершение задач с плавной анимацией, приоритизация перетаскиванием (drag-and-drop) и сохранение в local storage.
- Высокая доступность (A11y), четкий контраст цветов и адаптивная сетка.`,
    },
    dashboard: {
      title: lang === "en" ? "Interactive Analytics Dashboard" : "Интерактивный дашборд аналитики",
      desc: lang === "en" ? "Sleek visualization with dynamic transaction lists" : "Стильная визуализация с динамическими списками транзакций",
      icon: LayoutGrid,
      prompt: lang === "en" ? `Build a real-time full-featured Analytics & Expense Dashboard:
- Cohesive Charcoal Light visual theme with subtle off-white gradients.
- Interactive charts: Use Recharts for a clean expense trends area chart and category breakdown pie chart.
- Features: Add transactions with dynamic tag selection, set monthly target thresholds with reactive visual alerts, and filter transactions by category/date.
- Include elegant interactive statistical cards showing total income, total spent, and net savings.` : `Создай интерактивный дашборд аналитики расходов в реальном времени:
- Цельный светлый угольный стиль (Charcoal Light) с мягкими градиентами.
- Интерактивные графики: используй Recharts для отображения трендов расходов и круговой диаграммы по категориям.
- Функционал: добавление транзакций с динамическим выбором тегов, установка ежемесячных лимитов со световой индикацией превышения и фильтрация по датам/категориям.
- Карточки статистики: общий доход, расходы, чистые сбережения.`,
    },
    summarizer: {
      title: lang === "en" ? "AI Note Summarizer" : "ИИ-Саммаризатор заметок",
      desc: lang === "en" ? "Markdown writing environment with Gemini intelligence" : "Инструмент заметок на Markdown с ИИ Gemini",
      icon: Sparkles,
      prompt: lang === "en" ? `Build a server-side AI Writing & Note Summarizer using the Gemini API:
- Create a split-screen layout with an interactive rich markdown scratchpad on the left, and an AI analysis center on the right.
- Use a server-side proxy route to securely query the gemini-3.5-flash model.
- Features: Instant summaries, keyword extraction, action-item checklists, and automatic tone adjusting (e.g., professional, casual, concise).
- Clean off-white minimalist workspace theme focusing strictly on premium typography.` : `Создай ИИ-Саммаризатор заметок на Markdown:
- Сплит-экран: интерактивный блокнот Markdown слева и аналитический центр ИИ справа.
- Использование серверного роута для безопасного обращения к модели gemini-3.5-flash.
- Функционал: мгновенный саммари (краткое содержание), извлечение ключевых слов, чек-листы задач и автоматическая регулировка тона (профессиональный, краткий, разговорный).
- Минималистичная светлая тема с упором на премиальную типографику.`,
    },
    calculator: {
      title: lang === "en" ? "Scientific Calculator Sandbox" : "Математический калькулятор",
      desc: lang === "en" ? "Visual mathematics canvas and scientific constants" : "Визуальный математический холст и научные константы",
      icon: Code,
      prompt: lang === "en" ? `Build a Scientific & Mathematical Sandbox Calculator:
- Modern glassmorphic terminal interface featuring premium neon green and slate color accents.
- Advanced arithmetic: support standard equations, trigonometrics (sin, cos, tan), logarithmic functions, and constants (pi, e).
- Interactive equation history log: allow users to click past results to feed them back into the active calculation.
- Features: Real-time syntax checking, dark-mode toggle, and a beautiful custom graph plotter for algebraic inputs.` : `Создай научно-математический калькулятор-песочницу:
- Современный глассморфический терминальный интерфейс с неоновыми зелеными и грифельными акцентами.
- Функции: стандартные уравнения, тригонометрия (sin, cos, tan), логарифмы, константы (pi, e).
- Интерактивная история: возможность кликнуть на старый результат для подстановки в новое выражение.
- Особенности: синтаксический анализ в реальном времени, переключатель темной темы и графический плоттер для алгебраических функций.`,
    },
  });

  const [activeBlueprint, setActiveBlueprint] = useState<string>("planner");
  const [promptText, setPromptText] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  // Sandbox state
  const [nodes, setNodes] = useState<CanvasNode[]>([]);
  const [memoryUsage, setMemoryUsage] = useState<number>(24.8);
  const [lastCoords, setLastCoords] = useState<{ x: string; y: string }>({ x: "-", y: "-" });
  const [latency, setLatency] = useState<number>(14);

  // Sync prompts when language changes
  useEffect(() => {
    // Re-initialize default prompts to match language choice
    setBlueprints((prev) => ({
      ...prev,
      planner: {
        ...prev.planner,
        title: lang === "en" ? "Task & Habit Tracker" : "Трекер задач и привычек",
        desc: lang === "en" ? "Minimalist, tactile personal task dashboard" : "Минималистичный, тактильный личный кабинет для задач",
        prompt: lang === "en" ? `Build a comprehensive Personal Task & Habit Tracker with:
- A minimalist Obsidian Slate dark-mode visual interface.
- Core task categories: Focus, Health, Learning, and Admin.
- Progress visualization: circular progress rings and a weekly streak grid.
- Features: Add/delete tasks, complete tasks with tactile spring animation, drag-and-drop prioritization, and local storage persistence.
- High accessibility, clear color contrast, and fluid responsive grid layouts.` : `Создай полноценный Трекер Задач и Привычек:
- Минималистичный темный интерфейс в стиле Obsidian Slate.
- Основные категории задач: Фокус, Здоровье, Обучение и Администрирование.
- Визуализация прогресса: круговые индикаторы и сетка еженедельной активности.
- Функционал: добавление/удаление задач, завершение задач с плавной анимацией, приоритизация перетаскиванием (drag-and-drop) и сохранение в local storage.
- Высокая доступность (A11y), четкий контраст цветов и адаптивная сетка.`,
      },
      dashboard: {
        ...prev.dashboard,
        title: lang === "en" ? "Interactive Analytics Dashboard" : "Интерактивный дашборд аналитики",
        desc: lang === "en" ? "Sleek visualization with dynamic transaction lists" : "Стильная визуализация с динамическими списками транзакций",
        prompt: lang === "en" ? `Build a real-time full-featured Analytics & Expense Dashboard:
- Cohesive Charcoal Light visual theme with subtle off-white gradients.
- Interactive charts: Use Recharts for a clean expense trends area chart and category breakdown pie chart.
- Features: Add transactions with dynamic tag selection, set monthly target thresholds with reactive visual alerts, and filter transactions by category/date.
- Include elegant interactive statistical cards showing total income, total spent, and net savings.` : `Создай интерактивный дашборд аналитики расходов в реальном времени:
- Цельный светлый угольный стиль (Charcoal Light) с мягкими градиентами.
- Интерактивные графики: используй Recharts для отображения трендов расходов и круговой диаграммы по категориям.
- Функционал: добавление транзакций с динамическим выбором тегов, установка ежемесячных лимитов со световой индикацией превышения и фильтрация по датам/категориям.
- Карточки статистики: общий доход, расходы, чистые сбережения.`,
      },
      summarizer: {
        ...prev.summarizer,
        title: lang === "en" ? "AI Note Summarizer" : "ИИ-Саммаризатор заметок",
        desc: lang === "en" ? "Markdown writing environment with Gemini intelligence" : "Инструмент заметок на Markdown с ИИ Gemini",
        prompt: lang === "en" ? `Build a server-side AI Writing & Note Summarizer using the Gemini API:
- Create a split-screen layout with an interactive rich markdown scratchpad on the left, and an AI analysis center on the right.
- Use a server-side proxy route to securely query the gemini-3.5-flash model.
- Features: Instant summaries, keyword extraction, action-item checklists, and automatic tone adjusting (e.g., professional, casual, concise).
- Clean off-white minimalist workspace theme focusing strictly on premium typography.` : `Создай ИИ-Саммаризатор заметок на Markdown:
- Сплит-экран: интерактивный блокнот Markdown слева и аналитический центр ИИ справа.
- Использование серверного роута для безопасного обращения к модели gemini-3.5-flash.
- Функционал: мгновенный саммари (краткое содержание), извлечение ключевых слов, чек-листы задач и автоматическая регулировка тона (профессиональный, краткий, разговорный).
- Минималистичная светлая тема с упором на премиальную типографику.`,
      },
      calculator: {
        ...prev.calculator,
        title: lang === "en" ? "Scientific Calculator Sandbox" : "Математический калькулятор",
        desc: lang === "en" ? "Visual mathematics canvas and scientific constants" : "Визуальный математический холст и научные константы",
        prompt: lang === "en" ? `Build a Scientific & Mathematical Sandbox Calculator:
- Modern glassmorphic terminal interface featuring premium neon green and slate color accents.
- Advanced arithmetic: support standard equations, trigonometrics (sin, cos, tan), logarithmic functions, and constants (pi, e).
- Interactive equation history log: allow users to click past results to feed them back into the active calculation.
- Features: Real-time syntax checking, dark-mode toggle, and a beautiful custom graph plotter for algebraic inputs.` : `Создай научно-математический калькулятор-песочницу:
- Современный глассморфический терминальный интерфейс с неоновыми зелеными и грифельными акцентами.
- Функции: стандартные уравнения, тригонометрия (sin, cos, tan), логарифмы, константы (pi, e).
- Интерактивная история: возможность кликнуть на старый результат для подстановки в новое выражение.
- Особенности: синтаксический анализ в реальном времени, переключатель темной темы и графический плоттер для алгебраических функций.`,
      },
    }));
  }, [lang]);

  // Sync active prompt text when blueprint changes
  useEffect(() => {
    if (activeBlueprint && blueprints[activeBlueprint]) {
      setPromptText(blueprints[activeBlueprint].prompt);
    }
  }, [activeBlueprint, blueprints]);

  // Real-time live sparkline system activity updates
  useEffect(() => {
    const sparkInterval = setInterval(() => {
      setSparklineData((prev) => {
        const nextVal = Math.max(10, Math.min(95, Math.floor(prev[prev.length - 1] + (Math.random() * 20 - 10))));
        return [...prev.slice(1), nextVal];
      });
    }, 1200);
    return () => clearInterval(sparkInterval);
  }, []);

  // Clock effect
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " UTC"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Uptime effect
  useEffect(() => {
    const interval = setInterval(() => {
      setUptime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom of terminal
  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Terminal commands handling
  const executeCommand = (cmdText: string) => {
    const trimmed = cmdText.trim().toLowerCase();
    if (!trimmed) return;

    const timestamp = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const newLogs = [
      ...logs,
      { id: Date.now(), timestamp, text: `$ ${cmdText}`, type: "cmd" as const },
    ];

    if (trimmed === "help") {
      newLogs.push({
        id: Date.now() + 1,
        timestamp,
        text: lang === "en"
          ? "Commands: help, clear, ping, system, diagnostics, blueprint <name>, theme <cyan|emerald|amber|purple|rose>, language <en|ru>"
          : "Команды: help, clear, ping, system, diagnostics, blueprint <имя>, theme <color>, language <en|ru>",
        type: "info",
      });
    } else if (trimmed === "clear") {
      setLogs([]);
      setTerminalInput("");
      return;
    } else if (trimmed === "ping") {
      const newLatency = Math.floor(Math.random() * 8) + 8;
      setLatency(newLatency);
      newLogs.push({
        id: Date.now() + 1,
        timestamp,
        text: lang === "en"
          ? `Pong! Roundtrip latency to dev cluster is ${newLatency}ms.`
          : `Понг! Двусторонняя задержка до дев-кластера составляет ${newLatency}мс.`,
        type: "success",
      });
    } else if (trimmed === "system") {
      newLogs.push({
        id: Date.now() + 1,
        timestamp,
        text: lang === "en"
          ? `Vite Server: Active | Node Env: production | Live Uptime: ${uptime}s | Theme: ${accent}`
          : `Сервер Vite: Активен | Окружение: production | Время работы: ${uptime}с | Тема: ${accent}`,
        type: "info",
      });
    } else if (trimmed === "diagnostics") {
      const mockMem = (20 + Math.random() * 8).toFixed(1);
      setMemoryUsage(parseFloat(mockMem));
      newLogs.push({
        id: Date.now() + 1,
        timestamp,
        text: lang === "en"
          ? `Running full diagnostics... Memory: ${mockMem}MB. Canvas nodes: ${nodes.length}. Latency: ${latency}ms. Accent: ${accent}. All checks PASSED.`
          : `Полная диагностика системы... Память: ${mockMem}МБ. Узлы холста: ${nodes.length}. Задержка: ${latency}мс. Акцент: ${accent}. Все тесты пройдены успешно.`,
        type: "success",
      });
    } else if (trimmed.startsWith("theme ")) {
      const desiredColor = trimmed.replace("theme ", "").trim();
      if (["cyan", "emerald", "amber", "purple", "rose"].includes(desiredColor)) {
        setAccent(desiredColor as any);
        newLogs.push({
          id: Date.now() + 1,
          timestamp,
          text: lang === "en"
            ? `Active system theme changed successfully to [${desiredColor}].`
            : `Цветовой акцент системы успешно изменен на [${desiredColor}].`,
          type: "success",
        });
      } else {
        newLogs.push({
          id: Date.now() + 1,
          timestamp,
          text: `Unknown theme accent "${desiredColor}". Try: cyan, emerald, amber, purple, rose`,
          type: "warn",
        });
      }
    } else if (trimmed.startsWith("language ") || trimmed.startsWith("lang ")) {
      const desiredLang = trimmed.replace("language ", "").replace("lang ", "").trim();
      if (desiredLang === "en" || desiredLang === "ru") {
        setLang(desiredLang);
        newLogs.push({
          id: Date.now() + 1,
          timestamp,
          text: desiredLang === "en" ? "System language toggled to English." : "Язык системы переключен на русский.",
          type: "success",
        });
      } else {
        newLogs.push({
          id: Date.now() + 1,
          timestamp,
          text: "Unsupported language option. Supported: en, ru",
          type: "warn",
        });
      }
    } else if (trimmed.startsWith("blueprint ")) {
      const bName = trimmed.replace("blueprint ", "").trim();
      if (blueprints[bName]) {
        setActiveBlueprint(bName);
        newLogs.push({
          id: Date.now() + 1,
          timestamp,
          text: lang === "en"
            ? `Selected blueprint updated to [${blueprints[bName].title}].`
            : `Выбранный шаблон изменен на [${blueprints[bName].title}].`,
          type: "success",
        });
      } else {
        newLogs.push({
          id: Date.now() + 1,
          timestamp,
          text: lang === "en"
            ? `Blueprint "${bName}" not found. Try standard or custom names.`
            : `Шаблон "${bName}" не найден. Попробуйте ввести имя существующего шаблона.`,
          type: "warn",
        });
      }
    } else {
      newLogs.push({
        id: Date.now() + 1,
        timestamp,
        text: lang === "en"
          ? `Command not recognized: "${trimmed}". Type "help" for valid options.`
          : `Неизвестная команда: "${trimmed}". Введите "help" для просмотра списка команд.`,
        type: "warn",
      });
    }

    setLogs(newLogs);
    setTerminalInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(terminalInput);
    }
  };

  // Copy prompt helper
  const copyToClipboard = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    const timestamp = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLogs((prev) => [
      ...prev,
      {
        id: Date.now(),
        timestamp,
        text: lang === "en"
          ? "Copied generated application blueprint prompt to clipboard."
          : "Инструкция для промпта скопирована в буфер обмена.",
        type: "success",
      },
    ]);
    setTimeout(() => setCopied(false), 2000);
  };

  // Add Custom Blueprint
  const handleAddBlueprint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrompt.trim()) return;

    const newKey = "custom_" + Date.now();
    const formattedDesc = newDesc.trim() || (lang === "en" ? "Custom tailored application spec" : "Пользовательский шаблон инструкций");

    const newBp: BlueprintItem = {
      title: newTitle.trim(),
      desc: formattedDesc,
      icon: FileText,
      prompt: newPrompt.trim(),
    };

    setBlueprints((prev) => ({
      ...prev,
      [newKey]: newBp,
    }));

    setActiveBlueprint(newKey);
    setNewTitle("");
    setNewDesc("");
    setNewPrompt("");

    const timestamp = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    setLogs((prev) => [
      ...prev,
      {
        id: Date.now(),
        timestamp,
        text: lang === "en"
          ? `Successfully registered custom blueprint [${newBp.title}].`
          : `Пользовательский шаблон [${newBp.title}] успешно зарегистрирован в системе.`,
        type: "success",
      }
    ]);
  };

  // Canvas Sandbox drawing
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xVal = e.clientX - rect.left;
    const yVal = e.clientY - rect.top;

    setLastCoords({ x: Math.round(xVal).toString(), y: Math.round(yVal).toString() });

    let finalColor = "";
    if (nodeColorMode === "multi") {
      const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#06b6d4"];
      finalColor = colors[Math.floor(Math.random() * colors.length)];
    } else if (nodeColorMode === "accent") {
      finalColor = activeTheme.hex;
    } else {
      finalColor = nodeColorMode;
    }

    const newNode: CanvasNode = {
      id: Date.now(),
      x: xVal,
      y: yVal,
      color: finalColor,
      size: nodeSize,
    };

    setNodes((prev) => [...prev, newNode]);

    // Push diagnostic log
    const timestamp = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLogs((prev) => [
      ...prev,
      {
        id: Date.now(),
        timestamp,
        text: lang === "en"
          ? `Node created at coordinate [X: ${Math.round(xVal)}, Y: ${Math.round(yVal)}] (Size: ${nodeSize}px)`
          : `Создан узел на холсте: [X: ${Math.round(xVal)}, Y: ${Math.round(yVal)}] (Размер: ${nodeSize}px)`,
        type: "info",
      },
    ]);
  };

  const clearCanvas = () => {
    setNodes([]);
    setLastCoords({ x: "-", y: "-" });
    const timestamp = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLogs((prev) => [
      ...prev,
      {
        id: Date.now(),
        timestamp,
        text: lang === "en"
          ? "Interactive canvas sandbox cleared."
          : "Интерактивный холст-песочница очищен.",
        type: "info",
      },
    ]);
  };

  // Formatting helper for uptime
  const formatUptime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div
      id="root-container"
      className="bg-[#0b0c10] text-[#c5c6c7] min-h-screen font-sans flex flex-col justify-between overflow-x-hidden selection:bg-[#45f3ff] selection:text-black relative"
    >
      {/* Background Matrix/Subtle Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1f242d_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none"></div>

      {/* Header Block */}
      <header
        id="app-header"
        className="border-b border-[#1f2833] bg-[#0b0c10]/95 backdrop-blur-md sticky top-0 z-50 px-4 py-4 md:px-8"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg text-black transition-all duration-300 ${activeTheme.bg} shadow-lg shadow-black/25`}>
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                {ui.appName}
                <span className={`text-[10px] bg-[#1f2833] ${activeTheme.text} border ${activeTheme.borderLight} px-1.5 py-0.5 rounded uppercase font-mono font-bold tracking-widest`}>
                  {ui.statusRestored}
                </span>
              </h1>
              <p className="text-xs text-[#858585]">{ui.appSubtitle}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 font-mono text-xs">
            {/* Quick Theme Swapper */}
            <div className="flex items-center gap-1.5 bg-[#1f2833]/30 border border-[#1f2833] px-2 py-1 rounded-md">
              <Palette className={`w-3.5 h-3.5 ${activeTheme.text}`} />
              <div className="flex gap-1.5">
                {(["cyan", "emerald", "amber", "purple", "rose"] as const).map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setAccent(color);
                      // Trigger small sound/feedback conceptually by logs
                      const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
                      setLogs(prev => [...prev, { id: Date.now(), timestamp, text: lang === 'en' ? `Theme updated to ${color}` : `Тема переключена на ${color}`, type: 'info' }]);
                    }}
                    className={`w-3 h-3 rounded-full cursor-pointer transition-all hover:scale-125 ${
                      color === "cyan" ? "bg-[#66fcf1]" :
                      color === "emerald" ? "bg-emerald-400" :
                      color === "amber" ? "bg-amber-400" :
                      color === "purple" ? "bg-purple-400" : "bg-rose-400"
                    } ${accent === color ? "ring-2 ring-white scale-110" : "opacity-60"}`}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Language Switcher Toggle */}
            <div className="flex items-center bg-[#1f2833]/50 border border-[#1f2833] rounded-md overflow-hidden">
              <button
                id="btn-lang-en"
                onClick={() => setLang("en")}
                className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  lang === "en"
                    ? `${activeTheme.bg} text-black`
                    : "text-[#858585] hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                id="btn-lang-ru"
                onClick={() => setLang("ru")}
                className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  lang === "ru"
                    ? `${activeTheme.bg} text-black`
                    : "text-[#858585] hover:text-white"
                }`}
              >
                RU
              </button>
            </div>

            <div className="flex items-center gap-2 bg-[#1f2833]/50 border border-[#1f2833] px-3 py-1.5 rounded-md">
              <Clock className={`w-3.5 h-3.5 ${activeTheme.text}`} />
              <span className="text-white font-semibold">{currentTime || "Loading..."}</span>
            </div>

            <div className="flex items-center gap-2 bg-[#1f2833]/50 border border-[#1f2833] px-3 py-1.5 rounded-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-white font-medium">{ui.livePreview}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main id="app-main" className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* LEFT COLUMN: Diagnostics & simulated Terminal CLI & live SVGs */}
        <section id="diagnostics-panel" className="lg:col-span-5 flex flex-col gap-6">
          
          {/* System Diagnostics Indicator */}
          <div className="bg-[#151a21]/90 border border-[#1f2833] rounded-xl p-5 shadow-xl relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1.5 h-full ${activeTheme.bg}`}></div>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
                <Activity className={`w-4 h-4 ${activeTheme.text}`} />
                {ui.healthCheck}
              </h2>
              <span className="text-[10px] font-mono text-[#858585] uppercase">{ui.uptime}: {formatUptime(uptime)}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-[#0b0c10] border border-[#1f2833]/60 rounded-lg p-3">
                <p className="text-[10px] text-[#858585] uppercase tracking-wider font-mono">{ui.reactEngine}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="text-xs font-bold text-white">v19.0.1 ({ui.active})</span>
                </div>
              </div>
              <div className="bg-[#0b0c10] border border-[#1f2833]/60 rounded-lg p-3">
                <p className="text-[10px] text-[#858585] uppercase tracking-wider font-mono">{ui.tailwindCss}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="text-xs font-bold text-white">v4.1.14 ({ui.compiled})</span>
                </div>
              </div>
              <div className="bg-[#0b0c10] border border-[#1f2833]/60 rounded-lg p-3">
                <p className="text-[10px] text-[#858585] uppercase tracking-wider font-mono">{ui.memoryLoad}</p>
                <p className="text-xs font-bold text-white mt-1">{memoryUsage} MB</p>
              </div>
              <div className="bg-[#0b0c10] border border-[#1f2833]/60 rounded-lg p-3">
                <p className="text-[10px] text-[#858585] uppercase tracking-wider font-mono">{ui.clusterPing}</p>
                <p className="text-xs font-bold text-white mt-1">{latency} ms</p>
              </div>
            </div>

            {/* Sparkline Visual Monitor widget (Real Live activity update) */}
            <div className="bg-[#0b0c10] border border-[#1f2833]/50 rounded-lg p-3.5 mb-4">
              <div className="flex justify-between items-center mb-2 font-mono text-[10px]">
                <span className="text-[#858585] uppercase flex items-center gap-1.5">
                  <TrendingUp className={`w-3 h-3 ${activeTheme.text}`} />
                  {ui.systemActivity}
                </span>
                <span className={`${activeTheme.text} font-bold`}>{sparklineData[sparklineData.length - 1]}% Load</span>
              </div>
              <div className="h-10 w-full relative flex items-end">
                <svg className="w-full h-full pointer-events-none">
                  {/* Dynamic Gradient fill */}
                  <defs>
                    <linearGradient id={`grad-${accent}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={activeTheme.hex} stopOpacity="0.4" />
                      <stop offset="100%" stopColor={activeTheme.hex} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Area fill */}
                  <path
                    d={`M 0,40 ${sparklineData
                      .map((val, i) => `L ${(i * (100 / (sparklineData.length - 1))).toFixed(1)}%,${(40 - (val / 100) * 35).toFixed(1)}`)
                      .join(" ")} L 100,40 Z`}
                    fill={`url(#grad-${accent})`}
                  />

                  {/* Polyline trend */}
                  <polyline
                    fill="none"
                    stroke={activeTheme.hex}
                    strokeWidth="1.5"
                    points={sparklineData
                      .map((val, i) => `${(i * (100 / (sparklineData.length - 1))).toFixed(1)}%,${(40 - (val / 100) * 35).toFixed(1)}`)
                      .join(" ")}
                    className="transition-all duration-300"
                  />
                  
                  {/* Indicator Dot */}
                  <circle
                    cx="100%"
                    cy={`${(40 - (sparklineData[sparklineData.length - 1] / 100) * 35).toFixed(1)}%`}
                    r="3"
                    fill={activeTheme.hex}
                    className="animate-pulse"
                  />
                </svg>
              </div>
              <p className="text-[9px] text-neutral-600 font-mono mt-1 text-right italic">{ui.activityOscillation}</p>
            </div>

            {/* Quick Diagnostic Actions */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-[#1f2833]/40">
              <button
                id="btn-diagnostic-ping"
                onClick={() => executeCommand("ping")}
                className={`flex items-center gap-1.5 text-[11px] font-mono bg-[#1f2833] hover:text-black transition-colors px-3 py-1.5 rounded cursor-pointer ${activeTheme.text} hover:${activeTheme.bg} font-bold`}
              >
                <RefreshCw className="w-3 h-3" /> {ui.pingBtn}
              </button>
              <button
                id="btn-diagnostic-full"
                onClick={() => executeCommand("diagnostics")}
                className={`flex items-center gap-1.5 text-[11px] font-mono bg-[#1f2833] hover:text-black transition-colors px-3 py-1.5 rounded cursor-pointer ${activeTheme.text} hover:${activeTheme.bg} font-bold`}
              >
                <Activity className="w-3 h-3" /> {ui.runDiagBtn}
              </button>
            </div>
          </div>

          {/* Simulated Terminal Window */}
          <div className="bg-[#0b0c10] border border-[#1f2833] rounded-xl flex flex-col h-[26rem] shadow-2xl relative overflow-hidden">
            <div className="bg-[#151a21]/80 px-4 py-3 border-b border-[#1f2833] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className={`w-4 h-4 ${activeTheme.text}`} />
                <span className="text-xs font-bold text-white tracking-wider font-mono">{ui.consoleTitle}</span>
              </div>
              <button
                id="btn-clear-logs"
                onClick={() => executeCommand("clear")}
                className="text-[10px] text-[#858585] hover:text-red-400 font-mono flex items-center gap-1 transition-colors cursor-pointer"
                title="Clear console window"
              >
                <Trash2 className="w-3 h-3" /> {ui.clearBtn}
              </button>
            </div>

            {/* Terminal Window Output */}
            <div className="flex-grow p-4 overflow-y-auto font-mono text-[11px] space-y-2.5 scrollbar-thin scrollbar-thumb-neutral-800">
              {logs.length === 0 ? (
                <div className="text-[#858585] text-center py-8">
                  {ui.consolePlaceholder}
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="leading-5">
                    <span className="text-[#858585] select-none mr-2">[{log.timestamp}]</span>
                    {log.type === "success" && (
                      <span className="text-emerald-400 font-medium">✔️ {log.text}</span>
                    )}
                    {log.type === "warn" && (
                      <span className="text-amber-400 font-medium">⚠️ {log.text}</span>
                    )}
                    {log.type === "cmd" && (
                      <span className={`${activeTheme.text} font-bold`}>{log.text}</span>
                    )}
                    {log.type === "info" && (
                      <span className="text-neutral-300">{log.text}</span>
                    )}
                  </div>
                ))
              )}
              <div ref={terminalBottomRef} />
            </div>

            {/* Terminal CLI Command Input */}
            <div className="border-t border-[#1f2833] bg-[#151a21]/50 p-3 flex items-center gap-2">
              <span className={`${activeTheme.text} font-bold font-mono text-xs select-none pl-1`}>$</span>
              <input
                id="terminal-input"
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={ui.terminalInputPlaceholder}
                className="flex-grow bg-transparent text-white font-mono text-xs focus:outline-none placeholder-[#454e59]"
              />
              <button
                id="btn-submit-cmd"
                onClick={() => executeCommand(terminalInput)}
                className={`text-[11px] font-mono hover:text-black hover:border-transparent px-3 py-1 bg-[#1f2833]/50 rounded border border-[#1f2833] transition-all cursor-pointer ${activeTheme.text} hover:${activeTheme.bg}`}
              >
                {ui.executeBtn}
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Blueprints & Prompt Constructor Hub */}
        <section id="blueprints-panel" className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-[#151a21]/90 border border-[#1f2833] rounded-xl p-6 shadow-xl flex flex-col justify-between h-full min-h-[46rem] relative overflow-hidden">
            
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className={`${activeTheme.bgLight} p-1.5 rounded-md`}>
                  <Sparkles className={`w-4 h-4 ${activeTheme.text}`} />
                </div>
                <h2 className="text-base font-bold text-white tracking-wide">{ui.blueprintHubTitle}</h2>
              </div>
              <p className="text-xs text-[#858585] mb-5">
                {ui.blueprintHubDesc}
              </p>

              {/* Blueprints Grid Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                {Object.entries(blueprints).map(([key, val]) => {
                  const item = val as BlueprintItem;
                  const IconComp = item.icon || FileText;
                  const isActive = activeBlueprint === key;
                  return (
                    <button
                      id={`blueprint-tab-${key}`}
                      key={key}
                      onClick={() => setActiveBlueprint(key)}
                      className={`text-left p-3.5 rounded-xl border transition-all duration-300 flex items-start gap-3 cursor-pointer ${
                        isActive
                          ? `bg-[#1f2833]/75 ${activeTheme.border} shadow-lg ${activeTheme.glow}`
                          : "bg-[#0b0c10] border-[#1f2833] hover:border-[#66fcf1]/40"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg transition-colors ${
                          isActive ? `${activeTheme.bg} text-black` : `bg-[#1f2833] ${activeTheme.text}`
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs font-bold text-white truncate">{item.title}</h3>
                        <p className="text-[10px] text-[#858585] mt-0.5 line-clamp-2 leading-4">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Prompt Visual Output Field */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#858585] flex items-center gap-1.5 font-mono uppercase">
                    <Code className={`w-3.5 h-3.5 ${activeTheme.text}`} />
                    {ui.optimizedTitle}
                  </span>
                  <span className={`text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded border ${activeTheme.text} ${activeTheme.bgLight} ${activeTheme.borderLight}`}>
                    {activeBlueprint}
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    id="blueprint-prompt-textarea"
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    className={`w-full h-72 bg-[#0b0c10] border border-[#1f2833] rounded-xl p-4 font-mono text-xs leading-5 text-[#c5c6c7] focus:outline-none transition-all resize-none shadow-inner ${activeTheme.focusBorder}`}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0b0c10] to-transparent pointer-events-none rounded-b-xl opacity-70"></div>
                </div>
              </div>

              {/* Dynamic Interactive Template Creator Form */}
              <div className="mt-6 p-4 bg-[#0b0c10]/70 border border-[#1f2833] rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Plus className={`w-4 h-4 ${activeTheme.text}`} />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">{ui.customBlueprintTitle}</h3>
                </div>
                <p className="text-[10px] text-[#858585] mb-3 leading-4">
                  {ui.customBlueprintDesc}
                </p>
                <form onSubmit={handleAddBlueprint} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-[#858585] mb-1 uppercase font-semibold">{ui.inputTitleLabel}</label>
                      <input
                        type="text"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder={ui.inputTitlePlaceholder}
                        className={`w-full bg-[#151a21]/50 border border-[#1f2833] rounded px-3 py-1.5 text-xs text-white focus:outline-none ${activeTheme.focusBorder}`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-[#858585] mb-1 uppercase font-semibold">{ui.inputDescLabel}</label>
                      <input
                        type="text"
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        placeholder={ui.inputDescPlaceholder}
                        className={`w-full bg-[#151a21]/50 border border-[#1f2833] rounded px-3 py-1.5 text-xs text-white focus:outline-none ${activeTheme.focusBorder}`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#858585] mb-1 uppercase font-semibold">{ui.inputPromptLabel}</label>
                    <textarea
                      required
                      value={newPrompt}
                      onChange={(e) => setNewPrompt(e.target.value)}
                      placeholder={ui.inputPromptPlaceholder}
                      className={`w-full h-20 bg-[#151a21]/50 border border-[#1f2833] rounded p-2 text-xs text-white focus:outline-none resize-none ${activeTheme.focusBorder}`}
                    />
                  </div>
                  <button
                    type="submit"
                    className={`w-full flex items-center justify-center gap-1.5 py-2 rounded font-bold text-xs text-black cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99] bg-gradient-to-r ${activeTheme.gradient}`}
                  >
                    <Save className="w-3.5 h-3.5" />
                    {ui.addBlueprintBtn}
                  </button>
                </form>
              </div>

            </div>

            {/* Clipboard trigger bar */}
            <div className="mt-6 pt-4 border-t border-[#1f2833]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <AlertCircle className={`w-4 h-4 ${activeTheme.text} flex-shrink-0`} />
                <p className="text-[11px] text-[#858585] leading-4">
                  {ui.copyDisclaimer}
                </p>
              </div>

              <button
                id="btn-copy-prompt"
                onClick={copyToClipboard}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-md cursor-pointer ${
                  copied
                    ? "bg-emerald-500 text-white shadow-emerald-500/10"
                    : `text-black bg-gradient-to-r ${activeTheme.gradient} hover:scale-[1.03] active:scale-[0.98] shadow-black/25 hover:${activeTheme.glow}`
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    {ui.copiedBtn}
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    {ui.copyBtn}
                  </>
                )}
              </button>
            </div>

          </div>
        </section>

        {/* BOTTOM PANEL: Tactile Interaction Sandbox Canvas & Settings Grid */}
        <section id="sandbox-canvas-panel" className="lg:col-span-12">
          <div className="bg-[#151a21]/90 border border-[#1f2833] rounded-xl p-6 shadow-xl grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* Left Box: Controls and Adjustments (xl:col-span-3) */}
            <div className="xl:col-span-3 flex flex-col justify-between gap-4 border-b xl:border-b-0 xl:border-r border-[#1f2833]/70 pb-5 xl:pb-0 xl:pr-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sliders className={`w-4 h-4 ${activeTheme.text}`} />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">{ui.sandboxSettings}</h2>
                </div>
                <p className="text-xs text-[#858585] mb-4">
                  {ui.tactileDesc}
                </p>
              </div>

              {/* Sandbox Setting Parameters */}
              <div className="space-y-4">
                {/* 1. Node size slider */}
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                    <span className="text-neutral-400">{ui.nodeSizeLabel}</span>
                    <span className={`${activeTheme.text} font-bold`}>{nodeSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="28"
                    step="1"
                    value={nodeSize}
                    onChange={(e) => setNodeSize(parseInt(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer h-1 bg-[#0b0c10] rounded-lg appearance-none"
                  />
                </div>

                {/* 2. Color Palette Selector */}
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5">{ui.nodeColorLabel}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNodeColorMode("multi")}
                      className={`text-[10px] font-mono py-1 px-2 border rounded text-center transition-all cursor-pointer ${
                        nodeColorMode === "multi"
                          ? `border-white text-white ${activeTheme.bgLight}`
                          : "border-[#1f2833] text-[#858585] bg-[#0b0c10]/40 hover:text-white"
                      }`}
                    >
                      {ui.multiColor}
                    </button>
                    <button
                      type="button"
                      onClick={() => setNodeColorMode("accent")}
                      className={`text-[10px] font-mono py-1 px-2 border rounded text-center transition-all cursor-pointer ${
                        nodeColorMode === "accent"
                          ? `border-white text-white ${activeTheme.bgLight}`
                          : "border-[#1f2833] text-[#858585] bg-[#0b0c10]/40 hover:text-white"
                      }`}
                    >
                      {ui.accentTheme}
                    </button>
                  </div>
                </div>

                {/* 3. Line Connection Mode */}
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5">{ui.nodeLineStyle}</label>
                  <div className="grid grid-cols-3 gap-1">
                    {(["dashed", "solid", "none"] as const).map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setLineStyle(style)}
                        className={`text-[10px] font-mono py-1 px-1.5 border rounded text-center transition-all cursor-pointer capitalize ${
                          lineStyle === style
                            ? `border-white text-white ${activeTheme.bgLight}`
                            : "border-[#1f2833] text-[#858585] bg-[#0b0c10]/40 hover:text-white"
                        }`}
                      >
                        {style === "dashed" ? ui.dashed : style === "solid" ? ui.solid : ui.none}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Diagnostics telemetry output */}
              <div className="bg-[#0b0c10]/50 border border-[#1f2833]/40 p-3 rounded-lg font-mono text-[10px] text-neutral-400 space-y-1 mt-2">
                <div className="flex justify-between">
                  <span>LAST COORDS:</span>
                  <span className="text-white font-bold">{lastCoords.x}, {lastCoords.y}</span>
                </div>
                <div className="flex justify-between">
                  <span>TOTAL NODES:</span>
                  <span className={`${activeTheme.text} font-bold`}>{nodes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>CANVAS COMP:</span>
                  <span className="text-emerald-400">ACTIVE</span>
                </div>
              </div>
            </div>

            {/* Right Box: Drawing Canvas Area (xl:col-span-9) */}
            <div className="xl:col-span-9 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <Database className={`w-4.5 h-4.5 ${activeTheme.text}`} />
                  <h3 className="text-xs font-bold text-white tracking-widest uppercase">{ui.tactilePlayground}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="btn-clear-canvas"
                    onClick={clearCanvas}
                    disabled={nodes.length === 0}
                    className="flex items-center gap-1.5 text-xs text-red-400 bg-red-950/20 hover:bg-red-950/40 border border-red-900/35 px-3 py-1.5 rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> {ui.clearCanvasBtn}
                  </button>
                </div>
              </div>

              <div
                id="sandbox-drawing-canvas"
                onClick={handleCanvasClick}
                className={`h-72 rounded-xl border border-[#1f2833] bg-[#0b0c10] relative overflow-hidden cursor-crosshair group flex items-center justify-center transition-all shadow-inner hover:border-white/20`}
              >
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[radial-gradient(#1f2833_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none opacity-40"></div>

                {/* Dynamic Connected Lines */}
                {lineStyle !== "none" && nodes.map((node, i) => {
                  if (i === 0) return null;
                  const prev = nodes[i - 1];
                  return (
                    <svg key={`line-${node.id}`} className="absolute inset-0 w-full h-full pointer-events-none">
                      <line
                        x1={prev.x}
                        y1={prev.y}
                        x2={node.x}
                        y2={node.y}
                        stroke={activeTheme.hex}
                        strokeWidth="1.5"
                        strokeOpacity="0.4"
                        strokeDasharray={lineStyle === "dashed" ? "4 2" : "0"}
                      />
                    </svg>
                  );
                })}

                {/* Interactive Nodes */}
                {nodes.map((node) => (
                  <div
                    key={node.id}
                    style={{
                      left: node.x - node.size / 2,
                      top: node.y - node.size / 2,
                      width: node.size,
                      height: node.size,
                      backgroundColor: node.color,
                      boxShadow: `0 0 14px ${node.color}cc`,
                    }}
                    className="absolute rounded-full transition-transform duration-300 hover:scale-150 animate-fade-in"
                  />
                ))}

                {nodes.length === 0 && (
                  <div className="text-center font-mono text-[#858585] text-xs pointer-events-none relative z-10 flex flex-col items-center gap-2 max-w-md px-4">
                    <Play className={`w-6 h-6 ${activeTheme.text} opacity-60 animate-bounce`} />
                    {ui.clickAnywhere}
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Footer Branding Area */}
      <footer id="app-footer" className="border-t border-[#1f2833] bg-[#151a21]/30 py-4 px-4 text-center text-xs text-[#858585] z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-mono">
          <p>
            {ui.footerStatus}
          </p>
          <p className="text-[10px]">
            {ui.footerCreated}
          </p>
        </div>
      </footer>
    </div>
  );
}
