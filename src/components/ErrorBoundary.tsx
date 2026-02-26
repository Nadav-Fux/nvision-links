import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  /** Optional fallback to show instead of default error UI */
  fallback?: ReactNode;
  /** If true, shows a compact inline error instead of full-page */
  inline?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary — catches any crash in child components
 * and shows a recovery UI instead of killing the entire app.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <SomeComponent />
 *   </ErrorBoundary>
 *
 *   <ErrorBoundary inline>
 *     <ViewComponent />   // shows compact error if view crashes
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    // Inline compact error (for views)
    if (this.props.inline) {
      return (
        <div data-ev-id="ev_c9a18b9277"
        dir="rtl"
        className="flex flex-col items-center justify-center py-16 gap-4"
        role="alert">

          <div data-ev-id="ev_37781c82b7" className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-400" aria-hidden="true" />
          </div>
          <div data-ev-id="ev_dfb44cc849" className="text-center">
            <p data-ev-id="ev_2775970286" className="text-white/80 font-semibold text-sm mb-1">
              משהו השתבש
            </p>
            <p data-ev-id="ev_df7c241476" className="text-white/60 text-xs max-w-xs">
              התצוגה נתקלה בבעיה. נסו לטעון מחדש או לבחור תצוגה אחרת.
            </p>
          </div>
          <button data-ev-id="ev_71ec10fd3d"
          onClick={this.handleRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white/60 hover:text-white/90 hover:bg-white/[0.1] text-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            נסה שוב
          </button>
        </div>);

    }

    // Full-page error (for top-level)
    return (
      <div data-ev-id="ev_92f8ce2133"
      dir="rtl"
      className="min-h-screen flex flex-col items-center justify-center gap-6 px-6"
      style={{
        background: 'linear-gradient(160deg, #0a0a14 0%, #0d0d1a 30%, #0f0a1a 60%, #0a0f14 100%)'
      }}
      role="alert">

        <div data-ev-id="ev_c2bd4161a2" className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <AlertTriangle className="w-9 h-9 text-red-400" aria-hidden="true" />
        </div>
        <div data-ev-id="ev_8b3db380c3" className="text-center max-w-md">
          <h1 data-ev-id="ev_8ea7c68e3b" className="text-white font-bold text-xl mb-2">
            משהו השתבש
          </h1>
          <p data-ev-id="ev_29e7d0873d" className="text-white/60 text-sm leading-relaxed">
            אירעה שגיאה בלתי צפויה. אפשר לנסות שוב או לרענן את הדף.
          </p>
          {this.state.error &&
          <details data-ev-id="ev_2b034a64a2" className="mt-4 text-right">
              <summary data-ev-id="ev_41785aa747" className="text-white/60 text-xs cursor-pointer hover:text-white/70 transition-colors">
                פרטים טכניים
              </summary>
              <pre data-ev-id="ev_ec61b79989" className="mt-2 text-red-400/60 text-[10px] bg-white/[0.03] rounded-lg p-3 overflow-auto max-h-32 text-left dir-ltr">
                {this.state.error.message}
              </pre>
            </details>
          }
        </div>
        <div data-ev-id="ev_abe5c38db3" className="flex items-center gap-3">
          <button data-ev-id="ev_3c3d4bf634"
          onClick={this.handleRetry}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/15 border border-primary/25 text-primary hover:bg-primary/25 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            נסה שוב
          </button>
          <button data-ev-id="ev_a6a43a4b7e"
          onClick={this.handleReload}
          className="px-5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white/60 hover:text-white/90 text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">

            רענון דף
          </button>
        </div>
      </div>);

  }
}