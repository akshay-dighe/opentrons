import * as React from 'react'
import { css } from 'styled-components'
import {
  parseLabwareInfoByLiquidId,
  parseLiquidsInLoadOrder,
} from '@opentrons/api-client'
import { DIRECTION_COLUMN, Flex, SPACING } from '@opentrons/components'
import { Divider } from '../../atoms/structure'
import { LiquidsListItemDetails } from '../Devices/ProtocolRun/SetupLiquids/SetupLiquidsList'

import type { Liquid, RunTimeCommand } from '@opentrons/shared-data'

interface ProtocolLiquidsDetailsProps {
  commands: RunTimeCommand[]
  liquids: Liquid[]
}

export const ProtocolLiquidsDetails = (
  props: ProtocolLiquidsDetailsProps
): JSX.Element => {
  const { commands, liquids } = props
  const liquidsInLoadOrder = parseLiquidsInLoadOrder(liquids, commands)
  const labwareByLiquidId = parseLabwareInfoByLiquidId(commands)
  const HIDE_SCROLLBAR = css`
    ::-webkit-scrollbar {
      display: none;
    }
  `
  return (
    <Flex
      css={HIDE_SCROLLBAR}
      flexDirection={DIRECTION_COLUMN}
      maxHeight="25rem"
      overflowY="auto"
      data-testid="LiquidsDetailsTab"
    >
      {liquidsInLoadOrder?.map((liquid, index) => {
        return (
          <React.Fragment key={liquid.id}>
            <Flex flexDirection={DIRECTION_COLUMN} marginY={SPACING.spacing4}>
              <LiquidsListItemDetails
                liquidId={liquid.id}
                displayColor={liquid.displayColor}
                displayName={liquid.displayName}
                description={liquid.description}
                labwareByLiquidId={labwareByLiquidId}
              />
            </Flex>
            {index < liquidsInLoadOrder.length - 1 && <Divider />}
          </React.Fragment>
        )
      })}
    </Flex>
  )
}
