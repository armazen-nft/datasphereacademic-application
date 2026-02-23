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

## 🛠 Exemplos Lua (o diferencial técnico)

A plataforma permite scripts Lua personalizados para validação e automação.

Exemplos prontos:
- `examples/lua/scripts/check_orcid.lua` → valida ORCID de autores
- `examples/lua/scripts/format_references_abnt.lua` → formata referências ABNT

Qualquer pesquisador pode contribuir com novos scripts via PR (ganha reputação automática).
