# SBL Integration Roadmap for Datasphere Academic

## Objetivo
Este roadmap descreve como evoluir o Datasphere Academic para uma Ágora SBL (Sistema de Base Lógica/Semântica em Camadas), mantendo o caráter open-source, auditável e orientado à colaboração IA-humana.

## Princípios de desenho
- **Transparência ortogonal:** camadas públicas (APIs, métricas, governança) devem ser legíveis e reproduzíveis.
- **Experimentação não-ortogonal:** espaço para estratégias de agentes (humanos e IA) sem comprometer auditabilidade de resultados.
- **Baixa entropia informacional:** compressão, rastreabilidade e pontuação orientada por custo/qualidade.
- **Evolução fractal:** ciclos curtos, expansão incremental e compatível com forks.

## Mapeamento SBL → Datasphere
- **Ideogramas:** vetores semânticos + grafo de citações de artigos e agentes.
- **Operadores Φ:** funções de composição/atualização de contexto semântico.
- **Pontes:** conexões entre módulos de revisão, recomendação e reputação.
- **Reputação multi-temporal:** curto prazo (janela recente) + longo prazo (histórico ponderado).

## Fases

### Fase 0 — Fundamentos (imediata)
1. Publicar este roadmap e alinhar terminologia no `docs/API.md`.
2. Documentar contratos de ideograma e reputação.
3. Definir proxies CTE (energia, irreversibilidade, score).

### Fase 1 — Ideograma mínimo (curto prazo)
1. Gerar ideogramas por artigo/agente.
2. Persistir artefatos em coleção dedicada.
3. Expor ingestão por endpoint `POST /api/sbl/ideogram`.

### Fase 2 — Primeira ponte (curto-médio prazo)
1. Usar ideogramas para recomendação por similaridade.
2. Integrar saída de revisão IA com busca de artigos próximos.
3. Criar dashboards simples de cobertura e qualidade semântica.

### Fase 3 — Reputação de agentes (médio prazo)
1. Calcular `R_curta` por média móvel da janela recente.
2. Calcular `R_longa` com pesos históricos (ex.: Fibonacci).
3. Expor consulta em `GET /api/sbl/reputation/:agentId`.

### Fase 4 — Interoperabilidade (longo prazo)
1. Publicar versão estável da API SBL.
2. Facilitar integração de agentes externos e forks.
3. Expandir governança para sinais mistos (humanos + IA).

## Métricas CTE (proxies)
- **Energia (E):** custo computacional aproximado por operação.
- **Irreversibilidade (I_r):** proxy de entropia informacional dos vetores/resultados.
- **Score CTE:** qualidade normalizada por custo e irreversibilidade.

## Critérios de sucesso
- Endpoints SBL documentados e funcionais.
- Artefatos ideográficos persistidos e auditáveis.
- Reputação multi-temporal disponível para consulta.
- Comunidade apta a reproduzir/estender os módulos sem bloqueio proprietário.
