// jog controls component
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { css } from 'styled-components'

import {
  Box,
  Flex,
  Icon,
  HandleKeypress,
  ALIGN_CENTER,
  JUSTIFY_CENTER,
  BORDERS,
  COLORS,
  SPACING,
  TYPOGRAPHY,
  DIRECTION_COLUMN,
  JUSTIFY_SPACE_BETWEEN,
  DIRECTION_ROW,
  ALIGN_FLEX_START,
  ALIGN_FLEX_END,
  PrimaryButton,
  TEXT_ALIGN_LEFT,
  JUSTIFY_FLEX_START,
  ALIGN_STRETCH,
} from '@opentrons/components'
import { StyledText } from '../../atoms/text'
import { ControlContainer } from './ControlContainer'
import { HORIZONTAL_PLANE, VERTICAL_PLANE } from './constants'

import type { IconName } from '@opentrons/components'
import type { CSSProperties } from 'styled-components'
import type { Jog, Plane, Sign, Bearing, Axis, StepSize } from './types'

interface Control {
  bearing: Bearing
  keyName: string
  shiftKey: boolean
  gridColumn: number
  iconName: IconName
  axis: Axis
  sign: Sign
}
interface ControlsContents {
  controls: Control[]
  title: string
  subtitle: string
}

const CONTROLS_CONTENTS_BY_PLANE: Record<Plane, ControlsContents> = {
  [VERTICAL_PLANE]: {
    controls: [
      {
        keyName: 'ArrowUp',
        shiftKey: true,
        bearing: 'up',
        iconName: 'ot-arrow-up',
        axis: 'z',
        sign: 1,
        gridColumn: 1,
      },
      {
        keyName: 'ArrowDown',
        shiftKey: true,
        bearing: 'down',
        iconName: 'ot-arrow-down',
        axis: 'z',
        sign: -1,
        gridColumn: 1,
      },
    ],
    title: 'Z-axis',
    subtitle: 'Shift + Arrow Keys',
  },
  [HORIZONTAL_PLANE]: {
    controls: [
      {
        keyName: 'ArrowLeft',
        shiftKey: false,
        bearing: 'left',
        iconName: 'ot-arrow-left',
        axis: 'x',
        sign: -1,
        gridColumn: 0,
      },
      {
        keyName: 'ArrowRight',
        shiftKey: false,
        bearing: 'right',
        iconName: 'ot-arrow-right',
        axis: 'x',
        sign: 1,
        gridColumn: 2,
      },
      {
        keyName: 'ArrowUp',
        shiftKey: false,
        bearing: 'back',
        iconName: 'ot-arrow-up',
        axis: 'y',
        sign: 1,
        gridColumn: 1,
      },
      {
        keyName: 'ArrowDown',
        shiftKey: false,
        bearing: 'forward',
        iconName: 'ot-arrow-down',
        axis: 'y',
        sign: -1,
        gridColumn: 1,
      },
    ],
    title: 'X- and Y-axis',
    subtitle: 'Arrow Keys',
  },
}

const DIRECTION_CONTROL_LAYOUT = css`
  flex: 1;
  flex-direction: ${DIRECTION_ROW};
  justify-content: ${JUSTIFY_SPACE_BETWEEN};
  grid-gap: ${SPACING.spacing4};
  min-width: 313px;

  @media (max-width: 750px) {
    flex-direction: ${DIRECTION_COLUMN};
  }
`

const PLANE_BUTTONS_STYLE = css`
  flex-direction: ${DIRECTION_COLUMN};
  justify-content: ${JUSTIFY_CENTER};
  grid-gap: ${SPACING.spacing3};
  min-width: 9.8125rem;

  @media (max-width: 750px) {
    flex-direction: ${DIRECTION_ROW};
    width: 100%;
  }
`

const DEFAULT_BUTTON_STYLE = css`
  display: flex;
  border: 1px ${COLORS.white} solid;
  justify-content: ${JUSTIFY_FLEX_START};
  align-items: ${ALIGN_CENTER};
  background-color: ${COLORS.white};
  color: ${COLORS.black};
  grid-gap: ${SPACING.spacing3};
  padding: ${SPACING.spacing3};

  &:focus {
    background-color: ${COLORS.white};
  }

  &:hover {
    background-color: ${COLORS.white};
    color: ${COLORS.black};
    box-shadow: 0 0 0;
    border: 1px ${COLORS.lightGreyHover} solid;
  }

  &:active {
    background-color: ${COLORS.white};
    color: ${COLORS.blueEnabled};
    border: 1px ${COLORS.blueEnabled} solid;
  }

  &:disabled {
    background-color: ${COLORS.white};
    color: ${COLORS.errorDisabled};
  }
`

const ACTIVE_BUTTON_STYLE = css`
  ${DEFAULT_BUTTON_STYLE}
  color: ${COLORS.blueEnabled};
  border: 1px ${COLORS.blueEnabled} solid;

  &:hover {
    color: ${COLORS.bluePressed};
    border: 1px ${COLORS.bluePressed} solid;
  }
`

interface DirectionControlProps {
  planes: Plane[]
  jog: Jog
  stepSize: StepSize
  initialPlane?: Plane
  buttonColor?: string
}

