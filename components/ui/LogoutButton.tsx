/**
 * COMPONENTE LOGOUTBUTTON
 *
 * Botão reutilizável para logout do usuário com confirmação.
 * Inclui limpeza de dados de autenticação, callbacks opcionais
 * e navegação automática para tela de login.
 *
 * Funcionalidades:
 * - Confirmação antes do logout via modal
 * - Limpeza automática do AsyncStorage
 * - Navegação cross-platform (web/mobile)
 * - Callbacks para sucesso/erro personalizados
 * - Tratamento de erros integrado
 *
 * @author FiQuestLife Team
 * @version 1.0.0
 */

import { router } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useAlert } from '../../hooks/useAlert';
import { authStorage } from '../../services/auth';
import { AlertModal } from './AlertModal';
import { Button } from './Button';

/**
 * Propriedades do componente LogoutButton
 */
interface LogoutButtonProps {
  /** Texto exibido no botão (padrão: 'Sair da Conta') */
  title?: string;
  /** Ícone do botão (padrão: 'logout') */
  icon?: string;
  /** Estilos customizados para o botão */
  style?: any;
  /** Callback chamado após logout bem-sucedido */
  onLogoutSuccess?: () => void;
  /** Callback chamado em caso de erro no logout */
  onLogoutError?: (error: any) => void;
}

/**
 * Componente LogoutButton - Botão de logout com confirmação
 *
 * Renderiza um botão que, quando pressionado, mostra um modal de confirmação
 * antes de executar o logout completo do usuário.
 */
export const LogoutButton: React.FC<LogoutButtonProps> = ({
  title = 'Sair da Conta',
  icon = 'logout',
  style,
  onLogoutSuccess,
  onLogoutError,
}) => {
  // Hook personalizado para gerenciamento de alertas
  const { alert, alertConfig, isVisible, hideAlert } = useAlert();

  /**
   * Executa o processo completo de logout
   *
   * 1. Limpa dados de autenticação do AsyncStorage
   * 2. Chama callback de sucesso (se fornecido)
   * 3. Redireciona para tela de login com estratégia cross-platform
   * 4. Trata erros e mostra alertas apropriados
   */
  const handleLogout = async () => {
    try {
      // ==========================================
      // PASSO 1: LIMPAR DADOS DE AUTENTICAÇÃO
      // ==========================================
      // Remove token JWT e dados do usuário do armazenamento local
      await authStorage.logout();

      // ==========================================
      // PASSO 2: CALLBACK DE SUCESSO OPCIONAL
      // ==========================================
      // Permite que componentes pai executem lógica adicional
      if (onLogoutSuccess) {
        onLogoutSuccess();
      }

      // ==========================================
      // PASSO 3: REDIRECIONAMENTO CROSS-PLATFORM
      // ==========================================
      if (Platform.OS === 'web') {
        // Web: força reload completo da página (mais rápido e confiável)
        // Limpa estado da aplicação e força nova inicialização
        window.location.href = '/';
      } else {
        // Mobile: usa navegação nativa do Expo Router
        // Aguarda um pouco para garantir que o AsyncStorage foi limpo
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Dismiss todas as telas da stack e vai para raiz
        try {
          if (router.canDismiss()) {
            router.dismissAll();
          }
          // Usa pushh para garantir navegação limpa
          router.push('/');
        } catch (navError) {
          // Fallback: tenta replace se push falhar
          console.log('Tentando replace como fallback...');
          router.replace('/');
        }
      }
    } catch (error) {
      // ==========================================
      // TRATAMENTO DE ERROS
      // ==========================================
      console.error('Erro ao fazer logout:', error);

      // Callback opcional de erro para tratamento personalizado
      if (onLogoutError) {
        onLogoutError(error);
      } else {
        // Alerta padrão de erro usando o sistema de alertas
        alert.error('Erro', 'Erro ao fazer logout. Tente novamente.');
      }
    }
  };

  /**
   * Mostra modal de confirmação antes do logout
   *
   * Usa o hook useAlert para exibir um modal de confirmação
   * com opções "Sair" e "Cancelar".
   */
  const confirmLogout = () => {
    alert.confirm(
      'Sair da Conta',                    // Título do modal
      'Tem certeza que deseja sair da sua conta?', // Mensagem
      handleLogout,                       // Função executada se confirmar
      undefined,                          // onCancel não necessário (fecha modal)
      'Sair',                            // Texto do botão confirmar
      'Cancelar'                         // Texto do botão cancelar
    );
  };

  /**
   * Renderização do componente
   *
   * Retorna um fragmento contendo:
   * 1. Botão principal que dispara confirmação
   * 2. Modal de alerta para confirmações/erros
   */
  return (
    <>
      {/* ==========================================
          BOTÃO PRINCIPAL DE LOGOUT
          ========================================== */}
      <Button
        title={title}           // Texto customizável do botão
        icon={icon}            // Ícone customizável
        onPress={confirmLogout} // Dispara modal de confirmação
        style={style}          // Estilos customizados opcionais
      />

      {/* ==========================================
          MODAL DE ALERTA INTEGRADO
          ==========================================
          Usa o AlertModal para confirmações e mensagens de erro.
          Gerenciado pelo hook useAlert para estado consistente. */}
      <AlertModal
        visible={isVisible}                    // Controlado pelo hook useAlert
        title={alertConfig?.title || ''}       // Título do alerta atual
        message={alertConfig?.message || ''}   // Mensagem do alerta atual
        type={alertConfig?.type}               // Tipo: success/error/warning/info
        confirmText={alertConfig?.confirmText} // Texto do botão confirmar
        cancelText={alertConfig?.cancelText}   // Texto do botão cancelar (opcional)
        onConfirm={alertConfig?.onConfirm}     // Ação ao confirmar
        onCancel={alertConfig?.onCancel}       // Ação ao cancelar
        onClose={hideAlert}                    // Fecha modal ao clicar fora
      />
    </>
  );
};

// ==========================================
// EXEMPLOS DE USO E API
// ==========================================

/**
 * EXEMPLOS DE USO DO LOGOUTBUTTON:
 *
 * // Uso básico
 * <LogoutButton />
 *
 * // Com texto e ícone customizados
 * <LogoutButton
 *   title="Desconectar"
 *   icon="exit"
 * />
 *
 * // Com callbacks personalizados
 * <LogoutButton
 *   onLogoutSuccess={() => console.log('Logout realizado')}
 *   onLogoutError={(error) => console.error('Erro:', error)}
 * />
 *
 * // Com estilos customizados
 * <LogoutButton
 *   style={{ backgroundColor: 'red' }}
 *   title="Sair"
 * />
 */

/**
 * PROPRIEDADES DO COMPONENTE:
 *
 * title?: string - Texto do botão (padrão: 'Sair da Conta')
 * icon?: string - Ícone do botão (padrão: 'logout')
 * style?: any - Estilos customizados para o botão
 * onLogoutSuccess?: () => void - Callback após logout bem-sucedido
 * onLogoutError?: (error: any) => void - Callback em caso de erro
 *
 * DEPENDÊNCIAS:
 * - Button: Componente base para renderização
 * - AlertModal: Para confirmações e alertas
 * - authStorage: Serviço de gerenciamento de autenticação
 * - useAlert: Hook para gerenciamento de alertas
 * - expo-router: Para navegação cross-platform
 *
 * NOTAS DE IMPLEMENTAÇÃO:
 * - Sempre mostra confirmação antes do logout
 * - Limpa dados automaticamente do AsyncStorage
 * - Estratégia de navegação diferente para web/mobile
 * - Tratamento robusto de erros com fallbacks
 */

export default LogoutButton;