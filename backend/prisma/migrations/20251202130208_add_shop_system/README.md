# 🏗️ Migration: Sistema de Loja

**Data:** 02 de Dezembro de 2025  
**Migration:** `20251202130208_add_shop_system`  
**Status:** ✅ Aplicada

---

## 📋 Resumo

Migration que adiciona o **Sistema de Loja** completo ao FiQuestLife, permitindo compra de itens cosméticos, boosts temporários, consumíveis e pacotes usando FiCoins.

---

## 🗄️ Estrutura Criada

### **Enums**

#### `ShopItemType`
Define o tipo/comportamento do item:
- `COSMETIC` - Item cosmético (não expira, pode equipar/desequipar)
- `CONSUMABLE` - Consumível de uso único (decrementa quantidade)
- `BOOST` - Boost temporário (cria entrada em ActiveBoost)
- `PACK` - Pacote com múltiplos itens

#### `ShopItemRarity`
Define a raridade do item:
- `COMMON` - Comum (mais acessível)
- `RARE` - Raro (preço médio)
- `EPIC` - Épico (preço alto)
- `LEGENDARY` - Lendário (preço muito alto, exclusivo)

---

### **Tabelas**

#### `shop_items` (Catálogo de Produtos)
Armazena todos os itens disponíveis na loja.

**Colunas principais:**
- `id` (PK) - UUID único
- `sku` (UNIQUE) - Identificador do produto (ex: "boost_xp_24h_12")
- `title` - Nome exibido
- `description` - Descrição completa
- `price` - Preço em FiCoins
- `type` - Tipo do item (enum ShopItemType)
- `category` - Categoria opcional ("AVATAR_FRAME", "XP_BOOST", etc.)
- `rarity` - Raridade (enum ShopItemRarity)
- `metadata` - JSON flexível com propriedades específicas
- `image_url` - URL da imagem
- `stock` - Quantidade disponível (NULL = ilimitado)
- `is_active` - Se está ativo para compra
- `is_featured` - Se aparece em destaque
- `order` - Ordem de exibição

**Índices:**
- `sku` (unique)
- `(type, is_active)` - Queries por tipo
- `rarity` - Queries por raridade
- `(is_featured, order)` - Ordenação de destaques

---

#### `user_inventory` (Inventário do Usuário)
Registra itens que o usuário possui.

**Colunas principais:**
- `id` (PK) - UUID único
- `user_id` (FK → users.id) - Dono do item
- `item_id` (FK → shop_items.id) - Item possuído
- `quantity` - Quantidade (para consumíveis)
- `is_equipped` - Se está equipado (para cosméticos)
- `metadata` - Estado específico do item
- `acquired_at` - Data de aquisição
- `last_used_at` - Última vez que foi usado

**Constraints:**
- `UNIQUE (user_id, item_id)` - 1 entrada por item/usuário
- `CASCADE` em user_id (deleta ao deletar usuário)
- `RESTRICT` em item_id (previne exclusão acidental)

**Índices:**
- `(user_id, item_id)` (unique)
- `(user_id, is_equipped)` - Buscar itens equipados

---

#### `purchases` (Histórico de Compras)
Auditoria completa de todas as compras.

**Colunas principais:**
- `id` (PK) - UUID único
- `user_id` (FK → users.id) - Comprador
- `item_id` (FK → shop_items.id) - Item comprado
- `quantity` - Quantidade comprada
- `price` - Preço unitário no momento da compra
- `total_cost` - Custo total (price × quantity)
- `balance_before` - Saldo antes da compra
- `balance_after` - Saldo após a compra
- `metadata` - Dados adicionais (IP, device, promo codes)
- `created_at` - Data da compra

**Constraints:**
- `CASCADE` em user_id
- `RESTRICT` em item_id
- **Imutável** - nunca deletar registros

**Índices:**
- `(user_id, created_at)` - Histórico do usuário
- `item_id` - Analytics de vendas

---

#### `active_boosts` (Boosts Temporários Ativos)
Rastreia boosts atualmente ativos do usuário.

