import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMsg: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMsg: error.message || "Component crashed" };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: "red" }}>⚠️ Error: {this.state.errorMsg}</div>
      );
    }

    return this.props.children;
  }
}
