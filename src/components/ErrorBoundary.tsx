import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-6 text-amber-500 animate-bounce">
            <AlertTriangle size={32} />
          </div>
          
          <h1 className="text-2xl font-black mb-2 tracking-tight">Something went wrong</h1>
          <p className="text-slate-400 text-sm max-w-md mb-8 leading-relaxed">
            The application encountered an unexpected state. Don't worry, your wallet and cart session are safe.
          </p>

          <div className="flex gap-3">
            <button
              onClick={this.handleReload}
              className="px-5 py-2.5 rounded-2xl bg-amber-500 text-slate-950 font-black text-sm flex items-center gap-2 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <RefreshCw size={16} />
              <span>Reload Page</span>
            </button>

            <button
              onClick={this.handleGoHome}
              className="px-5 py-2.5 rounded-2xl bg-white/10 text-white font-bold text-sm flex items-center gap-2 hover:bg-white/20 transition-colors active:scale-95"
            >
              <Home size={16} />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
