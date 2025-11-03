# 🎮 FiQuestLife

Aplicativo de gamificação para transformar sua saúde e produtividade em uma aventura épica!

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)

---

## ✨ Funcionalidades

### **🎯 Gamificação**
- XP, Níveis e Moedas Virtuais
- Streaks diários com sistema de recompensas
- Sistema de Level Up automático (1000 XP/nível)

### **🏆 Desafios e Conquistas**
- 43 desafios em 8 categorias (Física, Nutrição, Hidratação, Mental, Sono, Social, Produtividade, Mindfulness)
- 5 desafios diários atribuídos automaticamente
- 29 badges com 4 níveis de raridade (Common, Rare, Epic, Legendary)
- Progresso em tempo real e histórico completo

### **👥 Social**
- Feed de atividades dos amigos em tempo real
- Sistema completo de amizades (busca, solicitações, gerenciamento)
- Perfis públicos/privados com controle de privacidade
- Rankings de amigos e global (XP, Streak, Desafios)
- Navegação recursiva entre perfis

### **🔔 Notificações**
- Lembretes diários agendados (9h e 21h)
- Notificações de conquistas e level up
- Navegação inteligente integrada

### **🔒 Segurança**
- Autenticação JWT com refresh automático
- Rate limiting (5 limiters configurados)
- Validação UUID e sanitização de inputs
- Controle de privacidade de perfis

### **🎨 Interface**
- 30+ componentes reutilizáveis
- 12 telas completas e responsivas
- Design iOS/Android/Web
- Safe area handling e estados vazios padronizados

