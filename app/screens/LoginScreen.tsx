// app/screens/LoginScreen.tsx

import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Header } from '../../components/layout/Header';
import { AlertModal } from '../../components/ui/AlertModal';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DateInput } from '../../components/ui/DateInput';
import { Input } from '../../components/ui/Input';
import { Tag } from '../../components/ui/Tag';
import { useAlert } from '../../hooks/useAlert';
import { authService } from '../../services/api';
import { authStorage } from '../../services/auth';
import { styles } from '../styles/login.styles';

const LoginScreen = () => {
  const { alert, alertConfig, isVisible, hideAlert } = useAlert();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState(''); // Nome completo (obrigatório)
  const [birthDate, setBirthDate] = useState(''); // Data de nascimento (obrigatório)
  const [identifier, setIdentifier] = useState(''); // Para login (email ou username)
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Confirmação de senha
  const [isLogin, setIsLogin] = useState(true); // true = Login, false = Cadastro
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true); // Verificando login automático

  // ============================================
  // LOGIN AUTOMÁTICO (PERSISTENTE)
  // ============================================
  useEffect(() => {
    checkAutoLogin();
  }, []);

  const checkAutoLogin = async () => {
    try {
      console.log('🔍 Verificando auto-login...');
      
      // Verifica se foi um logout manual
      const manualLogout = await AsyncStorage.getItem('@FiQuestLife:manual_logout');
      if (manualLogout === 'true') {
        // Remove a flag e não faz auto-login
        await AsyncStorage.removeItem('@FiQuestLife:manual_logout');
        console.log('🚪 Logout manual detectado, não fazendo auto-login');
        setCheckingAuth(false);
        return;
      }

      // Verifica se já existe token salvo
      const isLoggedIn = await authStorage.isLoggedIn();
      console.log('🔑 Token existe?', isLoggedIn);
      
      if (isLoggedIn) {
        // Tenta buscar dados do usuário para validar o token
        const response = await authService.getMe();
        
        if (response.success && response.data) {
          // Token válido! Redireciona direto para o app
          console.log('✅ Login automático bem-sucedido');
          router.replace('/(tabs)');
        } else {
          // Token inválido ou expirado, limpa o storage
          console.log('⚠️ Token inválido, fazendo logout');
          await authStorage.logout();
        }
      }
    } catch (error) {
      console.log('⚠️ Erro no login automático, usuário precisa logar');
      // Se der erro, apenas deixa usuário fazer login manual
      await authStorage.logout();
    } finally {
      setCheckingAuth(false);
    }
  };

  // Validação de email simples
  const validateEmail = (email: string) => {
    return email.includes('@') && email.length > 3;
  };

  // Validação de username
  const validateUsername = (username: string) => {
    return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
  };

  // Validação de senha
  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  // Converte data do formato brasileiro para ISO
  const convertToISODate = (dateString: string): string => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  // Validação de data de nascimento
  const validateBirthDate = (dateString: string) => {
    if (!dateString || dateString.length !== 10) return false;
    
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateString.match(regex);
    
    if (!match) return false;
    
    const [, day, month, year] = match;
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    
    // Verifica ranges básicos
    if (monthNum < 1 || monthNum > 12) return false;
    if (dayNum < 1 || dayNum > 31) return false;
    if (yearNum < 1900 || yearNum > new Date().getFullYear()) return false;
    
    // Verifica dias do mês
    const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
    if (dayNum > daysInMonth) return false;
    
    // Verifica se não é data futura
    const birthDate = new Date(yearNum, monthNum - 1, dayNum);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return birthDate <= today;
  };

  // Função para fazer login
  const handleLogin = async () => {
    // Validações
    if (!identifier || identifier.trim().length === 0) {
      alert.error('Erro de Validação', 'Digite seu email ou nome de usuário!');
      return;
    }
    if (!validatePassword(password)) {
      alert.error('Erro de Validação', 'A senha deve ter pelo menos 6 caracteres!');
      return;
    }

    setLoading(true);
    
    try {
      const result = await authService.login(identifier, password);
      
      if (result.success) {
        // Salva o token e dados do usuário
        await authStorage.saveAuth(result.data.token, result.data.user);
        
        // Navega para a tela principal
        router.replace('/(tabs)');
      } else {
        // Exibe erro específico do servidor
        alert.error(
          'Erro no Login',
          result.error || 'Email/usuário ou senha inválidos!'
        );
      }
    } catch (error: any) {
      // Erro de conexão
      console.error('Erro de conexão:', error); // Debug
      alert.error(
        'Erro de Conexão',
        'Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Função para cadastrar
  const handleRegister = async () => {
    // Validações
    if (!validateEmail(email)) {
      alert.error('Erro de Validação', 'Digite um e-mail válido!');
      return;
    }
    if (!validateUsername(username)) {
      alert.error('Erro de Validação', 'Nome de usuário deve ter pelo menos 3 caracteres e conter apenas letras, números e _');
      return;
    }
    if (!name || name.trim().length === 0) {
      alert.error('Erro de Validação', 'Nome completo é obrigatório!');
      return;
    }
    if (!birthDate || birthDate.trim().length === 0) {
      alert.error('Erro de Validação', 'Data de nascimento é obrigatória!');
      return;
    }
    if (!validateBirthDate(birthDate)) {
      alert.error('Erro de Validação', 'Data de nascimento deve estar no formato DD/MM/YYYY e ser válida!');
      return;
    }
    if (!validatePassword(password)) {
      alert.error('Erro de Validação', 'A senha deve ter pelo menos 6 caracteres!');
      return;
    }
    if (password !== confirmPassword) {
      alert.error('Erro de Validação', 'As senhas não coincidem!');
      return;
    }

    // Previne múltiplas requisições
    if (loading) {
      return;
    }

    setLoading(true);
    
    try {
      const result = await authService.register(
        email, 
        username, 
        password,
        name,
        convertToISODate(birthDate)
      );
      
      if (result.success) {
        // Salva o token e dados do usuário
        await authStorage.saveAuth(result.data.token, result.data.user);
        
        // Navega direto sem Alert para evitar problemas
        router.replace('/(tabs)');
      } else {
        // Tratamento especial para erros de validação (array)
        if (Array.isArray(result.error)) {
          const errorMessages = result.error.map((err: any) => err.message).join('\n');
          alert.error('Erro no Cadastro', errorMessages);
        } else {
          alert.error(
            'Erro no Cadastro',
            result.error || 'Erro ao criar conta. Tente novamente.'
          );
        }
      }
    } catch (error: any) {
      alert.error(
        'Erro de Conexão',
        'Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // LOADING DE VERIFICAÇÃO AUTOMÁTICA
  // ============================================
  if (checkingAuth) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 18, color: '#666', marginBottom: 10 }}>
          Verificando login...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <StatusBar barStyle="dark-content" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
      >
        <Header showNotifications={false} />

      <Card>
        <Tag
          icon="star-circle"
          text={isLogin ? 'Missão de Retorno' : 'Missão de Boas-Vindas'}
        />
        
        <Text style={styles.cardTitle}>
          {isLogin ? 'Entrar na Jornada' : 'Iniciar Jornada'}
        </Text>
        <Text style={styles.cardSubtitle}>
          {isLogin ? 'Entre com sua conta para continuar' : 'Crie sua conta para começar sua aventura'}
        </Text>

        <Input
          icon="email-outline"
          placeholder={isLogin ? "Email ou nome de usuário" : "Seu e-mail"}
          keyboardType={isLogin ? "default" : "email-address"}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
          value={isLogin ? identifier : email}
          onChangeText={isLogin ? setIdentifier : setEmail}
          editable={!loading}
        />

        {!isLogin && (
          <>
            <Input
              icon="account-outline"
              placeholder="Nome de usuário (letras, números e _)"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              textContentType="none"
              value={username}
              onChangeText={setUsername}
              editable={!loading}
            />

            <Input
              icon="card-account-details-outline"
              placeholder="Nome completo (obrigatório)"
              autoCapitalize="words"
              autoComplete="off"
              autoCorrect={false}
              textContentType="none"
              value={name}
              onChangeText={setName}
              editable={!loading}
            />

            <DateInput
              value={birthDate}
              onChangeText={setBirthDate}
              placeholder="Data de nascimento (DD/MM/YYYY) - obrigatório"
              editable={!loading}
            />
          </>
        )}

        <Input
          icon="lock-outline"
          placeholder={isLogin ? "Sua senha" : "Sua senha (mínimo 6 caracteres)"}
          secureTextEntry
          autoComplete="off"
          autoCorrect={false}
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />

        {!isLogin && (
          <Input
            icon="lock-check-outline"
            placeholder="Confirme sua senha"
            secureTextEntry
            autoComplete="off"
            autoCorrect={false}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            editable={!loading}
          />
        )}

        <Button
          title={isLogin ? 'Entrar' : 'Criar Conta'}
          icon="crown"
          onPress={isLogin ? handleLogin : handleRegister}
          disabled={loading}
          loading={loading}
        />

        {/* Alternar entre Login e Cadastro */}
        <TouchableOpacity 
          style={styles.switchModeButton}
          onPress={() => setIsLogin(!isLogin)}
          disabled={loading}
        >
          <Text style={styles.switchModeText}>
            {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
          </Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.socialButton} disabled={loading}>
          <FontAwesome name="google" size={20} color="#DB4437" />
          <Text style={styles.socialButtonText}>Entrar com Google</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.socialButton} disabled={loading}>
          <FontAwesome name="apple" size={22} color="#000000" />
          <Text style={styles.socialButtonText}>Entrar com Apple</Text>
        </TouchableOpacity>
      </Card>

      <Text style={styles.disclaimer}>
        Ao {isLogin ? 'entrar' : 'criar uma conta'}, você concorda com nossos <Text style={styles.link}>Termos de Uso</Text> e <Text style={styles.link}>Política de Privacidade</Text>
      </Text>
      </ScrollView>

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
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
