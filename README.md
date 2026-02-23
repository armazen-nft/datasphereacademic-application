# Datasphere Academic

Rede acadêmica peer-to-peer com validação híbrida IA + humanos.

## Submissão de Artigos
- Upload de artigos científicos
- Comentários e ensaios críticos (1.000 a 6.000 caracteres)
- Revisão IA inicial + validação humana

## Estrutura
- Backend: Node.js + Express + MongoDB + Redis
- Frontend: React + TypeScript + Tailwind CSS + shadcn/ui
- Documentação: docs/ARCHITECTURE.md, docs/GOVERNANCE.md, docs/API.md, docs/LUA_INTEGRATION.md

## 🚀 Quick Start (3 minutos)

```bash
# 1. Clone
git clone https://github.com/armazen-nft/datasphereacademic-application.git
cd datasphereacademic-application

# 2. Crie .env (use o .env.example)
cp .env.example .env

# 3. Rode tudo com Docker (recomendado)
docker compose up -d

# Frontend → http://localhost:5173
# Backend  → http://localhost:3001/api/health
# Mongo    → localhost:27017
# Redis    → localhost:6379
```

## Como contribuir (já!)

- Fork + branch `feature/nome-da-tarefa`
- Siga o padrão de commits (Conventional Commits)
- Abra PR → será revisado em até 48h pelo Comitê Científico
- Toda contribuição ganha reputação automática (ver `GOVERNANCE.md`)

## Quer testar agora?

Star o repo ⭐ e abra uma issue com “Quero participar do piloto Ciência da Computação”.

**Última atualização: 23/fev/2026 – em busca de 10 pesquisadores para piloto fechado (Ciência da Computação).**
