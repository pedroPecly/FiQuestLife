# 🎮 FiQuestLife

Aplicativo de gamificação para transformar sua saúde e produtividade em uma aventura épica!

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)

---

## ✨ Funcionalidades Principais

### **Sistema de Gamificação Completo** 🎯
- ✅ **XP e Níveis** - Ganhe experiência e suba de nível
- ✅ **Moedas Virtuais** - Acumule coins completando desafios
- ✅ **Streaks** - Mantenha sequências diárias de atividade
- ✅ **Sistema de Level Up** - Progresso automático (1000 XP por nível)

### **Desafios Diários** 🏆
- ✅ **43 Desafios** em 8 categorias diferentes
- ✅ **5 Desafios por Dia** atribuídos automaticamente
- ✅ **Categorias:** Atividade Física, Nutrição, Hidratação, Saúde Mental, Sono, Social, Produtividade, Mindfulness
- ✅ **Dificuldades:** Easy, Medium, Hard, Expert
- ✅ **Recompensas:** XP e moedas ao completar
- ✅ **Progresso Visual** com barra de conclusão diária

### **Sistema de Badges** 🏅
- ✅ **29 Badges/Conquistas** disponíveis
- ✅ **4 Raridades:** Common, Rare, Epic, Legendary
- ✅ **6 Tipos de Requisitos:** Desafios completados, Streaks, Nível, XP, Mestre de Categoria
- ✅ **Galeria Completa** com filtros (Todos/Conquistados/Bloqueados)
- ✅ **Progresso em Tempo Real** - Veja quantos % falta para desbloquear
- ✅ **Modal de Detalhes** - Informações completas de cada badge
- ✅ **Badges em Destaque** - 5 badges mais recentes no perfil do usuário

### **Histórico de Recompensas** 📜
- ✅ **Tela Dedicada** com histórico completo
- ✅ **Filtros Inteligentes** - Todos, XP, Moedas, Conquistas
- ✅ **Estatísticas Agregadas** - Total de recompensas, XP, moedas, badges
- ✅ **Animações Suaves** - Slide horizontal ao trocar filtros
- ✅ **Paginação Infinita** - Scroll infinito com 20 itens por vez
- ✅ **Pull-to-Refresh** - Atualize puxando para baixo
- ✅ **20+ Fontes Mapeadas** - Descrições contextuais (desafios, level up, streaks, etc)
- ✅ **Estados Vazios** - Mensagens específicas por filtro

### **Sistema de Amigos** 👥 ⭐ NOVO!
- ✅ **Busca de Usuários** - Busca inteligente por @username ou nome (debounce 500ms, mínimo 2 caracteres)
- ✅ **Solicitações de Amizade** - Sistema completo de enviar, aceitar, rejeitar e cancelar
- ✅ **Lista de Amigos** - Visualização com stats (level, XP, streak atual, moedas)
- ✅ **Status Dinâmicos** - Amigos, Pendente, Enviado, Bloqueado (calculado no backend)
- ✅ **Perfil de Amigos** - Tela dedicada com 4 StatBoxes, data de amizade, amigos em comum
- ✅ **Feed de Atividades** - Timeline de desafios, badges e recompensas dos amigos
- ✅ **Filtros de Feed** - Todos, Desafios, Badges, Recompensas (4 filtros com ícones)
- ✅ **Paginação Infinita** - Scroll infinito com 20 atividades por vez
- ✅ **Pull-to-Refresh** - Atualização em todas as telas
- ✅ **Validações Robustas** - Limite de 500 amigos, não duplicar, bloqueio
- ✅ **3 Tabs Organizadas** - Buscar, Solicitações (Recebidas/Enviadas), Amigos
- ✅ **Amigos em Comum** - Visualização de conexões mútuas (scroll horizontal)
- ✅ **Notificações Visuais** - Badge vermelho na tab para solicitações pendentes
- ✅ **Navegação Recursiva** - Explorar perfis de amigos de amigos
- ✅ **Estados Vazios** - Mensagens contextuais e onboarding
- ✅ **12 Endpoints REST** - API completa de amizades
- ✅ **Amizade Bidirecional** - Sistema otimizado com dois registros (performance)

### **Perfil e Estatísticas** 👤
- ✅ **Perfil Completo** com avatar, nome, username
- ✅ **Upload de Foto** via galeria ou câmera
- ✅ **Stats de Gamificação:** Level, XP, Coins, Streak atual, Recorde de streak
- ✅ **Badges Recentes** com scroll horizontal
- ✅ **Edição de Perfil** profissional com validações
- ✅ **Botão de Histórico** - Acesso rápido ao histórico de recompensas

### **Sistema de Notificações Push** 🔔
- ✅ **5 Tipos de Notificações** implementadas
- ✅ **Lembretes Diários** agendados (9h e 21h)
- ✅ **Notificações Instantâneas** (badges, level up)
- ✅ **Navegação Inteligente** ao tocar nas notificações
- ✅ **Toggle em Configurações** com persistência
- ✅ **Permissões iOS/Android** gerenciadas automaticamente
- ✅ **Canal Android** configurado com som e vibração

### **Autenticação e Segurança** 🔒
- ✅ **Login/Cadastro** com validação completa
- ✅ **JWT Authentication** com refresh automático
- ✅ **Senhas criptografadas** com bcrypt
- ✅ **Validações:** Email, username único, senha forte

### **Interface Profissional** 🎨
- ✅ **20 Componentes UI** reutilizáveis
- ✅ **8 Telas Completas** - Login, Perfil, Editar Perfil, Desafios, Badges, Histórico, Explorar, Configurações
- ✅ **Design Responsivo** (iOS/Android/Web)
- ✅ **Navegação por Tabs** (5 tabs principais)
- ✅ **Modal de Detalhes** integrado no BadgesScreen
- ✅ **Animações Fluidas** com React Native Animated API
- ✅ **Dark Mode Ready** (preparado para tema escuro)

### **Notificações e Engajamento** 🔔
- ✅ **Expo Notifications** integrado
- ✅ **2 Lembretes Agendados** (9h e 21h)
- ✅ **3 Notificações Instantâneas** (badges, level up, desafios)
- ✅ **Hook Personalizado** useNotifications com navegação
- ✅ **AsyncStorage** para persistência de preferências
- ✅ **Permissões Automáticas** iOS/Android

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
├── commit-message.txt         # 📝 Mensagem de commit das últimas features
├── roadmap_fiquestlife.md     # 🗺️ Roadmap de implementação (atualizado)
└── README.md                  # 📖 Este arquivo
```

---

## 🚀 Setup Inicial

### **1. Pré-requisitos**
- ✅ Node.js v20+
- ✅ npm ou yarn
- ✅ Git
- ✅ Expo CLI (opcional, será instalado automaticamente)
- ✅ Conta no Supabase (banco PostgreSQL gratuito)

---

### **2. Clonar e Instalar Dependências**

```bash
# Clone o repositório
git clone https://github.com/pedroPecly/FiQuestLife.git
cd FiQuestLife

# Instale dependências do FRONTEND
npm install

# Instale dependências do BACKEND
cd backend
npm install
cd ..
```

---

### **3. Configurar Banco de Dados**

#### **3.1. Criar arquivo `.env` no backend**

Crie o arquivo `backend/.env` com as seguintes variáveis:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database URL (Supabase PostgreSQL)
# Formato: postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres
DATABASE_URL="postgresql://postgres:sua_senha_aqui@db.seu-projeto.supabase.co:5432/postgres"

# JWT Secret (use uma string aleatória forte)
JWT_SECRET="sua_chave_secreta_jwt_aqui_use_algo_aleatorio"

# Server Port
PORT=3000
```

💡 **Dica:** Use o arquivo `backend/.env.example` como referência.

#### **3.2. Sincronizar Schema com o Banco**

**⚠️ IMPORTANTE:** Sempre execute estes comandos ao:
- Clonar o projeto pela primeira vez
- Trocar de máquina
- Fazer `git pull` com mudanças no schema

```bash
cd backend

# Opção 1: Aplicar migrations + Regenerar Prisma Client (RECOMENDADO)
npx prisma migrate deploy
npx prisma generate

# OU

# Opção 2: Sincronizar direto (mais rápido, sem histórico de migrations)
npx prisma db push

cd ..
```

**O que cada comando faz:**
- `prisma migrate deploy` → Aplica migrations pendentes no banco
- `prisma generate` → Regenera o Prisma Client (código TypeScript)
- `prisma db push` → Sincroniza schema + regenera client (tudo de uma vez)

---

### **4. Configurar Variáveis de Ambiente do Frontend** 🔐

#### **4.1. Criar arquivo `.env` na raiz do projeto**

Crie o arquivo `.env` na raiz (mesma pasta do `package.json` do frontend):

```env
# ============================================
# FIQUEST LIFE - VARIÁVEIS DE AMBIENTE
# ============================================

# API Backend - AJUSTE PARA SEU IP LOCAL
EXPO_PUBLIC_API_URL=http://192.168.1.XX:3000
```

💡 **Importante:**
- Substitua `192.168.1.XX` pelo seu IP local (veja próxima seção)
- **NÃO** adicione `/api` no final da URL
- Use o prefixo `EXPO_PUBLIC_` para que a variável seja acessível no app

📋 **Use o arquivo `.env.example` como referência**

#### **4.2. Descobrir seu IP local**

**Windows:**
```bash
ipconfig
# Procure por "Endereço IPv4" na sua conexão Wi-Fi
# Exemplo: 192.168.1.105
```

**Mac/Linux:**
```bash
ifconfig
# ou
ip addr show
```

#### **4.3. Exemplo de `.env` configurado:**

```env
# Se seu IP é 192.168.1.105
EXPO_PUBLIC_API_URL=http://192.168.1.105:3000
```

💡 **Dica:** Seu IP pode mudar ao reiniciar o PC ou roteador. Se o login parar de funcionar, atualize o `.env` com o IP atual!

⚠️ **Observações importantes:**
- O arquivo `.env` está no `.gitignore` e **não será commitado**
- Cada desenvolvedor cria seu próprio `.env` com seu IP local
- Em produção, você usaria uma URL real (ex: `https://api.fiquestlife.com`)
- Celular e PC devem estar na **mesma rede Wi-Fi**

---

### **5. Rodar os Servidores**

Abra **2 terminais** (ou use split terminal no VS Code):

#### **Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

✅ Backend rodando em: `http://localhost:3000` ou `http://SEU_IP:3000`

#### **Terminal 2 - Frontend:**
```bash
npx expo start
```

✅ Frontend disponível via:
- 📱 **Expo Go** (celular)
- 🌐 **Navegador** (web)
- 📲 **Emulador** Android/iOS

---

### **6. Testar no Celular**

1. Instale o app **Expo Go** no celular:
   - [Android - Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)

2. Certifique-se que celular e PC estão na **mesma rede Wi-Fi**

3. No terminal do Expo, escaneie o **QR Code** com:
   - **Android:** Câmera do Expo Go
   - **iOS:** Câmera nativa (abre o Expo Go automaticamente)

---

### **7. Testar no Navegador**

Após rodar `npx expo start`, pressione `w` no terminal para abrir no navegador.

✅ URL: `http://localhost:8081`

---

## 🔄 Manutenção de Dependências

O projeto inclui scripts automatizados para manter as dependências do Expo sempre atualizadas e compatíveis.

### **Scripts Disponíveis**

```bash
# Atualizar todas as dependências do Expo automaticamente
npm run update-deps

# Verificar a saúde do projeto e dependências
npm run check-deps
```

### **Quando Executar**

Execute `npm run update-deps` regularmente:
- ✅ Sempre que ver avisos de compatibilidade ao iniciar o projeto
- ✅ Após atualizar a versão do Expo SDK
- ✅ Semanalmente como manutenção preventiva
- ✅ Antes de fazer deploy ou build de produção

### **Como Funciona**

O comando `update-deps` usa o `expo install --fix` que automaticamente:
- Verifica todas as dependências instaladas
- Compara com as versões recomendadas para o SDK atual
- Atualiza apenas os pacotes que precisam de ajuste
- Mantém a compatibilidade entre todos os pacotes

### **VS Code Tasks**

O projeto também inclui tasks do VS Code para facilitar:

1. Pressione `Ctrl + Shift + P` (ou `Cmd + Shift + P` no Mac)
2. Digite "Tasks: Run Task"
3. Selecione "Atualizar Dependências Expo"

### **Dica de Segurança**

Sempre faça commit das alterações antes de atualizar dependências. Em caso de problemas:
```bash
git checkout package.json package-lock.json
npm install
```

---

## ✅ Checklist de Verificação

Antes de começar a desenvolver, verifique:

- [ ] Backend rodando sem erros (`npm run dev` no terminal)
- [ ] Frontend rodando (`npx expo start` no terminal)
- [ ] Arquivo `.env` criado na raiz com `EXPO_PUBLIC_API_URL`
- [ ] IP correto configurado no `.env`
- [ ] Prisma Client regenerado (`npx prisma generate`)
- [ ] Banco de dados sincronizado (`npx prisma db push`)
- [ ] Consegue fazer login/cadastro
- [ ] Perfil carrega corretamente
- [ ] (Opcional) Supabase Storage configurado para upload de fotos

---

## 🐛 Troubleshooting - Problemas Comuns

### **❌ Erro "Network Error" ou "Not Found (404)" ao fazer login**

**Sintomas:**
- Login não funciona
- Erro de rede ao tentar logar
- "Request failed with status code 404"

**Causas Comuns:**
1. IP no `.env` está incorreto ou desatualizado
2. Backend não está rodando
3. Celular e PC em redes Wi-Fi diferentes
4. Firewall bloqueando a porta 3000

**Soluções:**

```bash
# 1. Verifique se o backend está rodando
cd backend
npm run dev
# Deve mostrar: ✅ Servidor rodando em http://localhost:3000

# 2. Verifique seu IP atual
# Windows:
ipconfig
# Mac/Linux:
ifconfig

# 3. Atualize o .env com o IP correto
EXPO_PUBLIC_API_URL=http://SEU_IP_ATUAL:3000

# 4. Reinicie o app Expo
# No terminal do Expo, pressione 'r' para reload
# Ou feche e abra o Expo Go novamente
```

**Log de Debug:**
- Quando o app inicia, você deve ver no console: `🌐 API URL configurada: http://192.168.1.XX:3000`
- Se a URL estiver errada, atualize o `.env`

---

### **❌ Variável de ambiente não está sendo carregada**

**Sintoma:**
- `EXPO_PUBLIC_API_URL` retorna `undefined`
- App usa fallback `http://192.168.1.6:3000`

**Solução:**

```bash
# 1. Certifique-se que o .env está na RAIZ do projeto
# (mesma pasta que package.json do frontend)

# 2. Use o prefixo EXPO_PUBLIC_
EXPO_PUBLIC_API_URL=http://192.168.1.XX:3000

# 3. Reinicie COMPLETAMENTE o Expo
# Pressione Ctrl+C para parar
# Depois rode novamente:
npx expo start --clear
```

⚠️ **Importante:** Variáveis de ambiente são carregadas apenas quando o Expo inicia. Mudanças no `.env` exigem reiniciar o servidor.

---

### **❌ IP mudou e o app parou de funcionar**

**Sintoma:**
- Funcionava antes, mas agora não conecta
- Erro de rede após reiniciar PC/roteador

**Causa:**
- Seu IP local mudou (comum após reiniciar PC ou roteador)

**Solução:**

