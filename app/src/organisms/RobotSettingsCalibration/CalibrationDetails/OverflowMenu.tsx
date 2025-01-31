import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { saveAs } from 'file-saver'

import {
  Flex,
  COLORS,
  POSITION_ABSOLUTE,
  DIRECTION_COLUMN,
  POSITION_RELATIVE,
  ALIGN_FLEX_END,
  Mount,
  useOnClickOutside,
} from '@opentrons/components'
import { isOT3Pipette, SINGLE_MOUNT_PIPETTES } from '@opentrons/shared-data'
import { useDeleteCalibrationMutation } from '@opentrons/react-api-client'

import { Divider } from '../../../atoms/structure'
import { OverflowBtn } from '../../../atoms/MenuList/OverflowBtn'
import { MenuItem } from '../../../atoms/MenuList/MenuItem'
import { useMenuHandleClickOutside } from '../../../atoms/MenuList/hooks'
import { useTrackEvent } from '../../../redux/analytics'
import { EVENT_CALIBRATION_DOWNLOADED } from '../../../redux/calibration'
import {
  usePipetteOffsetCalibrations,
  useRunStatuses,
  useTipLengthCalibrations,
} from '../../../organisms/Devices/hooks'
import { PipetteWizardFlows } from '../../PipetteWizardFlows'
import { FLOWS } from '../../PipetteWizardFlows/constants'

import type { PipetteName } from '@opentrons/shared-data'
import type { DeleteCalRequestParams } from '@opentrons/api-client'

interface OverflowMenuProps {
  calType: 'pipetteOffset' | 'tipLength'
  robotName: string
  mount: Mount
  serialNumber: string | null
  updateRobotStatus: (isRobotBusy: boolean) => void
  pipetteName?: string | null
  tiprackDefURI?: string | null
}

export function OverflowMenu({
  calType,
  robotName,
  mount,
  serialNumber,
  updateRobotStatus,
  pipetteName,
  tiprackDefURI = null,
}: OverflowMenuProps): JSX.Element {
  const { t } = useTranslation([
    'device_settings',
    'shared',
    'robot_calibration',
  ])
  const doTrackEvent = useTrackEvent()
  const {
    menuOverlay,
    handleOverflowClick,
    showOverflowMenu,
    setShowOverflowMenu,
  } = useMenuHandleClickOutside()

  const calsOverflowWrapperRef = useOnClickOutside<HTMLDivElement>({
    onClickOutside: () => setShowOverflowMenu(false),
  })
  const pipetteOffsetCalibrations = usePipetteOffsetCalibrations(robotName)

  const tipLengthCalibrations = useTipLengthCalibrations(robotName)
  const { isRunRunning: isRunning } = useRunStatuses()
  const [
    showPipetteWizardFlows,
    setShowPipetteWizardFlows,
  ] = React.useState<boolean>(false)
  const isGen3Pipette = isOT3Pipette(pipetteName as PipetteName)

  const applicablePipetteOffsetCal = pipetteOffsetCalibrations?.find(
    p => p.mount === mount && p.pipette === serialNumber
  )
  const applicableTipLengthCal = tipLengthCalibrations?.find(
    cal => cal.pipette === serialNumber && cal.uri === tiprackDefURI
  )

  const handleRecalibrate = (e: React.MouseEvent): void => {
    e.preventDefault()
    if (
      !isRunning &&
      isGen3Pipette &&
      calType === 'pipetteOffset' &&
      pipetteName != null
    ) {
      setShowPipetteWizardFlows(true)
    }
    setShowOverflowMenu(currentShowOverflowMenu => !currentShowOverflowMenu)
  }

  const handleDownload = (e: React.MouseEvent): void => {
    e.preventDefault()
    doTrackEvent({
      name: EVENT_CALIBRATION_DOWNLOADED,
      properties: {},
    })

    if (calType === 'pipetteOffset') {
      saveAs(
        new Blob([JSON.stringify(pipetteOffsetCalibrations)]),
        `opentrons-${robotName}-pipette-offset-calibration.json`
      )
    } else if (calType === 'tipLength') {
      saveAs(
        new Blob([JSON.stringify(tipLengthCalibrations)]),
        `opentrons-${robotName}-tip-length-calibration.json`
      )
    }
    setShowOverflowMenu(currentShowOverflowMenu => !currentShowOverflowMenu)
  }

  React.useEffect(() => {
    if (isRunning) {
      updateRobotStatus(true)
    }
  }, [isRunning, updateRobotStatus])

  const { deleteCalibration } = useDeleteCalibrationMutation()

  const handleDeleteCalibration = (e: React.MouseEvent): void => {
    e.preventDefault()
    let params: DeleteCalRequestParams
    if (calType === 'pipetteOffset') {
      if (applicablePipetteOffsetCal == null) return
      params = {
        calType,
        mount,
        pipette_id: applicablePipetteOffsetCal.pipette,
      }
    } else {
      if (applicableTipLengthCal == null) return
      params = {
        calType,
        tiprack_hash: applicableTipLengthCal.tiprack,
        pipette_id: applicableTipLengthCal.pipette,
      }
    }

    deleteCalibration(params)

    setShowOverflowMenu(currentShowOverflowMenu => !currentShowOverflowMenu)
  }

  return (
    <Flex flexDirection={DIRECTION_COLUMN} position={POSITION_RELATIVE}>
      <OverflowBtn
        alignSelf={ALIGN_FLEX_END}
        aria-label="CalibrationOverflowMenu_button"
        onClick={handleOverflowClick}
      />
      {showPipetteWizardFlows ? (
        <PipetteWizardFlows
          flowType={FLOWS.CALIBRATE}
          mount={mount}
          closeFlow={() => setShowPipetteWizardFlows(false)}
          robotName={robotName}
          //  TODO(jr/12/1/22): only single mount pipettes can be calibrated here for now
          selectedPipette={SINGLE_MOUNT_PIPETTES}
        />
      ) : null}
      {showOverflowMenu ? (
        <Flex
          ref={calsOverflowWrapperRef}
          whiteSpace="nowrap"
          zIndex={10}
          borderRadius="4px 4px 0px 0px"
          boxShadow="0px 1px 3px rgba(0, 0, 0, 0.2)"
          position={POSITION_ABSOLUTE}
          backgroundColor={COLORS.white}
          top="2.3rem"
          right={0}
          flexDirection={DIRECTION_COLUMN}
        >
          {isGen3Pipette ? (
            <MenuItem onClick={handleRecalibrate}>
              {t('robot_calibration:recalibrate_pipette')}
            </MenuItem>
          ) : (
            <>
              <MenuItem onClick={handleDownload}>
                {t('download_calibration_data')}
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleDeleteCalibration}>
                {t('robot_calibration:delete_calibration_data')}
              </MenuItem>
            </>
          )}
        </Flex>
      ) : null}
      {menuOverlay}
    </Flex>
  )
}
