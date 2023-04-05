import * as React from 'react'
import { SPACING, Icon, IconName } from '@opentrons/components'
import { RunTimeCommand } from '@opentrons/shared-data'
import type { StyleProps } from '@opentrons/components'

const ICON_BY_COMMAND_TYPE: { [commandType: string]: IconName } = {
  delay: 'pause-circle',
  pause: 'pause-circle',
  waitForDuration: 'pause-circle',
  waitForResume: 'pause-circle',
}
interface CommandIconProps extends StyleProps {
  command: RunTimeCommand
}
export function CommandIcon(props: CommandIconProps): JSX.Element | null {
  const { command, ...styleProps } = props
  let iconName = null
  if (
    command.commandType === 'moveLabware' &&
    command.params.strategy === 'manualMoveWithPause'
  ) {
    iconName = 'pause-circle' as IconName
  } else if (
    command.commandType === 'custom' &&
    command.params?.legacyCommandType === 'command.COMMENT'
  ) {
    iconName = 'comment' as IconName
  } else {
    iconName = ICON_BY_COMMAND_TYPE[command.commandType] ?? null
  }

  return iconName != null ? (
    <Icon
      {...styleProps}
      name={iconName}
      size={SPACING.spacingM}
      flex="0 0 auto"
    />
  ) : null
}
