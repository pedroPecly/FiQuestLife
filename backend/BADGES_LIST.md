# 🏆 Badges do FiQuestLife

## 📊 Resumo Geral

**Total:** 29 badges  
**Arquivo:** `backend/prisma/seed.ts`  
**Comando:** `npm run prisma:seed`

---

## 🌱 BEGINNER (6 badges) - Progresso Inicial

| Badge | Descrição | Requisito | Raridade |
|-------|-----------|-----------|----------|
| **Primeiro Passo** | Complete seu primeiro desafio! | 1 desafio | ⚪ COMMON |
| **Aprendiz** | Complete 5 desafios | 5 desafios | ⚪ COMMON |
| **Aventureiro** | Complete 10 desafios | 10 desafios | ⚪ COMMON |
| **Veterano** | Complete 25 desafios | 25 desafios | 🔵 RARE |
| **Mestre dos Desafios** | Complete 50 desafios! | 50 desafios | 🟣 EPIC |
| **Centurião** | Complete 100 desafios! Impressionante! | 100 desafios | 🟠 LEGENDARY |

---

## 🔥 CONSISTENCY (5 badges) - Streaks

| Badge | Descrição | Requisito | Raridade |
|-------|-----------|-----------|----------|
| **Persistente** | Mantenha um streak de 3 dias | 3 dias | ⚪ COMMON |
| **Dedicado** | Streak de 7 dias consecutivos! | 7 dias | 🔵 RARE |
| **Comprometido** | Streak de 14 dias! | 14 dias | 🔵 RARE |
| **Inabalável** | Streak de 30 dias! Incrível! | 30 dias | 🟣 EPIC |
| **Guerreiro do Ano** | Streak de 365 dias! Você é uma lenda viva! | 365 dias | 🟠 LEGENDARY |

---

## 🎯 MILESTONE (5 badges) - Níveis

| Badge | Descrição | Requisito | Raridade |
|-------|-----------|-----------|----------|
| **Nível 5** | Alcance o nível 5 | Level 5 | 🔵 RARE |
| **Nível 10** | Alcance o nível 10 | Level 10 | 🔵 RARE |
| **Nível 20** | Alcance o nível 20! | Level 20 | 🟣 EPIC |
| **Nível 50** | Nível 50! Você é incrível! | Level 50 | 🟣 EPIC |
| **Nível 100** | Nível 100! O poder máximo! | Level 100 | 🟠 LEGENDARY |

---

## 🏆 ACHIEVEMENT (11 badges)

### 💎 XP Total (3 badges)

| Badge | Descrição | Requisito | Raridade |
|-------|-----------|-----------|----------|
| **Colecionador de XP** | Ganhe 1.000 XP no total | 1,000 XP | 🔵 RARE |
| **Mestre do XP** | Ganhe 5.000 XP no total | 5,000 XP | 🟣 EPIC |
| **Lenda do XP** | Ganhe 10.000 XP no total! | 10,000 XP | 🟠 LEGENDARY |

### 🎯 Categorias Específicas (8 badges)

| Badge | Descrição | Categoria | Requisito | Raridade |
|-------|-----------|-----------|-----------|----------|
| **Atleta** | Complete 20 desafios de atividade física | PHYSICAL_ACTIVITY | 20 desafios | 🔵 RARE |
| **Nutricionista** | Complete 15 desafios de nutrição | NUTRITION | 15 desafios | 🔵 RARE |
| **Hidratado** | Complete 20 desafios de hidratação | HYDRATION | 20 desafios | 🔵 RARE |
| **Mente Sã** | Complete 15 desafios de saúde mental | MENTAL_HEALTH | 15 desafios | 🔵 RARE |
| **Dorminhoco** | Complete 15 desafios de sono | SLEEP | 15 desafios | 🔵 RARE |
| **Social** | Complete 10 desafios sociais | SOCIAL | 10 desafios | 🔵 RARE |
| **Produtivo** | Complete 15 desafios de produtividade | PRODUCTIVITY | 15 desafios | 🔵 RARE |
<!-- Badge Meditador removido: era relacionado à categoria MINDFULNESS -->

---

## ⭐ SPECIAL (2 badges) - Exclusivos

| Badge | Descrição | Requisito | Raridade |
|-------|-----------|-----------|----------|
| **Early Adopter** | Um dos primeiros usuários do FiQuestLife! | Manual | 🟠 LEGENDARY |
| **Beta Tester** | Ajudou a testar o app na versão beta | Manual | 🟠 LEGENDARY |

---

## 📊 Distribuição por Raridade

| Raridade | Quantidade | Badges |
|----------|------------|--------|
| ⚪ **COMMON** | 8 | Primeiro Passo, Aprendiz, Aventureiro, Persistente |
| 🔵 **RARE** | 13 | Veterano, Dedicado, Comprometido, Níveis 5/10, todos os de categoria, Colecionador XP |
| 🟣 **EPIC** | 5 | Mestre dos Desafios, Inabalável, Níveis 20/50, Mestre do XP |
| 🟠 **LEGENDARY** | 3 | Centurião, Guerreiro do Ano, Nível 100, Lenda do XP, Early Adopter, Beta Tester |

---

## 🎮 Como Usar no Código

### Listar Todos os Badges
```typescript
const badges = await prisma.badge.findMany({
  orderBy: { order: 'asc' }
});
```

### Badges por Categoria
```typescript
const beginnerBadges = await prisma.badge.findMany({
  where: { category: 'BEGINNER' }
});
```

### Badges por Raridade
```typescript
const legendaryBadges = await prisma.badge.findMany({
  where: { rarity: 'LEGENDARY' }
});
```

### Verificar se Usuário Tem Badge
```typescript
const hasBadge = await prisma.userBadge.findUnique({
  where: {
    userId_badgeId: {
      userId: 'user-id',
      badgeId: 'badge-id'
    }
  }
});
```

### Conceder Badge ao Usuário
```typescript
const userBadge = await prisma.userBadge.create({
  data: {
    userId: 'user-id',
    badgeId: 'badge-id',
    isDisplayed: true
  },
  include: { badge: true }
});
```

---

## 🔄 Rodar o Seed

```bash
cd backend
npm run prisma:seed
```

**⚠️ ATENÇÃO:** O seed limpa todos os badges e userBadges existentes antes de popular!

---

**Criado em:** 17 de outubro de 2025  
**Versão:** 1.0  
**Status:** ✅ Implementado e testado
