"""Adaptador DataSphere -> SBL (Fase 2)."""


def dataset_para_ideograma(dataset: dict) -> dict:
    return {
        "texto": dataset.get("description", ""),
        "metadata": {
            "datasphere_dataset_id": dataset.get("id"),
            "tipo": "dataset_academico",
            "autor": dataset.get("author_id"),
            "timestamp": dataset.get("created_at"),
        },
        "embedding": None,
    }
