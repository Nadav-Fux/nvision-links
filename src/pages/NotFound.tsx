import { Link } from 'react-router';
import { Home, ArrowRight } from 'lucide-react';
import { PageMeta } from '@/components/PageMeta';

const NotFound = () => {
  return (
    <div data-ev-id="ev_b2b765ecff"
    dir="rtl"
    className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
    style={{
      background: 'linear-gradient(160deg, #0a0a14 0%, #0d0d1a 30%, #0f0a1a 60%, #0a0f14 100%)'
    }}>

      <PageMeta title="404 — הדף לא נמצא | nVision Digital AI" description="הדף שחיפשת לא קיים." />

      {/* Skip Navigation */}
      <a data-ev-id="ev_notfound_skip"
      href="#notfound-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:text-sm focus:font-semibold focus:shadow-lg focus:outline-none">
        דלג לתוכן הראשי
      </a>

      {/* Ambient glow */}
      <div data-ev-id="ev_42b91fa467" className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div data-ev-id="ev_b81701ad2a"
        className="absolute rounded-full"
        style={{
          width: 300,
          height: 300,
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)',
          filter: 'blur(60px)'
        }} />

      </div>

      <main data-ev-id="ev_920cdc31c3" id="notfound-content" tabIndex={-1} className="relative z-10 flex flex-col items-center gap-6 max-w-md outline-none">
        {/* 404 number */}
        <div data-ev-id="ev_e32d7d5f71" className="relative" aria-hidden="true">
          <span data-ev-id="ev_a8eabc0ace"
          className="text-8xl sm:text-9xl font-black tracking-tighter"
          style={{
            background: 'linear-gradient(135deg, #06b6d4 0%, #a855f7 50%, #06b6d4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            opacity: 0.15
          }}>

            404
          </span>
          <span data-ev-id="ev_d3b11ee63b"
          className="absolute inset-0 flex items-center justify-center text-8xl sm:text-9xl font-black tracking-tighter"
          style={{
            background: 'linear-gradient(135deg, #06b6d4, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>

            404
          </span>
        </div>

        <div data-ev-id="ev_bfa861808a" className="space-y-2">
          <h1 data-ev-id="ev_173afb4379" className="text-white/90 text-2xl sm:text-3xl font-bold">הדף לא נמצא</h1>
          <p data-ev-id="ev_a2118ac7e4" className="text-white/40 text-base sm:text-lg leading-relaxed">
            נראה שהגעת לכתובת שלא קיימת. אולי הקישור השתנה, או שיש שגיאת הקלדה.
          </p>
        </div>

        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary font-medium hover:bg-primary/20 hover:border-primary/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-transparent">

          <Home className="w-4 h-4" aria-hidden="true" />
          חזרה לדף הבית
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>

        <p data-ev-id="ev_1c40eac95c" className="text-white/30 text-xs mt-4" lang="en">nVision Digital AI</p>
      </main>
    </div>);

};

export default NotFound;