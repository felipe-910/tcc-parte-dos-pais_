// Controla a aceitação dos Termos de Uso por usuário (salvo localmente no aparelho,
// para não depender de regras extras do Firestore)
import { auth } from './firebase-config.js';

function chaveTermos(uid) {
  return `termos_aceitos_${uid}`;
}

// Verifica se o usuário logado já aceitou os termos vigentes
export async function termosAceitos() {
  const user = auth.currentUser;
  if (!user) return false;
  return localStorage.getItem(chaveTermos(user.uid)) === '1';
}

// Registra o aceite dos termos para o usuário logado
export async function aceitarTermos() {
  const user = auth.currentUser;
  if (!user) throw new Error('Nenhum usuário logado.');
  localStorage.setItem(chaveTermos(user.uid), '1');
}
