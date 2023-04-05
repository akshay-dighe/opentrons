"""Test for Calibration Set Up Position Implementation."""
import pytest
from decoy import Decoy

from opentrons.protocol_engine.commands.calibration.move_to_maintenance_position import (
    MoveToMaintenancePositionParams,
    MoveToMaintenancePositionImplementation,
    MoveToMaintenancePositionResult,
)

from opentrons.hardware_control import HardwareControlAPI
from opentrons.protocol_engine.state import StateView
from opentrons.types import Point, MountType, Mount


@pytest.fixture
def subject(
    state_view: StateView, hardware_api: HardwareControlAPI
) -> MoveToMaintenancePositionImplementation:
    """Get command subject to test."""
    return MoveToMaintenancePositionImplementation(
        state_view=state_view, hardware_api=hardware_api
    )


async def test_calibration_move_to_location_implementation(
    decoy: Decoy,
    subject: MoveToMaintenancePositionImplementation,
    state_view: StateView,
    hardware_api: HardwareControlAPI,
) -> None:
    """Command should get a move to target location and critical point and should verify move_to call."""
    params = MoveToMaintenancePositionParams(mount=MountType.LEFT)

    decoy.when(
        state_view.labware.get_calibration_coordinates(offset=Point(y=10, z=400))
    ).then_return(Point(x=1, y=2, z=3))

    result = await subject.execute(params=params)
    assert result == MoveToMaintenancePositionResult()

    decoy.verify(
        await hardware_api.home(),
        times=1,
    )

    decoy.verify(
        await hardware_api.move_to(mount=Mount.LEFT, abs_position=Point(x=1, y=2, z=3)),
        times=1,
    )
