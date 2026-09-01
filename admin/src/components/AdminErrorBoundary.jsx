import React from 'react';
import { ShieldAlert, RefreshCw, LayoutDashboard } from 'lucide-react';

/**
 * Enterprise Production React Error Boundary for Admin Studio
 */
export default class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Admin Studio Error Boundary Caught]:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center p-6 font-sans">
          <div className="bg-zinc-900 border border-red-800/80 rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center shadow-2xl">
            <div className="w-18 h-18 rounded-3xl bg-red-950/80 text-red-400 flex items-center justify-center mx-auto mb-6 border border-red-800/50">
              <ShieldAlert className="w-9 h-9" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-display text-white">
              Admin Studio Exception
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-2 leading-relaxed">
              An unhandled exception occurred in the executive studio. The application state has been safely isolated.
            </p>

            {this.state.error && (
              <div className="mt-4 p-3 bg-zinc-950 text-red-300 text-left font-mono text-[11px] rounded-xl overflow-x-auto max-h-36 border border-zinc-800">
                {this.state.error.toString()}
              </div>
            )}

            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  window.location.href = '/';
                }}
                className="px-6 py-3 rounded-2xl border border-zinc-700 font-bold text-zinc-300 hover:bg-zinc-800 text-xs transition-colors inline-flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Reset Studio</span>
              </button>

              <button
                onClick={this.handleReset}
                className="px-7 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 text-white font-bold text-xs shadow-lg shadow-red-500/25 flex items-center gap-2 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

