"""Interface contracts used by SBL components."""

from dataclasses import dataclass


@dataclass(slots=True)
class BridgeRequest:
    """Minimal request contract for bridge operations."""

    source: str
    payload: dict
