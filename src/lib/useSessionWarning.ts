import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import {
  isAdminLoggedIn,
  getSessionRemainingMs,
  clearAdminSession,
  SESSION_WARNING_MS,
} from '@/lib/adminApi';

/**
 * Monitors the admin session timer and fires toast warnings:
 * - When ~2 minutes remain: warning toast
 * - When expired: error toast + calls onExpired
 */
export function useSessionWarning(onExpired: () => void) {
  const warnedRef = useRef(false);

  useEffect(() => {
    if (!isAdminLoggedIn()) return;

    const CHECK_INTERVAL = 15_000; // check every 15s

    const id = setInterval(() => {
      if (!isAdminLoggedIn()) {
        // Session already cleared elsewhere
        clearInterval(id);
        return;
      }

      const remaining = getSessionRemainingMs();

      if (remaining === 0) {
        clearInterval(id);
        clearAdminSession();
        toast.error('החיבור פג תוקף — יש להתחבר מחדש', { duration: 8000 });
        onExpired();
        return;
      }

      if (remaining <= SESSION_WARNING_MS && !warnedRef.current) {
        warnedRef.current = true;
        const mins = Math.ceil(remaining / 60_000);
        toast.warning(`החיבור יפוג בעוד ${mins} דקות — פעולה כלשהי תאפס את הזמן`, {
          duration: 10000,
        });
      }
    }, CHECK_INTERVAL);

    return () => clearInterval(id);
  }, [onExpired]);
}
