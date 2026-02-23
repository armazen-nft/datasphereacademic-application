# Análise de Integração: Lua no Contexto SBL

## Síntese

A Lua é uma boa candidata para a camada de extensão do Datasphere Academic por combinar:
- baixo footprint;
- boa interoperabilidade;
- facilidade de auditoria;
- alinhamento com princípios de soberania e simplicidade estrutural.

## Casos de uso prioritários

1. **Operadores customizados de ideogramas**
   - agregação, transformação e validação definidas por script.
2. **Bridge entre parceiros heterogêneos**
   - tradução de entrada/saída por provedor.
3. **Métricas customizadas**
   - cálculos de consenso/coerência em runtime.
4. **Mocks para desenvolvimento**
   - simulação de parceiros sem custo de API externa.

## Requisitos mínimos de segurança

- Sandbox sem I/O de arquivo e sem shell.
- Timeout hard por execução.
- Limite de memória por script.
- Validação estática de padrões proibidos.
- Registro de hash + autor + versão + trilha de auditoria.

## Estratégia de adoção no backend atual (Node/TS)

- Introduzir interface de engine (`ScriptEngine`) e iniciar com engine Lua.
- Criar endpoint dedicado para execução de operadores aprovados.
- Desacoplar regras de negócio do runtime para facilitar substituição futura.

## Critérios de aceite por fase

### Fase 1 — Fundação
- Engine funcional com sandbox e testes de bloqueio.
- Execução determinística com timeout configurável.

### Fase 2 — Operadores
- Registro/versionamento de scripts.
- Aprovação e publicação de operadores.

### Fase 3 — Bridge
- Tradutores por parceiro com fallback nativo.
- Testes de interoperabilidade de payload.

### Fase 4 — Métricas
- Biblioteca de métricas base.
- Visualização operacional de resultados.

## Riscos e mitigação

- **Risco:** scripts maliciosos.
  - **Mitigação:** sandbox estrito + revisão + auditoria.
- **Risco:** divergência de contratos entre parceiros.
  - **Mitigação:** suite de testes por tradutor e schema validation.
- **Risco:** complexidade operacional.
  - **Mitigação:** rollout progressivo com feature flags.

## Exemplos Prontos
- `examples/lua/scripts/check_orcid.lua`
- `examples/lua/scripts/extract_citations_abnt.lua`

Qualquer pesquisador pode submeter novos scripts via PR → aprovação automática após 2 validações humanas.
