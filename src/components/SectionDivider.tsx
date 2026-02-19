import type { ReactNode } from 'react';

interface SectionDividerProps {
  title: string;
  emoji: ReactNode;
  visible: boolean;
  delay: number;
  /** Optional action element rendered inside the divider pill (e.g. view toggle button) */
  action?: ReactNode;
}

export const SectionDivider = ({ title, emoji, visible, delay, action }: SectionDividerProps) =>
<div data-ev-id="ev_308de16fa5"
className={`flex items-center gap-4 mb-6 transition-[opacity,transform] duration-700 ${
visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`
}
style={{ transitionDelay: `${delay}ms` }}>

    <div data-ev-id="ev_c6384e4f85" className="flex-1 h-px bg-gradient-to-l from-primary/20 to-transparent" aria-hidden="true" />
    <div data-ev-id="ev_3007501ba0" className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.06]">
      <span data-ev-id="ev_ae00002c8b" aria-hidden="true" className="text-xl flex items-center">{emoji}</span>
      <h2 data-ev-id="ev_8dcbb96a3d" className="text-white/80 text-base sm:text-lg font-semibold tracking-wide">
        {title}
      </h2>
      {action &&
    <>
          <div data-ev-id="ev_c1e00dc7c4" className="w-px h-5 bg-white/10 mx-1" aria-hidden="true" />
          {action}
        </>
    }
    </div>
    <div data-ev-id="ev_4082e5e8bb" className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent" aria-hidden="true" />
  </div>;