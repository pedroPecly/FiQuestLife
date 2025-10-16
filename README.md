# 🎮 FiQuestLife

Aplicativo de gamificação para transformar sua saúde e produtividade em uma aventura épica!

## � Stack Tecnológica

### **Backend**
- **Runtime:** Node.js v20+
- **Framework:** Hono (web framework rápido e leve)
- **Linguagem:** TypeScript
- **Banco de Dados:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Autenticação:** JWT + bcrypt

### **Frontend**
- **Framework:** React Native + Expo
- **Linguagem:** TypeScript
- **Navegação:** Expo Router (file-based routing)
- **HTTP Client:** Axios
- **Storage:** AsyncStorage

---

## 📂 Estrutura do Projeto

```
FiQuestLife/
├── app/                        # Frontend (React Native)
│   ├── screens/               # 📱 Componentes das telas
│   │   ├── LoginScreen.tsx   # Login/Cadastro
│   │   └── ProfileScreen.tsx # Perfil com gamificação
│   ├── styles/               # 🎨 Estilos separados
│   ├── (tabs)/               # Navegação em abas
│   └── index.tsx             # Rota inicial
│
├── components/                # 🧩 Componentes Reutilizáveis
│   ├── ui/                   # 7 componentes de UI
│   │   ├── Button.tsx        # Botão com variantes
│   │   ├── Input.tsx         # Input com ícone e multiline
│   │   ├── Card.tsx          # Container com sombra
│   │   ├── Avatar.tsx        # Avatar circular
│   │   ├── Tag.tsx           # Badge/Tag
│   │   ├── InfoRow.tsx       # Linha de informação
│   │   └── StatBox.tsx       # Caixa de estatística
│   └── layout/
│       └── Header.tsx        # Cabeçalho do app
│
├── backend/                   # Backend (Node.js)
│   ├── src/
│   │   ├── controllers/      # 🎯 Lógica de negócio
│   │   ├── routes/           # 🛣️ Definição de rotas
│   │   ├── middlewares/      # 🔒 Autenticação JWT
│   │   └── lib/              # 🔧 Prisma client
│   ├── prisma/
│   │   ├── schema.prisma     # 🗄️ Schema com gamificação
│   │   └── migrations/       # Histórico de mudanças
│   └── .env                  # 🔐 Variáveis de ambiente
│
└── services/                  # 🌐 Comunicação com API
    ├── api.ts                # ⚠️ ALTERAR IP AQUI
    └── auth.ts               # Gerenciamento de token
```

---

## ⚙️ Setup Inicial

### **1. Instalar Dependências**

```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### **2. Configurar Backend**

O arquivo `backend/.env` já está configurado com banco compartilhado (Supabase). Rode as migrations:

```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

### **3. ⚠️ Configurar IP Local (IMPORTANTE)**

Descubra seu IP local:

```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

Edite `services/api.ts` e **altere o IP**:

```typescript
// services/api.ts
const API_URL = 'http://192.168.1.XX:3000'; // ← TROCAR PARA SEU IP
```

### **4. Rodar os Projetos**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npx expo start
```

### **5. Testar no Celular**

1. Instale **Expo Go** no celular
2. Conecte na **mesma rede Wi-Fi** do PC
3. Escaneie o QR code no terminal

---

## 🔧 Onde Modificar o Código

### **Alterar IP do servidor**
📁 `services/api.ts` → linha 11

```typescript
const API_URL = 'http://SEU_IP_AQUI:3000';
```

### **Adicionar novo campo no banco**
📁 `backend/prisma/schema.prisma`

```prisma
model User {
  id       String @id @default(uuid())
  email    String @unique
  username String @unique
  novocampo String?  // ← Adicionar aqui
}
```

Depois rode:
```bash
cd backend
npx prisma migrate dev --name add_novocamp
npx prisma generate
```

### **Criar nova tela**
1. Criar componente em `app/screens/NovaTela.tsx`
2. Criar estilos em `app/styles/nova-tela.styles.ts`
3. Criar rota em `app/nova-tela.tsx`

### **Adicionar novo endpoint**
1. Criar controller em `backend/src/controllers/`
2. Criar rota em `backend/src/routes/`
3. Registrar no `backend/src/index.ts`

### **Alterar cores/estilos**
📁 `app/styles/*.styles.ts` e `constants/theme.ts`

---

## 🗄️ Banco de Dados

### **Schema Atual (com Gamificação)**

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  username  String   @unique
  name      String?
  password  String
  bio       String?
  avatarUrl String?
  
  // Gamificação
  xp            Int      @default(0)
  coins         Int      @default(0)
  level         Int      @default(1)
  currentStreak Int      @default(0)
  longestStreak Int      @default(0)
  lastActiveDate DateTime?
  
  // Configurações
  notificationsEnabled Boolean @default(true)
  dailyReminderTime    String?
  profilePublic        Boolean @default(false)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### **Migrations Aplicadas**
