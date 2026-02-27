import React, { useEffect, useRef } from 'react';
import { views, rows } from './viewData';
import { ViewToggleButton } from './ViewToggleButton';

interface ViewToggleProps {
  activeView: number;
  onChange: (view: number) => void;
}

export const ViewToggle = ({ activeView, onChange }: ViewToggleProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll active view button into view on mobile
  useEffect(() => {
    const activeBtn = document.querySelector(`[data-view-id="${activeView}"]`) as HTMLElement;
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeView]);

  const handleKeyDown = (e: React.KeyboardEvent, currentId: number) => {
    const ids = views.map((v) => v.id);
    const idx = ids.indexOf(currentId);
    let nextIdx = idx;

    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIdx = idx > 0 ? idx - 1 : ids.length - 1;
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIdx = idx < ids.length - 1 ? idx + 1 : 0;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIdx = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIdx = ids.length - 1;
    } else {
      return;
    }

    onChange(ids[nextIdx]);
    // Focus the new button
    const btn = document.querySelector(`[data-view-id="${ids[nextIdx]}"]`) as HTMLElement;
    btn?.focus();
  };

  return (
    <div data-ev-id="ev_e98926df5a"
    role="radiogroup"
    aria-label="בחירת סגנון תצוגת הקישורים"
    className="flex flex-col items-center gap-2">

      {rows.map((row, rowIdx) =>
      <div data-ev-id="ev_e342da3c24"
      key={rowIdx}
      ref={rowIdx === 0 ? scrollContainerRef : undefined}
      className="flex items-center justify-start sm:justify-center gap-1 sm:gap-1.5 w-full overflow-x-auto pb-1 sm:pb-0 scrollbar-hide px-1 sm:px-0 scroll-smooth"
      style={{ WebkitOverflowScrolling: 'touch' }}>

          {row.map((v) => (
            <ViewToggleButton
              key={v.id}
              view={v}
              isActive={activeView === v.id}
              onClick={() => onChange(v.id)}
              onKeyDown={(e) => handleKeyDown(e, v.id)}
            />
          ))}
        </div>
      )}

      {/* Subtle label showing how many views */}
      <p data-ev-id="ev_49cd5c3450" className="text-white/30 text-[10px] mt-0.5" aria-hidden="true">
        {views.length} סגנונות תצוגה
      </p>
    </div>);

};
