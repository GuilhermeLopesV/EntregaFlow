import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { carregarLojas } from './LojaService';
import { enviarNotas } from './NotaService';

const VERDE = '#176F63';
const VERDE_ESCURO = '#10554D';
const ESCURO = '#142C29';
const CINZA = '#858D8B';
const BORDA = '#E0E5E2';
const MARGEM_FOTOS = 10;

export default function TelaNotafiscal({ aoNavegar }) {
  const { width } = useWindowDimensions();
  const larguraFoto = (width * 0.84 - MARGEM_FOTOS * 2) / 3;

  const [lojas, setLojas] = useState([]);
  const [lojaSelecionada, setLojaSelecionada] = useState(null);
  const [seletorAberto, setSeletorAberto] = useState(false);
  const [fotos, setFotos] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [progresso, setProgresso] = useState({ atual: 0, total: 0 });
  const [notasHoje] = useState(0);

  useEffect(() => {
    let ativo = true;
    carregarLojas()
      .then((lista) => {
        if (!ativo) return;
        setLojas(lista);
        if (lista.length > 0) setLojaSelecionada(lista[0]);
      })
      .catch((error) => console.log('Erro ao carregar lojas:', error));
    return () => {
      ativo = false;
    };
  }, []);

  function adicionarFotos(assets) {
    const novas = assets.map((a, i) => ({
      id: `${Date.now()}-${i}`,
      uri: a.uri,
      mimeType: a.mimeType || 'image/jpeg',
    }));
    setFotos((atual) => [...atual, ...novas]);
  }

  async function tirarFoto() {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'Permita o acesso à câmera para tirar fotos das notas.');
      return;
    }
    const resultado = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (!resultado.canceled) adicionarFotos(resultado.assets);
  }

  async function escolherDaGaleria() {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 20,
      quality: 0.7,
    });
    if (!resultado.canceled) adicionarFotos(resultado.assets);
  }

  function removerFoto(id) {
    setFotos((atual) => atual.filter((f) => f.id !== id));
  }

  function aoTocarSeletor() {
    if (lojas.length === 0) {
      aoNavegar?.('loja');
      return;
    }
    setSeletorAberto(!seletorAberto);
  }

  async function enviar() {
    if (enviando || fotos.length === 0) return;
    if (!lojaSelecionada) {
      Alert.alert('Selecione uma loja', 'Cadastre ou escolha uma loja antes de enviar as notas.');
      return;
    }

    setEnviando(true);
    setProgresso({ atual: 0, total: fotos.length });
    try {
      const { enviadas, falhas } = await enviarNotas(
        fotos,
        lojaSelecionada,
        (atual, total) => setProgresso({ atual, total })
      );

      const enviadasSet = new Set(enviadas);
      setFotos((atual) => atual.filter((f) => !enviadasSet.has(f.id)));

      if (falhas.length === 0) {
        Alert.alert(
          'Notas enviadas',
          `${enviadas.length} ${enviadas.length === 1 ? 'foto enviada' : 'fotos enviadas'} para ${lojaSelecionada.nome}.`
        );
      } else {
        Alert.alert(
          'Algumas fotos não foram enviadas',
          `${enviadas.length} enviada(s) e ${falhas.length} com erro. As que falharam continuam na tela: toque em Enviar para tentar de novo.\n\nErro: ${falhas[0].erro}`
        );
      }
    } catch (error) {
      console.log('Erro ao enviar notas:', error);
      Alert.alert(
        'Não foi possível enviar',
        `Tente novamente.\n\nErro: ${error?.code || error?.message || 'desconhecido'}`
      );
    } finally {
      setEnviando(false);
    }
  }

  const qtd = fotos.length;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F8F6" />

      <View style={styles.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <Text style={styles.title}>Adicionar notas</Text>
          <Text style={styles.subtitle}>
            Envie sua nota fiscal aqui!
          </Text>

          <Text style={styles.label}>LOJA DE ENVIO</Text>
          <TouchableOpacity
            style={styles.storeSelector}
            activeOpacity={0.8}
            onPress={aoTocarSeletor}
          >
            <View style={styles.storeIconBox}>
              <Ionicons name="storefront-outline" size={20} color={VERDE} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.storeName} numberOfLines={1}>
                {lojaSelecionada?.nome || 'Nenhuma loja cadastrada'}
              </Text>
              <Text style={styles.storeSub} numberOfLines={1}>
                {lojaSelecionada
                  ? [lojaSelecionada.bairro, lojaSelecionada.cidade].filter(Boolean).join(' · ')
                  : 'Toque para cadastrar uma loja'}
              </Text>
            </View>
            <Ionicons
              name={
                lojas.length === 0
                  ? 'chevron-forward'
                  : seletorAberto
                  ? 'chevron-up'
                  : 'chevron-down'
              }
              size={20}
              color="#78817F"
            />
          </TouchableOpacity>

          {seletorAberto && (
            <View style={styles.storeList}>
              {lojas.map((loja, i) => {
                const ativa = loja.id === lojaSelecionada?.id;
                return (
                  <TouchableOpacity
                    key={loja.id}
                    style={[styles.storeOption, i > 0 && styles.storeOptionDivider]}
                    onPress={() => {
                      setLojaSelecionada(loja);
                      setSeletorAberto(false);
                    }}
                  >
                    <Text
                      style={[styles.storeOptionText, ativa && { color: VERDE, fontWeight: '700' }]}
                      numberOfLines={1}
                    >
                      {loja.nome}
                    </Text>
                    {ativa && <Ionicons name="checkmark-circle" size={20} color={VERDE} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <TouchableOpacity style={styles.cameraCard} activeOpacity={0.88} disabled={enviando}
            onPress={tirarFoto}>
            <View style={styles.cameraCircle}>
              <Ionicons name="camera" size={28} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cameraTitle}>Tirar foto</Text>
              <Text style={styles.cameraSub}>Enquadre a nota inteira e com nitidez</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#C5DAD4" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.galleryButton} activeOpacity={0.8} disabled={enviando}
            onPress={escolherDaGaleria}>
            <View style={styles.galleryIconBox}>
              <Ionicons name="images-outline" size={20} color={VERDE} />
            </View>
            <Text style={styles.galleryText}>Escolher fotos da galeria</Text>
            <Ionicons name="chevron-forward" size={20} color="#78817F" />
          </TouchableOpacity>

          {qtd === 0 && (
            <View style={styles.emptyBox}>
              <Ionicons name="receipt-outline" size={34} color="#A9B7B2" />
              <Text style={styles.emptyTitle}>Nenhuma foto ainda</Text>
              <Text style={styles.emptySub}>
                As fotos que você tirar ou escolher aparecem aqui para revisão.
              </Text>
            </View>
          )}

          {qtd > 0 && (
            <>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewTitle}>Revise suas fotos</Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>
                    {qtd} {qtd === 1 ? 'selecionada' : 'selecionadas'}
                  </Text>
                </View>
              </View>

              <View style={styles.grid}>
                {fotos.map((foto, index) => (
                  <View
                    key={foto.id}
                    style={{
                      width: larguraFoto,
                      marginRight: (index + 1) % 3 === 0 ? 0 : MARGEM_FOTOS,
                      marginBottom: 12,
                    }}
                  >
                    <View>
                      <Image
                        source={{ uri: foto.uri }}
                        style={{
                          width: larguraFoto,
                          height: larguraFoto * 1.2,
                          borderRadius: 14,
                          backgroundColor: '#E4E7E5',
                        }}
                      />
                      <View style={styles.numberBadge}>
                        <Text style={styles.numberBadgeText}>{index + 1}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.removeButton}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        disabled={enviando}
                        onPress={() => removerFoto(foto.id)}
                      >
                        <Ionicons name="close" size={16} color={ESCURO} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.hintRow}>
                <Ionicons name="scan-outline" size={18} color={CINZA} />
                <Text style={styles.hintText}>
                  Confira se cada nota está inteira e legível antes de enviar.
                </Text>
              </View>
            </>
          )}

          {notasHoje > 0 && (
            <View style={styles.countedCard}>
              <Ionicons name="receipt-outline" size={20} color={VERDE} />
              <Text style={styles.countedText}>
                {notasHoje} {notasHoje === 1 ? 'nota já contabilizada' : 'notas já contabilizadas'} hoje
              </Text>
            </View>
          )}

        </ScrollView>

        <View style={styles.sendBar}>
          <TouchableOpacity
            style={[styles.sendButton, (qtd === 0 || enviando) && { opacity: qtd === 0 ? 0.45 : 0.8 }]}
            activeOpacity={0.85}
            disabled={qtd === 0 || enviando}
            onPress={enviar}
          >
            {enviando ? (
              <>
                <ActivityIndicator color="#FFFFFF" />
                <Text style={styles.sendText}>
                  Enviando {Math.min(progresso.atual + 1, progresso.total)} de {progresso.total}...
                </Text>
              </>
            ) : (
              <>
                <Ionicons name="arrow-up-circle-outline" size={22} color="#FFFFFF" />
                <Text style={styles.sendText}>
                  {qtd === 0 ? 'Enviar fotos' : `Enviar ${qtd} ${qtd === 1 ? 'foto' : 'fotos'}`}
                </Text>
              </>
            )}
          </TouchableOpacity>
          <Text style={styles.footerText}>
            As fotos só serão enviadas após o processamento.
          </Text>
        </View>

        <View style={styles.bottomMenu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => aoNavegar?.('inicio')}>
            <Ionicons name="home-outline" size={24} color="#78817F" />
            <Text style={styles.menuText}>Início</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.activeIcon}>
              <Ionicons name="add-circle-outline" size={24} color={VERDE} />
            </View>
            <Text style={styles.activeMenuText}>Adicionar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => aoNavegar?.('historico')}>
            <Ionicons name="stats-chart-outline" size={24} color="#78817F" />
            <Text style={styles.menuText}>Histórico</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => aoNavegar?.('loja')}>
            <Ionicons name="storefront-outline" size={24} color="#78817F" />
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  screen: { flex: 1, backgroundColor: '#F6F8F6' },
  content: { paddingHorizontal: '8%', paddingTop: 23, paddingBottom: 24 },
  title: { fontSize: 28, fontWeight: '800', color: ESCURO, letterSpacing: -1 },
  subtitle: { fontSize: 14, lineHeight: 20, color: CINZA, marginTop: 6, marginBottom: 24 },

  label: { color: CINZA, fontSize: 12, fontWeight: '700', letterSpacing: 0.8, marginBottom: 8 },

  storeSelector: {
    minHeight: 64,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: BORDA,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 12,
  },
  storeIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E4F1ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeName: { fontSize: 16, fontWeight: '700', color: '#172E2B' },
  storeSub: { fontSize: 13, color: CINZA, marginTop: 2 },
  storeList: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: BORDA,
    borderRadius: 16,
    marginTop: 8,
    overflow: 'hidden',
  },
  storeOption: {
    minHeight: 48,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  storeOptionDivider: { borderTopWidth: 1, borderTopColor: '#EEF1EF' },
  storeOptionText: { flex: 1, fontSize: 15, color: '#172E2B', marginRight: 8 },

  cameraCard: {
    backgroundColor: VERDE_ESCURO,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 14,
    marginTop: 24,
  },
  cameraCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraTitle: { color: '#FFFFFF', fontSize: 19, fontWeight: '700' },
  cameraSub: { color: '#C5DAD4', fontSize: 13, marginTop: 3, lineHeight: 18 },

  galleryButton: {
    minHeight: 60,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: BORDA,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 12,
    marginTop: 12,
  },
  galleryIconBox: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: '#E4F1ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryText: { flex: 1, color: '#172E2B', fontSize: 15, fontWeight: '600' },

  emptyBox: {
    marginTop: 24,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#C9D3CF',
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  emptyTitle: { color: '#4A5B57', fontSize: 15, fontWeight: '700', marginTop: 10 },
  emptySub: { color: CINZA, fontSize: 13, lineHeight: 19, textAlign: 'center', marginTop: 4 },

  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 28,
    marginBottom: 14,
  },
  reviewTitle: { fontSize: 19, color: ESCURO, fontWeight: '700' },
  countBadge: {
    backgroundColor: '#E5F2EE',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  countText: { color: VERDE, fontSize: 13, fontWeight: '700' },

  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  numberBadge: {
    position: 'absolute',
    left: 6,
    bottom: 6,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 6,
    backgroundColor: 'rgba(20,44,41,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  removeButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  hintRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  hintText: { flex: 1, color: CINZA, fontSize: 13, lineHeight: 18 },

  countedCard: {
    backgroundColor: '#E4F0EC',
    borderRadius: 16,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
    marginTop: 20,
  },
  countedText: { color: VERDE, fontSize: 15, fontWeight: '700' },

  sendBar: {
    backgroundColor: '#F6F8F6',
    paddingHorizontal: '8%',
    paddingTop: 10,
    paddingBottom: 28,
  },
  sendButton: {
    height: 56,
    backgroundColor: VERDE,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  sendText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  footerText: {
    color: CINZA,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },

  bottomMenu: {
    height: 69,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E4E7E5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  menuItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  activeIcon: {
    backgroundColor: '#E4F2ED',
    width: 56,
    height: 32,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeMenuText: { color: VERDE, fontSize: 13, fontWeight: '700' },
  menuText: { color: '#78817F', fontSize: 13 },
});