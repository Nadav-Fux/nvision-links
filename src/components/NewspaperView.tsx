import { useState, useEffect } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';
import { ExternalLink } from 'lucide-react';

interface NewspaperViewProps {
  sections: LinkSection[];
  visible: boolean;
}

const fakeDate = () => {
  const d = new Date();
  const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
  const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  return `יום ${days[d.getDay()]}, ${d.getDate()} ב${months[d.getMonth()]} ${d.getFullYear()}`;
};

const fakeAuthor = (id: string) => {
  const names = ['דניאל כהן', 'מיכל לוי', 'אורי שמש', 'נועה ברק', 'עידו גולן', 'רונית אביב', 'יואב מזרחי', 'שירה דגן'];
  const h = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return names[h % names.length];
};

const fakeReadTime = (id: string) => {
  const h = id.charCodeAt(0);
  return 2 + h % 8 + ' דק\' קריאה';
};

const editionNum = () => {
  const d = new Date();
  return Math.floor(d.getTime() / 86400000 - 19000);
};

/* ══════════════════════════════════════════
 *  Newspaper View — Old-school broadsheet
 * ══════════════════════════════════════════ */
export const NewspaperView = ({ sections, visible }: NewspaperViewProps) => {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setRevealed(true), 250);
      return () => clearTimeout(t);
    }
  }, [visible]);

  const headline = sections[0]?.links[0];
  const subHeadlines = sections[0]?.links.slice(1, 3) || [];

  return (
    <div data-ev-id="ev_cf2c0a8b27"
    className={`transition-[opacity,transform] duration-700 ${
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
    }>

      <div data-ev-id="ev_9efb7df414"
      className="mx-auto max-w-4xl rounded-xl overflow-hidden border"
      style={{
        background: '#faf5e8',
        borderColor: '#d4c9a8',
        boxShadow: '0 20px 50px rgba(0,0,0,0.15), inset 0 0 80px rgba(180,160,120,0.08)',
        color: '#2c2416'
      }}>

        {/* ─── Masthead ─── */}
        <div data-ev-id="ev_b073012aed" className="text-center border-b-2 px-4 pt-4 pb-3" style={{ borderColor: '#2c2416' }}>
          <div data-ev-id="ev_3d76df0877" className="flex items-center justify-between text-[10px] mb-1" style={{ color: '#8a7a5a', fontFamily: 'serif' }}>
            <span data-ev-id="ev_ee47546aae">מהדורה מס\' {editionNum()}</span>
            <span data-ev-id="ev_551a0c6bd9">{fakeDate()}</span>
            <span data-ev-id="ev_6926d8dfec">מחיר: חינם</span>
          </div>
          {/* Decorative line */}
          <div data-ev-id="ev_e2b2505c27" className="flex items-center gap-2 mb-1">
            <div data-ev-id="ev_db6a09207f" className="flex-1 h-px" style={{ background: '#2c2416' }} />
            <div data-ev-id="ev_ad570b7d6b" className="w-1.5 h-1.5 rotate-45" style={{ background: '#2c2416' }} />
            <div data-ev-id="ev_6e86672264" className="flex-1 h-px" style={{ background: '#2c2416' }} />
          </div>
          <h1 data-ev-id="ev_0da9768b29"
          className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>

            nVision Daily
          </h1>
          <div data-ev-id="ev_eed132a8ae" className="flex items-center gap-2 mt-1">
            <div data-ev-id="ev_6eae5d6a5f" className="flex-1 h-px" style={{ background: '#2c2416' }} />
            <span data-ev-id="ev_df601dc966" className="text-[10px] tracking-[0.3em] uppercase" style={{ color: '#8a7a5a', fontFamily: 'serif' }}>
              עיתון הבינה המלאכותית המוביל
            </span>
            <div data-ev-id="ev_9ffc9543a3" className="flex-1 h-px" style={{ background: '#2c2416' }} />
          </div>
          {/* Double rule */}
          <div data-ev-id="ev_97f9e114f9" className="mt-2 flex flex-col gap-[2px]">
            <div data-ev-id="ev_be159c613c" className="h-[2px]" style={{ background: '#2c2416' }} />
            <div data-ev-id="ev_73af74642b" className="h-px" style={{ background: '#2c2416', opacity: 0.4 }} />
          </div>
        </div>

        {/* ─── Lead story + sub-headlines ─── */}
        {headline &&
        <div data-ev-id="ev_5ae2e6278e" className="border-b" style={{ borderColor: '#c9bc9e' }}>
            {/* Main headline */}
            <a data-ev-id="ev_07fbd7263b"
          href={headline.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${headline.title} (נפתח בחלון חדש)`}
          className="block px-5 pt-4 pb-3 group hover:bg-[#f0ead4] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

              <div data-ev-id="ev_f9114e31b2" className="flex items-center gap-2 mb-1">
                <span data-ev-id="ev_5e590dda6e" className="text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded" style={{ background: '#2c2416', color: '#faf5e8' }}>
                  חדשות ראשיות
                </span>
              </div>
              <h2 data-ev-id="ev_febb8ea8a5"
            className="text-2xl sm:text-3xl font-black leading-tight mb-2 group-hover:underline decoration-2 underline-offset-2"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#1a1008' }}>

                {headline.title}
              </h2>
              <p data-ev-id="ev_6c5a3fa229" className="text-sm leading-relaxed mb-2" style={{ color: '#5a4d35', fontFamily: 'Georgia, serif' }}>
                {headline.description || headline.subtitle}
              </p>
              <div data-ev-id="ev_754991f7ba" className="flex items-center gap-3 text-[10px]" style={{ color: '#8a7a5a' }}>
                <span data-ev-id="ev_b246f664b9" style={{ fontFamily: 'serif' }}>מאת {fakeAuthor(headline.id)}</span>
                <span data-ev-id="ev_59449aca60">•</span>
                <span data-ev-id="ev_25ca764cff">{fakeReadTime(headline.id)}</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity mr-auto" />
              </div>
            </a>

            {/* Sub-headlines row */}
            {subHeadlines.length > 0 &&
          <div data-ev-id="ev_804b0171ac" className="grid grid-cols-1 sm:grid-cols-2 border-t" style={{ borderColor: '#c9bc9e' }}>
                {subHeadlines.map((link, i) =>
            <a data-ev-id="ev_8e1726fd65"
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${link.title} (נפתח בחלון חדש)`}
            className={`block px-5 py-3 group hover:bg-[#f0ead4] transition-colors ${
            i === 0 && subHeadlines.length > 1 ? 'sm:border-l' : ''}`
            }
            style={{ borderColor: '#c9bc9e' }}>

                    <div data-ev-id="ev_50c306d8f4" className="flex items-start gap-2">
                      <AnimatedIcon icon={link.icon} animation={link.animation} color="#6b5a3e" size={16} />
                      <div data-ev-id="ev_f4188d77fa">
                        <h3 data-ev-id="ev_b1366100e4"
                  className="text-sm font-bold leading-snug group-hover:underline"
                  style={{ fontFamily: 'Georgia, serif', color: '#1a1008' }}>

                          {link.title}
                        </h3>
                        <p data-ev-id="ev_8d20215862" className="text-[11px] mt-0.5 line-clamp-2" style={{ color: '#6b5a3e', fontFamily: 'Georgia, serif' }}>
                          {link.subtitle}
                        </p>
                        <span data-ev-id="ev_62c35ea0c9" className="text-[9px] mt-1 inline-block" style={{ color: '#a0906a' }}>
                          {fakeAuthor(link.id)}
                        </span>
                      </div>
                    </div>
                  </a>
            )}
              </div>
          }
          </div>
        }

        {/* ─── Section columns ─── */}
        <div data-ev-id="ev_0588f00745" className="px-4 py-4 space-y-0">
          {sections.map((section, sIdx) => {
            const linksToShow = sIdx === 0 ? section.links.slice(3) : section.links;
            if (linksToShow.length === 0) return null;

            return (
              <div data-ev-id="ev_1ad964a48d" key={section.id} className={sIdx > 0 ? 'mt-1' : ''}>
                {/* Section divider */}
                <div data-ev-id="ev_c84f3f423e" className="flex items-center gap-2 mb-3 mt-3">
                  <div data-ev-id="ev_33286c47fd" className="flex-1 flex flex-col gap-[2px]">
                    <div data-ev-id="ev_105ff67572" className="h-[1.5px]" style={{ background: '#2c2416' }} />
                    <div data-ev-id="ev_d0032acef7" className="h-px" style={{ background: '#2c2416', opacity: 0.3 }} />
                  </div>
                  <span data-ev-id="ev_2c159131ab"
                  className="text-sm font-black tracking-wide px-3 flex items-center gap-1.5"
                  style={{ fontFamily: 'Georgia, serif', color: '#2c2416' }}>

                    {section.emoji} {section.title}
                  </span>
                  <div data-ev-id="ev_43c0f70435" className="flex-1 flex flex-col gap-[2px]">
                    <div data-ev-id="ev_2d00a9fab3" className="h-[1.5px]" style={{ background: '#2c2416' }} />
                    <div data-ev-id="ev_be955e53e0" className="h-px" style={{ background: '#2c2416', opacity: 0.3 }} />
                  </div>
                </div>

                {/* Articles in columns */}
                <div data-ev-id="ev_be46c4336d"
                className="sm:columns-2 gap-5"
                style={{ columnRule: '1px solid #c9bc9e' }}>

                  {linksToShow.map((link, lIdx) =>
                  <a data-ev-id="ev_b0c9b25f74"
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mb-4 break-inside-avoid group hover:bg-[#f0ead4] rounded px-2 py-1.5 -mx-2 transition-colors">

                      {/* First article in section gets bigger treatment */}
                      {lIdx === 0 ?
                    <>
                          <h3 data-ev-id="ev_198b69d783"
                      className="text-lg font-bold leading-snug mb-1 group-hover:underline decoration-1 underline-offset-2"
                      style={{ fontFamily: 'Georgia, serif', color: '#1a1008' }}>

                            {link.title}
                          </h3>
                          <p data-ev-id="ev_68062d3ceb" className="text-[12px] leading-relaxed mb-1.5" style={{ color: '#5a4d35', fontFamily: 'Georgia, serif' }}>
                            {link.description || link.subtitle}
                          </p>
                        </> :

                    <>
                          <div data-ev-id="ev_77db44d2f4" className="flex items-start gap-2">
                            <AnimatedIcon icon={link.icon} animation={link.animation} color="#6b5a3e" size={14} />
                            <div data-ev-id="ev_55c638a179" className="flex-1 min-w-0">
                              <h4 data-ev-id="ev_f56118a895"
                          className="text-[13px] font-bold leading-snug group-hover:underline"
                          style={{ fontFamily: 'Georgia, serif', color: '#2c2416' }}>

                                {link.title}
                              </h4>
                              <p data-ev-id="ev_029a24c64c" className="text-[11px] mt-0.5 line-clamp-2" style={{ color: '#6b5a3e', fontFamily: 'Georgia, serif' }}>
                                {link.subtitle}
                              </p>
                            </div>
                          </div>
                        </>
                    }
                      <div data-ev-id="ev_f70a722e66" className="flex items-center gap-2 mt-1 text-[9px]" style={{ color: '#a0906a' }}>
                        <span data-ev-id="ev_10055e041f" style={{ fontFamily: 'serif' }}>{fakeAuthor(link.id)}</span>
                        <span data-ev-id="ev_2e982b7c1e">•</span>
                        <span data-ev-id="ev_86c4716efb">{fakeReadTime(link.id)}</span>
                        {link.tag &&
                      <>
                            <span data-ev-id="ev_6e1ac55774">•</span>
                            <span data-ev-id="ev_2e24edfb8c"
                        className="px-1 py-0.5 rounded text-[8px] font-bold"
                        style={{ background: '#2c241610', color: '#6b5a3e' }}>

                              {link.tag === 'free' ? 'חינם' : link.tag === 'freemium' ? 'Freemium' : 'מבצע'}
                            </span>
                          </>
                      }
                      </div>
                    </a>
                  )}
                </div>
              </div>);

          })}
        </div>

        {/* ─── Footer ─── */}
        <div data-ev-id="ev_a35ea65c03" className="border-t-2 px-4 py-2 flex items-center justify-between text-[9px]" style={{ borderColor: '#2c2416', color: '#a0906a', fontFamily: 'Georgia, serif' }}>
          <span data-ev-id="ev_9ce472e1ba">© {new Date().getFullYear()} nVision Daily</span>
          <span data-ev-id="ev_97bb3c595d">כל הזכויות שמורות — שימוש הוגן בלבד</span>
          <span data-ev-id="ev_1b9c169fa3">עמוד 1 מתוך 1</span>
        </div>
      </div>
    </div>);

};

export default NewspaperView;