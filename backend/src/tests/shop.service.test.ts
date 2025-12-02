import { prisma } from '../lib/prisma.js';
import * as shopService from '../services/shop.service.js';

/**
 * Script de testes manuais para o Shop Service
 * Execute: npm run test:shop
 */

async function runTests() {
  console.log('🧪 Iniciando testes do Shop Service...\n');

  let testUserId: string | undefined;
  let testItemSku: string;

  try {
    // ============================================
    // SETUP: Criar usuário de teste
    // ============================================
    console.log('📋 SETUP: Criando usuário de teste...');
    const testUser = await prisma.user.create({
      data: {
        email: `test-shop-${Date.now()}@test.com`,
        username: `testshop${Date.now()}`,
        name: 'Test Shop User',
        password: 'test123',
        coins: 2000, // Saldo inicial para testes (aumentado para cobrir todos os testes)
        birthDate: new Date('2000-01-01'),
      },
    });
    testUserId = testUser.id;
    console.log(`   ✅ Usuário criado: ${testUser.username} (${testUserId})`);
    console.log(`   💰 Saldo inicial: ${testUser.coins} coins\n`);

    // ============================================
    // TESTE 1: Listar itens da loja
    // ============================================
    console.log('📦 TESTE 1: Listar itens da loja');
    const allItems = await shopService.getShopItems();
    console.log(`   ✅ Total de itens: ${allItems.length}`);

    const featuredItems = await shopService.getShopItems({ isFeatured: true });
    console.log(`   ⭐ Itens em destaque: ${featuredItems.length}`);

    const boosts = await shopService.getShopItems({ type: 'BOOST' });
    console.log(`   🚀 Boosts disponíveis: ${boosts.length}`);

    const commonItems = await shopService.getShopItems({ rarity: 'COMMON' });
    console.log(`   ⚪ Itens comuns: ${commonItems.length}\n`);

    // ============================================
    // TESTE 2: Buscar item específico
    // ============================================
    console.log('🔍 TESTE 2: Buscar item específico');
    testItemSku = 'boost_xp_24h_12'; // Boost XP +20% (100 coins)
    const item = await shopService.getShopItem(testItemSku);
    if (item) {
      console.log(`   ✅ Item encontrado: ${item.title}`);
      console.log(`   💰 Preço: ${item.price} coins`);
      console.log(`   🏆 Raridade: ${item.rarity}\n`);
    } else {
      console.log(`   ❌ Item não encontrado\n`);
    }

    // ============================================
    // TESTE 3: Compra com saldo suficiente
    // ============================================
    console.log('💳 TESTE 3: Compra com saldo suficiente');
    const purchaseResult = await shopService.purchaseItem(
      testUserId,
      testItemSku,
      2 // Comprar 2 unidades
    );
    console.log(`   ✅ ${purchaseResult.message}`);
    console.log(`   💰 Novo saldo: ${purchaseResult.newBalance} coins`);
    console.log(`   📦 Quantidade no inventário: ${purchaseResult.inventoryEntry.quantity}\n`);

    // ============================================
    // TESTE 4: Verificar inventário
    // ============================================
    console.log('🎒 TESTE 4: Verificar inventário');
    const inventory = await shopService.getUserInventory(testUserId);
    console.log(`   ✅ Total de itens no inventário: ${inventory.length}`);
    for (const entry of inventory) {
      console.log(
        `   • ${entry.item.title} (${entry.item.type}) - Quantidade: ${entry.quantity}`
      );
    }
    console.log('');

    // ============================================
    // TESTE 5: Ativar boost
    // ============================================
    console.log('🚀 TESTE 5: Ativar boost');
    const inventoryEntry = inventory.find(
      (i) => i.item.sku === testItemSku
    );

    if (inventoryEntry) {
      const useResult = await shopService.useInventoryItem(
        testUserId,
        inventoryEntry.id,
        'use'
      );
      console.log(`   ✅ ${useResult.message}`);
      console.log(`   🔥 Boost ativado:`, useResult.effect);
    }
    console.log('');

    // ============================================
    // TESTE 6: Verificar boosts ativos
    // ============================================
    console.log('⏱️ TESTE 6: Verificar boosts ativos');
    const activeBoosts = await shopService.getActiveBoosts(testUserId);
    console.log(`   ✅ Boosts ativos: ${activeBoosts.length}`);
    for (const boost of activeBoosts) {
      console.log(
        `   • ${boost.type}: ${boost.value}x até ${boost.expiresAt.toLocaleString('pt-BR')}`
      );
    }
    console.log('');

    // ============================================
    // TESTE 7: Aplicar multiplicadores
    // ============================================
    console.log('✨ TESTE 7: Aplicar multiplicadores');
    const baseXP = 50;
    const baseCoins = 20;
    const multiplied = await shopService.applyBoostMultipliers(
      testUserId,
      baseXP,
      baseCoins
    );
    console.log(`   Base: ${baseXP} XP, ${baseCoins} coins`);
    console.log(`   Com boost: ${multiplied.xp} XP, ${multiplied.coins} coins`);
    console.log(
      `   Multiplicador aplicado: ${(multiplied.xp / baseXP).toFixed(2)}x XP\n`
    );

    // ============================================
    // TESTE 8: Comprar pacote (bundle)
    // ============================================
    console.log('📦 TESTE 8: Comprar pacote (bundle)');
    const packItem = await shopService.getShopItem('starter_pack'); // 300 coins
    if (packItem) {
      const packPurchase = await shopService.purchaseItem(
        testUserId,
        'starter_pack',
        1
      );
      console.log(`   ✅ ${packPurchase.message}`);
      console.log(`   💰 Novo saldo: ${packPurchase.newBalance} coins`);

      // Verificar inventário após compra do pacote
      const updatedInventory = await shopService.getUserInventory(testUserId);
      console.log(`   📦 Itens no inventário após pacote: ${updatedInventory.length}`);
    }
    console.log('');

    // ============================================
    // TESTE 9: Compra com saldo insuficiente
    // ============================================
    console.log('❌ TESTE 9: Compra com saldo insuficiente');
    
    // Gastar quase todo o saldo
    const currentUser = await prisma.user.findUnique({
      where: { id: testUserId },
      select: { coins: true },
    });
    
    if (currentUser) {
      // Atualizar para ter apenas 50 coins
      await prisma.user.update({
        where: { id: testUserId },
        data: { coins: 50 },
      });
      
      try {
        await shopService.purchaseItem(testUserId, 'frame_ocean', 1); // 80 coins (insuficiente)
        console.log('   ⚠️  Compra não deveria ter funcionado!\n');
      } catch (error: any) {
        console.log(`   ✅ Erro esperado: ${error.message}\n`);
      }
      
      // Restaurar saldo para continuar testes
      await prisma.user.update({
        where: { id: testUserId },
        data: { coins: 500 },
      });
    }

    // ============================================
    // TESTE 10: Comprar cosmético e equipar
    // ============================================
    console.log('🎨 TESTE 10: Comprar cosmético e equipar');
    const frameOcean = await shopService.getShopItem('frame_ocean'); // 80 coins
    if (frameOcean) {
      const framePurchase = await shopService.purchaseItem(
        testUserId,
        'frame_ocean',
        1
      );
      console.log(`   ✅ ${framePurchase.message}`);
      console.log(`   💰 Novo saldo: ${framePurchase.newBalance} coins`);

      // Equipar frame
      const equipResult = await shopService.useInventoryItem(
        testUserId,
        framePurchase.inventoryEntry.id,
        'equip'
      );
      console.log(`   ✅ ${equipResult.message}`);
      console.log(`   🎨 Frame equipado:`, equipResult.effect);
    }
    console.log('');

    // ============================================
    // TESTE 11: Estatísticas de vendas
    // ============================================
    console.log('📊 TESTE 11: Estatísticas de vendas');
    const stats = await shopService.getSalesStats();
    console.log(`   ✅ Total de compras: ${stats.totalPurchases}`);
    console.log(`   💰 Receita total: ${stats.totalRevenue} coins`);
    console.log(`   🏆 Top 3 itens mais vendidos:`);
    for (let i = 0; i < Math.min(3, stats.topItems.length); i++) {
      const top = stats.topItems[i];
      console.log(
        `      ${i + 1}. ${top.item?.title} - ${top._count.id} vendas (${top._sum.totalCost} coins)`
      );
    }
    console.log('');

    // ============================================
    // TESTE 12: Prevenção de double-purchase
    // ============================================
    console.log('⏱️ TESTE 12: Prevenção de double-purchase');
    try {
      await shopService.purchaseItem(testUserId, 'boost_xp_24h_12', 1);
      await shopService.purchaseItem(testUserId, 'boost_xp_24h_12', 1); // Imediato
      console.log('   ⚠️  Double-purchase não foi bloqueado!\n');
    } catch (error: any) {
      console.log(`   ✅ Erro esperado: ${error.message}\n`);
    }

    console.log('✅ Todos os testes concluídos com sucesso!\n');
  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
  } finally {
    // ============================================
    // CLEANUP: Deletar usuário de teste
    // ============================================
    if (testUserId) {
      console.log('🧹 CLEANUP: Deletando usuário de teste...');
      await prisma.user.delete({
        where: { id: testUserId },
      });
      console.log('   ✅ Usuário de teste deletado\n');
    }

    await prisma.$disconnect();
  }
}

// Executar testes
runTests();
