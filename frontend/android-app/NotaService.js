import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import * as ImageManipulator from 'expo-image-manipulator';
import { auth, db } from './firebase/firebaseconfig';

const LIMITE_BASE64 = 900000;

const TENTATIVAS = [
  { largura: 1280, qualidade: 0.6 },
  { largura: 1024, qualidade: 0.5 },
  { largura: 800, qualidade: 0.45 },
  { largura: 640, qualidade: 0.4 },
];

function uidAtual() {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Usuário não autenticado.');
  return uid;
}

async function reduzirFoto(uri, largura, qualidade) {
  const formato = ImageManipulator.SaveFormat.JPEG;

  if (ImageManipulator.ImageManipulator?.manipulate) {
    const contexto = ImageManipulator.ImageManipulator.manipulate(uri);
    contexto.resize({ width: largura });
    const imagem = await contexto.renderAsync();
    const resultado = await imagem.saveAsync({ compress: qualidade, format: formato, base64: true });
    return resultado.base64;
  }

  const resultado = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: largura } }],
    { compress: qualidade, format: formato, base64: true }
  );
  return resultado.base64;
}

async function prepararFoto(uri) {
  for (const t of TENTATIVAS) {
    const base64 = await reduzirFoto(uri, t.largura, t.qualidade);
    if (base64 && base64.length <= LIMITE_BASE64) return base64;
  }
  throw new Error('A foto é grande demais mesmo depois de reduzida.');
}

async function enviarUmaNota(uid, foto, loja) {
  const base64 = await prepararFoto(foto.uri);

  const notaRef = doc(collection(db, 'usuarios', uid, 'notas'));
  const fotoRef = doc(db, 'usuarios', uid, 'notas', notaRef.id, 'anexos', 'foto');

  const batch = writeBatch(db);
  batch.set(notaRef, {
    lojaId: loja.id,
    lojaNome: loja.nome,
    valorCentavos: Math.round(Number(foto.valorCentavos) || 0),
    status: 'pendente',
    temFoto: true,
    enviadoEm: serverTimestamp(),
  });
  batch.set(fotoRef, {
    base64,
    mimeType: 'image/jpeg',
  });
  await batch.commit();
}

export async function enviarNotas(fotos, loja, aoProgredir) {
  const uid = uidAtual();

  const enviadas = [];
  const falhas = [];

  for (let i = 0; i < fotos.length; i++) {
    const foto = fotos[i];
    try {
      await enviarUmaNota(uid, foto, loja);
      enviadas.push(foto.id);
    } catch (error) {
      console.log('Erro ao enviar nota:', error);
      falhas.push({
        id: foto.id,
        erro: `${error?.code || 'erro'} ${String(error?.message || '').slice(0, 200)}`.trim(),
      });
    }
    aoProgredir?.(i + 1, fotos.length);
  }

  return { enviadas, falhas };
}

function converterNota(documento) {
  const dados = documento.data();
  return {
    id: documento.id,
    ...dados,
    enviadoEm: dados.enviadoEm?.toDate ? dados.enviadoEm.toDate() : null,
  };
}

export async function carregarUltimasNotas(quantidade = 30) {
  const uid = uidAtual();

  const q = query(
    collection(db, 'usuarios', uid, 'notas'),
    orderBy('enviadoEm', 'desc'),
    limit(quantidade)
  );
  const snap = await getDocs(q);
  return snap.docs.map(converterNota);
}

export async function carregarResumoDashboard(lojaId) {
  if (!lojaId) {
    return {
      quantidadeHoje: 0,
      ultimoEnvio: null,
      recentes: [],
    };
  }

  const q = query(
    collection(db, 'usuarios', uidAtual(), 'notas'),
    where('lojaId', '==', lojaId)
  );
  const snap = await getDocs(q);
  const notasDaLoja = snap.docs
    .map(converterNota)
    .filter(
      (nota) =>
        nota.enviadoEm instanceof Date &&
        !Number.isNaN(nota.enviadoEm.getTime())
    );
  const inicioDoDia = new Date();
  inicioDoDia.setHours(0, 0, 0, 0);
  const quantidadeHoje = notasDaLoja.filter(
    (nota) => nota.enviadoEm >= inicioDoDia
  ).length;
  const recentes = [...notasDaLoja]
    .sort((a, b) => b.enviadoEm.getTime() - a.enviadoEm.getTime())
    .slice(0, 5);

  return {
    quantidadeHoje,
    ultimoEnvio: recentes[0]?.enviadoEm || null,
    recentes,
  };
}
