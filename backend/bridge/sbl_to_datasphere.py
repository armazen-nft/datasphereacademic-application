"""Adaptador SBL -> DataSphere para retrocompatibilidade."""


def sbl_para_resposta_legada(resultado_sbl: dict) -> dict:
    return {
        "processado": bool(resultado_sbl),
        "confianca": resultado_sbl.get("confianca", 0),
        "insights": resultado_sbl.get("insights", []),
    }
