import React from 'react';
import { ViewDef } from './viewData';

interface ViewToggleButtonProps {
  view: ViewDef;
  isActive: boolean;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const ViewToggleButton = ({ view, isActive, onClick, onKeyDown }: ViewToggleButtonProps) => (
  <button data-ev-id="ev_63f59d19df"
    key={view.id}
    data-view-id={view.id}
    role="radio"
    aria-checked={isActive}
    aria-label={`תצוגת ${view.label}`}
    tabIndex={isActive ? 0 : -1}
    onClick={onClick}
    onKeyDown={onKeyDown}
    className={`
          relative flex items-center justify-center gap-1.5 sm:gap-1.5
          rounded-lg sm:rounded-xl
          transition-[color,background-color,transform,box-shadow] duration-300
          cursor-pointer select-none flex-shrink-0
          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
          ${isActive ?
        'text-white shadow-lg scale-105' :
        'text-white/60 hover:text-white/80 hover:bg-white/[0.06]'}
          px-3 py-2 sm:px-3.5 sm:py-2
          min-h-[40px] sm:min-h-[42px]
          text-xs sm:text-sm font-medium
        `
    }>

        {/* Active background gradient */}
        {isActive &&
      <div data-ev-id="ev_2ebd29a63f"
      className={`absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r ${view.gradient} opacity-85`}
      aria-hidden="true" />

      }

        {/* Subtle border for inactive */}
        {!isActive &&
      <div data-ev-id="ev_0bc040931a" className="absolute inset-0 rounded-lg sm:rounded-xl border border-white/[0.08]" aria-hidden="true" />
      }

        {/* Content */}
        <span data-ev-id="ev_30982cdf31" className="relative z-10 flex items-center gap-1.5 sm:gap-1.5">
          <span data-ev-id="ev_724362a487" className="flex-shrink-0" aria-hidden="true">{view.icon}</span>
          <span data-ev-id="ev_575346d926" className="hidden min-[375px]:inline">{view.label}</span>
        </span>
      </button>
);
