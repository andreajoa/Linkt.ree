# 🚀 LinkTree Pro - Plataforma Cutting-Edge

Uma plataforma moderna e escalável de "Link in Bio" com funcionalidades avançadas de IA, templates cutting-edge, sistema de pagamentos e analytics profissionais.

## ✨ Funcionalidades

### 🎨 Templates Cutting-Edge
- **10 Templates Premium**: Glassmorphism, Neumorphism, Cyberpunk, Holographic, Synthwave, Liquid Morph, etc.
- **Customização Avançada**: Cores, fontes, animações, backgrounds
- **Responsivo** e otimizado para mobile

### 🖱️ Editor Visual Drag & Drop
- **Interface Webflow-like** com DND Kit
- **12+ Tipos de Blocos**: Links, Social, E-commerce, Email, Calendar, QR Code, Streaming, etc.
- **Preview em Tempo Real**
- **Reordenação por arrastar**

### 🤖 IA Integrada (OpenAI)
- **Geração de Bio** automática
- **Recomendações de Estilo** e cores
- **Análise de Performance**
- **Sugestões de Conteúdo**
- **A/B Testing** inteligente

### 💳 Sistema de Pagamentos (Stripe)
- **Checkout Sessions** completo
- **Webhooks** para eventos
- **Assinaturas e Produtos**
- **Doações e Tips**

### 📊 Analytics Profissionais
- **Tracking em Tempo Real**
- **Heatmaps de Cliques**
- **Análise de Conversão**
- **Cohort Analysis**
- **A/B Testing** avançado

### 🔐 Autenticação e Segurança
- **NextAuth.js** com Google + GitHub
- **Rate Limiting** e Headers de Segurança
- **Middleware** customizado
- **GDPR Compliant**

### 🛒 E-commerce Nativo
- **Produtos Digitais** e Físicos
- **Carrinho Integrado**
- **Inventory Tracking**
- **Download Automático**

### 📱 Social Media Integration
- **Instagram, TikTok, YouTube, Twitter**
- **Live Counters**
- **Auto-preview** de posts
- **OAuth Integration**

## 🛠️ Stack Tecnológica

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (produção) / SQLite (desenvolvimento)
- **Cache**: Redis (Upstash)
- **Auth**: NextAuth.js
- **Payments**: Stripe
- **AI**: OpenAI GPT-4
- **Styling**: Tailwind CSS + Framer Motion
- **Deploy**: Vercel

## 🚀 Deploy Rápido

### Opção 1: Deploy no Vercel (Recomendado)

1. **Fork este repositório** no GitHub
2. **Conecte ao Vercel**:
   ```bash
   npx vercel
   ```
3. **Configure as variáveis de ambiente** no Vercel:
   - `OPENAI_API_KEY`: Sua chave da OpenAI
   - `NEXTAUTH_SECRET`: Uma string secreta aleatória
   - `DATABASE_URL`: URL do PostgreSQL (PlanetScale recomendado)
   - `STRIPE_SECRET_KEY`: Chave secreta do Stripe
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Chave pública do Stripe

### Opção 2: Deploy Manual

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/linktree-pro.git
   cd linktree-pro
   ```

2. **Instale as dependências**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure o ambiente**:
   ```bash
   cp env-setup.txt .env.local
   # Edite .env.local com suas chaves
   ```

4. **Configure o banco de dados**:
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Execute em desenvolvimento**:
   ```bash
   npm run dev
   ```

## 📋 Configuração das Variáveis de Ambiente

### Obrigatórias
```env
OPENAI_API_KEY=sk-or-v1-sua-chave-aqui
NEXTAUTH_SECRET=seu-jwt-secret-super-secreto
DATABASE_URL=postgresql://usuario:senha@host:porta/database
```

### Opcionais (para funcionalidades avançadas)
```env
# Stripe (para pagamentos)
STRIPE_SECRET_KEY=sk_test_sua-chave-secreta
STRIPE_WEBHOOK_SECRET=whsec_seu-webhook-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_sua-chave-publica

# OAuth (para login social)
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret
GITHUB_ID=seu-github-client-id
GITHUB_SECRET=seu-github-client-secret

# Redis (para cache)
UPSTASH_REDIS_REST_URL=sua-url-redis
UPSTASH_REDIS_REST_TOKEN=seu-token-redis

# Analytics
NEXT_PUBLIC_POSTHOG_API_KEY=sua-chave-posthog
NEXT_PUBLIC_POSTHOG_API_HOST=https://app.posthog.com
```

## 🗄️ Configuração do Banco de Dados

### Para Desenvolvimento (SQLite)
```bash
npm run db:generate
npm run db:push
```

### Para Produção (PostgreSQL)
1. **Crie um banco PostgreSQL** (PlanetScale, Supabase, ou Railway)
2. **Atualize `DATABASE_URL`** no `.env.local`
3. **Execute as migrações**:
   ```bash
   npm run db:migrate
   ```

## 🎯 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento
npm run build            # Build para produção
npm run start            # Inicia servidor de produção

# Banco de dados
npm run db:generate      # Gera cliente Prisma
npm run db:push          # Aplica schema ao banco
npm run db:migrate       # Executa migrações
npm run db:studio        # Interface visual do banco

# Deploy
./deploy-vercel.sh       # Deploy automatizado no Vercel

# Stripe (desenvolvimento)
npm run stripe:listen    # Escuta webhooks do Stripe
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── api/               # API Routes
│   ├── u/[username]/      # Páginas públicas dos usuários
│   └── admin/             # Painel administrativo
├── components/            # Componentes React
│   ├── editor/            # Editor drag & drop
│   ├── templates/         # Templates de páginas
│   └── ui/                # Componentes base
├── lib/                   # Utilities e configurações
│   ├── ai.ts              # Integração OpenAI
│   ├── auth.ts            # Configuração NextAuth
│   ├── prisma.ts          # Cliente Prisma
│   └── stripe.ts          # Integração Stripe
└── store/                 # Estado global (Zustand)
```

## 🔧 Configuração Adicional

### Stripe Webhooks
1. **Configure webhooks** no dashboard do Stripe
2. **URL**: `https://seu-dominio.com/api/webhooks/stripe`
3. **Eventos**: `checkout.session.completed`, `customer.subscription.*`

### OAuth Providers
1. **Google**: Configure no Google Cloud Console
2. **GitHub**: Configure no GitHub Developer Settings

### Domínio Customizado
1. **Configure no Vercel** ou seu provedor
2. **Atualize `NEXTAUTH_URL`** com o domínio correto

## 🚀 Performance e Escalabilidade

A aplicação está otimizada para **milhões de usuários**:

- **Cache Redis** multi-layer
- **CDN** otimizado (Vercel Edge Network)
- **Database indexing** e particionamento
- **Rate limiting** avançado
- **Image optimization** automática
- **Bundle splitting** inteligente

## 📊 Monitoramento

- **Vercel Analytics** para performance
- **Sentry** para error tracking (configurável)
- **PostHog** para analytics de produto
- **Logs estruturados** para debugging

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

- **Documentação**: [Wiki do projeto](https://github.com/seu-usuario/linktree-pro/wiki)
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/linktree-pro/issues)
- **Discord**: [LinkTree Pro Community](https://discord.gg/linktree-pro)

---

**Desenvolvido com ❤️ usando as mais modernas tecnologias web**