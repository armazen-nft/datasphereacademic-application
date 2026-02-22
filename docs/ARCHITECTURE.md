# Arquitetura técnica (estado atual)

## Visão geral

O repositório contém duas frentes principais:

1. **Frontend** na raiz do projeto, majoritariamente em React + TypeScript.
2. **Backend** em `backend/`, com Node.js + Express + MongoDB.

A integração é feita por API HTTP com base padrão em `http://localhost:3001/api` (configurável via variável de ambiente no frontend).

## Componentes

### Frontend
- Entrada principal em `src/main.tsx` e `src/App.tsx`.
- Navegação por rotas com `react-router-dom`.
- Estado global com Zustand (`src/store/useStore.ts`).
- Camada de API cliente em `src/services/api.ts`.

### Backend
- Bootstrap do servidor em `backend/src/server.ts`.
- Rotas agrupadas em `backend/src/routes/`.
- Regras de negócio em `backend/src/services/`.
- Modelos em `backend/src/models/`.
- Módulos auxiliares de IA em `backend/src/ai-modules/`.

## Fluxo principal (alto nível)

1. Usuário interage com telas do frontend.
2. Frontend dispara chamadas para `/api`.
3. Backend valida, processa e persiste dados no MongoDB.
4. Módulos de IA podem apoiar etapas de validação.
5. Resposta retorna ao frontend para atualização de estado/interface.

## Estado atual e lacunas

- Existe base funcional de navegação e endpoints.
- A documentação histórica estava fragmentada e parcialmente corrompida.
- Há sinais de divergência de stack e configuração no repositório (ex.: artefatos de Next.js e Vite coexistindo, além de conflito em `package.json`), exigindo estabilização antes de produção.

## Decisões arquiteturais em aberto

- Definir caminho único de frontend (manter Vite, migrar para Next ou segmentar explicitamente).
- Estabelecer política de versionamento de API.
- Formalizar observabilidade e estratégia de erro ponta a ponta.
