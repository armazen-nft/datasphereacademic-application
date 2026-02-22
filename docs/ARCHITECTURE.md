# Arquitetura Técnica — Datasphere Academic

## Visão Geral

O Datasphere Academic adota uma arquitetura modular com frontend web, backend HTTP e camada de persistência desacoplada.

```text
Frontend (React/Next + TS)
        │
        ▼
Backend API (Node.js/Express + TS)
        │
        ├── MongoDB (dados de domínio)
        └── Redis (cache/coordenação)
```

## Componentes atuais

### Frontend
- Aplicação React/Next.js com TypeScript.
- UI baseada em Tailwind e componentes reutilizáveis.
- Rotas para feed, busca, submissão e autenticação.

### Backend
- API em Node.js/Express.
- Camadas por responsabilidade:
  - `routes/` para endpoints.
  - `controllers/` para orquestração HTTP.
  - `services/` para regra de negócio.
  - `models/` para persistência.
  - `ai-modules/` para validações semânticas e meritocráticas.

### Dados
- MongoDB para usuários, artigos e metadados de validação.
- Redis para aceleração e futuras estratégias de fila/rate limit.

---

## Extensão Estratégica: Lua no contexto SBL

A proposta de integrar Lua é compatível com os princípios SBL (soberania, leveza e interoperabilidade) e pode ser adicionada sem ruptura arquitetural.

### Onde Lua entra

1. **Operadores customizados por script**
   - Usuário define agregações/transformações sem recompilar backend.
2. **Tradução entre agentes/parceiros**
   - Scripts de bridge para adaptar payloads heterogêneos.
3. **Métricas customizadas**
   - Cálculos de coerência, consenso e confiança em runtime.
4. **Mocks de parceiros**
   - Simulação de integrações externas em desenvolvimento.

### Desenho proposto (incremental)

```text
Frontend
   │
   ▼
Backend API (Express)
   │
   ├── Core services atuais
   └── Lua Execution Layer (novo)
         ├── Script Registry
         ├── Sandbox Policy
         ├── Operator Runtime
         └── Bridge Translators
```

### Diretrizes de segurança para scripts

- Whitelist de bibliotecas/funções permitidas.
- Bloqueio de I/O e execução de comandos do sistema.
- Timeout por execução.
- Limite de memória por script.
- Auditoria com hash/versionamento do script.

### Integração com stack Node atual

Embora o exemplo original use Python + `lupa`, no backend atual (Node/TypeScript) a estratégia é:

- Criar abstração `ScriptEngine` para desacoplar implementação.
- Iniciar com implementação `LuaScriptEngine` via runtime Lua embutido.
- Manter API estável para permitir troca de engine no futuro.

Interface sugerida:

```ts
export interface ScriptEngine {
  validate(code: string): { ok: boolean; reason?: string };
  compile(code: string, entrypoint: string): Promise<CompiledScript>;
  execute<TInput, TOutput>(
    script: CompiledScript,
    payload: TInput,
    options?: { timeoutMs?: number; memoryKb?: number }
  ): Promise<TOutput>;
}
```

### Roadmap resumido

- **Fase 1:** engine + sandbox + testes de segurança.
- **Fase 2:** registro/versionamento de operadores.
- **Fase 3:** bridge com tradutores Lua por parceiro.
- **Fase 4:** métricas customizadas e observabilidade.

---

## Princípios de evolução arquitetural

- **Compatibilidade retroativa:** endpoints atuais permanecem funcionais.
- **Extensibilidade orientada a contratos:** novas capacidades via interfaces.
- **Auditabilidade por padrão:** toda execução de script gera trilha de auditoria.
- **Fail-safe:** em erro de script, fallback para fluxo nativo do backend.
