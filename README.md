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
- 50 desafios em 8 categorias (Física, Nutrição, Hidratação, Mental, Sono, Social, Produtividade, Meditação)
- **7 desafios sociais auto-verificáveis** que completam automaticamente ao realizar ações no app:
  - 🎯 Desafiar um Amigo (convite enviado)
  - 🤝 Aceitar um Desafio (convite aceito)
  - ❤️ Curtir uma Postagem (like no feed)
  - 💬 Comentar em uma Postagem (comentário enviado)
  - 👥 Conectar-se com um Novo Amigo (amizade criada)
  - 🎉 Conquistar uma Nova Badge (badge desbloqueado)
  - 🔥 Manter sua Sequência (3+ desafios completados)
- 28 desafios com verificação por foto obrigatória (hidratação, exercícios, refeições)
- Sistema de upload de fotos com Supabase Storage
- Legendas opcionais para compartilhar contexto
- 5 desafios diários atribuídos automaticamente
- **Sistema de Convites de Desafios:**
  - Desafie amigos com seus desafios diários
  - Cada amigo pode ser desafiado 1x por dia
  - Cada desafio pode desafiar 1 pessoa por dia
  - Desafios auto-verificáveis não mostram botão "Concluir"
- **47 badges progressivos** organizados em 6 séries:
  - **Série Curtidas (6 badges):** Curtir 1, 25, 100, 500, 2500, 10000 postagens
  - **Série Comentários (6 badges):** Comentar 1, 25, 100, 500, 2500, 10000 vezes
  - **Série Amizades (6 badges):** Adicionar 1, 5, 20, 100, 500, 2000 amigos
  - **Série Desafios Enviados (6 badges):** Enviar 1, 10, 50, 250, 1000, 5000 convites
  - **Série Desafios Aceitos (6 badges):** Aceitar 1, 10, 50, 250, 1000, 5000 convites
  - **Série Sequência (6 badges):** Completar 3+ desafios em 1, 7, 30, 100, 365, 1000 dias
- 29 badges tradicionais com 4 níveis de raridade (Common, Rare, Epic, Legendary)
- Progresso em tempo real e histórico completo
- Sistema de auto-verificação com eventos rastreados no banco

### **👥 Social**
- Feed de atividades dos amigos em tempo real
- Sistema de upload de fotos para desafios com verificação
- Feed exibe fotos e legendas das conquistas
- Curtidas e comentários (limitado a 1 comentário por usuário por post)
- Sistema completo de amizades (busca, solicitações, gerenciamento)
- **Sistema de Convites de Desafios:**
  - Envie convites de desafios aos seus amigos
  - Aceite ou rejeite convites recebidos
  - Cada amigo pode receber 1 convite por dia
  - Cada desafio pode ser usado para 1 convite por dia
  - Badge visual indica desafios recebidos de amigos
  - Histórico completo de convites enviados/recebidos
- Perfis públicos/privados com controle de privacidade
- Rankings de amigos e global (XP, Streak, Desafios)
- Navegação recursiva entre perfis

### **🔔 Notificações**
- Sistema completo de notificações push (Expo Push API)
- Notificações in-app com histórico persistente
- 8 tipos de notificações (curtidas, comentários, amizades, conquistas, level up, streaks)
- Notificações de desafios completados desativadas por padrão
- Lembretes diários agendados (9h e 21h)
- Badge counter em tempo real
- Registro automático de push tokens
- Remoção de tokens ao fazer logout
- Proteção contra duplicatas (5 segundos)

### **🔒 Segurança**
- Autenticação JWT com refresh automático
- Rate limiting (5 limiters configurados)
- Validação UUID e sanitização de inputs
- Controle de privacidade de perfis

