import { Suspense } from 'react'
import { ErrorBoundary } from '../errorBoundary'
import { Loading } from '../loading'

export const Async = ({
  errorFallback = null,
  loadingFallback = <Loading />,
  errorMessage = null,
  children,
}) => {
  return (
    <ErrorBoundary fallback={errorFallback} message={errorMessage}>
      <Suspense fallback={loadingFallback}>{children}</Suspense>
    </ErrorBoundary>
  )
}