**Colunas principais:**
- `id` (PK) - UUID único
- `user_id` (FK → users.id) - Dono do boost
- `item_sku` - Referência ao item de origem
- `type` - Tipo de boost ("XP_MULTIPLIER", "COINS_MULTIPLIER", etc.)
- `value` - Valor do multiplicador (1.2 = +20%, 2.0 = +100%)
- `expires_at` - Data de expiração
- `is_active` - Se está ativo
- `created_at` - Data de criação

**Constraints:**
- `CASCADE` em user_id

**Índices:**
- `(user_id, is_active, expires_at)` - Buscar boosts ativos

---

## 📦 Relações Criadas

```
User (1) ───── (N) UserInventory ───── (N) ShopItem
     (1) ───── (N) Purchase ───────── (N) ShopItem
     (1) ───── (N) ActiveBoost
```

**Novos campos em User:**
- `inventory: UserInventory[]`
- `purchases: Purchase[]`
- `activeBoosts: ActiveBoost[]`

---

## 🎯 Casos de Uso

### **1. Compra de Item**
```sql
-- 1. Buscar item
SELECT * FROM shop_items WHERE sku = 'boost_xp_24h_15' AND is_active = true;

-- 2. Verificar saldo (dentro de transação)
SELECT coins FROM users WHERE id = $userId FOR UPDATE;

-- 3. Decrementar coins
UPDATE users SET coins = coins - $totalCost WHERE id = $userId;

-- 4. Atualizar stock (se aplicável)
UPDATE shop_items SET stock = stock - $quantity WHERE sku = $sku;

-- 5. Criar/Atualizar inventário
INSERT INTO user_inventory (user_id, item_id, quantity)
VALUES ($userId, $itemId, $quantity)
ON CONFLICT (user_id, item_id)
DO UPDATE SET quantity = user_inventory.quantity + $quantity;

-- 6. Registrar compra
INSERT INTO purchases (user_id, item_id, quantity, price, total_cost, balance_before, balance_after)
VALUES ($userId, $itemId, $quantity, $price, $totalCost, $balanceBefore, $balanceAfter);
```

### **2. Equipar Cosmético**
```sql
-- 1. Desequipar anterior (mesmo slot)
UPDATE user_inventory 
SET is_equipped = false
WHERE user_id = $userId 
  AND is_equipped = true
  AND item_id IN (
    SELECT id FROM shop_items 
    WHERE metadata->>'slot' = $slot
  );

-- 2. Equipar novo
UPDATE user_inventory
SET is_equipped = true, last_used_at = NOW()
WHERE user_id = $userId AND item_id = $itemId;
```

### **3. Ativar Boost**
```sql
-- 1. Decrementar do inventário
UPDATE user_inventory
SET quantity = quantity - 1, last_used_at = NOW()
WHERE user_id = $userId AND item_id = $itemId;

-- 2. Criar boost ativo
INSERT INTO active_boosts (user_id, item_sku, type, value, expires_at)
VALUES ($userId, $sku, $type, $value, NOW() + INTERVAL '$durationHours hours');
```

### **4. Aplicar Multiplicadores**
```sql
-- Buscar boosts ativos do usuário
SELECT type, value FROM active_boosts
WHERE user_id = $userId 
  AND is_active = true 
  AND expires_at > NOW();

-- No código:
-- baseXP = 50
-- multiplier = 1.5 (boost ativo)
-- finalXP = 50 * 1.5 = 75
```

---

## 🔐 Segurança Implementada

### **1. Constraints de Integridade**
- ✅ `UNIQUE (user_id, item_id)` - Previne duplicatas no inventário
- ✅ `RESTRICT` em item_id - Não pode deletar item se há compras/inventário
- ✅ `CASCADE` em user_id - Limpa dados ao deletar usuário

### **2. Validações no Backend**
- ✅ Transação atômica para compras (Prisma `$transaction`)
- ✅ Validação de saldo antes de comprar
- ✅ Validação de stock (se aplicável)
- ✅ Recálculo de preço no backend (nunca confiar no frontend)
- ✅ Rate limiting (10 compras/min)
- ✅ Prevenção de double-purchase (5s window)

### **3. Auditoria**
- ✅ Histórico completo em `purchases` (imutável)
- ✅ Salva saldo antes/depois da compra
- ✅ Salva preço pago (pode mudar no futuro)
- ✅ Metadata JSON para IP, device, promo codes

---

## 🧪 Testes Recomendados

