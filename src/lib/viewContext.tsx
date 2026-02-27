import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

/** Shared state for the active view ID and the view-picker panel visibility. */
interface ViewContextValue {
  activeView: number;
  setActiveView: (view: number) => void;
  showViewPicker: boolean;
  setShowViewPicker: (show: boolean | ((prev: boolean) => boolean)) => void;
}

const ViewContext = createContext<ViewContextValue | null>(null);

/**
 * Provides the active view and view-picker visibility to the subtree.
 * Wrap around the top-level page component so all views share the same state.
 */
export function ViewProvider({ children }: { children: ReactNode }) {
  const [activeView, setActiveViewRaw] = useState(1);
  const [showViewPicker, setShowViewPicker] = useState(false);

  const setActiveView = useCallback((view: number) => {
    setActiveViewRaw(view);
  }, []);

  return (
    <ViewContext.Provider value={{ activeView, setActiveView, showViewPicker, setShowViewPicker }}>
      {children}
    </ViewContext.Provider>
  );
}

/**
 * Returns the view context. Must be used inside ViewProvider.
 * Throws a helpful error if called outside the context tree.
 */
export function useViewContext() {
  const ctx = useContext(ViewContext);
  if (!ctx) throw new Error('useViewContext must be used within ViewProvider');
  return ctx;
}
