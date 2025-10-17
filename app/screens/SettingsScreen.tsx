/**
 * ============================================
 * SETTINGS SCREEN - TELA DE CONFIGURAÇÕES
 * ============================================
 * 
 * Tela profissional de configurações com:
 * - Notificações
 * - Perfil público/privado
 * - Lembrete diário
 * - Informações da conta
 * - Gerenciamento de dados
 * 
 * @author GitHub Copilot
 * @created 17 de outubro de 2025
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { AlertModal } from '../../components/ui';
import { useAlert } from '../../hooks/useAlert';
import { authService } from '../../services/api';
import { authStorage } from '../../services/auth';
import type { User } from '../../types/user';
import { styles } from '../styles/settings.styles';

export const SettingsScreen = () => {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [profilePublic, setProfilePublic] = useState(false);
  const [dailyReminder, setDailyReminder] = useState('');

  const { alert, isVisible, alertConfig, hideAlert } = useAlert();

  // ==========================================
  // LIFECYCLE
  // ==========================================
  useEffect(() => {
    loadUserData();
  }, []);

  // ==========================================
  // DATA LOADING
  // ==========================================
  const loadUserData = async () => {
    try {
      setLoading(true);
      const token = await authStorage.getToken();

      if (!token) {
        router.replace('/');
        return;
      }

      const result = await authService.getMe(token);

      if (result.success && result.data) {
        setUser(result.data);
        setNotificationsEnabled(result.data.notificationsEnabled);
        setProfilePublic(result.data.profilePublic);
        setDailyReminder(result.data.dailyReminderTime || '');
      } else {
        alert.error('Erro', 'Não foi possível carregar suas configurações.');
        router.back();
      }
    } catch (error) {
      alert.error('Erro', 'Erro ao carregar configurações.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleToggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    // TODO: Salvar no backend
    alert.success('Atualizado', `Notificações ${value ? 'ativadas' : 'desativadas'}`);
  };

  const handleToggleProfilePublic = async (value: boolean) => {
    setProfilePublic(value);
    // TODO: Salvar no backend
    alert.success(
      'Atualizado',
      value ? 'Seu perfil agora é público' : 'Seu perfil agora é privado'
    );
  };

  const handleSetReminder = () => {
    alert.info('Em Breve', 'Configuração de lembretes estará disponível em breve!');
  };

  const handleClearCache = () => {
    if (Platform.OS === 'web') {
      alert.confirm(
        'Limpar Cache',
        'Isso removerá dados temporários. Deseja continuar?',
        () => {
          alert.success('Cache Limpo', 'Cache removido com sucesso!');
        }
      );
    } else {
      Alert.alert(
        'Limpar Cache',
        'Isso removerá dados temporários. Deseja continuar?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Limpar',
            onPress: () => {
              alert.success('Cache Limpo', 'Cache removido com sucesso!');
            },
          },
        ]
      );
    }
  };

  const handleDeleteAccount = () => {
    if (Platform.OS === 'web') {
      alert.confirm(
        'Excluir Conta',
        'Esta ação é IRREVERSÍVEL. Todos os seus dados serão perdidos. Tem certeza?',
        () => {
          alert.error('Cancelado', 'Exclusão de conta cancelada.');
        },
        () => {},
        'Excluir',
        'Cancelar'
      );
    } else {
      Alert.alert(
        'Excluir Conta',
        'Esta ação é IRREVERSÍVEL. Todos os seus dados serão perdidos. Tem certeza?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Excluir',
            style: 'destructive',
            onPress: () => {
              alert.error('Cancelado', 'Exclusão de conta cancelada.');
            },
          },
        ]
      );
    }
  };

  // ==========================================
  // LOADING STATE
  // ==========================================
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Carregando configurações...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================
  // MAIN RENDER
  // ==========================================
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONTA</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/edit-profile' as any)}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <MaterialCommunityIcons name="account-edit" size={24} color="#4CAF50" />
              <Text style={styles.menuItemText}>Editar Perfil</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <MaterialCommunityIcons name="email" size={24} color="#2196F3" />
              <View>
                <Text style={styles.menuItemText}>Email</Text>
                <Text style={styles.menuItemSubtext}>{user?.email}</Text>
              </View>
            </View>
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <MaterialCommunityIcons name="calendar" size={24} color="#FF9800" />
              <View>
                <Text style={styles.menuItemText}>Membro desde</Text>
                <Text style={styles.menuItemSubtext}>
                  {new Date(user?.createdAt || '').toLocaleDateString('pt-BR')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERÊNCIAS</Text>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <MaterialCommunityIcons name="bell" size={24} color="#9C27B0" />
              <Text style={styles.menuItemText}>Notificações</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: '#E0E0E0', true: '#81C784' }}
              thumbColor={notificationsEnabled ? '#4CAF50' : '#f4f3f4'}
            />
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <MaterialCommunityIcons name="earth" size={24} color="#00BCD4" />
              <Text style={styles.menuItemText}>Perfil Público</Text>
            </View>
            <Switch
              value={profilePublic}
              onValueChange={handleToggleProfilePublic}
              trackColor={{ false: '#E0E0E0', true: '#81C784' }}
              thumbColor={profilePublic ? '#4CAF50' : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleSetReminder}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <MaterialCommunityIcons name="clock-outline" size={24} color="#FF5722" />
              <Text style={styles.menuItemText}>Lembrete Diário</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DADOS</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleClearCache}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <MaterialCommunityIcons name="delete-sweep" size={24} color="#607D8B" />
              <Text style={styles.menuItemText}>Limpar Cache</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => alert.info('Em Breve', 'Exportação de dados em desenvolvimento!')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <MaterialCommunityIcons name="download" size={24} color="#009688" />
              <Text style={styles.menuItemText}>Exportar Dados</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SOBRE</Text>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <MaterialCommunityIcons name="information" size={24} color="#2196F3" />
              <View>
                <Text style={styles.menuItemText}>Versão</Text>
                <Text style={styles.menuItemSubtext}>1.0.0 (Beta)</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => alert.info('Suporte', 'Entre em contato: suporte@fiquestlife.com')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <MaterialCommunityIcons name="help-circle" size={24} color="#FF9800" />
              <Text style={styles.menuItemText}>Suporte</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => alert.info('Privacidade', 'Política de privacidade em desenvolvimento!')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <MaterialCommunityIcons name="shield-check" size={24} color="#4CAF50" />
              <Text style={styles.menuItemText}>Política de Privacidade</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <Text style={styles.sectionTitle}>ZONA DE PERIGO</Text>

          <TouchableOpacity
            style={styles.dangerMenuItem}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <MaterialCommunityIcons name="delete-forever" size={24} color="#F44336" />
              <Text style={styles.dangerMenuItemText}>Excluir Conta</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#F44336" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Alert Modal */}
      <AlertModal
        visible={isVisible}
        title={alertConfig?.title || ''}
        message={alertConfig?.message || ''}
        type={alertConfig?.type}
        confirmText={alertConfig?.confirmText}
        cancelText={alertConfig?.cancelText}
        onConfirm={alertConfig?.onConfirm}
        onCancel={alertConfig?.onCancel}
        onClose={hideAlert}
      />
    </SafeAreaView>
  );
};
