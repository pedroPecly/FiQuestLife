/**
 * ============================================
 * USER SCREEN - TELA DE USUÁRIO
 * ============================================
 * 
 * Tela de perfil e configurações do usuário com:
 * - Notificações
 * - Perfil público/privado
 * - Lembrete diário
 * - Informações da conta
 * - Gerenciamento de dados
 * 
 * @created 17 de outubro de 2025
 * @updated 27 de outubro de 2025 - Renomeada de Settings para User
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { AlertModal, SettingsMenuItem } from '../../components/ui';
import { useAlert } from '../../hooks/useAlert';
import { authService } from '../../services/api';
import { authStorage } from '../../services/auth';
import {
    getNotificationsEnabled,
    setNotificationsEnabled as saveNotificationsPreference,
} from '../../services/notifications';
import type { User } from '../../types/user';
import { styles } from '../styles/settings.styles';

export default function SettingsScreen() {
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
  // LIFECYCLE - Recarrega ao focar na tela
  // ==========================================
  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

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

      // Token é injetado automaticamente pelo interceptor
      const result = await authService.getMe();

      if (result.success && result.data) {
        setUser(result.data);
        
        // Carrega preferência de notificações do AsyncStorage
        const notifEnabled = await getNotificationsEnabled();
        setNotificationsEnabled(notifEnabled);
        
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
    try {
      setNotificationsEnabled(value);
      
      // Salva preferência e agenda/cancela notificações
      await saveNotificationsPreference(value);
      
      alert.success(
        'Notificações',
        value 
          ? 'Notificações ativadas! Você receberá lembretes diários às 9h e 21h.' 
          : 'Notificações desativadas. Você não receberá mais lembretes.'
      );
    } catch (error) {
      console.error('Erro ao atualizar notificações:', error);
      setNotificationsEnabled(!value); // Reverte se falhar
      alert.error('Erro', 'Não foi possível atualizar as notificações.');
    }
  };

  const handleToggleProfilePublic = async (value: boolean) => {
    try {
      setSaving(true);
      setProfilePublic(value);

      // Atualiza no backend
      const result = await authService.updateProfile({
        profilePublic: value,
      });

      if (result.success && result.data) {
        // Atualiza usuário local
        setUser(result.data);
        
        // Atualiza também no storage
        const token = await authStorage.getToken();
        if (token) {
          await authStorage.saveAuth(token, result.data);
        }

        alert.success(
          'Atualizado!',
          value ? 'Seu perfil agora é público' : 'Seu perfil agora é privado'
        );
      } else {
        // Reverte o toggle em caso de erro
        setProfilePublic(!value);
        alert.error('Erro', 'Não foi possível atualizar a privacidade do perfil.');
      }
    } catch (error) {
      // Reverte o toggle em caso de erro
      setProfilePublic(!value);
      alert.error('Erro', 'Erro ao atualizar privacidade do perfil.');
    } finally {
      setSaving(false);
    }
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

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      alert.confirm(
        'Sair da Conta',
        'Deseja realmente sair da sua conta?',
        async () => {
          try {
            const logoutResult = await authStorage.logout();
            if (logoutResult) {
              // Força navegação para tela de login com reset completo da stack
              if (Platform.OS === 'web') {
                window.location.href = '/';
              } else {
                router.replace('/' as any);
              }
            } else {
              alert.error('Erro', 'Não foi possível sair. Tente novamente.');
            }
          } catch (error) {
            alert.error('Erro', 'Não foi possível sair. Tente novamente.');
          }
        },
        () => {},
        'Sair',
        'Cancelar'
      );
    } else {
      Alert.alert(
        'Sair da Conta',
        'Deseja realmente sair da sua conta?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Sair',
            style: 'destructive',
            onPress: async () => {
              try {
                const logoutResult = await authStorage.logout();
                if (logoutResult) {
                  // Força navegação para tela de login
                  router.replace('/' as any);
                } else {
                  alert.error('Erro', 'Não foi possível sair. Tente novamente.');
                }
              } catch (error) {
                alert.error('Erro', 'Não foi possível sair. Tente novamente.');
              }
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
      <StatusBar barStyle="dark-content" backgroundColor="#F0F8FF" />

      {/* Header Simples */}
      <View style={styles.headerSimple}>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONTA</Text>

          <SettingsMenuItem
            type="clickable"
            icon="account-edit"
            iconColor="#4CAF50"
            label="Editar Perfil"
            onPress={() => router.push('/edit-profile' as any)}
          />

          <SettingsMenuItem
            type="info"
            icon="email"
            iconColor="#2196F3"
            label="Email"
            subtitle={user?.email}
          />

          <SettingsMenuItem
            type="info"
            icon="calendar"
            iconColor="#FF9800"
            label="Membro desde"
            subtitle={new Date(user?.createdAt || '').toLocaleDateString('pt-BR')}
            isLast
          />
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERÊNCIAS</Text>

          <SettingsMenuItem
            type="toggle"
            icon="bell"
            iconColor="#9C27B0"
            label="Notificações"
            switchValue={notificationsEnabled}
            onSwitchChange={handleToggleNotifications}
          />

          <SettingsMenuItem
            type="toggle"
            icon="earth"
            iconColor="#00BCD4"
            label="Perfil Público"
            switchValue={profilePublic}
            onSwitchChange={handleToggleProfilePublic}
          />

          <SettingsMenuItem
            type="clickable"
            icon="clock-outline"
            iconColor="#FF5722"
            label="Lembrete Diário"
            onPress={handleSetReminder}
            isLast
          />
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DADOS</Text>

          <SettingsMenuItem
            type="clickable"
            icon="delete-sweep"
            iconColor="#607D8B"
            label="Limpar Cache"
            onPress={handleClearCache}
          />

          <SettingsMenuItem
            type="clickable"
            icon="download"
            iconColor="#009688"
            label="Exportar Dados"
            onPress={() => alert.info('Em Breve', 'Exportação de dados em desenvolvimento!')}
            isLast
          />
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SOBRE</Text>

          <SettingsMenuItem
            type="info"
            icon="information"
            iconColor="#2196F3"
            label="Versão"
            subtitle="v0.9.5 (Beta)"
          />

          <SettingsMenuItem
            type="clickable"
            icon="help-circle"
            iconColor="#FF9800"
            label="Suporte"
            onPress={() => alert.info('Suporte', 'tem contato nao pae')}
          />

          <SettingsMenuItem
            type="clickable"
            icon="shield-check"
            iconColor="#4CAF50"
            label="Política de Privacidade"
            onPress={() => alert.info('Privacidade', 'Política de privacidade em desenvolvimento!')}
            isLast
          />
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="logout" size={24} color="#F44336" />
            <Text style={styles.logoutButtonText}>Sair da Conta</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <Text style={styles.sectionTitle}>ZONA DE PERIGO</Text>

          <SettingsMenuItem
            type="clickable"
            icon="delete-forever"
            iconColor="#F44336"
            label="Excluir Conta"
            onPress={handleDeleteAccount}
            labelStyle={styles.dangerMenuItemText}
            isLast
          />
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
}
