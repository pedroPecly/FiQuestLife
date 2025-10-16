# 🎮 FiQuestLife

Aplicativo de gamificação para transformar sua saúde e produtividade em uma aventura épica!

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)

## 🎯 Stack Tecnológica

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
│   ├── ui/                   # 8 componentes de UI
│   │   ├── Button.tsx        # Botão com variantes (primary, secondary, danger)
│   │   ├── Input.tsx         # Input com ícone e multiline
│   │   ├── Card.tsx          # Container com sombra e padding
│   │   ├── Avatar.tsx        # Avatar circular com iniciais
│   │   ├── Tag.tsx           # Badge/Tag com ícone
│   │   ├── InfoRow.tsx       # Linha de informação (label + valor)
│   │   ├── StatBox.tsx       # Caixa de estatística gamificada
│   │   └── LoadingScreen.tsx # Tela de loading reutilizável
│   └── layout/
│       └── Header.tsx        # Cabeçalho do app
│
├── utils/                     # 🛠️ Funções Utilitárias
│   ├── validators.ts         # Validações (email, username, password, etc)
│   ├── dateUtils.ts          # Formatação e cálculos de datas
│   └── dialog.ts             # Alertas compatíveis Web + Mobile
│
├── backend/                   # Backend (Node.js + Hono)
│   ├── src/
│   │   ├── controllers/      # 🎯 Lógica de negócio
│   │   │   ├── auth.controller.ts   # Login, Register, Profile
│   │   │   └── health.controller.ts # Health check
│   │   ├── routes/           # 🛣️ Definição de rotas
│   │   │   ├── auth.ts       # Rotas de autenticação
│   │   │   ├── user.ts       # Rotas de usuário (protegidas)
│   │   │   └── health.ts     # Health check
│   │   ├── middlewares/      # 🔒 Middlewares
│   │   │   ├── auth.middleware.ts   # Validação JWT
│   │   │   └── error.middleware.ts  # Tratamento de erros
│   │   └── lib/              # 🔧 Clientes e utilitários
│   │       ├── prisma.ts     # Prisma Client
│   │       └── supabase.ts   # Supabase Client
│   ├── prisma/
│   │   ├── schema.prisma     # 🗄️ Schema (User + Challenge System)
│   │   └── migrations/       # Histórico de mudanças do DB
│   └── .env                  # 🔐 Variáveis de ambiente
│
└── services/                  # 🌐 Comunicação com API
    ├── api.ts                # ⚠️ ALTERAR IP AQUI
    └── auth.ts               # Gerenciamento de token
```

---

## ⚙️ Configurações do Projeto

### 🔐 Estrutura do arquivo `.env` do backend

O arquivo `.env` deve ficar na pasta `backend` e conter:

```env
# URL de conexão do banco de dados PostgreSQL (Supabase)
DATABASE_URL="postgresql://usuario:senha@host:porta/database"

# Exemplo para Supabase:
# DATABASE_URL="postgresql://postgres:senha_super_secreta@db.xxxxx.supabase.co:5432/postgres"
```

**Como obter a URL do Supabase:**
- Acesse o painel do Supabase
- Vá em "Project Settings" > "Database" > "Connection string"
- Copie a string de conexão PostgreSQL

> ⚠️ Não compartilhe o arquivo `.env` publicamente. Mantenha a senha segura!

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

### **Schema Atual (User + Challenge System)**

```prisma
// ENUMs para o sistema de desafios
enum ChallengeCategory {
  PHYSICAL_ACTIVITY
  NUTRITION
  HYDRATION
  MENTAL_HEALTH
  SLEEP
  SOCIAL
  PRODUCTIVITY
  MINDFULNESS
}

enum ChallengeDifficulty { EASY MEDIUM HARD EXPERT }
enum ChallengeFrequency { DAILY WEEKLY MONTHLY ONE_TIME }
enum ChallengeStatus { PENDING IN_PROGRESS COMPLETED FAILED SKIPPED }

