import { useAllCommandsQuery } from '@opentrons/react-api-client'
import { useRunStatus } from '../../RunTimeControl/hooks'
import {
  RUN_STATUS_BLOCKED_BY_OPEN_DOOR,
  RUN_STATUS_FINISHING,
  RUN_STATUS_IDLE,
  RUN_STATUS_PAUSED,
  RUN_STATUS_PAUSE_REQUESTED,
  RUN_STATUS_RUNNING,
  RUN_STATUS_STOP_REQUESTED,
} from '@opentrons/api-client'

const LIVE_RUN_STATUSES = [
  RUN_STATUS_IDLE,
  RUN_STATUS_PAUSED,
  RUN_STATUS_PAUSE_REQUESTED,
  RUN_STATUS_STOP_REQUESTED,
  RUN_STATUS_RUNNING,
  RUN_STATUS_FINISHING,
  RUN_STATUS_BLOCKED_BY_OPEN_DOOR,
]
const LIVE_RUN_COMMANDS_POLL_MS = 3000

export function useLastRunCommandKey(runId: string): string | null {
  const runStatus = useRunStatus(runId)
  const { data: commandsData } = useAllCommandsQuery(
    runId,
    { cursor: null, pageLength: 1 },
    {
      refetchInterval:
        runStatus != null && LIVE_RUN_STATUSES.includes(runStatus)
          ? LIVE_RUN_COMMANDS_POLL_MS
          : Infinity,
      keepPreviousData: true,
    }
  )
  return commandsData?.data?.[0]?.intent !== 'setup'
    ? commandsData?.links?.current?.meta?.key ??
        commandsData?.data?.[0]?.key ??
        null
    : null
}
