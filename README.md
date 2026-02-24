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
- Sistema de Level Up automático com progressão quadrática — `xp(n) = 50×(n−1)×(n+5)` (gap cresce +100 XP por nível)

### **🏆 Desafios e Conquistas**
- 50 desafios em 8 categorias (Física, Nutrição, Hidratação, Mental, Sono, Social, Produtividade, Meditação)
- **Sistema de Tracking de Atividades Físicas:**
  - **Auto-rastreamento (STEPS / DISTANCE):** passos e distância **nunca precisam ser ativados manualmente**
    - Ao abrir o app, o sistema lê automaticamente os dados do app nativo de saúde (iOS Health / Google Fit)
    - Os cards de desafio exibem o progresso atual imediatamente (badge "Sincronizado automaticamente")
    - Quando a meta é atingida, o desafio é completado automaticamente com XP e moedas
    - Desafios de passos/distância são criados com status `IN_PROGRESS` desde o início
  - **Rastreamento manual (DURATION):** corrida com GPS e cronômetro — requer pressionar "Iniciar"
    - Modal interativo com GPS, cronômetro e progresso em tempo real
    - Botões Pausar / Retomar / Finalizar
  - 📱 **Sensores utilizados (Expo Go — multiplataforma):**
    - Pedômetro nativo (iOS HealthKit / Android sensor): conta passos 24/7 mesmo com app fechado
    - Estimativa de distância (passos × 0.78 m) com precisão ±5–10%
  - 🏥 **Fase 2 (Development Build):** Apple Health + Google Fit
    - Distância REAL via GPS, dados de wearables, histórico completo
    - Fallback automático para sensores nativos se Health não disponível
  - 🔧 **Otimizações:**
    - Cache de desafios (5 min TTL) para reduzir chamadas à API
    - Re-sync automático ao voltar ao foreground (`AppState`)
    - Progresso propagado em tempo real para cada card (`activityProgressMap`)
    - `batch-sync` corrigido para usar `userChallengeId` ao invés de `challengeId`
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

### **🛒 Loja e Inventário**
- **Sistema completo de economia virtual:**
  - Compre itens com moedas ganhas completando desafios
  - 4 tipos de itens: Cosméticos, Consumíveis, Boosts, Pacotes
  - 4 níveis de raridade: Comum, Raro, Épico, Lendário
  - Itens em destaque com badges especiais
  - Sistema de estoque limitado (opcional)
- **Loja Profissional:**
  - Filtros por tipo e raridade
  - Busca em tempo real (título, descrição, SKU)
  - Ordenação por preço (mais barato primeiro)
  - Cards com imagem, preço, raridade e indicador de saldo
  - Modal de compra com preview e seleção de quantidade
  - Indicadores visuais (saldo insuficiente, esgotado)
- **Inventário Gerenciável:**
  - Visualização de todos os itens possuídos
  - Filtros por tipo e status (equipado/não equipado)
  - Ações contextuais: Usar, Equipar, Desequipar
  - Sistema de boosts ativos com tempo restante
  - Multiplicadores de XP e moedas aplicados automaticamente
  - Consumíveis com quantidade gerenciada
- **Interface Unificada:**
  - Tabs internas: 🛒 Loja / 🎒 Mochila
  - Navegação fluida sem reload (telas mantidas montadas)
  - Saldo de moedas visível em tempo real
  - Teclado fecha ao clicar fora
  - Confirmações removidas para UX mais ágil
