import * as React from 'react'
import { useTranslation } from 'react-i18next'
import {
  DIRECTION_COLUMN,
  Flex,
  JUSTIFY_CENTER,
  SPACING,
  useHoverTooltip,
  PrimaryButton,
} from '@opentrons/components'
import { useRunHasStarted, useUnmatchedModulesForProtocol } from '../../hooks'
import { useToggleGroup } from '../../../../molecules/ToggleGroup/useToggleGroup'
import { Tooltip } from '../../../../atoms/Tooltip'
import { SetupModulesMap } from './SetupModulesMap'
import { SetupModulesList } from './SetupModulesList'

interface SetupModulesProps {
  expandLabwareSetupStep: () => void
  robotName: string
  runId: string
}

export const SetupModules = ({
  expandLabwareSetupStep,
  robotName,
  runId,
}: SetupModulesProps): JSX.Element => {
  const { t } = useTranslation('protocol_setup')
  const [selectedValue, toggleGroup] = useToggleGroup(
    t('list_view'),
    t('map_view')
  )
  const { missingModuleIds } = useUnmatchedModulesForProtocol(robotName, runId)
  const runHasStarted = useRunHasStarted(runId)
  const [targetProps, tooltipProps] = useHoverTooltip()
  return (
    <>
      <Flex flexDirection={DIRECTION_COLUMN} marginTop={SPACING.spacing6}>
        {toggleGroup}
        {selectedValue === t('list_view') ? (
          <SetupModulesList robotName={robotName} runId={runId} />
        ) : (
          <SetupModulesMap robotName={robotName} runId={runId} />
        )}
      </Flex>
      <Flex justifyContent={JUSTIFY_CENTER}>
        <PrimaryButton
          disabled={missingModuleIds.length > 0 || runHasStarted}
          onClick={expandLabwareSetupStep}
          id="ModuleSetup_proceedToLabwareSetup"
          padding={`${String(SPACING.spacing3)} ${String(SPACING.spacing4)}`}
          {...targetProps}
        >
          {t('proceed_to_labware_setup_step')}
        </PrimaryButton>
      </Flex>
      {missingModuleIds.length > 0 || runHasStarted ? (
        <Tooltip tooltipProps={tooltipProps}>
          {runHasStarted
            ? t('protocol_run_started')
            : t('plug_in_required_module', { count: missingModuleIds.length })}
        </Tooltip>
      ) : null}
    </>
  )
}
