# 📊 Análise de Status — Datasphere Academic → SBL

## 1) Resumo executivo

O repositório já possui uma **direção arquitetural clara** para adoção de SBL com Lua (engine, sandbox, registry e bridge), porém a implementação ainda está majoritariamente em nível de documentação/roadmap. O backend atual continua centrado no fluxo clássico Express + Mongo, sem uma camada de execução de scripts materializada no código.

**Conclusão:** status de migração para SBL = **planejado, parcialmente especificado, não implementado em produção**.

---

## 2) O que já existe (baseline atual)

### 2.1 Arquitetura e stack
- Frontend e backend desacoplados com API HTTP.
- Backend com camadas `routes`, `controllers`, `services`, `models`, `ai-modules`.
- Persistência em MongoDB, com Redis citado em documentação arquitetural.

### 2.2 Capacidade funcional implementada
- Rotas de usuários e artigos com healthcheck no backend.
- Módulos de IA especializados para validação semântica, originalidade, citação e meritocracia.
- Testes de frontend/utilitários no repositório raiz.

### 2.3 Direção SBL já documentada
- `ARCHITECTURE.md` descreve uma camada incremental de execução Lua com sandbox.
- `LUA_INTEGRATION.md` detalha fases, critérios de aceite e riscos/mitigações.
- `ROADMAP.md` lista objetivos de curto/médio/longo prazo alinhados à ponte scriptável.

---

## 3) Gap analysis (estado atual vs. alvo SBL)

## Gap A — Engine de scripts e sandbox
**Estado atual:** não há interface `ScriptEngine` nem implementação Lua no backend.

**Impacto:** impede operadores customizados, execução segura por política e evolução de bridge.

**Prioridade:** Alta.

## Gap B — Governança operacional de scripts
**Estado atual:** documentação cita versionamento/aprovação/auditoria, mas não há fluxo operacional codificado.

**Impacto:** sem trilha auditável e sem controle de risco para scripts de terceiros.

**Prioridade:** Alta.

## Gap C — Contratos e interoperabilidade
**Estado atual:** há intenção de padronizar contratos, porém não há camada bridge ativa no backend.

**Impacto:** maior acoplamento a payloads internos e pouca prontidão para parceiros heterogêneos.

**Prioridade:** Média/Alta.

## Gap D — Qualidade de documentação operacional
**Estado atual:** alguns arquivos de documentação estão corrompidos/truncados e incluem comandos em vez de especificação final.

**Impacto:** risco de execução desalinhada na migração e perda de confiança em artefatos de governança.

**Prioridade:** Alta (rápido ganho).

---

## 4) Roadmap de migração sugerido (90 dias)

## Fase 0 (Semana 1-2) — Saneamento e preparação
- Corrigir/normalizar documentação crítica (`API`, `GOVERNANCE`, `EVALUATION`, `CRITERIA`, `docs/README`).
- Definir ADR da camada SBL (interfaces, limites de segurança, fallback).
- Definir KPIs de adoção (p95 latência, taxa de erro de script, tempo de aprovação de operador).

## Fase 1 (Semana 3-6) — Fundação técnica SBL
- Criar interface `ScriptEngine` e contrato de execução.
- Implementar primeiro runtime Lua com sandbox mínimo (sem I/O, sem shell, timeout hard, limite de memória).
- Adicionar suíte de testes de segurança (scripts permitidos x bloqueados).

## Fase 2 (Semana 7-10) — Registry e governança
- Modelos para `ScriptDefinition`, `ScriptVersion`, `ScriptApproval`, `ExecutionAudit`.
- Pipeline de publicação: draft → review → approved → active.
- Feature flags para ativação gradual por endpoint/parceiro.

## Fase 3 (Semana 11-13) — Bridge e observabilidade
- Implementar 1 tradutor Lua piloto para parceiro simulado.
- Fallback nativo em erro de script + circuit breaker simples.
- Dashboards mínimos: execução, erro por script, timeout, top scripts.

---

## 5) Riscos principais e mitigação

- **Scripts maliciosos:** sandbox estrito, listas de allow/deny, limites de recurso.
- **Complexidade operacional:** rollout progressivo com feature flags e ambiente de staging dedicado.
- **Deriva de contrato entre parceiros:** validação por schema e testes de contrato automatizados.

---

## 6) Documentos/informações que preciso de você para fechar um plano executivo

Para transformar esta análise em plano de execução com esforço e responsáveis, preciso dos seguintes insumos:

1. **Meta de negócio da migração SBL (Q atual + próximo Q):** qual resultado prioritário? (time-to-integrate parceiro, custo, soberania, etc.).
2. **Lista de parceiros/alvos de integração:** 1-3 casos reais para priorizar o primeiro bridge.
3. **Requisitos de compliance/security aplicáveis:** LGPD, retenção de logs, trilha de auditoria mínima.
4. **SLOs de produção esperados:** latência, disponibilidade e orçamento de erro.
5. **Modelo de governança desejado:** quem aprova scripts (papéis e SLA de aprovação).
6. **Ambientes disponíveis:** dev/staging/prod + estratégia atual de deploy.
7. **Backlog atual e capacidade do time:** número de pessoas por papel para estimativa realista.

Com isso, eu te devolvo uma **matriz priorizada (impacto x esforço)** e um **plano tático com entregas quinzenais**.
