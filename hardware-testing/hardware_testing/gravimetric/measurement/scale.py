"""Scale."""
from dataclasses import dataclass
from time import time
from typing import Union

from hardware_testing.drivers import (
    list_ports_and_select,
    RadwagScale,
    SimRadwagScale,
)
from hardware_testing.drivers.radwag.commands import (
    RadwagWorkingMode,
    RadwagFilter,
    RadwagValueRelease,
)


@dataclass
class ScaleConfig:
    """Scale Config."""

    continuous_transmission: bool
    automatic_internal_adjustment: bool
    working_mode: RadwagWorkingMode
    filter: RadwagFilter
    value_release: RadwagValueRelease
    tare: float


DEFAULT_SCALE_CONFIG = ScaleConfig(
    continuous_transmission=False,
    automatic_internal_adjustment=False,
    working_mode=RadwagWorkingMode.weighing,
    filter=RadwagFilter.very_fast,
    value_release=RadwagValueRelease.fast,
    tare=0.0,
)


@dataclass
class ScaleReading:
    """Scale Reading."""

    grams: float
    stable: bool
    time: float


class Scale:
    """Scale Class."""

    def __init__(self, scale: Union[SimRadwagScale, RadwagScale]) -> None:
        """Scale Class."""
        self._scale = scale

    @classmethod
    def build(cls, simulate: bool) -> "Scale":
        """Build."""
        if simulate:
            return Scale(scale=SimRadwagScale())
        else:
            return Scale(scale=RadwagScale.create(cls.find_port()))

    @classmethod
    def find_port(cls) -> str:
        """Find port."""
        return list_ports_and_select(device_name="scale")

    @property
    def is_simulator(self) -> bool:
        """Is simulator."""
        return isinstance(self._scale, SimRadwagScale)

    def set_simulation_mass(self, mass: float) -> None:
        """Set simulation mass."""
        assert self.is_simulator
        self._scale.set_simulation_mass(mass)  # type: ignore[union-attr]

    def add_simulation_mass(self, mass: float) -> None:
        """Add simulation mass."""
        assert self.is_simulator
        self._scale.set_simulation_mass(self._scale.sim_mass + mass)  # type: ignore[union-attr]

    def connect(self) -> None:
        """Scale connect."""
        self._scale.connect()

    def disconnect(self) -> None:
        """Scale connect."""
        self._scale.disconnect()

    def initialize(self, cfg: ScaleConfig = DEFAULT_SCALE_CONFIG) -> None:
        """Initialize."""
        # Some Radwag settings cannot be controlled remotely.
        # Listed below are the things the must be done using the touchscreen:
        #   1) Set profile to USER
        #   2) Set screensaver to NONE
        self._scale.continuous_transmission(enable=cfg.continuous_transmission)
        self._scale.automatic_internal_adjustment(
            enable=cfg.automatic_internal_adjustment
        )
        self._scale.working_mode(mode=cfg.working_mode)
        self._scale.filter(cfg.filter)
        self._scale.value_release(cfg.value_release)
        self.tare(cfg.tare)

    def tare(self, grams: float) -> None:
        """Tare."""
        self._scale.set_tare(grams)

    def read_serial_number(self) -> str:
        """Read serial number."""
        return self._scale.read_serial_number()

    def calibrate(self) -> None:
        """Calibrate."""
        self._scale.internal_adjustment()

    def read(self) -> ScaleReading:
        """Read."""
        g, s = self._scale.read_mass()
        return ScaleReading(grams=g, stable=s, time=time())
