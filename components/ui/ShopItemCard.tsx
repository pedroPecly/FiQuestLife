/**
 * ============================================
 * SHOP ITEM CARD - CARD DE ITEM DA LOJA
 * ============================================
 * 
 * Componente que exibe um item da loja com:
 * - Imagem/ícone do item
 * - Título e descrição
 * - Preço em coins
 * - Badge de raridade
 * - Indicador de estoque (se limitado)
 * - Badge de destaque (se featured)
 * 
 * @created 02 de dezembro de 2025
 */

import shopService, { ShopItem, ShopItemType } from '@/services/shop';
import React, { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ShopItemCardProps {
  item: ShopItem;
  onPress: (item: ShopItem) => void;
  userCoins?: number;
}

export default memo(function ShopItemCard({ item, onPress, userCoins }: ShopItemCardProps) {
  const canAfford = userCoins !== undefined ? shopService.canAfford(userCoins, item.price) : true;
  const hasStock = item.stock === null || item.stock > 0;
  const rarityColor = shopService.getRarityColor(item.rarity);
  const typeIcon = shopService.getTypeIcon(item.type);

  const accessibilityLabel = `${item.title}, ${shopService.getRarityLabel(item.rarity)}, ${item.price} moedas${!hasStock ? ', fora de estoque' : ''}${!canAfford ? ', saldo insuficiente' : ''}`;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { borderColor: rarityColor },
        !canAfford && styles.cardDisabled,
        !hasStock && styles.cardOutOfStock,
      ]}
      onPress={() => hasStock && onPress(item)}
      disabled={!hasStock}
      activeOpacity={0.7}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled: !hasStock }}
    >
      {/* Badge de destaque */}
      {item.isFeatured && (
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredText}>⭐ DESTAQUE</Text>
        </View>
      )}

      {/* Badge de raridade */}
      <View style={[styles.rarityBadge, { backgroundColor: rarityColor }]}>
        <Text style={styles.rarityText}>
          {shopService.getRarityLabel(item.rarity).toUpperCase()}
        </Text>
      </View>

      {/* Imagem do item */}
      <View style={styles.imageContainer}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="contain" />
        ) : (
          <Text style={styles.placeholderIcon}>{typeIcon}</Text>
        )}
      </View>

      {/* Informações do item */}
      <View style={styles.infoContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.typeIcon}>{typeIcon}</Text>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        {/* Metadata adicional (boost, duração, etc) */}
        {item.metadata.multiplier && (
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Multiplicador:</Text>
            <Text style={styles.metadataValue}>
              {shopService.formatBoostValue(item.metadata.multiplier)}
            </Text>
          </View>
        )}

        {item.metadata.durationHours && (
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Duração:</Text>
            <Text style={styles.metadataValue}>{item.metadata.durationHours}h</Text>
          </View>
        )}

        {item.type === ShopItemType.PACK && item.metadata.items && (
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Contém:</Text>
            <Text style={styles.metadataValue}>{item.metadata.items.length} itens</Text>
          </View>
        )}

        {/* Preço e estoque */}
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.coinIcon}>🪙</Text>
            <Text style={[styles.price, !canAfford && styles.priceInsufficient]}>
              {item.price}
            </Text>
          </View>

          {item.stock !== null && (
            <Text style={[styles.stock, item.stock < 5 && styles.stockLow]}>
              {item.stock > 0 ? `${item.stock} restantes` : 'ESGOTADO'}
            </Text>
          )}
        </View>

        {!canAfford && userCoins !== undefined && (
          <Text style={styles.insufficientWarning}>💰 Saldo insuficiente</Text>
        )}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardDisabled: {
    opacity: 0.6,
  },
  cardOutOfStock: {
    opacity: 0.4,
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FF9800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 10,
  },
  featuredText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  rarityBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 10,
  },
  rarityText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  imageContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  image: {
    width: '80%',
    height: '80%',
  },
  placeholderIcon: {
    fontSize: 64,
  },
  infoContainer: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  description: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
    lineHeight: 20,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metadataLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginRight: 6,
  },
  metadataValue: {
    fontSize: 12,
    color: '#1C1C1E',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIcon: {
    fontSize: 20,
    marginRight: 6,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  priceInsufficient: {
    color: '#FF5252',
  },
  stock: {
    fontSize: 12,
    color: '#8E8E93',
  },
  stockLow: {
    color: '#FF9800',
    fontWeight: 'bold',
  },
  insufficientWarning: {
    fontSize: 12,
    color: '#FF5252',
    marginTop: 8,
    textAlign: 'center',
  },
});
