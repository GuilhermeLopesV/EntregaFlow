import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Modal,
} from 'react-native';

import { carregarLojas } from './LojaService';
import { carregarUltimasNotas } from './NotaService';
import { formatarReais } from './Formatos';

const NOMES_SEMANA = [
  'domingo', 'segunda-feira', 'terça-feira', 'quarta-feira',
  'quinta-feira', 'sexta-feira', 'sábado',
];

const PERIODOS = [
  { rotulo: 'Últimos 7 dias', dias: 7 },
  { rotulo: 'Últimos 30 dias', dias: 30 },
  { rotulo: 'Último ano', dias: 365 },
  { rotulo: 'Todo o histórico', dias: null },
];

const MESES_CURTOS = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
  'jul', 'ago', 'set', 'out', 'nov', 'dez',
];

function doisDigitos(n) {
  return String(n).padStart(2, '0');
}

function chaveDoDia(d) {
  return `${d.getFullYear()}-${doisDigitos(d.getMonth() + 1)}-${doisDigitos(d.getDate())}`;
}

export default function Historico({ aoNavegar }) {
  const [periodo, setPeriodo] = useState('Últimos 7 dias');
  const [lojaId, setLojaId] = useState(null);
  const [mostrarDias, setMostrarDias] = useState(false);
  const [seletorPeriodo, setSeletorPeriodo] = useState(false);

  const [notas, setNotas] = useState([]);
  const [lojas, setLojas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const lojaSelecionada = lojas.find((l) => l.id === lojaId);
  const rotuloLoja = lojaId
    ? lojaSelecionada?.nome || 'Loja não disponível'
    : 'Todas as lojas';

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        const [listaNotas, listaLojas] = await Promise.all([
          carregarUltimasNotas(3000),
          carregarLojas(),
        ]);
        if (!ativo) return;
        setNotas(listaNotas);
        setLojas(listaLojas);
      } catch (error) {
        console.log('Erro ao carregar histórico:', error);
        if (ativo) setErro(`Não foi possível carregar o histórico.\nErro: ${error?.code || error?.message || 'desconhecido'}`);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, []);

  // Filtra por período e por loja
  const opcaoPeriodo = PERIODOS.find((p) => p.rotulo === periodo) || PERIODOS[0];
  let inicio = new Date(0); // "Todo o histórico"
  if (opcaoPeriodo.dias) {
    inicio = new Date();
    inicio.setHours(0, 0, 0, 0);
    inicio.setDate(inicio.getDate() - (opcaoPeriodo.dias - 1));
  }

  const notasFiltradas = notas.filter(
    (n) =>
      n.enviadoEm instanceof Date &&
      n.enviadoEm >= inicio &&
      (lojaId === null || n.lojaId === lojaId)
  );

  // Agrupa por dia (mais recente primeiro)
  const grupos = {};
  notasFiltradas.forEach((n) => {
    const chave = chaveDoDia(n.enviadoEm);
    if (!grupos[chave]) {
      grupos[chave] = {
        chave,
        data: `${doisDigitos(n.enviadoEm.getDate())}/${doisDigitos(n.enviadoEm.getMonth() + 1)}`,
        semana: NOMES_SEMANA[n.enviadoEm.getDay()],
        quantidade: 0,
        totalCentavos: 0,
      };
    }
    grupos[chave].quantidade += 1;
    grupos[chave].totalCentavos += n.valorCentavos || 0;
  });
  const dias = Object.values(grupos).sort((x, y) => y.chave.localeCompare(x.chave));

  // Gráfico: por dia (7 e 30 dias) ou por mês (1 ano e todo o histórico)
  let diasGrafico;
  if (opcaoPeriodo.dias && opcaoPeriodo.dias <= 30) {
    diasGrafico = dias.slice(0, 7).reverse();
  } else {
    const meses = {};
    dias.forEach((d) => {
      const chaveMes = d.chave.slice(0, 7);
      if (!meses[chaveMes]) {
        meses[chaveMes] = {
          chave: chaveMes,
          data: MESES_CURTOS[parseInt(chaveMes.slice(5, 7), 10) - 1],
          quantidade: 0,
        };
      }
      meses[chaveMes].quantidade += d.quantidade;
    });
    diasGrafico = Object.values(meses)
      .sort((x, y) => x.chave.localeCompare(y.chave))
      .slice(-12);
  }
  const maxQtd = Math.max(1, ...diasGrafico.map((d) => d.quantidade));

  const totalFotos = dias.reduce((total, dia) => total + dia.quantidade, 0);

  function alterarPeriodo() {
    setSeletorPeriodo(true);
  }

  function alterarLoja() {
    const ids = [null, ...lojas.map((l) => l.id)];
    const atual = ids.indexOf(lojaId);
    setLojaId(ids[(atual + 1) % ids.length]);
  }

  function abrirDia(dia) {
    Alert.alert(
      `${dia.data} · ${dia.semana}`,
      `${dia.quantidade} ${dia.quantidade === 1 ? 'foto registrada' : 'fotos registradas'}.\nTotal: ${formatarReais(dia.totalCentavos)}`
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
              <Text style={styles.filterText}>{rotuloLoja}</Text>
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
                  {carregando ? 'Carregando...' : dias.length > 0 ? 'Período selecionado' : 'Nenhum registro ainda'}
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
                diasGrafico.map((dia, index) => {
                  const altura = Math.max(6, (dia.quantidade / maxQtd) * 100);

                  return (
                    <View style={styles.barColumn} key={dia.data}>
                      <View
                        style={[
                          styles.bar,
                          { height: altura },
                          index === diasGrafico.length - 1 && styles.activeBar,
                        ]}
                      />
                      <Text style={[styles.barLabel, diasGrafico.length > 7 && { fontSize: 9 }]}>
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
          {dia.semana} · {formatarReais(dia.totalCentavos)}
        </Text>

      </View>

      <Text style={styles.dayQuantity}>
        {dia.quantidade}
      </Text>

      <Text style={styles.dayArrow}>›</Text>
    </TouchableOpacity>
  ))
) : (
  <Text style={styles.sectionDescription}>
    {erro || (carregando ? 'Carregando...' : 'Nenhum registro encontrado. As fotos aparecerão aqui quando forem cadastradas.')}
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

      <Modal
        visible={seletorPeriodo}
        transparent
        animationType="fade"
        onRequestClose={() => setSeletorPeriodo(false)}
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setSeletorPeriodo(false)}
          />

          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Período</Text>

            {PERIODOS.map((p) => {
              const ativo = p.rotulo === periodo;
              return (
                <TouchableOpacity
                  key={p.rotulo}
                  style={[styles.optionRow, ativo && styles.optionRowActive]}
                  activeOpacity={0.7}
                  onPress={() => {
                    setPeriodo(p.rotulo);
                    setMostrarDias(false);
                    setSeletorPeriodo(false);
                  }}
                >
                  <Text style={[styles.optionText, ativo && styles.optionTextActive]}>
                    {p.rotulo}
                  </Text>
                  {ativo && <Text style={styles.optionCheck}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
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

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 44, 41, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '6%',
  },

  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
  },

  modalTitle: {
    color: '#142C29',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 16,
  },

  optionRow: {
    height: 54,
    borderRadius: 14,
    backgroundColor: '#F6F8F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  optionRowActive: {
    backgroundColor: '#E4F2ED',
  },

  optionText: {
    color: '#172E2B',
    fontSize: 16,
    fontWeight: '600',
  },

  optionTextActive: {
    color: '#176F63',
    fontWeight: '800',
  },

  optionCheck: {
    color: '#176F63',
    fontSize: 20,
    fontWeight: '800',
  },
});