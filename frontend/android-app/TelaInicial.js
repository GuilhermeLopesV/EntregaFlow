import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import TelaLoja from './TelaLoja';
import TelaNotafiscal from './TelaNotafiscal';
import TelaHistorico from './TelaHistorico';

export default function TelaInicial() {
  const [tela, setTela] = useState('inicio');

  if (tela === 'loja') {
    return <TelaLoja aoNavegar={setTela} />;
  }

  if (tela === 'adicionar') {
    return <TelaNotafiscal aoNavegar={setTela} />;
  }

  if (tela === 'historico') {
    return <TelaHistorico aoNavegar={setTela} />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F8F6" />

      <View style={styles.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.date}>
                SEGUNDA, 02 DE NOVEMBRO
              </Text>
              <Text style={styles.greeting}>
                Bom dia, Usuário
              </Text>
            </View>

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>US</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.storeSelector}
            onPress={() => setTela('loja')}
          >
            <Text style={styles.storeIcon}>⌂</Text>
            <Text style={styles.storeName}>São Conrado</Text>
            <Text style={styles.chevron}>⌄</Text>
          </TouchableOpacity>

          <View style={styles.statsCard}>
            <View style={styles.statsHeader}>
              <Text style={styles.statsTitle}>Suas notas hoje</Text>
              <Text style={styles.receiptIcon}>▤</Text>
            </View>

            <View style={styles.numberContainer}>
              <Text style={styles.number}>24</Text>
              <Text style={styles.numberDescription}>
                notas contabilizadas
              </Text>
            </View>

            <View style={styles.statsDivider} />

            <View style={styles.lastUpdate}>
              <Text style={styles.checkIcon}>✓</Text>
              <Text style={styles.updateText}>
                Último envio contabilizado às 10:32
              </Text>
            </View>
          </View>

          
          <TouchableOpacity style={styles.pendingCard}>
            <Text style={styles.pendingIcon}>▧</Text>

            <View style={{ flex: 1 }}>
              <Text style={styles.pendingTitle}>
                3 fotos para enviar
              </Text>
              <Text style={styles.pendingDescription}>
                Ainda não incluídas na contagem.
              </Text>
            </View>

            <Text style={styles.pendingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setTela('adicionar')}
          >
            <Text style={styles.cameraIcon}>▣</Text>
            <Text style={styles.addButtonText}>
              Adicionar notas
            </Text>
          </TouchableOpacity>

          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>
              Últimos envios
            </Text>
            <TouchableOpacity onPress={() => setTela('historico')}>
              <Text style={styles.historyLink}>Ver histórico</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.historyItem}>
            <View style={styles.historyIconBox}>
              <Text style={styles.historyIcon}>▤</Text>
            </View>

            <View style={styles.historyInfo}>
              <Text style={styles.historyCount}>8 notas</Text>
              <Text style={styles.historyDate}>Hoje, às 10:32</Text>
            </View>

            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Contabilizadas</Text>
            </View>
          </View>

          <View style={styles.historyItem}>
            <View style={styles.historyIconBox}>
              <Text style={styles.historyIcon}>▤</Text>
            </View>

            <View style={styles.historyInfo}>
              <Text style={styles.historyCount}>16 notas</Text>
              <Text style={styles.historyDate}>Hoje, às 09:15</Text>
            </View>

            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Contabilizadas</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomMenu}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.activeIcon}>
              <Text style={styles.activeMenuIcon}>⌂</Text>
            </View>
            <Text style={styles.activeMenuText}>Início</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setTela('adicionar')}
          >
            <Text style={styles.menuIcon}>⊕</Text>
            <Text style={styles.menuText}>Adicionar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setTela('historico')}
          >
            <Text style={styles.menuIcon}>▥</Text>
            <Text style={styles.menuText}>Histórico</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setTela('loja')}
          >
            <Text style={styles.menuIcon}>⌂</Text>
            <Text style={styles.menuText}>Loja</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F6F8F6',
  },
  screen: {
    flex: 1,
    backgroundColor: '#F6F8F6',
  },
  content: {
    paddingHorizontal: '8%',
    paddingTop: 23,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  date: {
    color: '#858D8B',
    fontSize: 13,
    marginBottom: 12,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: '#142C29',
    letterSpacing: -1,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 33,
    backgroundColor: '#E4F1ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  avatarText: {
    color: '#176F63',
    fontSize: 18,
    fontWeight: '800',
  },
  storeSelector: {
    height: 62,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E0E5E2',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  storeIcon: {
    color: '#176F63',
    fontSize: 24,
    marginRight: 13,
  },
  storeName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#172E2B',
  },
  chevron: {
    color: '#78817F',
    fontSize: 23,
  },
  statsCard: {
    backgroundColor: '#10554D',
    borderRadius: 25,
    padding: 23,
    marginBottom: 23,
    minHeight: 257,
    justifyContent: 'space-between',
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsTitle: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  receiptIcon: {
    color: '#D2E8E0',
    fontSize: 24,
  },
  numberContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 10,
    marginBottom: 15,
  },
  number: {
    color: '#FFFFFF',
    fontSize: 85,
    fontWeight: '300',
    lineHeight: 95,
  },
  numberDescription: {
    color: '#C5DAD4',
    fontSize: 14,
    marginLeft: 8,
    marginBottom: 11,
    flexShrink: 1,
  },
  statsDivider: {
    height: 1,
    backgroundColor: '#39776E',
    marginBottom: 13,
  },
  lastUpdate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkIcon: {
    color: '#D2E8E0',
    fontSize: 18,
    fontWeight: 'bold',
  },
  updateText: {
    color: '#C5DAD4',
    fontSize: 13,
    flexShrink: 1,
  },
  pendingCard: {
    minHeight: 92,
    backgroundColor: '#F8F0DC',
    borderRadius: 23,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  pendingIcon: {
    color: '#92713E',
    fontSize: 30,
    marginRight: 12,
  },
  pendingTitle: {
    color: '#263A32',
    fontSize: 15,
    marginBottom: 7,
  },
  pendingDescription: {
    color: '#927A53',
    fontSize: 13,
  },
  pendingArrow: {
    color: '#92713E',
    fontSize: 26,
    marginLeft: 5,
  },
  addButton: {
    height: 69,
    backgroundColor: '#176F63',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    gap: 12,
  },
  cameraIcon: {
    color: '#FFFFFF',
    fontSize: 22,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyTitle: {
    color: '#172E2B',
    fontSize: 19,
  },
  historyLink: {
    color: '#176F63',
    fontSize: 13,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyIconBox: {
    width: 50,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyIcon: {
    color: '#176F63',
    fontSize: 25,
  },
  historyInfo: {
    flex: 1,
  },
  historyCount: {
    color: '#172E2B',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 5,
  },
  historyDate: {
    color: '#858D8B',
    fontSize: 13,
  },
  statusBadge: {
    backgroundColor: '#E5F2EE',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  statusText: {
    color: '#176F63',
    fontSize: 13,
    fontWeight: '700',
  },
  bottomMenu: {
    height: 69,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E4E7E5',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  menuItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  activeIcon: {
    backgroundColor: '#E4F2ED',
    width: 56,
    height: 32,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeMenuIcon: {
    color: '#176F63',
    fontSize: 23,
  },
  activeMenuText: {
    color: '#176F63',
    fontSize: 13,
    fontWeight: '700',
  },
  menuIcon: {
    color: '#78817F',
    fontSize: 24,
  },
  menuText: {
    color: '#78817F',
    fontSize: 13,
  },
});