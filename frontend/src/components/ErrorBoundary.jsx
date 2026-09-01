import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * Enterprise Production React Error Boundary
 * Catches JavaScript errors anywhere in child component tree and renders fallback UI
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // In production, send to telemetry/logging service (e.g. Sentry)
    console.error('[Vyanjan Error Boundary Caught]:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-50 dark:bg-zinc-950 flex items-center justify-center p-4 sm:p-6 transition-colors">
          <div className="bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900/60 rounded-3xl sm:rounded-[36px] shadow-2xl p-8 sm:p-12 max-w-lg w-full text-center">
            <div className="w-18 h-18 rounded-3xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <AlertTriangle className="w-9 h-9" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white font-display">
              Oops! Something went wrong
            </h2>
            <p className="text-stone-500 dark:text-zinc-400 text-xs sm:text-sm mt-3 leading-relaxed">
              An unexpected error occurred while rendering the kitchen interface. Don't worry, your data is safe.
            </p>

            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-zinc-950 text-red-700 dark:text-red-300 text-left font-mono text-[11px] rounded-xl overflow-x-auto max-h-36 border border-red-200/60 dark:border-zinc-800">
                {this.state.error.toString()}
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  window.location.href = '/';
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-stone-300 dark:border-zinc-700 font-bold text-stone-700 dark:text-zinc-300 hover:bg-stone-50 dark:hover:bg-zinc-800 text-xs transition-colors inline-flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>Return Home</span>
              </button>

              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

