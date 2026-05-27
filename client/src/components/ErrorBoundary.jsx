import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    fontFamily: 'sans-serif',
                    padding: '2rem',
                    textAlign: 'center'
                }}>
                    <div>
                        <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>
                            Lỗi ứng dụng
                        </h2>
                        <p style={{ color: '#666', marginBottom: '1rem' }}>
                            Đã xảy ra lỗi khi tải ứng dụng. Vui lòng thử lại sau.
                        </p>
                        <pre style={{
                            background: '#f3f4f6',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            textAlign: 'left',
                            overflow: 'auto',
                            fontSize: '0.875rem'
                        }}>
                            {this.state.error?.toString()}
                        </pre>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                marginTop: '1rem',
                                padding: '0.5rem 1rem',
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.375rem',
                                cursor: 'pointer'
                            }}
                        >
                            Tải lại trang
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
