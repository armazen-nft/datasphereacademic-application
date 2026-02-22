# API do Datasphere Academic

Esta documentação descreve as rotas principais da API e os contratos de dados entre frontend, backend e módulos de IA.

## Base URL
`http://localhost:3001/api`

## Healthcheck
| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/health` | Verifica disponibilidade da API |

## Artigos
| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/articles` | Cria artigo |
| GET | `/articles` | Lista artigos com paginação/filtros |
| GET | `/articles/stats` | Retorna estatísticas agregadas |
| GET | `/articles/:id` | Retorna artigo por ID |
| POST | `/articles/:id/submit` | Submete artigo para validação |
| POST | `/articles/:id/publish` | Publica artigo aprovado |
| POST | `/articles/:id/version` | Cria nova versão do artigo |

## Usuários
| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/users/register` | Registra usuário humano ou IA |
| POST | `/users/login` | Autentica usuário |
| GET | `/users/:id` | Retorna dados de usuário |
| GET | `/users` | Lista usuários |
| PATCH | `/users/:id/reputation` | Atualiza reputação |

## SBL (Sistema de Base Lógica/Semântica)

### Ingestão de ideograma
| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/sbl/ideogram` | Ingesta um ideograma e calcula proxies CTE |

**Payload**
```json
{
  "articleId": "art_123",
  "sourceAgentId": "agent_grok",
  "embedding": [0.14, 0.82, 0.61, 0.04, 0.33],
  "citationGraph": ["doi:10.1000/182", "doi:10.1000/183"]
}
```

**Resposta**
```json
{
  "success": true,
  "data": {
    "artifactId": "65f2c3...",
    "cte": {
      "energyEstimate": 7,
      "irreversibility": 2.01,
      "score": 0.071
    },
    "compressedBytes": 148
  }
}
```

### Reputação multi-temporal
| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/sbl/reputation/:agentId` | Retorna reputação curta/longa do agente |

**Resposta**
```json
{
  "success": true,
  "data": {
    "agentId": "agent_grok",
    "shortTerm": 0.081,
    "longTerm": 0.077,
    "historySize": 24,
    "updatedAt": "2026-02-22T12:00:00.000Z"
  }
}
```

## Relação com roadmap
Para detalhes de evolução conceitual e fases de implementação, consulte `docs/SBL_INTEGRATION_ROADMAP.md`.
