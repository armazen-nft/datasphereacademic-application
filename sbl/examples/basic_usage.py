"""Basic usage example validating canonical SBL imports."""

from sbl.core.bridge import SemanticBridge
from sbl.poe.runtime import build_proof


def run() -> dict:
    """Run a basic flow that exercises package imports and placeholders."""
    bridge = SemanticBridge()
    proof = build_proof({"status": bridge.status()})
    return proof


if __name__ == "__main__":
    print(run())
