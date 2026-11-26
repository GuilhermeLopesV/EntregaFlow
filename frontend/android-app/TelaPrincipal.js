import { useState, useEffect, useRef } from 'react';
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
  ActivityIndicator,
} from 'react-native';

import { carregarLojas } from './LojaService';
import { carregarResumoDashboard } from './NotaService';
import TelaLoja from './TelaLoja';
import TelaNotafiscal from './TelaNotafiscal';
import TelaHistorico from './TelaHistorico';

function formatarDataHora(data) {
  return `${data.toLocaleDateString('pt-BR')} às ${data.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

function formatarStatus(status) {
  if (typeof status !== 'string' || !status.trim()) return 'Sem status';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function TelaPrincipal({ aoSair }) {
  const [tela, setTela] = useState('inicio');
  const [saindo, setSaindo] = useState(false);

  async function handleSair() {
    setSaindo(true);
    try {
      await aoSair();
    } catch {
      Alert.alert(
        'Não foi possível sair',
        'Tente novamente para encerrar sua sessão.'
      );
      setSaindo(false);
    }
  }

  // Estado compartilhado com a tela de notas
  const [lojas, setLojas] = useState([]);
  const [lojaId, setLojaId] = useState(null);
  const [seletorLojaAberto, setSeletorLojaAberto] = useState(false);
  const [carregandoLojas, setCarregandoLojas] = useState(true);
  const [erroLojas, setErroLojas] = useState('');
  const [fotos, setFotos] = useState([]);
  const [resumoNotas, setResumoNotas] = useState({
    quantidadeHoje: 0,
    ultimoEnvio: null,
    recentes: [],
  });
  const [carregandoResumo, setCarregandoResumo] = useState(true);
  const [erroResumo, setErroResumo] = useState('');
  const resumoRequestId = useRef(0);

  const lojaSelecionada = lojas.find((l) => l.id === lojaId) || lojas[0] || null;

  async function recarregarLojas() {
    setCarregandoLojas(true);
    setErroLojas('');
    try {
      setLojas(await carregarLojas());
    } catch (error) {
      console.log('Erro ao carregar lojas:', error);
      setErroLojas('Não foi possível carregar as lojas.');
    } finally {
      setCarregandoLojas(false);
    }
  }

  function selecionarLoja(loja) {
    setLojaId(loja.id);
    setSeletorLojaAberto(false);
  }

  async function recarregarResumo(idLoja = lojaSelecionada?.id) {
    const requestId = ++resumoRequestId.current;
    setResumoNotas({ quantidadeHoje: 0, ultimoEnvio: null, recentes: [] });
    setErroResumo('');

    if (!idLoja) {
      setCarregandoResumo(false);
      return;
    }

    setCarregandoResumo(true);
    try {
      const resumo = await carregarResumoDashboard(idLoja);
      if (requestId === resumoRequestId.current) setResumoNotas(resumo);
    } catch (error) {
      console.log('Erro ao carregar resumo do dashboard:', error);
      if (requestId === resumoRequestId.current) {
        setErroResumo('Não foi possível carregar os registros.');
      }
    } finally {
      if (requestId === resumoRequestId.current) setCarregandoResumo(false);
    }
  }

  useEffect(() => {
    recarregarLojas();
  }, [tela]);

  useEffect(() => {
    if (tela === 'inicio' || tela === 'adicionar') {
      recarregarResumo(lojaSelecionada?.id);
    }
  }, [tela, lojaSelecionada?.id]);

  if (tela === 'loja') {
    return <TelaLoja aoNavegar={setTela} />;
  }

  if (tela === 'adicionar') {
    return (
      <TelaNotafiscal
        aoNavegar={setTela}
        lojas={lojas}
        lojaSelecionada={lojaSelecionada}
        aoSelecionarLoja={setLojaId}
        fotos={fotos}
        setFotos={setFotos}
        notasHoje={resumoNotas.quantidadeHoje}
        aoEnviado={recarregarResumo}
      />
    );
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
                {new Date().toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                }).toLocaleUpperCase()}
              </Text>
              <Text style={styles.greeting}>
                Bom dia, Usuário
              </Text>
            </View>

            <View style={styles.headerActions}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>US</Text>
              </View>
              <TouchableOpacity
                style={[styles.logoutButton, saindo && styles.logoutButtonDisabled]}
                accessibilityRole="button"
                accessibilityLabel="Sair da conta"
                disabled={saindo}
                onPress={handleSair}
              >
                <Text style={styles.logoutText}>
                  {saindo ? 'Saindo...' : 'Sair'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.storeSelector}
            accessibilityRole="button"
            accessibilityLabel="Selecionar loja"
            onPress={() => setSeletorLojaAberto(true)}
          >
            <Text style={styles.storeIcon}>⌂</Text>
            <Text style={styles.storeName}>
              {lojaSelecionada?.nome || 'Selecione uma loja'}
            </Text>
            <Text style={styles.chevron}>⌄</Text>
          </TouchableOpacity>

          <View style={styles.statsCard}>
            <View style={styles.statsHeader}>
              <Text style={styles.statsTitle}>Suas notas hoje</Text>
              <Text style={styles.receiptIcon}>▤</Text>
            </View>

            <View style={styles.numberContainer}>
              <Text style={styles.number}>
                {carregandoResumo ? '…' : erroResumo ? '—' : resumoNotas.quantidadeHoje}
              </Text>
              <Text style={styles.numberDescription}>
                notas enviadas hoje
              </Text>
            </View>

            <View style={styles.statsDivider} />

            <View style={styles.lastUpdate}>
              <Text style={styles.checkIcon}>✓</Text>
              <Text style={styles.updateText}>
                {carregandoResumo
                  ? 'Carregando registros...'
                  : erroResumo
                    ? erroResumo
                    : resumoNotas.ultimoEnvio
                      ? `Último registro em ${formatarDataHora(resumoNotas.ultimoEnvio)}`
                      : 'Nenhum envio realizado ainda'}
              </Text>
            </View>
          </View>

          
          <TouchableOpacity style={styles.pendingCard}>
            <Text style={styles.pendingIcon}>▧</Text>

            <View style={{ flex: 1 }}>
              <Text style={styles.pendingTitle}>
                {fotos.length === 0
                  ? 'Nenhuma foto para enviar'
                  : `${fotos.length} ${fotos.length === 1 ? 'foto selecionada' : 'fotos selecionadas'} para enviar`}
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

          {erroResumo ? (
            <Text style={styles.emptyHistory}>{erroResumo}</Text>
          ) : carregandoResumo ? (
            <Text style={styles.emptyHistory}>Carregando registros...</Text>
          ) : resumoNotas.recentes.length === 0 ? (
            <Text style={styles.emptyHistory}>Nenhum envio realizado ainda</Text>
          ) : (
            resumoNotas.recentes.map((nota) => (
              <View style={styles.historyItem} key={nota.id}>
                <View style={styles.historyIconBox}>
                  <Text style={styles.historyIcon}>▤</Text>
                </View>

                <View style={styles.historyInfo}>
                  <Text style={styles.historyCount}>
                    {nota.lojaNome ? `Nota · ${nota.lojaNome}` : 'Nota enviada'}
                  </Text>
                  <Text style={styles.historyDate}>
                    {formatarDataHora(nota.enviadoEm)}
                  </Text>
                </View>

                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{formatarStatus(nota.status)}</Text>
                </View>
              </View>
            ))
          )}
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

      <Modal
        visible={seletorLojaAberto}
        transparent
        animationType="fade"
        onRequestClose={() => setSeletorLojaAberto(false)}
      >
        <View style={styles.selectorOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            accessibilityLabel="Fechar seleção de loja"
            onPress={() => setSeletorLojaAberto(false)}
          />

          <View style={styles.selectorCard}>
            <View style={styles.selectorHeader}>
              <Text style={styles.selectorTitle}>Selecionar loja</Text>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Fechar seleção de loja"
                onPress={() => setSeletorLojaAberto(false)}
              >
                <Text style={styles.selectorClose}>×</Text>
              </TouchableOpacity>
            </View>

            {carregandoLojas ? (
              <ActivityIndicator size="small" color="#176F63" />
            ) : erroLojas && lojas.length === 0 ? (
              <View>
                <Text style={styles.selectorMessage}>{erroLojas}</Text>
                <TouchableOpacity
                  style={styles.selectorAction}
                  onPress={recarregarLojas}
                >
                  <Text style={styles.selectorActionText}>Tentar novamente</Text>
                </TouchableOpacity>
              </View>
            ) : lojas.length === 0 ? (
              <View>
                <Text style={styles.selectorMessage}>Nenhuma loja cadastrada.</Text>
                <TouchableOpacity
                  style={styles.selectorAction}
                  onPress={() => {
                    setSeletorLojaAberto(false);
                    setTela('loja');
                  }}
                >
                  <Text style={styles.selectorActionText}>Gerenciar lojas</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {!!erroLojas && (
                  <Text style={styles.selectorError}>{erroLojas}</Text>
                )}
                <ScrollView
                  style={styles.selectorList}
                  keyboardShouldPersistTaps="handled"
                >
                  {lojas.map((loja) => {
                    const ativa = loja.id === lojaSelecionada?.id;
                    const endereco = [
                      [loja.rua, loja.numero].filter(Boolean).join(', '),
                      [loja.bairro, loja.cidade].filter(Boolean).join(' · '),
                    ].filter(Boolean).join(' · ');

                    return (
                      <TouchableOpacity
                        key={loja.id}
                        style={styles.selectorOption}
                        accessibilityRole="button"
                        accessibilityLabel={`Selecionar ${loja.nome}`}
                        onPress={() => selecionarLoja(loja)}
                      >
                        <View style={styles.selectorOptionInfo}>
                          <Text
                            style={[
                              styles.selectorOptionName,
                              ativa && styles.selectorOptionNameActive,
                            ]}
                          >
                            {loja.nome}
                          </Text>
                          {!!endereco && (
                            <Text style={styles.selectorOptionAddress}>
                              {endereco}
                            </Text>
                          )}
                        </View>
                        {ativa && (
                          <Text style={styles.selectorCheck}>✓</Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </>
            )}
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  logoutButton: {
    backgroundColor: '#E4F1ED',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutText: {
    color: '#176F63',
    fontSize: 14,
    fontWeight: '700',
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
  selectorOverlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 44, 41, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '6%',
  },
  selectorCard: {
    width: '100%',
    maxHeight: '75%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
  },
  selectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  selectorTitle: {
    color: '#142C29',
    fontSize: 22,
    fontWeight: '800',
  },
  selectorClose: {
    color: '#78817F',
    fontSize: 28,
    paddingHorizontal: 5,
  },
  selectorList: {
    flexGrow: 0,
  },
  selectorOption: {
    minHeight: 62,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E5E2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  selectorOptionInfo: {
    flex: 1,
  },
  selectorOptionName: {
    color: '#172E2B',
    fontSize: 16,
    fontWeight: '600',
  },
  selectorOptionNameActive: {
    color: '#176F63',
    fontWeight: '700',
  },
  selectorOptionAddress: {
    color: '#858D8B',
    fontSize: 12,
    marginTop: 4,
  },
  selectorCheck: {
    color: '#176F63',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
  },
  selectorMessage: {
    color: '#858D8B',
    fontSize: 14,
    marginBottom: 12,
  },
  selectorError: {
    color: '#A33B32',
    fontSize: 13,
    marginBottom: 12,
  },
  selectorAction: {
    alignSelf: 'flex-start',
    backgroundColor: '#E4F2ED',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  selectorActionText: {
    color: '#176F63',
    fontSize: 14,
    fontWeight: '700',
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
  emptyHistory: {
    color: '#858D8B',
    fontSize: 14,
    marginBottom: 16,
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