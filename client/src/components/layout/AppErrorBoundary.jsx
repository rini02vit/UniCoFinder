import React, { Component } from 'react';

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AppErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="state-container">
            <div className="state-icon error">⚠️</div>
            <h3 className="state-title">Something went wrong</h3>
            <p className="state-desc">We encountered an unexpected error. Please try refreshing the page.</p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default AppErrorBoundary;
