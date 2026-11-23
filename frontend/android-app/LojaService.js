import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from './firebase/firebaseconfig';

function uidAtual() {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Usuário não autenticado.');
  return uid;
}

function lojasRef() {
  // usuarios/{uid}/lojas/{lojaId}
  return collection(db, 'usuarios', uidAtual(), 'lojas');
}

function lojaDoc(id) {
  return doc(db, 'usuarios', uidAtual(), 'lojas', id);
}

// Retorna a lista de lojas do usuário, da mais nova para a mais antiga.
export async function carregarLojas() {
  const q = query(lojasRef(), orderBy('criadoEm', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Salva uma nova loja no Firestore.
export async function adicionarLoja({ nome, rua, numero, bairro, cidade }) {
  await addDoc(lojasRef(), {
    nome: nome.trim(),
    rua: rua.trim(),
    numero: numero.trim(),
    bairro: bairro.trim(),
    cidade: cidade.trim(),
    criadoEm: serverTimestamp(),
  });
}

// Atualiza os dados de uma loja existente.
export async function atualizarLoja(id, { nome, rua, numero, bairro, cidade }) {
  await updateDoc(lojaDoc(id), {
    nome: nome.trim(),
    rua: rua.trim(),
    numero: numero.trim(),
    bairro: bairro.trim(),
    cidade: cidade.trim(),
  });
}

// Remove uma loja.
export async function removerLoja(id) {
  await deleteDoc(lojaDoc(id));
}