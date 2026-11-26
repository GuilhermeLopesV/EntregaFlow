import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';

import {
  carregarLojas,
  adicionarLoja,
  atualizarLoja,
  removerLoja,
} from './LojaService';


export default function TelaLoja({ aoNavegar, mostrarMenu = true }) {
  const [lojas, setLojas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [nome, setNome] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erroModal, setErroModal] = useState('');

  const [lojaSelecionada, setLojaSelecionada] = useState(null);
  const [confirmandoRemocao, setConfirmandoRemocao] = useState(false);
  const [removendo, setRemovendo] = useState(false);
  const [erroOpcoes, setErroOpcoes] = useState('');

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        const lista = await carregarLojas();
        if (ativo) setLojas(lista);
      } catch (error) {
        console.log('Erro ao carregar lojas:', error);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, []);

  function abrirModal() {
    setEditandoId(null);
    setNome('');
    setRua('');
    setNumero('');
    setBairro('');
    setCidade('');
    setErroModal('');
    setModalAberto(true);
  }

  function abrirEdicao(loja) {
    setLojaSelecionada(null);
    setConfirmandoRemocao(false);
    setEditandoId(loja.id);
    setNome(loja.nome || '');
    setRua(loja.rua || '');
    setNumero(loja.numero || '');
    setBairro(loja.bairro || '');
    setCidade(loja.cidade || '');
    setErroModal('');
    setModalAberto(true);
  }

  function fecharModal() {
    if (salvando) return;
    setModalAberto(false);
  }

  async function salvar() {
    if (!nome.trim() || !rua.trim() || !numero.trim() || !bairro.trim() || !cidade.trim()) {
      setErroModal('Preencha todos os campos.');
      return;
    }

    setSalvando(true);
    setErroModal('');
    try {
      if (editandoId) {
        await atualizarLoja(editandoId, { nome, rua, numero, bairro, cidade });
      } else {
        await adicionarLoja({ nome, rua, numero, bairro, cidade });
      }
      const lista = await carregarLojas();
      setLojas(lista);
      setModalAberto(false);
    } catch (error) {
      console.log('Erro ao salvar loja:', error);
      const semConexao = error?.code === 'unavailable';
      setErroModal(
        semConexao
          ? 'Sem conexão. Verifique sua internet e tente novamente.'
          : `Não foi possível salvar a loja.\nErro: ${error?.code || error?.message || 'desconhecido'}`
      );
    } finally {
      setSalvando(false);
    }
  }

  function abrirOpcoes(loja) {
    setErroOpcoes('');
    setConfirmandoRemocao(false);
    setLojaSelecionada(loja);
  }

  function fecharOpcoes() {
    if (removendo) return;
    setLojaSelecionada(null);
    setConfirmandoRemocao(false);
    setErroOpcoes('');
  }

  async function confirmarRemocao() {
    if (!lojaSelecionada) return;
    setRemovendo(true);
    setErroOpcoes('');
    try {
      await removerLoja(lojaSelecionada.id);
      setLojas((atual) => atual.filter((l) => l.id !== lojaSelecionada.id));
      setLojaSelecionada(null);
      setConfirmandoRemocao(false);
    } catch (error) {
      console.log('Erro ao remover loja:', error);
      setErroOpcoes(
        `Não foi possível remover a loja.\nErro: ${error?.code || error?.message || 'desconhecido'}`
      );
    } finally {
      setRemovendo(false);
    }
  }

  const semLojas = !carregando && lojas.length === 0;

  const botaoAdicionar = (
    <TouchableOpacity
      style={styles.addButton}
      activeOpacity={0.85}
      onPress={abrirModal}
    >
      <Text style={styles.addIcon}>+</Text>
      <Text style={styles.addText}>Adicionar uma loja</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F8F6" />

      <View style={styles.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.content, (semLojas || carregando) && styles.contentVazio]}
        >
          {!semLojas && <Text style={styles.title}>Lojas</Text>}

          {carregando ? (
            <View style={styles.centro}>
              <ActivityIndicator size="small" color="#176F63" />
            </View>
          ) : semLojas ? (
            <View style={[styles.centro, styles.centroVazio]}>
              <Text style={styles.titleVazio}>Lojas</Text>
              <Text style={styles.textoVazio}>
                É novo aqui? Adicione sua primeira Loja!
              </Text>
              {botaoAdicionar}
            </View>
          ) : (
            <>
              {botaoAdicionar}
              {lojas.map((loja) => (
                <View key={loja.id} style={styles.storeItem}>
                  <Text style={styles.storeIcon}>⌂</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.storeName}>{loja.nome}</Text>
                    {!!loja.rua && (
                      <Text style={styles.storeInfo}>
                        {loja.rua}
                        {loja.numero ? `, ${loja.numero}` : ''}
                      </Text>
                    )}
                    <Text style={styles.storeInfo}>
                      {loja.bairro} · {loja.cidade}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.optionsButton}
                    activeOpacity={0.6}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    onPress={() => abrirOpcoes(loja)}
                  >
                    <Text style={styles.optionsIcon}>⋮</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </>
          )}
        </ScrollView>

        {mostrarMenu && (
          <View style={styles.bottomMenu}>
            <TouchableOpacity style={styles.menuItem} onPress={() => aoNavegar?.('inicio')}>
              <Text style={styles.menuIcon}>⌂</Text>
              <Text style={styles.menuText}>Início</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => aoNavegar?.('adicionar')}>
              <Text style={styles.menuIcon}>⊕</Text>
              <Text style={styles.menuText}>Adicionar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => aoNavegar?.('historico')}>
              <Text style={styles.menuIcon}>▥</Text>
              <Text style={styles.menuText}>Histórico</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.activeIcon}>
                <Text style={styles.activeMenuIcon}>⌂</Text>
              </View>
              <Text style={styles.activeMenuText}>Loja</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Modal
        visible={lojaSelecionada !== null}
        transparent
        animationType="fade"
        onRequestClose={fecharOpcoes}
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={fecharOpcoes}
          />

          <View style={styles.modalCard}>
            {confirmandoRemocao ? (
              <>
                <Text style={styles.modalTitle}>Remover loja?</Text>
                <Text style={styles.confirmText}>
                  {`"${lojaSelecionada?.nome}" será removida. Essa ação não pode ser desfeita.`}
                </Text>

                {erroOpcoes !== '' && (
                  <View style={styles.alertBox}>
                    <Text style={styles.alertText}>{erroOpcoes}</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.dangerButton, removendo && { opacity: 0.7 }]}
                  activeOpacity={0.85}
                  disabled={removendo}
                  onPress={confirmarRemocao}
                >
                  {removendo ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.saveText}>Sim, remover</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  activeOpacity={0.7}
                  disabled={removendo}
                  onPress={() => setConfirmandoRemocao(false)}
                >
                  <Text style={styles.cancelText}>Voltar</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle} numberOfLines={1}>
                  {lojaSelecionada?.nome}
                </Text>

                <TouchableOpacity
                  style={styles.optionRow}
                  activeOpacity={0.7}
                  onPress={() => abrirEdicao(lojaSelecionada)}
                >
                  <Text style={styles.optionRowIcon}>✎</Text>
                  <Text style={styles.optionRowText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.optionRow}
                  activeOpacity={0.7}
                  onPress={() => setConfirmandoRemocao(true)}
                >
                  <Text style={[styles.optionRowIcon, styles.dangerText]}>✕</Text>
                  <Text style={[styles.optionRowText, styles.dangerText]}>Remover</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  activeOpacity={0.7}
                  onPress={fecharOpcoes}
                >
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={modalAberto}
        transparent
        animationType="fade"
        onRequestClose={fecharModal}
      >
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={fecharModal}
          />

          <View style={styles.modalCard}>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={styles.modalTitle}>
                {editandoId ? 'Editar loja' : 'Nova loja'}
              </Text>

              {erroModal !== '' && (
                <View style={styles.alertBox}>
                  <Text style={styles.alertText}>{erroModal}</Text>
                </View>
              )}

              <Text style={styles.label}>Nome do estabelecimento</Text>
              <TextInput
                style={styles.input}
                value={nome}
                onChangeText={setNome}
                editable={!salvando}
              />

              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Rua</Text>
                  <TextInput
                    style={styles.input}
                    value={rua}
                    onChangeText={setRua}
                    editable={!salvando}
                  />
                </View>

                <View style={{ width: 96 }}>
                  <Text style={styles.label}>Número</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: 123"
                    placeholderTextColor="#858D8B"
                    value={numero}
                    onChangeText={setNumero}
                    editable={!salvando}
                    autoCapitalize="characters"
                  />
                </View>
              </View>

              <Text style={styles.label}>Bairro/Unidade</Text>
              <TextInput
                style={styles.input}
                value={bairro}
                onChangeText={setBairro}
                editable={!salvando}
              />

              <Text style={styles.label}>Cidade</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Rio de Janeiro"
                placeholderTextColor="#858D8B"
                value={cidade}
                onChangeText={setCidade}
                editable={!salvando}
              />

              <TouchableOpacity
                style={[styles.saveButton, salvando && { opacity: 0.7 }]}
                activeOpacity={0.85}
                disabled={salvando}
                onPress={salvar}
              >
                {salvando ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveText}>
                    {editandoId ? 'Salvar alterações' : 'Salvar'}
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F6F8F6' },
  screen: { flex: 1, backgroundColor: '#F6F8F6' },
  content: {
    paddingHorizontal: '8%',
    paddingTop: 46,
    paddingBottom: 24,
  },
  contentVazio: { flexGrow: 1 },
  centro: { flex: 1, justifyContent: 'center' },
  centroVazio: { paddingTop: 40 },
  titleVazio: {
    fontSize: 40,
    fontWeight: '800',
    color: '#142C29',
    letterSpacing: -1,
    textAlign: 'center',
    marginBottom: 8,
  },
  textoVazio: {
    fontSize: 15,
    color: '#858D8B',
    textAlign: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#142C29',
    letterSpacing: -1,
    marginBottom: 20,
  },
  addButton: {
    height: 56,
    backgroundColor: '#176F63',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  addIcon: { color: '#FFFFFF', fontSize: 24, fontWeight: '600' },
  addText: { color: '#FFFFFF', fontSize: 17, fontWeight: '600' },
  storeItem: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E0E5E2',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingLeft: 16,
    paddingRight: 8,
    marginBottom: 10,
  },
  storeIcon: { color: '#176F63', fontSize: 22, marginRight: 14 },
  storeName: { fontSize: 16, fontWeight: '700', color: '#172E2B' },
  storeInfo: { fontSize: 13, color: '#858D8B', marginTop: 3 },
  optionsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsIcon: { color: '#78817F', fontSize: 26, fontWeight: '700' },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 44, 41, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '6%',
  },
  modalCard: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#142C29',
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  row: { flexDirection: 'row', gap: 10 },
  label: {
    color: '#172E2B',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#DFE4E1',
    backgroundColor: '#F6F8F6',
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#253B37',
    marginBottom: 16,
  },
  alertBox: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    backgroundColor: '#FDECEC',
    borderColor: '#F5C2C2',
  },
  alertText: { color: '#B91C1C', fontSize: 14, fontWeight: '600' },
  saveButton: {
    height: 54,
    backgroundColor: '#176F63',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  saveText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },

  optionRow: {
    height: 54,
    borderRadius: 14,
    backgroundColor: '#F6F8F6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
    gap: 12,
  },
  optionRowIcon: { color: '#176F63', fontSize: 20, width: 24, textAlign: 'center' },
  optionRowText: { color: '#172E2B', fontSize: 16, fontWeight: '700' },
  dangerText: { color: '#B91C1C' },
  dangerButton: {
    height: 54,
    backgroundColor: '#B91C1C',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  confirmText: {
    color: '#44524F',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
  },
  cancelButton: {
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  cancelText: { color: '#78817F', fontSize: 16, fontWeight: '600' },

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
  activeMenuIcon: { color: '#176F63', fontSize: 23 },
  activeMenuText: { color: '#176F63', fontSize: 13, fontWeight: '700' },
  menuIcon: { color: '#78817F', fontSize: 24 },
  menuText: { color: '#78817F', fontSize: 13 },
});