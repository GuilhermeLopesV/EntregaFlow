import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Modal,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { auth } from './firebase/firebaseconfig';
import { carregarLojas } from './LojaService';
import { carregarNotasDeHoje, carregarUltimasNotas } from './NotaService';
import {
  formatarReais,
  formatarHora,
  formatarDataHora,
  saudacao,
  dataExtensa,
  nomeDoEmail,
  iniciais,
} from './Formatos';
import TelaLoja from './TelaLoja';
import TelaNotafiscal from './TelaNotafiscal';

const VERDE = '#176F63';

export default function TelaInicial({ aoSair }) {
  const [tela, setTela] = useState('inicio');
  const [lojas, setLojas] = useState([]);
  const [lojaId, setLojaId] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [notasHoje, setNotasHoje] = useState([]);
  const [ultimas, setUltimas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState('');
  const [seletorAberto, setSeletorAberto] = useState(false);

  const carregarDados = useCallback(async () => {
    try {
      const [listaLojas, hoje, recentes] = await Promise.all([
        carregarLojas(),
        carregarNotasDeHoje(),
        carregarUltimasNotas(30),
      ]);
      setLojas(listaLojas);
      setNotasHoje(hoje);
      setUltimas(recentes);
      setErro('');
    } catch (error) {
      console.log('Erro ao carregar dados da tela inicial:', error);
      setErro('Não foi possível carregar seus dados. Puxe a tela para baixo para tentar de novo.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [tela, carregarDados]);

  async function atualizar() {
    setAtualizando(true);
    await carregarDados();
    setAtualizando(false);
  }

  const loja = lojas.find((l) => l.id === lojaId) || lojas[0] || null;
  const notasDaLoja = loja ? notasHoje.filter((n) => n.lojaId === loja.id) : [];
  const totalHoje = notasDaLoja.reduce((soma, n) => soma + (n.valorCentavos || 0), 0);
  const ultimoEnvio = notasDaLoja.reduce(
    (maior, n) => (!maior || n.enviadoEm > maior ? n.enviadoEm : maior),
    null
  );
  const envios = loja ? ultimas.filter((n) => n.lojaId === loja.id).slice(0, 5) : [];

  const email = auth.currentUser?.email;
  const nome = nomeDoEmail(email);

  function confirmarSaida() {
    Alert.alert('Sair da conta', `Deseja sair de ${email || 'sua conta'}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => aoSair?.() },
    ]);
  }

  function aoTocarLoja() {
    if (lojas.length === 0) {
      setTela('loja');
      return;
    }
    setSeletorAberto(true);
  }

  if (tela === 'loja') {
    return <TelaLoja aoNavegar={setTela} />;
  }

  if (tela === 'adicionar') {
    return (
      <TelaNotafiscal
        aoNavegar={setTela}
        lojas={lojas}
        lojaSelecionada={loja}
        aoSelecionarLoja={setLojaId}
        fotos={fotos}
        setFotos={setFotos}
        notasHoje={notasDaLoja.length}
        aoEnviado={carregarDados}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F8F6" />

      <View style={styles.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={atualizar}
              tintColor={VERDE}
              colors={[VERDE]}
            />
          }
        >
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.date}>{dataExtensa()}</Text>
              <Text style={styles.greeting} numberOfLines={1}>
                {saudacao()}, {nome}
              </Text>
            </View>

            <TouchableOpacity style={styles.avatar} activeOpacity={0.8} onPress={confirmarSaida}>
              <Text style={styles.avatarText}>{iniciais(nome)}</Text>
            </TouchableOpacity>
          </View>

          {erro !== '' && (
            <View style={styles.alertBox}>
              <Text style={styles.alertText}>{erro}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.storeSelector} activeOpacity={0.8} onPress={aoTocarLoja}>
            <Ionicons name="storefront-outline" size={24} color={VERDE} style={styles.storeIcon} />
            <Text style={styles.storeName} numberOfLines={1}>
              {loja ? loja.nome : 'Nenhuma loja cadastrada'}
            </Text>
            <Ionicons
              name={lojas.length === 0 ? 'chevron-forward' : 'chevron-down'}
              size={22}
              color="#78817F"
            />
          </TouchableOpacity>

          <View style={styles.statsCard}>
            <View style={styles.statsHeader}>
              <Text style={styles.statsTitle}>Suas notas hoje</Text>
              <Ionicons name="receipt-outline" size={24} color="#D2E8E0" />
            </View>

            <View style={styles.numberContainer}>
              <Text style={styles.number}>{carregando ? '–' : notasDaLoja.length}</Text>
              <Text style={styles.numberDescription}>
                {notasDaLoja.length === 1 ? 'nota enviada' : 'notas enviadas'}
              </Text>
            </View>

            <View style={styles.statsDivider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total de hoje</Text>
              <Text style={styles.totalValue}>{formatarReais(totalHoje)}</Text>
            </View>

            <View style={styles.lastUpdate}>
              <Ionicons name="time-outline" size={18} color="#D2E8E0" />
              <Text style={styles.updateText}>
                {ultimoEnvio ? `Último envio às ${formatarHora(ultimoEnvio)}` : 'Nenhum envio hoje'}
              </Text>
            </View>
          </View>

          {fotos.length > 0 && (
            <TouchableOpacity
              style={styles.pendingCard}
              activeOpacity={0.85}
              onPress={() => setTela('adicionar')}
            >
              <Ionicons name="images-outline" size={30} color="#92713E" style={styles.pendingIcon} />

              <View style={{ flex: 1 }}>
                <Text style={styles.pendingTitle}>
                  {fotos.length} {fotos.length === 1 ? 'foto para enviar' : 'fotos para enviar'}
                </Text>
                <Text style={styles.pendingDescription}>Ainda não enviadas. Toque para revisar.</Text>
              </View>

              <Ionicons name="chevron-forward" size={24} color="#92713E" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.addButton}
            activeOpacity={0.85}
            onPress={() => setTela('adicionar')}
          >
            <Ionicons name="camera-outline" size={24} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Adicionar notas</Text>
          </TouchableOpacity>

          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Últimos envios</Text>
            <TouchableOpacity>
              <Text style={styles.historyLink}>Ver histórico</Text>
            </TouchableOpacity>
          </View>

          {carregando ? (
            <ActivityIndicator size="small" color={VERDE} style={{ marginTop: 8 }} />
          ) : envios.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum envio ainda.</Text>
          ) : (
            envios.map((nota) => {
              const contabilizada = nota.status === 'contabilizada';
              return (
                <View key={nota.id} style={styles.historyItem}>
                  <View style={styles.historyIconBox}>
                    <Ionicons name="receipt-outline" size={24} color={VERDE} />
                  </View>

                  <View style={styles.historyInfo}>
                    <Text style={styles.historyCount}>
                      {nota.valorCentavos > 0 ? formatarReais(nota.valorCentavos) : 'Sem valor'}
                    </Text>
                    <Text style={styles.historyDate}>{formatarDataHora(nota.enviadoEm)}</Text>
                  </View>

                  <View style={[styles.statusBadge, !contabilizada && styles.statusBadgePendente]}>
                    <Text style={[styles.statusText, !contabilizada && styles.statusTextPendente]}>
                      {contabilizada ? 'Contabilizada' : 'Pendente'}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        <View style={styles.bottomMenu}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.activeIcon}>
              <Ionicons name="home-outline" size={24} color={VERDE} />
            </View>
            <Text style={styles.activeMenuText}>Início</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => setTela('adicionar')}>
            <Ionicons name="add-circle-outline" size={24} color="#78817F" />
            <Text style={styles.menuText}>Adicionar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="stats-chart-outline" size={24} color="#78817F" />
            <Text style={styles.menuText}>Histórico</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => setTela('loja')}>
            <Ionicons name="storefront-outline" size={24} color="#78817F" />
            <Text style={styles.menuText}>Loja</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={seletorAberto}
        transparent
        animationType="fade"
        onRequestClose={() => setSeletorAberto(false)}
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setSeletorAberto(false)}
          />

          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Escolher loja</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {lojas.map((item) => {
                const ativa = item.id === loja?.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.modalItem, ativa && styles.modalItemAtivo]}
                    activeOpacity={0.8}
                    onPress={() => {
                      setLojaId(item.id);
                      setSeletorAberto(false);
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.modalItemNome, ativa && { color: VERDE }]} numberOfLines={1}>
                        {item.nome}
                      </Text>
                      <Text style={styles.modalItemSub} numberOfLines={1}>
                        {[item.bairro, item.cidade].filter(Boolean).join(' · ')}
                      </Text>
                    </View>
                    {ativa && <Ionicons name="checkmark-circle" size={22} color={VERDE} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalGerenciar}
              onPress={() => {
                setSeletorAberto(false);
                setTela('loja');
              }}
            >
              <Ionicons name="settings-outline" size={18} color={VERDE} />
              <Text style={styles.modalGerenciarTexto}>Gerenciar lojas</Text>
            </TouchableOpacity>
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
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
  alertBox: {
    backgroundColor: '#FDECEC',
    borderWidth: 1,
    borderColor: '#F5C2C2',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  alertText: { color: '#B91C1C', fontSize: 13, fontWeight: '600' },
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
    marginRight: 13,
  },
  storeName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#172E2B',
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
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  totalLabel: {
    color: '#C5DAD4',
    fontSize: 14,
  },
  totalValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  lastUpdate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    marginRight: 12,
  },
  pendingTitle: {
    color: '#263A32',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 7,
  },
  pendingDescription: {
    color: '#927A53',
    fontSize: 13,
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
  emptyText: {
    color: '#858D8B',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 16,
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
  statusBadgePendente: {
    backgroundColor: '#F8F0DC',
  },
  statusText: {
    color: '#176F63',
    fontSize: 13,
    fontWeight: '700',
  },
  statusTextPendente: {
    color: '#92713E',
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
  activeMenuText: {
    color: '#176F63',
    fontSize: 13,
    fontWeight: '700',
  },
  menuText: {
    color: '#78817F',
    fontSize: 13,
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
    maxHeight: '75%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#142C29',
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E5E2',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  modalItemAtivo: {
    backgroundColor: '#E5F1ED',
    borderColor: '#176F63',
  },
  modalItemNome: {
    fontSize: 16,
    fontWeight: '700',
    color: '#172E2B',
  },
  modalItemSub: {
    fontSize: 13,
    color: '#858D8B',
    marginTop: 2,
  },
  modalGerenciar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 14,
  },
  modalGerenciarTexto: {
    color: '#176F63',
    fontSize: 15,
    fontWeight: '700',
  },
});