import { useState } from 'react';
import { Link } from 'react-router';
import { Maximize2, X, Star, StarOff, Play, Eye } from 'lucide-react';
import {
  BootSequenceDemo,
  GlitchRevealDemo,
  CinematicWipeDemo,
  TerminalBootDemo,
  HolographicDemo,
  ShockwaveDemo,
  QuantumCollapseDemo,
  ElegantFadeDemo,
  MatrixRainDemo } from
'@/components/EntranceDemos';

type AnimId = 'boot' | 'glitch' | 'cinematic' | 'terminal' | 'holo' | 'shockwave' | 'quantum' | 'elegant' | 'matrix' | 'neural' | 'gravity';

interface AnimInfo {
  id: AnimId;
  name: string;
  nameHe: string;
  desc: string;
  vibe: string;
  tags: string[];
  component: React.FC;
  isNew?: boolean;
}

const ANIMS: AnimInfo[] = [
{
  id: 'boot',
  name: 'Boot Sequence',
  nameHe: 'רצף אתחול',
  desc: 'אנימציה טכנית עם זרימת נתונים בינאריים, ספירת אחוזים, טבעת טעינה ופיצוץ חלקיקים',
  vibe: 'טכני, מקצועי',
  tags: ['tech', 'loader', 'current'],
  component: BootSequenceDemo
},
{
  id: 'glitch',
  name: 'Glitch Reveal',
  nameHe: 'חשיפה גליטש',
  desc: 'גליטש אגרסיבי עם פסי הפרעה, פיקסלים מתפזרים, עיוות VHS והפרדת צבע RGB חזקה',
  vibe: 'סייברפאנק, אגרסיבי',
  tags: ['cyber', 'edgy'],
  component: GlitchRevealDemo
},
{
  id: 'cinematic',
  name: 'Cinematic Wipe',
  nameHe: 'ווייפ קולנועי',
  desc: 'פסי אור כפולים עם אבק זוהר, חלקיקי אבק צפים ולנס פלייר אנמורפי',
  vibe: 'קולנועי, פרימיום',
  tags: ['elegant', 'cinematic'],
  component: CinematicWipeDemo
},
{
  id: 'terminal',
  name: 'Terminal Boot',
  nameHe: 'אתחול טרמינל',
  desc: 'גשם מטריקס ברקע, שורות אבחנה עם פסי התקדמות ואפקט CRT משופר',
  vibe: 'האקר, נוסטלגי',
  tags: ['hacker', 'retro'],
  component: TerminalBootDemo
},
{
  id: 'holo',
  name: 'Holographic Projection',
  nameHe: 'הקרנה הולוגרפית',
  desc: 'חרוט הקרנה תלת-ממדי, רעידת הולוגרמה עם jitter ופסי רעש דיגיטלי',
  vibe: 'עתידני, סצ״יפי',
  tags: ['futuristic', 'sci-fi'],
  component: HolographicDemo
},
{
  id: 'shockwave',
  name: 'Shockwave',
  nameHe: 'גל הלם',
  desc: 'פיצוץ אנרגיה עם 4 גלי הלם וחלקיקי פסולת צבעוניים שנפוצים לכל הכיוונים',
  vibe: 'דינמי, אנרגטי',
  tags: ['dynamic', 'impactful'],
  component: ShockwaveDemo
},
{
  id: 'quantum',
  name: 'Quantum Collapse',
  nameHe: 'קריסת קוונטית',
  desc: '50 חלקיקים עם מסלולים, גלי הסתברות, הבזק כפול וטבעת אנרגיה לאחר הקריסה',
  vibe: 'מדעי, פרימיום',
  tags: ['science', 'premium'],
  component: QuantumCollapseDemo
},
{
  id: 'elegant',
  name: 'Elegant Fade',
  nameHe: 'דעיכה אלגנטית',
  desc: 'כדורי אור צפים, נשימה רדיאלית נושמת ואותיות שנכנסות ברכות',
  vibe: 'יוקרתי, מינימליסטי',
  tags: ['luxury', 'minimal'],
  component: ElegantFadeDemo
},
{
  id: 'matrix',
  name: 'Matrix Rain',
  nameHe: 'גשם מטריקס',
  desc: 'תווים יפניים נופלים כמו במטריקס, נמסים ומתוכם צומח הלוגו בזוהר ירוק',
  vibe: 'האקר, קולטי',
  tags: ['hacker', 'retro', 'cyber'],
  component: MatrixRainDemo,
  isNew: true
},
// NeuralIgnitionDemo and GravityWellDemo are planned but not yet implemented
];


type FilterTag = 'all' | 'tech' | 'cyber' | 'cinematic' | 'futuristic' | 'premium' | 'minimal' | 'new';

