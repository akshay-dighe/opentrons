"""Pipetting execution handler."""
from typing import cast

import pytest
from decoy import Decoy

from opentrons.types import Mount
from opentrons.hardware_control import API as HardwareAPI
from opentrons.hardware_control.dev_types import PipetteDict

from opentrons.protocol_engine.state import StateView, HardwarePipette
from opentrons.protocol_engine.types import TipGeometry
from opentrons.protocol_engine.execution.pipetting import (
    HardwarePipettingHandler,
    VirtualPipettingHandler,
    create_pipetting_handler,
)
from opentrons.protocol_engine.errors.exceptions import (
    TipNotAttachedError,
    InvalidPipettingVolumeError,
)


@pytest.fixture
def mock_hardware_api(decoy: Decoy) -> HardwareAPI:
    """Get a mock in the shape of a HardwareAPI."""
    return decoy.mock(cls=HardwareAPI)


@pytest.fixture
def mock_state_view(decoy: Decoy) -> StateView:
    """Get a mock in the shape of a StateView."""
    return decoy.mock(cls=StateView)


@pytest.fixture
def hardware_subject(
    mock_state_view: StateView,
    mock_hardware_api: HardwareAPI,
) -> HardwarePipettingHandler:
    """Get a HardwarePipettingHandler test subject."""
    return HardwarePipettingHandler(
        state_view=mock_state_view, hardware_api=mock_hardware_api
    )


async def test_create_pipette_handler(
    decoy: Decoy,
    mock_state_view: StateView,
    mock_hardware_api: HardwareAPI,
) -> None:
    """It should return virtual or real tip handlers depending on config."""
    decoy.when(mock_state_view.config.use_virtual_pipettes).then_return(False)
    assert isinstance(
        create_pipetting_handler(
            state_view=mock_state_view, hardware_api=mock_hardware_api
        ),
        HardwarePipettingHandler,
    )

    decoy.when(mock_state_view.config.use_virtual_pipettes).then_return(True)
    assert isinstance(
        create_pipetting_handler(
            state_view=mock_state_view, hardware_api=mock_hardware_api
        ),
        VirtualPipettingHandler,
    )


@pytest.mark.parametrize(
    ("aspirated_volume", "ready_to_aspirate", "expected"),
    [
        (0.0, True, True),
        (1.0, True, True),
        (1.0, False, False),
    ],
)
def test_get_is_ready_to_aspirate(
    decoy: Decoy,
    mock_state_view: StateView,
    mock_hardware_api: HardwareAPI,
    hardware_subject: HardwarePipettingHandler,
    aspirated_volume: float,
    ready_to_aspirate: bool,
    expected: bool,
) -> None:
    """It should be ready to aspirate if state and HW agree that we're ready."""
    decoy.when(mock_hardware_api.attached_instruments).then_return({})
    decoy.when(mock_state_view.pipettes.get_aspirated_volume("pipette-id")).then_return(
        aspirated_volume
    )
    decoy.when(
        mock_state_view.pipettes.get_hardware_pipette("pipette-id", {})
    ).then_return(
        HardwarePipette(
            mount=Mount.RIGHT,
            config=cast(PipetteDict, {"ready_to_aspirate": ready_to_aspirate}),
        )
    )

    assert hardware_subject.get_is_ready_to_aspirate("pipette-id") == expected


def test_get_is_ready_to_aspirate_raises_no_tip_attached(
    decoy: Decoy,
    mock_state_view: StateView,
    mock_hardware_api: HardwareAPI,
    hardware_subject: HardwarePipettingHandler,
) -> None:
    """Should raise a TipNotAttachedError error."""
    decoy.when(mock_hardware_api.attached_instruments).then_return({})
    decoy.when(mock_state_view.pipettes.get_aspirated_volume("pipette-id")).then_raise(
        TipNotAttachedError()
    )
    decoy.when(
        mock_state_view.pipettes.get_hardware_pipette("pipette-id", {})
    ).then_return(
        HardwarePipette(
            mount=Mount.RIGHT,
            config=cast(PipetteDict, {"ready_to_aspirate": True}),
        )
    )

    with pytest.raises(TipNotAttachedError):
        assert hardware_subject.get_is_ready_to_aspirate("pipette-id")


