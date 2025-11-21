import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { authStorage } from '../../services/auth';
import { getLocalUnreadCount } from '../../services/localNotificationStorage';
import { NotificationBell, NotificationsModal } from '../ui';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showNotifications?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'FiQuestLife',
  subtitle = 'Transforme sua saúde em uma aventura épica!',
  showNotifications = true,
}) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [feedVisible, setFeedVisible] = useState(false);

  // Carrega count de notificações não lidas
  const loadUnreadCount = useCallback(async () => {
    try {
      // Verificar se há usuário logado
      const user = await authStorage.getUser();
      
      if (!user) {
        // Sem usuário = não logado, não mostra notificações
        setUnreadCount(0);
        return;
      }
      
      // Busca contagem local
      const count = await getLocalUnreadCount(user.id);
      setUnreadCount(count);
    } catch (error: any) {
      console.error('[HEADER] Erro ao carregar notificações:', error);
      // Define como 0 em caso de erro
      setUnreadCount(0);
    }
  }, []);

  useEffect(() => {
    loadUnreadCount();
    
    // Recarrega a cada 5 segundos para notificações mais rápidas
    const interval = setInterval(loadUnreadCount, 5000);
    
    return () => clearInterval(interval);
  }, [loadUnreadCount]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        
        {showNotifications && (
          <View style={styles.notificationContainer}>
            <NotificationBell
              unreadCount={unreadCount}
              onPress={() => setFeedVisible(true)}
              size={26}
              color="#2F4F4F"
            />
          </View>
        )}
      </View>

      <NotificationsModal
        visible={feedVisible}
        onClose={() => {
          setFeedVisible(false);
          // Recarrega contador quando fecha o modal
          loadUnreadCount();
        }}
        onUnreadCountChange={setUnreadCount}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingTop: 10, // Adiciona espaço superior para não ficar muito encima
  },
  content: {
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2F4F4F',
    marginTop: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  notificationContainer: {
    position: 'absolute',
    right: 10,
    top: 10, // Ajusta posição para acompanhar o paddingTop do container
  },
});

