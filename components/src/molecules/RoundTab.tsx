import * as React from 'react'
import { css } from 'styled-components'
import { TYPOGRAPHY, BORDERS, SPACING, COLORS } from '../ui-style-constants'
import {
  POSITION_RELATIVE,
  POSITION_ABSOLUTE,
  DISPLAY_BLOCK,
  SIZE_1,
} from '../styles'
import { Btn } from '../primitives'

const defaultTabStyle = css`
  ${TYPOGRAPHY.pSemiBold}
  border-radius: ${BORDERS.radiusSoftCorners} ${BORDERS.radiusSoftCorners} 0 0;
  border-top: ${BORDERS.transparentLineBorder};
  border-left: ${BORDERS.transparentLineBorder};
  border-right: ${BORDERS.transparentLineBorder};
  padding: ${SPACING.spacing3} ${SPACING.spacing4};
  position: ${POSITION_RELATIVE};
`

const inactiveTabStyle = css`
  color: ${COLORS.darkGreyEnabled};

  &:hover {
    color: ${COLORS.darkGreyEnabled};
    background-color: ${COLORS.fundamentalsBackgroundShade};
  }
`

const currentTabStyle = css`
  ${TYPOGRAPHY.pSemiBold}
  background-color: ${COLORS.white};
  border-top: ${BORDERS.lineBorder};
  border-left: ${BORDERS.lineBorder};
  border-right: ${BORDERS.lineBorder};
  color: ${COLORS.blueEnabled};

  /* extend below the tab when active to flow into the content */
  &:after {
    position: ${POSITION_ABSOLUTE};
    display: ${DISPLAY_BLOCK};
    content: '';
    background-color: ${COLORS.white};
    top: 100;
    left: 0;
    height: ${SIZE_1};
    width: 100%;
  }
`

interface RoundTabProps extends React.ComponentProps<typeof Btn> {
  isCurrent: boolean
}
export function RoundTab({
  isCurrent,
  children,
  ...restProps
}: RoundTabProps): JSX.Element {
  return (
    <Btn
      {...restProps}
      css={
        isCurrent
          ? css`
              ${defaultTabStyle}
              ${currentTabStyle}
            `
          : css`
              ${defaultTabStyle}
              ${inactiveTabStyle}
            `
      }
    >
      {children}
    </Btn>
  )
}
