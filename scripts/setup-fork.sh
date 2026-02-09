#!/bin/bash

# ============================================
# MOLTBOOK DATASPHERE ACADEMIC - FORK SETUP
# ============================================
# Script para automatizar o fork e setup inicial
# Uso: ./setup-fork.sh <seu-usuario-github>

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================
# CONFIGURAÇÃO
# ============================================
REPO_ORIGEM="armazen-nft/moltbook-datasphereacademic-application"
USUARIO_GITHUB="${1:-}"
BRANCH_PRINCIPAL="main"

# ============================================
# FUNÇÕES
# ============================================

print_banner() {
    echo -e "${BLUE}"
    cat << "EOF"
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║     MOLTBOOK DATASPHERE ACADEMIC - AUTOMATED FORK SETUP         ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
}

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_dependencies() {
    log_info "Verificando dependências..."
    
    local deps=("git" "gh" "node" "npm" "docker" "docker-compose")
    local missing_deps=()
    
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            missing_deps+=("$dep")
        fi
    done
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        log_error "Dependências faltando: ${missing_deps[*]}"
        log_info "Instale as dependências e tente novamente:"
        echo "  - git: https://git-scm.com/downloads"
        echo "  - gh (GitHub CLI): https://cli.github.com/"
        echo "  - node/npm: https://nodejs.org/"
        echo "  - docker: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    log_success "Todas as dependências estão instaladas"
}

check_github_auth() {
    log_info "Verificando autenticação GitHub..."
    
    if ! gh auth status &> /dev/null; then
        log_error "Não autenticado no GitHub CLI"
        log_info "Execute: gh auth login"
        exit 1
    fi
    
    local user=$(gh api user -q .login)
    log_success "Autenticado como: $user"
    
    if [ -z "$USUARIO_GITHUB" ]; then
        USUARIO_GITHUB="$user"
        log_info "Usando usuário GitHub: $USUARIO_GITHUB"
    fi
}

fork_repository() {
    log_info "Criando fork do repositório..."
    
    local repo_destino="$USUARIO_GITHUB/moltbook-datasphereacademic-application"
    
    # Verifica se o fork já existe
    if gh repo view "$repo_destino" &> /dev/null; then
        log_warning "Fork já existe: $repo_destino"
        read -p "Deseja clonar o fork existente? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_error "Setup cancelado"
            exit 1
        fi
    else
        log_info "Criando fork de $REPO_ORIGEM..."
        gh repo fork "$REPO_ORIGEM" --clone=false --default-branch-only
        log_success "Fork criado com sucesso"
    fi
}

clone_repository() {
    log_info "Clonando repositório..."
    
    local repo_url="https://github.com/$USUARIO_GITHUB/moltbook-datasphereacademic-application.git"
    local dir_name="moltbook-datasphereacademic"
    
    if [ -d "$dir_name" ]; then
        log_warning "Diretório $dir_name já existe"
        read -p "Deseja remover e clonar novamente? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf "$dir_name"
        else
            cd "$dir_name"
            return
        fi
    fi
    
    git clone "$repo_url" "$dir_name"
    cd "$dir_name"
    
    # Configura upstream
    git remote add upstream "https://github.com/$REPO_ORIGEM.git" 2>/dev/null || true
    
    log_success "Repositório clonado em: $(pwd)"
}

setup_environment() {
    log_info "Configurando ambiente..."
    
    # Backend
    if [ -d "backend" ]; then
        log_info "Configurando backend..."
        cd backend
        
        if [ ! -f ".env" ]; then
            cp .env.example .env
            log_info "Arquivo .env criado a partir do exemplo"
        fi
        
        log_info "Instalando dependências do backend..."
        npm install
        
        cd ..
    fi
    
    # Frontend
    log_info "Configurando frontend..."
    npm install
    
    log_success "Ambiente configurado"
}

create_github_secrets() {
    log_info "Configurando secrets no GitHub..."
    
    local repo="$USUARIO_GITHUB/moltbook-datasphereacademic-application"
    
    # Gera secrets aleatórios
    local jwt_secret=$(openssl rand -base64 32)
    local mongo_uri="mongodb+srv://user:password@cluster.mongodb.net/moltbook_academic"
    
    log_info "Criando secrets no repositório $repo..."
    
    gh secret set JWT_SECRET --repo="$repo" --body="$jwt_secret" 2>/dev/null || \
        log_warning "JWT_SECRET já existe ou não foi possível criar"
    
    gh secret set MONGODB_URI --repo="$repo" --body="$mongo_uri" 2>/dev/null || \
        log_warning "MONGODB_URI já existe ou não foi possível criar"
    
    log_success "Secrets configurados"
    log_warning "IMPORTANTE: Atualize MONGODB_URI com suas credenciais reais!"
}

setup_docker() {
    log_info "Configurando Docker..."
    
    if [ -f "docker-compose.yml" ]; then
        log_info "Iniciando containers..."
        docker-compose up -d
        log_success "Containers Docker iniciados"
    else
        log_warning "docker-compose.yml não encontrado"
    fi
}

enable_github_actions() {
    log_info "Habilitando GitHub Actions..."
    
    local repo="$USUARIO_GITHUB/moltbook-datasphereacademic-application"
    
    # Habilita Actions no repositório
    gh api "repos/$repo" --method PATCH --field has_actions=true 2>/dev/null || true
    
    log_success "GitHub Actions habilitado"
}

print_next_steps() {
    echo
    echo -e "${GREEN}"
    cat << "EOF"
╔══════════════════════════════════════════════════════════════════╗
║                    SETUP CONCLUÍDO!                              ║
╚══════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    echo
    log_info "Próximos passos:"
    echo
    echo "1. Acesse seu repositório:"
    echo "   https://github.com/$USUARIO_GITHUB/moltbook-datasphereacademic-application"
    echo
    echo "2. Configure o MongoDB:"
    echo "   - Crie uma conta em https://www.mongodb.com/cloud/atlas"
    echo "   - Crie um cluster e obtenha a connection string"
    echo "   - Atualize o secret MONGODB_URI no GitHub"
    echo
    echo "3. Para desenvolvimento local:"
    echo "   cd moltbook-datasphereacademic"
    echo "   npm run dev          # Frontend"
    echo "   cd backend && npm run dev  # Backend"
    echo
    echo "4. Para deploy com Docker:"
    echo "   docker-compose up -d"
    echo
    echo "5. Acesse a aplicação:"
    echo "   Frontend: http://localhost:5173"
    echo "   Backend:  http://localhost:3001"
    echo
    echo "6. Sincronize com upstream:"
    echo "   git fetch upstream"
    echo "   git merge upstream/main"
    echo
}

# ============================================
# EXECUÇÃO PRINCIPAL
# ============================================

main() {
    print_banner
    
    check_dependencies
    check_github_auth
    fork_repository
    clone_repository
    setup_environment
    create_github_secrets
    enable_github_actions
    
    read -p "Deseja iniciar os containers Docker? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        setup_docker
    fi
    
    print_next_steps
}

# Executa o script
main "$@"