- **Backend Robusto:**
  - Transações atômicas (compra = débito + inventário + auditoria)
  - Rate limiting anti-spam (5s entre compras do mesmo item)
  - Validações de saldo e estoque em tempo real
  - Sistema de auditoria completo (tabela Purchase)
  - Retry automático em falhas de rede
  - 7 endpoints RESTful protegidos por autenticação

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
│   │   │   ├── _layout.tsx       # Layout das tabs
│   │   ├── index.tsx         # Tab Home (ProfileScreen)
│   │   ├── challenges.tsx    # Tab Desafios (ChallengesScreen)
│   │   ├── badges.tsx        # Tab Badges (BadgesScreen)
│   │   ├── explore.tsx       # Tab Explorar / Leaderboard
│   │   ├── friends.tsx       # 🆕 Tab Amigos (FriendsScreen)
│   │   ├── inventory.tsx     # 🆕 Tab Inventário (InventoryScreen)
│   │   ├── shop.tsx          # 🆕 Tab Loja (ShopScreen)
│   │   └── settings.tsx      # Tab Configurações
│   ├── screens/               # 📱 Componentes das telas
│   │   ├── index.ts          # Barrel export
│   │   ├── ActivityFeedScreen.tsx # 🆕 Feed de atividades dos amigos (Sprint 11)
│   │   ├── BadgesScreen.tsx  # 🆕 Tela de badges/conquistas (Sprint 7)
│   │   ├── ChallengesScreen.tsx # 🆕 Tela de desafios diários (Sprint 6)
│   │   ├── EditProfileScreen.tsx # ✏️ Edição de perfil profissional
│   │   ├── FriendProfileScreen.tsx # 🆕 Perfil de amigo (Sprint 11)
│   │   ├── FriendsScreen.tsx # 🆕 Tela principal de amigos (Sprint 11)
│   │   ├── InventoryScreen.tsx # 🆕 Tela de inventário/mochila (Sprint 16)
│   │   ├── LoginScreen.tsx   # Login/Cadastro com validações
│   │   ├── ProfileScreen.tsx # Perfil com gamificação e stats
│   │   ├── RewardHistoryScreen.tsx # 🆕 Tela de histórico de recompensas (Sprint 10)
│   │   ├── ShopAndInventoryScreen.tsx # 🆕 Tela unificada Loja+Inventário (Sprint 16)
│   │   └── ShopScreen.tsx    # 🆕 Tela da loja de itens (Sprint 16)
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
│   ├── challenges.tsx        # Rota para ChallengesScreen
│   ├── badges.tsx            # Rota para BadgesScreen
│   ├── history.tsx           # 🆕 Rota para RewardHistoryScreen
│   └── user-profile.tsx      # Rota para perfil de outros usuários
│
├── components/                # 🧩 Componentes Reutilizáveis
│   ├── ui/                   # 35 componentes de UI
│   │   ├── index.ts          # Barrel export de todos os componentes
│   │   ├── ActivityFeedItem.tsx # 🆕 Item de atividade de amigo (Sprint 11)
│   │   ├── ActivityRewardBadges.tsx # 🆕 Badges de XP/Coins reutilizáveis (Sprint 13)
│   │   ├── AlertModal.tsx    # Modal profissional de alertas (4 tipos)
│   │   ├── Avatar.tsx        # Avatar circular com iniciais
│   │   ├── BadgeCard.tsx     # 🆕 Card de badge/conquista com progresso (Sprint 7)
│   │   ├── ActivityTrackerModal.tsx # 🆕 Modal de rastreamento de atividades (Sprint 17)
│   │   ├── BadgeDetailModal.tsx # 🆕 Modal de detalhes do badge
│   │   ├── BadgeItem.tsx     # 🆕 Item de badge reutilizável (2 variantes: full/mini)
│   │   ├── BottomSheetModal.tsx # 🆕 Modal bottom sheet genérico (Sprint 13)
│   │   ├── Button.tsx        # Botão com variantes (primary, secondary, danger)
│   │   ├── Card.tsx          # Container com sombra e padding
│   │   ├── ChallengeCard.tsx # 🆕 Card de desafio com auto-verify badge
│   │   ├── ChallengeInvitesModal.tsx # 🆕 Modal de convites de desafios
│   │   ├── CommentModal.tsx  # 🆕 Modal de comentários em atividades (Sprint 12)
│   │   ├── DailyProgressWidget.tsx # 🆕 Widget de progresso diário de atividades
│   │   ├── DateInput.tsx     # Input de data com formatação DD/MM/YYYY
│   │   ├── EmptyState.tsx    # 🆕 Estado vazio genérico reutilizável (Sprint 11)
│   │   ├── FeedActivityCard.tsx # 🆕 Card de atividade do feed (Sprint 12)
│   │   ├── FilterBar.tsx     # 🆕 Barra de filtros horizontal reutilizável (Sprint 13)
│   │   ├── FriendCard.tsx    # 🆕 Card de amigo com stats (Sprint 11)
│   │   ├── FriendRequestCard.tsx # 🆕 Card de solicitação de amizade (Sprint 11)
│   │   ├── InfoRow.tsx       # Linha de informação (label + valor)
│   │   ├── Input.tsx         # Input com ícone e multiline + efeitos foco
│   │   ├── InventoryItemCard.tsx # 🆕 Card de item do inventário (Sprint 16)
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
│   │   ├── ShopItemCard.tsx  # 🆕 Card de item da loja (Sprint 16)
│   │   ├── ShopPurchaseModal.tsx # 🆕 Modal de compra da loja (Sprint 16)
│   │   ├── StatBox.tsx       # Caixa de estatística gamificada
│   │   ├── StepCounterWidget.tsx # 🆕 Widget de progresso de atividades (Sprint 17)
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
│   ├── use-color-scheme.ts   # Hook para detecção de tema (claro/escuro)
│   ├── use-color-scheme.web.ts # Versão web do hook de tema
│   ├── use-theme-color.ts    # Hook para cores temáticas
│   ├── useActivityTracker.ts # 🆕 Hook para controle do ActivityTrackerModal (Sprint 17)
│   ├── useAlert.ts           # Hook para gerenciamento de alertas
│   ├── useAppState.ts        # 🆕 Hook para detectar foreground/background do app
│   ├── useFriendRequestNotifications.ts # 🆕 Hook para notificações de solicitações de amizade
│   ├── useImagePicker.ts     # 🆕 Hook para upload de fotos (galeria/câmera)
│   ├── useNotifications.ts   # 🆕 Hook para sistema de notificações (Sprint 9)
│   └── useTheme.ts           # 🆕 Hook para tema e cores dinâmicas
│
├── types/                     # 📝 Definições de Tipos TypeScript
│   └── user.ts               # Interface User (compartilhada)
│
├── utils/                     # 🛠️ Funções Utilitárias
│   ├── activityFormatters.ts # Formatação de passos, distância e duração
│   ├── dateUtils.ts          # Formatação e cálculos de datas
│   ├── invitationUtils.ts    # Helpers para convites de desafios
│   ├── notificationHelper.ts # Helpers de notificações locais
│   ├── progressionUtils.ts   # 🆕 Funções de progressão e level up (fórmula quadrática)
│   └── validators.ts         # Validações (email, username, password, etc)
│
├── services/                  # 🌐 Comunicação com API
│   ├── api.ts                # ⚠️ ALTERAR IP AQUI - Axios + endpoints
│   ├── activity.ts           # 🆕 Serviço de rastreamento de atividades (Sprint 17)
│   ├── activitySync.ts       # 🆕 Sincronização automática de atividades (auto-track)
│   ├── auth.ts               # Gerenciamento de token JWT + AsyncStorage
│   ├── badge.ts              # 🆕 Serviço de badges (Sprint 7)
│   ├── challenge.ts          # 🆕 Serviço de desafios (Sprint 6)
│   ├── challengeInvitation.ts # 🆕 Serviço de convites de desafios
│   ├── feed.ts               # 🆕 Serviço de feed social (Sprint 12)
│   ├── feedInteractions.ts   # 🆕 Serviço de curtidas/comentários (Sprint 12)
│   ├── friend.ts             # 🆕 Serviço de amigos completo (Sprint 11)
│   ├── leaderboard.ts        # 🆕 Serviço de rankings (Sprint 12)
│   ├── localNotificationStorage.ts # 🆕 Armazenamento local de notificações
│   ├── location.ts           # 🆕 Serviço de GPS e distância (Sprint 17)
│   ├── multiTracker.ts       # 🆕 Gerenciamento de múltiplos desafios simultâneos (Sprint 17)
│   ├── notificationNavigation.ts # 🆕 Navegação de notificações (Sprint 14)
│   ├── notifications.ts      # 🆕 Serviço de notificações push (Sprint 9)
│   ├── pedometer.ts          # 🆕 Serviço de contagem de passos (Sprint 17)
│   ├── pushToken.ts          # 🆕 Gerenciamento de tokens push (Sprint 13)
│   ├── reward.ts             # 🆕 Serviço de histórico de recompensas (Sprint 10)
│   ├── shop.ts               # 🆕 Serviço de loja e inventário (Sprint 16)
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
│   │   │   ├── activity.controller.ts   # 🆕 Rastreamento de atividades (5 endpoints - Sprint 17)
│   │   │   ├── auth.controller.ts       # Login, Register, Profile
│   │   │   ├── badge.controller.ts      # 🆕 Gerenciamento de badges (3 endpoints)
│   │   │   ├── challenge.controller.ts  # 🆕 Gerenciamento de desafios (4 endpoints)
│   │   │   ├── challenge-invitation.controller.ts # 🆕 Convites de desafios (5 endpoints)
│   │   │   ├── feed.controller.ts       # 🆕 Feed de atividades (Sprint 12)
│   │   │   ├── friend.controller.ts     # 🆕 Gerenciamento de amigos (12 endpoints - Sprint 11)
│   │   │   ├── health.controller.ts     # Health check
│   │   │   ├── leaderboard.controller.ts # 🆕 Rankings (Sprint 12)
│   │   │   ├── push-token.controller.ts # 🆕 Gerenciamento de tokens push (Sprint 13)
│   │   │   ├── reward.controller.ts     # 🆕 Histórico de recompensas (3 endpoints - Sprint 10)
│   │   │   ├── shop.controller.ts       # 🆕 Loja e inventário (7 endpoints - Sprint 16)
│   │   │   └── user-profile.controller.ts # 🆕 Perfis públicos (Sprint 12)
│   │   ├── services/         # 🔧 Lógica de Negócio
│   │   │   ├── activity.service.ts      # 🆕 7 funções de rastreamento (Sprint 17)
│   │   │   ├── auto-verify.service.ts   # 🆕 Auto-verificação de desafios sociais (354 linhas)
│   │   │   ├── badge.service.ts         # 🆕 3 funções de badges (168 linhas)
│   │   │   ├── challenge.service.ts     # 🆕 8+ funções de desafios (inclui updateChallengeProgress)
│   │   │   ├── challenge-invitation.service.ts # 🆕 Convites de desafios (474 linhas)
│   │   │   ├── expo-push.service.ts     # 🆕 Serviço Expo Push API (Sprint 13)
│   │   │   ├── feed.service.ts          # 🆕 Feed social (Sprint 12)
│   │   │   ├── feed-v2.service.ts       # 🆕 Feed social v2 com melhorias de query
│   │   │   ├── friend.service.ts        # 🆕 12 funções de amigos (774 linhas - Sprint 11)
│   │   │   ├── notification.service.ts  # 🆕 Notificações com proteção duplicatas (Sprint 13)
│   │   │   ├── reward.service.ts        # 🆕 3 funções de recompensas (161 linhas - Sprint 10)
│   │   │   ├── shop.service.ts          # 🆕 Loja/inventário (7 funções, 775 linhas - Sprint 16)
│   │   │   └── user-activity.service.ts # 🆕 Atividades do usuário para feed e perfil
│   │   ├── routes/           # 🛣️ Definição de rotas
│   │   │   ├── activity.routes.ts       # 🆕 Rotas de rastreamento + batch-sync (protegidas - Sprint 17)
│   │   │   ├── auth.ts                  # Rotas de autenticação
│   │   │   ├── badge.routes.ts          # 🆕 Rotas de badges (protegidas)
│   │   │   ├── challenge.routes.ts      # 🆕 Rotas de desafios + PUT /progress (protegidas)
│   │   │   ├── challenge-invitation.routes.ts # 🆕 Rotas de convites (protegidas)
│   │   │   ├── feed.routes.ts           # 🆕 Rotas de feed (protegidas - Sprint 12)
│   │   │   ├── friend.routes.ts         # 🆕 Rotas de amigos (protegidas - Sprint 11)
│   │   │   ├── health.ts                # Health check
│   │   │   ├── leaderboard.routes.ts    # 🆕 Rotas de rankings (protegidas - Sprint 12)
│   │   │   ├── push-token.routes.ts     # 🆕 Rotas de tokens push (protegidas - Sprint 13)
│   │   │   ├── reward.ts                # 🆕 Rotas de recompensas (protegidas - Sprint 10)
│   │   │   ├── shop.routes.ts           # 🆕 Rotas de loja (7 rotas protegidas - Sprint 16)
│   │   │   ├── user.ts                  # Rotas de usuário (protegidas)
│   │   │   └── user-profile.routes.ts   # 🆕 Rotas de perfis públicos (protegidas - Sprint 12)
│   │   ├── middlewares/      # 🔒 Middlewares
│   │   │   ├── auth.middleware.ts       # Validação JWT
│   │   │   ├── error.middleware.ts      # Tratamento de erros
│   │   │   └── rate-limit.middleware.ts # 🆕 Rate limiting (5 limiters - Sprint 12)
│   │   ├── lib/              # 🔧 Clientes instanciados
│   │   │   ├── prisma.ts                # Prisma Client
│   │   │   └── supabase.ts              # Supabase Client
│   │   ├── utils/            # 🛠️ Utilitários do backend
│   │   │   ├── context.helpers.ts       # Helpers de contexto Hono
│   │   │   ├── progressionUtils.ts      # 🆕 Fórmula de level up quadrática
│   │   │   └── validation.ts            # Validação UUID e sanitização
│   │   ├── jobs/             # ⏰ Jobs periódicos
│   │   │   └── cleanup-invitations.job.ts # Limpeza de convites expirados
│   │   ├── tests/            # 🧪 Testes
│   │   │   └── shop.service.test.ts     # Testes do serviço de loja
│   │   └── index.ts          # Entry point do servidor (rotas registradas)
│   ├── prisma/
│   │   ├── schema.prisma     # 🗄️ Schema do banco de dados (15 models)
│   │   ├── seed.ts           # 🌱 Seed principal (badges tradicionais)
│   │   ├── seed-challenges.ts # Seed de desafios (52 desafios)
│   │   ├── seed-shop.ts      # 🆕 Seed da loja (15 itens)
│   │   ├── add-badges.ts     # Seed de badges progressivos (18 badges sociais)
│   │   ├── add-challenges.ts # Seed de desafios sociais auto-verificáveis (7 desafios)
│   │   ├── add-social-challenges-and-badges.ts # 🆕 Seed combinado social
│   │   ├── migrate-progression.ts # 🆕 Migração para fórmula de progressão quadrática
│   │   ├── update-challenges-photo-requirement.ts # 🆕 Script de atualização de requisitos de foto
│   │   ├── validate-shop.ts  # 🆕 Script de validação dos itens da loja
│   │   ├── migrations/       # Histórico de mudanças do DB (12 migrations)
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
│   │   │   ├── 20251201_add_social_badge_enums/ # 🆕 BadgeCategory.SOCIAL + BadgeRequirementType.EVENT_COUNT
│   │   │   ├── 20251202_add_shop_system/ # 🆕 Sistema de loja (ShopItem, UserInventory, ActiveBoost, Purchase)
│   │   │   └── 20251230174817_add_activity_tracking_system/ # 🆕 Sistema de rastreamento (Sprint 17)
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