---

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
├── app/                        # 📱 Frontend (React Native + Expo Router)
│   ├── (tabs)/                # Navegação em abas (file-based routing)
│   │   ├── _layout.tsx       # Layout das tabs (Home, Desafios, Explorar, Configurações)
│   │   ├── index.tsx         # Tab Home (ProfileScreen)
│   │   ├── challenges.tsx    # 🆕 Tab Desafios (ChallengesScreen)
│   │   ├── badges.tsx        # 🆕 Tab Badges (BadgesScreen) - Sprint 7
│   │   ├── explore.tsx       # Tab Explorar
│   │   └── settings.tsx      # ⚙️ Tab Configurações (5 seções organizadas em cards)
│   ├── screens/               # 📱 Componentes das telas
│   │   ├── index.ts          # Barrel export
│   │   ├── ActivityFeedScreen.tsx # 🆕 Feed de atividades dos amigos (Sprint 11)
│   │   ├── BadgesScreen.tsx  # 🆕 Tela de badges/conquistas (Sprint 7)
│   │   ├── ChallengesScreen.tsx # 🆕 Tela de desafios diários (Sprint 6)
│   │   ├── EditProfileScreen.tsx # ✏️ Edição de perfil profissional
│   │   ├── FriendProfileScreen.tsx # 🆕 Perfil de amigo (Sprint 11)
│   │   ├── FriendsScreen.tsx # 🆕 Tela principal de amigos (Sprint 11)
│   │   ├── LoginScreen.tsx   # Login/Cadastro com validações
│   │   ├── ProfileScreen.tsx # Perfil com gamificação e stats
│   │   └── RewardHistoryScreen.tsx # 🆕 Tela de histórico de recompensas (Sprint 10)
│   ├── styles/                # 🎨 Estilos separados por tela
│   │   ├── index.ts          # Barrel export
│   │   ├── login.styles.ts   # Estilos do LoginScreen
│   │   ├── profile.styles.ts # Estilos do ProfileScreen
│   │   ├── edit-profile.styles.ts # Estilos do EditProfileScreen
│   │   ├── settings.styles.ts # Estilos do SettingsScreen
│   │   ├── challenges.styles.ts # 🆕 Estilos do ChallengesScreen
│   │   ├── badges.styles.ts  # 🆕 Estilos do BadgesScreen
│   │   ├── reward-history.styles.ts # 🆕 Estilos do RewardHistoryScreen (Sprint 10)
│   │   ├── reward-card.styles.ts # 🆕 Estilos do RewardCard (Sprint 10)
│   │   └── explore.styles.ts # 🆕 Estilos do ExploreScreen
│   ├── _layout.tsx           # Layout raiz do app
│   ├── index.tsx             # Rota inicial (redirect)
│   ├── edit-profile.tsx      # Rota para EditProfileScreen
│   ├── challenges.tsx        # 🆕 Rota para ChallengesScreen
│   └── badges.tsx            # 🆕 Rota para BadgesScreen
│
├── components/                # 🧩 Componentes Reutilizáveis
│   ├── ui/                   # 27 componentes de UI (+7 Sprint 11)
│   │   ├── index.ts          # Barrel export de todos os componentes
│   │   ├── ActivityFeedItem.tsx # 🆕 Item de atividade de amigo (Sprint 11)
│   │   ├── AlertModal.tsx    # Modal profissional de alertas (4 tipos)
│   │   ├── Avatar.tsx        # Avatar circular com iniciais
│   │   ├── BadgeCard.tsx     # 🆕 Card de badge/conquista com progresso (Sprint 7)
│   │   ├── BadgeItem.tsx     # 🆕 Item de badge reutilizável (2 variantes: full/mini)
│   │   ├── Button.tsx        # Botão com variantes (primary, secondary, danger)
│   │   ├── Card.tsx          # Container com sombra e padding
│   │   ├── ChallengeCard.tsx # 🆕 Card de desafio com badges e botão de completar
│   │   ├── DateInput.tsx     # Input de data com formatação DD/MM/YYYY
│   │   ├── EmptyState.tsx    # 🆕 Estado vazio genérico reutilizável (Sprint 11)
│   │   ├── FriendCard.tsx    # 🆕 Card de amigo com stats (Sprint 11)
│   │   ├── FriendRequestCard.tsx # 🆕 Card de solicitação de amizade (Sprint 11)
│   │   ├── InfoRow.tsx       # Linha de informação (label + valor)
│   │   ├── Input.tsx         # Input com ícone e multiline + efeitos foco
│   │   ├── LoadingScreen.tsx # Tela de loading reutilizável
│   │   ├── LogoutButton.tsx  # Botão de logout com confirmação
│   │   ├── NotificationBell.tsx # 🆕 Sino de notificações com badge count (Sprint 9)
│   │   ├── NotificationFeed.tsx # 🆕 Feed modal de notificações (Sprint 9)
│   │   ├── NotificationItem.tsx # 🆕 Item individual de notificação (Sprint 9)
│   │   ├── ProfileAvatar.tsx # 🆕 Avatar com upload de foto (galeria/câmera)
│   │   ├── RewardCard.tsx    # 🆕 Card individual de recompensa (Sprint 10)
│   │   ├── SearchBar.tsx     # 🆕 Barra de busca completa reutilizável (Sprint 11)
│   │   ├── SettingsMenuItem.tsx # 🆕 Item de menu para telas de configurações
│   │   ├── StatBox.tsx       # Caixa de estatística gamificada
│   │   ├── Tag.tsx           # Badge/Tag com ícone
│   │   ├── UserSearchCard.tsx # 🆕 Card de resultado de busca de usuário (Sprint 11)
│   │   └── UserStatsRow.tsx  # 🆕 Linha de stats do usuário reutilizável (Sprint 11)
│   └── layout/
│       ├── index.ts          # Barrel export
│       └── Header.tsx        # Cabeçalho do app com NotificationBell
│
├── hooks/                     # 🎣 Hooks Personalizados
│   ├── useAlert.ts           # Hook para gerenciamento de alertas
│   ├── useImagePicker.ts     # 🆕 Hook para upload de fotos (galeria/câmera)
│   ├── useNotifications.ts   # 🆕 Hook para sistema de notificações (Sprint 9)
│   ├── use-color-scheme.ts   # Hook para detecção de tema (claro/escuro)
│   ├── use-color-scheme.web.ts # Versão web do hook de tema
│   └── use-theme-color.ts    # Hook para cores temáticas
│
├── types/                     # 📝 Definições de Tipos TypeScript
│   └── user.ts               # Interface User (compartilhada)
│
├── utils/                     # 🛠️ Funções Utilitárias
│   ├── dateUtils.ts          # Formatação e cálculos de datas
│   ├── dialog.ts             # Helpers para dialogs (legado)
│   └── validators.ts         # Validações (email, username, password, etc)
│
├── services/                  # 🌐 Comunicação com API
│   ├── api.ts                # ⚠️ ALTERAR IP AQUI - Axios + endpoints
│   ├── auth.ts               # Gerenciamento de token JWT + AsyncStorage
│   ├── badge.ts              # 🆕 Serviço de badges (Sprint 7)
│   ├── challenge.ts          # 🆕 Serviço de desafios (Sprint 6)
│   ├── friend.ts             # 🆕 Serviço de amigos completo (Sprint 11)
│   ├── notificationCenter.ts # 🆕 Histórico de notificações in-app (Sprint 9)
│   ├── notifications.ts      # 🆕 Serviço de notificações push (Sprint 9)
│   └── reward.ts             # 🆕 Serviço de histórico de recompensas (Sprint 10)
│
├── constants/                 # 🎨 Constantes e Temas
│   ├── responsive.ts         # Breakpoints e helpers responsivos
│   └── theme.ts              # Cores e estilos globais
│
├── assets/                    # 🖼️ Recursos estáticos
│   └── images/               # Ícones, logos, splash screens
│
├── backend/                   # 🔧 Backend (Node.js + Hono)
│   ├── src/
│   │   ├── controllers/      # 🎯 Controladores da API
│   │   │   ├── auth.controller.ts       # Login, Register, Profile
│   │   │   ├── badge.controller.ts      # 🆕 Gerenciamento de badges (3 endpoints)
│   │   │   ├── challenge.controller.ts  # 🆕 Gerenciamento de desafios (4 endpoints)
│   │   │   ├── friend.controller.ts     # 🆕 Gerenciamento de amigos (12 endpoints - Sprint 11)
│   │   │   └── health.controller.ts     # Health check
│   │   ├── services/         # 🔧 Lógica de Negócio
│   │   │   ├── badge.service.ts         # 🆕 3 funções de badges (168 linhas)
│   │   │   ├── challenge.service.ts     # 🆕 8 funções de desafios (457 linhas)
│   │   │   └── friend.service.ts        # 🆕 12 funções de amigos (530 linhas - Sprint 11)
│   │   ├── routes/           # 🛣️ Definição de rotas
│   │   │   ├── auth.ts                  # Rotas de autenticação
│   │   │   ├── badge.routes.ts          # 🆕 Rotas de badges (protegidas)
│   │   │   ├── challenge.routes.ts      # 🆕 Rotas de desafios (protegidas)
│   │   │   ├── friend.routes.ts         # 🆕 Rotas de amigos (protegidas - Sprint 11)
│   │   │   ├── health.ts                # Health check
│   │   │   └── user.ts                  # Rotas de usuário (protegidas)
│   │   ├── middlewares/      # 🔒 Middlewares
│   │   │   ├── auth.middleware.ts       # Validação JWT
│   │   │   └── error.middleware.ts      # Tratamento de erros
│   │   ├── lib/              # 🔧 Clientes e utilitários
│   │   │   ├── prisma.ts                # Prisma Client
│   │   │   └── supabase.ts              # Supabase Client
│   │   └── index.ts          # Entry point do servidor (rotas registradas)
│   ├── prisma/
│   │   ├── schema.prisma     # 🗄️ Schema do banco de dados (10 models)
│   │   ├── seed.ts           # 🌱 Seed de badges (29 badges)
│   │   ├── seed-challenges.ts # 🆕 Seed de desafios (43 desafios em 8 categorias)
│   │   ├── migrations/       # Histórico de mudanças do DB (7 migrations)
│   │   │   ├── migration_lock.toml
│   │   │   ├── 20251016122028_add_username/
│   │   │   ├── 20251016131113_add_gamification_fields/
│   │   │   ├── 20251016152857_add_challenges/
│   │   │   ├── 20251017122341_make_name_and_birthdate_required/
│   │   │   ├── 20251017145006_add_badges_and_rewards/
│   │   │   ├── 20251017145348_fix_reward_and_badge_models/
│   │   │   └── 20251101_add_friends_system/ # 🆕 Sistema de amigos (Sprint 11)
│   │   └── scripts/
│   │       └── clear-database.sql # Script para limpar DB
│   ├── .env                  # 🔐 Variáveis de ambiente (não versionado)
│   ├── .env.example          # Exemplo de variáveis de ambiente
│   ├── package.json          # Dependências do backend + scripts de seed
│   └── tsconfig.json         # Configuração TypeScript do backend
│
├── .expo/                     # Cache do Expo (não versionado)
├── .vscode/                   # Configurações do VS Code
├── node_modules/              # Dependências (não versionado)
├── app.json                   # Configuração do Expo
├── expo-env.d.ts             # Tipos do Expo
├── eslint.config.js          # Configuração ESLint
├── package.json               # Dependências do frontend
├── tsconfig.json              # Configuração TypeScript do frontend
├── roadmap_fiquestlife.md     # 🗺️ Roadmap completo (detalhes de implementação)
└── README.md                  # 📖 Este arquivo
```

---

## 🚀 Setup Rápido

### **1. Pré-requisitos**
- Node.js v20+
- Conta no [Supabase](https://supabase.com) (PostgreSQL gratuito)

### **2. Instalação**

```bash
# Clone e instale dependências
git clone https://github.com/pedroPecly/FiQuestLife.git
cd FiQuestLife
npm install
cd backend && npm install && cd ..
```

### **3. Configurar Backend**

Crie `backend/.env` (use `.env.example` como base):

```env
DATABASE_URL="postgresql://postgres:senha@db.projeto.supabase.co:5432/postgres"
SUPABASE_URL=https://projeto.supabase.co
SUPABASE_ANON_KEY=sua_chave
JWT_SECRET=chave_secreta_aleatoria
PORT=3000
```

Sincronize o banco de dados:

```bash
cd backend
npx prisma migrate deploy  # Aplica migrations
npx prisma generate        # Gera Prisma Client
npm run prisma:seed        # Popula badges e desafios
npm run prisma:seed-challenges
cd ..
```

### **4. Configurar IP do Frontend**

Descubra seu IP local e configure `services/api.ts`:

```bash
# Windows
ipconfig  # Procure "Endereço IPv4"

