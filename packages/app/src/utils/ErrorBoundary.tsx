/* eslint-disable max-classes-per-file */
import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    // You can also send the error to an error reporting service
  }

  render() {
    const { hasError } = this.state;
    if (hasError) {
      // TODO: write a sample fallback page.
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

export function withErrorBoundary(WrappedComponent) {
  return function WrappedwithErrorBoundary(props) {
    // Explicitly pass only the props you want to allow
    // For example, if WrappedComponent expects 'foo' and 'bar' props:
    // const { foo, bar } = props;
    // return (
    //   <ErrorBoundary>
    //     <WrappedComponent foo={foo} bar={bar} />
    //   </ErrorBoundary>
    // );
    // If you want to allow all props, list them explicitly or use destructuring as above.
    return (
      <ErrorBoundary>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}