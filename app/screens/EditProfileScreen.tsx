/**
 * ============================================
 * EDIT PROFILE SCREEN - EDIÇÃO DE PERFIL
 * ============================================
 * 
 * Tela profissional para editar dados do perfil:
 * - Nome completo
 * - Username
 * - Bio (opcional)
 * - Data de nascimento
 * - Avatar (futuro: upload de imagem)
 * 
 * @created 17 de outubro de 2025
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AlertModal } from '../../components/ui';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { DateInput } from '../../components/ui/DateInput';
import { Input } from '../../components/ui/Input';
import { useAlert } from '../../hooks/useAlert';
import { authService } from '../../services/api';
import { authStorage } from '../../services/auth';
import type { User } from '../../types/user';
import { formatDateForDisplay, parseDateFromInput } from '../../utils/dateUtils';
import { validateName, validateUsername } from '../../utils/validators';
import { styles } from '../styles/edit-profile.styles';

export const EditProfileScreen = () => {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [birthDate, setBirthDate] = useState('');

  // Validation errors
  const [nameError, setNameError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [birthDateError, setBirthDateError] = useState('');

  const { alert, isVisible, alertConfig, hideAlert } = useAlert();

  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================
  
  /**
   * Gera iniciais a partir do nome
   * @param fullName - Nome completo
   * @returns Iniciais (ex: "João Silva" -> "JS")
   */
  const getInitials = (fullName: string): string => {
    if (!fullName || fullName.trim().length === 0) {
      return 'U'; // User
    }
    
    const parts = fullName.trim().split(' ').filter(p => p.length > 0);
    
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    
    // Pega primeira letra do primeiro e último nome
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

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

      // Token é injetado automaticamente pelo interceptor
      const result = await authService.getMe();

      if (result.success && result.data) {
        console.log('✅ Dados do usuário carregados:', result.data);
        
        setUser(result.data);
        setName(result.data.name || '');
        setUsername(result.data.username || '');
        setBio(result.data.bio || '');
        
        // Formatar data de nascimento
        const formattedDate = formatDateForDisplay(result.data.birthDate);
        console.log('📅 Data original:', result.data.birthDate);
        console.log('📅 Data formatada:', formattedDate);
        setBirthDate(formattedDate);
      } else {
        console.error('❌ Erro ao carregar dados:', result);
        alert.error('Erro', 'Não foi possível carregar seus dados.');
        router.back();
      }
    } catch (error) {
      console.error('❌ Erro ao carregar perfil:', error);
      alert.error('Erro', 'Erro ao carregar perfil.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // VALIDATION
  // ==========================================
  const validateForm = (): boolean => {
    let isValid = true;

    // Validar nome
    const nameValidation = validateName(name);
    if (!nameValidation.isValid) {
      setNameError(nameValidation.error || '');
      isValid = false;
    } else {
      setNameError('');
    }

    // Validar username
    if (!validateUsername(username)) {
      setUsernameError('Username deve ter pelo menos 3 caracteres (apenas letras, números e _)');
      isValid = false;
    } else {
      setUsernameError('');
    }

    // Validar data de nascimento
    const parsedDate = parseDateFromInput(birthDate);
    if (!parsedDate) {
      setBirthDateError('Data inválida');
      isValid = false;
    } else {
      setBirthDateError('');
    }

    return isValid;
  };

  // ==========================================
  // SAVE CHANGES
  // ==========================================
  const handleSave = async () => {
    // Validar formulário
    if (!validateForm()) {
      alert.error('Dados Inválidos', 'Por favor, corrija os erros antes de salvar.');
      return;
    }

    try {
      setSaving(true);
      const token = await authStorage.getToken();

      if (!token) {
        router.replace('/');
        return;
      }

      // Parsear data para formato ISO
      const parsedDate = parseDateFromInput(birthDate);
      if (!parsedDate) {
        alert.error('Erro', 'Data de nascimento inválida');
        return;
      }

      // Chamar API para atualizar perfil
      // Token é injetado automaticamente pelo interceptor
      const result = await authService.updateProfile({
        name: name.trim(),
        username: username.trim(),
        bio: bio.trim() || undefined,
        birthDate: parsedDate.toISOString(),
      });

      if (result.success) {
        alert.success(
          'Perfil Atualizado!',
          'Suas informações foram atualizadas com sucesso.',
          () => router.back()
        );
      } else {
        alert.error(
          'Erro ao Salvar',
          result.error || 'Não foi possível atualizar seu perfil.'
        );
      }

    } catch (error: any) {
      console.error('❌ Erro ao salvar perfil:', error);
      alert.error(
        'Erro ao Salvar',
        'Não foi possível atualizar seu perfil. Tente novamente.'
      );
    } finally {
      setSaving(false);
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
          <Text style={styles.loadingText}>Carregando perfil...</Text>
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
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <Avatar 
              initials={getInitials(name)}
              size={100} 
            />
            <TouchableOpacity
              style={styles.changeAvatarButton}
              activeOpacity={0.7}
              onPress={() => alert.info('Em Breve', 'Upload de foto estará disponível em breve!')}
            >
              <MaterialCommunityIcons name="camera" size={20} color="#4CAF50" />
              <Text style={styles.changeAvatarText}>Alterar Foto</Text>
            </TouchableOpacity>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Nome */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome Completo *</Text>
              <Input
                icon="account"
                placeholder="Digite seu nome completo"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                returnKeyType="next"
              />
              {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
            </View>

            {/* Username */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username *</Text>
              <Input
                icon="at"
                placeholder="Digite seu username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                returnKeyType="next"
              />
              {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
              <Text style={styles.helperText}>Apenas letras, números e _ (underscore)</Text>
            </View>

            {/* Bio */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bio</Text>
              <Input
                icon="text"
                placeholder="Conte um pouco sobre você..."
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={3}
              />
              <Text style={styles.helperText}>Máximo 200 caracteres</Text>
            </View>

            {/* Data de Nascimento */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Data de Nascimento *</Text>
              <DateInput
                value={birthDate}
                onChangeText={setBirthDate}
                placeholder="DD/MM/AAAA"
                returnKeyType="done"
              />
              {birthDateError ? <Text style={styles.errorText}>{birthDateError}</Text> : null}
            </View>

            {/* Info Box */}
            <View style={styles.infoBox}>
              <MaterialCommunityIcons name="information" size={20} color="#2196F3" />
              <Text style={styles.infoText}>
                Email não pode ser alterado. Entre em contato com o suporte se necessário.
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              title={saving ? 'Salvando...' : 'Salvar Alterações'}
              onPress={handleSave}
              disabled={saving}
              loading={saving}
            />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
              disabled={saving}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
