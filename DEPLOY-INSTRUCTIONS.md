# 🚀 Instruções de Deploy para Vercel

## 📋 Variáveis de Ambiente Necessárias

Configure estas variáveis no dashboard do Vercel:

### 🔐 Obrigatórias:
```
DATABASE_URL=postgresql://user:password@host:port/database
DIRECT_URL=postgresql://user:password@host:port/database
NEXTAUTH_SECRET=sua_chave_secreta_aqui
NEXTAUTH_URL=https://seu-dominio.vercel.app
```

### 🤖 Opcionais (para funcionalidades avançadas):
```
OPENAI_API_KEY=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
GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_client_secret
GITHUB_CLIENT_ID=seu_github_client_id
GITHUB_CLIENT_SECRET=seu_github_client_secret
STRIPE_SECRET_KEY=sk_test_sua_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_sua_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_sua_publishable_key
```

## 🗄️ Configuração do Banco de Dados

### Opção 1: Vercel Postgres (Recomendado)
1. No dashboard do Vercel, vá para "Storage"
2. Clique em "Create Database" → "Postgres"
3. Copie a `DATABASE_URL` e `DIRECT_URL` geradas
4. Cole nas variáveis de ambiente

### Opção 2: Supabase (Gratuito)
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Vá em Settings → Database
4. Copie a connection string
5. Use como `DATABASE_URL` e `DIRECT_URL`

### Opção 3: Neon (Gratuito)
1. Acesse [neon.tech](https://neon.tech)
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Copie a connection string
5. Use como `DATABASE_URL` e `DIRECT_URL`

## 🔧 Passos para Deploy

1. **Conecte o repositório no Vercel:**
   - Vá para [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Importe o repositório `andreajoa/Linkt.ree`

2. **Configure as variáveis de ambiente:**
   - Vá em Settings → Environment Variables
   - Adicione todas as variáveis listadas acima

3. **Configure o banco de dados:**
   - Use uma das opções acima para criar o banco
   - Configure as variáveis `DATABASE_URL` e `DIRECT_URL`

4. **Faça o deploy:**
   - Clique em "Deploy"
   - Aguarde o build completar

## 🎯 Após o Deploy

1. **Acesse sua aplicação:**
   - URL será algo como: `https://linkt-ree.vercel.app`

2. **Teste as funcionalidades:**
   - Homepage deve carregar normalmente
   - Login deve funcionar (se configurado OAuth)
   - Admin dashboard deve estar acessível

## 🆘 Resolução de Problemas

### Erro: "DATABASE_URL references Secret"
- **Solução:** Remova as referências `@database_url` do vercel.json
- **Status:** ✅ Já corrigido no código

### Erro: "Prisma Client not found"
- **Solução:** O build já está configurado para gerar o Prisma Client
- **Status:** ✅ Já corrigido no código

### Erro: "Module not found"
- **Solução:** Use `npm install --legacy-peer-deps` (já configurado)
- **Status:** ✅ Já corrigido no código

## 🎉 Sucesso!

Se tudo estiver configurado corretamente, sua aplicação estará rodando em:
- **URL:** `https://seu-projeto.vercel.app`
- **Admin:** `https://seu-projeto.vercel.app/admin`
- **GitHub:** `https://github.com/andreajoa/Linkt.ree`

## 📞 Suporte

Se ainda houver problemas, verifique:
1. ✅ Todas as variáveis de ambiente estão configuradas
2. ✅ Banco de dados está acessível
3. ✅ Build não apresenta erros
4. ✅ Domínio está funcionando

**🚀 Sua aplicação LinkTree Pro está pronta para escalar para milhões de usuários!**
