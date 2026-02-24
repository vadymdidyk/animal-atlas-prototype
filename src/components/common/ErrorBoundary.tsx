import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'
import i18n from '../../i18n'

import MessageOverlay from './MessageOverlay'
import IconError from '../icons/IconError'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <MessageOverlay
          isVisible={true}
          icon={<IconError />}
          message={i18n.t('error_boundary.text')}
          onClose={() => window.location.reload()} />
      )
    }

    return this.props.children
  }
}