async def test_dispense_in_place(
    decoy: Decoy,
    mock_state_view: StateView,
    mock_hardware_api: HardwareAPI,
    hardware_subject: HardwarePipettingHandler,
) -> None:
    """It should find the pipette by ID and use it to dispense."""
    decoy.when(mock_hardware_api.attached_instruments).then_return({})
    decoy.when(
        mock_state_view.pipettes.get_hardware_pipette(
            pipette_id="pipette-id",
            attached_pipettes={},
        )
    ).then_return(
        HardwarePipette(
            mount=Mount.RIGHT,
            config=cast(
                PipetteDict,
                {
                    "aspirate_flow_rate": 1.23,
                    "dispense_flow_rate": 4.56,
                    "blow_out_flow_rate": 7.89,
                },
            ),
        )
    )

    result = await hardware_subject.dispense_in_place(
        pipette_id="pipette-id",
        volume=25,
        flow_rate=2.5,
    )

    assert result == 25

    decoy.verify(
        mock_hardware_api.set_flow_rate(
            mount=Mount.RIGHT, aspirate=None, dispense=2.5, blow_out=None
        ),
        await mock_hardware_api.dispense(mount=Mount.RIGHT, volume=25),
        mock_hardware_api.set_flow_rate(
            mount=Mount.RIGHT, aspirate=1.23, dispense=4.56, blow_out=7.89
        ),
    )


async def test_aspirate_in_place(
    decoy: Decoy,
    mock_state_view: StateView,
    mock_hardware_api: HardwareAPI,
    hardware_subject: HardwarePipettingHandler,
) -> None:
    """Should set flow_rate and call hardware_api aspirate."""
    decoy.when(mock_hardware_api.attached_instruments).then_return({})
    decoy.when(
        mock_state_view.pipettes.get_hardware_pipette(
            pipette_id="pipette-id",
            attached_pipettes={},
        )
    ).then_return(
        HardwarePipette(
            mount=Mount.LEFT,
            config=cast(
                PipetteDict,
                {
                    "aspirate_flow_rate": 1.23,
                    "dispense_flow_rate": 4.56,
                    "blow_out_flow_rate": 7.89,
                },
            ),
        )
    )

    result = await hardware_subject.aspirate_in_place(
        pipette_id="pipette-id", volume=25, flow_rate=2.5
    )

    assert result == 25

    decoy.verify(
        mock_hardware_api.set_flow_rate(
            mount=Mount.LEFT, aspirate=2.5, dispense=None, blow_out=None
        ),
        await mock_hardware_api.aspirate(mount=Mount.LEFT, volume=25),
        mock_hardware_api.set_flow_rate(
            mount=Mount.LEFT, aspirate=1.23, dispense=4.56, blow_out=7.89
        ),
    )


async def test_virtual_validate_aspirated_volume_raises(
    decoy: Decoy,
    mock_state_view: StateView,
) -> None:
    """Should validate if trying to aspirate more than the working volume."""
    decoy.when(mock_state_view.pipettes.get_attached_tip("pipette-id")).then_return(
        TipGeometry(length=1, diameter=2, volume=3)
    )

    decoy.when(mock_state_view.pipettes.get_working_volume("pipette-id")).then_return(3)

    decoy.when(mock_state_view.pipettes.get_aspirated_volume("pipette-id")).then_return(
        2
    )

    subject = VirtualPipettingHandler(state_view=mock_state_view)

    with pytest.raises(InvalidPipettingVolumeError):
        await subject.aspirate_in_place(pipette_id="pipette-id", volume=4, flow_rate=1)


async def test_blow_out_in_place(
    decoy: Decoy,
    mock_state_view: StateView,
    mock_hardware_api: HardwareAPI,
    hardware_subject: HardwarePipettingHandler,
) -> None:
    """Should set flow_rate and call hardware_api blow-out."""
    decoy.when(mock_hardware_api.attached_instruments).then_return({})
    decoy.when(
        mock_state_view.pipettes.get_hardware_pipette(
            pipette_id="pipette-id",
            attached_pipettes={},
        )
    ).then_return(
        HardwarePipette(
            mount=Mount.LEFT,
            config=cast(
                PipetteDict,
                {
                    "aspirate_flow_rate": 1.23,
                    "dispense_flow_rate": 4.56,
                    "blow_out_flow_rate": 7.89,
                },
            ),
        )
    )

    await hardware_subject.blow_out_in_place(pipette_id="pipette-id", flow_rate=2.5)

    decoy.verify(
        mock_hardware_api.set_flow_rate(
            mount=Mount.LEFT, aspirate=None, dispense=None, blow_out=2.5
        ),
        await mock_hardware_api.blow_out(mount=Mount.LEFT),
        mock_hardware_api.set_flow_rate(
            mount=Mount.LEFT, aspirate=1.23, dispense=4.56, blow_out=7.89
        ),
    )


