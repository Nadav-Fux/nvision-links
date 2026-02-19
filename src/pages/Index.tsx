import { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { Logo } from '@/components/Logo';
import { LinkCard } from '@/components/LinkCard';
import { SectionDivider } from '@/components/SectionDivider';
import { ViewContainer } from '@/components/ViewContainer';
import { usePublicData } from '@/lib/usePublicData';
import { useTheme } from '@/lib/useTheme';
import { useAnalytics } from '@/lib/useAnalytics';
import {
  staticSections } from
'@/data/links';
import { Heart, ArrowUp, AlertTriangle, RefreshCw, Shield } from 'lucide-react';
import { PageMeta } from '@/components/PageMeta';
import { AffiliateDisclaimer } from '@/components/AffiliateDisclaimer';
import { CANVAS_VIEW_IDS } from '@/lib/viewRegistry';
import { Link, useNavigate } from 'react-router';

const AnimatedBackground = lazy(() =>
import('@/components/AnimatedBackground').then((m) => ({ default: m.AnimatedBackground }))
);

interface IndexProps {
  viewOverride?: number;
}

const Index = ({ viewOverride }: IndexProps = {}) => {
  const { config, sections: dbSections, loading: dbLoading, error: dbError, retry: retryFetch } = usePublicData();

  // Apply theme colors from DB config to CSS custom properties
  useTheme(config?.theme_colors);

  // Anonymous analytics — tracks page_view on mount, provides click/view trackers
  const { trackClick } = useAnalytics('/');

  const [localView, setLocalView] = useState(1);
  const [viewInitialized, setViewInitialized] = useState(false);
  const [sectionsVisible, setSectionsVisible] = useState(false);
  const [linksVisible, setLinksVisible] = useState(false);
  const [toolsVisible, setToolsVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const toolsRef = useRef<HTMLElement>(null);

  const navigate = useNavigate();

  // The active view: override (from admin preview) wins over local random pick
  const activeView = viewOverride ?? localView;

  // Set view from config once loaded — pick random from selected_views
  useEffect(() => {
    if (config && !viewInitialized && viewOverride === undefined) {
      const selectedViews = Array.isArray(config.selected_views) ? config.selected_views as number[] : [config.default_view];
      const validViews = selectedViews.length > 0 ? selectedViews : [config.default_view];
      const randomView = validViews[Math.floor(Math.random() * validViews.length)];
      setLocalView(randomView);
      setViewInitialized(true);
    }
  }, [config, viewInitialized, viewOverride]);

  // Use DB sections if available, otherwise fall back to static data
  const useDB = !dbLoading && dbSections.length > 0;

  // DB section IDs are UUIDs; static section IDs are slugs.
  // DB wins ONLY if it has meaningful content (multiple sections with links).
  // If DB is incomplete (e.g. only 1 section has links), fall back to static
  // so the user always sees all groups.
  const dbSectionsWithLinks = useDB ? dbSections.filter((s) => s.links.length > 0) : [];
  const dbHasContent = dbSectionsWithLinks.length >= staticSections.length;
  const gridSections = dbHasContent ? dbSections : staticSections;

  useEffect(() => {
    const t1 = setTimeout(() => setSectionsVisible(true), 500);
    const t2 = setTimeout(() => setLinksVisible(true), 800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Ensure tools section is always visible in Grid view (fallback for IntersectionObserver)
  useEffect(() => {
    if (activeView === 1) {
      const t = setTimeout(() => setToolsVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, [activeView]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setToolsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (toolsRef.current) observer.observe(toolsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track external link clicks via event delegation (covers all views)
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute('href') || '';
      // Only track external links (not internal nav)
      if (href.startsWith('http')) {
        const label = anchor.textContent?.trim().slice(0, 100) || href;
        trackClick(label);
      }
    };
    document.addEventListener('click', handleLinkClick, { passive: true });
    return () => document.removeEventListener('click', handleLinkClick);
  }, [trackClick]);

  const isView = (v: number) => activeView === v;

  /* —— Shared props for lazy views —— */
  const viewProps = {
    sections: gridSections,
    visible: sectionsVisible
  };

  /* Views that use their own Canvas — disable the background particles */

  return (
    <div data-ev-id="ev_44a3488622"
    dir="rtl"
    className="min-h-screen relative overflow-hidden"
    style={{
      background:
      'linear-gradient(160deg, #0a0a14 0%, #0d0d1a 30%, #0f0a1a 60%, #0a0f14 100%)'
    }}>

      {/* Dynamic SEO meta from DB config */}
      <PageMeta
        title={config?.site_title ? `${config.site_title} — קהילת בינה מלאכותית` : 'nVision Digital AI — קהילת בינה מלאכותית'}
        description={config?.site_description || 'קהילת nVision Digital AI — כלים, קבוצות ומשאבים בעולם הבינה המלאכותית'} />


      {/* Skip Navigation — WCAG 2.4.1 */}
      <a data-ev-id="ev_42268dd9f0"
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:text-sm focus:font-semibold focus:shadow-lg focus:outline-none">

        דלג לתוכן הראשי
      </a>

      <Suspense fallback={null}>
        <AnimatedBackground disabled={CANVAS_VIEW_IDS.has(activeView)} />
      </Suspense>

      {/* Ambient blurs */}
      <div data-ev-id="ev_307a526558" className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }} aria-hidden="true">
        <div data-ev-id="ev_4572bb9020" className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div data-ev-id="ev_926f8d6c8b" className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div data-ev-id="ev_c0ac3af43a" className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        {/* Logo — Header */}
        <header data-ev-id="ev_b1c8460e66" className="mb-8">
          <Logo />
        </header>

        {/* Main Content */}
        <main data-ev-id="ev_4072aa3002" id="main-content" tabIndex={-1} className="outline-none">
          {/* H1 — always rendered, visible to crawlers (WCAG + SEO) */}
          <h1 data-ev-id="ev_5cc6b54e07" id="intro-heading" className="sr-only">nVision Digital AI</h1>

          {/* Description */}
          <section data-ev-id="ev_feb9d81b7b"
          aria-labelledby="intro-heading"
          className={`mb-6 transition-[opacity,transform] duration-700 ${
          sectionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
          }>

            <div data-ev-id="ev_33367eb7a1" className="relative p-6">
              <p data-ev-id="ev_e462f925d4" className="text-white/80 text-lg sm:text-xl md:text-xl leading-relaxed">
                {config?.welcome_text || <>ברוכים הבאים לקהילה של{' '}
                <span data-ev-id="ev_1e2de029cf" className="font-bold bg-gradient-to-r from-[#06b6d4] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">nVision Digital AI</span>{' '}
                — תכנים מעניינים ורלוונטיים לכל מי שמתעניין ב
                <span data-ev-id="ev_02e7dac468" className="text-cyan-400">בינה מלאכותית</span>,{' '}
                <span data-ev-id="ev_3e83108a16" className="text-purple-400">Vibe Coding</span>,{' '}
                תכנות לאנשים שלא יודעים לתכנת, יצירת תמונות וסרטונים,
                דברים שלא תמצאו לרוב בשום מקום אחר, והכי חשוב —{' '}
                <span data-ev-id="ev_dd5bdb34b4" className="text-accent font-semibold">מעניין</span>.</>}
              </p>
              <p data-ev-id="ev_7446878869" className="text-white/55 text-base sm:text-lg md:text-lg leading-relaxed mt-3">
                {config?.welcome_subtext || 'כאן תמצאו את כל הקהילות, הכלים והמשאבים שיעזרו לכם להתקדם בעולם ה-AI — תכנים חדשים כל יום.'}
              </p>
              <div data-ev-id="ev_c78275f076" className="mt-4 flex items-center justify-center gap-2 text-white/35 text-sm" aria-hidden="true">
                <div data-ev-id="ev_b3fc800354" className="w-8 h-px bg-white/15" />
                <span data-ev-id="ev_dd389b1723">{config?.tagline || '✨ העתיד מתחיל עכשיו'}</span>
                <div data-ev-id="ev_64526c3d7c" className="w-8 h-px bg-white/15" />
              </div>
            </div>
          </section>

          {/* DB Error Banner */}
          {dbError &&
          <div data-ev-id="ev_6b8bd78379"
          role="alert"
          className={`mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/[0.06] border border-red-500/15 transition-[opacity,transform] duration-700 ${
          sectionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`
          }>

              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" aria-hidden="true" />
              <div data-ev-id="ev_5c4df210df" className="flex-1 min-w-0">
                <p data-ev-id="ev_255dc161de" className="text-white/70 text-sm">
                  לא הצלחנו לטעון נתונים מהשרת — מציגים נתונים מקומיים.
                </p>
              </div>
              <button data-ev-id="ev_343433510a"
            onClick={retryFetch}
            aria-label="נסה לטעון שוב את הנתונים מהשרת"
            className="flex items-center gap-1.5 px-4 py-2 min-h-[44px] rounded-lg text-red-400/70 hover:text-red-400 text-xs border border-red-400/15 hover:border-red-400/30 transition-colors flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400">

                <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                נסה שוב
              </button>
            </div>
          }

          {/* ===== VIEW 1: Grid (inline — always in main bundle) ===== */}
          <div data-ev-id="ev_e8773cdc73"
          className={`transition-[opacity,transform] duration-500 ${
          isView(1) ?
          'opacity-100 translate-y-0 pointer-events-auto' :
          'opacity-0 translate-y-8 pointer-events-none absolute inset-0'}`
          }>

            {isView(1) &&
            <>
                {gridSections.map((section, sIdx) =>
              <section data-ev-id="ev_93c4b1ab1f" key={section.id} className={sIdx > 0 ? 'mt-14' : 'mt-2'} ref={sIdx === 1 ? toolsRef : undefined}>
                    {/* Affiliate disclaimer between communities and first tools section */}
                    {sIdx === 1 && <AffiliateDisclaimer visible={sectionsVisible} customText={config?.affiliate_disclaimer_text} />}

                    <SectionDivider
                  title={section.title}
                  emoji={section.emoji}
                  visible={sIdx === 0 ? sectionsVisible : toolsVisible}
                  delay={sIdx === 0 ? 200 : 0} />

                    <div data-ev-id="ev_571534aeb8" className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div data-ev-id="ev_45047ebde7" className="flex flex-col gap-3">
                        {section.links.filter((_: unknown, i: number) => i % 2 === 0).map((link: Record<string, unknown>, i: number) =>
                    <LinkCard
                      key={link.id as string}
                      {...link}
                      delay={i * 100}
                      visible={sIdx === 0 ? linksVisible : toolsVisible} />

                    )}
                      </div>
                      <div data-ev-id="ev_7a8cdc7d66" className="flex flex-col gap-3">
                        {section.links.filter((_: unknown, i: number) => i % 2 === 1).map((link: Record<string, unknown>, i: number) =>
                    <LinkCard
                      key={link.id as string}
                      {...link}
                      delay={i * 100 + 50}
                      visible={sIdx === 0 ? linksVisible : toolsVisible} />

                    )}
                      </div>
                    </div>
                  </section>
              )}
              </>
            }
          </div>

          {/* ===== LAZY VIEWS 2–40 (from registry) ===== */}
          <ViewContainer activeView={activeView} sections={gridSections} visible={sectionsVisible} />
        </main>

        {/* Footer */}
        <footer data-ev-id="ev_3b692f6c3c"
        role="contentinfo"
        className={`mt-16 pb-24 sm:pb-8 text-center transition-[opacity,transform] duration-700 delay-1000 ${
        sectionsVisible ? 'opacity-100' : 'opacity-0'}`
        }>

          <nav data-ev-id="ev_6c74c5206e" aria-label="ניווט תחתון" className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2 mb-3">
            <Link data-ev-id="ev_0a57211656"
            to="/accessibility"
            className="text-white/50 hover:text-white/70 text-sm underline underline-offset-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded">

              הצהרת נגישות
            </Link>
            <span data-ev-id="ev_66dd3293d1" className="text-white/25" aria-hidden="true">|</span>
            <Link data-ev-id="ev_3fb27d2328"
            to="/privacy"
            className="text-white/50 hover:text-white/70 text-sm underline underline-offset-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded">

              מדיניות פרטיות
            </Link>
          </nav>
          <div data-ev-id="ev_9ba4d3ac95" className="flex items-center justify-center gap-2 text-white/40 text-sm">
            <span data-ev-id="ev_7802a2a27d" lang="en">{config?.site_title || 'nVision Digital AI'}</span>
            <span data-ev-id="ev_d773f1e564"
            onClick={() => navigate('/admin')}
            className="inline-flex cursor-default"
            role="presentation">

              <Heart className="w-[18px] h-[18px] text-red-400/50 animate-pulse" aria-hidden="true" />
            </span>
            <span data-ev-id="ev_aa062f464d">{new Date().getFullYear()}</span>
          </div>

          <p data-ev-id="ev_35387fc6f2" className="mt-3 text-white/30 text-xs flex items-center justify-center gap-1.5">
            <Shield className="w-3 h-3" aria-hidden="true" />
            <span data-ev-id="ev_72782caf72">אתר זה לא אוסף מידע אישי, לא משתמש בעוגיות ולא עוקב אחרי גולשים</span>
          </p>
        </footer>
      </div>

      {/* Scroll to top — LEFT side to avoid overlapping with accessibility toolbar on the right */}
      <button data-ev-id="ev_8f100ee33a"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="חזרה לראש העמוד"
      className={`fixed bottom-4 sm:bottom-6 left-4 sm:left-6 z-40 w-11 h-11 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-md flex items-center justify-center transition-[opacity,transform] duration-500 hover:bg-primary/30 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
      showScrollTop ?
      'opacity-100 translate-y-0' :
      'opacity-0 translate-y-4 pointer-events-none'}`
      }>

        <ArrowUp className="w-4 h-4 text-primary" aria-hidden="true" />
      </button>
    </div>);

};

export default Index;