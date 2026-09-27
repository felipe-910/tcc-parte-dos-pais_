// CRUD dos "pequenos" (filhos) cadastrados por cada responsável, no Firestore
import { auth, db } from './firebase-config.js';
import { termosAceitos } from './termos.js';
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

const COLECAO = 'filhos';

// CREATE - cadastra um novo pequeno vinculado ao responsável logado
export async function addFilho({ nome, idade, avatar }) {
  const user = auth.currentUser;
  if (!user) throw new Error('Nenhum usuário logado.');
  await addDoc(collection(db, COLECAO), {
    responsavelId: user.uid,
    nome,
    idade,
    avatar,
    criadoEm: serverTimestamp()
  });
}

// READ - lista todos os pequenos do responsável logado
export async function listarFilhos() {
  const user = auth.currentUser;
  if (!user) return [];
  const q = query(collection(db, COLECAO), where('responsavelId', '==', user.uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// UPDATE - atualiza dados de um pequeno (ex: cor principal)
export async function updateFilho(id, dados) {
  await updateDoc(doc(db, COLECAO, id), dados);
}

// DELETE - remove o cadastro de um pequeno
export async function deleteFilho(id) {
  await deleteDoc(doc(db, COLECAO, id));
}

// Decide para onde mandar o responsável depois do login:
// se é a primeira vez (ainda não aceitou os Termos de Uso) -> tela de aceite (aceitar-termos.html)
// se ainda não tem nenhum pequeno cadastrado -> onboarding (novo-pequeno.html)
// se já tem -> vai direto pra home.html
export async function redirecionarAposLogin() {
  let aceitouTermos = true;
  try {
    aceitouTermos = await termosAceitos();
  } catch (err) {
    // Nunca deixa um erro aqui travar o login do usuário
    console.error('Falha ao verificar os Termos de Uso:', err);
    aceitouTermos = true;
  }
  if (!aceitouTermos) {
    window.location.href = 'aceitar-termos.html';
    return;
  }

  try {
    const filhos = await listarFilhos();
    window.location.href = filhos.length > 0 ? 'home.html' : 'novo-pequeno.html';
  } catch (err) {
    console.error('Falha ao carregar os pequenos:', err);
    window.location.href = 'home.html';
  }
}
