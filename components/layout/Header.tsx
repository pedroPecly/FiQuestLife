import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getUnreadCount } from '../../services/notificationCenter';
import { NotificationBell, NotificationFeed } from '../ui';

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
    const count = await getUnreadCount();
    setUnreadCount(count);
  }, []);

  useEffect(() => {
    loadUnreadCount();
    
    // Recarrega a cada 10 segundos
    const interval = setInterval(loadUnreadCount, 10000);
    
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

      <NotificationFeed
        visible={feedVisible}
        onClose={() => setFeedVisible(false)}
        onBadgeCountChange={setUnreadCount}
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
    top: 0,
  },
});

