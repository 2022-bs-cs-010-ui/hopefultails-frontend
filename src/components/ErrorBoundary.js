import React from 'react'
import PropTypes from 'prop-types'
import Message from './Message'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Message variant="danger">
          <strong>Something went wrong.</strong>
          <div>{this.state.error?.message}</div>
          <div className="mt-2">
            <button className="btn btn-sm btn-outline-light" onClick={() => this.setState({ hasError: false, error: null })}>
              Try again
            </button>
          </div>
        </Message>
      )
    }
    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ErrorBoundary
