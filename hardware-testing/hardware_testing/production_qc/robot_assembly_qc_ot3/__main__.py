"""Robot assembly QC OT3."""
import argparse
import asyncio
from pathlib import Path

from hardware_testing.data import ui
from hardware_testing.data.csv_report import RESULTS_OVERVIEW_TITLE
from hardware_testing.opentrons_api import helpers_ot3

from .config import TestSection, TestConfig, build_report, TESTS


async def _main(cfg: TestConfig) -> None:
    # BUILD REPORT
    test_name = Path(__file__).parent.name
    report = build_report(test_name)
    ui.print_title(test_name.replace("_", " ").upper())

    # GET INFO
    if not cfg.simulate:
        robot_id = input("enter robot serial number: ")
        operator = input("enter operator name: ")
    else:
        robot_id = "ot3-simulated-A01"
        operator = "simulation"
    software_version = "unknown"  # FIXME: figure out what this should be
    report.set_tag(robot_id)
    report.set_operator(operator)
    report.set_version(software_version)

    # BUILD API
    api = await helpers_ot3.build_async_ot3_hardware_api(
        is_simulating=cfg.simulate,
        pipette_left="p1000_single_v3.3",
        pipette_right="p1000_single_v3.3",
        gripper="GRPV102",
    )

    # RUN TESTS
    for section, test_run in cfg.tests.items():
        ui.print_title(section.value)
        await test_run(api, report, section.value)

    ui.print_title("DONE")

    # SAVE REPORT
    report_path = report.save_to_disk()
    complete_msg = "complete" if report.completed else "incomplete"
    print(f"done, {complete_msg} report -> {report_path}")
    print("Overall Results:")
    for line in report[RESULTS_OVERVIEW_TITLE].lines:
        print(f" - {line.tag}: {line.result}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--simulate", action="store_true")
    # add each test-section as a skippable argument (eg: --skip-gantry)
    for s in TestSection:
        parser.add_argument(f"--skip-{s.value.lower()}", action="store_true")
        parser.add_argument(f"--only-{s.value.lower()}", action="store_true")
    args = parser.parse_args()
    _t_sections = {s: f for s, f in TESTS if getattr(args, f"only_{s.value.lower()}")}
    if _t_sections:
        assert (
            len(list(_t_sections.keys())) < 2
        ), 'use "--only" for just one test, not multiple tests'
    else:
        _t_sections = {
            s: f for s, f in TESTS if not getattr(args, f"skip_{s.value.lower()}")
        }
    _config = TestConfig(simulate=args.simulate, tests=_t_sections)
    asyncio.run(_main(_config))