### **Após Migration**

```sql
-- 1. Verificar estrutura
\d shop_items
\d user_inventory
\d purchases
\d active_boosts

-- 2. Verificar enums
SELECT enum_range(NULL::ShopItemType);
SELECT enum_range(NULL::ShopItemRarity);

-- 3. Verificar índices
SELECT indexname, indexdef FROM pg_indexes 
WHERE tablename IN ('shop_items', 'user_inventory', 'purchases', 'active_boosts');

-- 4. Verificar foreign keys
SELECT conname, conrelid::regclass, confrelid::regclass, contype
FROM pg_constraint
WHERE confrelid IN (
  'shop_items'::regclass,
  'users'::regclass
);
```

### **Após Seed**

```sql
-- 1. Contar itens por tipo
SELECT type, COUNT(*) FROM shop_items GROUP BY type;

-- 2. Contar itens por raridade
SELECT rarity, COUNT(*) FROM shop_items GROUP BY rarity;

-- 3. Verificar preços
SELECT 
  rarity,
  MIN(price) as min_price,
  AVG(price) as avg_price,
  MAX(price) as max_price
FROM shop_items
GROUP BY rarity;

-- 4. Verificar itens em destaque
SELECT title, price, rarity FROM shop_items 
WHERE is_featured = true 
ORDER BY "order";
```

---

## 🔄 Rollback (Se necessário)

```sql
-- ATENÇÃO: Deleta TODOS os dados da loja!
DROP TABLE IF EXISTS active_boosts CASCADE;
DROP TABLE IF EXISTS purchases CASCADE;
DROP TABLE IF EXISTS user_inventory CASCADE;
DROP TABLE IF EXISTS shop_items CASCADE;
DROP TYPE IF EXISTS ShopItemRarity;
DROP TYPE IF EXISTS ShopItemType;

-- Remover relações do User (manual no schema.prisma)
-- - inventory: UserInventory[]
-- - purchases: Purchase[]
-- - activeBoosts: ActiveBoost[]
```

---

## 📊 Estatísticas do Seed Inicial

**15 itens criados:**
- 🎨 **5 Cosméticos** (1280 coins total)
  - Moldura Oceânica (COMMON, 80 coins)
  - Moldura Neon (RARE, 150 coins)
  - Moldura Dourada (EPIC, 250 coins)
  - Moldura Galáxia (EPIC, 300 coins)
  - Moldura de Fogo (LEGENDARY, 500 coins)

- 🚀 **5 Boosts** (950 coins total)
  - Boost XP +20% 24h (COMMON, 100 coins)
  - Boost XP +50% 24h (RARE, 200 coins)
  - Boost XP +100% 24h (EPIC, 350 coins)
  - Boost FiCoins +20% 24h (COMMON, 100 coins)
  - Boost FiCoins +50% 24h (RARE, 200 coins)

- ⚡ **3 Consumíveis** (830 coins total)
  - Atualização Instantânea (RARE, 180 coins)
  - Slot Extra de Desafio (EPIC, 250 coins)
  - Proteção de Streak (LEGENDARY, 400 coins)

- 📦 **2 Pacotes** (1200 coins total)
  - Pacote Iniciante (RARE, 300 coins - desconto de 14%)
  - Pacote Premium (EPIC, 900 coins - desconto de 14%)

**Distribuição de Raridades:**
- ⚪ Comum: 3 itens (20%)
- 🔵 Raro: 5 itens (33%)
- 🟣 Épico: 5 itens (33%)
- 🟠 Lendário: 2 itens (14%)

**Economia:**
- Preço médio: **284 coins**
- Preço mínimo: **80 coins**
- Preço máximo: **900 coins**
- **7 itens em destaque**

---

## ✅ Próximos Passos

**Dia 2:** Implementar Service Layer (shop.service.ts)  
**Dia 3:** Implementar Controller e Routes  
**Dia 4:** Frontend Service Layer  
**Dia 5:** UI Components e Screens

---

## 📚 Referências

- Plano completo: `docs/SHOP_IMPLEMENTATION_PLAN.md`
- Seed script: `backend/prisma/seed-shop.ts`
- Schema: `backend/prisma/schema.prisma`
- Migration: `backend/prisma/migrations/20251202130208_add_shop_system/`
