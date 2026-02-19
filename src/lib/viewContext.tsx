import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface ViewContextValue {
  activeView: number;
  setActiveView: (view: number) => void;
  showViewPicker: boolean;
  setShowViewPicker: (show: boolean | ((prev: boolean) => boolean)) => void;
}

const ViewContext = createContext<ViewContextValue | null>(null);

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

export function useViewContext() {
  const ctx = useContext(ViewContext);
  if (!ctx) throw new Error('useViewContext must be used within ViewProvider');
  return ctx;
}
