import { useState, useMemo } from 'react';
import { ArrowRight, Check, Sparkles, Play, Eye, Zap, Heart, Star, Globe, Rocket, Shield, Bell, Camera, Music, Coffee } from 'lucide-react';
import { Link } from 'react-router';
import { scenes } from '@/components/logoScenes';
import type { TransitionType } from '@/components/logoScenes';
import { ScenePreviewCanvas } from '@/components/ScenePreviewCanvas';
import { TransitionPreviewCanvas } from '@/components/TransitionPreviewCanvas';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { IconAnimation } from '@/data/links';

/* ═══════════════════════════════════════════════════
 *  Animation Preview Page
 *  Visual gallery of all logo scenes + transition types
 * ═══════════════════════════════════════════════════ */

const TRANSITION_TYPES: {type: TransitionType;label: string;labelHe: string;description: string;color: string;}[] = [
{ type: 'explode', label: 'Explode', labelHe: 'פיצוץ', description: 'חלקיקים מתפצצים רדיאלית מהמרכז', color: '#f97316' },
{ type: 'vortex', label: 'Vortex', labelHe: 'מערבולת', description: 'ספירלה עם 3.5 סיבובים — רוטציה היפנוטית', color: '#6366f1' },
{ type: 'rain', label: 'Rain', labelHe: 'גשם', description: 'חלקיקים נופלים כלפי מטה — רגוע', color: '#06b6d4' },
{ type: 'rise', label: 'Rise', labelHe: 'עלייה', description: 'חלקיקים עולים כלפי מעלה — התרוממות', color: '#fbbf24' },
{ type: 'shatter', label: 'Shatter', labelHe: 'רסיסים', description: 'שברים בזוויות קבועות — גיאומטרי', color: '#8b5cf6' },
{ type: 'wave', label: 'Wave', labelHe: 'גל', description: 'גל מתרחב מהמרכז — אורגני', color: '#22d3ee' },
{ type: 'fade', label: 'Fade', labelHe: 'דעיכה', description: 'דעיכה רכה במקום עם סחיפה עדינה', color: '#a78bfa' },
{ type: 'spiral', label: 'Spiral', labelHe: 'ספירלה', description: 'ספירלה פנימית הדוקה — מתכנסת למרכז', color: '#818cf8' },
{ type: 'glitch', label: 'Glitch', labelHe: 'גליץ׳', description: 'הזזה אקראית רועדת עם הבהוב', color: '#67e8f9' },
{ type: 'portal', label: 'Portal', labelHe: 'פורטל', description: 'נשאב לנקודה מרכזית — חור שחור', color: '#a855f7' },
{ type: 'cascade', label: 'Cascade', labelHe: 'מפל', description: 'גל רציף משמאל לימין', color: '#2dd4bf' },
{ type: 'orbit', label: 'Orbit', labelHe: 'מסלול', description: 'חלקיקים מקיפים במעגל לפני שעפים', color: '#c084fc' },
{ type: 'zoom', label: 'Zoom', labelHe: 'זום', description: 'חלקיקים מתרחקים מהמרכז — אפקט זום', color: '#facc15' }];


const SCENE_ICONS: Record<string, string> = {
  Eye: '👁️', Neural: '🧠', Lightning: '⚡', Plasma: '🟣',
  Kaleidoscope: '🔮', Fireworks: '🎆', Starfield: '⭐', DNA: '🧬',
  Radar: '📡', Heartbeat: '💓', Spiral: '🌀', Fractal: '🌲',
  Blob: '🪷', Orbits: '🪐', Geometry: '🔷', Matrix: '📟',
  Soundwave: '🎵', ParticleText: '✨', Hexgrid: '⬢', Ripple: '💧',
  Circuit: '🔌', Transformer: '🤖', CodeFlow: '💻', 'AI Core': '🧪', Katana: '⚔️'
};

type Tab = 'icons' | 'scenes' | 'transitions' | 'full';

