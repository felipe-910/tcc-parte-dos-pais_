// CRUD das metas de cada pequeno, no Firestore
import { auth, db } from './firebase-config.js';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const COLECAO = 'metas';

// CREATE - cadastra uma nova meta vinculada a um pequeno
export async function addMeta({ filhoId, titulo, descricao, cor, recompensa }) {
  const user = auth.currentUser;
  if (!user) throw new Error('Nenhum usuário logado.');
  await addDoc(collection(db, COLECAO), {
    responsavelId: user.uid,
    filhoId,
    titulo,
    descricao: descricao || '',
    cor,
    recompensa,
    concluida: false,
    criadoEm: serverTimestamp()
  });
}

// READ - lista todas as metas de um pequeno
export async function listarMetas(filhoId) {
  const user = auth.currentUser;
  if (!user) return [];
  const q = query(collection(db, COLECAO), where('filhoId', '==', filhoId), where('responsavelId', '==', user.uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// UPDATE - atualiza uma meta (ex: marcar como concluída)
export async function updateMeta(id, dados) {
  await updateDoc(doc(db, COLECAO, id), dados);
}
