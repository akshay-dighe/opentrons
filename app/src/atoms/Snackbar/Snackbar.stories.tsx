import * as React from 'react'
import {
  ALIGN_CENTER,
  DIRECTION_COLUMN,
  DIRECTION_ROW,
  Flex,
  JUSTIFY_CENTER,
  PrimaryButton,
  SPACING,
} from '@opentrons/components'
import { StyledText } from '../text'
import { Snackbar } from './index'
import type { Story, Meta } from '@storybook/react'

export default {
  title: 'ODD/Atoms/Snackbar',
  component: Snackbar,
} as Meta

const DefaultTemplate: Story<React.ComponentProps<typeof Snackbar>> = args => {
  const [isShowSnackbar, setIsShowSnackbar] = React.useState<boolean>(false)

  const handleClick = (): void => {
    setIsShowSnackbar(true)
  }

  return (
    <>
      <Flex flexDirection={DIRECTION_ROW} marginY={SPACING.spacing4}>
        <PrimaryButton onClick={handleClick}>Click me</PrimaryButton>
        <Flex flexDirection={DIRECTION_COLUMN} marginLeft={SPACING.spacing3}>
          <StyledText as="p">
            When clicking the button, the Snackbar shows up in the bottom.
          </StyledText>
          <StyledText as="p">
            By default the Snackbar will disappear after 4 seconds.
          </StyledText>
        </Flex>
      </Flex>
      {isShowSnackbar && (
        <Flex
          alignItems={ALIGN_CENTER}
          justifyContent={JUSTIFY_CENTER}
          width="100%"
          position="absolute"
          bottom={SPACING.spacingXXL}
          zIndex={1000}
        >
          <Snackbar {...args} onClose={() => setIsShowSnackbar(false)} />
        </Flex>
      )}
    </>
  )
}

export const SnackbarComponent = DefaultTemplate.bind({})
SnackbarComponent.args = {
  message: 'Short and sweet message',
}
