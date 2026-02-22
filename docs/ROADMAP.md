# Roadmap detalhado

Planejamento incremental com fases, sprints, critérios de aceite e datas de referência.

> Datas abaixo são metas de execução e podem ser replanejadas conforme capacidade do time.

## Estado atual (baseline)

- Frontend com páginas principais implementadas.
- Backend com estrutura base de rotas, serviços e módulos de IA.
- Débitos técnicos de configuração/build ainda impedem previsibilidade de entrega contínua.

## Formato adotado

Cada fase segue:
- **Objetivo da fase**
- **Sprints** (escopo e janela)
- **Critérios de aceite da fase**
- **Riscos e dependências**

---

## Fase 1 — Fundação técnica
**Período:** 2026-03-02 a 2026-03-27

### Sprint 1.1 (2026-03-02 a 2026-03-13)
- Resolver conflitos de configuração e scripts de build no frontend.
- Validar execução local mínima (frontend + backend + banco).
- Padronizar variáveis de ambiente documentadas.

### Sprint 1.2 (2026-03-16 a 2026-03-27)
- Revisar contratos API efetivamente expostos pelo backend.
- Sincronizar tipos compartilhados e respostas esperadas.
- Garantir documentação técnica mínima em `docs/`.

### Critérios de aceite da Fase 1
- `npm run build` (frontend) e `npm run build` (backend) executando sem erro em ambiente limpo.
- Endpoints essenciais documentados e testáveis localmente.
- README e docs sem seções vazias/ambíguas.

### Riscos e dependências
- Dependência de resolução de conflitos legados.
- Tempo de ajuste para compatibilidade entre stacks (Vite/Next coexistindo no repositório).

---

## Fase 2 — Fluxo acadêmico ponta a ponta
**Período:** 2026-03-30 a 2026-04-24

### Sprint 2.1 (2026-03-30 a 2026-04-10)
- Consolidar submissão de artigo com validação inicial.
- Persistência consistente de status do artigo.
- Melhorar feedback de erro no frontend.

### Sprint 2.2 (2026-04-13 a 2026-04-24)
- Completar fluxo de revisão humana + apoio de IA.
- Registrar decisão final com justificativa.
- Ajustar dashboard para refletir estados reais do pipeline.

### Critérios de aceite da Fase 2
- Fluxo completo: criar artigo → submeter → revisar → decidir.
- Estados do artigo coerentes entre frontend e backend.
- Cobertura mínima de testes em cenários críticos do fluxo.

### Riscos e dependências
- Qualidade e estabilidade dos módulos de IA auxiliares.
- Evolução de modelos de dados sem quebrar contratos existentes.

---

## Fase 3 — Governança e qualidade científica
**Período:** 2026-04-27 a 2026-05-22

### Sprint 3.1 (2026-04-27 a 2026-05-08)
- Implementar trilha de auditoria para decisões de revisão.
- Definir critérios objetivos de aceite/rejeição por domínio.

### Sprint 3.2 (2026-05-11 a 2026-05-22)
- Estruturar fluxo de apelação e reanálise.
- Publicar métricas de qualidade da revisão (sem gamificação de popularidade).

### Critérios de aceite da Fase 3
- Decisões com justificativa rastreável.
- Processo de contestação documentado e operacional.
- Regras de governança atualizadas e versionadas.

### Riscos e dependências
- Necessidade de alinhamento entre governança e implementação técnica.
- Custo operacional de auditoria manual.

---

## Fase 4 — Operação, observabilidade e escala
**Período:** 2026-05-25 a 2026-06-19

### Sprint 4.1 (2026-05-25 a 2026-06-05)
- Instrumentar logs estruturados e métricas de serviço.
- Definir alertas básicos para disponibilidade e erro.

### Sprint 4.2 (2026-06-08 a 2026-06-19)
- Endurecimento de segurança operacional.
- Pipeline CI/CD com gates mínimos (lint, teste, build).

### Critérios de aceite da Fase 4
- Deploy reproduzível com checklist operacional.
- Monitoramento básico ativo para frontend e backend.
- Processo de release documentado.

### Riscos e dependências
- Dependência da maturidade das fases anteriores.
- Limitações de infraestrutura em ambiente de teste.
