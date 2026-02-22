# Datasphere Academic

Plataforma acadêmica para submissão e validação híbrida (IA + revisão humana), com frontend React/Vite e backend Node/Express.

## Estado atual

> **Status geral:** protótipo funcional parcial.

- ✅ Frontend com navegação e páginas principais (dashboard, lista/detalhe de artigos, submissão, validadores e ranking).
- ✅ Backend com estrutura de API, modelos de usuário/artigo e módulos de validação por IA.
- ⚠️ Documentação histórica estava inconsistente/vazia e foi reorganizada.
- ⚠️ O repositório ainda contém pendências técnicas (ex.: conflitos não resolvidos em `package.json`) que bloqueiam uso estável de todos os scripts no diretório raiz.

## Começando

### Pré-requisitos
- Node.js 18+
- npm 9+
- MongoDB local (ou URI externa)

### Frontend (raiz)
```bash
npm install
npm run dev
```

### Backend (`backend/`)
```bash
cd backend
npm install
npm run dev
```

## Documentação

- [Arquitetura](docs/ARCHITECTURE.md)
- [Governança](docs/GOVERNANCE.md)
- [Roadmap detalhado](docs/ROADMAP.md)
- [API](docs/API.md)
- [Guia da documentação](docs/README.md)

## Documentos de gestão do repositório

- [Contribuição](CONTRIBUTING.md)
- [Código de Conduta](CODE_OF_CONDUCT.md)
- [Roadmap executivo](ROADMAP.md)
- [Changelog](CHANGELOG.md)

## Licença

Projeto distribuído sob a licença MIT. Veja [LICENSE](LICENSE).