const DEMO_ICONS = [Zap, Heart, Star, Globe, Rocket, Shield, Bell, Camera, Music, Coffee];
const DEMO_COLORS = ['#06b6d4', '#ec4899', '#f59e0b', '#6366f1', '#ef4444', '#22c55e', '#8b5cf6', '#f97316', '#14b8a6', '#a855f7'];

const ALL_ICON_ANIMATIONS: { type: IconAnimation; label: string; labelHe: string; description: string; speed: string }[] = [
  { type: 'bounce', label: 'Bounce', labelHe: 'קפיצה', description: 'תנועה אנכית למעלה ולמטה', speed: '0.6s' },
  { type: 'wiggle', label: 'Wiggle', labelHe: 'ניענוע', description: 'סיבוב מהיר ימינה ושמאלה', speed: '0.5s' },
  { type: 'pulse-grow', label: 'Pulse Grow', labelHe: 'פעימה', description: 'הגדלה והקטנה מחזורית', speed: '1s' },
  { type: 'spin-slow', label: 'Spin', labelHe: 'סיבוב', description: 'סיבוב מלא 360 מעלות', speed: '2s' },
  { type: 'float', label: 'Float', labelHe: 'ריחוף', description: 'ריחוף עדין עם הטיה קלה', speed: '1.5s' },
  { type: 'swing', label: 'Swing', labelHe: 'נדנוד', description: 'תנועת מטוטלת ±15 מעלות', speed: '0.8s' },
  { type: 'rubber', label: 'Rubber', labelHe: 'גומי', description: 'אפקט גומייה — מתיחה וכיווץ', speed: '0.8s' },
  { type: 'flash', label: 'Flash', labelHe: 'הבזק', description: 'הבהוב שקיפות מהיר', speed: '1s' },
  { type: 'tilt', label: 'Tilt', labelHe: 'הטיה', description: 'הטיה עם הזזה צדית', speed: '0.6s' },
  { type: 'breathe', label: 'Breathe', labelHe: 'נשימה', description: 'נשימה — הגדלה עדינה עם שקיפות', speed: '1.5s' },
  { type: 'jello', label: 'Jello', labelHe: "ג'לי", description: 'רעידת ג\'לי תלת-ממדית', speed: '0.9s' },
  { type: 'flip', label: 'Flip', labelHe: 'הפיכה', description: 'הפיכה תלת-ממדית סביב ציר Y', speed: '1.2s' },
  { type: 'heartbeat', label: 'Heartbeat', labelHe: 'דופק', description: 'פעימת לב — הגדלה כפולה מהירה', speed: '1.4s' },
  { type: 'shake', label: 'Shake', labelHe: 'רעידה', description: 'רעידה אופקית מהירה', speed: '0.5s' },
  { type: 'tada', label: 'Tada', labelHe: 'טאדא!', description: 'סיבוב עם הגדלה דרמטית', speed: '1s' },
  { type: 'pendulum', label: 'Pendulum', labelHe: 'מטוטלת', description: 'נדנוד מטוטלת מנקודת ציר עליונה', speed: '1.5s' },
  { type: 'morph', label: 'Morph', labelHe: 'מורפינג', description: 'שינוי צורה — עיגול לריבוע', speed: '2s' },
  { type: 'orbit-spin', label: 'Orbit Spin', labelHe: 'מסלול', description: 'סיבוב במסלול אליפטי', speed: '2s' },
  { type: 'glitch-icon', label: 'Glitch', labelHe: "גליץ'", description: 'אפקט גליץ\' — הזזה רנדומלית', speed: '0.6s' },
  { type: 'zoom-pulse', label: 'Zoom Pulse', labelHe: 'זום פעימה', description: 'הגדלה פתאומית עם הבהוב', speed: '1.2s' },
];

