/**
 * ============================================
 * SHOP PURCHASE MODAL - MODAL DE COMPRA
 * ============================================
 * 
 * Modal de confirmação de compra com:
 * - Preview do item
 * - Seletor de quantidade
 * - Cálculo do custo total
 * - Verificação de saldo
 * - Botão de confirmar/cancelar
 * - Animação de sucesso
 * 
 * @created 02 de dezembro de 2025
 */

import shopService, { ShopItem } from '@/services/shop';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface ShopPurchaseModalProps {
  visible: boolean;
  item: ShopItem | null;
  userCoins: number;
  onClose: () => void;
  onConfirm: (sku: string, quantity: number) => Promise<void>;
}

export default function ShopPurchaseModal({
  visible,
  item,
  userCoins,
  onClose,
  onConfirm,
}: ShopPurchaseModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  if (!item) return null;

  const totalCost = shopService.calculateTotalCost(item.price, quantity);
  const canAfford = shopService.canAfford(userCoins, item.price, quantity);
  const maxQuantity = item.stock || 99;
  const typeIcon = shopService.getTypeIcon(item.type);
  const rarityColor = shopService.getRarityColor(item.rarity);

  const handleConfirm = async () => {
    if (!canAfford || loading) return;

    try {
      setLoading(true);
      await onConfirm(item.sku, quantity);
      setQuantity(1);
      onClose();
    } catch (error) {
      console.error('Erro ao confirmar compra:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setQuantity(1);
      onClose();
    }
  };

  const incrementQuantity = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: rarityColor }]}>
            <Text style={styles.headerTitle}>Confirmar Compra</Text>
            <TouchableOpacity onPress={handleClose} disabled={loading} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
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
              <Text style={styles.title}>{item.title}</Text>
            </View>

            <Text style={styles.description}>{item.description}</Text>

            <View style={[styles.rarityBadge, { backgroundColor: rarityColor }]}>
              <Text style={styles.rarityText}>
                {shopService.getRarityLabel(item.rarity).toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Seletor de quantidade */}
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantidade:</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={[styles.quantityButton, quantity === 1 && styles.quantityButtonDisabled]}
                onPress={decrementQuantity}
                disabled={quantity === 1 || loading}
              >
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>

              <TextInput
                style={styles.quantityInput}
                value={quantity.toString()}
                onChangeText={(text) => {
                  const num = parseInt(text) || 1;
                  setQuantity(Math.min(Math.max(num, 1), maxQuantity));
                }}
                keyboardType="number-pad"
                editable={!loading}
                selectTextOnFocus
              />

              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  quantity >= maxQuantity && styles.quantityButtonDisabled,
                ]}
                onPress={incrementQuantity}
                disabled={quantity >= maxQuantity || loading}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Resumo do custo */}
          <View style={styles.costContainer}>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Preço unitário:</Text>
              <View style={styles.costValue}>
                <Text style={styles.coinIcon}>🪙</Text>
                <Text style={styles.costText}>{item.price}</Text>
              </View>
            </View>

            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Quantidade:</Text>
              <Text style={styles.costText}>×{quantity}</Text>
            </View>

            <View style={[styles.costRow, styles.costRowTotal]}>
              <Text style={styles.costLabelTotal}>Total:</Text>
              <View style={styles.costValue}>
                <Text style={styles.coinIcon}>🪙</Text>
                <Text style={[styles.costTextTotal, !canAfford && styles.costTextInsufficient]}>
                  {totalCost}
                </Text>
              </View>
            </View>
          </View>

          {/* Aviso de saldo insuficiente */}
          {!canAfford && (
            <View style={styles.warningContainer}>
              <Text style={styles.warningText}>
                ⚠️ Saldo insuficiente! Faltam {totalCost - userCoins} coins.
              </Text>
            </View>
          )}

          {/* Botões de ação */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                (!canAfford || loading) && styles.confirmButtonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={!canAfford || loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.confirmButtonText}>Comprar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24, // Padrão do projeto (igual ao modal de badges)
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    // backgroundColor é definido dinamicamente pela rarityColor
    borderBottomWidth: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF', // Branco pois o fundo é sempre colorido (rarityColor)
  },
  closeButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#FFFFFF', // Branco para contrastar com rarityColor
    fontWeight: 'bold',
  },
  imageContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F8FF', // Alice Blue - padrão do projeto
  },
  image: {
    width: '70%',
    height: '70%',
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
    fontSize: 24,
    marginRight: 8,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#2F4F4F', // Padrão do projeto
  },
  description: {
    fontSize: 14,
    color: '#666', // Padrão do projeto
    marginBottom: 12,
    lineHeight: 20,
  },
  rarityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  rarityText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  quantityLabel: {
    fontSize: 16,
    color: '#2F4F4F', // Padrão do projeto
    fontWeight: '600',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  quantityButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
  },
  quantityButtonDisabled: {
    opacity: 0.3,
  },
  quantityButtonText: {
    fontSize: 24,
    color: '#1C1C1E',
    fontWeight: 'bold',
  },
  quantityInput: {
    width: 60,
    height: 44,
    textAlign: 'center',
    fontSize: 18,
    color: '#1C1C1E',
    fontWeight: 'bold',
  },
  costContainer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#F7F7F7', // Padrão do projeto (infoRow)
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EFEFEF',
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  costRowTotal: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  costLabel: {
    fontSize: 14,
    color: '#666',
  },
  costLabelTotal: {
    fontSize: 18,
    color: '#2F4F4F',
    fontWeight: '700',
  },
  costValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  costText: {
    fontSize: 16,
    color: '#333',
  },
  costTextTotal: {
    fontSize: 24,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  costTextInsufficient: {
    color: '#FF5252',
  },
  warningContainer: {
    backgroundColor: 'rgba(255, 82, 82, 0.08)',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 10, // Padrão do projeto
    borderWidth: 1,
    borderColor: '#FF5252',
  },
  warningText: {
    fontSize: 14,
    color: '#FF5252',
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 10, // Padrão do projeto
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#2F4F4F', // Padrão do projeto
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#20B2AA', // Accent teal padrão do projeto
  },
  confirmButtonDisabled: {
    backgroundColor: '#E0E0E0',
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
});