### **Fevereiro de 2026**
- ✅ **Sistema de Progressão Quadrática (Level Up)** (24/02/2026)
  - **Problema resolvido:** fórmula antiga era linear plana — todo nível custava exatamente 1.000 XP, sem diferenciação. Subir do nível 1 para 2 era idêntico ao 49 para 50.
  - **Nova fórmula:** `xpParaChegar(n) = 50 × (n−1) × (n+5)`
    - Gap entre níveis cresce **linearmente**: `gap(n → n+1) = 100n + 250 XP`
    - Inversa algébrica **O(1)** sem loop: `nivel(xp) = ⌊√(xp/50 + 9) − 2⌋`
    - Nível 1→2: 350 XP | Nível 10→11: 1.250 XP | Nível 50→51: 5.250 XP | Nível 99→100: 10.150 XP
  - **Curva de progressão** (~400 XP/dia de atividade):
    - Nível 10 → 6.750 XP (~17 dias) | Nível 20 → 23.750 XP (~2 meses)
    - Nível 50 → 134.750 XP (~11 meses) | Nível 100 → 519.750 XP (~4,3 anos)
  - **Arquivos criados:**
    - `utils/progressionUtils.ts` (frontend): `xpForLevel`, `levelFromXP`, `xpProgressInLevel`, `xpNeededForNextLevel`, `xpLevelProgress`, `xpProgressLabel`
    - `backend/src/utils/progressionUtils.ts` (backend): espelho das funções de cálculo
    - `backend/prisma/migrate-progression.ts`: script de migração com modo dry-run e apply
  - **Arquivos atualizados:**
    - `backend/src/services/challenge.service.ts`: substituiu `Math.floor(xp / 1000) + 1` por `levelFromXP(newXP)` com guarda `Math.max(currentLevel, ...)` para proteção de migração
    - `app/screens/ProfileScreen.tsx`, `app/screens/ChallengesScreen.tsx`, `app/user-profile.tsx`: display de XP usa `xpProgressInLevel(xp, level)` / `xpNeededForNextLevel(xp, level)` com suporte ao nível armazenado no banco
  - **Migração executada:**
    - 0 usuários perderam nível (proteção garantida pelo `Math.max`)
    - 4 usuários receberam boost gratuito (nova fórmula mais generosa abaixo do nível 15)
    - 5 usuários sem impacto
  - **Scripts de migração adicionados ao `backend/package.json`:**
    - `npm run migrate:progression:dry` — relatório de impacto sem alterar o banco
    - `npm run migrate:progression:apply` — aplica as atualizações de nível