/** Route: /animation-preview — dev-only gallery of all logo scenes and transition effects. */
const AnimationPreview = () => {
  const [tab, setTab] = useState<Tab>('icons');
  const [selectedScene, setSelectedScene] = useState<number | null>(null);
  const [selectedTransition, setSelectedTransition] = useState<TransitionType | null>(null);
  const [fullScreenIdx, setFullScreenIdx] = useState<number | null>(null);

  // Sort scenes with selected first for the "full" view
  const scenesForFull = useMemo(() => scenes.map((s, i) => ({ ...s, idx: i })), []);

  return (
    <div data-ev-id="ev_08d73a2d50" dir="rtl" className="min-h-screen relative" style={{ background: 'linear-gradient(160deg, #0a0a14 0%, #0d0d1a 30%, #0f0a1a 60%, #0a0f14 100%)' }}>
      {/* Header */}
      <div data-ev-id="ev_0e0c063813" className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/5 bg-black/40">
        <div data-ev-id="ev_27a8d0c9b8" className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div data-ev-id="ev_e059d7c47c" className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white/70 transition-colors text-sm">
              <ArrowRight className="w-4 h-4" />חזרה
            </Link>
            <div data-ev-id="ev_66c444d3d4" className="w-px h-5 bg-white/10 hidden sm:block" />
            <h1 data-ev-id="ev_b0dc2a31da" className="text-white/90 text-sm sm:text-lg font-bold flex items-center gap-2">
              <Play className="w-5 h-5 text-purple-400 hidden sm:block" />
              אנימציות
            </h1>
          </div>
          <div data-ev-id="ev_fc20439986" className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto">
            <Link to="/font-preview" className="px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] text-cyan-400/60 hover:text-cyan-300 border border-cyan-500/10 hover:border-cyan-500/25 rounded-md transition-colors whitespace-nowrap">🎨 טיפוגרפיה</Link>
            <Link to="/entrance-preview" className="px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] text-emerald-400/60 hover:text-emerald-300 border border-emerald-500/10 hover:border-emerald-500/25 rounded-md transition-colors whitespace-nowrap">🚀 כניסה</Link>
            <div data-ev-id="ev_f8c018b868" className="w-px h-4 bg-white/10 mx-0.5 hidden sm:block" />
            <span data-ev-id="ev_38762c3d9c" className="text-white/60 text-[10px] sm:text-xs whitespace-nowrap hidden sm:inline">{scenes.length} סצנות · 13 מעברים</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div data-ev-id="ev_0c3f993922" className="max-w-7xl mx-auto px-4 pt-6 pb-4">
        <div data-ev-id="ev_7383932d63" className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {[
          { key: 'icons' as Tab, label: `✨ אייקונים (${ALL_ICON_ANIMATIONS.length})`, desc: 'אנימציות לקישורים' },
          { key: 'scenes' as Tab, label: `🎬 סצנות (${scenes.length})`, desc: 'כל אנימציות הרקע' },
          { key: 'transitions' as Tab, label: '🌀 מעברים (13)', desc: 'אפקטי פיזור חלקיקים' },
          { key: 'full' as Tab, label: '🔮 סצנה מלאה', desc: 'ראה סצנה בגדול' }].
          map(({ key, label }) =>
          <button data-ev-id="ev_abb675a1ed"
          key={key}
          onClick={() => setTab(key)}
          className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
          tab === key ?
          'bg-purple-500/15 text-purple-300 border border-purple-500/30' :
          'text-white/60 hover:text-white/60 border border-transparent hover:border-white/10'}`
          }>

              {label}
            </button>
          )}
        </div>
      </div>

      <div data-ev-id="ev_194d95b89d" className="max-w-7xl mx-auto px-4 pb-16">

        {/* ═══ ICON ANIMATIONS TAB ═══ */}
        {tab === 'icons' &&
        <div>
            <p className="text-white/60 text-center text-sm mb-2">העבר עכבר או לחץ על כרטיס כדי לראות את האנימציה חיה</p>
            <p className="text-white/40 text-center text-xs mb-8">10 הראשונים פעילים · 10 חדשים זמינים להפעלה</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {ALL_ICON_ANIMATIONS.map((anim, i) => {
              const DemoIcon = DEMO_ICONS[i % DEMO_ICONS.length];
              const demoColor = DEMO_COLORS[i % DEMO_COLORS.length];
              const isNew = i >= 10;
              return (
                <IconAnimCard
                  key={anim.type}
                  anim={anim}
                  icon={DemoIcon}
                  color={demoColor}
                  isNew={isNew} />
              );
            })}
            </div>
          </div>
        }

        {/* ═══ SCENES TAB ═══ */}
        {tab === 'scenes' &&
        <div data-ev-id="ev_fe77768338">
            <p data-ev-id="ev_1a7d66bf34" className="text-white/60 text-center text-sm mb-8">כל סצנה רצה חי עם אינטראקציית עכבר — הזז את העכבר מעל הקנבס</p>
            <div data-ev-id="ev_79fd7672f8" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {scenes.map((scene, i) => {
              const isSelected = selectedScene === i;
              return (
                <button data-ev-id="ev_0fa671cc30"
                key={i}
                onClick={() => setSelectedScene(isSelected ? null : i)}
                className={`group flex flex-col items-center rounded-2xl border-2 transition-all duration-400 overflow-hidden cursor-pointer ${
                isSelected ?
                'border-purple-500/50 shadow-[0_0_30px_rgba(139,92,246,0.15)] bg-purple-500/[0.04]' :
                'border-white/[0.05] hover:border-white/15 bg-white/[0.01] hover:bg-white/[0.02]'}`
                }>

                    {/* Canvas */}
                    <div data-ev-id="ev_9de17e8fd9" className="relative w-full aspect-square p-2">
                      <ScenePreviewCanvas draw={scene.draw} size={180} active={true} className="mx-auto" />
                      {isSelected &&
                    <div data-ev-id="ev_ac28df3bbe" className="absolute top-3 right-3">
                          <div data-ev-id="ev_91df1d7889" className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        </div>
                    }
                    </div>

                    {/* Info */}
                    <div data-ev-id="ev_7594edcb71" className="w-full px-3 pb-3 pt-1">
                      <div data-ev-id="ev_aa4144ec77" className="flex items-center justify-center gap-1.5 mb-1">
                        <span data-ev-id="ev_d27b3fbe95" className="text-base">{SCENE_ICONS[scene.name] || '🎬'}</span>
                        <span data-ev-id="ev_4670c6537c" className="text-white/80 text-sm font-semibold">{scene.name}</span>
                      </div>
                      <div data-ev-id="ev_478276ac09" className="flex items-center justify-center gap-1">
                        <span data-ev-id="ev_fccf551d53" className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-white/60 border border-white/[0.04]">
                          {scene.transition}
                        </span>
                      </div>
                    </div>
                  </button>);

            })}
            </div>

            {selectedScene !== null &&
          <div data-ev-id="ev_8b15661c18" className="mt-8 text-center">
                <p data-ev-id="ev_aaf5e3961d" className="text-purple-300/60 text-sm">
                  נבחר: <strong data-ev-id="ev_a694d4a9a7" className="text-purple-300">{scenes[selectedScene].name}</strong> עם מעבר <strong data-ev-id="ev_a78f0c4d2f" className="text-purple-300">{scenes[selectedScene].transition}</strong>
                </p>
              </div>
          }
          </div>
        }

        {/* ═══ TRANSITIONS TAB ═══ */}
        {tab === 'transitions' &&
        <div data-ev-id="ev_d622ad5391">
            <p data-ev-id="ev_4fc23f8719" className="text-white/60 text-center text-sm mb-8">כל מעבר מראה איך חלקיקי הטקסט מתפזרים ומתאספים מחדש</p>
            <div data-ev-id="ev_2e21d95a72" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {TRANSITION_TYPES.map((t) => {
              const isSelected = selectedTransition === t.type;
              const usedBy = scenes.filter((s) => s.transition === t.type).map((s) => s.name);

              return (
                <button data-ev-id="ev_3d3b23f4b6"
                key={t.type}
                onClick={() => setSelectedTransition(isSelected ? null : t.type)}
                className={`flex flex-col items-center rounded-2xl border-2 transition-all duration-400 p-5 cursor-pointer ${
                isSelected ?
                'border-purple-500/50 shadow-[0_0_30px_rgba(139,92,246,0.15)] bg-purple-500/[0.04]' :
                'border-white/[0.05] hover:border-white/15 bg-white/[0.01] hover:bg-white/[0.02]'}`
                }>

                    {/* Preview */}
                    <TransitionPreviewCanvas type={t.type} size={180} active={true} className="mx-auto mb-4" />

                    {/* Label */}
                    <div data-ev-id="ev_baa2849dcc" className="flex items-center gap-2 mb-2">
                      <div data-ev-id="ev_283f8272a9" className="w-3 h-3 rounded-full" style={{ background: t.color, boxShadow: `0 0 10px ${t.color}40` }} />
                      <span data-ev-id="ev_434f151181" className="text-white/90 font-bold text-base">{t.label}</span>
                      <span data-ev-id="ev_4b447faa98" className="text-white/60 text-sm">— {t.labelHe}</span>
                      {isSelected && <Check className="w-4 h-4 text-purple-400" />}
                    </div>

                    <p data-ev-id="ev_c5f39f7cca" className="text-white/60 text-sm mb-3">{t.description}</p>

                    {/* Used by */}
                    <div data-ev-id="ev_540651d5fd" className="w-full">
                      <p data-ev-id="ev_c4a9d2ff60" className="text-white/60 text-[10px] tracking-widest mb-1.5">משמש בסצנות:</p>
                      <div data-ev-id="ev_d4c9c499fd" className="flex flex-wrap gap-1 justify-center">
                        {usedBy.map((name) =>
                      <span data-ev-id="ev_8db7206a52" key={name} className="px-1.5 py-0.5 rounded text-[10px] bg-white/[0.04] text-white/60 border border-white/[0.04]">
                            {SCENE_ICONS[name] || ''} {name}
                          </span>
                      )}
                      </div>
                    </div>
                  </button>);

            })}
            </div>
          </div>
        }

        {/* ═══ FULL SCENE TAB ═══ */}
        {tab === 'full' &&
        <div data-ev-id="ev_2705c0a1ea">
            <p data-ev-id="ev_30d45a7658" className="text-white/60 text-center text-sm mb-6">לחץ על סצנה לראות אותה בגדול מלא עם אינטראקציית עכבר</p>

            {/* Scene selector pills */}
            <div data-ev-id="ev_056e8c0cba" className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-8 max-h-48 overflow-y-auto">
              {scenes.map((s, i) =>
            <button data-ev-id="ev_a3e2029470"
            key={i}
            onClick={() => setFullScreenIdx(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            fullScreenIdx === i ?
            'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
            'text-white/60 hover:text-white/60 border border-white/[0.06] hover:border-white/15'}`
            }>

                  {SCENE_ICONS[s.name] || ''} {s.name}
                </button>
            )}
            </div>

            {/* Large preview */}
            {fullScreenIdx !== null &&
          <div data-ev-id="ev_de4f79777e" className="flex flex-col items-center gap-4">
                <div data-ev-id="ev_ef25b0d721" className="rounded-2xl border-2 border-purple-500/30 overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.1)] bg-black/40 p-4">
                  <ScenePreviewCanvas
                draw={scenes[fullScreenIdx].draw}
                size={Math.min(500, typeof window !== 'undefined' ? window.innerWidth - 80 : 500)}
                active={true} />

                </div>
                <div data-ev-id="ev_e09d34ecae" className="text-center">
                  <p data-ev-id="ev_915ff87f59" className="text-white/80 font-bold text-lg flex items-center gap-2 justify-center">
                    <span data-ev-id="ev_0d9aa793db" className="text-xl">{SCENE_ICONS[scenes[fullScreenIdx].name] || '🎬'}</span>
                    {scenes[fullScreenIdx].name}
                  </p>
                  <p data-ev-id="ev_5dfa873191" className="text-white/60 text-sm mt-1">
                    מעבר: <span data-ev-id="ev_54810fe058" className="text-purple-300/60 font-medium">{scenes[fullScreenIdx].transition}</span>
                  </p>
                </div>
              </div>
          }

            {fullScreenIdx === null &&
          <div data-ev-id="ev_7dc0054e3b" className="text-center py-20">
                <Eye className="w-12 h-12 text-white/60 mx-auto mb-4" />
                <p data-ev-id="ev_26b2128881" className="text-white/60 text-sm">בחר סצנה מלמעלה לצפייה גדולה</p>
              </div>
          }
          </div>
        }

        {/* Info footer */}
        <div data-ev-id="ev_c47dff1e18" className="mt-16 pt-8 border-t border-white/[0.04]">
          <div data-ev-id="ev_b8e220e0e4" className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div data-ev-id="ev_a6f228b6ba">
              <p data-ev-id="ev_69e8302d2a" className="text-3xl font-bold text-cyan-400 mb-1">{scenes.length}</p>
              <p data-ev-id="ev_e12b33557b" className="text-white/60 text-sm">סצנות אנימציה</p>
            </div>
            <div data-ev-id="ev_e79ff0a63d">
              <p data-ev-id="ev_d35cfd6e93" className="text-3xl font-bold text-purple-400 mb-1">13</p>
              <p data-ev-id="ev_938de4599e" className="text-white/60 text-sm">סוגי מעברים</p>
            </div>
            <div data-ev-id="ev_75e49f6d4f">
              <p data-ev-id="ev_2e7dd98994" className="text-3xl font-bold text-amber-400 mb-1">10.4s</p>
              <p data-ev-id="ev_a571e8d444" className="text-white/60 text-sm">מחזור אחד</p>
            </div>
          </div>
        </div>
      </div>
    </div>);

};