- ✅ `20251016122028_add_username` - Adicionou campo username
- ✅ `20251016131113_add_gamification_fields` - Sistema de gamificação completo

### **Comandos Úteis**

```bash
# Visualizar banco de dados
npx prisma studio

# Criar migration
npx prisma migrate dev --name nome_da_alteracao

# Resetar banco (CUIDADO!)
npx prisma migrate reset

# Limpar todos os usuários
echo "TRUNCATE TABLE users RESTART IDENTITY CASCADE;" | npx prisma db execute --schema=prisma\schema.prisma --stdin
```

---

## 🔐 Endpoints da API

| Método | Rota              | Auth | Descrição                |
|--------|-------------------|------|--------------------------|
| GET    | `/`               | ❌   | Health check             |
| POST   | `/auth/register`  | ❌   | Cadastrar usuário        |
| POST   | `/auth/login`     | ❌   | Login (email ou username)|
| GET    | `/user/me`        | ✅   | Dados do usuário logado  |

### **Exemplo de Requisição**

**Cadastro:**
```json
POST /auth/register
{
  "email": "usuario@email.com",
  "username": "usuario_teste",
  "password": "123456",
  "name": "Nome Completo"  // Opcional
}
```

**Resposta:**
```json
{
  "message": "Usuário cadastrado com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "usuario@email.com",
    "username": "usuario_teste",
    "name": "Nome Completo",
    "xp": 0,
    "coins": 0,
    "level": 1,
    "currentStreak": 0,
    "longestStreak": 0,
    "createdAt": "2025-10-16T..."
  }
}
```

**Login (email ou username):**
```json
POST /auth/login
{
  "identifier": "usuario@email.com",  // ou "usuario_teste"
  "password": "123456"
}
```

---

## 🐛 Troubleshooting

### **Erro: "Network request failed"**
- ✅ Backend está rodando?
- ✅ IP em `services/api.ts` está correto?
- ✅ Celular e PC na mesma rede Wi-Fi?

### **Erro 409 (Conflict)**
- Email ou username já existe no banco
- Solução: Use outro email/username ou limpe o banco

### **Prisma Client não atualiza**
```bash
cd backend
npx prisma generate
```

Depois reinicie o TypeScript Server no VS Code:
- `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

---

## 📝 Comandos Rápidos

```bash
# Instalar dependências
npm install && cd backend && npm install && cd ..

# Rodar migrations
cd backend && npx prisma migrate deploy && npx prisma generate && cd ..

# Iniciar tudo (2 terminais)
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
npx expo start

# Limpar cache do Expo
npx expo start -c

# Visualizar banco
cd backend && npx prisma studio
```

---

## 🎯 Funcionalidades Implementadas

### **Autenticação**
- ✅ Sistema de autenticação JWT (7 dias)
- ✅ Login com email OU username
- ✅ Cadastro com: email, username, nome (opcional), senha
- ✅ Senha criptografada com bcrypt
- ✅ Validações: email válido, username alfanumérico, senha 6+ chars
- ✅ Armazenamento seguro de token (AsyncStorage)
- ✅ Proteção de rotas com middleware JWT

### **Interface**
- ✅ 8 componentes reutilizáveis (7 UI + 1 Layout)
- ✅ Design gamificado com ícones e cores
- ✅ Alertas compatíveis Web + Mobile
- ✅ Loading states em botões
- ✅ Enter key submete formulários
- ✅ Erros específicos e informativos
- ✅ Redução de ~40% de código via componentização

### **Perfil e Gamificação**
- ✅ Sistema de XP e Level (prontos para uso)
- ✅ Sistema de Moedas
- ✅ Streak tracking (sequência de dias)
- ✅ 6 estatísticas visíveis: Sequência, Level, XP, Moedas, Recorde, Dias
- ✅ Avatar com iniciais do usuário
- ✅ Configurações: notificações, perfil público
- ✅ Logout com confirmação

### **Código e Organização**
- ✅ 100% TypeScript
- ✅ Código componentizado e reutilizável
- ✅ Zero console.logs (25+ removidos)
- ✅ Exports centralizados (index.ts)
- ✅ Migrations versionadas
- ✅ Documentação completa

## 🚀 Próximos Passos

- [ ] Tela de edição de perfil (bio, avatar, configs)
- [ ] Upload de foto de avatar
- [ ] Sistema de Desafios (UserChallenge)
- [ ] Badges/Conquistas (UserBadge)
- [ ] Customização de avatar (UserAvatarItem)
- [ ] Histórico de recompensas (RewardHistory)
- [ ] Feed de atividades (ActivityFeed)
- [ ] Sistema automático de Level Up
- [ ] Streak tracking automático (daily check-in)
- [ ] Notificações push

---

**Desenvolvido com ❤️ por Pedro e equipe**