def test_get_is_ready_to_aspirate_virtual(
    decoy: Decoy, mock_state_view: StateView
) -> None:
    """Should check if pipette is ready to aspirate."""
    subject = VirtualPipettingHandler(state_view=mock_state_view)

    decoy.when(
        mock_state_view.pipettes.get_aspirated_volume(pipette_id="pipette-id")
    ).then_raise(TipNotAttachedError())

    with pytest.raises(TipNotAttachedError):
        subject.get_is_ready_to_aspirate(pipette_id="pipette-id")

    decoy.when(
        mock_state_view.pipettes.get_aspirated_volume(pipette_id="pipette-id-123")
    ).then_return(0)

    assert subject.get_is_ready_to_aspirate(pipette_id="pipette-id-123") is True


async def test_aspirate_in_place_virtual(
    mock_state_view: StateView, decoy: Decoy
) -> None:
    """Should return the volume."""
    decoy.when(
        mock_state_view.pipettes.get_working_volume(pipette_id="pipette-id")
    ).then_return(3)

    decoy.when(
        mock_state_view.pipettes.get_aspirated_volume(pipette_id="pipette-id")
    ).then_return(1)

    subject = VirtualPipettingHandler(state_view=mock_state_view)

    decoy.when(mock_state_view.pipettes.get_attached_tip("pipette-id")).then_return(
        TipGeometry(length=1, diameter=2, volume=3)
    )

    result = await subject.aspirate_in_place(
        pipette_id="pipette-id", volume=2, flow_rate=5
    )
    assert result == 2


async def test_dispense_in_place_virtual(
    decoy: Decoy, mock_state_view: StateView
) -> None:
    """Should return the volume."""
    subject = VirtualPipettingHandler(state_view=mock_state_view)

    decoy.when(mock_state_view.pipettes.get_attached_tip("pipette-id")).then_return(
        TipGeometry(length=1, diameter=2, volume=3)
    )

    result = await subject.dispense_in_place(
        pipette_id="pipette-id", volume=3, flow_rate=5
    )
    assert result == 3


async def test_validate_tip_attached_in_blow_out(
    mock_state_view: StateView, decoy: Decoy
) -> None:
    """Should raise an error that a tip is not attached."""
    subject = VirtualPipettingHandler(state_view=mock_state_view)

    decoy.when(mock_state_view.pipettes.get_attached_tip("pipette-id")).then_return(
        None
    )

    with pytest.raises(TipNotAttachedError):
        await subject.blow_out_in_place("pipette-id", flow_rate=1)


async def test_validate_tip_attached_in_aspirate(
    mock_state_view: StateView, decoy: Decoy
) -> None:
    """Should raise an error that a tip is not attached."""
    subject = VirtualPipettingHandler(state_view=mock_state_view)

    decoy.when(mock_state_view.pipettes.get_attached_tip("pipette-id")).then_return(
        None
    )

    with pytest.raises(
        TipNotAttachedError, match="Cannot perform aspirate without a tip attached"
    ):
        await subject.aspirate_in_place("pipette-id", volume=20, flow_rate=1)


async def test_validate_tip_attached_in_dispense(
    mock_state_view: StateView, decoy: Decoy
) -> None:
    """Should raise an error that a tip is not attached."""
    subject = VirtualPipettingHandler(state_view=mock_state_view)

    decoy.when(mock_state_view.pipettes.get_attached_tip("pipette-id")).then_return(
        None
    )

    with pytest.raises(
        TipNotAttachedError, match="Cannot perform dispense without a tip attached"
    ):
        await subject.dispense_in_place("pipette-id", volume=20, flow_rate=1)
