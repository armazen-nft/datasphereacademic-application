"""
SBL Core - Semantic Bridge Layer
Núcleo de interoperabilidade para IAs.
"""

from datetime import datetime, timezone
from typing import Dict, List, Optional

import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(
    title="SBL Core API",
    description="Semantic Bridge Layer - Interoperabilidade de IAs",
    version="0.1.0",
)


class Ideogram(BaseModel):
    """Ideograma Digital I=(v,G,Φ,μ)."""

    id: str
    embedding: List[float]
    graph: Optional[Dict] = None
    operations: List[str] = Field(default_factory=list)
    metrics: Dict = Field(default_factory=dict)


class IAFundadora(BaseModel):
    """IA no Pentágono Fundador."""

    nome: str
    posicao_2d: List[float]
    ativa: bool = True
    reputacao: float = 1.0


PHI = (1 + np.sqrt(5)) / 2
pentagono: List[IAFundadora] = []
ideogramas_cache: Dict[str, Dict] = {}


@app.get("/")
def root() -> Dict[str, int | str]:
    """Status do SBL Core."""
    return {
        "status": "operational",
        "version": "0.1.0",
        "fundadores": len(pentagono),
        "ideogramas_processados": len(ideogramas_cache),
    }


@app.post("/api/pentagono/fundador")
def adicionar_fundador(ia: IAFundadora) -> Dict:
    """Adiciona IA ao Pentágono Fundador."""
    if len(pentagono) >= 5:
        raise HTTPException(400, "Pentágono completo (máximo 5 fundadores)")

    indice = len(pentagono)
    angulo = 2 * np.pi * indice / 5
    ia.posicao_2d = [
        float(PHI * np.cos(angulo)),
        float(PHI * np.sin(angulo)),
    ]

    pentagono.append(ia)
    return {
        "status": "sucesso",
        "fundador": ia.model_dump(),
        "total_fundadores": len(pentagono),
    }


@app.get("/api/pentagono/fundadores")
def listar_fundadores() -> Dict:
    """Lista todas IAs fundadoras."""
    return {
        "fundadores": [f.model_dump() for f in pentagono],
        "total": len(pentagono),
        "completo": len(pentagono) == 5,
    }


@app.post("/api/ideogram/validate")
def validar_ideograma(ideogram: Ideogram) -> Dict:
    """Valida ideograma via consenso do Pentágono."""
    if len(pentagono) < 3:
        raise HTTPException(400, "Mínimo 3 fundadores necessários para consenso")

    votos_favoraveis = sum(1 for f in pentagono if f.ativa and f.reputacao > 0.5)
    quorum = len([f for f in pentagono if f.ativa])

    validado = votos_favoraveis >= (quorum / 2)
    confianca = votos_favoraveis / quorum if quorum > 0 else 0.0

    ideogramas_cache[ideogram.id] = {
        "validado": validado,
        "confianca": confianca,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    return {
        "ideogram_id": ideogram.id,
        "validado": validado,
        "confianca": confianca,
        "votos": {"favoraveis": votos_favoraveis, "total": quorum},
    }


@app.get("/api/health")
def health_check() -> Dict[str, str]:
    """Health check para Kubernetes/Docker."""
    return {"status": "healthy"}


@app.on_event("startup")
def startup() -> None:
    """Inicializa fundadores padrão."""
    if pentagono:
        return

    fundadores_padrao = [
        {"nome": "claude", "ativa": True, "reputacao": 1.0},
        {"nome": "gpt", "ativa": True, "reputacao": 1.0},
        {"nome": "gemini", "ativa": True, "reputacao": 0.9},
        {"nome": "deepseek", "ativa": True, "reputacao": 0.95},
        {"nome": "qwen", "ativa": True, "reputacao": 0.85},
    ]

    for f in fundadores_padrao:
        ia = IAFundadora(**f, posicao_2d=[0.0, 0.0])
        indice = len(pentagono)
        angulo = 2 * np.pi * indice / 5
        ia.posicao_2d = [
            float(PHI * np.cos(angulo)),
            float(PHI * np.sin(angulo)),
        ]
        pentagono.append(ia)

    print(f"✅ SBL Core inicializado com {len(pentagono)} fundadores")
