import { useState, useEffect, useRef } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';
import {
  ChevronDown,
  ChevronLeft,
  File,
  Folder,
  FolderOpen,
  X,
  Code,
  Settings,
  Search,
  GitBranch,
  Terminal,
  Sparkles } from
'lucide-react';

const FOLDER_COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899', '#10b981', '#ef4444'];

interface IDEViewProps {
  sections: LinkSection[];
  visible: boolean;
}

/* ════ VS Code-Style IDE View ════ */
export const IDEView = ({ sections, visible }: IDEViewProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<LinkItem | null>(null);
  const [openTabs, setOpenTabs] = useState<LinkItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [revealed, setRevealed] = useState(0);
  const allLinks = sections.flatMap((s) => s.links);

  // Initialize all sections as expanded
  useEffect(() => {
    const init: Record<string, boolean> = {};
    sections.forEach((s) => {init[s.id] = true;});
    setExpandedSections(init);
  }, [sections.length]);

  useEffect(() => {
    if (!visible) return;
    setRevealed(0);
    setOpenTabs([]);
    setActiveTab(null);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setRevealed(i);
      if (i >= allLinks.length + 4) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [visible]);

  const openFile = (link: LinkItem) => {
    if (!openTabs.find((t) => t.id === link.id)) {
      setOpenTabs((prev) => [...prev, link]);
    }
    setActiveTab(link);
  };

  const closeTab = (link: LinkItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTabs = openTabs.filter((t) => t.id !== link.id);
    setOpenTabs(newTabs);
    if (activeTab?.id === link.id) {
      setActiveTab(newTabs.length > 0 ? newTabs[newTabs.length - 1] : null);
    }
  };

  let lineIdx = 0;
  const show = () => lineIdx++ < revealed;

  return (
    <div data-ev-id="ev_5a01c4b604"
    className={`transition-[opacity,transform] duration-700 ${
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
    }>

      {/* IDE Window */}
      <div data-ev-id="ev_a521710ccc"
      className="mx-auto max-w-3xl rounded-xl overflow-hidden border border-white/[0.08]"
      style={{
        background: '#1e1e2e',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(139,92,246,0.03)'
      }}>

        {/* Title Bar */}
        <div data-ev-id="ev_8a7ea2eb43" className="flex items-center px-4 py-2 border-b border-white/[0.06] bg-[#181825]">
          <div data-ev-id="ev_e176f12f0a" className="flex gap-1.5">
            <div data-ev-id="ev_effd72ac45" className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/70" />
            <div data-ev-id="ev_58fe3b1712" className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/70" />
            <div data-ev-id="ev_b3fb57fcd9" className="w-2.5 h-2.5 rounded-full bg-[#28c840]/70" />
          </div>
          <span data-ev-id="ev_05fb690253" className="flex-1 text-center text-[11px] text-white/60 font-mono">
            nVision Hub — VS Code
          </span>
          <div data-ev-id="ev_276e530a13" className="w-12" />
        </div>

        {/* Main layout */}
        <div data-ev-id="ev_b9282d3c49" className="flex" style={{ minHeight: 420, maxHeight: 520 }}>
          {/* Activity Bar */}
          <div data-ev-id="ev_78c8d162f1" className="w-11 bg-[#11111b] border-l border-white/[0.04] flex flex-col items-center py-3 gap-3 flex-shrink-0">
            <button data-ev-id="ev_9fa5e54e57"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            sidebarOpen ? 'bg-white/[0.06] text-white/60' : 'text-white/60 hover:text-white/70'}`
            }>

              <File className="w-4 h-4" />
            </button>
            <button data-ev-id="ev_492c4df2cf" className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white/70 transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <button data-ev-id="ev_e4ad0663f8" className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white/70 transition-colors">
              <GitBranch className="w-4 h-4" />
            </button>
            <button data-ev-id="ev_2681dbab0e" className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white/70 transition-colors">
              <Sparkles className="w-4 h-4" />
            </button>
            <div data-ev-id="ev_98f4b9927c" className="flex-1" />
            <button data-ev-id="ev_194c51d593" className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white/70 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Sidebar / Explorer */}
          {sidebarOpen &&
          <div data-ev-id="ev_a5783d219d"
          className="w-52 bg-[#181825] border-l border-white/[0.04] overflow-y-auto flex-shrink-0"
          dir="ltr"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.05) transparent' }}>

              <div data-ev-id="ev_599b60adff" className="px-3 py-2 text-[10px] text-white/60 uppercase tracking-wider font-semibold">
                Explorer
              </div>

              {/* Section folders — rendered dynamically */}
              {sections.map((section, sIdx) => {
              const isExpanded = expandedSections[section.id] ?? true;
              const folderColor = FOLDER_COLORS[sIdx % FOLDER_COLORS.length];

              return show() ?
              <div data-ev-id="ev_973d394f53" key={section.id} className={`animate-in fade-in duration-200 ${sIdx > 0 ? 'mt-1' : ''}`}>
                    <button data-ev-id="ev_8404880777"
                className="w-full flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-white/60 hover:bg-white/[0.04] transition-colors"
                onClick={() => setExpandedSections((prev) => ({ ...prev, [section.id]: !prev[section.id] }))}>

                      <ChevronDown
                    className={`w-3 h-3 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />

                      {isExpanded ?
                  <FolderOpen className="w-3.5 h-3.5" style={{ color: `${folderColor}b3` }} /> :
                  <Folder className="w-3.5 h-3.5" style={{ color: `${folderColor}b3` }} />
                  }
                      <span data-ev-id="ev_87e9b855ff" className="font-medium">{section.title}</span>
                      <span data-ev-id="ev_7a3bdd4c91" className="text-white/60 text-[10px] mr-auto">{section.links.length}</span>
                    </button>

                    {isExpanded &&
                section.links.map((link) => {
                  const s = show();
                  return s ?
                  <button data-ev-id="ev_902c33842e"
                  key={link.id}
                  className={`w-full flex items-center gap-2 pr-7 pl-3 py-1 text-xs transition-colors ${
                  activeTab?.id === link.id ?
                  'bg-white/[0.06] text-white/90' :
                  'text-white/60 hover:bg-white/[0.03] hover:text-white/65'}`
                  }
                  onClick={() => openFile(link)}>

                            <div data-ev-id="ev_f0d50f1996" className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0">
                              <AnimatedIcon
                        icon={link.icon}
                        animation={link.animation}
                        color={link.color}
                        isHovered={activeTab?.id === link.id} />
                            </div>
                            <span data-ev-id="ev_ed80d73f21" className="truncate">{link.title}</span>
                            <span data-ev-id="ev_8483942485" className="text-[9px] text-white/60 mr-auto">.tsx</span>
                          </button> :
                  null;
                })
                }
                  </div> :
              null;
            })}
            </div>
          }

          {/* Editor Area */}
          <div data-ev-id="ev_f2e606d78d" className="flex-1 flex flex-col min-w-0">
            {/* Tabs bar */}
            <div data-ev-id="ev_ef6c53f697"
            className="flex bg-[#11111b] border-b border-white/[0.04] overflow-x-auto"
            dir="ltr"
            style={{ scrollbarWidth: 'none' }}>

              {openTabs.length === 0 &&
              <div data-ev-id="ev_d672060662" className="px-3 py-1.5 text-[11px] text-white/60">
                  לחץ על קובץ לפתיחה
                </div>
              }
              {openTabs.map((tab) =>
              <button data-ev-id="ev_4159731287"
              key={tab.id}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border-l border-white/[0.04] transition-colors whitespace-nowrap ${
              activeTab?.id === tab.id ?
              'bg-[#1e1e2e] text-white/80 border-t-2' :
              'bg-[#11111b] text-white/60 hover:text-white/70 border-t-2 border-t-transparent'}`
              }
              style={{
                borderTopColor: activeTab?.id === tab.id ? tab.color : 'transparent'
              }}>

                  <span data-ev-id="ev_37ef6cb6b5"
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: tab.color + '60' }} />

                  {tab.title}.tsx
                  <span data-ev-id="ev_79061ea8b5"
                className="w-4 h-4 rounded flex items-center justify-center hover:bg-white/[0.08] transition-colors"
                onClick={(e) => closeTab(tab, e)}>

                    <X className="w-3 h-3" />
                  </span>
                </button>
              )}
            </div>

            {/* Editor content */}
            <div data-ev-id="ev_8622c9fb5e"
            className="flex-1 overflow-y-auto p-0"
            dir="ltr"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.05) transparent' }}>

              {!activeTab ?
              <WelcomeTab /> :

              <EditorContent link={activeTab} />
              }
            </div>

            {/* Status Bar */}
            <div data-ev-id="ev_cd516a22da" className="flex items-center justify-between px-3 py-1 bg-[#181825] border-t border-white/[0.04] text-[10px]" dir="ltr">
              <div data-ev-id="ev_fdfa98f5d0" className="flex items-center gap-3">
                <span data-ev-id="ev_4f2cfaf6ee" className="flex items-center gap-1 text-purple-400/60">
                  <GitBranch className="w-3 h-3" /> main
                </span>
                <span data-ev-id="ev_94810060b3" className="text-white/60">UTF-8</span>
                <span data-ev-id="ev_c27c173e27" className="text-white/60">TypeScript React</span>
              </div>
              <div data-ev-id="ev_3e9e57ce36" className="flex items-center gap-3">
                <span data-ev-id="ev_0cf0760692" className="text-white/60">Ln 1, Col 1</span>
                <span data-ev-id="ev_e3fd04900f" className="text-cyan-400/50 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> nVision AI
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

};

