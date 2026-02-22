from backend.sbl.pentagono import PHI, PentagonoSBL


def test_adicionar_fundadores_limite_cinco():
    p = PentagonoSBL()
    for nome in ["claude", "gpt", "qwen", "grok", "deepseek"]:
        p.adicionar(nome)

    assert len(p.fundadores) == 5

    try:
        p.adicionar("extra")
        assert False, "Deveria falhar com pentágono completo"
    except ValueError as exc:
        assert "completo" in str(exc)


def test_distancia_existente_e_positiva():
    p = PentagonoSBL()
    p.adicionar("claude")
    p.adicionar("gpt")

    d = p.distancia("claude", "gpt")

    assert d > 0
    assert d / PHI > 0
