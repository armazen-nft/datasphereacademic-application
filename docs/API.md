# API do Datasphere Academic (MVP radical)

Este documento reflete a mudança de rumo para um MVP funcional: **1 endpoint de validação com 3 provedores de IA e consenso simples**.

## Base URL local

`http://localhost:3001/api`

## Endpoint principal

### `POST /validate`

Executa validação inicial de paper via OpenAI + Anthropic + Gemini.

#### Request body

```json
{
  "title": "Optional title",
  "abstract": "Optional abstract",
  "content": "Texto completo do paper com no mínimo 200 caracteres"
}
```

#### Response body (200)

```json
{
  "success": true,
  "data": {
    "consensus": "approved",
    "confidence": 67,
    "evaluations": [
      {
        "provider": "openai",
        "verdict": "approved",
        "score": 72,
        "rationale": "...",
        "simulated": false
      }
    ],
    "summary": "Consensus=approved; confidence=67%; providers=[...]"
  }
}
```

#### Regras

- `content` é obrigatório e precisa ter pelo menos 200 caracteres.
- Cada provider deve retornar `verdict`, `score` e `rationale`.
- Se a chave de API estiver ausente (ou chamada falhar), o provider entra em modo `simulated`.
- Consenso atual: maioria simples entre `approved` e `revision_needed`.

## Variáveis de ambiente para o MVP

- `OPENAI_API_KEY`
- `OPENAI_MODEL` (opcional, default `gpt-4o-mini`)
- `ANTHROPIC_API_KEY`
- `ANTHROPIC_MODEL` (opcional, default `claude-3-5-sonnet-latest`)
- `GEMINI_API_KEY`
- `GEMINI_MODEL` (opcional, default `gemini-1.5-flash`)
