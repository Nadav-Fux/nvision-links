import { useState } from 'react';
import { checkLinks } from '@/lib/adminApi';
import type { LinkCheckResult } from '@/lib/adminApi';
import { Activity, Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export const LinkHealthChecker = () => {
  const [results, setResults] = useState<LinkCheckResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runCheck = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await checkLinks();
      setResults(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err) || 'שגיאה בבדיקה');
    }
    setLoading(false);
  };

  const okCount = results?.filter((r) => r.ok).length || 0;
  const failCount = results?.filter((r) => !r.ok).length || 0;

  return (
    <div data-ev-id="ev_9686f18195" className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
      <div data-ev-id="ev_47d2b7e2a3" className="flex items-center justify-between mb-4">
        <h3 data-ev-id="ev_25b602a64e" className="text-white/60 text-xs font-semibold flex items-center gap-2">
          <Activity className="w-3.5 h-3.5" aria-hidden="true" />
          בודק קישורים
        </h3>
        <button data-ev-id="ev_d242830fdc"
        onClick={runCheck}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-all disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          {loading ? 'בודק...' : 'הפעל סריקה'}
        </button>
      </div>

      {error &&
      <div data-ev-id="ev_202c4fa280" role="alert" className="text-red-400/70 text-sm px-3 py-2 bg-red-500/[0.06] border border-red-500/15 rounded-lg mb-3">
          {error}
        </div>
      }

      {results &&
      <>
          {/* Summary */}
          <div data-ev-id="ev_712a583d1f" className="flex items-center gap-4 mb-3 text-xs">
            <span data-ev-id="ev_2e3e2d388a" className="flex items-center gap-1 text-green-400/70">
              <CheckCircle className="w-3.5 h-3.5" /> {okCount} תקינים
            </span>
            <span data-ev-id="ev_c3d01b71a9" className="flex items-center gap-1 text-red-400/70">
              <XCircle className="w-3.5 h-3.5" /> {failCount} שבורים
            </span>
          </div>

          {/* Failed links first */}
          <div data-ev-id="ev_592d815066" className="space-y-1.5 max-h-60 overflow-y-auto scrollbar-hide">
            {results.
          sort((a, b) => a.ok === b.ok ? 0 : a.ok ? 1 : -1).
          map((r) =>
          <div data-ev-id="ev_5f2fb34e5d"
          key={r.id}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
          r.ok ? 'bg-green-500/[0.03]' : 'bg-red-500/[0.06] border border-red-500/10'}`
          }>

                  {r.ok ?
            <CheckCircle className="w-3.5 h-3.5 text-green-400/60 flex-shrink-0" /> :

            <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
            }
                  <span data-ev-id="ev_73c339e2b8" className={`truncate flex-1 ${r.ok ? 'text-white/60' : 'text-white/70'}`}>
                    {r.title}
                  </span>
                  <span data-ev-id="ev_34ca0ba4ec" className={`font-mono flex-shrink-0 ${r.ok ? 'text-green-400/50' : 'text-red-400/70'}`}>
                    {r.status > 0 ? r.status : r.error?.slice(0, 20) || 'timeout'}
                  </span>
                </div>
          )}
          </div>
        </>
      }

      {!results && !loading &&
      <p data-ev-id="ev_7d6a5f8f50" className="text-white/60 text-xs text-center py-6">לחץ על הפעל סריקה לבדוק את כל הקישורים</p>
      }
    </div>);

};