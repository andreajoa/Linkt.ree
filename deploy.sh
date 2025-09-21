#!/bin/bash

echo "Preparando deploy para Vercel..."

# Verificar se o CLI da Vercel está instalado
if ! command -v vercel &> /dev/null; then
    echo "Instalando Vercel CLI..."
    npm install -g vercel
fi

# Construir o projeto
echo "Construindo o projeto..."
npm run build

# Deploy para Vercel
echo "Realizando deploy para Vercel..."
vercel --prod

echo "Deploy concluído! Acesse sua aplicação na URL fornecida acima."