/* ═════ Welcome Tab ═════ */
const WelcomeTab = () =>
<div data-ev-id="ev_0991c42c37" className="flex flex-col items-center justify-center h-full py-12 px-6 text-center">
    <div data-ev-id="ev_26018692d6" className="text-white/[0.04] text-[60px] font-bold mb-4 select-none" style={{ fontFamily: 'monospace' }}>
      nV
    </div>
    <h3 data-ev-id="ev_37afb6c9a2" className="text-white/60 text-base font-medium mb-2">Welcome to nVision Hub</h3>
    <p data-ev-id="ev_e79b81b95a" className="text-white/60 text-sm max-w-xs leading-relaxed">
      Select a file from the Explorer sidebar to view community links and AI tools.
      Each file contains a link and its details.
    </p>
    <div data-ev-id="ev_d65db7b90b" className="flex gap-3 mt-6 text-[10px] text-white/60">
      <span data-ev-id="ev_e8ea309143" className="flex items-center gap-1"><Code className="w-3 h-3" /> Open File</span>
      <span data-ev-id="ev_d9b307ba68" className="text-white/[0.06]">|</span>
      <span data-ev-id="ev_632b395e2a" className="flex items-center gap-1"><Terminal className="w-3 h-3" /> Terminal</span>
      <span data-ev-id="ev_badd31218a" className="text-white/[0.06]">|</span>
      <span data-ev-id="ev_3303b122de" className="flex items-center gap-1"><Search className="w-3 h-3" /> Search</span>
    </div>
  </div>;


