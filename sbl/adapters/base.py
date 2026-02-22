"""Base adapter contracts used by SBL integrations."""

from typing import Protocol


class Adapter(Protocol):
    """Minimal adapter protocol placeholder."""

    def invoke(self, payload: dict) -> dict:
        """Execute adapter call and return normalized payload."""
