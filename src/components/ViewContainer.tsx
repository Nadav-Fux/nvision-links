import { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { VIEW_REGISTRY } from '@/lib/viewRegistry';
import type { LinkSection } from '@/data/links';
import type { SectionWithLinks } from '@/lib/usePublicData';

interface ViewContainerProps {
  activeView: number;
  sections: (LinkSection | SectionWithLinks)[];
  visible: boolean;
}

/**
 * Renders the active lazy-loaded view (views 2–40).
 * Each view is wrapped in ErrorBoundary + Suspense.
 * Only the active view's component is mounted.
 */
export const ViewContainer = ({ activeView, sections, visible }: ViewContainerProps) =>
<Suspense fallback={<LoadingSpinner text="טוען תצוגה…" />}>
    {VIEW_REGISTRY.map((entry) => {
    const isActive = activeView === entry.id;
    const Component = entry.component;
    return (
      <div data-ev-id="ev_f2e8547f81"
      key={entry.id}
      className={`transition-[opacity,transform] duration-500 ${
      isActive ?
      'opacity-100 translate-y-0 pointer-events-auto' :
      `opacity-0 ${entry.exitClass} pointer-events-none absolute inset-0`}`
      }>

          {isActive &&
        <ErrorBoundary inline>
              <Component sections={sections} visible={visible} />
            </ErrorBoundary>
        }
        </div>);

  })}
  </Suspense>;