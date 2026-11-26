function doisDigitos(n) {
  return String(n).padStart(2, '0');
}

export function formatarReais(centavos) {
  const valor = Math.round(Number(centavos) || 0);
  const reais = Math.floor(valor / 100);
  const resto = doisDigitos(valor % 100);
  const milhar = String(reais).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `R$ ${milhar},${resto}`;
}

export function centavosDoTexto(texto) {
  const digitos = String(texto || '').replace(/\D/g, '').slice(0, 9);
  return digitos ? parseInt(digitos, 10) : 0;
}
