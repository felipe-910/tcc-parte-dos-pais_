// CRUD completo de autenticação (email/senha + Google) usando Firebase Auth
import { auth } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
  updateProfile,
  updatePassword,
  deleteUser
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const googleProvider = new GoogleAuthProvider();

/* ---------- CREATE ---------- */
// Cria uma conta nova com email e senha
export async function registerUser(nome, email, senha) {
  const cred = await createUserWithEmailAndPassword(auth, email, senha);
  if (nome) {
    await updateProfile(cred.user, { displayName: nome });
  }
  return cred.user;
}

/* ---------- READ / LOGIN ---------- */
// Login com email e senha
export async function loginUser(email, senha) {
  const cred = await signInWithEmailAndPassword(auth, email, senha);
  return cred.user;
}

// Login (ou cadastro automático, se a conta ainda não existir) com Google
export async function loginWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider);
  return cred.user;
}

// Envia email de redefinição de senha
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

// Observa o estado de login (chama o callback sempre que o usuário logar/deslogar)
export function watchAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

/* ---------- UPDATE ---------- */
// Atualiza nome e/ou foto do perfil
export async function updateUserProfile({ nome, fotoURL } = {}) {
  if (!auth.currentUser) throw new Error('Nenhum usuário logado.');
  await updateProfile(auth.currentUser, {
    displayName: nome ?? auth.currentUser.displayName,
    photoURL: fotoURL ?? auth.currentUser.photoURL
  });
}

// Atualiza a senha do usuário logado (o Firebase exige login recente para isso)
export async function updateUserPassword(novaSenha) {
  if (!auth.currentUser) throw new Error('Nenhum usuário logado.');
  await updatePassword(auth.currentUser, novaSenha);
}

/* ---------- DELETE ---------- */
// Exclui a conta do usuário logado (o Firebase exige login recente para isso)
export async function deleteAccount() {
  if (!auth.currentUser) throw new Error('Nenhum usuário logado.');
  await deleteUser(auth.currentUser);
}

/* ---------- LOGOUT ---------- */
export async function logoutUser() {
  await signOut(auth);
}

/* ---------- Mensagens de erro em pt-BR ---------- */
export function traduzErro(codigo) {
  const mapa = {
    'auth/email-already-in-use': 'Este email já está cadastrado.',
    'auth/invalid-email': 'Email inválido.',
    'auth/missing-password': 'Digite sua senha.',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
    'auth/user-not-found': 'Usuário não encontrado.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/invalid-credential': 'Email ou senha incorretos.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
    'auth/popup-closed-by-user': 'Login com Google cancelado.',
    'auth/popup-blocked': 'O navegador bloqueou o popup do Google. Permita popups para este site.',
    'auth/cancelled-popup-request': 'Login com Google cancelado.',
    'auth/network-request-failed': 'Falha de conexão. Verifique sua internet.',
    'auth/requires-recent-login': 'Por segurança, entre novamente antes de repetir essa ação.',
    'auth/operation-not-allowed': 'Login com Google não está habilitado no Firebase Console (Authentication > Sign-in method).',
    'auth/unauthorized-domain': 'Este domínio não está autorizado no Firebase Console (Authentication > Settings > Authorized domains).',
    'auth/configuration-not-found': 'O provedor Google não está configurado no Firebase Console.',
    'auth/internal-error': 'Erro interno do Firebase. Confira se o provedor Google está habilitado no Console.',
    'auth/missing-email': 'Digite seu email.'
  };
  if (mapa[codigo]) return mapa[codigo];
  console.error('Código de erro do Firebase não mapeado:', codigo);
  return `Ocorreu um erro (${codigo || 'desconhecido'}). Veja o console para detalhes.`;
}
