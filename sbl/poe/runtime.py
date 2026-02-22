"""PoE runtime placeholders."""


def build_proof(payload: dict) -> dict:
    """Return a minimal proof structure for the given payload."""
    return {"proof": "pending", "payload": payload}
