/* eslint-disable max-classes-per-file */
import * as React from 'react';

type ErrorBoundaryState = { hasError: boolean };
type ErrorBoundaryProps = { children?: React.ReactNode };

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: unknown): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    // eslint-disable-next-line no-console
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    // Optionally send to error reporting service
  }

  render(): React.ReactNode {
    const { hasError } = this.state;
    if (hasError) {
      // TODO: write a sample fallback page.
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children ?? null;
  }
}

export function withErrorBoundary<P extends object>(WrappedComponent: React.ComponentType<React.PropsWithChildren<P>>): React.FC<React.PropsWithChildren<P>> {
  const WrappedWithBoundary: React.FC<React.PropsWithChildren<P>> = (props) => (
    <ErrorBoundary>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );
  const wrappedName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WrappedWithBoundary.displayName = `withErrorBoundary(${wrappedName})`;
  return WrappedWithBoundary;
}
