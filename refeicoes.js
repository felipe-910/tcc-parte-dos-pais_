// CRUD das refeições registradas de cada pequeno, no Firestore
import { auth, db } from './firebase-config.js';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const COLECAO = 'refeicoes';

// CREATE - registra uma nova refeição vinculada a um pequeno
export async function addRefeicao({ filhoId, tipo, alimentos }) {
  const user = auth.currentUser;
  if (!user) throw new Error('Nenhum usuário logado.');
  await addDoc(collection(db, COLECAO), {
    responsavelId: user.uid,
    filhoId,
    tipo,
    alimentos,
    criadoEm: serverTimestamp()
  });
}

// READ - lista todas as refeições de um pequeno, mais recentes primeiro
export async function listarRefeicoes(filhoId) {
  const user = auth.currentUser;
  if (!user) return [];
  const q = query(collection(db, COLECAO), where('filhoId', '==', filhoId), where('responsavelId', '==', user.uid));
  const snap = await getDocs(q);
  const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  lista.sort((a, b) => (b.criadoEm?.toMillis?.() || 0) - (a.criadoEm?.toMillis?.() || 0));
  return lista;
}

// UPDATE - atualiza uma refeição já registrada (tipo e/ou alimentos)
export async function updateRefeicao(id, dados) {
  await updateDoc(doc(db, COLECAO, id), dados);
}

// DELETE - remove um registro de refeição
export async function deleteRefeicao(id) {
  await deleteDoc(doc(db, COLECAO, id));
}
