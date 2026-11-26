require('@babel/register')();

const { test } = require('node:test');
const assert = require('node:assert');

const { formatarReais } = require('../Formatos');

test('deve formatar corretamente um valor em reais', () => {
  const resultado = formatarReais(150050);

  assert.strictEqual(resultado, 'R$ 1.500,50');
});