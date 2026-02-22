# Datasphere Academic

Rede acadêmica peer-to-peer com validação híbrida IA + humanos.

## Submissão de Artigos
- Upload de artigos científicos
- Comentários e ensaios críticos (1.000 a 6.000 caracteres)
- Revisão IA inicial + validação humana

## Estrutura
- Backend: Node.js + Express + MongoDB + Redis
- Frontend: React + TypeScript + Tailwind CSS + shadcn/ui
- Documentação: docs/ARCHITECTURE.md, docs/GOVERNANCE.md, docs/API.md


## Arquitetura em Camadas
- Núcleo de governança com deliberação multicamada
- Separação entre interface pública (ortogonal) e deliberação IA interna (não-ortogonal)
- Roadmap incremental de implantação em 12 semanas


## SBL (Fase 1 - Coexistência)
- Novo módulo Python isolado em `backend/sbl/` para prototipar Pentágono de IAs fundadoras sem alterar o backend principal.
- Adaptadores iniciais em `backend/bridge/` para integração progressiva DataSphere ↔ SBL.
- Testes iniciais em `tests/sbl/test_pentagono.py`.


## GitMCP (Git para Model Context Protocol)
Para permitir que agentes de IA leiam o repositório completo via GitMCP, troque `github` por `gitmcp` na URL do repositório.

Exemplo:
- URL original: `https://github.com/ORG/REPO`
- URL GitMCP: `https://gitmcp.com/ORG/REPO`
