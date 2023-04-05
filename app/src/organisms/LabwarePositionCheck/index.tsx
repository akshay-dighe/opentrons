import * as React from 'react'
import { useRunQuery } from '@opentrons/react-api-client'
import { useLogger } from '../../logger'
import { LabwarePositionCheckComponent } from './LabwarePositionCheckComponent'
import { useMostRecentCompletedAnalysis } from './useMostRecentCompletedAnalysis'
import { FatalErrorModal } from './FatalErrorModal'

interface LabwarePositionCheckModalProps {
  onCloseClick: () => void
  runId: string
  caughtError?: Error
}

// We explicitly wrap LabwarePositionCheckComponent in an ErrorBoundary because an error might occur while pulling in
// the component's dependencies (like useLabwarePositionCheck). If we wrapped the contents of LabwarePositionCheckComponent
// in an ErrorBoundary as part of its return value (render), an error could occur before this point, meaning the error boundary
// would never get invoked
export const LabwarePositionCheck = (
  props: LabwarePositionCheckModalProps
): JSX.Element => {
  const logger = useLogger(__filename)

  const mostRecentAnalysis = useMostRecentCompletedAnalysis(props.runId)

  const existingOffsets =
    useRunQuery(props.runId).data?.data?.labwareOffsets ?? []

  return (
    <ErrorBoundary
      logger={logger}
      ErrorComponent={FatalErrorModal}
      onClose={props.onCloseClick}
    >
      <LabwarePositionCheckComponent
        {...props}
        {...{ mostRecentAnalysis, existingOffsets }}
      />
    </ErrorBoundary>
  )
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  onClose: () => void
  logger: ReturnType<typeof useLogger>
  ErrorComponent: (props: {
    errorMessage: string
    onClose: () => void
  }) => JSX.Element
}
class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  { error: Error | null }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { error: null }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.props.logger.error(`LPC error message: ${error.message}`)
    this.props.logger.error(
      `LPC error component stack: ${errorInfo.componentStack}`
    )
    this.setState({
      error,
    })
  }

  render(): ErrorBoundaryProps['children'] | JSX.Element {
    const { ErrorComponent, children } = this.props
    const { error } = this.state
    if (error != null)
      return (
        <ErrorComponent
          errorMessage={error.message}
          onClose={this.props.onClose}
        />
      )
    // Normally, just render children
    return children
  }
}
