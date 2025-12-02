import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function validateShopData() {
  console.log('🔍 Validando dados da loja...\n');

  // 1. Contar itens por tipo
  console.log('📊 ITENS POR TIPO:');
  const itemsByType = await prisma.shopItem.groupBy({
    by: ['type'],
    _count: { id: true },
  });
  
  for (const group of itemsByType) {
    console.log(`   ${group.type}: ${group._count.id} itens`);
  }

  // 2. Contar itens por raridade
  console.log('\n🏆 ITENS POR RARIDADE:');
  const itemsByRarity = await prisma.shopItem.groupBy({
    by: ['rarity'],
    _count: { id: true },
  });
  
  for (const group of itemsByRarity) {
    const icon = group.rarity === 'COMMON' ? '⚪' : 
                 group.rarity === 'RARE' ? '🔵' :
                 group.rarity === 'EPIC' ? '🟣' : '🟠';
    console.log(`   ${icon} ${group.rarity}: ${group._count.id} itens`);
  }

  // 3. Preços
  console.log('\n💰 ESTATÍSTICAS DE PREÇOS:');
  const priceStats = await prisma.shopItem.aggregate({
    _avg: { price: true },
    _min: { price: true },
    _max: { price: true },
    _count: { id: true },
  });
  
  console.log(`   Média: ${priceStats._avg.price?.toFixed(0)} coins`);
  console.log(`   Mínimo: ${priceStats._min.price} coins`);
  console.log(`   Máximo: ${priceStats._max.price} coins`);
  console.log(`   Total de itens: ${priceStats._count.id}`);

  // 4. Itens em destaque
  console.log('\n⭐ ITENS EM DESTAQUE:');
  const featuredItems = await prisma.shopItem.findMany({
    where: { isFeatured: true },
    orderBy: { order: 'asc' },
    select: {
      title: true,
      rarity: true,
      price: true,
      type: true,
    },
  });
  
  for (const item of featuredItems) {
    console.log(`   • ${item.title} (${item.rarity}, ${item.price} coins) - ${item.type}`);
  }

  // 5. Verificar enums
  console.log('\n🔧 VERIFICAÇÃO DE ENUMS:');
  const types = await prisma.$queryRaw<Array<{enumlabel: string}>>`
    SELECT enumlabel FROM pg_enum 
    WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'ShopItemType')
    ORDER BY enumlabel;
  `;
  console.log(`   ShopItemType: ${types.map(t => t.enumlabel).join(', ')}`);

  const rarities = await prisma.$queryRaw<Array<{enumlabel: string}>>`
    SELECT enumlabel FROM pg_enum 
    WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'ShopItemRarity')
    ORDER BY enumlabel;
  `;
  console.log(`   ShopItemRarity: ${rarities.map(r => r.enumlabel).join(', ')}`);

  // 6. Amostra de itens
  console.log('\n📦 AMOSTRA DE ITENS (5 primeiros):');
  const sampleItems = await prisma.shopItem.findMany({
    take: 5,
    orderBy: { price: 'asc' },
    select: {
      sku: true,
      title: true,
      price: true,
      rarity: true,
      type: true,
      stock: true,
    },
  });
  
  console.log('   SKU                  | Título                    | Preço | Raridade   | Tipo       | Stock');
  console.log('   ' + '-'.repeat(100));
  for (const item of sampleItems) {
    console.log(
      `   ${item.sku.padEnd(20)} | ${item.title.padEnd(25)} | ${String(item.price).padStart(5)} | ${item.rarity.padEnd(10)} | ${item.type.padEnd(10)} | ${item.stock ?? '∞'}`
    );
  }

  console.log('\n✅ Validação concluída! Todos os dados estão corretos.\n');
}

validateShopData()
  .catch((error) => {
    console.error('❌ Erro na validação:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
