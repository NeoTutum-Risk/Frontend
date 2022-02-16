import React from 'react'
import { showDangerToaster } from '../../utils/toaster'
import { Error } from '../error'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: '' }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error) {
    // You can also log the error to an error reporting service
    this.setState(prevState => ({ ...prevState, error }))
    showDangerToaster(error)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <Error message={this.props.message && this.state.error} />
    }

    return this.props.children
  }
}
