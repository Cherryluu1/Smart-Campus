import { Component } from "react";

// Shows the error on screen instead of a blank white page.
export default class ErrorBoundary extends Component {
    state = { error: null };

    static getDerivedStateFromError(error) {
        return { error };
    }

    render() {
        if (this.state.error) {
            return (
                <div style={{ padding: 24, fontFamily: "sans-serif" }}>
                    <h2>Something went wrong</h2>
                    <pre style={{ whiteSpace: "pre-wrap", color: "#b00020" }}>
                        {String(this.state.error?.message || this.state.error)}
                    </pre>
                    <button onClick={() => window.location.assign("/login")}>
                        Back to login
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