// Modelo de Usuário
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
  
  // Relações
  userChallenges UserChallenge[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Catálogo de Desafios
model Challenge {
  id          String              @id @default(uuid())
  title       String
  description String
  category    ChallengeCategory
  difficulty  ChallengeDifficulty
  xpReward    Int
  coinsReward Int
  isActive    Boolean             @default(true)
  frequency   ChallengeFrequency  @default(DAILY)
  
  userChallenges UserChallenge[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Relação N:N User <-> Challenge
model UserChallenge {
  id          String          @id @default(uuid())
  userId      String
  challengeId String
  status      ChallengeStatus @default(PENDING)
  assignedAt  DateTime        @default(now())
  completedAt DateTime?
  progress    Int             @default(0)
  notes       String?
  
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  challenge Challenge @relation(fields: [challengeId], references: [id], onDelete: Cascade)
  
  @@unique([userId, challengeId, assignedAt])
  @@index([userId, status])
  @@index([assignedAt])
}
```

### **Migrations Aplicadas**
- ✅ `20251016122028_add_username` - Adicionou campo username
- ✅ `20251016131113_add_gamification_fields` - Sistema de gamificação completo
- ✅ `20251016152857_add_challenges` - Sistema de desafios (Challenge + UserChallenge)

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

| Método | Rota              | Auth | Descrição                         |
|--------|-------------------|------|-----------------------------------|
| GET    | `/`               | ❌   | Health check (status da API)      |
| GET    | `/health`         | ❌   | Health check detalhado            |
| POST   | `/auth/register`  | ❌   | Cadastrar usuário                 |
| POST   | `/auth/login`     | ❌   | Login (email ou username)         |
| GET    | `/auth/me`        | ✅   | Perfil do usuário logado          |
| GET    | `/user/me`        | ✅   | Perfil do usuário logado (alias)  |

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
- ✅ Backend está rodando? (`cd backend && npm run dev`)
- ✅ IP em `services/api.ts` está correto?
- ✅ Celular e PC na mesma rede Wi-Fi?
- ✅ Firewall bloqueando porta 3000?

### **Erro 409 (Conflict)**
- Email ou username já existe no banco
- Solução: Use outro email/username ou limpe o banco

### **Erro: "Alert.alert não funciona no navegador"**
- ✅ Use `showAlert()` ou `showConfirm()` de `utils/dialog.ts`
- ✅ Compatível com Web (window.alert/confirm) e Mobile (Alert.alert)

### **Botão de Logout não funciona**
- ✅ Corrija com `showConfirm()` de `utils/dialog.ts`
- ✅ `Alert.alert()` NÃO funciona no navegador web

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
- ✅ 8 componentes reutilizáveis de UI (Button, Input, Card, Avatar, Tag, InfoRow, StatBox, LoadingScreen)
- ✅ 1 componente de Layout (Header)
- ✅ Design gamificado com ícones e cores vibrantes
- ✅ Alertas compatíveis Web + Mobile (`utils/dialog.ts`)
- ✅ Loading states em botões e telas
- ✅ Enter key submete formulários
- ✅ Erros específicos e informativos
- ✅ Logout funcionando em todas as plataformas
- ✅ Redução de ~40% de código via componentização

### **Utilitários**
- ✅ `utils/validators.ts` - 6 validadores (email, username, password, nome, telefone)
- ✅ `utils/dateUtils.ts` - 7 funções de data (formatação, cálculos, tempo relativo)
- ✅ `utils/dialog.ts` - 6 funções de diálogo (alert, confirm, error, success, warning, info)

### **Perfil e Gamificação**
- ✅ Sistema de XP e Level (prontos para uso)
- ✅ Sistema de Moedas
- ✅ Streak tracking (sequência de dias)
- ✅ 6 estatísticas visíveis: Sequência, Level, XP, Moedas, Recorde, Dias
- ✅ Avatar com iniciais do usuário
- ✅ Configurações: notificações, perfil público
- ✅ Logout com confirmação

### **Banco de Dados**
- ✅ Sistema de desafios completo (ENUMs + Models)
- ✅ 4 ENUMs: ChallengeCategory (8 tipos), ChallengeDifficulty (4 níveis), ChallengeFrequency (4 tipos), ChallengeStatus (5 estados)
- ✅ Model Challenge: catálogo de desafios com recompensas
- ✅ Model UserChallenge: relação N:N com tracking de progresso
- ✅ Constraints e índices para performance
- ✅ Migrations versionadas e documentadas

### **Código e Organização**
- ✅ 100% TypeScript (frontend + backend)
- ✅ Código altamente componentizado e reutilizável
- ✅ Utils centralizados (validators, dateUtils, dialog)
- ✅ Exports organizados (index.ts)
- ✅ Documentação inline com JSDoc
- ✅ README completo e atualizado

## 🚀 Próximos Passos

### **Sprint 3 - API de Desafios**
- [ ] Endpoints CRUD de desafios (criar, listar, editar, deletar)
- [ ] Atribuir desafios ao usuário
- [ ] Atualizar progresso de desafios
- [ ] Completar desafios e ganhar recompensas (XP + coins)
- [ ] Sistema automático de Level Up

### **Sprint 4 - Interface de Desafios**
- [ ] Tela de listagem de desafios disponíveis
- [ ] Tela de desafios ativos do usuário
- [ ] Tela de progresso de desafio individual
- [ ] Animações de conclusão e recompensa
- [ ] Filtros por categoria e dificuldade

### **Futuras Funcionalidades**
- [ ] Tela de edição de perfil (bio, avatar, configs)
- [ ] Upload de foto de avatar
- [ ] Badges/Conquistas (UserBadge)
- [ ] Customização de avatar (UserAvatarItem)
- [ ] Histórico de recompensas (RewardHistory)
- [ ] Feed de atividades (ActivityFeed)
- [ ] Streak tracking automático (daily check-in)
- [ ] Notificações push
- [ ] Sistema de amigos e ranking
- [ ] Loja de itens com moedas

---

**Desenvolvido com ❤️ por Pedro e equipe**
