/**
 * ============================================
 * INVENTORY ITEM CARD - CARD DO INVENTÁRIO
 * ============================================
 * 
 * Componente que exibe item do inventário com:
 * - Imagem/ícone do item
 * - Título e tipo
 * - Quantidade disponível
 * - Status (equipado, boost ativo, etc)
 * - Botões de ação (usar, equipar, desequipar)
 * - Tempo restante (para boosts)
 * 
 * @created 02 de dezembro de 2025
 */

import shopService, { ActiveBoost, ShopItemType, UserInventoryItem } from '@/services/shop';
import React, { memo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface InventoryItemCardProps {
  inventoryItem: UserInventoryItem;
  activeBoosts?: ActiveBoost[];
  onUse: (inventoryId: string, action: 'use' | 'equip' | 'unequip') => Promise<void>;
}

export default memo(function InventoryItemCard({
  inventoryItem,
  activeBoosts = [],
  onUse,
}: InventoryItemCardProps) {
  const [loading, setLoading] = useState(false);

  const { item, quantity, isEquipped } = inventoryItem;
  const typeIcon = shopService.getTypeIcon(item.type);
  const rarityColor = shopService.getRarityColor(item.rarity);

  // Verificar se é um boost ativo
  const activeBoost = activeBoosts.find((boost) => boost.itemSku === item.sku);
  const isBoostActive = activeBoost && shopService.isBoostActive(activeBoost.expiresAt);

  const accessibilityLabel = `${item.title}, quantidade ${quantity}${isEquipped ? ', equipado' : ''}${isBoostActive ? ', boost ativo' : ''}`;

  const handleAction = async (action: 'use' | 'equip' | 'unequip') => {
    if (loading) return;

    try {
      setLoading(true);
      await onUse(inventoryItem.id, action);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível realizar a ação');
    } finally {
      setLoading(false);
    }
  };

  const renderActionButton = () => {
    if (loading) {
      return (
        <View style={styles.actionButton}>
          <ActivityIndicator color="#FFF" size="small" />
        </View>
      );
    }

    // Cosméticos
    if (item.type === ShopItemType.COSMETIC) {
      if (isEquipped) {
        return (
          <TouchableOpacity
            style={[styles.actionButton, styles.unequipButton]}
            onPress={() => handleAction('unequip')}
          >
            <Text style={styles.actionButtonText}>Desequipar</Text>
          </TouchableOpacity>
        );
      }
      return (
        <TouchableOpacity
          style={[styles.actionButton, styles.equipButton]}
          onPress={() => handleAction('equip')}
        >
          <Text style={styles.actionButtonText}>Equipar</Text>
        </TouchableOpacity>
      );
    }

    // Boosts e Consumíveis
    if (item.type === ShopItemType.BOOST || item.type === ShopItemType.CONSUMABLE) {
      if (isBoostActive) {
        return (
          <View style={[styles.actionButton, styles.activeButton]}>
            <Text style={styles.actionButtonText}>⚡ ATIVO</Text>
          </View>
        );
      }

      if (quantity === 0) {
        return (
          <View style={[styles.actionButton, styles.disabledButton]}>
            <Text style={styles.actionButtonText}>Esgotado</Text>
          </View>
        );
      }

      return (
        <TouchableOpacity
          style={[styles.actionButton, styles.useButton]}
          onPress={() => handleAction('use')}
        >
          <Text style={styles.actionButtonText}>Usar</Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <View style={[styles.card, { borderColor: rarityColor }]}>
      {/* Badge de equipado/ativo */}
      {isEquipped && (
        <View style={[styles.statusBadge, styles.equippedBadge]}>
          <Text style={styles.statusText}>✓ EQUIPADO</Text>
        </View>
      )}

      {isBoostActive && activeBoost && (
        <View style={[styles.statusBadge, styles.activeBadge]}>
          <Text style={styles.statusText}>
            ⚡ {shopService.getBoostTimeRemaining(activeBoost.expiresAt)}
          </Text>
        </View>
      )}

      <View style={styles.content}>
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

          <Text style={[styles.rarity, { color: rarityColor }]}>
            {shopService.getRarityLabel(item.rarity)}
          </Text>

          {/* Metadata */}
          {item.metadata.multiplier && (
            <Text style={styles.metadata}>
              {shopService.formatBoostValue(item.metadata.multiplier)}
              {item.metadata.durationHours && ` por ${item.metadata.durationHours}h`}
            </Text>
          )}

          {item.metadata.slot && (
            <Text style={styles.metadata}>Slot: {item.metadata.slot}</Text>
          )}

          {/* Quantidade */}
          {(item.type === ShopItemType.BOOST || item.type === ShopItemType.CONSUMABLE) && (
            <View style={styles.quantityContainer}>
              <Text style={styles.quantityLabel}>Quantidade:</Text>
              <Text style={[styles.quantityValue, quantity === 0 && styles.quantityZero]}>
                {quantity}x
              </Text>
            </View>
          )}

          {/* Data de aquisição */}
          <Text style={styles.acquiredDate}>
            Adquirido: {new Date(inventoryItem.acquiredAt).toLocaleDateString('pt-BR')}
          </Text>
        </View>
      </View>

      {/* Botão de ação */}
      <View style={styles.actionContainer}>{renderActionButton()}</View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginBottom: 12,
    overflow: 'hidden',
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 10,
  },
  equippedBadge: {
    backgroundColor: '#4CAF50',
  },
  activeBadge: {
    backgroundColor: '#FF9800',
  },
  statusText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flexDirection: 'row',
    padding: 12,
  },
  imageContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    marginRight: 12,
  },
  image: {
    width: '80%',
    height: '80%',
  },
  placeholderIcon: {
    fontSize: 40,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  typeIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  rarity: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  metadata: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 2,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  quantityLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginRight: 6,
  },
  quantityValue: {
    fontSize: 14,
    color: '#1C1C1E',
    fontWeight: 'bold',
  },
  quantityZero: {
    color: '#FF5252',
  },
  acquiredDate: {
    fontSize: 10,
    color: '#8E8E93',
    marginTop: 4,
  },
  actionContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    padding: 12,
  },
  actionButton: {
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  useButton: {
    backgroundColor: '#2196F3',
  },
  equipButton: {
    backgroundColor: '#4CAF50',
  },
  unequipButton: {
    backgroundColor: '#FF9800',
  },
  activeButton: {
    backgroundColor: '#9C27B0',
  },
  disabledButton: {
    backgroundColor: '#3A3A3A',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