const FILTERS: {label: string;value: FilterTag;}[] = [
{ label: 'הכל', value: 'all' },
{ label: '✨ חדשים', value: 'new' },
{ label: 'טכני', value: 'tech' },
{ label: 'סייבר', value: 'cyber' },
{ label: 'קולנועי', value: 'cinematic' },
{ label: 'עתידני', value: 'futuristic' },
{ label: 'פרימיום', value: 'premium' },
{ label: 'מינימלי', value: 'minimal' }];


const TAG_MAP: Record<string, string[]> = {
  tech: ['tech', 'loader'],
  cyber: ['cyber', 'edgy', 'hacker'],
  cinematic: ['cinematic', 'elegant'],
  futuristic: ['futuristic', 'sci-fi'],
  premium: ['premium', 'science'],
  minimal: ['luxury', 'minimal']
};

/** Route: /entrance-preview — dev-only gallery of full-screen site entrance animations. */
const EntrancePreview = () => {
  const [filter, setFilter] = useState<FilterTag>('all');
  const [fullscreen, setFullscreen] = useState<AnimId | null>(null);
  const [favorites, setFavorites] = useState<Set<AnimId>>(new Set());

  const toggleFav = (id: AnimId) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);else
      next.add(id);
      return next;
    });
  };

  const filtered =
  filter === 'all' ?
  ANIMS :
  filter === 'new' ?
  ANIMS.filter((a) => a.isNew) :
  ANIMS.filter((a) => a.tags.some((t) => TAG_MAP[filter]?.includes(t)));

  const fullAnim = ANIMS.find((a) => a.id === fullscreen);

  return (
    <div data-ev-id="ev_be8199bbb4" dir="rtl" className="min-h-screen bg-gradient-to-b from-[#07080f] via-[#0a0b14] to-[#0d0a16] text-white">
      {/* Header */}
      <div data-ev-id="ev_7e25f603bd" className="sticky top-0 z-30 bg-[#07080f]/90 backdrop-blur-xl border-b border-white/5">
        <div data-ev-id="ev_c8cef99c96" className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div data-ev-id="ev_8a2627e2cb">
            <div data-ev-id="ev_4aed28056e" className="flex items-center gap-3">
              <div data-ev-id="ev_d7fa29fb3a" className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/15 to-purple-500/15 border border-white/5 flex items-center justify-center">
                <Play className="w-4 h-4 text-cyan-400" />
              </div>
              <div data-ev-id="ev_854b6c4104">
                <h1 data-ev-id="ev_9561a20ea4" className="text-lg font-bold">אנימציות כניסה (Splash)</h1>
                <p data-ev-id="ev_d443de577c" className="text-xs text-white/60">{ANIMS.length} ווריאציות · לחץ על ★ לסימון</p>
              </div>
            </div>
          </div>
          <div data-ev-id="ev_3b05a20a5c" className="flex items-center gap-2">
            <Link to="/" className="px-2.5 py-1 text-[11px] text-white/60 hover:text-white/70 border border-white/5 rounded-md hover:border-white/15 transition-colors">🏠 בית</Link>
            <Link to="/font-preview" className="px-2.5 py-1 text-[11px] text-cyan-400/60 hover:text-cyan-300 border border-cyan-500/10 hover:border-cyan-500/25 rounded-md transition-colors">🎨 טיפוגרפיה</Link>
            <Link to="/animation-preview" className="px-2.5 py-1 text-[11px] text-purple-400/60 hover:text-purple-300 border border-purple-500/10 hover:border-purple-500/25 rounded-md transition-colors">🎬 אנימציות לוגו</Link>
          </div>
        </div>

        {/* Filters */}
        <div data-ev-id="ev_c4fb967def" className="max-w-7xl mx-auto px-4 sm:px-6 pb-3 flex flex-wrap gap-2">
          {FILTERS.map((f) =>
          <button data-ev-id="ev_413a50b835"
          key={f.value}
          onClick={() => setFilter(f.value)}
          className={`px-3 py-1 text-xs rounded-full border transition-all ${
          filter === f.value ?
          f.value === 'new' ?
          'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' :
          'bg-cyan-500/15 border-cyan-500/30 text-cyan-300' :
          'border-white/5 text-white/60 hover:text-white/60 hover:border-white/15'}`
          }>

              {f.label}
            </button>
          )}
          {favorites.size > 0 &&
          <button data-ev-id="ev_29f9eb758a"
          onClick={() => setFilter('all')}
          className="px-3 py-1 text-xs rounded-full border border-amber-500/20 text-amber-400/60 hover:text-amber-400 transition-colors flex items-center gap-1">

              <Star className="w-3 h-3 fill-current" />
              {favorites.size} סומנו
            </button>
          }
        </div>
      </div>

      {/* Grid */}
      <div data-ev-id="ev_2c49ff421a" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div data-ev-id="ev_13a48514b3" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((anim) => {
            const Comp = anim.component;
            const isFav = favorites.has(anim.id);
            return (
              <div data-ev-id="ev_2343c1bd3c" key={anim.id} className="group relative">
                <div data-ev-id="ev_5da358e207" className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isFav ?
                'border-amber-500/20 bg-amber-500/[0.02]' :
                'border-white/5 hover:border-white/10 bg-white/[0.01]'}`
                }>
                  {/* Preview */}
                  <div data-ev-id="ev_6589aa0125" className="relative">
                    <Comp />
                    {/* Actions overlay */}
                    <div data-ev-id="ev_8dd61ea1f5" className="absolute top-3 right-3 z-20 flex gap-1.5">
                      <button data-ev-id="ev_20cf28b6a2"
                      onClick={() => toggleFav(anim.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isFav ?
                      'bg-amber-500/20 border border-amber-500/30 text-amber-400' :
                      'bg-white/5 border border-white/10 text-white/60 hover:text-amber-400 hover:border-amber-500/20'}`
                      }>

                        {isFav ? <Star className="w-3.5 h-3.5 fill-current" /> : <StarOff className="w-3.5 h-3.5" />}
                      </button>
                      <button data-ev-id="ev_82b69f63cc"
                      onClick={() => setFullscreen(anim.id)}
                      className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white/70 hover:border-white/20 transition-all">

                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {/* Tags */}
                    {anim.tags.includes('current') &&
                    <div data-ev-id="ev_1bb381da8f" className="absolute top-3 left-14 z-20 px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-500/15 border border-cyan-500/20 text-cyan-400">נוכחי</div>
                    }
                    {anim.isNew &&
                    <div data-ev-id="ev_6a01518324" className="absolute top-3 left-14 z-20 px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/15 border border-emerald-500/20 text-emerald-400">✨ חדש!</div>
                    }
                  </div>

                  {/* Info */}
                  <div data-ev-id="ev_952783219e" className="p-4 space-y-2">
                    <div data-ev-id="ev_57717b3fa7" className="flex items-center justify-between">
                      <h3 data-ev-id="ev_38e163d7fa" className="font-bold text-white/90">{anim.nameHe}</h3>
                      <span data-ev-id="ev_40290bcf77" className="text-[10px] text-white/60 font-mono">{anim.name}</span>
                    </div>
                    <p data-ev-id="ev_4a54b90fc6" className="text-xs text-white/60 leading-relaxed">{anim.desc}</p>
                    <div data-ev-id="ev_796515e286" className="flex items-center gap-2">
                      <span data-ev-id="ev_32b4a86390" className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/60">{anim.vibe}</span>
                    </div>
                  </div>
                </div>
              </div>);

          })}
        </div>

        {filtered.length === 0 &&
        <div data-ev-id="ev_66524f0d29" className="text-center py-20">
            <Eye className="w-8 h-8 text-white/60 mx-auto mb-3" />
            <p data-ev-id="ev_0dc4a467e3" className="text-sm text-white/60">אין אנימציות מתאימות לפילטר הזה</p>
          </div>
        }
      </div>

      {/* Fullscreen modal */}
      {fullAnim && (() => {
        const FullComp = fullAnim.component;
        return (
          <div data-ev-id="ev_0975a5837d" className="fixed inset-0 z-50 bg-black/95 flex flex-col">
            <div data-ev-id="ev_6b8c1a312e" className="flex items-center justify-between p-4">
              <div data-ev-id="ev_6039c06067">
                <h2 data-ev-id="ev_bbddb3c748" className="text-lg font-bold">
                  {fullAnim.nameHe}
                  {fullAnim.isNew && <span data-ev-id="ev_2431f0f4e8" className="text-emerald-400 text-xs mr-2">✨ חדש</span>}
                </h2>
                <p data-ev-id="ev_7c4c5afd14" className="text-xs text-white/60">{fullAnim.name} · {fullAnim.vibe}</p>
              </div>
              <button data-ev-id="ev_042a0746a9"
              onClick={() => setFullscreen(null)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white/80 transition-colors">

                <X className="w-5 h-5" />
              </button>
            </div>
            <div data-ev-id="ev_180158bbb8" className="flex-1 flex items-center justify-center p-4 sm:p-8">
              <div data-ev-id="ev_1cc125d7f3" className="w-full max-w-4xl">
                <FullComp />
              </div>
            </div>
          </div>);

      })()}
    </div>);

};

export default EntrancePreview;