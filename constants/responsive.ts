/**
 * 📐 UTILITÁRIOS DE RESPONSIVIDADE
 * 
 * Este arquivo contém constantes e funções para criar layouts responsivos
 * que se adaptam automaticamente a diferentes tamanhos de tela.
 * 
 * Breakpoints utilizados:
 * - Mobile pequeno: < 375px
 * - Mobile padrão: 375px - 767px
 * - Tablet: 768px - 1023px
 * - Desktop: >= 1024px
 * 
 * Base de cálculo:
 * - Largura base: 375px (iPhone 11/12/13)
 * - Altura base: 812px (iPhone 11/12/13)
 * 
 * @example
 * import { isTablet, moderateScale, fontSize } from '@/constants/responsive';
 * 
 * const styles = StyleSheet.create({
 *   text: {
 *     fontSize: fontSize.large, // 16px base, escalável
 *     padding: isTablet ? 30 : 20, // Condicional por dispositivo
 *   }
 * });
 */

import { Dimensions, Platform } from 'react-native';

// ==========================================
// 📱 DIMENSÕES DA JANELA
// ==========================================

/** Obtém dimensões atuais da janela/tela */
const { width, height } = Dimensions.get('window');

// ==========================================
// 🔍 DETECÇÃO DE TIPO DE DISPOSITIVO
// ==========================================

/**
 * Detecta se é um dispositivo mobile pequeno
 * @example iPhone SE, Samsung Galaxy S8
 */
export const isSmallDevice = width < 375;

/**
 * Detecta se é tablet
 * @example iPad, Samsung Galaxy Tab
 */
export const isTablet = width >= 768;

/**
 * Detecta se é desktop/web em tela grande
 * @example Laptop, Desktop Monitor
 */
export const isDesktop = Platform.OS === 'web' && width >= 1024;

// ==========================================
// 📏 FUNÇÕES DE ESCALA
// ==========================================

/**
 * Escala horizontal baseada na largura da tela
 * 
 * Calcula proporcionalmente ao tamanho da tela em relação ao iPhone base (375px).
 * Útil para larguras, margens horizontais e espaçamentos.
 * 
 * @param size - Tamanho base em pixels
 * @returns Tamanho escalado proporcionalmente
 * 
 * @example
 * const buttonWidth = scale(200); // 200px em iPhone, proporcional em outros
 */
export const scale = (size: number) => (width / 375) * size;

/**
 * Escala vertical baseada na altura da tela
 * 
 * Calcula proporcionalmente ao tamanho da tela em relação ao iPhone base (812px).
 * Útil para alturas, margens verticais e espaçamentos verticais.
 * 
 * @param size - Tamanho base em pixels
 * @returns Tamanho escalado proporcionalmente
 * 
 * @example
 * const headerHeight = verticalScale(60); // 60px em iPhone, proporcional em outros
 */
export const verticalScale = (size: number) => (height / 812) * size;

/**
 * Escala moderada (híbrida) - Recomendada para fontes
 * 
 * Aplica escala proporcional mas de forma mais suave (moderada).
 * O fator controla o quanto da escala será aplicado:
 * - factor = 0: sem escala (tamanho fixo)
 * - factor = 0.5: escala moderada (padrão, recomendado para fontes)
 * - factor = 1: escala total (mesmo que scale())
 * 
 * @param size - Tamanho base em pixels
 * @param factor - Fator de moderação (0 a 1), padrão 0.5
 * @returns Tamanho escalado moderadamente
 * 
 * @example
 * const titleSize = moderateScale(24); // 24px base, cresce suavemente em telas maiores
 * const fixedSize = moderateScale(16, 0); // 16px fixo em todas as telas
 */
export const moderateScale = (size: number, factor = 0.5) => 
  size + (scale(size) - size) * factor;

// ==========================================
// 📐 ESPAÇAMENTOS RESPONSIVOS
// ==========================================

/**
 * Paddings responsivos baseados no tipo de dispositivo
 * 
 * Aumenta espaçamento em telas maiores para melhor aproveitamento do espaço.
 * 
 * @example
 * const styles = StyleSheet.create({
 *   container: {
 *     paddingHorizontal: responsivePadding.horizontal, // 20px mobile, 40px tablet
 *     paddingVertical: responsivePadding.vertical, // 20px mobile, 30px tablet
 *   }
 * });
 */
export const responsivePadding = {
  horizontal: isTablet ? 40 : 20, // Padding lateral
  vertical: isTablet ? 30 : 20,   // Padding vertical
};

// ==========================================
// 🔤 TAMANHOS DE FONTE RESPONSIVOS
// ==========================================

/**
 * Tamanhos de fonte pré-calculados e responsivos
 * 
 * Usa moderateScale para garantir legibilidade em todas as telas.
 * Os tamanhos crescem suavemente em telas maiores.
 * 
 * @example
 * const styles = StyleSheet.create({
 *   smallText: { fontSize: fontSize.small },   // ~12px
 *   bodyText: { fontSize: fontSize.medium },   // ~14px
 *   subtitle: { fontSize: fontSize.large },    // ~16px
 *   heading: { fontSize: fontSize.xlarge },    // ~20px
 *   title: { fontSize: fontSize.xxlarge },     // ~24px
 *   hero: { fontSize: fontSize.title },        // ~32px
 * });
 */
export const fontSize = {
  small: moderateScale(12),    // Textos pequenos, disclaimers
  medium: moderateScale(14),   // Corpo de texto padrão
  large: moderateScale(16),    // Subtítulos, botões
  xlarge: moderateScale(20),   // Títulos de seção
  xxlarge: moderateScale(24),  // Títulos de card
  title: moderateScale(32),    // Títulos principais, hero
};

// ==========================================
// 📦 LARGURAS MÁXIMAS PARA CONTAINERS
// ==========================================

/**
 * Larguras máximas para prevenir conteúdo muito largo em telas grandes
 * 
 * Limita largura de cards e conteúdo para manter legibilidade e estética
 * em monitores grandes.
 * 
 * @example
 * const styles = StyleSheet.create({
 *   card: {
 *     width: '100%',
 *     maxWidth: maxWidth.card, // 500px mobile, 600px tablet
 *   },
 *   mainContent: {
 *     width: '100%',
 *     maxWidth: maxWidth.content, // 100% mobile, 1200px desktop
 *   }
 * });
 */
export const maxWidth = {
  card: isTablet ? 600 : 500,           // Largura máxima de cards
  content: isDesktop ? 1200 : '100%',   // Largura máxima do conteúdo principal
};
