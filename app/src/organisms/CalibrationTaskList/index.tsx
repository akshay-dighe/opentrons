import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import {
  ALIGN_CENTER,
  COLORS,
  DIRECTION_COLUMN,
  Flex,
  Icon,
  JUSTIFY_CENTER,
  SPACING,
  TYPOGRAPHY,
} from '@opentrons/components'

import { PrimaryButton } from '../../atoms/buttons'
import { StatusLabel } from '../../atoms/StatusLabel'
import { StyledText } from '../../atoms/text'
import { Modal } from '../../molecules/Modal'
import { TaskList } from '../TaskList'

import { useCalibrationTaskList } from '../Devices/hooks'

import type { DashboardCalOffsetInvoker } from '../../pages/Devices/CalibrationDashboard/hooks/useDashboardCalibratePipOffset'
import type { DashboardCalTipLengthInvoker } from '../../pages/Devices/CalibrationDashboard/hooks/useDashboardCalibrateTipLength'
import type { DashboardCalDeckInvoker } from '../../pages/Devices/CalibrationDashboard/hooks/useDashboardCalibrateDeck'

interface CalibrationTaskListProps {
  robotName: string
  pipOffsetCalLauncher: DashboardCalOffsetInvoker
  tipLengthCalLauncher: DashboardCalTipLengthInvoker
  deckCalLauncher: DashboardCalDeckInvoker
}

export function CalibrationTaskList({
  robotName,
  pipOffsetCalLauncher,
  tipLengthCalLauncher,
  deckCalLauncher,
}: CalibrationTaskListProps): JSX.Element {
  const prevActiveIndex = React.useRef<[number, number] | null>(null)
  const [
    showCompletionScreen,
    setShowCompletionScreen,
  ] = React.useState<boolean>(false)
  const { t } = useTranslation(['robot_calibration', 'device_settings'])
  const history = useHistory()
  const { activeIndex, taskList, taskListStatus } = useCalibrationTaskList(
    robotName,
    pipOffsetCalLauncher,
    tipLengthCalLauncher,
    deckCalLauncher
  )

  React.useEffect(() => {
    if (prevActiveIndex.current !== null && activeIndex === null) {
      setShowCompletionScreen(true)
    }
    prevActiveIndex.current = activeIndex
  }, [activeIndex])

  // start off assuming we are missing calibrations
  let statusLabelBackgroundColor = COLORS.errorEnabled
  let statusLabelIconColor = COLORS.errorEnabled
  let statusLabelText = t('missing_calibration_data')

  // if the tasklist is empty, though, all calibrations are good
  if (taskListStatus === 'complete') {
    statusLabelBackgroundColor = COLORS.successEnabled
    statusLabelIconColor = COLORS.successEnabled
    statusLabelText = t('calibration_complete')
    // if we have tasks and they are all marked bad, then we should
    // strongly suggest they re-do those calibrations
  } else if (taskListStatus === 'bad') {
    statusLabelBackgroundColor = COLORS.warningEnabled
    statusLabelIconColor = COLORS.warningEnabled
    statusLabelText = t('calibration_recommended')
  }

  return (
    <Modal
      title={`${robotName} ${t('calibration_dashboard')}`}
      onClose={() =>
        history.push(`/devices/${robotName}/robot-settings/calibration`)
      }
      fullPage
      backgroundColor={COLORS.fundamentalsBackground}
      childrenPadding={`${SPACING.spacing4} ${SPACING.spacing5} ${SPACING.spacing5} ${SPACING.spacing2}`}
    >
      {showCompletionScreen ? (
        <Flex
          flexDirection={DIRECTION_COLUMN}
          padding="4.25rem 4.25rem 4.25rem 5.5rem"
        >
          <Flex
            flex="1"
            flexDirection={DIRECTION_COLUMN}
            justifyContent={JUSTIFY_CENTER}
            alignItems={ALIGN_CENTER}
          >
            <Icon name="ot-check" size="3rem" color={COLORS.successEnabled} />
            <StyledText as="h1" marginTop={SPACING.spacing5}>
              {t('calibrations_complete')}
            </StyledText>
            <PrimaryButton
              marginTop={SPACING.spacing5}
              onClick={() =>
                history.push(`/devices/${robotName}/robot-settings/calibration`)
              }
            >
              {t('device_settings:done')}
            </PrimaryButton>
          </Flex>
        </Flex>
      ) : (
        <>
          <Flex
            alignItems={ALIGN_CENTER}
            gridGap={SPACING.spacing3}
            padding={SPACING.spacing4}
            paddingBottom={SPACING.spacing6}
          >
            <StyledText css={TYPOGRAPHY.h2SemiBold}>
              {t('calibration_status')}
            </StyledText>
            <StatusLabel
              status={statusLabelText}
              backgroundColor={`${String(statusLabelBackgroundColor)}${String(
                COLORS.opacity12HexCode
              )}`}
              iconColor={statusLabelIconColor}
              textColor={COLORS.darkBlackEnabled}
              fontWeight={TYPOGRAPHY.fontWeightSemiBold}
              iconSize="0.313rem"
            />
          </Flex>
          <TaskList
            activeIndex={activeIndex}
            taskList={taskList}
            taskListStatus={taskListStatus}
          />
        </>
      )}
    </Modal>
  )
}