### **🎨 Interface**
- 35+ componentes reutilizáveis (TabBar, FilterBar, BottomSheetModal, NotificationItem, ActivityRewardBadges, PhotoCaptureModal)
- 12 telas completas e responsivas
- Design iOS/Android/Web
- Melhorias de UX no teclado (dismiss ao clicar fora, KeyboardAvoidingView em modais)
- Safe area handling e estados vazios padronizados
- Componentização profissional e arquitetura escalável

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
│   ├── ui/                   # 35 componentes de UI
│   │   ├── index.ts          # Barrel export de todos os componentes
│   │   ├── ActivityFeedItem.tsx # 🆕 Item de atividade de amigo (Sprint 11)
│   │   ├── ActivityRewardBadges.tsx # 🆕 Badges de XP/Coins reutilizáveis (Sprint 13)
│   │   ├── AlertModal.tsx    # Modal profissional de alertas (4 tipos)
│   │   ├── Avatar.tsx        # Avatar circular com iniciais
│   │   ├── BadgeCard.tsx     # 🆕 Card de badge/conquista com progresso (Sprint 7)
│   │   ├── BadgeDetailModal.tsx # 🆕 Modal de detalhes do badge
│   │   ├── BadgeItem.tsx     # 🆕 Item de badge reutilizável (2 variantes: full/mini)
│   │   ├── BottomSheetModal.tsx # 🆕 Modal bottom sheet genérico (Sprint 13)
│   │   ├── Button.tsx        # Botão com variantes (primary, secondary, danger)
│   │   ├── Card.tsx          # Container com sombra e padding
│   │   ├── ChallengeCard.tsx # 🆕 Card de desafio com auto-verify badge
│   │   ├── ChallengeInvitesModal.tsx # 🆕 Modal de convites de desafios
│   │   ├── CommentModal.tsx  # 🆕 Modal de comentários em atividades (Sprint 12)
│   │   ├── DateInput.tsx     # Input de data com formatação DD/MM/YYYY
│   │   ├── EmptyState.tsx    # 🆕 Estado vazio genérico reutilizável (Sprint 11)
│   │   ├── FeedActivityCard.tsx # 🆕 Card de atividade do feed (Sprint 12)
│   │   ├── FilterBar.tsx     # 🆕 Barra de filtros horizontal reutilizável (Sprint 13)
│   │   ├── FriendCard.tsx    # 🆕 Card de amigo com stats (Sprint 11)
│   │   ├── FriendRequestCard.tsx # 🆕 Card de solicitação de amizade (Sprint 11)
│   │   ├── InfoRow.tsx       # Linha de informação (label + valor)
│   │   ├── Input.tsx         # Input com ícone e multiline + efeitos foco
│   │   ├── LeaderboardCard.tsx # 🆕 Card de ranking com posição (Sprint 12)
│   │   ├── LoadingScreen.tsx # Tela de loading reutilizável
│   │   ├── LogoutButton.tsx  # Botão de logout com confirmação
│   │   ├── NotificationBell.tsx # 🆕 Sino de notificações com badge count (Sprint 9)
│   │   ├── NotificationItem.tsx # 🆕 Item de notificação reutilizável (Sprint 13)
│   │   ├── NotificationsModal.tsx # 🆕 Modal de notificações (Sprint 9/13)
│   │   ├── PhotoCaptureModal.tsx # 🆕 Modal de captura/seleção de foto com legenda (Sprint 15)
│   │   ├── ProfileAvatar.tsx # 🆕 Avatar com upload de foto (galeria/câmera)
│   │   ├── RewardCard.tsx    # 🆕 Card individual de recompensa (Sprint 10)
│   │   ├── SearchBar.tsx     # 🆕 Barra de busca completa reutilizável (Sprint 11)
│   │   ├── SelectFriendModal.tsx # 🆕 Modal de seleção de amigo para convite
│   │   ├── SettingsMenuItem.tsx # 🆕 Item de menu para telas de configurações
│   │   ├── StatBox.tsx       # Caixa de estatística gamificada
│   │   ├── TabBar.tsx        # 🆕 Sistema de abas horizontal reutilizável (Sprint 13)
│   │   ├── Tag.tsx           # Badge/Tag com ícone
│   │   ├── UserSearchCard.tsx # 🆕 Card de resultado de busca de usuário (Sprint 11)
│   │   └── UserStatsRow.tsx  # 🆕 Linha de stats do usuário reutilizável (Sprint 11)
│   └── layout/
│       ├── index.ts          # Barrel export
│       ├── Header.tsx        # Cabeçalho do app com NotificationBell
│       └── SimpleHeader.tsx  # 🆕 Cabeçalho simples sem notificações (Sprint 12)
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
│   ├── challengeInvitation.ts # 🆕 Serviço de convites de desafios
│   ├── feed.ts               # 🆕 Serviço de feed social (Sprint 12)
│   ├── feedInteractions.ts   # 🆕 Serviço de curtidas/comentários (Sprint 12)
│   ├── friend.ts             # 🆕 Serviço de amigos completo (Sprint 11)
│   ├── leaderboard.ts        # 🆕 Serviço de rankings (Sprint 12)
│   ├── localNotificationStorage.ts # 🆕 Armazenamento local de notificações
│   ├── notificationNavigation.ts # 🆕 Navegação de notificações (Sprint 14)
│   ├── notifications.ts      # 🆕 Serviço de notificações push (Sprint 9)
│   ├── pushToken.ts          # 🆕 Gerenciamento de tokens push (Sprint 13)
│   ├── reward.ts             # 🆕 Serviço de histórico de recompensas (Sprint 10)
│   └── userProfile.ts        # 🆕 Serviço de perfis públicos (Sprint 12)
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
│   │   │   ├── challenge-invitation.controller.ts # 🆕 Convites de desafios (5 endpoints)
│   │   │   ├── feed.controller.ts       # 🆕 Feed de atividades (Sprint 12)
│   │   │   ├── friend.controller.ts     # 🆕 Gerenciamento de amigos (12 endpoints - Sprint 11)
│   │   │   ├── health.controller.ts     # Health check
│   │   │   ├── leaderboard.controller.ts # 🆕 Rankings (Sprint 12)
│   │   │   ├── notification.controller.ts # 🆕 Notificações backend (Sprint 13)
│   │   │   ├── push-token.controller.ts # 🆕 Gerenciamento de tokens push (Sprint 13)
│   │   │   ├── reward.controller.ts     # 🆕 Histórico de recompensas (3 endpoints - Sprint 10)
│   │   │   └── user.controller.ts       # 🆕 Perfis públicos (Sprint 12)
│   │   ├── services/         # 🔧 Lógica de Negócio
│   │   │   ├── auto-verify.service.ts   # 🆕 Auto-verificação de desafios sociais (354 linhas)
│   │   │   ├── badge.service.ts         # 🆕 3 funções de badges (168 linhas)
│   │   │   ├── challenge.service.ts     # 🆕 8 funções de desafios (457 linhas)
│   │   │   ├── challenge-invitation.service.ts # 🆕 Convites de desafios (474 linhas)
│   │   │   ├── expo-push.service.ts     # 🆕 Serviço Expo Push API (Sprint 13)
│   │   │   ├── feed.service.ts          # 🆕 Feed social (Sprint 12)
│   │   │   ├── friend.service.ts        # 🆕 12 funções de amigos (774 linhas - Sprint 11)
│   │   │   ├── leaderboard.service.ts   # 🆕 Rankings (Sprint 12)
│   │   │   ├── notification.service.ts  # 🆕 Notificações com proteção duplicatas (Sprint 13)
│   │   │   └── reward.service.ts        # 🆕 3 funções de recompensas (161 linhas - Sprint 10)
│   │   ├── routes/           # 🛣️ Definição de rotas
│   │   │   ├── auth.ts                  # Rotas de autenticação
│   │   │   ├── badge.routes.ts          # 🆕 Rotas de badges (protegidas)
│   │   │   ├── challenge.routes.ts      # 🆕 Rotas de desafios (protegidas)
│   │   │   ├── challenge-invitation.routes.ts # 🆕 Rotas de convites (protegidas)
│   │   │   ├── feed.routes.ts           # 🆕 Rotas de feed (protegidas - Sprint 12)
│   │   │   ├── friend.routes.ts         # 🆕 Rotas de amigos (protegidas - Sprint 11)
│   │   │   ├── health.ts                # Health check
│   │   │   ├── leaderboard.routes.ts    # 🆕 Rotas de rankings (protegidas - Sprint 12)
│   │   │   ├── notification.routes.ts   # 🆕 Rotas de notificações (protegidas - Sprint 13)
│   │   │   ├── push-token.routes.ts     # 🆕 Rotas de tokens push (protegidas - Sprint 13)
│   │   │   ├── reward.ts                # 🆕 Rotas de recompensas (protegidas - Sprint 10)
│   │   │   └── user.ts                  # Rotas de usuário e perfis públicos (protegidas)
│   │   ├── middlewares/      # 🔒 Middlewares
│   │   │   ├── auth.middleware.ts       # Validação JWT
│   │   │   ├── error.middleware.ts      # Tratamento de erros
│   │   │   └── rate-limit.middleware.ts # 🆕 Rate limiting (5 limiters - Sprint 12)
│   │   ├── lib/              # 🔧 Clientes e utilitários
│   │   │   ├── prisma.ts                # Prisma Client
│   │   │   ├── supabase.ts              # Supabase Client
│   │   │   └── validation.ts            # 🆕 Validação UUID e sanitização (Sprint 12)
│   │   └── index.ts          # Entry point do servidor (rotas registradas)
│   ├── prisma/
│   │   ├── schema.prisma     # 🗄️ Schema do banco de dados (12 models)
│   │   ├── seed.ts           # 🌱 Seed de badges (29 badges tradicionais)
│   │   ├── add-badges.ts     # 🆕 Seed de badges progressivos (18 badges sociais)
│   │   ├── seed-challenges.ts # 🆕 Seed de desafios (43 desafios base)
│   │   ├── add-challenges.ts # 🆕 Seed de desafios sociais auto-verificáveis (7 desafios)
│   │   ├── migrations/       # Histórico de mudanças do DB (11 migrations)
│   │   │   ├── migration_lock.toml
│   │   │   ├── 20251016122028_add_username/
│   │   │   ├── 20251016131113_add_gamification_fields/
│   │   │   ├── 20251016152857_add_challenges/
│   │   │   ├── 20251017122341_make_name_and_birthdate_required/
│   │   │   ├── 20251017145006_add_badges_and_rewards/
│   │   │   ├── 20251017145348_fix_reward_and_badge_models/
│   │   │   ├── 20251101_add_friends_system/ # 🆕 Sistema de amigos (Sprint 11)
│   │   │   ├── 20251201_add_challenge_invitations/ # 🆕 Convites de desafios
│   │   │   ├── 20251201_add_social_features/ # 🆕 Auto-verificação (autoVerifiable, verificationEvent)
│   │   │   ├── 20251201_make_imageurl_optional/ # 🆕 Badge.imageUrl opcional
│   │   │   └── 20251201_add_social_badge_enums/ # 🆕 BadgeCategory.SOCIAL + BadgeRequirementType.EVENT_COUNT
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
- Conta no [Supabase](https://supabase.com)

### **2. Instalação**

```bash
git clone https://github.com/pedroPecly/FiQuestLife.git
cd FiQuestLife
npm install
cd backend && npm install && cd ..
```

### **3. Configurar Variáveis de Ambiente**

O projeto usa 2 arquivos `.env` (frontend + backend):

```bash
# 1. Backend - Copie e edite com credenciais do Supabase
cp backend/.env.example backend/.env

# 2. Frontend - Copie e edite com seu IP local
cp .env.example .env
```

**Obter credenciais do Supabase:**
- Crie um projeto em [supabase.com](https://supabase.com)
- **Settings** → **API**: copie `Project URL` e chaves `anon`/`service_role`
- **Settings** → **Database** → **Connection String**: copie a URI
- Preencha `backend/.env` com essas credenciais

**Configurar IP local no `.env` (raiz):**
```bash
# Windows: ipconfig | Mac/Linux: ifconfig
# Substitua 192.168.1.100 pelo SEU IP
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000
```

### **4. Configurar Banco de Dados**

```bash
cd backend
npx prisma migrate deploy
npx prisma generate
npm run prisma:seed
npm run prisma:seed-challenges
cd ..
```

### **5. Rodar o Projeto**

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
npx expo start
```

Escaneie o QR Code no Expo Go ou pressione `a` (Android) / `i` (iOS) / `w` (Web)

---

## 🔧 Troubleshooting

**Network Error:** Backend rodando? IP correto no `.env`? Mesma rede Wi-Fi?  
**Prisma Client not generated:** `cd backend && npx prisma generate`  
**Can't reach database:** Verifique `DATABASE_URL` no `backend/.env`  
**JWT must be provided:** Adicione `JWT_SECRET` no `backend/.env`  
**Tela branca:** `npx expo start -c` (limpa cache)

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

### **Dezembro de 2025**
- ✅ **Sistema de Identificação de Convites no Feed** (02/12/2025)
  - **Badge visual "Desafiado por @usuario"** em posts que vieram de convites:
    - Aparece no feed de amigos (FeedActivityCard)
    - Aparece em "Meus Posts" (tab Explorar)
    - Badge compacto com ícone de troféu 🏆 e borda laranja
    - Posicionado ao lado do tipo do desafio para layout harmonioso
  - **Distinção visual no ChallengeCard:**
    - Badge "desafiado por @usuario" integrado ao header
    - Layout flexível com categoria, dificuldade e badge de convite
    - Estilo consistente (branco com borda laranja)
  - **Backend otimizado:**
    - friend.service.ts: busca ChallengeInvitation com status ACCEPTED
    - user-activity.service.ts: inclui invitedBy nos "Meus Posts"
    - Queries eficientes com Map para lookup O(1)
    - Campo invitedBy opcional na interface FeedActivity
  - **Sistema de limpeza de convites implementado:**
    - Convites rejeitados → Deletados imediatamente (não ocupa espaço)
    - Convites aceitos + desafio completado > 7 dias → Deletados automaticamente
    - Convites pendentes > 7 dias → Deletados automaticamente
    - Job de limpeza: cleanup-invitations.job.ts (execução manual/agendada)
    - Rota /challenge-invitations/cleanup para admin
    - Documentação completa: INVITATIONS_CLEANUP_STRATEGY.md
    - Reduz crescimento da tabela de ~12k/ano para ~50-200 registros ativos
  - **Bug crítico corrigido:** Desafios auto-verificáveis não apareciam no feed
    - Causa: auto-verify.service.ts usava source "CHALLENGE_COMPLETED" (errado)
    - Correção: Mudado para "CHALLENGE_COMPLETION" (nomenclatura correta)
    - Correção: sourceId agora usa userChallenge.id ao invés de challenge.id
    - Impacto: Agora todas as atividades auto-verificáveis aparecem no feed
  - **Segurança e profissionalismo:**
    - Todas as queries com Prisma ORM (previne SQL Injection)
    - Validações de permissão adequadas
    - Performance otimizada com índices e Maps
    - Dados críticos (UserChallenge, RewardHistory) preservados
    - Sistema de archive opcional para histórico de longo prazo

- ✅ **Sistema de Auto-Verificação e Badges Progressivos** (01/12/2025)
  - **7 desafios sociais auto-verificáveis** que completam automaticamente:
    - Enviar convite de desafio (CHALLENGE_INVITE_SENT)
    - Aceitar convite de desafio (CHALLENGE_INVITE_ACCEPTED)
    - Curtir postagem no feed (POST_LIKED)
    - Comentar em postagem (POST_COMMENTED)
    - Adicionar novo amigo (FRIENDSHIP_CREATED)
    - Desbloquear badge (BADGE_EARNED)
    - Completar 3+ desafios diários (DAILY_CHALLENGES_COMPLETED)
  - **18 badges progressivos em 6 séries** com contadores de eventos:
    - Curtidas: 1, 25, 100, 500, 2500, 10000
    - Comentários: 1, 25, 100, 500, 2500, 10000
    - Amizades: 1, 5, 20, 100, 500, 2000
    - Desafios Enviados: 1, 10, 50, 250, 1000, 5000
    - Desafios Aceitos: 1, 10, 50, 250, 1000, 5000
    - Sequência: 1, 7, 30, 100, 365, 1000 dias
  - **Sistema de Convites de Desafios:**
    - Envie convites de desafios aos amigos
    - Modal dedicado para aceitar/rejeitar convites
    - Badge visual indica desafios recebidos de amigos
    - Validações: 1 convite/amigo/dia, 1 convite/desafio/dia
    - Botão de desafiar amigo em cada ChallengeCard
    - Histórico completo no banco (ChallengeInvitation)
  - **Backend auto-verify.service.ts (354 linhas):**
    - verifyAndCompleteChallenge: completa desafio + atualiza XP/coins
    - checkAndAwardBadges: conta eventos + verifica requisitos + concede badges
    - handleSocialEvent: dispara ambos em paralelo
    - Integrado em 3 serviços (challenge-invitation, feed, friend)
    - Transações atômicas com Prisma $transaction
    - Auditoria completa via RewardHistory
  - **Schema do banco atualizado:**
    - Challenge: +autoVerifiable (Boolean), +verificationEvent (String?)
    - Badge: +requiredCount (Int?), +event (String?), +requirement (String?), +icon (String?), +xpReward/coinsReward (Int), +imageUrl (String? opcional)
    - ChallengeInvitation: model completo (8 campos)
    - BadgeCategory enum: +SOCIAL
    - BadgeRequirementType enum: +EVENT_COUNT
  - **UX melhorada:**
    - Desafios auto-verificáveis mostram badge verde "Completa automaticamente"
    - Botão "Concluir" escondido para desafios auto-verificáveis
    - Alertas de sucesso removidos (aceitar/rejeitar convites)
    - SelectFriendModal reutilizável para convites
  - **4 migrations aplicadas:** add_social_features, make_imageurl_optional, add_social_badge_enums, challenge_invitations
  - **2 seeds criados:** add-challenges.ts (7 desafios sociais), add-badges.ts (18 badges progressivos)
  - Código production-ready com segurança (rate limiting, validação, duplicatas)

### **Novembro de 2025**
- ✅ **Sprint 15: Sistema de Fotos para Desafios** (12/11/2025)
  - Upload de fotos obrigatório para 28 desafios (60% do total)
  - Supabase Storage com bucket "challenge-photos"
  - PhotoCaptureModal profissional (câmera/galeria + legenda opcional)
  - Validação de arquivos (JPEG/PNG/WebP, 5MB max)
  - Feed exibe fotos e legendas das conquistas
  - ChallengeCard com badge de foto e trigger automático
  - Backend com multipart/form-data handling
  - Melhorias de UX no teclado iOS (dismiss ao clicar fora, KeyboardAvoidingView)
  - Limitação de 1 comentário por usuário por post
  - Notificações de desafios completados desativadas
  - Código profissional com JSDoc e TypeScript
- ✅ **Sprint 13: Notificações Push + Componentização** (04/11/2025)
  - Sistema completo de notificações push com Expo Push API
  - Registro automático de tokens no backend
  - Envio de push notifications em tempo real (curtidas, comentários, amizades)
  - Proteção contra notificações duplicadas (5 segundos)
  - Componentização profissional: NotificationItem, BottomSheetModal, ActivityRewardBadges
  - TabBar com variante "card" (bordas arredondadas, sombra, estado ativo azul)
  - NotificationsModal refatorado (100 linhas removidas)
  - FeedActivityCard refatorado (40 linhas removidas)
  - Arquitetura escalável e código limpo
  - Correção de navegação de notificações com timestamp único
- ✅ **Feed Social Completo** - Timeline de atividades dos amigos com 4 tipos
- ✅ **Perfis Públicos** - Visualização completa de perfis com controle de privacidade
- ✅ **Leaderboard Backend** - Rankings de amigos e global com 3 tipos de ordenação
- ✅ **Camada de Segurança** - Rate limiting, validação UUID, sanitização de inputs
- ✅ **Sistema de Amigos** - Rede social completa (12 endpoints, 3 telas, 7 componentes)
- ✅ **Componentização** - UserStatsRow, SearchBar, EmptyState, SimpleHeader reutilizáveis

### **Outubro de 2025**
- ✅ **Histórico de Recompensas** - Tela completa com filtros e paginação infinita
- ✅ **Sistema de Notificações** - Push notifications com 5 tipos e lembretes agendados
- ✅ **Sistema de Badges** - 29 conquistas em 5 categorias com 4 raridades
- ✅ **Edição de Perfil** - Upload de foto, validações, campos completos
- ✅ **Desafios Diários** - 43 desafios em 8 categorias com atribuição automática
- ✅ **Gamificação Base** - XP, níveis, moedas, streaks completos

---

**Desenvolvido com ❤️ por Pedro Pecly e Gabriel Purificate**
