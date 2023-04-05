import * as React from 'react'
import { renderWithProviders } from '@opentrons/components'
import { useCreateLiveCommandMutation } from '@opentrons/react-api-client'
import { fireEvent } from '@testing-library/react'
import { i18n } from '../../../i18n'
import { mockHeaterShaker } from '../../../redux/modules/__fixtures__'
import { HeaterShakerSlideout } from '../HeaterShakerSlideout'

jest.mock('@opentrons/react-api-client')

const mockUseLiveCommandMutation = useCreateLiveCommandMutation as jest.MockedFunction<
  typeof useCreateLiveCommandMutation
>

const render = (props: React.ComponentProps<typeof HeaterShakerSlideout>) => {
  return renderWithProviders(<HeaterShakerSlideout {...props} />, {
    i18nInstance: i18n,
  })[0]
}

describe('HeaterShakerSlideout', () => {
  let props: React.ComponentProps<typeof HeaterShakerSlideout>
  let mockCreateLiveCommand = jest.fn()

  beforeEach(() => {
    mockCreateLiveCommand = jest.fn()
    mockCreateLiveCommand.mockResolvedValue(null)
    mockUseLiveCommandMutation.mockReturnValue({
      createLiveCommand: mockCreateLiveCommand,
    } as any)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('renders correct title and body for heatershaker set temperature', () => {
    props = {
      module: mockHeaterShaker,
      isExpanded: true,
      onCloseClick: jest.fn(),
    }
    const { getByText } = render(props)

    getByText('Set Temperature for Heater-Shaker Module GEN1')
    getByText(
      'Set target temperature. This module actively heats but cools passively to room temperature.'
    )
    getByText('Confirm')
  })

  it('renders the button and it is not clickable until there is something in form field for set temp', () => {
    props = {
      module: mockHeaterShaker,
      isExpanded: true,
      onCloseClick: jest.fn(),
    }
    const { getByRole, getByTestId } = render(props)
    const button = getByRole('button', { name: 'Confirm' })
    const input = getByTestId('heaterShakerModuleV1_setTemp')
    fireEvent.change(input, { target: { value: '40' } })
    expect(button).toBeEnabled()
    fireEvent.click(button)

    expect(mockCreateLiveCommand).toHaveBeenCalledWith({
      command: {
        commandType: 'heaterShaker/setTargetTemperature',
        params: {
          moduleId: 'heatershaker_id',
          celsius: 40,
        },
      },
    })
    expect(button).not.toBeEnabled()
  })

  it('renders the exit button and when clicked, deletes the value input', () => {
    props = {
      module: mockHeaterShaker,
      isExpanded: true,
      onCloseClick: jest.fn(),
    }
    const { getByLabelText, getByTestId } = render(props)
    const button = getByLabelText('exit')
    const input = getByTestId('heaterShakerModuleV1_setTemp')
    fireEvent.change(input, { target: { value: '40' } })
    fireEvent.click(button)

    expect(props.onCloseClick).toHaveBeenCalled()
    expect(input).not.toHaveValue()
  })
})