/** Interactive card that plays an icon animation on hover/tap */
const IconAnimCard = ({ anim, icon, color, isNew }: {
  anim: typeof ALL_ICON_ANIMATIONS[0];
  icon: typeof Zap;
  color: string;
  isNew: boolean;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onClick={() => setHovered((h) => !h)}
      className={`relative flex flex-col items-center rounded-2xl border-2 transition-all duration-300 p-4 sm:p-5 cursor-pointer ${
        hovered
          ? 'border-purple-500/50 shadow-[0_0_30px_rgba(139,92,246,0.15)] bg-purple-500/[0.04] scale-105'
          : 'border-white/[0.05] hover:border-white/15 bg-white/[0.01]'
      }`}>
      {isNew && (
        <span className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
          חדש
        </span>
      )}
      <div
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-3 transition-all duration-300"
        style={{
          background: `${color}15`,
          border: `1px solid ${hovered ? `${color}50` : `${color}20`}`,
          boxShadow: hovered ? `0 0 25px ${color}30` : 'none',
        }}>
        <AnimatedIcon icon={icon} animation={anim.type} color={color} isHovered={hovered} size={28} />
      </div>
      <span className="text-white/90 font-bold text-sm mb-0.5">{anim.label}</span>
      <span className="text-white/60 text-xs mb-1">{anim.labelHe}</span>
      <p className="text-white/40 text-[10px] sm:text-[11px] leading-relaxed text-center">{anim.description}</p>
      <span className="mt-2 text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-white/50 border border-white/[0.04]">
        {anim.speed}
      </span>
    </button>
  );
};

export default AnimationPreview;