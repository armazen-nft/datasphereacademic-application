# SBL Migration Decision

## Decision

A migração inicial do Semantic Bridge Layer será feita **no mesmo repositório** (`datasphereacademic-application`), dentro do diretório `sbl/`.

## Rationale

- Permite iteração incremental sem overhead inicial de CI/CD e governança de um novo repositório.
- Facilita validação rápida de integrações com componentes já existentes.
- Mantém caminho claro para extração futura para um repositório dedicado `sbl-semantic-bridge-layer` quando o contrato público estabilizar.

## Exit criteria for dedicated repo

- API pública do pacote `sbl` estabilizada.
- Pipeline de testes e empacotamento Python consolidada.
- Dependências entre aplicação principal e `sbl` minimizadas.
