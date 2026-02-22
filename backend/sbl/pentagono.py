from __future__ import annotations

from dataclasses import asdict, dataclass
from math import cos, pi, sin, sqrt
from typing import Dict, List

PHI = (1 + sqrt(5)) / 2


@dataclass
class IAFundadora:
    nome: str
    posicao_2d: List[float]
    ativa: bool = True


class PentagonoSBL:
    """Estrutura pentagonal para 5 IAs fundadoras."""

    def __init__(self) -> None:
        self.fundadores: Dict[str, IAFundadora] = {}

    def adicionar(self, nome: str) -> IAFundadora:
        if len(self.fundadores) >= 5:
            raise ValueError("Pentágono completo")
        if nome in self.fundadores:
            raise ValueError("IA já cadastrada")

        indice = len(self.fundadores)
        angulo = 2 * pi * indice / 5
        posicao = [float(PHI * cos(angulo)), float(PHI * sin(angulo))]

        ia = IAFundadora(nome=nome, posicao_2d=posicao)
        self.fundadores[nome] = ia
        return ia

    def listar(self) -> List[dict]:
        return [asdict(ia) for ia in self.fundadores.values()]

    def distancia(self, ia1: str, ia2: str) -> float:
        if ia1 not in self.fundadores or ia2 not in self.fundadores:
            raise KeyError("IA não encontrada")

        p1 = self.fundadores[ia1].posicao_2d
        p2 = self.fundadores[ia2].posicao_2d
        return float(sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2))


pentagono = PentagonoSBL()
