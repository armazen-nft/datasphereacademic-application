# Quickstart Datasphere Academic

## Pré-requisitos
- Docker + Docker Compose v2
- Git

## Passo a passo

1. `git clone ... && cd datasphereacademic-application`
2. `cp .env.example .env` (edite senhas)
3. `docker compose up -d --build`
4. Abra http://localhost:5173
5. Crie conta → submeta o artigo de exemplo (docs/exemplo-artigo.md)

## Parar
`docker compose down`

## Desenvolvimento local (sem Docker)
- Backend: `cd backend && npm run dev`
- Frontend: `npm run dev`
