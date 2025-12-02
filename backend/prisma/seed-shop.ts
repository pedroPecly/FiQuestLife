import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seed de Itens da Loja
 * 
 * Popula o catálogo inicial com 15 itens:
 * - 5 Cosméticos (Frames para Avatar)
 * - 5 Boosts (Multiplicadores de XP e Coins)
 * - 3 Consumíveis (Utilitários especiais)
 * - 2 Pacotes (Bundles com desconto)
 */
async function seedShopItems() {
  console.log('🛒 Iniciando seed de itens da loja...\n');

  // ============================================
  // COSMÉTICOS - AVATAR FRAMES (5 itens)
  // ============================================
  const cosmetics = [
    {
      sku: 'frame_ocean',
      title: 'Moldura Oceânica',
      description: 'Ondas suaves em tons de azul. Perfeita para amantes do mar.',
      price: 80,
      type: 'COSMETIC' as const,
      category: 'AVATAR_FRAME',
      rarity: 'COMMON' as const,
      metadata: {
        slot: 'avatar_frame',
        borderWidth: 2,
        borderColor: '#1E90FF',
        effect: 'waves',
      },
      imageUrl: 'https://placeholder.com/shop/frame_ocean.png',
      stock: null, // Ilimitado
      isActive: true,
      isFeatured: false,
      order: 10,
    },
    {
      sku: 'frame_neon',
      title: 'Moldura Neon',
      description: 'Brilho neon vibrante para destacar seu perfil no feed.',
      price: 150,
      type: 'COSMETIC' as const,
      category: 'AVATAR_FRAME',
      rarity: 'RARE' as const,
      metadata: {
        slot: 'avatar_frame',
        borderWidth: 2,
        borderColor: '#00FFFF',
        glow: true,
        glowIntensity: 0.7,
      },
      imageUrl: 'https://placeholder.com/shop/frame_neon.png',
      stock: null,
      isActive: true,
      isFeatured: false,
      order: 20,
    },
    {
      sku: 'frame_gold',
      title: 'Moldura Dourada',
      description: 'Moldura elegante e refinada. Mostra status de jogador veterano.',
      price: 250,
      type: 'COSMETIC' as const,
      category: 'AVATAR_FRAME',
      rarity: 'EPIC' as const,
      metadata: {
        slot: 'avatar_frame',
        borderWidth: 3,
        borderColor: '#FFD700',
        metallic: true,
      },
      imageUrl: 'https://placeholder.com/shop/frame_gold.png',
      stock: null,
      isActive: true,
      isFeatured: true,
      order: 5,
    },
    {
      sku: 'frame_galaxy',
      title: 'Moldura Galáxia',
      description: 'Estrelas e nebulosas rodeiam seu perfil. Visual hipnotizante!',
      price: 300,
      type: 'COSMETIC' as const,
      category: 'AVATAR_FRAME',
      rarity: 'EPIC' as const,
      metadata: {
        slot: 'avatar_frame',
        borderWidth: 3,
        gradient: ['#4B0082', '#9400D3', '#FF1493'],
        animated: true,
        animationDuration: 3000,
      },
      imageUrl: 'https://placeholder.com/shop/frame_galaxy.png',
      stock: null,
      isActive: true,
      isFeatured: true,
      order: 3,
    },
    {
      sku: 'frame_fire',
      title: 'Moldura de Fogo',
      description: 'Chamas épicas envolvem seu avatar. Item exclusivo e raro!',
      price: 500,
      type: 'COSMETIC' as const,
      category: 'AVATAR_FRAME',
      rarity: 'LEGENDARY' as const,
      metadata: {
        slot: 'avatar_frame',
        borderWidth: 4,
        borderColor: '#FF4500',
        animated: true,
        animationType: 'fire',
        animationDuration: 2000,
        particleEffects: true,
      },
      imageUrl: 'https://placeholder.com/shop/frame_fire.png',
      stock: null,
      isActive: true,
      isFeatured: true,
      order: 1,
    },
  ];

  // ============================================
  // BOOSTS - MULTIPLICADORES (5 itens)
  // ============================================
  const boosts = [
    {
      sku: 'boost_xp_24h_12',
      title: 'Boost XP +20%',
      description: 'Aumente seus ganhos de XP em 20% por 24 horas.',
      price: 100,
      type: 'BOOST' as const,
      category: 'XP_BOOST',
      rarity: 'COMMON' as const,
      metadata: {
        boostType: 'XP_MULTIPLIER',
        multiplier: 1.2,
        durationHours: 24,
        icon: '🚀',
      },
      imageUrl: 'https://placeholder.com/shop/boost_xp_common.png',
      stock: null,
      isActive: true,
      isFeatured: false,
      order: 30,
    },
    {
      sku: 'boost_xp_24h_15',
      title: 'Boost XP +50%',
      description: 'Multiplique seus ganhos de XP em 50% por 24 horas!',
      price: 200,
      type: 'BOOST' as const,
      category: 'XP_BOOST',
      rarity: 'RARE' as const,
      metadata: {
        boostType: 'XP_MULTIPLIER',
        multiplier: 1.5,
        durationHours: 24,
        icon: '🚀',
      },
      imageUrl: 'https://placeholder.com/shop/boost_xp_rare.png',
      stock: null,
      isActive: true,
      isFeatured: false,
      order: 25,
    },
    {
      sku: 'boost_xp_24h_20',
      title: 'Boost XP +100%',
      description: 'DOBRO de XP por 24 horas! Aproveite ao máximo seus desafios!',
      price: 350,
      type: 'BOOST' as const,
      category: 'XP_BOOST',
      rarity: 'EPIC' as const,
      metadata: {
        boostType: 'XP_MULTIPLIER',
        multiplier: 2.0,
        durationHours: 24,
        icon: '🚀',
      },
      imageUrl: 'https://placeholder.com/shop/boost_xp_epic.png',
      stock: null,
      isActive: true,
      isFeatured: true,
      order: 7,
    },
    {
      sku: 'boost_coins_24h_12',
      title: 'Boost FiCoins +20%',
      description: 'Ganhe 20% mais FiCoins em todos os desafios por 24 horas.',
      price: 100,
      type: 'BOOST' as const,
      category: 'COINS_BOOST',
      rarity: 'COMMON' as const,
      metadata: {
        boostType: 'COINS_MULTIPLIER',
        multiplier: 1.2,
        durationHours: 24,
        icon: '💰',
      },
      imageUrl: 'https://placeholder.com/shop/boost_coins_common.png',
      stock: null,
      isActive: true,
      isFeatured: false,
      order: 35,
    },
    {
      sku: 'boost_coins_24h_15',
      title: 'Boost FiCoins +50%',
      description: 'Multiplique seus ganhos de FiCoins em 50% por 24 horas!',
      price: 200,
      type: 'BOOST' as const,
      category: 'COINS_BOOST',
      rarity: 'RARE' as const,
      metadata: {
        boostType: 'COINS_MULTIPLIER',
        multiplier: 1.5,
        durationHours: 24,
        icon: '💰',
      },
      imageUrl: 'https://placeholder.com/shop/boost_coins_rare.png',
      stock: null,
      isActive: true,
      isFeatured: false,
      order: 28,
    },
  ];

  // ============================================
  // CONSUMÍVEIS - UTILITÁRIOS (3 itens)
  // ============================================
  const consumables = [
    {
      sku: 'instant_refresh',
      title: 'Atualização Instantânea',
      description:
        'Atualize seus desafios diários imediatamente sem perder progresso.',
      price: 180,
      type: 'CONSUMABLE' as const,
      category: 'UTILITY',
      rarity: 'RARE' as const,
      metadata: {
        effect: 'INSTANT_REFRESH',
        usageLimit: 1,
        icon: '🔄',
      },
      imageUrl: 'https://placeholder.com/shop/instant_refresh.png',
      stock: null,
      isActive: true,
      isFeatured: false,
      order: 40,
    },
    {
      sku: 'extra_challenge_slot',
      title: 'Slot Extra de Desafio',
      description: 'Adiciona 1 desafio extra por 1 dia (máximo de 6 desafios).',
      price: 250,
      type: 'CONSUMABLE' as const,
      category: 'UTILITY',
      rarity: 'EPIC' as const,
      metadata: {
        effect: 'EXTRA_CHALLENGE',
        quantity: 1,
        durationDays: 1,
        icon: '📋',
      },
      imageUrl: 'https://placeholder.com/shop/extra_slot.png',
      stock: null,
      isActive: true,
      isFeatured: false,
      order: 15,
    },
    {
      sku: 'streak_saver',
      title: 'Proteção de Streak',
      description:
        'Protege sua sequência de 1 dia perdido. Use sabiamente! Item lendário.',
      price: 400,
      type: 'CONSUMABLE' as const,
      category: 'UTILITY',
      rarity: 'LEGENDARY' as const,
      metadata: {
        effect: 'STREAK_PROTECTION',
        daysProtected: 1,
        icon: '🛡️',
        autoActivate: true, // Ativa automaticamente ao perder streak
      },
      imageUrl: 'https://placeholder.com/shop/streak_saver.png',
      stock: null,
      isActive: true,
      isFeatured: true,
      order: 2,
    },
  ];

  // ============================================
  // PACOTES - BUNDLES (2 itens)
  // ============================================
  const packs = [
    {
      sku: 'starter_pack',
      title: 'Pacote Iniciante',
      description:
        'Perfeito para começar! Inclui: Moldura Neon + 2x Boost XP +20%',
      price: 300, // Valor original: 150 + 200 = 350 (desconto de 50 coins = 14%)
      type: 'PACK' as const,
      category: 'BUNDLE',
      rarity: 'RARE' as const,
      metadata: {
        contains: [
          { sku: 'frame_neon', quantity: 1 },
          { sku: 'boost_xp_24h_12', quantity: 2 },
        ],
        discount: 50,
        discountPercent: 14,
        icon: '📦',
      },
      imageUrl: 'https://placeholder.com/shop/starter_pack.png',
      stock: null,
      isActive: true,
      isFeatured: true,
      order: 8,
    },
    {
      sku: 'premium_pack',
      title: 'Pacote Premium',
      description:
        'Para os mais dedicados! Inclui: Moldura Galáxia + Boost XP +100% + Proteção de Streak',
      price: 900, // Valor original: 300 + 350 + 400 = 1050 (desconto de 150 coins = 14%)
      type: 'PACK' as const,
      category: 'BUNDLE',
      rarity: 'EPIC' as const,
      metadata: {
        contains: [
          { sku: 'frame_galaxy', quantity: 1 },
          { sku: 'boost_xp_24h_20', quantity: 1 },
          { sku: 'streak_saver', quantity: 1 },
        ],
        discount: 150,
        discountPercent: 14,
        icon: '🎁',
      },
      imageUrl: 'https://placeholder.com/shop/premium_pack.png',
      stock: null,
      isActive: true,
      isFeatured: true,
      order: 4,
    },
  ];

  // ============================================
  // INSERIR TODOS OS ITENS
  // ============================================
  const allItems = [...cosmetics, ...boosts, ...consumables, ...packs];

  let created = 0;
  let updated = 0;

  for (const item of allItems) {
    const existing = await prisma.shopItem.findUnique({
      where: { sku: item.sku },
    });

    if (existing) {
      await prisma.shopItem.update({
        where: { sku: item.sku },
        data: item,
      });
      updated++;
      console.log(`   ✏️  Atualizado: ${item.title} (${item.sku})`);
    } else {
      await prisma.shopItem.create({ data: item });
      created++;
      console.log(`   ✅ Criado: ${item.title} (${item.sku})`);
    }
  }

  console.log('\n📊 Resumo do Seed:');
  console.log(`   ✅ ${created} itens criados`);
  console.log(`   ✏️  ${updated} itens atualizados`);
  console.log(`   📦 ${allItems.length} itens totais no catálogo\n`);

  // ============================================
  // ESTATÍSTICAS DO CATÁLOGO
  // ============================================
  console.log('📈 Estatísticas do Catálogo:');
  console.log(
    `   🎨 Cosméticos: ${cosmetics.length} (${cosmetics.reduce((sum, i) => sum + i.price, 0)} coins total)`
  );
  console.log(
    `   🚀 Boosts: ${boosts.length} (${boosts.reduce((sum, i) => sum + i.price, 0)} coins total)`
  );
  console.log(
    `   ⚡ Consumíveis: ${consumables.length} (${consumables.reduce((sum, i) => sum + i.price, 0)} coins total)`
  );
  console.log(
    `   📦 Pacotes: ${packs.length} (${packs.reduce((sum, i) => sum + i.price, 0)} coins total)`
  );

  const rarities = {
    COMMON: allItems.filter((i) => i.rarity === 'COMMON').length,
    RARE: allItems.filter((i) => i.rarity === 'RARE').length,
    EPIC: allItems.filter((i) => i.rarity === 'EPIC').length,
    LEGENDARY: allItems.filter((i) => i.rarity === 'LEGENDARY').length,
  };

  console.log('\n🏆 Distribuição de Raridades:');
  console.log(`   ⚪ Comum: ${rarities.COMMON}`);
  console.log(`   🔵 Raro: ${rarities.RARE}`);
  console.log(`   🟣 Épico: ${rarities.EPIC}`);
  console.log(`   🟠 Lendário: ${rarities.LEGENDARY}`);

  const avgPrice =
    allItems.reduce((sum, i) => sum + i.price, 0) / allItems.length;
  const minPrice = Math.min(...allItems.map((i) => i.price));
  const maxPrice = Math.max(...allItems.map((i) => i.price));

  console.log('\n💰 Economia:');
  console.log(`   Preço médio: ${avgPrice.toFixed(0)} coins`);
  console.log(`   Preço mínimo: ${minPrice} coins (${allItems.find((i) => i.price === minPrice)?.title})`);
  console.log(`   Preço máximo: ${maxPrice} coins (${allItems.find((i) => i.price === maxPrice)?.title})`);

  const featured = allItems.filter((i) => i.isFeatured).length;
  console.log(`\n⭐ Itens em destaque: ${featured}`);

  console.log('\n✅ Seed de loja concluído com sucesso!\n');
}

// Executar seed
seedShopItems()
  .catch((error) => {
    console.error('❌ Erro no seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
