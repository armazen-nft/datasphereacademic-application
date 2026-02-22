from __future__ import annotations

from dataclasses import asdict

try:
    from flask import Blueprint, jsonify, request
except Exception:  # pragma: no cover - fallback para ambiente sem flask
    Blueprint = None  # type: ignore
    jsonify = None  # type: ignore
    request = None  # type: ignore

from .pentagono import PHI, pentagono


if Blueprint is not None:
    pentagono_routes = Blueprint("sbl_pentagono", __name__)

    @pentagono_routes.route("/", methods=["GET"])
    def listar_fundadores():
        return jsonify(
            {
                "fundadores": pentagono.listar(),
                "total": len(pentagono.fundadores),
                "completo": len(pentagono.fundadores) == 5,
            }
        )

    @pentagono_routes.route("/", methods=["POST"])
    def adicionar_fundador():
        data = request.json or {}
        nome = data.get("nome")

        if not nome:
            return jsonify({"erro": "Nome obrigatório"}), 400

        try:
            ia = pentagono.adicionar(nome)
            return jsonify({"status": "sucesso", "ia": asdict(ia)}), 201
        except ValueError as exc:
            return jsonify({"erro": str(exc)}), 400

    @pentagono_routes.route("/distancia", methods=["POST"])
    def calcular_distancia():
        data = request.json or {}
        ia1 = data.get("ia1")
        ia2 = data.get("ia2")

        try:
            distancia = pentagono.distancia(ia1, ia2)
        except KeyError:
            return jsonify({"erro": "IA não encontrada"}), 404

        return jsonify(
            {
                "ia1": ia1,
                "ia2": ia2,
                "distancia": distancia,
                "razao_aurea": distancia / PHI,
            }
        )
else:
    pentagono_routes = None