```bash
# 1. Descubra seu novo IP
ipconfig  # Windows
ifconfig  # Mac/Linux

# 2. Atualize o .env
EXPO_PUBLIC_API_URL=http://NOVO_IP:3000

# 3. Reinicie o Expo
npx expo start
```

💡 **Dica:** Para evitar isso, configure um IP estático no seu roteador.

---

### **❌ Erro ".env not found" no git**

**Sintoma:**
- Ao clonar o projeto, não há arquivo `.env`
- Variável `EXPO_PUBLIC_API_URL` undefined

**Solução:**

```bash
# O .env está no .gitignore (não vai pro GitHub)
# Crie manualmente:

# 1. Copie o exemplo
cp .env.example .env

# 2. Edite com seu IP
# .env
EXPO_PUBLIC_API_URL=http://SEU_IP:3000
```

---

## 📸 Upload de Fotos de Perfil 🆕

O app agora suporta upload de fotos de perfil através da tela **Editar Perfil**!

### **Funcionalidades Implementadas:**
- ✅ Seleção de foto da galeria (permissões automáticas)
- ✅ Captura de foto pela câmera (permissões automáticas)
- ✅ Crop 1:1 para formato circular
- ✅ Qualidade 0.8 (otimizado para web)
- ✅ Upload para Supabase Storage
- ✅ URLs públicas geradas automaticamente
- ✅ Componente `ProfileAvatar` reutilizável
- ✅ Estados de loading durante upload
- ✅ Preview imediato após seleção

### **Onde Encontrar:**
- **Tela:** `EditProfileScreen` (Configurações → Editar Perfil)
- **Hook:** `hooks/useImagePicker.ts` (177 linhas)
- **Componente:** `components/ui/ProfileAvatar.tsx` (76 linhas)
- **Backend:** `backend/src/routes/user.ts` - POST /user/avatar (126 linhas)
- **Storage:** Supabase Storage (Service Role Key configurado)

### **Configuração Necessária (Backend):**

Para que o upload funcione, você precisa:

1. **Criar bucket no Supabase** (ja criado)
2. **Adicionar Service Role Key no backend** (já configurado)

📘 **Guia completo:** Veja o comentário em `3.1. Criar arquivo .env`

⚠️ **Sem o bucket configurado:** O app funciona normalmente, mas o upload retornará erro 500. Use avatares com iniciais até configurar.

---

### **5. Rodar os Projetos**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npx expo start
```

### **6. Testar no Celular**
1. Instale **Expo Go** no celular
2. Conecte na **mesma rede Wi-Fi** do PC
3. Escaneie o QR code no terminal

---

## 🎨 Componentes de UI

### AlertModal - Sistema de Alertas Profissional

Modal profissional para alertas, confirmações e mensagens de erro:

```tsx
import { AlertModal } from '../components/ui/AlertModal';
import { useAlert } from '../hooks/useAlert';

const MyComponent = () => {
  const { alert, isVisible, alertConfig, hideAlert } = useAlert();

  const handleSuccess = () => {
    alert.success('Sucesso!', 'Operação realizada com sucesso.');
  };

  const handleConfirm = () => {
    alert.confirm(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este item?',
      () => console.log('Excluído'),
      () => console.log('Cancelado')
    );
  };

  return (
    <>
      <Button onPress={handleSuccess} title="Mostrar Sucesso" />
      <Button onPress={handleConfirm} title="Confirmar" />

      <AlertModal
        visible={isVisible}
        title={alertConfig?.title || ''}
        message={alertConfig?.message || ''}
        type={alertConfig?.type}
        confirmText={alertConfig?.confirmText}
        cancelText={alertConfig?.cancelText}
        onConfirm={alertConfig?.onConfirm}
        onCancel={alertConfig?.onCancel}
        onClose={hideAlert}
      />
    </>
  );
};
```

**Características:**
- 4 tipos de alertas: `success`, `error`, `warning`, `info`
- Método `confirm` para diálogos de confirmação
- Design diferente para web e mobile
- Hook `useAlert` para gerenciamento centralizado
- Ícones Unicode para compatibilidade cross-platform

---

### LogoutButton - Logout com Confirmação

Componente reutilizável para logout com confirmação profissional:

```tsx
import { LogoutButton } from '../components/ui/LogoutButton';

const MyScreen = () => {
  return (
    <LogoutButton
      title="Sair da Conta"
      icon="logout"
      onLogoutSuccess={() => console.log('Logout realizado!')}
      onLogoutError={(error) => console.log('Erro no logout:', error)}
    />
  );
};
```

**Características:**
- Confirmação profissional antes do logout
- Tratamento automático de navegação (web/mobile)
- Callbacks opcionais para sucesso/erro
- Design consistente com o app
- Limpeza automática do AsyncStorage

---

### SettingsMenuItem 🆕 - Item de Menu para Configurações

Componente reutilizável para criar itens de menu em telas de configurações. **Reduz ~73% do código** comparado à implementação manual!

```tsx
import { SettingsMenuItem } from '../components/ui/SettingsMenuItem';

// Item clicável (navegação)
<SettingsMenuItem
  type="clickable"
  icon="account-edit"
  iconColor="#4CAF50"
  label="Editar Perfil"
  onPress={() => router.push('/edit-profile')}
/>

// Item com toggle (switch)
<SettingsMenuItem
  type="toggle"
  icon="bell"
  iconColor="#9C27B0"
  label="Notificações"
  switchValue={notificationsEnabled}
  onSwitchChange={(value) => setNotificationsEnabled(value)}
/>

// Item informativo (somente exibição)
<SettingsMenuItem
  type="info"
  icon="email"
  iconColor="#2196F3"
  label="Email"
  subtitle="usuario@email.com"
/>

// Último item da seção (remove borda inferior)
<SettingsMenuItem
  type="clickable"
  icon="help-circle"
  iconColor="#FF9800"
  label="Suporte"
  onPress={handleSupport}
  isLast  // Remove a borda inferior
/>

// Item com estilo customizado (ex: danger zone)
<SettingsMenuItem
  type="clickable"
  icon="delete-forever"
  iconColor="#F44336"
  label="Excluir Conta"
  onPress={handleDeleteAccount}
  labelStyle={{ fontWeight: '600', color: '#F44336' }}
  isLast
/>
```

**Props:**
- `type`: `'clickable'` | `'toggle'` | `'info'` - Tipo do item
- `icon`: Nome do ícone do Material Community Icons
- `iconColor`: Cor do ícone (hex ou nome)
- `label`: Texto principal do item
- `subtitle`: Texto secundário opcional
- `isLast`: Remove borda inferior (último item da seção)
- `onPress`: Callback para itens clicáveis
- `switchValue`: Valor do switch (para type='toggle')
- `onSwitchChange`: Callback quando switch muda
- `disabled`: Desabilita o item
- `labelStyle`: Estilo customizado para o texto

**Características:**
- 3 tipos: clicável (navegação), toggle (switch), informativo
- Suporte a ícones coloridos do Material Community Icons
- Subtítulos para informações adicionais
- Estado de desabilitado com opacidade reduzida
- Remoção de borda para último item da seção
- Customização de estilo do label
- Design consistente com o padrão do app
- TouchableOpacity automático para itens clicáveis
- Switch integrado para toggles

**Exemplo completo em uma seção:**
```tsx
<View style={styles.section}>
  <Text style={styles.sectionTitle}>CONTA</Text>

  <SettingsMenuItem
    type="clickable"
    icon="account-edit"
    iconColor="#4CAF50"
    label="Editar Perfil"
    onPress={() => router.push('/edit-profile')}
  />

  <SettingsMenuItem
    type="info"
    icon="email"
    iconColor="#2196F3"
    label="Email"
    subtitle={user?.email}
  />

  <SettingsMenuItem
    type="info"
    icon="calendar"
    iconColor="#FF9800"
    label="Membro desde"
    subtitle={new Date(user?.createdAt || '').toLocaleDateString('pt-BR')}
    isLast
  />
</View>
```

**Economia de Código:**
- **Antes:** 22 linhas por item (com TouchableOpacity, View, MaterialCommunityIcons, Text)
- **Depois:** 6 linhas por item (apenas props do componente)
- **Redução:** ~73% menos código! 🎉

---

### Input - Campo de Entrada Aprimorado

Campo de entrada com ícones e efeitos de foco profissional:

```tsx
import { Input } from '../components/ui/Input';

// Input básico
<Input
  placeholder="Digite seu nome"
  value={name}
  onChangeText={setName}
/>

// Input com ícone
<Input
  icon="email"
  placeholder="Digite seu email"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
/>

// Input multiline (textarea)
<Input
  multiline
  placeholder="Digite sua mensagem"
  value={message}
  onChangeText={setMessage}
  numberOfLines={4}
/>
```

**Características:**
- Ícones opcionais usando MaterialCommunityIcons
- Efeitos de foco automáticos (borda azul + sombra)
- Suporte a múltiplas linhas
- Remoção automática de bordas pretas no web
- Design responsivo cross-platform

---

### DateInput - Campo de Data com Formatação Automática

Input especializado para datas brasileiras (DD/MM/YYYY) com formatação automática:

```tsx
import { DateInput } from '../components/ui/DateInput';

const MyComponent = () => {
  const [birthDate, setBirthDate] = useState('');

  return (
    <DateInput
      value={birthDate}
      onChangeText={setBirthDate}
      placeholder="Data de nascimento (DD/MM/YYYY)"
      editable={true}
      returnKeyType="next"
    />
  );
};
```

**Características:**
- Formatação automática DD/MM/YYYY
- Aceita apenas números
- Adiciona barras automaticamente
- Limite de 10 caracteres
- Previne entrada de caracteres inválidos
- Baseado no componente Input (herda todos os estilos)

**Exemplo de uso:**
- Digite: `12` → Mostra: `12`
- Digite: `1234` → Mostra: `12/34`
- Digite: `12345678` → Mostra: `12/34/5678`

---

### Componentes de UI Disponíveis

| Componente | Descrição | Arquivo |
|------------|-----------|---------|
| **AlertModal** | Modal profissional de alertas (4 tipos) | `components/ui/AlertModal.tsx` |
| **Avatar** | Avatar circular com iniciais ou imagem | `components/ui/Avatar.tsx` |
| **BadgeCard** 🆕 | Card de badge com progresso e raridade | `components/ui/BadgeCard.tsx` |
| **BadgeItem** 🆕 | Item de badge reutilizável (2 variantes) | `components/ui/BadgeItem.tsx` |
| **Button** | Botão com variantes (primary, secondary, danger) | `components/ui/Button.tsx` |
| **Card** | Container com sombra e padding | `components/ui/Card.tsx` |
| **ChallengeCard** 🆕 | Card de desafio com badges coloridos | `components/ui/ChallengeCard.tsx` |
| **DateInput** | Input de data com formatação DD/MM/YYYY | `components/ui/DateInput.tsx` |
| **InfoRow** | Linha de informação (label + valor) | `components/ui/InfoRow.tsx` |
| **Input** | Campo de entrada com ícones e foco | `components/ui/Input.tsx` |
| **LoadingScreen** | Tela de loading reutilizável | `components/ui/LoadingScreen.tsx` |
| **LogoutButton** | Botão de logout com confirmação | `components/ui/LogoutButton.tsx` |
| **NotificationBell** 🆕 | Sino com badge count e animação | `components/ui/NotificationBell.tsx` |
| **NotificationFeed** 🆕 | Feed modal de notificações | `components/ui/NotificationFeed.tsx` |
| **NotificationItem** 🆕 | Item individual de notificação | `components/ui/NotificationItem.tsx` |
| **ProfileAvatar** 🆕 | Avatar com upload de foto | `components/ui/ProfileAvatar.tsx` |
| **SettingsMenuItem** 🆕 | Item de menu para configurações | `components/ui/SettingsMenuItem.tsx` |
| **StatBox** | Caixa de estatística gamificada | `components/ui/StatBox.tsx` |
| **Tag** | Badge/Tag com ícone | `components/ui/Tag.tsx` |

---

### 🆕 BadgeItem - Item de Badge Reutilizável

Componente altamente reutilizável para exibir badges em diferentes contextos. Suporta **2 variantes**: `full` (lista) e `mini` (card horizontal).

```tsx
import { BadgeItem } from '../components/ui/BadgeItem';

// Variante FULL (lista de badges)
<BadgeItem
  icon="🏆"
  name="Primeiro Passo"
  earnedAt="2025-10-27T10:30:00Z"
  rarity="COMMON"
  variant="full"
  onPress={() => console.log('Badge clicado')}
/>

// Variante MINI (scroll horizontal)
<BadgeItem
  icon="🔥"
  name="Persistente"
  earnedAt="2025-10-25T15:00:00Z"
  rarity="RARE"
  variant="mini"
  onPress={() => router.push('/(tabs)/badges')}
/>

// Badge bloqueado
<BadgeItem
  name="Inabalável"
  rarity="EPIC"
  variant="full"
  locked={true}
/>
```

**Props:**
- `icon?: string` - Emoji do badge (opcional)
- `name: string` - Nome do badge (obrigatório)
- `earnedAt?: string | Date` - Data de conquista
- `rarity: BadgeRarity` - Raridade (COMMON, RARE, EPIC, LEGENDARY)
- `variant?: 'full' | 'mini'` - Tipo de exibição (padrão: 'full')
- `onPress?: () => void` - Callback ao tocar
- `locked?: boolean` - Se está bloqueado (padrão: false)

**Características:**
- Variante **FULL**: Item completo com ícone circular, nome, data, badge de raridade
- Variante **MINI**: Card compacto 120px para scroll horizontal
- Cores automáticas baseadas na raridade
- Formatação automática de data ("Conquistado em 27 de out")
- Estado bloqueado (ícone de cadeado + texto cinza)
- Sombras e elevação profissionais

---

## 🎣 Hooks Personalizados

### useAlert - Gerenciamento de Alertas

Hook para gerenciamento centralizado de alertas e modais:

```tsx
import { useAlert } from '../hooks/useAlert';

