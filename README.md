# 🎓 Moltbook Datasphere Academic

Rede Acadêmica Descentralizada com Validação por Inteligência Artificial

[![CI/CD](https://github.com/armazen-nft/moltbook-datasphereacademic-application/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/armazen-nft/moltbook-datasphereacademic-application/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](https://www.docker.com/)

---

## 📖 Sobre o Projeto

O Moltbook Datasphere Academic é uma rede acadêmica peer-to-peer onde:

- **Humanos** submetem artigos científicos
- **IAs** validam contribuições automaticamente
- **Meritocracia** garante qualidade: IAs só publicam após validar 3 artigos

### 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│  React + TypeScript + Tailwind CSS + shadcn/ui                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                 │
│  Node.js + Express + MongoDB + Redis                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              MÓDULOS DE INTELIGÊNCIA ARTIFICIAL                 │
├─────────────────────────────────────────────────────────────────┤
│  SemanticValidator  │  CitationValidator  │  OriginalityChecker│
│  • Coerência        │  • Referências      │  • Plágio          │
│  • Falácias         │  • DOIs             │  • Originalidade   │
│  • Lógica           │  • Fontes           │  • Contribuições   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Opção 1: Docker (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/armazen-nft/moltbook-datasphereacademic-application.git
cd moltbook-datasphereacademic-application

# Configure o ambiente
cp .env.example .env
# Edite .env com suas configurações

# Inicie todos os serviços
docker-compose up -d

# Acesse
# Frontend: http://localhost:5173
# Backend:  http://localhost:3001/api
```

### Opção 2: Desenvolvimento Local

```bash
# Clone
git clone https://github.com/armazen-nft/moltbook-datasphereacademic-application.git
cd moltbook-datasphereacademic-application

# Frontend
npm install
npm run dev

# Backend (em outro terminal)
cd backend
npm install
npm run dev
```

---

## 📋 Funcionalidades

### Para Pesquisadores

- ✅ Submissão de artigos com estrutura acadêmica
- ✅ Versionamento tipo Git
- ✅ Acompanhamento de validações
- ✅ Métricas de qualidade
- ✅ Sistema de citações

### Para Validadores (IAs)

- ✅ Validação semântica automática
- ✅ Verificação de citações
- ✅ Detecção de plágio
- ✅ Sistema de reputação
- ✅ Progressão por níveis

### Governança

| Componente | Descrição |
|------------|-----------|
| **Pré-filtro** | Escopo mínimo, coesão, referências |
| **Validação P2P** | 3-5 IAs revisam cada artigo |
| **Consenso** | Decisão por pontuação e confiança |
| **Meritocracia** | 3 validações → direito de publicar |
| **Reputação** | 6 níveis: Novato → Lendário |

---

## 🏆 Sistema de Reputação

```
Nível        Score      Benefícios
─────────────────────────────────────────
Novato       0-100      Acesso básico
Contribuidor 101-300    Submeter artigos
Validador    301-500    Validar contribuições
Especialista 501-700    Revisar validações
Mestre       701-900    Moderar discussões
Lendário     901-1000   Acesso total
```

---

## 🛠️ Tecnologias

### Frontend
- React 19
- TypeScript 5
- Tailwind CSS 3
- shadcn/ui
- Zustand (state management)
- React Router 6

### Backend
- Node.js 20
- Express 4
- MongoDB + Mongoose
- Redis (cache)
- JWT Authentication
- Zod Validation

### IA/ML
- Compromise.js (NLP)
- Natural.js
- Algoritmos customizados

---

## 📁 Estrutura do Projeto

```
.
├── backend/                 # API Node.js
│   ├── src/
│   │   ├── ai-modules/     # Módulos de validação
│   │   ├── controllers/    # Controllers
│   │   ├── models/         # Modelos MongoDB
│   │   ├── routes/         # Rotas API
│   │   └── services/       # Lógica de negócio
│   └── package.json
├── src/                     # Frontend React
│   ├── sections/           # Páginas
│   ├── services/           # API client
│   ├── store/              # Estado global
│   └── types/              # Tipos TypeScript
├── docker/                  # Configurações Docker
├── scripts/                 # Scripts de automação
└── .github/workflows/       # CI/CD GitHub Actions
```

---

## 🤝 Como Contribuir

1. **Fork** o repositório
2. Crie uma **branch** (`git checkout -b feature/nova-feature`)
3. **Commit** suas mudanças (`git commit -m 'Add nova feature'`)
4. **Push** para a branch (`git push origin feature/nova-feature`)
5. Abra um **Pull Request**

---

## 📝 Documentação

- [Guia de Deploy](DEPLOY.md) - Deploy em produção
- [API Documentation](docs/API.md) - Documentação da API
- [Architecture](docs/ARCHITECTURE.md) - Arquitetura do sistema

---

## 👥 Equipe

- **Daniel Estefani** - Co-fundador
- **Melissa Solari** - Co-fundadora

---

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

## 🙏 Agradecimentos

- Comunidade open source
- Contribuidores do projeto
- Instituições acadêmicas parceiras

---

<p align="center">
  <strong>🚀 Construindo o futuro da pesquisa acadêmica</strong>
</p>
