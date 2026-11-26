require('@babel/register')();

const { test } = require('node:test');
const assert = require('node:assert');
const proxyquire = require('proxyquire').noCallThru();

test('deve cadastrar uma loja removendo espaços desnecessários', async () => {
  const db = {};
  const auth = {
    currentUser: {
      uid: 'usuario-teste',
    },
  };

  const timestampFake = 'timestamp-teste';
  let dadosSalvos;
  let caminhoColecao;

  const firestoreMock = {
    collection: (...args) => {
      caminhoColecao = args;
      return 'referencia-lojas';
    },

    addDoc: async (referencia, dados) => {
      dadosSalvos = dados;
      return { id: 'loja-teste' };
    },

    serverTimestamp: () => timestampFake,
  };

  const LojaService = proxyquire('../LojaService', {
    'firebase/firestore': firestoreMock,

    './firebase/firebaseconfig': {
      auth,
      db,
    },
  });

  await LojaService.adicionarLoja({
    nome: '  Mercado Central  ',
    rua: '  Rua das Flores  ',
    numero: '  100  ',
    bairro: '  Centro  ',
    cidade: '  Rio de Janeiro  ',
  });

  assert.deepStrictEqual(caminhoColecao, [
    db,
    'usuarios',
    'usuario-teste',
    'lojas',
  ]);

  assert.deepStrictEqual(dadosSalvos, {
    nome: 'Mercado Central',
    rua: 'Rua das Flores',
    numero: '100',
    bairro: 'Centro',
    cidade: 'Rio de Janeiro',
    criadoEm: timestampFake,
  });
});