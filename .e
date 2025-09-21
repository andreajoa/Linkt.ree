# Configuração de Ambiente para LinkTree Pro
# Copie este conteúdo para um arquivo .env.local na raiz do projeto

# OpenAI Configuration
OPENAI_API_KEY=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

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-super-secret-jwt-secret-key-here-change-in-production

# Database Configuration (SQLite for development)
DATABASE_URL="file:./dev.db"

# Redis Configuration (Optional - using in-memory cache for development)
# UPSTASH_REDIS_REST_URL=your-redis-url
# UPSTASH_REDIS_REST_TOKEN=your-redis-token

# Stripe Configuration (Optional - for payments)
# STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
# STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# PostHog Analytics (Optional)
# NEXT_PUBLIC_POSTHOG_API_KEY=your-posthog-key
# NEXT_PUBLIC_POSTHOG_API_HOST=https://app.posthog.com

# OAuth Providers (Optional - for social login)
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret
# GITHUB_ID=your-github-client-id
# GITHUB_SECRET=your-github-client-secret

