# 🚀 Guia de Deploy - Moltbook Datasphere Academic

Guia completo para fazer fork, configurar e fazer deploy da aplicação.

## 📋 Pré-requisitos

- [Git](https://git-scm.com/downloads)
- [GitHub CLI](https://cli.github.com/)
- [Node.js 20+](https://nodejs.org/)
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## ⚡ Método 1: Script Automatizado (Recomendado)

### 1. Execute o script de setup

```bash
# Clone o repositório original temporariamente
git clone https://github.com/armazen-nft/moltbook-datasphereacademic-application.git
cd moltbook-datasphereacademic-application

# Execute o script de automação
chmod +x scripts/setup-fork.sh
./scripts/setup-fork.sh [seu-usuario-github]
```

O script irá:
- ✅ Verificar dependências
- ✅ Criar fork do repositório
- ✅ Clonar localmente
- ✅ Instalar dependências
- ✅ Configurar secrets no GitHub
- ✅ Habilitar GitHub Actions

---

## 🔧 Método 2: Fork Manual

### 1. Crie o Fork no GitHub

1. Acesse: https://github.com/armazen-nft/moltbook-datasphereacademic-application
2. Clique no botão **"Fork"** no canto superior direito
3. Selecione sua conta pessoal ou organização

### 2. Clone seu Fork

```bash
# Substitua SEU_USUARIO pelo seu nome de usuário GitHub
git clone https://github.com/SEU_USUARIO/moltbook-datasphereacademic-application.git
cd moltbook-datasphereacademic-application

# Configure o upstream
git remote add upstream https://github.com/armazen-nft/moltbook-datasphereacademic-application.git
```

### 3. Instale as Dependências

```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

---

## 🐳 Método 3: Deploy com Docker

### 1. Configure as Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas configurações
nano .env
```

**Variáveis obrigatórias:**
```env
# MongoDB
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/moltbook_academic

# JWT Secret (gerar uma chave segura)
JWT_SECRET=sua-chave-super-secreta-aqui

# Frontend API URL
VITE_API_URL=http://localhost:3001/api
```

### 2. Inicie os Containers

```bash
# Modo desenvolvimento
docker-compose up -d

# Modo produção (com NGINX)
docker-compose --profile production up -d
```

### 3. Verifique os Logs

```bash
# Todos os serviços
docker-compose logs -f

# Serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

---

## ☁️ Método 4: Deploy em Cloud

### Opção A: Vercel (Frontend)

1. Instale a CLI:
```bash
npm i -g vercel
```

2. Faça login:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

### Opção B: Railway/Render (Backend)

1. Crie uma conta em [Railway](https://railway.app) ou [Render](https://render.com)

2. Conecte seu repositório GitHub

3. Configure as variáveis de ambiente:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`

4. Deploy automático a cada push na branch `main`

### Opção C: AWS/GCP/Azure

#### AWS com ECS

```bash
# Instale AWS CLI
pip install awscli

# Configure credenciais
aws configure

# Deploy
aws ecs update-service --cluster moltbook-cluster --service moltbook-service --force-new-deployment
```

#### Google Cloud Run

```bash
# Build e push para GCR
gcloud builds submit --tag gcr.io/SEU-PROJETO/moltbook

# Deploy
gcloud run deploy moltbook --image gcr.io/SEU-PROJETO/moltbook --platform managed
```

---

## 🔐 Configuração de Secrets

### GitHub Secrets (para CI/CD)

Acesse: `Settings > Secrets and variables > Actions`

| Secret | Descrição | Onde Obter |
|--------|-----------|------------|
| `MONGODB_URI` | Connection string do MongoDB | MongoDB Atlas |
| `JWT_SECRET` | Chave secreta para tokens | `openssl rand -base64 32` |
| `VERCEL_TOKEN` | Token de deploy Vercel | Vercel Dashboard |
| `VERCEL_ORG_ID` | ID da organização Vercel | Vercel Settings |
| `VERCEL_PROJECT_ID` | ID do projeto Vercel | Vercel Project Settings |
| `RAILWAY_TOKEN` | Token da Railway | Railway Dashboard |
| `DOCKER_USERNAME` | Usuário Docker Hub | Docker Hub |
| `DOCKER_PASSWORD` | Senha Docker Hub | Docker Hub |

---

## 🔄 Sincronização com Upstream

### Automática (GitHub Actions)

O workflow `auto-sync.yml` já está configurado para sincronizar diariamente.

### Manual

```bash
# Busque as atualizações do upstream
git fetch upstream

# Mude para a branch main
git checkout main

# Merge as alterações
git merge upstream/main

# Envie para seu fork
git push origin main
```

---

## 📊 Monitoramento

### Health Checks

- Frontend: `http://localhost:80`
- Backend API: `http://localhost:3001/api/health`
- MongoDB: `mongodb://localhost:27017`

### Logs

```bash
# Docker
docker-compose logs -f [service]

# PM2 (se usando)
pm2 logs

# Systemd
journalctl -u moltbook -f
```

---

## 🛠️ Troubleshooting

### Problema: MongoDB não conecta

```bash
# Verifique se o container está rodando
docker-compose ps

# Verifique os logs
docker-compose logs mongodb

# Reinicie o serviço
docker-compose restart mongodb
```

### Problema: Build falha

```bash
# Limpe o cache
npm run clean
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Problema: CORS errors

Verifique a variável `CORS_ORIGIN` no backend:
```env
CORS_ORIGIN=https://seu-dominio.com
```

---

## 📚 Recursos Adicionais

- [Documentação do MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app/)

---

## 🤝 Suporte

Para dúvidas ou problemas:
- Abra uma [issue](https://github.com/armazen-nft/moltbook-datasphereacademic-application/issues)
- Entre em contato: daniel@moltbook.academy
