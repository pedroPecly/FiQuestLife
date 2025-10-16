import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Tag';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header
          title="Explorar"
          subtitle="Descubra novos desafios! 🔍"
        />

        <Card>
          <Tag
            icon="compass-outline"
            text="Em Desenvolvimento"
            backgroundColor="#FF9800"
          />

          <Text style={styles.title}>
            Página Explorar
          </Text>
          <Text style={styles.subtitle}>
            Esta página está em desenvolvimento. Em breve você poderá:
          </Text>

          <View style={styles.featureList}>
            <Text style={styles.featureItem}>🎯 Descobrir novos desafios</Text>
            <Text style={styles.featureItem}>🏆 Ver ranking de usuários</Text>
            <Text style={styles.featureItem}>🎁 Explorar recompensas</Text>
            <Text style={styles.featureItem}>👥 Conectar com amigos</Text>
            <Text style={styles.featureItem}>📊 Ver estatísticas globais</Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
});

