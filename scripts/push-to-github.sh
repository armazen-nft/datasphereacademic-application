#!/bin/bash

# ============================================
# PUSH TO GITHUB - MOLTBOOK DATASPHERE
# ============================================
# Script para fazer push do código para o fork

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# ============================================
# CONFIGURAÇÃO
# ============================================
REPO_URL="${1:-}"
BRANCH="${2:-main}"

if [ -z "$REPO_URL" ]; then
    log_error "Uso: ./push-to-github.sh <url-do-seu-fork> [branch]"
    echo ""
    echo "Exemplo:"
    echo "  ./push-to-github.sh https://github.com/seu-usuario/moltbook-datasphereacademic-application.git"
    exit 1
fi

log_info "Repositório destino: $REPO_URL"
log_info "Branch: $BRANCH"

# ============================================
# VERIFICAÇÕES
# ============================================

# Verifica se é um repositório git
if [ ! -d ".git" ]; then
    log_info "Inicializando repositório git..."
    git init
    git branch -M $BRANCH
fi

# Configura remote
log_info "Configurando remote origin..."
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"

# Verifica se há mudanças para commit
if [ -z "$(git status --porcelain)" ]; then
    log_warning "Nenhuma mudança para commit"
else
    log_info "Arquivos modificados:"
    git status --short
    
    echo ""
    read -p "Deseja fazer commit de todas as mudanças? (y/n) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "Adicionando arquivos..."
        git add .
        
        read -p "Mensagem do commit [Initial commit]: " commit_msg
        commit_msg=${commit_msg:-"Initial commit"}
        
        git commit -m "$commit_msg"
        log_success "Commit criado: $commit_msg"
    fi
fi

# ============================================
# PUSH
# ============================================

log_info "Fazendo push para $REPO_URL..."

# Tenta push normal
git push -u origin $BRANCH 2>/dev/null || {
    log_warning "Push falhou, tentando com force..."
    read -p "Deseja fazer force push? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push -u origin $BRANCH --force
    else
        log_error "Push cancelado"
        exit 1
    fi
}

log_success "Push concluído com sucesso!"

# ============================================
# VERIFICAÇÃO
# ============================================

echo ""
log_info "Verificando repositório remoto..."
git remote -v

echo ""
log_info "Últimos commits:"
git log --oneline -5

echo ""
echo -e "${GREEN}"
cat << "EOF"
╔══════════════════════════════════════════════════════════════════╗
║                    PUSH CONCLUÍDO!                               ║
╚══════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo "Acesse seu repositório:"
echo "  $REPO_URL"
echo ""
