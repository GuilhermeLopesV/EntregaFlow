
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

export default function TelaInicial() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F8F6" />

      <View style={styles.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* CABEÇALHO */}
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

          {/* LOJA */}
          <TouchableOpacity style={styles.storeSelector}>
            <Text style={styles.storeIcon}>⌂</Text>
            <Text style={styles.storeName}>São Conrado</Text>
            <Text style={styles.chevron}>⌄</Text>
          </TouchableOpacity>

          {/* CONTAGEM DE NOTAS */}
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

          {/* FOTOS PENDENTES */}
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

          {/* ADICIONAR NOTAS */}
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.cameraIcon}>▣</Text>
            <Text style={styles.addButtonText}>
              Adicionar notas
            </Text>
          </TouchableOpacity>

          {/* ÚLTIMOS ENVIOS */}
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>
              Últimos envios
            </Text>
            <TouchableOpacity>
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

        {/* MENU INFERIOR */}
        <View style={styles.bottomMenu}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.activeIcon}>
              <Text style={styles.activeMenuIcon}>⌂</Text>
            </View>
            <Text style={styles.activeMenuText}>Início</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>⊕</Text>
            <Text style={styles.menuText}>Adicionar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>▥</Text>
            <Text style={styles.menuText}>Histórico</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
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
    paddingTop: 35,
    paddingBottom: 25,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 48,
  },
  date: {
    color: '#858D8B',
    fontSize: 17,
    marginBottom: 18,
  },
  greeting: {
    fontSize: 35,
    fontWeight: '800',
    color: '#142C29',
    letterSpacing: -1,
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 50,
    backgroundColor: '#E4F1ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  avatarText: {
    color: '#176F63',
    fontSize: 26,
    fontWeight: '800',
  },
  storeSelector: {
    height: 94,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E0E5E2',
    borderRadius: 23,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 36,
  },
  storeIcon: {
    color: '#176F63',
    fontSize: 36,
    marginRight: 20,
  },
  storeName: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#172E2B',
  },
  chevron: {
    color: '#78817F',
    fontSize: 34,
  },
  statsCard: {
    backgroundColor: '#10554D',
    borderRadius: 38,
    padding: 35,
    marginBottom: 35,
    minHeight: 390,
    justifyContent: 'space-between',
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsTitle: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  receiptIcon: {
    color: '#D2E8E0',
    fontSize: 36,
  },
  numberContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 15,
    marginBottom: 22,
  },
  number: {
    color: '#FFFFFF',
    fontSize: 125,
    fontWeight: '300',
    lineHeight: 140,
  },
  numberDescription: {
    color: '#C5DAD4',
    fontSize: 21,
    marginLeft: 12,
    marginBottom: 16,
    flexShrink: 1,
  },
  statsDivider: {
    height: 1.5,
    backgroundColor: '#39776E',
    marginBottom: 20,
  },
  lastUpdate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkIcon: {
    color: '#D2E8E0',
    fontSize: 27,
    fontWeight: 'bold',
  },
  updateText: {
    color: '#C5DAD4',
    fontSize: 17,
    flexShrink: 1,
  },
  pendingCard: {
    minHeight: 140,
    backgroundColor: '#F8F0DC',
    borderRadius: 35,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginBottom: 36,
  },
  pendingIcon: {
    color: '#92713E',
    fontSize: 44,
    marginRight: 18,
  },
  pendingTitle: {
    color: '#263A32',
    fontSize: 22,
    marginBottom: 10,
  },
  pendingDescription: {
    color: '#927A53',
    fontSize: 17,
  },
  pendingArrow: {
    color: '#92713E',
    fontSize: 38,
    marginLeft: 8,
  },
  addButton: {
    height: 104,
    backgroundColor: '#176F63',
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 45,
    gap: 18,
  },
  cameraIcon: {
    color: '#FFFFFF',
    fontSize: 32,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 25,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  historyTitle: {
    color: '#172E2B',
    fontSize: 28,
  },
  historyLink: {
    color: '#176F63',
    fontSize: 18,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  historyIconBox: {
    width: 75,
    height: 75,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },
  historyIcon: {
    color: '#176F63',
    fontSize: 37,
  },
  historyInfo: {
    flex: 1,
  },
  historyCount: {
    color: '#172E2B',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 7,
  },
  historyDate: {
    color: '#858D8B',
    fontSize: 18,
  },
  statusBadge: {
    backgroundColor: '#E5F2EE',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 30,
  },
  statusText: {
    color: '#176F63',
    fontSize: 15,
    fontWeight: '700',
  },
  bottomMenu: {
    height: 105,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E4E7E5',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  menuItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  activeIcon: {
    backgroundColor: '#E4F2ED',
    width: 85,
    height: 48,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeMenuIcon: {
    color: '#176F63',
    fontSize: 34,
  },
  activeMenuText: {
    color: '#176F63',
    fontSize: 17,
    fontWeight: '700',
  },
  menuIcon: {
    color: '#78817F',
    fontSize: 35,
  },
  menuText: {
    color: '#78817F',
    fontSize: 17,
  },
});
