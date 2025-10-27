import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Tag';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { styles } from '../styles/explore.styles';

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

