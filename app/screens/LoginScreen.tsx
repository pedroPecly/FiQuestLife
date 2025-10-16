// app/screens/LoginScreen.tsx

import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Header } from '../../components/layout/Header';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Tag } from '../../components/ui/Tag';
import { authService } from '../../services/api';
import { authStorage } from '../../services/auth';
import { styles } from '../styles/login.styles';

// Função auxiliar para mostrar alertas compatíveis com Web e Mobile
const showAlert = (title: string, message: string) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message, [{ text: 'OK', style: 'default' }]);
  }
};

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState(''); // Nome completo (opcional)
  const [identifier, setIdentifier] = useState(''); // Para login (email ou username)
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // true = Login, false = Cadastro
  const [loading, setLoading] = useState(false);

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

  // Função para fazer login
  const handleLogin = async () => {
    // Validações
    if (!identifier || identifier.trim().length === 0) {
      showAlert('❌ Erro', 'Digite seu email ou nome de usuário!');
      return;
    }
    if (!validatePassword(password)) {
      showAlert('❌ Erro', 'A senha deve ter pelo menos 6 caracteres!');
      return;
    }

    setLoading(true);
    
    try {
      const result = await authService.login(identifier, password);
      
      console.log('Login result:', result); // Debug
      
      if (result.success) {
        // Salva o token e dados do usuário
        await authStorage.saveAuth(result.data.token, result.data.user);
        
        // Navega para a tela principal
        router.replace('/(tabs)');
      } else {
        // Exibe erro específico do servidor
        console.log('Erro do servidor:', result.error); // Debug
        showAlert(
          '🔒 Erro no Login', 
          result.error || 'Email/usuário ou senha inválidos!'
        );
      }
    } catch (error: any) {
      // Erro de conexão
      console.error('Erro de conexão:', error); // Debug
      showAlert(
        '🌐 Erro de Conexão', 
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
      showAlert('❌ Erro', 'Digite um e-mail válido!');
      return;
    }
    if (!validateUsername(username)) {
      showAlert('❌ Erro', 'Nome de usuário deve ter pelo menos 3 caracteres e conter apenas letras, números e _');
      return;
    }
    if (!validatePassword(password)) {
      showAlert('❌ Erro', 'A senha deve ter pelo menos 6 caracteres!');
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
        name || undefined  // Envia apenas se tiver valor
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
          showAlert('❌ Erro no Cadastro', errorMessages);
        } else {
          showAlert(
            '❌ Erro no Cadastro', 
            result.error || 'Erro ao criar conta. Tente novamente.'
          );
        }
      }
    } catch (error: any) {
      showAlert(
        '🌐 Erro de Conexão', 
        'Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Header />

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
          value={isLogin ? identifier : email}
          onChangeText={isLogin ? setIdentifier : setEmail}
          editable={!loading}
          returnKeyType={isLogin ? "next" : "next"}
          onSubmitEditing={() => {}}
        />

        {!isLogin && (
          <>
            <Input
              icon="account-outline"
              placeholder="Nome de usuário (letras, números e _)"
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
              editable={!loading}
              returnKeyType="next"
              onSubmitEditing={() => {}}
            />

            <Input
              icon="card-account-details-outline"
              placeholder="Nome completo (opcional)"
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
              editable={!loading}
              returnKeyType="next"
              onSubmitEditing={() => {}}
            />
          </>
        )}

        <Input
          icon="lock-outline"
          placeholder="Sua senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
          returnKeyType="done"
          onSubmitEditing={isLogin ? handleLogin : handleRegister}
        />

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
    </SafeAreaView>
  );
};

export default LoginScreen;