const MyComponent = () => {
  const { alert, isVisible, alertConfig, hideAlert } = useAlert();

  const handleSuccess = () => {
    alert.success('Sucesso!', 'Operação realizada.');
  };

  const handleError = () => {
    alert.error('Erro', 'Ocorreu um problema.');
  };

  const handleConfirm = () => {
    alert.confirm(
      'Confirmar',
      'Tem certeza?',
      () => console.log('Confirmado'),
      () => console.log('Cancelado')
    );
  };

  return (
    <>
      <Button onPress={handleSuccess} title="Sucesso" />
      <Button onPress={handleError} title="Erro" />
      <Button onPress={handleConfirm} title="Confirmar" />

      <AlertModal
        visible={isVisible}
        title={alertConfig?.title || ''}
        message={alertConfig?.message || ''}
        type={alertConfig?.type}
        confirmText={alertConfig?.confirmText}
        cancelText={alertConfig?.cancelText}
        onConfirm={alertConfig?.onConfirm}
        onCancel={alertConfig?.onCancel}
        onClose={hideAlert}
      />
    </>
  );
};
```

**Métodos disponíveis:**
- `alert.success(title, message, onConfirm?)` - Alerta verde de sucesso
- `alert.error(title, message, onConfirm?)` - Alerta vermelho de erro
- `alert.warning(title, message, onConfirm?)` - Alerta amarelo de aviso
- `alert.info(title, message, onConfirm?)` - Alerta azul informativo
- `alert.confirm(title, message, onConfirm, onCancel?, confirmText?, cancelText?)` - Confirmação

---

---

## 🔐 API Endpoints

### **Autenticação**
| Método | Rota              | Auth | Descrição                         |
|--------|-------------------|------|-----------------------------------|
| GET    | `/`               | ❌   | Health check (status da API)      |
| GET    | `/health`         | ❌   | Health check detalhado            |
| POST   | `/auth/register`  | ❌   | Cadastrar usuário                 |
| POST   | `/auth/login`     | ❌   | Login (email ou username)         |
| GET    | `/auth/me`        | ✅   | Perfil do usuário logado          |
| GET    | `/user/me`        | ✅   | Perfil do usuário logado (alias)  |
| PUT    | `/user/profile`   | ✅   | Atualizar perfil (dados pessoais) |
| POST   | `/user/avatar`    | ✅   | Upload de foto de perfil 🆕      |

### **Desafios (Challenges)** 🆕
| Método | Rota                         | Auth | Descrição                                    |
|--------|------------------------------|------|----------------------------------------------|
| GET    | `/challenges/daily`          | ✅   | Buscar ou atribuir 5 desafios diários        |
| POST   | `/challenges/:id/complete`   | ✅   | Completar desafio e receber recompensas      |
| GET    | `/challenges/history`        | ✅   | Histórico de desafios completados (limit=50) |
| GET    | `/challenges/all`            | ✅   | Listar todos os desafios disponíveis         |

### **Badges (Conquistas)** 🆕
| Método | Rota                | Auth | Descrição                                         |
|--------|---------------------|------|---------------------------------------------------|
| GET    | `/badges/all`       | ✅   | Listar todos os badges disponíveis                |
| GET    | `/badges/user`      | ✅   | Badges conquistados pelo usuário                  |
| GET    | `/badges/progress`  | ✅   | Progresso de todos os badges + summary            |

### **Exemplo de Requisição**

**Cadastro:**
```json
POST /auth/register
{
  "email": "usuario@email.com",
  "username": "usuario_teste",
  "password": "123456",
  "name": "João da Silva",      // Obrigatório
  "birthDate": "1990-05-15"     // Obrigatório (formato ISO: YYYY-MM-DD)
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

### **Exemplos de Requisições - Desafios** 🆕

**Buscar desafios diários:**
```bash
GET /challenges/daily
Authorization: Bearer SEU_TOKEN_JWT
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "user-challenge-uuid",
      "userId": "user-uuid",
      "challengeId": "challenge-uuid",
      "status": "PENDING",
      "assignedAt": "2025-10-20T08:00:00.000Z",
      "progress": 0,
      "challenge": {
        "id": "challenge-uuid",
        "title": "Caminhada de 30 minutos",
        "description": "Faça uma caminhada ao ar livre por pelo menos 30 minutos",
        "category": "PHYSICAL_ACTIVITY",
        "difficulty": "EASY",
        "xpReward": 50,
        "coinsReward": 10
      }
    }
    // ... mais 4 desafios
  ],
  "message": "5 desafios diários"
}
```

**Completar desafio:**
```bash
POST /challenges/:userChallengeId/complete
Authorization: Bearer SEU_TOKEN_JWT
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "challenge": {
      "id": "user-challenge-uuid",
      "status": "COMPLETED",
      "completedAt": "2025-10-20T14:30:00.000Z",
      "progress": 100
    },
    "userStats": {
      "xp": 150,
      "coins": 30,
      "level": 1,
      "currentStreak": 5,
      "longestStreak": 12
    },
    "leveledUp": false,
    "newLevel": 1,
    "newBadges": []
  },
  "message": "Desafio completado com sucesso!"
}
```

---

### **Exemplos de Requisições - Badges** 🆕

**Buscar progresso de badges:**
```bash
GET /badges/progress
Authorization: Bearer SEU_TOKEN_JWT
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "badge-uuid",
      "name": "Primeiro Passo",
      "description": "Complete seu primeiro desafio!",
      "imageUrl": "🎯",
      "category": "BEGINNER",
      "rarity": "COMMON",
      "requirementType": "CHALLENGES_COMPLETED",
      "requirementValue": 1,
      "earned": true,
      "earnedAt": "2025-10-20T10:15:00.000Z",
      "progress": {
        "current": 5,
        "required": 1,
        "percentage": 100
      }
    },
    {
      "id": "badge-uuid-2",
      "name": "Persistente",
      "description": "Mantenha um streak de 3 dias",
      "imageUrl": "🔥",
      "category": "CONSISTENCY",
      "rarity": "COMMON",
      "requirementType": "STREAK_DAYS",
      "requirementValue": 3,
      "earned": false,
      "progress": {
        "current": 2,
        "required": 3,
        "percentage": 66
      }
    }
    // ... mais badges
  ],
  "summary": {
    "earned": 3,
    "total": 29,
    "percentage": 10
  },
  "message": "3/29 badges conquistados"
}
```

---

## 🏆 **SISTEMA DE BADGES - COMO FUNCIONA**

### **📋 Visão Geral**

O sistema de badges é **100% automático** e recompensa usuários por diferentes conquistas. São **29 badges** distribuídos em **5 categorias** com **4 níveis de raridade**.

### **🎯 Categorias de Badges**

| Categoria | Descrição | Quantidade | Ícone |
|-----------|-----------|------------|-------|
| **BEGINNER** | Progresso inicial | 6 badges | 🌱 |
| **CONSISTENCY** | Streaks diários | 5 badges | 🔥 |
| **MILESTONE** | Níveis alcançados | 5 badges | 🎯 |
| **ACHIEVEMENT** | XP + Mestres de categoria | 11 badges | 🏆 |
| **SPECIAL** | Badges especiais/manuais | 2 badges | ⭐ |

---

### **💎 Raridades de Badges**

| Raridade | Cor | Dificuldade | Exemplos |
|----------|-----|-------------|----------|
| **COMMON** | Cinza (#9E9E9E) | Fácil | Primeiro Passo (1 desafio), Persistente (3d streak) |
| **RARE** | Azul (#2196F3) | Médio | Comprometido (14d streak), Nível 10 |
| **EPIC** | Roxo (#9C27B0) | Difícil | Inabalável (30d streak), Nível 20 |
| **LEGENDARY** | Dourado (#FF9800) | Muito Difícil | Guerreiro do Ano (365d), Nível 100 |

---

### **🔧 Tipos de Requisitos**

O sistema suporta **6 tipos** diferentes de requisitos para desbloquear badges:

#### **1. CHALLENGES_COMPLETED** - Total de Desafios
Conta o **total de desafios completados** pelo usuário em todas as categorias.

**Exemplos:**
- 🎯 **Primeiro Passo** (COMMON): 1 desafio
- 🌱 **Aprendiz** (COMMON): 5 desafios
- 🚀 **Aventureiro** (RARE): 10 desafios
- ⚔️ **Veterano** (RARE): 25 desafios
- 👑 **Mestre** (EPIC): 50 desafios
- 💯 **Centurião** (LEGENDARY): 100 desafios

#### **2. STREAK_DAYS** - Dias Consecutivos
Conta a **sequência atual de dias** com atividade no app.

**Exemplos:**
- 🔥 **Persistente** (COMMON): 3 dias consecutivos
- 💪 **Dedicado** (COMMON): 7 dias consecutivos
- 🎯 **Comprometido** (RARE): 14 dias consecutivos
- 🛡️ **Inabalável** (EPIC): 30 dias consecutivos
- 👑 **Guerreiro do Ano** (LEGENDARY): 365 dias consecutivos

#### **3. LEVEL_REACHED** - Nível Alcançado
Verifica se o usuário atingiu determinado **nível de XP**.

**Fórmula:** `level = Math.floor(totalXP / 1000) + 1`

**Exemplos:**
- ⭐ **Nível 5** (COMMON): 5.000 XP (5 níveis)
- 🌟 **Nível 10** (RARE): 10.000 XP (10 níveis)
- 💫 **Nível 20** (EPIC): 20.000 XP (20 níveis)
- 🔆 **Nível 50** (LEGENDARY): 50.000 XP (50 níveis)
- ☀️ **Nível 100** (LEGENDARY): 100.000 XP (100 níveis)

#### **4. XP_EARNED** - XP Total Acumulado
Conta o **XP total ganho** pelo usuário (independente do nível).

**Exemplos:**
- 💎 **Colecionador** (RARE): 1.000 XP
- 👑 **Mestre XP** (EPIC): 5.000 XP
- 🏆 **Lenda XP** (LEGENDARY): 10.000 XP

#### **5. CATEGORY_MASTER** - Mestre de Categoria
Conta **desafios completados em uma categoria específica**.

**Categorias Disponíveis:**
- 🏃 **Atleta** (EPIC): 100 desafios de PHYSICAL_ACTIVITY
- 🥗 **Nutricionista** (EPIC): 100 desafios de NUTRITION
- 💧 **Hidratado** (EPIC): 50 desafios de HYDRATION
- 🧠 **Mente Sã** (EPIC): 50 desafios de MENTAL_HEALTH
- 😴 **Dorminhoco** (EPIC): 30 desafios de SLEEP
- 👥 **Social** (EPIC): 30 desafios de SOCIAL
- 🎯 **Produtivo** (EPIC): 50 desafios de PRODUCTIVITY
- 🧘 **Meditador** (EPIC): 50 desafios de MINDFULNESS

#### **6. SPECIFIC_CHALLENGE / SOCIAL_INTERACTION** - Badges Especiais
Badges **concedidos manualmente** por eventos especiais ou ações específicas.

**Exemplos:**
- 🎖️ **Early Adopter** (LEGENDARY): Primeiros 100 usuários
- 🧪 **Beta Tester** (EPIC): Testadores da versão beta

---

### **⚙️ Como Funciona o Sistema Automático**

#### **1. Fluxo de Concessão de Badges**

```
Usuário completa desafio
    ↓
Sistema atualiza XP/coins
    ↓
Sistema calcula novo level
    ↓
Sistema atualiza streak
    ↓
Sistema chama checkAndAwardBadges()
    ↓
Para cada badge não conquistado:
    ├─ Verifica tipo de requisito
    ├─ Calcula progresso atual
    ├─ Se requisito atingido: concede badge
    └─ Registra no RewardHistory
```

#### **2. Verificação de Requisitos (Backend)**

O arquivo `backend/src/services/badge.service.ts` contém a lógica de cálculo:

**a) Para CHALLENGES_COMPLETED:**
```typescript
const totalChallenges = await prisma.userChallenge.count({
  where: { userId, status: 'COMPLETED' }
});
if (totalChallenges >= badge.requirementValue) {
  // Concede badge
}
```

**b) Para STREAK_DAYS:**
```typescript
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: { currentStreak: true }
});
if (user.currentStreak >= badge.requirementValue) {
  // Concede badge
}
```

**c) Para LEVEL_REACHED:**
```typescript
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: { level: true }
});
if (user.level >= badge.requirementValue) {
  // Concede badge
}
```

**d) Para CATEGORY_MASTER:**
```typescript
const categoryMap = {
  'Atleta': 'PHYSICAL_ACTIVITY',
  'Nutricionista': 'NUTRITION',
  // ... outros
};
const category = categoryMap[badge.name];
const categoryCount = await prisma.userChallenge.count({
  where: {
    userId,
    status: 'COMPLETED',
    challenge: { category }
  }
});
if (categoryCount >= badge.requirementValue) {
  // Concede badge
}
```

#### **3. Cálculo de Progresso em Tempo Real**

O endpoint `GET /badges/progress` retorna:
- ✅ **Badges conquistados** com data de conquista
- 📊 **Badges bloqueados** com progresso atual
- 📈 **Porcentagem** de conclusão de cada badge

**Exemplo de Progresso:**
```json
{
  "name": "Persistente",
  "requirementType": "STREAK_DAYS",
  "requirementValue": 3,
  "earned": false,
  "progress": {
    "current": 2,      // Usuário tem 2 dias de streak
    "required": 3,     // Precisa de 3 dias
    "percentage": 66   // 66% completo
  }
}
```

---

### **📱 Interface de Badges (Frontend)**

#### **BadgesScreen** (`app/screens/BadgesScreen.tsx`)

**Funcionalidades:**
- ✅ **Grid responsivo** 2 colunas (mobile) / 3+ colunas (tablet/desktop)
- ✅ **3 filtros:** Todos, Conquistados (✅), Bloqueados (🔒)
- ✅ **Pull-to-refresh** para atualizar progresso
- ✅ **Modal de detalhes** ao tocar em um badge
- ✅ **Cores por raridade** (Common, Rare, Epic, Legendary)
- ✅ **Barra de progresso** visual para badges bloqueados
- ✅ **Overlay de lock** em badges não conquistados

#### **BadgeCard** (`components/ui/BadgeCard.tsx`)

**Estados Visuais:**

**a) Badge Conquistado (earned: true):**
- ✅ Cores vibrantes de acordo com a raridade
- ✅ Data de conquista formatada
- ✅ Ícone do badge colorido
- ✅ Sem overlay de lock

**b) Badge Bloqueado (earned: false):**
- 🔒 Cores em escala de cinza
- 🔒 Overlay semi-transparente com ícone de cadeado
- 📊 Barra de progresso visual
- 📊 Texto de progresso (ex: "2/3 completado")

**Cores por Raridade:**
```typescript
const RARITY_COLORS = {
  COMMON: '#9E9E9E',     // Cinza
  RARE: '#2196F3',       // Azul
  EPIC: '#9C27B0',       // Roxo
  LEGENDARY: '#FF9800',  // Dourado
};
```

---

### **🔄 Atualização Automática**

O sistema de badges se atualiza automaticamente quando:

1. **Usuário completa um desafio**
   - Backend chama `checkAndAwardBadges()`
   - Novos badges são concedidos se requisitos forem atingidos
   - Response retorna array `newBadges` com conquistas

2. **Usuário entra na BadgesScreen**
   - Frontend chama `GET /badges/progress`
   - Recebe lista atualizada com progresso

3. **Pull-to-refresh**
   - Usuário arrasta tela para baixo
   - Chama `loadBadges()` novamente
   - Atualiza estado local

---

### **📊 Exemplo Completo de Conquista**

**Cenário:** Usuário completa seu **3º dia consecutivo** de desafios.

**1. Ação do Usuário:**
```
Usuário abre app e completa 1 desafio
```

**2. Backend (challenge.service.ts):**
```typescript
// Atualiza streak
await checkAndUpdateStreak(userId);
// currentStreak atualizado para 3

// Verifica badges
const newBadges = await checkAndAwardBadges(userId);
// Sistema detecta: currentStreak (3) >= requirementValue (3)
// Badge "Persistente" é concedido!
```

**3. Response da API:**
```json
{
  "success": true,
  "data": {
    "userStats": {
      "currentStreak": 3
    },
    "newBadges": [
      {
        "id": "badge-uuid",
        "name": "Persistente",
        "description": "Mantenha um streak de 3 dias",
        "rarity": "COMMON",
        "imageUrl": "🔥"
      }
    ]
  }
}
```

**4. Frontend (ChallengesScreen.tsx):**
```typescript
if (result.data.newBadges && result.data.newBadges.length > 0) {
  alert.success(
    '🎉 Novo Badge!',
    `Você conquistou: ${result.data.newBadges.map(b => b.name).join(', ')}`
  );
}
```

**5. Resultado no App:**
- ✅ Badge "Persistente" 🔥 aparece como conquistado
- ✅ Notificação de sucesso exibida
- ✅ Badge fica colorido (azul COMMON)
- ✅ Data de conquista registrada

---

### **🎮 Gamificação e Engajamento**

