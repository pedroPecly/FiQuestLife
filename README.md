# 🎮 FiQuestLife

Aplicativo de gamificação para transformar sua saúde e produtividade em uma aventura épica!

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)

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
│   │   ├── _layout.tsx       # Layout das tabs
│   │   ├── index.tsx         # Tab Home
│   │   └── explore.tsx       # Tab Explorar
│   ├── screens/               # 📱 Componentes das telas
│   │   ├── index.ts          # Barrel export
│   │   ├── LoginScreen.tsx   # Login/Cadastro com validações
│   │   └── ProfileScreen.tsx # Perfil com gamificação e stats
│   ├── styles/                # 🎨 Estilos separados por tela
│   │   ├── index.ts          # Barrel export
│   │   ├── login.styles.ts   # Estilos do LoginScreen
│   │   └── profile.styles.ts # Estilos do ProfileScreen
│   ├── _layout.tsx           # Layout raiz do app
│   └── index.tsx             # Rota inicial (redirect)
│
├── components/                # 🧩 Componentes Reutilizáveis
│   ├── ui/                   # 11 componentes de UI
│   │   ├── index.ts          # Barrel export de todos os componentes
│   │   ├── AlertModal.tsx    # Modal profissional de alertas (4 tipos)
│   │   ├── Avatar.tsx        # Avatar circular com iniciais
│   │   ├── Button.tsx        # Botão com variantes (primary, secondary, danger)
│   │   ├── Card.tsx          # Container com sombra e padding
│   │   ├── DateInput.tsx     # Input de data com formatação DD/MM/YYYY
│   │   ├── InfoRow.tsx       # Linha de informação (label + valor)
│   │   ├── Input.tsx         # Input com ícone e multiline + efeitos foco
│   │   ├── LoadingScreen.tsx # Tela de loading reutilizável
│   │   ├── LogoutButton.tsx  # Botão de logout com confirmação
│   │   ├── StatBox.tsx       # Caixa de estatística gamificada
│   │   └── Tag.tsx           # Badge/Tag com ícone
│   └── layout/
│       ├── index.ts          # Barrel export
│       └── Header.tsx        # Cabeçalho do app
│
├── hooks/                     # 🎣 Hooks Personalizados
│   ├── useAlert.ts           # Hook para gerenciamento de alertas
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
│   └── auth.ts               # Gerenciamento de token JWT + AsyncStorage
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
│   │   ├── lib/              # 🔧 Clientes e utilitários
│   │   │   ├── prisma.ts     # Prisma Client
│   │   │   └── supabase.ts   # Supabase Client
│   │   └── index.ts          # Entry point do servidor
│   ├── prisma/
│   │   ├── schema.prisma     # 🗄️ Schema do banco de dados
│   │   ├── migrations/       # Histórico de mudanças do DB
│   │   │   ├── migration_lock.toml
│   │   │   ├── 20251016122028_add_username/
│   │   │   ├── 20251016131113_add_gamification_fields/
│   │   │   ├── 20251016152857_add_challenges/
│   │   │   └── 20251017122341_make_name_and_birthdate_required/
│   │   └── scripts/
│   │       └── clear-database.sql # Script para limpar DB
│   ├── .env                  # 🔐 Variáveis de ambiente (não versionado)
│   ├── .env.example          # Exemplo de variáveis de ambiente
│   ├── package.json          # Dependências do backend
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
└── README.md                  # 📖 Este arquivo
```

---

## 🚀 Setup Inicial

### **1. Pré-requisitos**
- Node.js v20+
- npm ou yarn
- PostgreSQL (local ou Supabase)
- Expo CLI (`npm install -g @expo/cli`)

### **2. Instalar Dependências**
```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

### **3. Configurar Banco de Dados**

**Estrutura do arquivo `.env`:**
```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key

# Database URL (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@db.your-project.supabase.co:5432/postgres"

# JWT Secret (usado para autenticação)
JWT_SECRET="your_jwt_secret_key"

# Server
PORT=3000
```

**Localização do arquivo:** `backend/.env`

Rode as migrations:
```bash
cd backend
npx prisma migrate deploy
npx prisma generate
cd ..
```

### **4. ⚠️ Configurar IP Local (IMPORTANTE)**

**Descubra seu IP local:**
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

**Edite `services/api.ts` e altere o IP:**
```typescript
// services/api.ts
const API_URL = 'http://192.168.1.XX:3000'; // ← TROCAR PARA SEU IP
```

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
| **Button** | Botão com variantes (primary, secondary, danger) | `components/ui/Button.tsx` |
| **Input** | Campo de entrada com ícones e efeitos de foco | `components/ui/Input.tsx` |
| **DateInput** | Input de data com formatação automática DD/MM/YYYY | `components/ui/DateInput.tsx` |
| **Card** | Container com sombra e padding | `components/ui/Card.tsx` |
| **Avatar** | Avatar circular com iniciais | `components/ui/Avatar.tsx` |
| **Tag** | Badge/Tag com ícone | `components/ui/Tag.tsx` |
| **InfoRow** | Linha de informação (label + valor) | `components/ui/InfoRow.tsx` |
| **StatBox** | Caixa de estatística gamificada | `components/ui/StatBox.tsx` |
| **LoadingScreen** | Tela de loading reutilizável | `components/ui/LoadingScreen.tsx` |
| **LogoutButton** | Botão de logout com confirmação | `components/ui/LogoutButton.tsx` |

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

### **Prisma Client não atualiza**
```bash
cd backend
npx prisma generate
```

Depois reinicie o TypeScript Server no VS Code:
- `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

---

## 🎯 Funcionalidades Implementadas

### **Autenticação**
- ✅ Sistema de autenticação JWT (7 dias)
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
- ✅ Design 100% responsivo para mobile
- ✅ Redução de ~40% de código via componentização
- 🎨 Efeitos de foco suaves nos campos de entrada
- 🔄 Sistema de alertas consistente cross-platform
- 📱 Design responsivo otimizado para web e mobile
- ♿ Acessibilidade aprimorada com navegação por teclado

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
- ✅ Sistema de desafios completo (ENUMs + Models)
- ✅ 4 ENUMs: ChallengeCategory (8 tipos), ChallengeDifficulty (4 níveis), ChallengeFrequency (4 tipos), ChallengeStatus (5 estados)
- ✅ Model User: id, email, username, name, birthDate, bio, avatar, gamificação, timestamps
- ✅ Model Challenge: catálogo de desafios com recompensas
- ✅ Model UserChallenge: relação N:N com tracking de progresso
- ✅ Constraints e índices para performance
- ✅ 4 migrations versionadas e aplicadas
- ✅ Campos obrigatórios: name e birthDate

### **Código e Organização**
- ✅ 100% TypeScript (frontend + backend)
- ✅ Código altamente componentizado e reutilizável
- ✅ Utils centralizados (validators, dateUtils, sistema de alertas)
- ✅ Tipagem forte com interfaces e types compartilhados
- ✅ Exports organizados (index.ts)
- ✅ Documentação inline com JSDoc
- ✅ **Documentação Completa**: JSDoc abrangente em todos os componentes
- ✅ **README Atualizado**: Guias de uso e exemplos para novos componentes

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
