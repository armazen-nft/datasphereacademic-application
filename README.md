# Datasphere Academic

Mudança de rumo aplicada: foco em **MVP funcional** ao invés de escopo amplo.

## MVP atual

- 1 endpoint funcional de validação: `POST /api/validate`
- 3 provedores de IA: OpenAI, Anthropic e Gemini
- Consenso simples por maioria
- Fallback simulado quando API key não está configurada

## Rodando backend

```bash
cd backend
npm install
npm run dev
```

Servidor padrão: `http://localhost:3001`

## Exemplo rápido

```bash
curl -X POST http://localhost:3001/api/validate \
  -H 'Content-Type: application/json' \
  -d '{
    "title":"Sample",
    "content":"Este é um texto de exemplo com mais de duzentos caracteres para exercitar o endpoint de validação inicial. O objetivo é obter três avaliações independentes de provedores de IA e consolidar um consenso simples para decidir entre aprovação inicial ou necessidade de revisão."
  }'
```
