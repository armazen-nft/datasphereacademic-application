# Quick Start Datasphere Academic (3 minutos)

## Pré-requisitos
- Docker + Docker Compose
- Git

## Passo a passo

```bash
git clone https://github.com/armazen-nft/datasphereacademic-application.git
cd datasphereacademic-application

cp .env.example .env
docker compose up -d --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Crie uma conta → Submeta o arquivo `docs/exemplo-artigo.md`

## Parar tudo
```bash
docker compose down
```

Pronto! Você já pode testar submissão + validação IA.
