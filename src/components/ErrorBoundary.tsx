import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Catches unexpected runtime errors in hosted builds so visitors see a
 * recoverable Blue Moon fallback instead of a blank screen.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Blue Moon runtime error:', error, info);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#070B14] px-6 text-center text-[#EEF3FC]">
          <p className="font-mono text-xs text-[#7AB3FF]">EDISI BLUE MOON</p>
          <h1 className="font-editorial mt-3 text-3xl font-semibold">
            Terjadi gangguan saat memuat halaman
          </h1>
          <p className="mt-2 max-w-md text-sm text-[#94A3C8]">
            Muat ulang halaman untuk memulihkan tampilan jurnal film Seporsi Mie
            Ayam Sebelum Mati.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-[#7AB3FF] px-5 py-2.5 text-sm font-semibold text-[#070B14] transition-colors hover:bg-[#9CC7FF]"
          >
            Muat Ulang Halaman
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
