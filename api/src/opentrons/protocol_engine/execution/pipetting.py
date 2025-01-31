"""Pipetting command handling."""
from typing import Optional, Iterator
from typing_extensions import Protocol as TypingProtocol
from contextlib import contextmanager

from opentrons.hardware_control import HardwareControlAPI

from ..state import StateView, HardwarePipette


class PipettingHandler(TypingProtocol):
    """Liquid handling commands."""

    def get_is_ready_to_aspirate(self, pipette_id: str) -> bool:
        """Get whether a pipette is ready to aspirate."""

    async def prepare_for_aspirate(self, pipette_id: str) -> None:
        """Prepare for pipette aspiration."""

    async def aspirate_in_place(
        self,
        pipette_id: str,
        volume: float,
        flow_rate: float,
    ) -> float:
        """Set flow-rate and aspirate."""

    async def dispense_in_place(
        self,
        pipette_id: str,
        volume: float,
        flow_rate: float,
    ) -> float:
        """Set flow-rate and dispense."""

    async def blow_out_in_place(
        self,
        pipette_id: str,
        flow_rate: float,
    ) -> None:
        """Set flow rate and blow-out."""


class HardwarePipettingHandler(PipettingHandler):
    """Liquid handling, using the Hardware API.""" ""

    def __init__(self, state_view: StateView, hardware_api: HardwareControlAPI) -> None:
        """Initialize a PipettingHandler instance."""
        self._state_view = state_view
        self._hardware_api = hardware_api

    def get_is_ready_to_aspirate(self, pipette_id: str) -> bool:
        """Get whether a pipette is ready to aspirate."""
        hw_pipette = self._state_view.pipettes.get_hardware_pipette(
            pipette_id=pipette_id,
            attached_pipettes=self._hardware_api.attached_instruments,
        )
        return (
            self._state_view.pipettes.get_aspirated_volume(pipette_id) is not None
            and hw_pipette.config["ready_to_aspirate"]
        )

    async def prepare_for_aspirate(self, pipette_id: str) -> None:
        """Prepare for pipette aspiration."""
        hw_mount = self._state_view.pipettes.get_mount(pipette_id).to_hw_mount()
        await self._hardware_api.prepare_for_aspirate(mount=hw_mount)

    async def aspirate_in_place(
        self,
        pipette_id: str,
        volume: float,
        flow_rate: float,
    ) -> float:
        """Set flow-rate and aspirate."""
        # get mount and config data from state and hardware controller
        hw_pipette = self._state_view.pipettes.get_hardware_pipette(
            pipette_id=pipette_id,
            attached_pipettes=self._hardware_api.attached_instruments,
        )
        with self._set_flow_rate(pipette=hw_pipette, aspirate_flow_rate=flow_rate):
            await self._hardware_api.aspirate(mount=hw_pipette.mount, volume=volume)

        return volume

    async def dispense_in_place(
        self,
        pipette_id: str,
        volume: float,
        flow_rate: float,
    ) -> float:
        """Dispense liquid without moving the pipette."""
        hw_pipette = self._state_view.pipettes.get_hardware_pipette(
            pipette_id=pipette_id,
            attached_pipettes=self._hardware_api.attached_instruments,
        )

        with self._set_flow_rate(pipette=hw_pipette, dispense_flow_rate=flow_rate):
            await self._hardware_api.dispense(mount=hw_pipette.mount, volume=volume)

        return volume

    async def blow_out_in_place(
        self,
        pipette_id: str,
        flow_rate: float,
    ) -> None:
        """Set flow rate and blow-out."""
        # get mount and config data from state and hardware controller
        hw_pipette = self._state_view.pipettes.get_hardware_pipette(
            pipette_id=pipette_id,
            attached_pipettes=self._hardware_api.attached_instruments,
        )
        with self._set_flow_rate(pipette=hw_pipette, blow_out_flow_rate=flow_rate):
            await self._hardware_api.blow_out(mount=hw_pipette.mount)

    @contextmanager
    def _set_flow_rate(
        self,
        pipette: HardwarePipette,
        aspirate_flow_rate: Optional[float] = None,
        dispense_flow_rate: Optional[float] = None,
        blow_out_flow_rate: Optional[float] = None,
    ) -> Iterator[None]:
        """Context manager for setting flow rate before calling aspirate, dispense, or blowout."""
        original_aspirate_rate = pipette.config["aspirate_flow_rate"]
        original_dispense_rate = pipette.config["dispense_flow_rate"]
        original_blow_out_rate = pipette.config["blow_out_flow_rate"]
        self._hardware_api.set_flow_rate(
            pipette.mount,
            aspirate=aspirate_flow_rate,
            dispense=dispense_flow_rate,
            blow_out=blow_out_flow_rate,
        )
        try:
            yield
        finally:
            self._hardware_api.set_flow_rate(
                pipette.mount,
                aspirate=original_aspirate_rate,
                dispense=original_dispense_rate,
                blow_out=original_blow_out_rate,
            )


class VirtualPipettingHandler(PipettingHandler):
    """Liquid handling, using the virtual pipettes.""" ""

    _state_view: StateView

    def __init__(
        self,
        state_view: StateView,
    ) -> None:
        """Initialize a PipettingHandler instance."""
        self._state_view = state_view

    def get_is_ready_to_aspirate(self, pipette_id: str) -> bool:
        """Get whether a pipette is ready to aspirate."""
        return self._state_view.pipettes.get_aspirated_volume(pipette_id) is not None

    async def prepare_for_aspirate(self, pipette_id: str) -> None:
        """Virtually prepare to aspirate (no-op)."""

    async def aspirate_in_place(
        self,
        pipette_id: str,
        volume: float,
        flow_rate: float,
    ) -> float:
        """Virtually aspirate (no-op)."""
        return volume

    async def dispense_in_place(
        self,
        pipette_id: str,
        volume: float,
        flow_rate: float,
    ) -> float:
        """Virtually dispense (no-op)."""
        return volume

    async def blow_out_in_place(
        self,
        pipette_id: str,
        flow_rate: float,
    ) -> None:
        """Virtually blow out (no-op)."""


def create_pipetting_handler(
    state_view: StateView, hardware_api: HardwareControlAPI
) -> PipettingHandler:
    """Create a pipetting handler."""
    return (
        HardwarePipettingHandler(state_view=state_view, hardware_api=hardware_api)
        if state_view.config.use_virtual_pipettes is False
        else VirtualPipettingHandler(state_view=state_view)
    )