- ✅ **Auto-Progressão de Desafios de Passos e Distância** (24/02/2026)
  - **Problema resolvido:** desafios de STEPS/DISTANCE exigiam o usuário pressionar "Iniciar" — agora são 100% automáticos.
  - **Fluxo novo:**
    1. App abre → `activitySync.syncActivityOnAppOpen()` lê passos/km do sensor nativo
    2. Progresso é exibido em tempo real nos cards sem nenhuma ação do usuário
    3. Ao atingir a meta, o desafio é auto-completado com XP, moedas e badges
    4. Quando o app volta ao foreground (`AppState`), o sync é re-executado automaticamente
  - **Backend — `challenge.service.ts`:**
    - Nova função `updateChallengeProgress` — atualiza `progress` %, campos brutos (`steps`, `distance`) e auto-transiciona `PENDING → IN_PROGRESS`
    - `assignDailyChallenges` cria desafios `STEPS`/`DISTANCE`/`DURATION` com status `IN_PROGRESS` desde a atribuição
  - **Backend — `challenge.routes.ts`:**
    - `GET /challenges/active-with-tracking` corrigido: retornava `id: challenge.id` (errado) → agora `id: userChallenge.id` (correto); inclui status `PENDING` + `IN_PROGRESS`; filtrado por desafios atribuídos hoje
    - `PUT /challenges/:id/progress` novo endpoint — atualiza progresso sem completar o desafio (`:id` = UserChallenge ID)
  - **Backend — `activity.routes.ts`:**
    - `POST /activity/batch-sync` reescrito — usa `userChallengeId` corretamente; chama `completeChallenge` (com recompensas) se `completed=true`, senão `updateChallengeProgress`
  - **Frontend — `activitySync.ts`:**
    - Interface `ActiveChallenge` e `ChallengeProgress` atualizadas com `userChallengeId` separado de `challengeId`
    - Todos os endpoints de API usam o ID correto de UserChallenge
  - **Frontend — `ChallengeCard.tsx`:**
    - Nova prop `activityCurrentValue?: number` — recebe valor do sensor em tempo real
    - Detecção automática `isAutoTracked` (STEPS/DISTANCE)
    - Desafios auto-rastreados: **botão "Iniciar" removido** → substituído por badge verde "Sincronizado automaticamente"
    - Desafios DURATION mantêm o rastreamento manual
    - `StepCounterWidget` prioriza: valor do sensor → sessão manual → valor do banco
  - **Frontend — `ChallengesScreen.tsx`:**
    - `activityProgressMap: Record<userChallengeId, currentValue>` para progresso em tempo real
    - `runActivitySync()` executado após `loadData()` e ao retornar ao foreground
    - Auto-reload da lista quando qualquer desafio é auto-completado

