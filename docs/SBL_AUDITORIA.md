# Auto-Auditoria SBL — Datasphere Academic

## Escopo e premissas

Como o “Checklist SBL acima” não está versionado neste repositório, esta auditoria usa os princípios SBL já explícitos na arquitetura (soberania, leveza, interoperabilidade e auditabilidade) e os traduz em **5 camadas operacionais (I–V)** para gap analysis:

- **Camada I — Triagem técnica assistida por IA** (sinalização, não decisão final).
- **Camada II — Decisão científica humana** (aprovação/rejeição de mérito).
- **Camada III — Governança e contestação** (apelação, trilha decisória, comitê).
- **Camada IV — Observabilidade/auditoria e explicabilidade** (rastro verificável).
- **Camada V — Soberania/interoperabilidade operacional** (contratos, extensibilidade segura).

---

## Checklist SBL aplicado (estado atual)

| Item | Evidência no código | Status |
|---|---|---|
| IA executa validações técnicas e score composto | `AIValidator` integra módulos semântico, citação e originalidade com pesos/thresholds. | ✅ Implementado |
| Decisão de status baseada em consenso de IA | `ArticleService.triggerAIValidation` define `approved/rejected/revision_required` automaticamente. | ⚠️ Implementado, desalinhado com primazia humana |
| Publicação depende de aprovação prévia | `publishArticle` só publica se `status === 'approved'`. | ✅ Implementado |
| Gate de decisão humana explícita (reviewer/chair sign-off) | Não há etapa obrigatória humana entre consenso IA e publicação. | ❌ Ausente |
| Modelo suporta validador humano | Tipos e schema aceitam `validatorType: 'human' | 'ai'`. | ⚠️ Parcial (suporte estrutural sem fluxo) |
| Rotas de governança (apelação, contestação, decisão colegiada) | Rotas atuais focam CRUD/submissão/publicação/versionamento. | ❌ Ausente |
| Trilha de auditoria decisória formal | Há `validations[]`, porém sem evento de decisão humana/justificativa obrigatória. | ⚠️ Parcial |
| Contratos/extensibilidade por interface | Arquitetura já sugere evolução por contratos e camada de script engine. | ✅ Direção arquitetural presente |
| Fail-safe em caso de incerteza | Status `revision_required` existe quando consenso/confiança não fecha. | ✅ Parcial |

---

## Submissão de trechos críticos (análise específica)

### Trecho A — Decisão automática por IA

```ts
// backend/src/services/ArticleService.ts
if (consensus.consensus === 'approved' && consensus.confidence >= 70) {
  article.status = 'approved';
} else if (consensus.consensus === 'rejected') {
  article.status = 'rejected';
} else {
  article.status = 'revision_required';
}
```

**Leitura SBL:** A IA aqui deixa de ser apenas triagem e passa a atuar como decisão final de mérito para dois caminhos (`approved`/`rejected`).

### Trecho B — Publicação sem assinatura humana obrigatória

```ts
// backend/src/services/ArticleService.ts
if (article.status !== 'approved') {
  return { success: false, error: 'Article must be approved before publishing' };
}

article.status = 'published';
```

**Leitura SBL:** O sistema exige aprovação, mas não exige que essa aprovação seja humana.

### Trecho C — Estrutura preparada para humano, mas sem orquestração

```ts
// shared/types/index.ts
export type UserType = 'human' | 'ai';
...
validatorType: UserType;
```

```ts
// backend/src/models/Article.ts
validatorType: { type: String, enum: ['human', 'ai'], required: true },
```

**Leitura SBL:** Há base de dados e tipos corretos para validação humana, porém sem fluxo obrigatório no serviço/rotas.

### Trecho D — Conjunto de rotas sem governança decisória

```ts
// backend/src/routes/articleRoutes.ts
router.post('/:id/submit', articleController.submitForValidation);
router.post('/:id/publish', articleController.publishArticle);
router.post('/:id/version', articleController.createVersion);
```

**Leitura SBL:** não há endpoint de `human-review`, `appeal`, `decision-log`, `committee-review`.

---

## Gap Analysis por Camadas (I–V)

### Camada I — Triagem técnica IA
**Estado:** **Implementada**
- Pipeline automatizado de validação já está operacional e modular.

### Camada II — Decisão científica humana
**Estado:** **Não implementada (gap crítico)**
- Ausência de gate de decisão humana obrigatória antes de `approved/published`.

### Camada III — Governança e contestação
**Estado:** **Não implementada (gap crítico)**
- Sem fluxo de apelação, sem papel formal de comitê/revisor líder, sem política executável.

### Camada IV — Auditoria e explicabilidade
**Estado:** **Parcial**
- Existem dados de validação, mas não existe trilha decisória completa com autoria humana, justificativa obrigatória e versionamento de decisão.

### Camada V — Soberania/interoperabilidade
**Estado:** **Parcial para bom**
- Arquitetura é modular e extensível; falta consolidar contratos de governança executável e políticas de segurança operacionais vinculantes.

---

## Plano de Refatoração priorizado (alinhamento SBL)

## P0 (bloqueante de confiança científica)
1. **Inserir Human Decision Gate obrigatório**
   - Novo status: `awaiting_human_review`.
   - IA só pode mover `under_review -> awaiting_human_review`.
   - Só humano qualificado move para `approved/rejected`.
2. **Separar decisão de mérito de triagem automática**
   - Trocar nomenclatura operacional da IA para `technical_recommendation`.
   - Evitar escrita direta de `approved/rejected` pelo módulo de IA.
3. **Exigir justificativa humana em decisão final**
   - Campo obrigatório: `humanDecision.reason`, `reviewerId`, `timestamp`.

## P1 (governança e contestabilidade)
4. **Criar fluxo de apelação**
   - Endpoints: `POST /articles/:id/appeal`, `POST /articles/:id/appeal/:appealId/resolve`.
5. **Registrar trilha de decisão imutável (append-only)**
   - Coleção/eventos: `decision_events` (quem, quando, por quê, evidências).
6. **Papéis e permissões explícitas**
   - Perfis: autor, revisor, editor/comitê; controle de autorização por rota.

## P2 (observabilidade, robustez e evolução)
7. **Métricas de qualidade de decisão híbrida**
   - Concordância IA vs humano, taxa de reversão em apelação, tempo médio de ciclo.
8. **Política de fallback e risco**
   - Se confiança IA baixa, obrigar dupla revisão humana.
9. **Consolidar documentação canônica em `docs/`**
   - Há inconsistências/corrupções em documentos de governança na raiz; normalizar fonte única versionada.

---

## Backlog técnico sugerido (objetivo)

- `feat(workflow): add awaiting_human_review status and enforce human final decision`
- `feat(api): create human review endpoints and appeal lifecycle`
- `feat(audit): append-only decision event log`
- `feat(authz): role-based access for review and publication actions`
- `refactor(ai): downgrade AI output to recommendation-only semantics`
- `docs(governance): canonical SBL policy in docs/ with executable mapping`

