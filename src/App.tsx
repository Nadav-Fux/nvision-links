import { Routes, Route, useLocation } from 'react-router';
import { lazy, Suspense, useState, useCallback } from 'react';
import Index from '@/pages/Index';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { SplashScreen } from '@/components/SplashScreen';

const Accessibility = lazy(() => import('@/pages/Accessibility'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Admin = lazy(() => import('@/pages/Admin'));
const AdminPreview = lazy(() => import('@/pages/AdminPreview'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const FontPreview = lazy(() => import('@/pages/FontPreview'));
const AnimationPreview = lazy(() => import('@/pages/AnimationPreview'));
const EntrancePreview = lazy(() => import('@/pages/EntrancePreview'));
const AccessibilityToolbar = lazy(() => import('@/components/AccessibilityToolbar'));

function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [splashDone, setSplashDone] = useState(false);

  const handleSplashComplete = useCallback(() => {
    setSplashDone(true);
  }, []);

  return (
    <ErrorBoundary>
      {/* Splash only on homepage */}
      {isHome && !splashDone && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}

      {(!isHome || splashDone) && (
        <Suspense fallback={<LoadingSpinner fullPage text="\u05D8\u05D5\u05E2\u05DF \u05D3\u05E3..." />}>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/accessibility" element={<Accessibility />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/preview" element={<AdminPreview />} />
              <Route path="/font-preview" element={<FontPreview />} />
              <Route path="/animation-preview" element={<AnimationPreview />} />
              <Route path="/entrance-preview" element={<EntrancePreview />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </Suspense>
      )}

      <Suspense fallback={null}>
        <AccessibilityToolbar />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
