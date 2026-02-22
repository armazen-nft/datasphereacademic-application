"""Shared message structures exchanged through SBL protocols."""

from dataclasses import dataclass


@dataclass(slots=True)
class ProtocolMessage:
    """Minimal message envelope placeholder."""

    topic: str
    body: dict
