import * as React from 'react'
import { css } from 'styled-components'
import {
  BORDERS,
  COLORS,
  Flex,
  SPACING,
  PrimaryButton,
} from '@opentrons/components'
import { useTrackEvent } from '../../redux/analytics'

const BUTTON_GROUP_STYLES = css`
  border-radius: ${BORDERS.radiusSoftCorners};
  margin-top: -1px;
  width: fit-content;

  button {
    height: 28px;
    width: auto;
    font-weight: 400;
    font-size: 11px;
    line-height: 14px;
    box-shadow: none;
    padding-top: 6px;
    padding-bottom: 8px;
    &:focus {
      box-shadow: none;
      color: ${COLORS.white};
    }

    &:hover {
      background-color: ${COLORS.fundamentalsBackground};
      color: ${COLORS.black};
      box-shadow: 0 0 0;
    }

    &.active {
      background-color: ${COLORS.blueEnabled};
      color: ${COLORS.white};
    }

    &:disabled {
      background-color: inherit;
      color: ${COLORS.errorDisabled};
    }
  }

  button:first-child {
    border-radius: ${BORDERS.radiusSoftCorners} 0 0 ${BORDERS.radiusSoftCorners};
    border-right: none;
  }

  button:last-child {
    border-radius: 0 ${BORDERS.radiusSoftCorners} ${BORDERS.radiusSoftCorners} 0;
    border-left: none;
  }
`

const ACTIVE_STYLE = css`
  padding-left: ${SPACING.spacing3};
  padding-right: ${SPACING.spacing3};
  background-color: ${COLORS.blueEnabled};
  color: ${COLORS.white};
  pointer-events: none;
`

const DEFAULT_STYLE = css`
  padding-left: ${SPACING.spacing3};
  padding-right: ${SPACING.spacing3};
  background-color: ${COLORS.white};
  color: ${COLORS.black};
  border: 1px ${COLORS.medGreyEnabled} solid;
`

export const useToggleGroup = (
  left: string,
  right: string,
  trackEventName?: string
): [string, React.ReactNode] => {
  const [selectedValue, setSelectedValue] = React.useState<string>(left)
  const trackEvent = useTrackEvent()
  const handleLeftClick = (): void => {
    setSelectedValue(left)
    if (trackEventName != null) {
      trackEvent({
        name: trackEventName,
        properties: { view: 'list' },
      })
    }
  }
  const handleRightClick = (): void => {
    setSelectedValue(right)
    if (trackEventName != null) {
      trackEvent({
        name: trackEventName,
        properties: { view: 'map' },
      })
    }
  }

  return [
    selectedValue,
    <Flex css={BUTTON_GROUP_STYLES} key="toggleGroup">
      <PrimaryButton
        css={selectedValue === left ? ACTIVE_STYLE : DEFAULT_STYLE}
        key={left}
        onClick={handleLeftClick}
        data-testid="useToggleGroup_leftButton"
      >
        {left}
      </PrimaryButton>
      <PrimaryButton
        css={selectedValue === right ? ACTIVE_STYLE : DEFAULT_STYLE}
        key={right}
        onClick={handleRightClick}
        data-testid="useToggleGroup_rightButton"
      >
        {right}
      </PrimaryButton>
    </Flex>,
  ]
}