#### **Estratégia de Progressão**

Os badges são projetados para criar uma **curva de engajamento**:

**Fase 1: Onboarding (Dias 1-3)**
- 🎯 Primeiro Passo (1 desafio)
- 🔥 Persistente (3 dias)
- Objetivo: Dar vitórias rápidas iniciais

**Fase 2: Construção de Hábito (Semanas 1-2)**
- 🌱 Aprendiz (5 desafios)
- 💪 Dedicado (7 dias)
- 🎯 Comprometido (14 dias)
- Objetivo: Estabelecer rotina

**Fase 3: Mastery (Mês 1+)**
- 🚀 Aventureiro (10 desafios)
- 🛡️ Inabalável (30 dias)
- 🏃 Badges de categoria (50-100 desafios)
- Objetivo: Especialização

**Fase 4: Elite (Longo Prazo)**
- 💯 Centurião (100 desafios)
- 👑 Guerreiro do Ano (365 dias)
- ☀️ Nível 100
- Objetivo: Manter engajamento infinito

---

### **📝 Resumo Técnico**

**Backend:**
- ✅ 3 funções de service (168 linhas)
- ✅ 3 endpoints REST
- ✅ Verificação automática em todo `completeChallenge()`
- ✅ Cálculo de progresso em tempo real
- ✅ 6 tipos de requisitos suportados

**Frontend:**
- ✅ 1 service (235 linhas)
- ✅ 1 componente BadgeCard (236 linhas)
- ✅ 1 screen BadgesScreen (420 linhas)
- ✅ 1 arquivo de styles (322 linhas)
- ✅ Grid responsivo com filtros
- ✅ Modal de detalhes com scroll
- ✅ Cores e animações por raridade

**Dados:**
- ✅ 29 badges seedados
- ✅ 5 categorias
- ✅ 4 raridades
- ✅ 6 tipos de requisitos

---

## 📝 Comandos Rápidos

```bash
# Instalar dependências
npm install && cd backend && npm install && cd ..

# Rodar migrations
cd backend && npx prisma migrate deploy && npx prisma generate && cd ..

# Popular banco com badges iniciais (29 badges)
cd backend && npm run prisma:seed && cd ..

# Popular banco com desafios (43 desafios em 8 categorias) 🆕
cd backend && npm run prisma:seed-challenges && cd ..

# Iniciar tudo (2 terminais)
# Terminal 1 - Backend:
cd backend && npm run dev

# Terminal 2 - Frontend:
npx expo start

# Limpar cache do Expo
npx expo start -c

# Visualizar banco de dados
cd backend && npx prisma studio
```

---

## �️ Guia de Desenvolvimento

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
npx prisma migrate dev --name add_novocampo
npx prisma generate
```

### **Popular banco com badges (Seed)**
O projeto possui um sistema de seed que popula o banco com 29 badges iniciais.

**Rodar seed:**
```bash
cd backend
npm run prisma:seed
```

**Badges criados:**
- 🌱 **BEGINNER** (6 badges): Primeiro Passo, Aprendiz, Aventureiro, Veterano, Mestre, Centurião
- 🔥 **CONSISTENCY** (5 badges): Persistente (3d), Dedicado (7d), Comprometido (14d), Inabalável (30d), Guerreiro do Ano (365d)
- 🎯 **MILESTONE** (5 badges): Níveis 5, 10, 20, 50, 100
- 💎 **ACHIEVEMENT XP** (3 badges): Colecionador (1k), Mestre (5k), Lenda (10k)
- 🏆 **ACHIEVEMENT Categorias** (8 badges): Atleta, Nutricionista, Hidratado, Mente Sã, Dorminhoco, Social, Produtivo, Meditador
- ⭐ **SPECIAL** (2 badges): Early Adopter, Beta Tester

**Arquivo:** `backend/prisma/seed.ts`

**IMPORTANTE:** O seed limpa os badges existentes antes de popular. Use com cuidado em produção!

---

### **Popular banco com desafios (Seed)** 🆕
O projeto possui um sistema de seed para popular o banco com 43 desafios distribuídos em 8 categorias.

**Rodar seed de desafios:**
```bash
cd backend
npm run prisma:seed-challenges
```

**Desafios criados por categoria:**
- 💪 **PHYSICAL_ACTIVITY** (8): Caminhada, 10k passos, Treino de força, Corrida 5km, Alongamento, Yoga, Escadas, Dança
- 🥗 **NUTRITION** (6): 5 porções frutas/vegetais, Café saudável, Zero açúcar, Refeição caseira, Proteína, Evitar fast food
- 💧 **HYDRATION** (4): 2L água, Água ao acordar, Zero refrigerante, Chá/infusão
- 🧠 **MENTAL_HEALTH** (4): Gratidão, Momento sem telas, Tempo natureza, Journaling
- 😴 **SLEEP** (3): 8 horas sono, Rotina noturna, Dormir antes 23h
- 👥 **SOCIAL** (3): Ligar amigo/familiar, Ato bondade, Encontro presencial
- 🎯 **PRODUCTIVITY** (4): Planejar dia, Pomodoro, Organizar espaço, Aprender novo
- 🧘 **MINDFULNESS** (4): Meditar 10min, Respiração consciente, Refeição consciente, Body scan

**Distribuição de dificuldades:**
- **EASY** (16 desafios): 30-60 XP, 6-12 coins
- **MEDIUM** (22 desafios): 70-120 XP, 14-25 coins  
- **HARD** (5 desafios): 120-150 XP, 24-30 coins

**Arquivo:** `backend/prisma/seed-challenges.ts`

**IMPORTANTE:** O seed limpa os desafios existentes antes de popular. Execute apenas durante desenvolvimento!

**Ordem recomendada de seeds:**
```bash
cd backend
npm run prisma:seed              # 1º - Badges (29)
npm run prisma:seed-challenges   # 2º - Desafios (43)
cd ..
```

---

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

### **Erro: "Network request failed"**
- ✅ Backend está rodando? (`cd backend && npm run dev`)
- ✅ IP em `services/api.ts` está correto?
- ✅ Celular e PC na mesma rede Wi-Fi?
- ✅ Firewall bloqueando porta 3000?

### **Erro 409 (Conflict)**
- Email ou username já existe no banco
- Solução: Use outro email/username ou limpe o banco

### **Erro: "Alert.alert não funciona no navegador"**
- ✅ Use `alert.success()`, `alert.error()`, etc. do hook `useAlert`
- ✅ Compatível com Web e Mobile através do `AlertModal`
- ✅ Exemplo: `const { alert } = useAlert(); alert.success('Título', 'Mensagem');`

### **Botão de Logout não funciona**
- ✅ Use o componente `LogoutButton` que já inclui confirmação
- ✅ Ou use `alert.confirm()` do hook `useAlert` para confirmações manuais

### **Erro: "Unknown field `birthDate`" ou campos não encontrados**
❌ **Causa:** Prisma Client desatualizado (não sincronizado com o schema)

✅ **Solução:** Regenerar o Prisma Client

```bash
cd backend

# Opção 1: Regenerar apenas o client
npx prisma generate

# Opção 2: Sincronizar schema + regenerar (RECOMENDADO)
npx prisma db push

cd ..
```

**Quando executar:**
- ✅ Após clonar o projeto
- ✅ Após fazer `git pull`
- ✅ Ao trocar de máquina
- ✅ Após modificar `schema.prisma`
- ✅ Se aparecer erros tipo "Unknown field" ou "Invalid invocation"

💡 **Dica:** Adicione ao seu fluxo de trabalho:
```bash
git pull
cd backend && npx prisma generate && cd ..
npm run dev
```

### **Prisma Client não atualiza**
```bash
cd backend
npx prisma generate
```

Depois reinicie o TypeScript Server no VS Code:
- `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

---

## � Sistema de Gamificação 🆕

### **Mecânicas Implementadas**

#### **Sistema de Level**
- Fórmula: `level = Math.floor(totalXP / 1000) + 1`
- **1000 XP por nível**
  - Nível 1: 0-999 XP
  - Nível 2: 1000-1999 XP
  - Nível 3: 2000-2999 XP
  - E assim por diante...
- Detecção automática de level up
- Registro no histórico de recompensas

#### **Sistema de Streaks (Dias Consecutivos)**
- **Incrementa:** Se última atividade foi ontem
- **Mantém:** Se última atividade foi hoje
- **Reseta:** Se passou 2+ dias sem atividade
- Tracking de `currentStreak` e `longestStreak`
- Timezone handling para cálculo preciso de dias

#### **Sistema de Desafios**
- **43 desafios** distribuídos em 8 categorias:
  - 💪 **PHYSICAL_ACTIVITY** (8 desafios)
  - 🥗 **NUTRITION** (6 desafios)
  - 💧 **HYDRATION** (4 desafios)
  - 🧠 **MENTAL_HEALTH** (4 desafios)
  - 😴 **SLEEP** (3 desafios)
  - 👥 **SOCIAL** (3 desafios)
  - 🎯 **PRODUCTIVITY** (4 desafios)
  - 🧘 **MINDFULNESS** (4 desafios)
- **3 dificuldades:**
  - **EASY:** 30-60 XP, 6-12 coins
  - **MEDIUM:** 70-120 XP, 14-25 coins
  - **HARD:** 120-150 XP, 24-30 coins
- **5 desafios diários aleatórios** atribuídos automaticamente
- Frequências: DAILY, WEEKLY, MONTHLY, ONE_TIME

#### **Sistema de Badges (Conquistas Automáticas)**
- **29 badges** em 5 categorias:
  - 🌱 **BEGINNER** (6): Progresso inicial (1, 5, 10, 25, 50, 100 desafios)
  - 🔥 **CONSISTENCY** (5): Streaks (3, 7, 14, 30, 365 dias)
  - 🎯 **MILESTONE** (5): Níveis (5, 10, 20, 50, 100)
  - 💎 **ACHIEVEMENT** (11): XP total + Mestres de categoria
  - ⭐ **SPECIAL** (2): Early Adopter, Beta Tester (manuais)
- **4 raridades:** COMMON, RARE, EPIC, LEGENDARY
- **6 tipos de requisitos:**
  - `CHALLENGES_COMPLETED` - Total de desafios
  - `STREAK_DAYS` - Dias consecutivos
  - `LEVEL_REACHED` - Nível alcançado
  - `XP_EARNED` - XP total ganho
  - `CATEGORY_MASTER` - Desafios por categoria
  - `SPECIFIC_CHALLENGE` / `SOCIAL_INTERACTION` - Badges especiais
- **Verificação automática** ao completar desafios
- Cálculo de progresso em tempo real

#### **Histórico de Recompensas**
- Registro automático de todas as ações:
  - XP ganho por desafio
  - Coins ganhas por desafio
  - Level ups
  - Badges conquistados
- Tracking completo com fonte e descrição

### **Fluxo de Completar Desafio**
1. Usuário completa desafio
2. Sistema atualiza XP e coins
3. Sistema calcula novo level
4. Sistema atualiza streak
5. Sistema verifica badges automaticamente
6. Sistema registra tudo no histórico
7. Retorna: stats atualizadas + levelUp + novos badges

---

## 🎯 Funcionalidades Implementadas

### **Backend - API REST Completa**
- ✅ **Sistema de autenticação JWT** (7 dias de validade)
- ✅ **4 endpoints de autenticação e perfil**
- ✅ **4 endpoints de desafios** 🆕
- ✅ **3 endpoints de badges** 🆕
- ✅ **Service Layer completo:**
  - 8 funções de challenge service (457 linhas)
  - 3 funções de badge service (168 linhas)
- ✅ **Sistema de gamificação:**
  - Level system (1000 XP/nível)
  - Streak system (dias consecutivos)
  - Badge automation (6 tipos de requisitos)
  - Reward history tracking
- ✅ **Seed de dados:**
  - 29 badges seedados
  - 43 desafios seedados

### **Autenticação e Cadastro**
- ✅ Login com email OU username
- ✅ Cadastro com validações completas:
  - Email válido (contém @)
  - Username alfanumérico (3+ caracteres, apenas letras/números/_)
  - Senha forte (6+ caracteres)
  - Nome completo obrigatório
  - Data de nascimento obrigatória (DD/MM/YYYY)
  - Confirmação de senha (deve coincidir)
- ✅ Senha criptografada com bcrypt
- ✅ Armazenamento seguro de token (AsyncStorage)
- ✅ Proteção de rotas com middleware JWT
- ✅ Validações no backend e frontend

### **Interface**
- ✅ 11 componentes reutilizáveis de UI (AlertModal, Button, Input, DateInput, Card, Avatar, Tag, InfoRow, StatBox, LoadingScreen, LogoutButton)
- ✅ 1 componente de Layout (Header)
- ✅ 4 hooks personalizados (useAlert, useColorScheme, useThemeColor)
- ✅ **6 Telas Completas**:
  - 📱 **LoginScreen** - Login e cadastro com validações robustas
  - 👤 **ProfileScreen** - Perfil com gamificação e estatísticas detalhadas
  - ✏️ **EditProfileScreen** - Edição de perfil profissional com validação em tempo real
  - ⚙️ **SettingsScreen** - Configurações organizadas em cards (navegação por tabs)
  - 🏠 **HomeScreen** - Dashboard principal (tab de perfil)
  - 🔍 **ExploreScreen** - Exploração de conteúdo (tab futura)
