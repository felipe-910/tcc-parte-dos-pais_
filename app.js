if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2200);
}

function validateField(input) {
  const field = input.closest('.field');
  if (!field) return true;
  const valid = input.checkValidity();
  field.classList.toggle('has-error', !valid);
  return valid;
}

function attachFormValidation(form, onValid) {
  if (!form) return;
  form.querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', () => validateField(input));
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('input[required]').forEach((input) => {
      if (!validateField(input)) ok = false;
    });
    if (ok) onValid();
  });
}

// Monta a URL de um ícone usando a API pública do Iconify (https://iconify.design)
// nome: "prefixo:icone" (ex: "mdi:food-apple"), cor: hex sem "#" (ex: "6fa981")
function iconUrl(nome, cor) {
  const base = `https://api.iconify.design/${nome}.svg`;
  return cor ? `${base}?color=%23${cor}` : base;
}
