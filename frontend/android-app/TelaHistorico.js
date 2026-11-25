
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';

export default function Historico({ aoNavegar }) {
  const [periodo, setPeriodo] = useState('Últimos 7 dias');
  const [loja, setLoja] = useState('São Conrado');
  const [mostrarDias, setMostrarDias] = useState(false);

  const dias = [];

  const totalFotos = dias.reduce(
    (total, dia) => total + dia.quantidade,
    0
  );

  function alterarPeriodo() {
    setPeriodo(
      periodo === 'Últimos 7 dias'
        ? 'Últimos 30 dias'
        : 'Últimos 7 dias'
    );
  }

  function alterarLoja() {
    setLoja(
      loja === 'São Conrado'
        ? 'Todas as lojas'
        : 'São Conrado'
    );
  }

  function abrirDia(dia) {
    Alert.alert(
      dia.data,
      `${dia.quantidade} fotos registradas.\n${dia.pendentes} fotos pendentes.`
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F6F8F6"
      />

      <View style={styles.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Cabeçalho */}
          <View style={styles.header}>
            <Text style={styles.title}>Histórico</Text>
            <Text style={styles.subtitle}>
              Sua rotina em fotos, dia após dia.
            </Text>
          </View>

          {/* Filtros */}
          <View style={styles.filters}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={alterarPeriodo}
            >
              <Text style={styles.filterIcon}>▦</Text>
              <Text style={styles.filterText}>{periodo}</Text>
              <Text style={styles.chevron}>⌄</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterButton}
              onPress={alterarLoja}
            >
              <Text style={styles.filterIcon}>⌂</Text>
              <Text style={styles.filterText}>{loja}</Text>
              <Text style={styles.chevron}>⌄</Text>
            </TouchableOpacity>
          </View>

          {/* Resumo e gráfico */}
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <View>
                <Text style={styles.total}>{totalFotos}</Text>
                <Text style={styles.totalDescription}>
                  fotos registradas
                </Text>
              </View>

              <View style={styles.chartPeriod}>
                <Text style={styles.chartDate}>
                  {dias.length > 0 ? 'Período selecionado' : 'Nenhum registro ainda'}
                </Text>
                <View style={styles.daysBadge}>
                  <Text style={styles.daysBadgeText}>
                    {dias.length} dias com registros
                  </Text>
                </View>
              </View>
            </View>

                        <View style={styles.chart}>
              {dias.length > 0 ? (
                dias.slice().reverse().map((dia, index) => {
                  const altura = dia.quantidade * 1.8;

                  return (
                    <View style={styles.barColumn} key={dia.data}>
                      <View
                        style={[
                          styles.bar,
                          { height: altura },
                          index === dias.length - 1 && styles.activeBar,
                        ]}
                      />
                      <Text style={styles.barLabel}>
                        {dia.data}
                      </Text>
                    </View>
                  );
                })
              ) : (
                <Text style={styles.chartDate}>
                  Nenhuma foto registrada neste período.
                </Text>
              )}
            </View>
          </View>

          {/* Lista diária */}
          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>Dia a dia</Text>
            <Text style={styles.sectionDescription}>
              Quantidade de fotos
            </Text>
          </View>

          {dias.length > 0 ? (
  dias.slice(0, mostrarDias ? dias.length : 4).map((dia) => (
    <TouchableOpacity
      key={dia.data}
      style={styles.dayItem}
      onPress={() => abrirDia(dia)}
    >
      <View style={styles.dayInfo}>
        <Text style={styles.dayTitle}>{dia.data}</Text>

        <Text style={styles.daySubtitle}>
          {dia.semana}
        </Text>

        {dia.pendentes > 0 && (
          <Text style={styles.pendingText}>
            {dia.pendentes} fotos para enviar · não contabilizadas
          </Text>
        )}
      </View>

      <Text style={styles.dayQuantity}>
        {dia.quantidade}
      </Text>

      <Text style={styles.dayArrow}>›</Text>
    </TouchableOpacity>
  ))
) : (
  <Text style={styles.sectionDescription}>
    Nenhum registro encontrado. As fotos aparecerão aqui quando forem cadastradas.
  </Text>
)}

          {dias.length > 4 && (
  <TouchableOpacity
    style={styles.moreButton}
    onPress={() => setMostrarDias(!mostrarDias)}
  >
    <Text style={styles.moreText}>
      {mostrarDias ? 'Mostrar menos' : 'Ver dias anteriores'}
    </Text>
    <Text style={styles.moreArrow}>
      {mostrarDias ? '⌃' : '⌄'}
    </Text>
  </TouchableOpacity>
)}
        </ScrollView>

        {/* Menu inferior */}
        <View style={styles.bottomMenu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => aoNavegar('inicio')}
          >
            <Text style={styles.menuIcon}>⌂</Text>
            <Text style={styles.menuText}>Início</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => aoNavegar('adicionar')}
          >
            <Text style={styles.menuIcon}>⊕</Text>
            <Text style={styles.menuText}>Adicionar</Text>
          </TouchableOpacity>

          <View style={styles.menuItem}>
            <View style={styles.activeIcon}>
              <Text style={styles.activeMenuIcon}>▥</Text>
            </View>
            <Text style={styles.activeMenuText}>Histórico</Text>
          </View>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => aoNavegar('loja')}
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
    paddingHorizontal: '7%',
    paddingTop: 28,
    paddingBottom: 25,
  },

  header: {
    marginBottom: 27,
  },

  title: {
    color: '#142C29',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 8,
  },

  subtitle: {
    color: '#858D8B',
    fontSize: 16,
  },

  filters: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 27,
  },

  filterButton: {
    flex: 1,
    height: 59,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E5E2',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 7,
  },

  filterIcon: {
    color: '#176F63',
    fontSize: 19,
  },

  filterText: {
    color: '#172E2B',
    fontSize: 13,
    fontWeight: '700',
    flexShrink: 1,
  },

  chevron: {
    color: '#78817F',
    fontSize: 20,
  },

  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0E5E2',
    padding: 22,
    marginBottom: 29,
  },

  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  total: {
    color: '#142C29',
    fontSize: 54,
    fontWeight: '700',
  },

  totalDescription: {
    color: '#858D8B',
    fontSize: 14,
  },

  chartPeriod: {
    alignItems: 'flex-end',
  },

  chartDate: {
    color: '#858D8B',
    fontSize: 12,
    marginBottom: 9,
  },

  daysBadge: {
    backgroundColor: '#E5F2EE',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  daysBadgeText: {
    color: '#176F63',
    fontSize: 11,
    fontWeight: '700',
  },

  chart: {
    height: 125,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 18,
  },

  barColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },

  bar: {
    width: '66%',
    backgroundColor: '#BDD6CB',
    borderRadius: 6,
  },

  activeBar: {
    backgroundColor: '#176F63',
  },

  barLabel: {
    color: '#858D8B',
    fontSize: 12,
  },

  activeBarLabel: {
    color: '#176F63',
    fontWeight: '800',
  },

  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  sectionTitle: {
    color: '#172E2B',
    fontSize: 19,
    fontWeight: '600',
  },

  sectionDescription: {
    color: '#858D8B',
    fontSize: 12,
  },

  dayItem: {
    minHeight: 84,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E5E2',
    paddingVertical: 13,
  },

  dayInfo: {
    flex: 1,
  },

  dayTitle: {
    color: '#172E2B',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },

  daySubtitle: {
    color: '#858D8B',
    fontSize: 14,
  },

  pendingText: {
    color: '#927A53',
    fontSize: 11,
    marginTop: 5,
  },

  dayQuantity: {
    color: '#172E2B',
    fontSize: 27,
    marginRight: 12,
  },

  dayArrow: {
    color: '#858D8B',
    fontSize: 27,
  },

  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 25,
  },

  moreText: {
    color: '#39776A',
    fontSize: 14,
    fontWeight: '600',
  },

  moreArrow: {
    color: '#39776A',
    fontSize: 20,
  },

  bottomMenu: {
    height: 75,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E4E7E5',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  menuItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },

  menuIcon: {
    color: '#78817F',
    fontSize: 25,
  },

  menuText: {
    color: '#78817F',
    fontSize: 12,
  },

  activeIcon: {
    backgroundColor: '#E4F2ED',
    width: 55,
    height: 32,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  activeMenuIcon: {
    color: '#176F63',
    fontSize: 22,
  },

  activeMenuText: {
    color: '#176F63',
    fontSize: 12,
    fontWeight: '700',
  },
});
