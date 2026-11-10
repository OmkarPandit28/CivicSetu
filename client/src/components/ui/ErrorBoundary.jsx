import React from 'react';
import ErrorState from './ErrorState';
import Button from './Button';
import { ArrowLeft } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="py-12 max-w-xl mx-auto px-4">
          <ErrorState
            title="Rendering Error"
            message={this.state.error?.message || 'A presentation error occurred while loading this view.'}
            onRetry={this.handleReset}
            retryLabel="Reload View"
          />
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.history.back()}
              leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
            >
              Go Back
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