- ✅ **Navegação por Tabs**: 3 abas principais (Home, Explorar, Configurações)
- ✅ **Padrão de Cards Consistente**: Todos os cards com maxWidth 500px, border radius 20px, sombras padronizadas
- ✅ Design gamificado com ícones e cores vibrantes
- ✅ Sistema de alertas profissional (`AlertModal` + `useAlert` hook)
- ✅ **AlertModal**: Modal com overlay corrigido cobrindo toda a tela
- ✅ **useAlert Hook**: Gerenciamento centralizado de alertas e confirmações
- ✅ **LogoutButton**: Componente de logout com confirmação integrada
- ✅ **Input Aprimorado**: Efeitos de foco profissional e remoção de bordas pretas
- ✅ **DateInput**: Campo de data com formatação automática DD/MM/YYYY
- ✅ Loading states em botões e telas
- ✅ Enter key submete formulários
- ✅ Erros específicos e informativos
- ✅ Logout funcionando em todas as plataformas
- ✅ Design 100% responsivo para mobile, tablet e desktop
- ✅ Redução de ~40% de código via componentização
- 🎨 Efeitos de foco suaves nos campos de entrada
- 🔄 Sistema de alertas consistente cross-platform
- 📱 Design responsivo otimizado para web e mobile
- ♿ Acessibilidade aprimorada com navegação por teclado
- 🎯 Background azul claro (#F0F8FF - Alice Blue) consistente em todo o app

### **Utilitários**
- ✅ `utils/validators.ts` - 6 validadores (email, username, password, nome, telefone)
- ✅ `utils/dateUtils.ts` - 7 funções de data (formatação, cálculos, tempo relativo)

### **Perfil e Gamificação**
- ✅ Sistema de XP e Level (prontos para uso)
- ✅ Sistema de Moedas
- ✅ Streak tracking (sequência de dias)
- ✅ 6 estatísticas visíveis: Sequência, Level, XP, Moedas, Recorde, Dias
- ✅ Avatar com iniciais do usuário
- ✅ Informações completas: Nome, Username, Email, Data de Nascimento
- ✅ Data de nascimento formatada em português brasileiro
- ✅ Configurações: notificações, perfil público
- ✅ Logout com confirmação

### **Banco de Dados**

#### **Sistema de Desafios**
- ✅ 4 ENUMs de Desafios: 
  - `ChallengeCategory` (8 tipos): PHYSICAL_ACTIVITY, NUTRITION, HYDRATION, MENTAL_HEALTH, SLEEP, SOCIAL, PRODUCTIVITY, MINDFULNESS
  - `ChallengeDifficulty` (4 níveis): EASY, MEDIUM, HARD, EXPERT
  - `ChallengeFrequency` (4 tipos): DAILY, WEEKLY, MONTHLY, ONE_TIME
  - `ChallengeStatus` (5 estados): PENDING, IN_PROGRESS, COMPLETED, FAILED, SKIPPED
- ✅ Model **Challenge**: Catálogo de desafios com recompensas (XP e moedas)
- ✅ Model **UserChallenge**: Relação N:N User↔Challenge com tracking de progresso

#### **Sistema de Badges e Recompensas**
- ✅ 4 ENUMs de Badges:
  - `BadgeCategory` (6 tipos): BEGINNER, CONSISTENCY, MILESTONE, SPECIAL, SEASONAL, ACHIEVEMENT
  - `BadgeRequirementType` (7 tipos): CHALLENGES_COMPLETED, STREAK_DAYS, LEVEL_REACHED, XP_EARNED, SPECIFIC_CHALLENGE, CATEGORY_MASTER, SOCIAL_INTERACTION
  - `BadgeRarity` (4 níveis): COMMON, RARE, EPIC, LEGENDARY
  - `RewardType` (4 tipos): XP, COINS, BADGE, ITEM
- ✅ Model **Badge**: Catálogo de badges disponíveis com requisitos e raridade
- ✅ Model **UserBadge**: Badges conquistados pelos usuários (N:N User↔Badge)
- ✅ Model **RewardHistory**: Histórico completo de todas as recompensas ganhas
- ✅ **Seed de Badges**: Sistema de população inicial com 29 badges
  - 6 BEGINNER, 5 CONSISTENCY, 5 MILESTONE, 11 ACHIEVEMENT, 2 SPECIAL
  - Script: `npm run prisma:seed`

#### **Modelo User Completo**
- ✅ Campos de autenticação: id, email, username, password
- ✅ Dados pessoais: name (obrigatório), birthDate (obrigatório), bio, avatarUrl
- ✅ Sistema de gamificação: xp, coins, level, currentStreak, longestStreak
- ✅ Configurações: notificationsEnabled, profilePublic, dailyReminderTime, lastActiveDate
- ✅ Relações: userChallenges[], userBadges[], rewardHistory[]
- ✅ Timestamps: createdAt, updatedAt

#### **Otimizações**
- ✅ Constraints e índices para performance
- ✅ Cascade delete em todas as relações
- ✅ 6 migrations versionadas e aplicadas

### **Código e Organização**
- ✅ 100% TypeScript (frontend + backend)
- ✅ Código altamente componentizado e reutilizável
- ✅ Utils centralizados (validators, dateUtils, sistema de alertas)
- ✅ Tipagem forte com interfaces e types compartilhados
- ✅ Exports organizados (index.ts)
- ✅ Documentação inline com JSDoc
- ✅ **Documentação Completa**: JSDoc abrangente em todos os componentes
- ✅ **README Atualizado**: Guias de uso e exemplos para novos componentes

---

## 🗄️ Schema do Banco de Dados (Prisma)

### **Modelos Principais**

#### 1. **User** - Usuários do Sistema
```prisma
model User {
  // Autenticação
  id                   String   @id @default(uuid())
  email                String   @unique
  username             String   @unique
  password             String
  
  // Dados Pessoais
  name                 String
  birthDate            DateTime
  avatarUrl            String?
  bio                  String?
  
  // Gamificação
  xp                   Int      @default(0)
  coins                Int      @default(0)
  level                Int      @default(1)
  currentStreak        Int      @default(0)
  longestStreak        Int      @default(0)
  
  // Configurações
  notificationsEnabled Boolean  @default(true)
  profilePublic        Boolean  @default(false)
  dailyReminderTime    String?
  lastActiveDate       DateTime?
  
  // Timestamps
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  
  // Relações
  userChallenges       UserChallenge[]
  userBadges           UserBadge[]
  rewardHistory        RewardHistory[]
}
```

#### 2. **Challenge** - Catálogo de Desafios
```prisma
model Challenge {
  id             String              @id @default(uuid())
  title          String
  description    String
  category       ChallengeCategory
  difficulty     ChallengeDifficulty
  frequency      ChallengeFrequency  @default(DAILY)
  xpReward       Int
  coinsReward    Int
  isActive       Boolean             @default(true)
  createdAt      DateTime            @default(now())
  updatedAt      DateTime            @updatedAt
  
  // Relações
  userChallenges UserChallenge[]
}
```

**Exemplos de Challenges:**
- 🚰 "Beber 2L de água" - DAILY, HYDRATION, EASY → 10 XP, 5 coins
- 🧘 "Meditar por 10 minutos" - DAILY, MINDFULNESS, MEDIUM → 25 XP, 10 coins
- 🏋️ "Ir à academia 3x na semana" - WEEKLY, PHYSICAL_ACTIVITY, HARD → 100 XP, 50 coins

#### 3. **UserChallenge** - Desafios do Usuário
```prisma
model UserChallenge {
  id          String          @id @default(uuid())
  userId      String
  challengeId String
  status      ChallengeStatus @default(PENDING)
  progress    Int             @default(0)
  assignedAt  DateTime        @default(now())
  completedAt DateTime?
  notes       String?
  
  // Relações
  user        User            @relation(...)
  challenge   Challenge       @relation(...)
  
  @@unique([userId, challengeId, assignedAt])
  @@index([userId, status])
}
```

**Status do Desafio:**
- `PENDING` - Atribuído mas não iniciado
- `IN_PROGRESS` - Em andamento
- `COMPLETED` - Concluído com sucesso ✓
- `FAILED` - Falhou (não completou no prazo)
- `SKIPPED` - Usuário pulou o desafio

#### 4. **Badge** - Catálogo de Badges
```prisma
model Badge {
  id               String               @id @default(uuid())
  name             String               @unique
  description      String
  imageUrl         String
  category         BadgeCategory
  requirementType  BadgeRequirementType
  requirementValue Int
  rarity           BadgeRarity          @default(COMMON)
  order            Int                  @default(0)
  isActive         Boolean              @default(true)
  createdAt        DateTime             @default(now())
  updatedAt        DateTime             @updatedAt
  
  // Relações
  userBadges       UserBadge[]
}
```

**Exemplos de Badges:**
- 🎯 "Primeiro Passo" (BEGINNER, COMMON)
  - Requisito: Completar 1 desafio
- 🔥 "Guerreiro Semanal" (CONSISTENCY, RARE)
  - Requisito: Manter streak de 7 dias
- 💧 "Mestre da Hidratação" (ACHIEVEMENT, EPIC)
  - Requisito: Completar 100 desafios de hidratação
- 👑 "Lendário" (MILESTONE, LEGENDARY)
  - Requisito: Atingir nível 50

#### 5. **UserBadge** - Badges Conquistados
```prisma
model UserBadge {
  id          String   @id @default(uuid())
  userId      String
  badgeId     String
  earnedAt    DateTime @default(now())
  isDisplayed Boolean  @default(false)
  
  // Relações
  user        User     @relation(...)
  badge       Badge    @relation(...)
  
  @@unique([userId, badgeId])
  @@index([userId])
}
```

**Regras:**
- Cada usuário pode conquistar cada badge apenas **uma vez**
- `isDisplayed` permite escolher quais badges mostrar no perfil

#### 6. **RewardHistory** - Histórico de Recompensas
```prisma
model RewardHistory {
  id          String     @id @default(uuid())
  userId      String
  type        RewardType
  amount      Int
  source      String
  sourceId    String?
  description String?
  createdAt   DateTime   @default(now())
  
  // Relações
  user        User       @relation(...)
  
  @@index([userId, createdAt])
}
```

**Tipos de Recompensas:**
- `XP` - Pontos de experiência
- `COINS` - Moedas do jogo
- `BADGE` - Badge desbloqueado
- `ITEM` - Item especial

**Exemplos de Rewards:**
```json
// Recompensa por completar desafio
{
  "type": "XP",
  "amount": 50,
  "source": "challenge_completed",
  "sourceId": "challenge-uuid",
  "description": "Completou: Beber 2L de água"
}

// Recompensa de level up
{
  "type": "COINS",
  "amount": 100,
  "source": "level_up",
  "description": "Subiu para o nível 5!"
}

// Badge conquistado
{
  "type": "BADGE",
  "amount": 1,
  "source": "badge_earned",
  "sourceId": "badge-uuid",
  "description": "Conquistou: Primeiro Passo"
}
```

---

### **ENUMs do Sistema**

#### **Desafios**
```prisma
// Categorias de desafios
enum ChallengeCategory {
  PHYSICAL_ACTIVITY  // 🏃 Atividade física
  NUTRITION          // 🥗 Nutrição
  HYDRATION          // 💧 Hidratação
  MENTAL_HEALTH      // 🧠 Saúde mental
  SLEEP              // 😴 Sono
  SOCIAL             // 👥 Social
  PRODUCTIVITY       // 📊 Produtividade
  MINDFULNESS        // 🧘 Atenção plena
}

// Dificuldade dos desafios
enum ChallengeDifficulty {
  EASY    // 10-20 XP
  MEDIUM  // 25-50 XP
  HARD    // 75-150 XP
  EXPERT  // 200+ XP
}

// Frequência de repetição
enum ChallengeFrequency {
  DAILY      // Todo dia
  WEEKLY     // Toda semana
  MONTHLY    // Todo mês
  ONE_TIME   // Uma vez só
}

// Status do desafio
enum ChallengeStatus {
  PENDING      // Atribuído
  IN_PROGRESS  // Em andamento
  COMPLETED    // Concluído ✓
  FAILED       // Falhou ✗
  SKIPPED      // Pulado
}
```

#### **Badges e Recompensas**
```prisma
// Categorias de badges
enum BadgeCategory {
  BEGINNER      // 🌱 Iniciante
  CONSISTENCY   // 🔥 Consistência
  MILESTONE     // 🎯 Marcos importantes
  SPECIAL       // ⭐ Especiais
  SEASONAL      // 🎃 Sazonais
  ACHIEVEMENT   // 🏆 Conquistas
}

// Tipos de requisitos
enum BadgeRequirementType {
  CHALLENGES_COMPLETED  // Total de desafios completados
  STREAK_DAYS          // Dias de streak
  LEVEL_REACHED        // Nível atingido
  XP_EARNED            // XP total ganho
  SPECIFIC_CHALLENGE   // Desafio específico
  CATEGORY_MASTER      // Mestre em categoria
  SOCIAL_INTERACTION   // Interações sociais
}

// Raridade dos badges
enum BadgeRarity {
  COMMON     // ⚪ Comum (fácil)
  RARE       // 🔵 Raro (médio)
  EPIC       // 🟣 Épico (difícil)
  LEGENDARY  // 🟠 Lendário (muito difícil)
}

// Tipos de recompensas
enum RewardType {
  XP      // Pontos de experiência
  COINS   // Moedas
  BADGE   // Badge
  ITEM    // Item especial
}
```

---

### **Diagrama de Relações**

```
User (1) ←→ (N) UserChallenge (N) ←→ (1) Challenge
User (1) ←→ (N) UserBadge (N) ←→ (1) Badge
User (1) ←→ (N) RewardHistory
```

**Explicação:**
- Um **usuário** pode ter **vários desafios** atribuídos
- Um **desafio** pode ser atribuído a **vários usuários**
- Um **usuário** pode conquistar **vários badges**
- Um **badge** pode ser conquistado por **vários usuários**
- Um **usuário** pode ter **várias recompensas** no histórico

---

## 🚀 Próximos Passos

### **Sprint 3 - API de Desafios** ✅ CONCLUÍDA (20/10/2025)
- ✅ Service layer completo (8 funções, 457 linhas)
- ✅ Controller com 4 endpoints REST (137 linhas)
- ✅ Routes protegidas com authMiddleware (48 linhas)
- ✅ Atribuir 5 desafios diários aleatórios
- ✅ Completar desafios e ganhar recompensas (XP + coins)
- ✅ Sistema automático de Level Up (1000 XP/nível)
- ✅ Sistema automático de Streaks (dias consecutivos)
- ✅ Sistema automático de concessão de badges
- ✅ Sistema de registro de recompensas no RewardHistory

### **Sprint 4 - API de Badges e Recompensas** ✅ CONCLUÍDA (20/10/2025)
- ✅ Service layer completo (3 funções, 168 linhas)
- ✅ Controller com 3 endpoints REST (122 linhas)
- ✅ Routes protegidas com authMiddleware (45 linhas)
- ✅ Seeds de 29 badges iniciais em 5 categorias
- ✅ Sistema de verificação automática de requisitos (6 tipos)
- ✅ Endpoint de progresso de badges com cálculo em tempo real
- ✅ Sistema de concessão automática ao completar desafios

### **Sprint 5 - Seed de Desafios** ✅ CONCLUÍDA (20/10/2025)
- ✅ Seed de 43 desafios em 8 categorias (448 linhas)
- ✅ Distribuição balanceada de dificuldades (EASY, MEDIUM, HARD)
- ✅ Script npm: `npm run prisma:seed-challenges`
- ✅ Desafios variados e realistas para cada categoria

### **Sprint 6 - Interface de Desafios (Frontend)** ✅ CONCLUÍDA
- ✅ Criar `services/challenge.ts` (cliente API com interfaces e funções)
- ✅ Criar componente `ChallengeCard.tsx` com badges coloridos
- ✅ Criar tela `app/screens/ChallengesScreen.tsx`
- ✅ Criar rota `app/(tabs)/challenges.tsx`
- ✅ Adicionar tab "Desafios" no layout (ícone troféu)
- ✅ Implementar visualização de desafios diários (lista com cards)
- ✅ Header com saudação e stats (nível, XP, coins, streak)
- ✅ Card de progresso com porcentagem (X/5 desafios)
- ✅ Implementar botão de completar desafio (loading individual)
- ✅ Atualização de stats em tempo real após completar
- ✅ Feedback visual de level up (alert com mensagem)
- ✅ Toast de novos badges conquistados
- ✅ Pull-to-refresh para atualizar desafios
- ✅ Estado vazio com ícone e instrução
- ✅ Overlay verde em desafios completos
- ✅ Cores por categoria (8 categorias mapeadas)
- ✅ Cores por dificuldade (EASY, MEDIUM, HARD, EXPERT)

### **Sprint 7 - Interface de Badges (Frontend)** ✅ COMPLETO (27/10/2025)
- [x] Criar `services/badge.ts` (cliente API) - 189 linhas
- [x] Criar componente `BadgeCard.tsx` com progresso visual
- [x] Criar tela `app/screens/BadgesScreen.tsx` - 376 linhas
- [x] Criar estilos `app/styles/badges.styles.ts` - 334 linhas
- [x] Criar rota `app/(tabs)/badges.tsx` - Tab completa
- [x] Modal de detalhes do badge integrado
- [x] Sistema de tabs (Todos/Conquistados/Bloqueados)
- [x] Filtros por raridade (Todas/Comum/Rara/Épica/Lendária)
- [x] Barra de progresso para badges não conquistados
- [x] Cores por raridade (COMMON, RARE, EPIC, LEGENDARY)
- [x] Pull-to-refresh e estados vazios
- [x] Grid responsivo 2 colunas
- [x] Contador dinâmico de badges por tab

**Arquivos Criados:**
- ✅ `services/badge.ts` (189 linhas)
- ✅ `app/screens/BadgesScreen.tsx` (376 linhas)
- ✅ `app/styles/badges.styles.ts` (334 linhas)
- ✅ `components/ui/BadgeCard.tsx` (card reutilizável)
- ✅ `app/(tabs)/badges.tsx` (rota)

**Total:** 1213 linhas implementadas | 6 arquivos criados

### **Métricas do Projeto Atual** 📊 (Atualizado 01/11/2025)

**Código Implementado:**
- **Frontend:** ~7070 linhas de código (+1955 do Sprint 11)
- **Backend:** ~2667 linhas de código (+895 do Sprint 11)
- **Total Geral:** ~9737 linhas (+2850 do Sprint 11)
- **Componentes UI:** 27 componentes reutilizáveis (+7 do Sprint 11)
- **Telas Completas:** 11 telas (Login, Profile, EditProfile, Challenges, Badges, RewardHistory, Friends, FriendProfile, ActivityFeed, Explore, Settings)
- **Hooks Personalizados:** 5 hooks (useAlert, useImagePicker, useNotifications, useColorScheme, etc)
- **Serviços API:** 6 serviços (auth, challenge, badge, reward, friend, notificationCenter)

**Backend:**
- **Controllers:** 6 (auth, health, challenge, badge, reward, friend)
- **Services:** 4 (challenge, badge, reward, friend)
- **Models:** 10 tabelas no Prisma (+2 do Sprint 11)
- **Migrations:** 7 migrations aplicadas (+1 do Sprint 11)
- **Seeds:** 72 registros (29 badges + 43 desafios)
- **Endpoints:** 30 endpoints REST (+12 do Sprint 11)

**Progresso Geral:**
- **Sprints Completos:** 11/15 (73%) ⬆️
- **Features Implementadas:** 23/25 (92%) ⬆️
- **Linhas de Código:** 9737/10000 (97%) ⬆️
- **MVP Status:** 100% funcional ✅
- **Completude Média:** 79% ⬆️

---

### **Sprint 8 - Atualizar ProfileScreen** ✅ COMPLETO (27/10/2025)
- [x] Adicionar seção "Badges em Destaque"
- [x] Scroll horizontal com 5 badges mais recentes
- [x] Mini-cards profissionais com bordas coloridas por raridade
- [x] Botão "Ver Todos" → navega para BadgesScreen
- [x] Atualização automática com `useFocusEffect`
- [x] 3 estados visuais (loading/badges/vazio)
- [x] Espaçamento profissional entre cards (16px)
- [x] Design responsivo seguindo padrão do app

**Arquivos Modificados:**
- ✅ `app/screens/ProfileScreen.tsx` (+70 linhas)
- ✅ `app/styles/profile.styles.ts` (+143 linhas, 15 estilos novos)

**Funcionalidades Implementadas:**
- ✅ Seção "🏆 Conquistas Recentes" integrada ao perfil
- ✅ Navegação para tela completa de badges
- ✅ Formatação de data em português (DD MMM)
- ✅ Tratamento de erro silencioso
- ✅ Performance otimizada (apenas 5 badges carregados)

### **Sprint 10 - Sistema de Histórico de Recompensas** ✅ COMPLETO (01/11/2025)
- [x] Criar service layer de recompensas (backend/src/services/reward.service.ts - 161 linhas)
- [x] Criar controller de recompensas (backend/src/controllers/reward.controller.ts - 82 linhas)
- [x] Criar rotas de recompensas (backend/src/routes/reward.ts - 29 linhas)
- [x] Implementar 3 endpoints REST (history, stats, recent)
- [x] Criar RewardHistoryScreen (app/screens/RewardHistoryScreen.tsx - 382 linhas)
- [x] Criar estilos separados (reward-history.styles.ts - 372 linhas, reward-card.styles.ts - 133 linhas)
- [x] Criar componente RewardCard (components/ui/RewardCard.tsx - 73 linhas)
- [x] Expandir serviço reward.ts (239 linhas - 20+ sources mapeados)
- [x] Implementar filtros inteligentes (Todos, XP, Moedas, Conquistas)
- [x] Adicionar animações de slide horizontal ao trocar filtros
- [x] Implementar paginação infinita (20 itens por vez)
- [x] Adicionar pull-to-refresh
- [x] Criar 4 cards de estatísticas agregadas
- [x] Implementar estados vazios contextuais por filtro
- [x] Integrar botão "Ver Histórico" no ProfileScreen
- [x] Corrigir bugs de filtros e animações
- [x] Otimizar performance (React.memo, FlatList virtualization)

**Arquivos Criados:**
- ✅ `backend/src/services/reward.service.ts` (161 linhas)
- ✅ `backend/src/controllers/reward.controller.ts` (82 linhas)
- ✅ `backend/src/routes/reward.ts` (29 linhas)
- ✅ `app/screens/RewardHistoryScreen.tsx` (382 linhas)
- ✅ `app/styles/reward-history.styles.ts` (372 linhas)
- ✅ `app/styles/reward-card.styles.ts` (133 linhas)
- ✅ `components/ui/RewardCard.tsx` (73 linhas)

**Total:** 1471 linhas implementadas | 7 arquivos criados | 6 arquivos modificados

### **Futuras Funcionalidades**
- [ ] Sistema de notificações in-app (histórico visual)
- [ ] Gráficos de progresso (charts de XP/moedas ao longo do tempo)
- [ ] Filtro por data no histórico (seletor de período)
- [ ] Export de histórico (CSV/PDF)
- [ ] Animação ao conquistar badge (confetti/lottie)
- [ ] Sistema de amigos e ranking
- [ ] Loja de itens com moedas
- [ ] Desafios personalizados criados pelo usuário
- [ ] Desafios em equipe/competitivos
- [ ] Eventos sazonais com badges exclusivos

### **Sprint 9 - Sistema de Notificações** ✅ COMPLETO (27/10/2025)
- [x] Instalar dependências (expo-notifications, expo-device, expo-constants)
- [x] Criar serviço de notificações (services/notifications.ts - 404 linhas)
- [x] Criar hook useNotifications (hooks/useNotifications.ts - 126 linhas)
- [x] Integrar no app/_layout.tsx (setup global)
- [x] Integrar em ChallengesScreen (notificações de conquistas)
- [x] Integrar em SettingsScreen (toggle de notificações)
- [x] Configurar app.json (plugin + iOS/Android identifiers)
- [x] Sistema de permissões (iOS/Android)
- [x] Lembretes diários (9h e 21h)
- [x] Notificações instantâneas (badges, level up)
- [x] Navegação ao tocar notificações
- [x] Persistência de preferências (AsyncStorage)

**Arquivos Criados:**
- ✅ `services/notifications.ts` (404 linhas - 13 funções)
- ✅ `hooks/useNotifications.ts` (126 linhas - setup + navegação)

**Arquivos Modificados:**
- ✅ `app/_layout.tsx` (integração global)
- ✅ `app/screens/ChallengesScreen.tsx` (notificações de conquistas)
- ✅ `app/(tabs)/settings.tsx` (toggle + AsyncStorage)
- ✅ `app.json` (plugin de notificações configurado)

**Funcionalidades Implementadas:**
- ✅ 5 tipos de notificações (daily, streak, badge, level up, challenges)
- ✅ Agendamento automático de lembretes (DAILY trigger)
- ✅ Cancelamento inteligente (streak cancelado ao completar desafio)
- ✅ Navegação contextual (cada notificação leva à tela correta)
- ✅ Canal Android configurado (cor, som, vibração)
- ✅ Badge count no ícone do app
- ✅ Listeners de recebimento e resposta
- ✅ Cleanup automático ao desmontar app

**Métricas do Sprint 9:**
- 📦 2 arquivos criados (530 linhas)
- 🔄 4 arquivos modificados
- 🎣 1 hook personalizado
- 🌐 1 serviço completo (13 funções)
- 🔔 5 tipos de notificações
- 📱 Suporte multiplataforma (iOS/Android)

---

## 📋 Changelog - Atualizações Recentes

### **27 de Outubro de 2025** 🆕

#### **Sprint 9 - Sistema de Notificações Push - ✅ COMPLETO**
- ✅ **Serviço de Notificações** (`services/notifications.ts` - 404 linhas):
  - 13 funções implementadas
  - `requestNotificationPermissions()` - solicita permissões iOS/Android
  - `scheduleDailyReminder()` - lembrete às 9h (DAILY trigger)
  - `scheduleStreakReminder()` - lembrete às 21h (DAILY trigger)
  - `cancelStreakReminder()` - cancela ao completar desafio
  - `notifyBadgeEarned(name, rarity)` - notificação instantânea de badge
  - `notifyLevelUp(level)` - notificação instantânea de level up
  - `notifyChallengesAssigned(count)` - novos desafios disponíveis
  - `setNotificationsEnabled(boolean)` - salva preferência + agenda/cancela
  - `getNotificationsEnabled()` - carrega preferência do AsyncStorage
  - Emojis personalizados por raridade (🔵 Common, 🟣 Rare, 🟠 Epic, 🟡 Legendary)
  - Canal Android configurado (importância MAX, vibração, cor #20B2AA)
  
- ✅ **Hook useNotifications** (`hooks/useNotifications.ts` - 126 linhas):
  - Setup automático ao iniciar app
  - Solicita permissões na primeira execução
  - Agenda lembretes se notificações habilitadas
  - Listeners de notificação recebida e tocada
  - Navegação inteligente por tipo:
    * `DAILY_REMINDER` → /(tabs)/challenges
    * `STREAK_REMINDER` → /(tabs)/challenges
    * `CHALLENGE_ASSIGNED` → /(tabs)/challenges
    * `BADGE_EARNED` → /(tabs)/badges
    * `LEVEL_UP` → /(tabs)/ (home)
  - Cleanup automático ao desmontar (`.remove()` nos listeners)
  
- ✅ **Integrações Frontend**:
  - `app/_layout.tsx` → Hook global inicializado
  - `app/screens/ChallengesScreen.tsx` → 3 notificações ao completar desafio:
    * `cancelStreakReminder()` quando completa desafio
    * `notifyLevelUp(newLevel)` se subiu de nível
    * `notifyBadgeEarned(name, rarity)` para cada badge ganho
  - `app/(tabs)/settings.tsx` → Toggle de notificações funcional:
    * Carrega preferência ao montar tela
    * Salva com `saveNotificationsPreference()`
    * Feedback de sucesso explicando horários (9h/21h)
  - `app.json` → Plugin configurado:
    * expo-notifications plugin adicionado
    * Ícone: `./assets/images/icon.png`
    * Cor: `#20B2AA` (turquesa do app)
    * iOS bundleIdentifier: `com.fiquestlife.app`
    * Android package: `com.fiquestlife.app`
    
- ✅ **5 Tipos de Notificações**:
  1. ⏰ **DAILY_REMINDER** (9h) - "Novos desafios disponíveis!"
  2. 🔥 **STREAK_REMINDER** (21h) - "Não perca sua sequência!"
  3. 🏆 **BADGE_EARNED** (instantâneo) - "Você conquistou: [Nome]!"
  4. 🎉 **LEVEL_UP** (instantâneo) - "Parabéns! Você alcançou o nível [X]!"
  5. 🎯 **CHALLENGE_ASSIGNED** (instantâneo) - "[X] novos desafios!"

**Dependências Instaladas:**
- `expo-notifications` - Sistema de notificações nativo
- `expo-device` - Detecção de device físico
- `expo-constants` - Constantes do sistema

**Características Técnicas:**
- ✅ DAILY trigger type para lembretes recorrentes
- ✅ AsyncStorage para persistência de preferências
- ✅ Permission handling automático (iOS/Android)
- ✅ Badge count no ícone do app
- ✅ Sons e vibrações configurados
- ✅ Listeners com cleanup automático
- ✅ Zero erros TypeScript

**Limitações:**
- ⚠️ Notificações agendadas NÃO funcionam em simulador/emulador
- ✅ Requer device físico para testar lembretes (9h/21h)
- ✅ Notificações instantâneas funcionam em todos os ambientes

**Métricas:**
- 📦 2 arquivos criados (530 linhas)
- 🔄 4 arquivos modificados
- 🎣 1 hook personalizado
- 🌐 1 serviço completo (13 funções)
- 🔔 5 tipos de notificações
- 📱 Multiplataforma (iOS/Android)

---

### **01 de Novembro de 2025** 🆕

#### **Sprint 10 - Sistema de Histórico de Recompensas - ✅ COMPLETO**

**Backend - API de Histórico (272 linhas)**

- ✅ **Service Layer** (`backend/src/services/reward.service.ts` - 161 linhas):
  - `getRewardHistory()` - Busca histórico com filtros dinâmicos e paginação
  - `getRewardStats()` - Estatísticas agregadas (totalXP, totalCoins, totalBadges, totalRewards)
  - Suporte a filtros: `type` (XP/COINS/BADGE), `startDate`, `endDate`, `limit`, `offset`
  - Paginação com flag `hasMore` para UI de scroll infinito
  - Queries Prisma otimizadas com índices (userId, createdAt)
  - Ordenação por data decrescente (mais recentes primeiro)
  
- ✅ **Controller** (`backend/src/controllers/reward.controller.ts` - 82 linhas):
  - `GET /rewards/history` - Lista histórico completo com query params opcionais
  - `GET /rewards/stats` - Retorna estatísticas totais do usuário
  - `GET /rewards/recent` - Últimas 10 recompensas (atalho para UI)
  - Todos os endpoints protegidos com `authMiddleware`
  - Validação de tipos e tratamento de erros
  
- ✅ **Routes** (`backend/src/routes/reward.ts` - 29 linhas):
  - Rotas REST organizadas
  - Autenticação obrigatória em todas as rotas
  - Query params tipados e validados

**Frontend - Tela de Histórico (1199 linhas)**

- ✅ **RewardHistoryScreen** (`app/screens/RewardHistoryScreen.tsx` - 382 linhas):
  - Header simples com botão voltar circular (42x42, fundo branco)
  - 4 Cards de estatísticas: Total de Recompensas, XP Ganho, Moedas Ganhas, Conquistas
  - **Filtros inteligentes** com scroll horizontal:
    * Todos, XP (⭐), Moedas (💰), Conquistas (🏆)
    * Altura compacta (34px) para economizar espaço
    * Estados ativo/inativo com cores distintas
  - **Animações suaves** ao trocar filtros:
    * Slide horizontal bidirecional (esquerda ↔ direita)
    * Detecta direção baseado na ordem dos filtros
    * 200ms slide out → carrega dados → 200ms slide in
    * Animated API com useNativeDriver para 60fps
    * Zero piscar - dados carregados durante animação
  - **Lista paginada** com FlatList otimizada:
    * Scroll infinito (20 itens por vez)
    * Pull-to-refresh funcional
    * Loading states (inicial, refresh, load more)
    * windowSize: 10, removeClippedSubviews: true
    * initialNumToRender: 15, maxToRenderPerBatch: 10
  - **Estados vazios contextuais**:
    * "Nenhuma recompensa encontrada" (filtro ALL)
    * "Você ainda não ganhou XP" (filtro XP)
    * "Você ainda não ganhou moedas" (filtro COINS)
    * "Você ainda não conquistou badges" (filtro BADGE)
  - **Error handling** com mensagem de erro e retry
  - useFocusEffect para recarregar ao entrar na tela
  - SafeAreaView com edges=['top'] (sem faixa inferior)
  
- ✅ **RewardCard Component** (`components/ui/RewardCard.tsx` - 73 linhas):
  - Card individual de recompensa com layout profissional
  - Ícone circular colorido por tipo (XP, COINS, BADGE)
  - Nome da recompensa (fonte 15px, peso 600)
  - Descrição contextual com source formatado
  - Valor formatado: `+X XP`, `+X Moedas`, emoji de badge
  - Data em português (ex: "01 Nov")
  - Otimizado com React.memo para performance
  - Acessibilidade completa (accessibilityLabel/Role)
  - Sombras Platform.select para iOS/Android/Web
  
- ✅ **Estilos Organizados** (505 linhas):
  - `app/styles/reward-history.styles.ts` (372 linhas):
    * Seções comentadas: Container, Header, Stats, Filtros, Lista, Empty/Error
    * Responsividade multiplataforma (iOS/Android/Web)
    * Cores consistentes: #F0F8FF (Alice Blue)
    * Sombras profissionais com Platform.select
    * Gap e spacing padronizados (8px, 12px, 16px, 20px)
  - `app/styles/reward-card.styles.ts` (133 linhas):
    * Estilos separados do componente
    * Layout flexível e responsivo
    * Ícone circular 48x48 com cores por tipo
    * Padding e margins consistentes
  
- ✅ **Serviço Expandido** (`services/reward.ts` - 239 linhas):
  - `getRewardHistory(filters)` - Busca com URLSearchParams
  - `getRewardStats()` - Estatísticas totais
  - `getRecentRewards()` - Top 10 mais recentes
  - **20+ Sources Mapeadas** em `getRewardSourceLabel()`:
    * CHALLENGE_COMPLETION → "Desafio completado"
    * LEVEL_MILESTONE → "Novo nível alcançado"
    * DAILY_LOGIN → "Login diário"
    * STREAK_BONUS → "Bônus de sequência"
    * FIRST_CHALLENGE → "Primeiro desafio"
    * BADGE_EARNED → "Conquista desbloqueada"
    * CATEGORY_MASTER → "Mestre de categoria"
    * WEEK_COMPLETION → "Semana completa"
    * MONTH_MILESTONE → "Marco mensal"
    * REFERRAL_BONUS → "Indicação de amigo"
    * ACHIEVEMENT_UNLOCK → "Conquista desbloqueada"
    * QUEST_COMPLETION → "Missão concluída"
    * EVENT_PARTICIPATION → "Participação em evento"
    * DAILY_STREAK → "Sequência diária"
    * WEEKLY_CHALLENGE → "Desafio semanal"
    * SPECIAL_EVENT → "Evento especial"
    * BONUS_REWARD → "Recompensa bônus"
    * MYSTERY_BOX → "Caixa misteriosa"
    * LEVEL_UP_BONUS → "Bônus de nível"
    * Fallback: Remove underscore e capitaliza (ex: "New Source")
  - **Interfaces TypeScript completas**:
    * RewardItem, RewardHistoryFilters, RewardHistoryResponse, RewardStats
  - **Constantes exportadas**:
    * REWARD_TYPE_ICONS: { XP: '⭐', COINS: '💰', BADGE: '🏆', ITEM: '🎁' }
    * REWARD_TYPE_LABELS: { XP: 'Experiência', COINS: 'Moedas', ... }
    * REWARD_TYPE_COLORS: { XP: '#20B2AA', COINS: '#FFD700', BADGE: '#FF6B6B', ... }

**Integrações**

- ✅ **ProfileScreen** atualizado:
  - Botão "Ver Histórico" adicionado na seção de cards
  - Navegação para `/screens/reward-history`
  - Espaçamento consistente (marginBottom: 16)
  
- ✅ **Barrel Exports**:
  - `components/ui/index.ts` - RewardCard exportado
  - Facilita importações em toda a aplicação

**Funcionalidades Implementadas**

✅ Visualização completa do histórico de recompensas  
✅ 4 filtros inteligentes (Todos, XP, Moedas, Conquistas)  
✅ Animação de slide horizontal ao trocar filtros  
✅ Scroll horizontal nos botões de filtro  
✅ Estatísticas agregadas no topo (4 cards)  
✅ Paginação infinita (20 itens por página)  
✅ Pull-to-refresh funcional  
✅ Estados vazios contextuais por filtro  
✅ Loading states (inicial, refresh, load more)  
✅ Error handling com retry  
✅ Formatação de datas em português  
✅ Cores por tipo de recompensa  
✅ Performance otimizada (React.memo, FlatList virtualization)  
✅ Acessibilidade completa  
✅ Multiplataforma (iOS/Android/Web)  

**Correções de Bugs**

✅ **Filtros mostrando dados incorretos**:
  - Problema: Estado `selectedFilter` não atualizado a tempo
  - Solução: Passar filtro diretamente como parâmetro em handleFilterChange
  
✅ **Área invisível dos filtros ocupando espaço**:
  - Problema: `filtersContainer` com paddingVertical muito grande
  - Solução: Reduzir de 12px → 8px, adicionar flexGrow: 0, altura fixa 34px
  
✅ **Faixa estranha no final da tela**:
  - Problema: SafeAreaView adicionando padding inferior
  - Solução: Usar react-native-safe-area-context com edges={['top']}
  
✅ **Lista piscando ao trocar filtros**:
  - Problema: useFocusEffect recarregando durante animação
  - Solução: Remover selectedFilter das dependências, carregar dados manualmente

**Métricas do Sprint 10**

- 📦 **7 arquivos criados** (1471 linhas):
  - 3 backend: service, controller, routes (272 linhas)
  - 4 frontend: screen, 2 styles, component (1199 linhas)
- 🔄 **6 arquivos modificados**:
  - 1 backend: index.ts
  - 5 frontend: reward.ts, ProfileScreen, profile.styles, index.ts
- 🎨 **1 componente novo** (RewardCard com React.memo)
- 🌐 **3 endpoints REST** (history, stats, recent)
- 🔔 **4 filtros** com animações de transição
- 📱 **Multiplataforma** (iOS/Android/Web)
- ⚡ **Performance** otimizada (FlatList + Animated com useNativeDriver)

**Dependências**

Nenhuma nova dependência - apenas APIs nativas do React Native:
- Animated API (animações 60fps)
- FlatList (virtualização)
- ScrollView (scroll horizontal)
- SafeAreaView (react-native-safe-area-context)

---

### **27 de Outubro de 2025**

#### **Sistema de Upload de Fotos de Perfil - ✅ COMPLETO**
- ✅ Hook `useImagePicker.ts` implementado (177 linhas):
  - Gerenciamento de permissões automáticas (galeria + câmera)
  - Seleção de imagem da galeria com crop 1:1
  - Captura de foto pela câmera
  - Qualidade 0.8 otimizada para web
  - Estados de loading e tratamento de erros
  - Suporte multiplataforma (iOS/Android/Web)
  
- ✅ Componente `ProfileAvatar.tsx` criado (76 linhas):
  - Avatar reutilizável com suporte a upload
  - Props: initials, imageUrl, size, onPress, loading, showHint
  - Loading overlay durante upload
  - Hint text configurável
  - TouchableOpacity integrado
  - Circular crop com overflow hidden
  
- ✅ `components/ui/Avatar.tsx` aprimorado:
  - Suporte a prop `imageUrl` para exibir fotos
  - Fallback automático para iniciais
  - Renderização condicional (imagem vs iniciais)
  
- ✅ Backend - Endpoint `POST /user/avatar` (126 linhas):
  - Upload multipart/form-data com FormData
  - Integração com Supabase Storage
  - Geração de URLs públicas
  - Atualização do campo avatarUrl no banco
  - Validação de arquivo e tipo
  - Logs detalhados para debugging
  
- ✅ `backend/src/lib/supabase.ts` atualizado:
  - Migrado de SUPABASE_ANON_KEY para SUPABASE_SERVICE_ROLE_KEY
  - Configuração correta para operações de storage no backend
  - Security: Service Role Key nunca exposta ao frontend
  
- ✅ `services/api.ts` - Função `uploadAvatar()` (46 linhas):
  - Upload com FormData e multipart
  - Tratamento de resposta da API
  - Tipagem TypeScript correta
  
- ✅ Tela `EditProfileScreen.tsx` atualizada:
  - Função `handleChangeAvatar` implementada (47 linhas)
  - Integração com ProfileAvatar component
  - Estados de loading durante upload
  - Feedback visual de sucesso/erro
  - Refresh automático após upload
  - Header customizado removido (UI mais limpa)
  
- ✅ Tela `ProfileScreen.tsx` simplificada:
  - Usa Avatar simples (read-only)
  - Upload movido para EditProfileScreen
  - Separação clara de responsabilidades
  - Código ~50 linhas mais limpo

**Arquivos de Documentação:**
- ✅ `SUPABASE_QUICK_SETUP.md` - Guia rápido de 5 minutos (115 linhas)
- ✅ `SETUP_SERVICE_KEY.md` - Como configurar Service Role Key

**Métricas do Feature:**
- 📦 10 arquivos criados/modificados
- 💻 639 linhas de código adicionadas
- 🧹 50+ linhas de código removidas (styles obsoletos)
- 🎨 2 componentes novos (useImagePicker hook + ProfileAvatar)
- 🌐 1 endpoint REST criado
- 📚 2 guias de documentação

---

#### **Refatoração e Melhorias de Código - ✅ COMPLETO**
- ✅ Componentização aprimorada:
  - ProfileAvatar extraído de ProfileScreen
  - Redução de duplicação de código
  - Componente reutilizável em múltiplas telas
  
- ✅ Limpeza de código de produção (25 logs removidos):
  - 20 console.log() removidos do frontend
  - 5 console.log() removidos do backend
  - Código pronto para produção
  
- ✅ Otimização de estilos:
  - 50+ linhas de styles não utilizados removidos
  - profile.styles.ts limpo e organizado
  - avatarContainer adicionado (10 linhas)
  - Melhor manutenibilidade
  
- ✅ TypeScript errors corrigidos:
  - Tratamento de fileName null em useImagePicker
  - Zero erros de compilação
  - Tipos corretos em todas as interfaces

---

#### **Funcionalidade "Perfil Público" - ✅ IMPLEMENTADA**
- ✅ Switch "Perfil Público" agora funcional (settings.tsx):
  - Função `handleToggleProfilePublic` implementada (30 linhas)
  - Salvamento no banco de dados via API
  - Atualização de AsyncStorage local
  - Estados de loading durante salvamento
  - Rollback automático em caso de erro
  - Feedback visual de sucesso/erro
  
- ✅ Backend `PUT /user/profile` atualizado:
  - Suporte a updates parciais (todos os campos opcionais)
  - Campos suportados: name, username, bio, birthDate, profilePublic, notificationsEnabled, dailyReminderTime
  - Validação condicional (apenas valida campos enviados)
  - Mantém segurança (username uniqueness check)
  - Melhor flexibilidade da API

---

#### **Bug Fixes Críticos - ✅ RESOLVIDOS**
- ✅ **Erro 401 em requisições autenticadas** (3 bugs corrigidos):
  1. Bug no contexto do auth middleware (backend)
  2. Mapeamento incorreto de response.data no frontend
  3. Interceptor do Axios não injetando token corretamente
  
- ✅ **StorageUnknownError no Supabase**:
  - Causa: Backend usando ANON_KEY em vez de SERVICE_ROLE_KEY
  - Solução: Migrado para Service Role Key
  - Storage operations agora funcionam corretamente
  
- ✅ **TypeScript errors em useImagePicker**:
  - fileName pode ser null após crop
  - Tratamento: Fallback para `avatar-${Date.now()}.jpg`
  - Zero erros de compilação

---

#### **UI/UX Improvements - ✅ IMPLEMENTADAS**
- ✅ EditProfileScreen header removido:
  - Faixa branca superior removida
  - Seta de voltar removida (navegação nativa mantida)
  - Interface mais limpa e moderna
  
- ✅ Estados de loading aprimorados:
  - Loading individual em botões de ações
  - Overlay de loading em upload de foto
  - Feedback visual consistente
  
- ✅ Tratamento de erros robusto:
  - Alertas informativos para o usuário
  - Logs detalhados no console (desenvolvimento)
  - Graceful degradation (app funciona sem storage configurado)

---

#### **Tentativas Revertidas (Documentadas)**
- ❌ **Auto-login com AuthProvider**:
  - Causa: Loading infinito, app travava na inicialização
  - Solução: Revertido, mantém login manual
  
- ❌ **Fix de input focus com keys**:
  - Tentativa: Adicionar key props e KeyboardAvoidingView changes
  - Resultado: Não resolveu o problema
  - Status: Revertido, issue documentado como Known Issue

---

#### **Known Issues Documentados** ⚠️
- ⚠️ **Input focus issues** (LoginScreen e EditProfileScreen):
  - Sintoma: Inputs perdem foco ao tocar em dispositivos móveis
  - Afeta: Campo de email, username, senha, bio
  - Workaround: Tocar novamente no campo
  - Status: Issue conhecido, não bloqueante
  - Prioridade: Média (UX impactada mas funcional)
  
- ⚠️ **Bio field não editável** (EditProfileScreen em mobile):
  - Sintoma: Campo de bio não abre teclado em alguns dispositivos
  - Plataforma: Afeta principalmente Android
  - Workaround: Usar versão web ou aguardar fix
  - Status: Issue conhecido, investigação em andamento

---

### **20 de Outubro de 2025** 🆕

#### **Frontend de Desafios - SPRINT 6 ✅ CONCLUÍDA**
- ✅ `services/challenge.ts` com interfaces e funções de API (191 linhas):
  - Interfaces: Challenge, UserChallenge, CompleteChallengeResponse
  - Types: ChallengeCategory, ChallengeDifficulty, ChallengeStatus, ChallengeFrequency
  - Mapeamentos de cores por categoria (8 categorias)
  - Mapeamentos de cores e labels por dificuldade (4 níveis)
  - Funções: getDailyChallenges, completeChallenge, getChallengeHistory, getAllChallenges
- ✅ `components/ui/ChallengeCard.tsx` (186 linhas):
  - Badge de categoria colorido com ícone (8 cores)
  - Badge de dificuldade colorido (4 cores)
  - Título e descrição estilizados
  - Row de recompensas (⭐ XP + 💰 coins)
  - Botão com 3 estados (ativo, loading, completo)
  - Overlay verde em desafios completos
- ✅ `app/screens/ChallengesScreen.tsx` (258 linhas):
  - Header com saudação e stats (nível, XP, coins, streak)
  - Card de progresso com porcentagem e barra visual
  - Lista de desafios com ChallengeCard
  - Pull-to-refresh funcional
  - handleCompleteChallenge com atualização em tempo real
  - Feedback de level up e novos badges (alert)
  - Estado vazio com instruções
- ✅ `app/(tabs)/challenges.tsx` - Nova tab "Desafios" com ícone troféu
- ✅ `app/(tabs)/_layout.tsx` - Adicionada tab no layout (4 tabs agora)
- ✅ `app/styles/challenges.styles.ts` - Estilos completos (138 linhas)
- ✅ Integração completa com backend (4 endpoints de desafios)

**Métricas do Sprint 6:**
- 📦 6 arquivos criados (776 linhas)
- 🔄 3 arquivos atualizados
- 🎨 1 novo componente de UI (ChallengeCard)
- 📱 1 nova tela (ChallengesScreen)
- 🗺️ 1 nova tab na navegação
- 🌐 4 funções de API integradas
- 🎯 17 funcionalidades implementadas

---

#### **API de Desafios (Backend) - SPRINT 3 ✅ CONCLUÍDA**
- ✅ `challenge.service.ts` com 8 funções implementadas (457 linhas):
  - `assignDailyChallenges` - Atribui 5 desafios aleatórios diários
  - `getUserDailyChallenges` - Busca desafios do dia
  - `completeChallenge` - Completa desafio e dá recompensas
  - `updateUserStats` - Atualiza XP/coins e calcula level
  - `checkAndUpdateStreak` - Gerencia dias consecutivos
  - `checkAndAwardBadges` - Verifica e concede badges automaticamente
  - `getChallengeHistory` - Histórico de desafios completados
  - `getAllChallenges` - Lista todos os desafios
- ✅ `challenge.controller.ts` com 4 endpoints REST (137 linhas)
- ✅ `challenge.routes.ts` protegido com authMiddleware (48 linhas)
- ✅ Sistema de level: `Math.floor(totalXP / 1000) + 1`
- ✅ Sistema de streaks com timezone handling
- ✅ Badge automation com 6 tipos de requisitos
- ✅ Reward History registrando XP, COINS e BADGES

#### **API de Badges (Backend) - SPRINT 4 ✅ CONCLUÍDA**
- ✅ `badge.service.ts` com 3 funções implementadas (168 linhas):
  - `getAllBadges` - Lista todos os badges disponíveis
  - `getUserBadges` - Badges conquistados pelo usuário
  - `getBadgesProgress` - Calcula progresso de todos os badges
- ✅ `badge.controller.ts` com 3 endpoints REST (122 linhas)
- ✅ `badge.routes.ts` protegido com authMiddleware (45 linhas)
- ✅ Cálculo de progresso automático (current/required/percentage)
- ✅ Summary com percentual de badges conquistados

#### **Seed de Desafios - SPRINT 5 ✅ CONCLUÍDA**
- ✅ `seed-challenges.ts` com 43 desafios em 8 categorias (448 linhas)
- ✅ Distribuição balanceada: EASY (16), MEDIUM (22), HARD (5)
- ✅ 8 categorias: PHYSICAL_ACTIVITY, NUTRITION, HYDRATION, MENTAL_HEALTH, SLEEP, SOCIAL, PRODUCTIVITY, MINDFULNESS
- ✅ Script npm adicionado: `npm run prisma:seed-challenges`
- ✅ Recompensas variadas: EASY (30-60 XP), MEDIUM (70-120 XP), HARD (120-150 XP)

#### **Documentação Atualizada**
- ✅ README.md atualizado com estrutura completa do projeto
- ✅ Novos endpoints de desafios e badges documentados
- ✅ Seção de sistema de gamificação adicionada
- ✅ Exemplos de requisições e respostas da API
- ✅ Guia de seeds (badges e desafios)
- ✅ roadmap_fiquestlife.md atualizado com status das Sprints 3, 4 e 5

---

### **17 de Outubro de 2025**

#### **Componente SettingsMenuItem**
- ✅ Criado componente reutilizável `SettingsMenuItem.tsx`
- ✅ Suporte a 3 tipos: `clickable`, `toggle`, `info`
- ✅ Economia de ~73% no código de telas de configurações
- ✅ Documentação completa no README com exemplos de uso
- ✅ Exportado em `components/ui/index.ts`

#### **Refatoração da Tela de Configurações**
- ✅ Refatorada `SettingsScreen` usando `SettingsMenuItem`
- ✅ Redução de ~401 para ~397 linhas + componente reutilizável
- ✅ Removido 6 estilos não utilizados do `settings.styles.ts`
- ✅ Removido imports não utilizados (`Switch` do React Native)
- ✅ Código mais limpo, legível e manutenível

#### **Sistema de Badges e Recompensas**
- ✅ Adicionado sistema completo de badges ao schema do Prisma
- ✅ 4 ENUMs criados: `BadgeCategory`, `BadgeRarity`, `RewardType`, `BadgeRequirementType`
- ✅ 3 novos models: `Badge`, `UserBadge`, `RewardHistory`
- ✅ Seed com 29 badges iniciais em 5 categorias
- ✅ Migrations aplicadas: `20251017145006_add_badges_and_rewards`

#### **Tela de Edição de Perfil**
- ✅ Criada `EditProfileScreen.tsx` com validações profissionais
- ✅ Campos: Avatar, Nome, Username, Bio, Data de Nascimento
- ✅ Validações em tempo real
- ✅ Backend endpoint: `PUT /user/profile`
- ✅ Auto-refresh no `ProfileScreen` após edição (useFocusEffect)
- ✅ Estilos consistentes com padrão de cards (maxWidth 500px, borderRadius 20px)

#### **Melhorias no Sistema de Autenticação**
- ✅ Movido botão de logout para `SettingsScreen`
- ✅ Removido `LogoutButton` do `ProfileScreen`
- ✅ Adicionada seção "Sair da Conta" nas configurações
- ✅ Confirmação profissional antes do logout (web + mobile)

#### **Componentização e Qualidade de Código**
- ✅ Removidas todas as referências "@author GitHub Copilot" (7 arquivos)
- ✅ Análise completa de oportunidades de componentização
- ✅ 14 componentes de UI disponíveis no projeto (ProfileAvatar e ChallengeCard adicionados)
- ✅ Documentação atualizada no README.md

---

## ⚠️ Known Issues (Problemas Conhecidos)

### **Input Focus Issues** (Prioridade: Média)
**Sintoma:** Em dispositivos móveis (principalmente Android), os campos de entrada (input) podem perder o foco ao serem tocados, exigindo múltiplos toques para edição.

**Telas Afetadas:**
- LoginScreen (campos de email, username, senha)
- EditProfileScreen (campo de bio especialmente problemático)

**Workaround:**
- Tocar novamente no campo até que o teclado apareça
- Usar a versão web do app para edições extensas
- No EditProfile: campo de bio pode requerer 2-3 toques

**Status:** Issue conhecido e documentado. Tentativas de fix foram revertidas por não resolverem o problema. Investigação em andamento.

**Impacto:** UX prejudicada, mas funcionalidade mantida. Não bloqueante para uso do app.

---

### **Bio Field Editing (Android)** (Prioridade: Média)
**Sintoma:** Em alguns dispositivos Android, o campo multiline de bio não abre o teclado consistentemente.

**Plataforma:** Principalmente Android (React Native Text Input com multiline)

**Workaround:**
- Usar versão web para editar bio
- Tentar tocar múltiplas vezes no campo
- Reiniciar o app pode ajudar temporariamente

**Status:** Issue conhecido, relacionado ao Input focus issue acima.

---

### **Upload de Fotos sem Supabase Storage** (Prioridade: Baixa)
**Sintoma:** Se o bucket do Supabase Storage não foi configurado, o upload de fotos retorna erro 500.

**Causa:** Backend configurado mas bucket não criado no Supabase Dashboard.

**Solução:** Seguir o guia rápido `SUPABASE_QUICK_SETUP.md` (5 minutos).

**Workaround:** App funciona normalmente com avatares baseados em iniciais. Upload não é obrigatório para uso do app.

**Status:** Por design. Requer configuração manual do storage.

---

## 🆕 Últimas Atualizações

### **1 de Novembro de 2025** 🎉

#### **Sprint 11 - Sistema Completo de Amigos** ✅ IMPLEMENTADO
**Linhas de Código:** ~2850 linhas | **Endpoints:** 12 REST | **Componentes:** 7 novos

**🗄️ Backend (895 linhas):**
- ✅ **Database Schema:**
  - 2 novos models: `Friendship` e `FriendRequest`
  - 1 novo enum: `FriendshipStatus` (PENDING, ACCEPTED, REJECTED, BLOCKED)
  - Relações bidirecionais otimizadas (2 registros por amizade)
  - Índices para queries rápidas
  - Migration executada com sucesso

- ✅ **Friend Service** (530 linhas - 12 funções):
  - `sendFriendRequest` - Envio de solicitações (validações completas)
  - `acceptFriendRequest` - Aceitação com criação bidirecional
  - `rejectFriendRequest` - Rejeição com limpeza
  - `cancelFriendRequest` - Cancelamento de pendentes (pelo sender)
  - `removeFriend` - Remoção bidirecional + cleanup
  - `blockUser` - Sistema de bloqueio
  - `getFriendsList` - Lista completa com stats
  - `getPendingRequests` - Solicitações recebidas
  - `getSentRequests` - Solicitações enviadas
  - `searchUsers` - Busca com status calculado
  - `getFriendStats` - Contadores e limites
  - `getFriendActivity` - Feed de atividades (SQL raw)
  - `getMutualFriends` - Amigos em comum

- ✅ **Validações Implementadas:**
  - ❌ Não pode adicionar a si mesmo
  - ❌ Limite de 500 amigos por usuário
  - ❌ Não duplica solicitações pendentes
  - ❌ Não envia para bloqueados
  - ✅ Auto-cleanup de requests antigas (previne unique constraint errors)
  - ✅ Verifica amizade existente
  - ✅ Remove amizade bidirecional

- ✅ **Friend Controller** (270 linhas - 12 endpoints):
  - `POST /friends/request` - Enviar solicitação
  - `POST /friends/accept/:id` - Aceitar
  - `POST /friends/reject/:id` - Rejeitar
  - `POST /friends/cancel/:id` - Cancelar (novo!)
  - `DELETE /friends/:id` - Remover amigo
  - `POST /friends/block/:id` - Bloquear usuário
  - `GET /friends` - Listar amigos
  - `GET /friends/requests` - Recebidas
  - `GET /friends/sent` - Enviadas
  - `GET /friends/search?q=query` - Buscar usuários
  - `GET /friends/stats` - Estatísticas
  - `GET /friends/activity?limit=20&offset=0` - Feed
  - `GET /friends/mutual/:id` - Amigos em comum
  - `DELETE /friends/cleanup` - Limpar requests antigas (debug)

**🎨 Frontend (1955 linhas):**
- ✅ **Friend Service** (200 linhas):
  - 5 interfaces TypeScript completas
  - 12 métodos da classe FriendService
  - Axios integration com error handling
  - TypeScript types exportados

- ✅ **Componentes Reutilizáveis:**
  1. **FriendCard** (90 linhas) - Card de amigo com UserStatsRow
  2. **FriendRequestCard** (90 linhas) - Solicitações com UserStatsRow
  3. **UserSearchCard** (80 linhas) - Busca com UserStatsRow
  4. **ActivityFeedItem** (140 linhas) - Item de atividade
  5. **SearchBar** (130 linhas) - Barra de busca completa
  6. **EmptyState** (60 linhas) - Estados vazios genéricos
  7. **UserStatsRow** (80 linhas) - Stats reutilizáveis

- ✅ **Telas Implementadas:**
  1. **FriendsScreen** (565 linhas):
     - 3 tabs: Buscar, Solicitações (Recebidas/Enviadas), Amigos
     - SearchBar com debounce 500ms
     - Badge de notificação para pendentes
     - Pull-to-refresh em todas as tabs
     - Estados vazios contextuais
     - Loading states profissionais
  
  2. **FriendProfileScreen** (340 linhas):
     - Header com avatar 100px
     - 4 StatBoxes (Level, XP, Streak, Moedas)
     - Data de amizade formatada
     - Amigos em comum (scroll horizontal)
     - Botão remover com confirmação
     - Navegação recursiva
  
  3. **ActivityFeedScreen** (280 linhas):
     - 4 filtros: Todos, Desafios, Badges, Recompensas
     - Paginação infinita (20 por vez)
     - Pull-to-refresh
     - Empty states por filtro
     - Ícones e cores por tipo

**🧹 Refatoração e Componentização:**
- ✅ **UserStatsRow** eliminou ~150 linhas duplicadas
- ✅ **SearchBar** componentizado (reutilizável em 5+ telas)
- ✅ **EmptyState** padronizado (~200 linhas economizadas)
- ✅ **FriendCard** refatorado com UserStatsRow (-24 linhas)
- ✅ **UserSearchCard** refatorado (-22 linhas)
- ✅ **FriendRequestCard** refatorado (-20 linhas)
- ✅ **9 console.logs** removidos do backend (código limpo)

**📊 Métricas Finais:**
- 📦 **15 arquivos** criados/modificados
- 💻 **~2850 linhas** implementadas
- 🎨 **7 componentes** novos
- 📱 **3 telas** completas
- 🌐 **12 endpoints** REST
- 🧹 **~66 linhas** de código duplicado eliminadas
- ✅ **0 erros** TypeScript
- ✅ **100% funcional**

**🔄 Fluxos Completos:**
- ✅ Buscar e adicionar amigos
- ✅ Aceitar/Rejeitar solicitações
- ✅ Cancelar solicitações enviadas
- ✅ Ver perfil de amigos
- ✅ Feed de atividades com filtros
- ✅ Amigos em comum
- ✅ Remover amigos
- ✅ Navegação recursiva

**📄 Documentação Criada:**
- ✅ `COMPONENTIZATION_OPPORTUNITIES.md` (análise completa - 350 linhas)
- ✅ `SPRINT_11_SUMMARY.md` (resumo técnico - 500 linhas)

---

### **27 de Outubro de 2025**
- ✅ Serviço completo de notificações (404 linhas - 13 funções)
- ✅ Hook useNotifications com navegação inteligente (126 linhas)
- ✅ 5 tipos de notificações implementadas
- ✅ Lembretes agendados (9h e 21h com DAILY trigger)
- ✅ Notificações instantâneas (badges, level up)
- ✅ Toggle em Settings com AsyncStorage
- ✅ Integração em ChallengesScreen (3 notificações)
- ✅ Plugin configurado em app.json
- ✅ Permissões iOS/Android automáticas
- ✅ Canal Android com som e vibração

### **Sprint 8 - Badges em Destaque no Perfil** ✅
- ✅ Adicionada seção "🏆 Conquistas Recentes" no ProfileScreen
- ✅ Scroll horizontal com 5 badges mais recentes
- ✅ Mini-cards profissionais com bordas coloridas por raridade
- ✅ Navegação integrada para tela completa de badges
- ✅ Atualização automática via useFocusEffect
- ✅ 3 estados visuais (loading/badges/vazio)

**Ajustes de UX Aplicados (27/10/2025):**
- ✅ Espaçamento consistente entre cards (16px - padrão do app)
- ✅ Padding interno do card ajustado (25px alinhado com Card.tsx)
- ✅ Botão "Ver Todos" centralizado para melhor hierarquia visual
- ✅ Scroll com padding otimizado (paddingLeft: 0, paddingRight: 25)
- ✅ Títulos e subtítulos centralizados
- ✅ Fontes legíveis (13px nome, 11px data)
- ✅ Design responsivo mantido (iOS/Android/Web)

### **Sprint 7 - Sistema de Badges Completo** ✅
- ✅ BadgesScreen com galeria completa (376 linhas)
- ✅ Sistema de tabs (Todos/Conquistados/Bloqueados)
- ✅ Filtros por raridade (5 opções)
- ✅ Modal de detalhes integrado
- ✅ Barra de progresso visual
- ✅ BadgeCard componente reutilizável
- ✅ Serviço badge.ts completo (189 linhas)
- ✅ Pull-to-refresh e estados vazios

**Total Sprints 7-9:** 1.426 + 213 + 530 = **2.169 linhas** | Zero erros | 100% funcional

---

**Desenvolvido com ❤️ por Pedro e equipe**
