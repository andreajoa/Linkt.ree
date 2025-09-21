#!/bin/bash

# 🚀 Script de Deploy Simplificado para LinkTree Pro
# Este script automatiza o deploy no Vercel com configurações mínimas

set -e

echo "🚀 Iniciando deploy do LinkTree Pro..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se o Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI não encontrado. Instalando...${NC}"
    npm install -g vercel
fi

# Verificar se está logado no Vercel
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Você precisa fazer login no Vercel.${NC}"
    echo -e "${BLUE}📝 Abra o link que aparecerá e faça login:${NC}"
    vercel login
fi

# Verificar se o arquivo .env.local existe
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env.local não encontrado.${NC}"
    echo -e "${BLUE}📝 Copiando configuração de exemplo...${NC}"
    cp env-setup.txt .env.local
    echo -e "${RED}❌ IMPORTANTE: Edite o arquivo .env.local com suas chaves antes de continuar!${NC}"
    echo -e "${BLUE}📝 Pressione Enter quando terminar de configurar...${NC}"
    read
fi

# Build local para testar
echo -e "${BLUE}🔨 Testando build local...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build local bem-sucedido!${NC}"
else
    echo -e "${RED}❌ Erro no build local. Corrija os erros antes de continuar.${NC}"
    exit 1
fi

# Deploy no Vercel
echo -e "${BLUE}🚀 Fazendo deploy no Vercel...${NC}"
vercel --prod

# Verificar se o deploy foi bem-sucedido
if [ $? -eq 0 ]; then
    echo -e "${GREEN}🎉 Deploy concluído com sucesso!${NC}"
    echo -e "${BLUE}📝 Próximos passos:${NC}"
    echo -e "   1. Configure as variáveis de ambiente no dashboard do Vercel"
    echo -e "   2. Configure um banco PostgreSQL (PlanetScale recomendado)"
    echo -e "   3. Configure as chaves do Stripe para pagamentos"
    echo -e "   4. Configure OAuth providers para login social"
    echo -e ""
    echo -e "${GREEN}✅ Sua aplicação está no ar!${NC}"
else
    echo -e "${RED}❌ Erro no deploy. Verifique os logs acima.${NC}"
    exit 1
fi

