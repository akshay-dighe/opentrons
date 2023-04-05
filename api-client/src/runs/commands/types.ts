import type { RunTimeCommand } from '@opentrons/shared-data'

export interface GetCommandsParams {
  cursor: number | null // the index of the command at the center of the window
  pageLength: number // the number of items to include
}

export interface RunCommandSummary {
  id: string
  key: string
  commandType: RunTimeCommand['commandType']
  status: 'queued' | 'running' | 'succeeded' | 'failed'
  createdAt: string
  intent?: 'protocol' | 'setup'
  params?: any
  // TODO(mc, 2022-02-02): `result` does not exist on RunCommandSummary
  result?: RunTimeCommand['result']
  startedAt?: string
  completedAt?: string
  error?: RunCommandError
}

export interface CommandDetail {
  data: RunTimeCommand
}

export interface CommandsLinks {
  current: {
    // link to the currently executing command
    href: string
    meta: {
      runId: string
      commandId: string
      key: string
      createdAt: string
      index: number
    }
  }
}

export interface CommandsData {
  data: RunCommandSummary[]
  meta: GetCommandsParams & { totalLength: number }
  links: CommandsLinks
}

export interface CreateCommandParams {
  waitUntilComplete?: boolean
  timeout?: number
}

export interface RunCommandError {
  id: string
  errorType: string
  createdAt: string
  detail: string
}