### **Dezembro de 2025**
- ✅ **Sprint 17: Sistema de Rastreamento de Atividades + Health Integration** (30/12/2025)
  - **Sistema Dual de Tracking (Manual + Automático):**
    - Modal interativo para tracking manual com GPS e cronômetro
    - Sistema de auto-sync em background (app pode ficar fechado)
    - 3 tipos de rastreamento: STEPS (passos), DISTANCE (distância), DURATION (duração)
  - **Fase 1: Auto-Sync com Sensores Nativos (Expo Go):**
    - Sincronização automática ao abrir app
    - Pedômetro nativo conta passos 24/7 (mesmo app fechado)
    - Estimativa de distância (passos × 0.78m)
    - Auto-completa desafios quando meta atingida
    - Cache inteligente (5min TTL) para reduzir chamadas API
  - **Fase 2: Integração com Health APIs (Development Build):**
    - Apple Health (iOS): passos, distância GPS real, calorias, workouts
    - Google Fit (Android): mesmas funcionalidades para Android
    - Dados de wearables (Apple Watch, smartwatches Android)
    - Histórico completo de atividades dos últimos N dias
    - Onboarding intuitivo (first-time modal + configurações)
    - Fallback automático para Fase 1 se Health não disponível
    - Detecção de Expo Go (desabilita Health APIs automaticamente)
  - **Serviços Criados:**
    - `activitySync.ts`: Core do sistema de sincronização (375 linhas)
    - `healthKit.ts`: Integração Apple Health (280 linhas)
    - `googleFit.ts`: Integração Google Fit (250 linhas)
    - `HealthOnboardingScreen.tsx`: UI de onboarding (220 linhas)
  - **Otimizações de Performance:**
    - Memory leak fix: cleanup de timeouts com useRef
    - Memoização: useCallback para evitar re-renders
    - Cache de desafios com TTL e fallback para cache expirado
    - Graceful degradation em caso de erro (404, 500)
  - **Rastreamento Manual (Modal GPS):**
    - Contagem de passos via Expo Pedometer (sensor de movimento)
    - Rastreamento GPS de distância via Expo Location (fórmula Haversine)
    - Timer de duração para exercícios
    - Completamento automático ao atingir meta
  - **10 Desafios com Rastreamento Automático:**
    - STEPS: Caminhar 5.000 passos (60 XP), 10.000 passos (100 XP), 15.000 passos (150 XP)
    - DISTANCE: Caminhar 2km (50 XP), Correr 3km (100 XP), Correr 5km (150 XP), Ciclismo 30min (100 XP)
    - DURATION: Exercício 15min (40 XP), Caminhada 30min (50 XP), Treino 45min (140 XP)
  - **ActivityTrackerModal Profissional:**
    - Interface completa com cronômetro e progresso em tempo real
    - Botões Pausar/Retomar/Finalizar
    - Círculo de progresso com percentual visual
    - Integração simultânea pedômetro + GPS + timer
    - Sincronização automática com backend ao finalizar
    - Validação de permissões (iOS/Android)
  - **StepCounterWidget:**
    - Widget compacto de progresso para ChallengeCard
    - Barra de progresso com cores dinâmicas
    - Ícones contextuais (👣 passos, 📍 km, ⏱️ minutos)
    - Formatação profissional de valores
    - Atualização em tempo real
  - **Backend Activity System:**
    - activity.service.ts: 7 funções (trackActivity, updateChallengeProgress, getDailyActivity, getDailyStats, getActivityHistory, checkAndCompleteActivityChallenges, ...)
    - activity.controller.ts: 5 endpoints REST (/track, /challenges/:id/progress, /daily, /stats, /history)
    - activity.routes.ts: Rotas protegidas com authMiddleware
    - challenge.routes.ts: Novo endpoint GET /challenges/active-with-tracking para auto-sync
    - ActivityTracking model: Auditoria completa com steps, distance, duration, startTime, endTime, routeData
  - **Documentação Completa:**
    - AUTOMATIC_ACTIVITY_TRACKING_IMPLEMENTATION.md: 1753 linhas com arquitetura completa
    - FASE2_HEALTH_INTEGRATION_COMPLETE.md: Guia de implementação Health APIs
    - HEALTH_ONBOARDING_INTEGRATION.tsx: 4 opções de integração do onboarding
    - OTIMIZACOES_PERFORMANCE.md: Análise detalhada de otimizações
  - **Dependências Adicionadas:**
    - react-native-health: Integração com Apple Health e Google Fit
  - **Schema do Banco Atualizado:**
    - TrackingType enum: STEPS, DISTANCE, DURATION, ALTITUDE, MANUAL
    - Challenge: +trackingType?, +targetValue?, +targetUnit?
    - UserChallenge: +steps?, +distance?, +duration?, +activityData?
    - ActivityTracking model: 13 campos (userId, challengeId, activityType, steps, distance, duration, startTime, endTime, routeData, metadata, timestamps)
  - **Sensores e Permissões:**
    - Expo Sensors ~15.0.7 (Pedometer)
    - Expo Location ~18.0.11 (GPS com Haversine)
    - Expo Task Manager ~12.0.4 (background tasks - produção)
    - Permissões iOS/Android configuradas em app.json
    - Tratamento de compatibilidade com Expo Go
  - **Frontend Services:**
    - services/pedometer.ts: Rastreamento de sessão com baseline
    - services/location.ts: GPS com múltiplos métodos (haversine, isTracking, getDistance)
    - services/activity.ts: Wrapper de API com TypeScript
  - **Integração com ChallengeCard:**
    - Botão "Iniciar Rastreamento" para desafios com trackingType
    - StepCounterWidget mostra progresso atual
    - Badge "Completa automaticamente" escondido para desafios rastreáveis
    - Modal aparece automaticamente ao clicar
  - **Testado em Dispositivo Real:**
    - iPhone com Expo Go
    - Pedômetro: 16 passos contados com precisão
    - GPS: Coordenadas e altitude obtidas
    - Todos os 5 endpoints da API testados com sucesso
  - **Código Production-Ready:**
    - TypeScript 100% tipado
    - Tratamento completo de erros
    - Validações de permissões
    - JSDoc em todos os serviços
    - Migration aplicada: 20251230174817_add_activity_tracking_system
    - 52 desafios no seed (10 com rastreamento automático)

