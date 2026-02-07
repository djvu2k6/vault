import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8">
                    <h1 className="text-3xl font-bold text-red-500 mb-4">Something went wrong.</h1>
                    <div className="bg-slate-800 p-6 rounded-lg max-w-2xl w-full overflow-auto text-left border border-slate-700">
                        <h2 className="text-xl font-bold mb-2">Error Details:</h2>
                        <pre className="text-red-300 mb-4 whitespace-pre-wrap">{this.state.error && this.state.error.toString()}</pre>
                        <h3 className="text-lg font-bold mb-2">Component Stack:</h3>
                        <pre className="text-slate-400 text-xs whitespace-pre-wrap">{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
                    </div>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="mt-8 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium"
                    >
                        Return to Home
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
