import { useEffect, useState, lazy, Suspense } from 'react';

const TextLogoMorph = lazy(() =>
import('@/components/TextLogoMorph').then((m) => ({ default: m.TextLogoMorph }))
);
const Spotlights = lazy(() =>
import('@/components/Spotlights').then((m) => ({ default: m.Spotlights }))
);

/* Minimal placeholder shown while heavy logo chunks download */
const LogoFallback = () =>
<div data-ev-id="ev_7fe3ad08ac" className="flex items-center justify-center py-8" aria-hidden="true">
    <span data-ev-id="ev_8a0caff6be" className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-pulse">
      nVision Digital AI
    </span>
  </div>;


export const Logo = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div data-ev-id="ev_f3b7db82c8"
    className={`flex flex-col items-center gap-4 transition-[opacity,transform] duration-1000 ${
    loaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`
    }>


      {/* Text ↔ Animation morphing logo with spotlights */}
      <div data-ev-id="ev_8163535270" className="relative w-full" aria-label="nVision Digital AI לוגו מונפש">
        <Suspense fallback={<LogoFallback />}>
          <Spotlights />
          <TextLogoMorph />
        </Suspense>
      </div>

      {/* Decorative divider */}
      <div data-ev-id="ev_fb2ec56673" className="flex items-center justify-center gap-3 mt-1" aria-hidden="true">
        <div data-ev-id="ev_0994333595" className="h-px w-16 bg-gradient-to-r from-transparent to-primary/50" />
        <div data-ev-id="ev_96f3f231eb" className="relative flex items-center gap-1">
          <div data-ev-id="ev_d441b64585" className="w-1 h-1 rounded-full bg-primary/60" />
          <div data-ev-id="ev_23cf88f035" className="w-1.5 h-1.5 rounded-full bg-accent/60" />
          <div data-ev-id="ev_3459f75322" className="w-1 h-1 rounded-full bg-secondary/60" />
        </div>
        <div data-ev-id="ev_8b1e258cbb" className="h-px w-16 bg-gradient-to-l from-transparent to-accent/50" />
      </div>
    </div>);

};