- ✅ **Sprint 16: Sistema de Loja e Inventário** (02/12/2025)
  - **Economia Virtual Completa:**
    - 4 tipos de itens: Cosméticos, Consumíveis, Boosts, Pacotes
    - 4 níveis de raridade: Comum, Raro, Épico, Lendário
    - Sistema de preços dinâmico com moedas do jogo
    - Estoque limitado (opcional) e itens em destaque
  - **Loja Profissional (ShopScreen):**
    - Filtros por tipo (🎨 Cosmético, 💊 Consumível, ⚡ Boost, 📦 Pacote)
    - Filtros por raridade com cores distintivas
    - Busca em tempo real (título, descrição, SKU)
    - Ordenação automática por preço (mais barato → mais caro)
    - Cards com imagens, preços, raridade e indicadores visuais
    - Modal de compra com preview e seleção de quantidade (1-99)
    - Indicadores: saldo insuficiente, item esgotado
    - Teclado fecha ao clicar fora (iOS/Android)
  - **Inventário Gerenciável (InventoryScreen):**
    - Visualização de todos os itens possuídos
    - Filtros por tipo e status (equipado/não equipado)
    - Quantidade exibida em cada card
    - Ações contextuais: Usar (consumíveis), Equipar/Desequipar (cosméticos)
    - Sistema de boosts ativos com countdown de tempo restante
    - Seção dedicada mostrando boosts ativos e multiplicadores
  - **Interface Unificada (ShopAndInventoryScreen):**
    - Tabs internas: 🛒 Loja / 🎒 Mochila
    - Navegação sem reload (telas mantidas montadas com display:none)
    - Sombras cross-platform (shadowColor iOS / elevation Android)
    - Saldo de moedas visível em tempo real
    - Confirmações de compra/uso removidas para UX ágil
  - **Backend Production-Ready:**
    - **Transações atômicas** (Prisma $transaction):
      1. Validar item e estoque
      2. Validar saldo do usuário (lock pessimista)
      3. Decrementar moedas
      4. Atualizar estoque
      5. Criar/atualizar inventário
      6. Registrar compra para auditoria
    - **Rate limiting anti-spam:** 5 segundos entre compras do mesmo item
    - **Validações robustas:** SKU, quantidade (1-99), preço, saldo, estoque
    - **7 endpoints RESTful:**
      - GET /shop/items (com 6 filtros)
      - GET /shop/items/:sku
      - POST /shop/purchase (transação atômica)
      - GET /shop/inventory (com 2 filtros)
      - POST /shop/inventory/:id/use
      - GET /shop/boosts (boosts ativos)
      - GET /shop/stats (estatísticas de vendas)
    - **Sistema de auditoria:** tabela Purchase registra todas as transações
    - **Validações de entrada:** sanitização, limites, tipos corretos
  - **Frontend com Segurança:**
    - Validação client-side antes de enviar ao backend
    - Sanitização de busca (limite 100 caracteres)
    - Retry automático em falhas de rede (2 tentativas)
    - Validações de resposta (previne crashes)
    - React.memo em cards (otimização de performance)
    - Acessibilidade completa (accessibilityLabel, accessibilityRole)
  - **Schema do banco atualizado:**
    - **ShopItem:** 14 campos (sku, title, description, type, rarity, price, metadata, stock, isActive, isFeatured, imageUrl, timestamps)
    - **UserInventory:** 8 campos (userId, itemId, quantity, isEquipped, metadata, purchasedAt, timestamps)
    - **ActiveBoost:** 8 campos (userId, itemSku, boostType, multiplier, expiresAt, metadata, timestamps)
    - **Purchase:** 9 campos (userId, itemId, quantity, unitPrice, totalCost, balanceBefore, balanceAfter, metadata, createdAt)
    - Enums: ShopItemType (4), ShopItemRarity (4), BoostType (3)
  - **Componentização Profissional:**
    - ShopItemCard (275 linhas): card reutilizável com React.memo
    - ShopPurchaseModal (267 linhas): modal de compra com validações
    - InventoryItemCard (335 linhas): card com ações contextuais
    - ShopAndInventoryScreen (90 linhas): wrapper com tabs internas
  - **Testes:** shop.service.test.ts (265 linhas) com 8 cenários de teste
  - **Código limpo:** JSDoc completo, TypeScript 100% tipado, sem erros de compilação

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
- ✅ **Desafios Diários** - 52 desafios em 8 categorias com atribuição automática (10 com rastreamento)
- ✅ **Gamificação Base** - XP, níveis, moedas, streaks completos
- ✅ **Sistema de Rastreamento de Atividades** - Contagem automática de passos, distância e duração

---

**Desenvolvido com ❤️ por Pedro Pecly e Gabriel Purificate**
