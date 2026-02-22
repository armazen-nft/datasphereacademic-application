"""Tests for validating SBL package structure and imports."""

from sbl.adapters.base import Adapter
from sbl.core.bridge import SemanticBridge
from sbl.examples.basic_usage import run


def test_bridge_status() -> None:
    """Ensure bridge placeholder returns expected status."""
    assert SemanticBridge().status() == "ready"


def test_example_flow() -> None:
    """Ensure the example flow returns the expected proof marker."""
    assert run()["proof"] == "pending"


def test_adapter_protocol_has_invoke() -> None:
    """Ensure adapter protocol exposes the canonical invoke method."""
    assert "invoke" in Adapter.__dict__