/* ═════ Editor Content (Code View) ═════ */
const EditorContent = ({ link }: {link: LinkItem;}) => {
  const [hovered, setHovered] = useState(false);

  // Generate "code" representation of the link
  const lines = [
  { num: 1, code: `import { ${link.icon.displayName || 'Icon'} } from 'lucide-react';`, color: 'purple' },
  { num: 2, code: '', color: '' },
  { num: 3, code: `// ═══ ${link.title} ═══`, color: 'green' },
  { num: 4, code: `// ${link.description}`, color: 'green' },
  { num: 5, code: '', color: '' },
  { num: 6, code: `interface LinkConfig {`, color: 'purple' },
  { num: 7, code: `  title: string;`, color: '' },
  { num: 8, code: `  subtitle: string;`, color: '' },
  { num: 9, code: `  url: string;`, color: '' },
  { num: 10, code: `  color: string;`, color: '' },
  { num: 11, code: `}`, color: 'purple' },
  { num: 12, code: '', color: '' },
  { num: 13, code: `export const config: LinkConfig = {`, color: 'cyan' },
  { num: 14, code: `  title: "${link.title}",`, color: 'orange' },
  { num: 15, code: `  subtitle: "${link.subtitle}",`, color: 'orange' },
  { num: 16, code: `  url: "${link.url}",`, color: 'orange' },
  { num: 17, code: `  color: "${link.color}",`, color: 'orange' },
  { num: 18, code: `};`, color: 'cyan' },
  { num: 19, code: '', color: '' },
  { num: 20, code: `// ▶ Click below to open link`, color: 'green' }];


  const colorMap: Record<string, string> = {
    purple: 'text-purple-400/80',
    green: 'text-green-400/50',
    cyan: 'text-cyan-400/80',
    orange: 'text-amber-300/80',
    '': 'text-white/60'
  };

  return (
    <div data-ev-id="ev_23f2471c42" className="font-mono text-[12px] leading-[1.7]">
      {/* Breadcrumb */}
      <div data-ev-id="ev_251dd5c549" className="px-4 py-1.5 text-[10px] text-white/60 border-b border-white/[0.04] flex items-center gap-1">
        <span data-ev-id="ev_9aa055239f">src</span>
        <ChevronLeft className="w-3 h-3 rotate-180" />
        <span data-ev-id="ev_46ca763656" className="text-cyan-400/40">{link.title}.tsx</span>
      </div>

      {/* Code lines */}
      <div data-ev-id="ev_caf3620427" className="py-2">
        {lines.map((line) =>
        <div data-ev-id="ev_dc94746e10"
        key={line.num}
        className="flex hover:bg-white/[0.02] transition-colors">

            <span data-ev-id="ev_b4d992345d" className="w-10 text-left pr-4 text-white/60 text-[11px] select-none flex-shrink-0">
              {line.num}
            </span>
            <span data-ev-id="ev_96e686ec0c" className={`${colorMap[line.color]} whitespace-pre`}>{line.code}</span>
          </div>
        )}
      </div>

      {/* CTA Card inside editor */}
      <div data-ev-id="ev_31c8a68e0d" className="mx-4 mt-2 mb-4">
        <a data-ev-id="ev_08ee947618"
        href={link.url}
        target="_blank" rel="noopener noreferrer"
        aria-label={`${link.title} — ${link.subtitle} (נפתח בחלון חדש)`}
        className="block rounded-lg border transition-all duration-300 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        style={{
          borderColor: hovered ? `${link.color}40` : 'rgba(255,255,255,0.06)',
          background: hovered ?
          `linear-gradient(135deg, ${link.color}12, rgba(30,30,46,0.9))` :
          'rgba(255,255,255,0.02)',
          boxShadow: hovered ? `0 4px 20px ${link.color}15` : 'none'
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}>

          <div data-ev-id="ev_e674e81771" className="p-4 flex items-center gap-3">
            <div data-ev-id="ev_d121a3676f"
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
            style={{ background: `${link.color}15` }}>

              <AnimatedIcon
                icon={link.icon}
                animation={link.animation}
                color={link.color}
                isHovered={hovered} />

            </div>
            <div data-ev-id="ev_7dfe32b7b7" className="flex-1 min-w-0">
              <div data-ev-id="ev_438a2242d4" className="text-white/90 text-base font-semibold">{link.title}</div>
              <div data-ev-id="ev_8c8e76ed6b" className="text-white/60 text-xs mt-0.5">{link.subtitle}</div>
            </div>
            <span data-ev-id="ev_6880cfbf66"
            className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200"
            style={{
              backgroundColor: `${link.color}20`,
              color: `${link.color}cc`
            }}>

              ▶ Run
            </span>
          </div>
        </a>
      </div>
    </div>);

};