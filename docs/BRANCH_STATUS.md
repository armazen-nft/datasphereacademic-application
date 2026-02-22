# Branch Status (Local Snapshot)

Este documento registra um snapshot local do estado de branches do repositório para facilitar rastreio de progresso quando o acesso direto à página de branches no GitHub não estiver disponível.

## Snapshot atual

- Branch local atual: `work`
- Branches locais visíveis: `work`
- Branches remotas visíveis localmente: nenhuma (nenhum remote configurado nesta cópia local)

## Últimos commits no branch `work`

1. `38c4cbb` — Merge pull request #1
2. `e6f3bca` — Merge pull request #7
3. `6c44438` — fix(ci): resolve merge conflicts blocking npm install and build
4. `ae7f6fe` — fix(ci): avoid unresolved backend cache path in workflow
5. `0b3afee` — docs: define Lua integration architecture and roadmap

## Como atualizar este snapshot

Execute os comandos abaixo a partir da raiz do repositório:

```bash
git branch --all
git remote -v
git log --oneline --decorate -n 15
```

Se houver remotes configurados, rode também:

```bash
git fetch --all --prune
git branch -r
```

Com isso, você consegue classificar por branch:

- **Pronto**: branch com PR mergeado e commits estáveis.
- **Em andamento**: branch com commits recentes sem merge.
- **Planejado**: branch ainda não criado, mas com item em roadmap.
