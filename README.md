# Datasphere Academic

Plataforma acadêmica para submissão de artigos, validação híbrida (IA + humanos) e governança transparente de revisão.

## SBL — Visão Geral

O projeto está organizado em uma estrutura SBL (visão de sistema + blocos lógicos + linhas de evolução):

- **S (System / Sistema):** fluxo completo de submissão, validação e ranqueamento acadêmico.
- **B (Building Blocks / Blocos):** frontend React, backend Express, módulos de validação semântica/originalidade/citação e documentação de governança.
- **L (Lifecycle / Linha de evolução):** conceito → protótipo funcional → endurecimento para produção.

Objetivo principal: reduzir fricção da revisão por pares mantendo transparência e critérios auditáveis.

## Arquitetura (alto nível)

- **Frontend Web (React + Vite + TypeScript)**
  - Entrada da aplicação em `src/main.tsx`
  - Rotas principais em `src/App.tsx`
  - Seções de produto em `src/sections/*`
- **Backend API (Node.js + Express + TypeScript + MongoDB)**
  - Servidor em `backend/src/server.ts`
  - Rotas agregadas em `backend/src/routes/index.ts`
  - Domínios em `backend/src/controllers`, `backend/src/services`, `backend/src/models`
  - Módulos de IA em `backend/src/ai-modules/*`
- **Documentação de produto e governança**
  - Arquitetura: `docs/ARCHITECTURE.md`
  - API: `docs/API.md`
  - Roadmap: `docs/ROADMAP.md`
  - Governança: `docs/GOVERNANCE.md`

## Quickstart (estado atual do repositório)

> Pré-requisitos testados neste estado: Node.js 18+, npm 9+, Python 3.10+, Rust 1.92+.

### 1) Backend API

```bash
cd backend
npm install
npm run dev
```

API esperada em `http://localhost:3001/api`.

Healthcheck:

```bash
curl http://localhost:3001/api/health
```

### 2) Frontend (build já presente em `dist/`)

Como o repositório já inclui uma build estática em `dist/`, você pode validar a interface sem instalar dependências do frontend:

```bash
python3 -m http.server 4173 --directory dist
```

Abra `http://localhost:4173`.

### 3) Frontend em modo desenvolvimento (quando `package.json` da raiz estiver saneado)

```bash
npm install
npm run dev
```

## Instalação realista de toolchain (Python + Rust)

Mesmo com backend/frontend em Node, este passo deixa o ambiente pronto para automações científicas e extensões futuras.

### Python

Verificar instalação:

```bash
python3 --version
```

Criar ambiente virtual local (opcional):

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
```

### Rust

Verificar instalação:

```bash
rustc --version
cargo --version
```

Instalar via rustup (se necessário):

```bash
curl https://sh.rustup.rs -sSf | sh
source "$HOME/.cargo/env"
```

## Exemplos de uso (snippets reais)

### Exemplo 1 — Health route no backend

Arquivo real: `backend/src/routes/index.ts`

```ts
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

### Exemplo 2 — Composição de rotas na aplicação web

Arquivo real: `src/App.tsx`

```tsx
<Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="/articles" element={<ArticleList />} />
  <Route path="/articles/:id" element={<ArticleDetail />} />
  <Route path="/submit" element={<ArticleSubmit />} />
  <Route path="/validators" element={<Validators />} />
  <Route path="/leaderboard" element={<Leaderboard />} />
</Routes>
```

## Status de Implementação

### 1) Conceito

- ✅ Problema e proposta formalizados (rede acadêmica com validação híbrida).
- ✅ Diretrizes e critérios documentados em `CRITERIA.md`, `EVALUATION.md`, `GOVERNANCE.md`.

### 2) Protótipo

- ✅ Backend Express com rotas de usuários/artigos e endpoint de health.
- ✅ Estrutura de módulos de IA em `backend/src/ai-modules`.
- ✅ Frontend com navegação e páginas-chave de fluxo acadêmico (`Dashboard`, lista, detalhe, submissão, validadores, leaderboard).
- ⚠️ Setup da raiz requer saneamento do `package.json` antes de rodar `npm install` no frontend em modo dev.

### 3) Produção

- ⏳ Hardening de segurança (auth robusta, rate limiting, observabilidade, gestão de segredos).
- ⏳ CI/CD e testes de integração ponta a ponta.
- ⏳ Pipeline formal de dados/modelos com métricas de qualidade e auditoria contínua.

## Roadmap resumido

- **Fase 1 (curto prazo):** estabilizar setup raiz, padronizar scripts e validar fluxo completo local.
- **Fase 2 (médio prazo):** ampliar cobertura de testes (backend + frontend), contrato de API e telemetria.
- **Fase 3 (longo prazo):** prontidão para produção multiambiente com governança operacional.

Detalhamento: `docs/ROADMAP.md`.

## Links úteis

- [Documentação geral](docs/README.md)
- [Arquitetura](docs/ARCHITECTURE.md)
- [API](docs/API.md)
- [Roadmap](docs/ROADMAP.md)
- [Governança](docs/GOVERNANCE.md)
- [Critérios](CRITERIA.md)
- [Avaliação](EVALUATION.md)
- [Deploy](DEPLOY.md)