export function DirectionControl(props: DirectionControlProps): JSX.Element {
  const { planes, jog, stepSize, initialPlane } = props
  const [currentPlane, setCurrentPlane] = React.useState<Plane>(
    initialPlane ?? planes[0]
  )
  const { t } = useTranslation(['robot_calibration'])

  const handlePlane = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setCurrentPlane(event.currentTarget.value as Plane)
    event.currentTarget.blur()
  }

  return (
    <ControlContainer title={t('direction_controls')}>
      <Flex css={DIRECTION_CONTROL_LAYOUT}>
        <Flex css={PLANE_BUTTONS_STYLE}>
          {planes.map((plane: Plane) => {
            const { title, subtitle } = CONTROLS_CONTENTS_BY_PLANE[plane]
            return (
              <PrimaryButton
                key={plane}
                title={plane}
                css={
                  currentPlane === plane
                    ? ACTIVE_BUTTON_STYLE
                    : DEFAULT_BUTTON_STYLE
                }
                value={plane}
                onClick={handlePlane}
              >
                <Icon
                  name={
                    plane === 'vertical' ? 'vertical-plane' : 'horizontal-plane'
                  }
                  height="1.375rem"
                  flex="1 0 auto"
                />
                <Flex
                  flexDirection={DIRECTION_COLUMN}
                  alignItems={ALIGN_FLEX_START}
                  flex="1 1 auto"
                >
                  {title}
                  <StyledText
                    textAlign={TEXT_ALIGN_LEFT}
                    alignSelf={ALIGN_STRETCH}
                    color={COLORS.darkGreyEnabled}
                    css={TYPOGRAPHY.labelRegular}
                  >
                    {subtitle}
                  </StyledText>
                </Flex>
              </PrimaryButton>
            )
          })}
        </Flex>
        <Flex justifyContent={JUSTIFY_CENTER} alignItems={ALIGN_CENTER}>
          <HandleKeypress
            preventDefault
            handlers={[
              ...CONTROLS_CONTENTS_BY_PLANE.vertical.controls,
              ...CONTROLS_CONTENTS_BY_PLANE.horizontal.controls,
            ].map(({ keyName, shiftKey, axis, sign }) => ({
              key: keyName,
              shiftKey,
              onPress: () => {
                setCurrentPlane(shiftKey ? 'vertical' : 'horizontal')
                jog(axis, sign, stepSize)
              },
            }))}
          >
            <ArrowKeys plane={currentPlane} jog={jog} stepSize={stepSize} />
          </HandleKeypress>
        </Flex>
      </Flex>
    </ControlContainer>
  )
}

const ARROW_GRID_STYLES = css`
  display: grid;
  max-width: 8.75rem;
  grid-template-columns: repeat(6, 1fr);
  grid-template-areas:
    '.         .         .         .         .          .         '
    '.         .         ArrowUp   ArrowUp   .          .         '
    'ArrowLeft ArrowLeft ArrowUp   ArrowUp   ArrowRight ArrowRight'
    'ArrowLeft ArrowLeft ArrowDown ArrowDown ArrowRight ArrowRight'
    '.         .         ArrowDown ArrowDown .          .         '
    '.         .         .         .         .          .         ';

  grid-gap: ${SPACING.spacing2};
  align-items: ${ALIGN_CENTER};

  @media (max-width: 750px) {
    max-width: 12.5rem;
  }
`
const ARROW_BUTTON_STYLES = css`
  color: ${COLORS.darkGreyEnabled};
  background-color: ${COLORS.white};

  border: ${BORDERS.lineBorder};
  width: 2.75rem;
  height: 2.75rem;
  display: flex;
  padding: 0;
  align-items: ${ALIGN_CENTER};
  justify-content: ${JUSTIFY_CENTER};
  &:hover {
    background-color: ${COLORS.white};
    color: ${COLORS.darkGreyHover};
    box-shadow: 0 0 0;
    border: 1px ${COLORS.lightGreyHover} solid;
  }

  &:active {
    background-color: ${COLORS.white};
    color: ${COLORS.darkGreyPressed};
    border: 1px ${COLORS.lightGreyHover} solid;
  }

  &:focus {
    background-color: ${COLORS.white};
  }

  &:disabled {
    background-color: ${COLORS.white};
    color: ${COLORS.darkGreyDisabled};
  }

  @media (max-width: 750px) {
    width: 4rem;
    height: 4rem;
  }
`

const BUTTON_ALIGN_BY_KEY_NAME: {
  [keyName: string]: CSSProperties['alignSelf']
} = {
  ArrowUp: ALIGN_FLEX_END,
  ArrowDown: ALIGN_FLEX_START,
  ArrowLeft: ALIGN_CENTER,
  ArrowRight: ALIGN_CENTER,
}
interface ArrowKeysProps {
  plane: Plane
  jog: Jog
  stepSize: StepSize
}

export const ArrowKeys = (props: ArrowKeysProps): JSX.Element => {
  const { plane, jog, stepSize } = props
  const controls = CONTROLS_CONTENTS_BY_PLANE[plane].controls

  return (
    <Box css={ARROW_GRID_STYLES}>
      {controls.map(
        ({ bearing, iconName, axis, sign, gridColumn, keyName }) => (
          <PrimaryButton
            key={bearing}
            onClick={() => jog(axis, sign, stepSize)}
            css={ARROW_BUTTON_STYLES}
            title={bearing}
            gridArea={keyName}
            alignSelf={BUTTON_ALIGN_BY_KEY_NAME[keyName] ?? 'center'}
          >
            <Icon size="1.125rem" name={iconName} />
          </PrimaryButton>
        )
      )}
    </Box>
  )
}
