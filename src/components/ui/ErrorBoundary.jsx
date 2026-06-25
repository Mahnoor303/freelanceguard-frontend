import React from 'react';

export default class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex flex-col items-center justify-center bg-black text-white text-center px-6">
          <h1 className="text-5xl font-bold mb-4">Something went wrong</h1>
          <p className="text-gray-400 mb-6">Please refresh the page or try again later.</p>
          <button onClick={() => window.location.reload()} className="bg-primary text-black px-6 py-3 rounded-full font-bold">
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}