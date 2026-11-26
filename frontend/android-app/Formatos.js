const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

const DIAS = ['DOMINGO', 'SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO'];

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

export function saudacao(data = new Date()) {
  const hora = data.getHours();
  if (hora < 12) return 'Bom dia';
  if (hora < 18) return 'Boa tarde';
  return 'Boa noite';
}

export function dataExtensa(data = new Date()) {
  return `${DIAS[data.getDay()]}, ${doisDigitos(data.getDate())} DE ${MESES[data.getMonth()].toUpperCase()}`;
}

export function formatarHora(data) {
  return `${doisDigitos(data.getHours())}:${doisDigitos(data.getMinutes())}`;
}

export function formatarDataHora(data) {
  const agora = new Date();
  const inicioHoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  const inicioOntem = new Date(inicioHoje);
  inicioOntem.setDate(inicioOntem.getDate() - 1);
  const hora = formatarHora(data);

  if (data >= inicioHoje) return `Hoje, às ${hora}`;
  if (data >= inicioOntem) return `Ontem, às ${hora}`;
  return `${doisDigitos(data.getDate())}/${doisDigitos(data.getMonth() + 1)}, às ${hora}`;
}

export function nomeDoEmail(email) {
  const base = String(email || '').split('@')[0].replace(/[._-]+/g, ' ').trim();
  if (!base) return 'Usuário';
  const primeiro = base.split(' ')[0];
  return primeiro.charAt(0).toUpperCase() + primeiro.slice(1).toLowerCase();
}

export function iniciais(nome) {
  return String(nome || 'US').slice(0, 2).toUpperCase();
}