# Mac/Linux
ifconfig
```

Edite `services/api.ts` e altere a linha 8:

```typescript
const API_URL = 'http://192.168.1.XXX:3000/api';  // Seu IP aqui
```

### **5. Rodar o Projeto**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npx expo start
```

Escaneie o QR Code com o app Expo Go (iOS/Android) ou pressione:
- `a` para Android Emulator
- `i` para iOS Simulator
- `w` para Web

---

## 📱 Uso do App

1. **Cadastre-se** - Crie uma conta com nome, username e senha
2. **Complete desafios** - Ganhe XP e moedas
3. **Desbloqueie badges** - Conquiste 29 badges únicos
4. **Adicione amigos** - Busque por @username
5. **Acompanhe o feed** - Veja atividades dos amigos
6. **Suba no ranking** - Compare-se com amigos e globalmente

---

## 🆕 Últimas Atualizações

### **Novembro de 2025**
- ✅ **Feed Social Completo** - Timeline de atividades dos amigos com 4 tipos
- ✅ **Perfis Públicos** - Visualização completa de perfis com controle de privacidade
- ✅ **Leaderboard Backend** - Rankings de amigos e global com 3 tipos de ordenação
- ✅ **Camada de Segurança** - Rate limiting, validação UUID, sanitização de inputs
- ✅ **Sistema de Amigos** - Rede social completa (12 endpoints, 3 telas, 7 componentes)
- ✅ **Componentização** - UserStatsRow, SearchBar, EmptyState, SimpleHeader reutilizáveis

### **Outubro de 2025**
- ✅ **Histórico de Recompensas** - Tela completa com filtros e paginação infinita
- ✅ **Notificações Push** - Sistema completo com 5 tipos e lembretes agendados
- ✅ **Sistema de Badges** - 29 conquistas em 5 categorias com 4 raridades
- ✅ **Edição de Perfil** - Upload de foto, validações, campos completos
- ✅ **Desafios Diários** - 43 desafios em 8 categorias com atribuição automática
- ✅ **Gamificação Base** - XP, níveis, moedas, streaks completos

---

## 📄 Licença

MIT License - Veja o arquivo LICENSE para mais detalhes.

---

**Desenvolvido com ❤️ por Pedro e equipe**
