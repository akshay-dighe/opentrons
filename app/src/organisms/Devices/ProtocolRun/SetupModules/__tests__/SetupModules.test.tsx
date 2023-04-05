import * as React from 'react'
import { fireEvent } from '@testing-library/react'
import { when } from 'jest-when'
import { i18n } from '../../../../../i18n'
import { renderWithProviders } from '@opentrons/components'
import { SetupModules } from '../index'
import { SetupModulesList } from '../SetupModulesList'
import { SetupModulesMap } from '../SetupModulesMap'
import {
  useRunHasStarted,
  useUnmatchedModulesForProtocol,
} from '../../../hooks'
import { mockTemperatureModule } from '../../../../../redux/modules/__fixtures__'

jest.mock('../../../hooks')
jest.mock('../SetupModulesList')
jest.mock('../SetupModulesMap')

const mockUseRunHasStarted = useRunHasStarted as jest.MockedFunction<
  typeof useRunHasStarted
>
const mockUseUnmatchedModulesForProtocol = useUnmatchedModulesForProtocol as jest.MockedFunction<
  typeof useUnmatchedModulesForProtocol
>
const mockSetupModulesList = SetupModulesList as jest.MockedFunction<
  typeof SetupModulesList
>
const mockSetupModulesMap = SetupModulesMap as jest.MockedFunction<
  typeof SetupModulesMap
>

const MOCK_ROBOT_NAME = 'otie'
const MOCK_RUN_ID = '1'

const render = (props: React.ComponentProps<typeof SetupModules>) => {
  return renderWithProviders(
    <SetupModules
      robotName={MOCK_ROBOT_NAME}
      runId={MOCK_RUN_ID}
      expandLabwareSetupStep={() => jest.fn()}
    />,
    { i18nInstance: i18n }
  )[0]
}

describe('SetupModules', () => {
  let props: React.ComponentProps<typeof SetupModules>
  beforeEach(() => {
    mockSetupModulesList.mockReturnValue(<div>Mock setup modules list</div>)
    mockSetupModulesMap.mockReturnValue(<div>Mock setup modules map</div>)
    when(mockUseRunHasStarted).calledWith(MOCK_RUN_ID).mockReturnValue(false)
    when(mockUseUnmatchedModulesForProtocol)
      .calledWith(MOCK_ROBOT_NAME, MOCK_RUN_ID)
      .mockReturnValue({
        missingModuleIds: [],
        remainingAttachedModules: [],
      })
  })

  it('renders the list and map view buttons', () => {
    const { getByRole } = render(props)
    getByRole('button', { name: 'List View' })
    getByRole('button', { name: 'Map View' })
  })

  it('should render Proceed to labware setup CTA that is enabled', () => {
    const { getByRole } = render(props)
    const button = getByRole('button', { name: 'Proceed to labware setup' })
    expect(button).toBeEnabled()
  })

  it('should render a disabled Proceed to labware setup CTA if the protocol requests modules and they are not all attached to the robot', () => {
    when(mockUseUnmatchedModulesForProtocol)
      .calledWith(MOCK_ROBOT_NAME, MOCK_RUN_ID)
      .mockReturnValue({
        missingModuleIds: ['foo'],
        remainingAttachedModules: [mockTemperatureModule],
      })
    const { getByRole } = render(props)
    const button = getByRole('button', { name: 'Proceed to labware setup' })
    expect(button).toBeDisabled()
  })

  it('should render the SetupModulesList component when clicking List View', () => {
    const { getByRole, getByText } = render(props)
    const button = getByRole('button', { name: 'List View' })
    fireEvent.click(button)
    getByText('Mock setup modules list')
  })

  it('should render the SetupModulesMap component when clicking Map View', () => {
    const { getByRole, getByText } = render(props)
    const button = getByRole('button', { name: 'Map View' })
    fireEvent.click(button)
    getByText('Mock setup modules map')
  })
})
