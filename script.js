// ===============================
// PQRS Musicala – script.js
// ===============================

// Pega tu URL de Apps Script (termina en /exec)
const API_URL = 'https://script.google.com/macros/s/AKfycbwAztuidOd38DoSlYKrPRPTqWENeVMxqD-oRA_xPH4byaK1Z5m55jJeKAOR-AFPdEsnUA/exec';

const form = document.getElementById('pqrsForm');
const msg  = document.getElementById('msg');
const btn  = document.getElementById('sendBtn');

// Accesos rápidos a los campos
const sede = form?.elements?.sede;
const area = form?.elements?.area;
const cat  = form?.elements?.categoria;
const ctx  = form?.elements?.contexto;
const com  = form?.elements?.comentario;
const rat  = form?.elements?.rating;

function setMessage(t){ if (msg) msg.textContent = t || ''; }
function setBusy(b){ if (btn) btn.disabled = !!b; }

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  setMessage('');
  setBusy(true);

  // Validaciones mínimas
  if (!sede?.value) { setMessage('Selecciona una sede.'); setBusy(false); return; }
  if (!area?.value) { setMessage('Selecciona un área.'); setBusy(false); return; }
  if (!cat?.value)  { setMessage('Selecciona una categoría.'); setBusy(false); return; }
  if (!com?.value?.trim()) { setMessage('Escribe tu comentario.'); setBusy(false); return; }

  // Preparamos el cuerpo
  const body = new URLSearchParams(new FormData(form));
  const controller = new AbortController();
  const t = setTimeout(()=>controller.abort(), 15000);

  try {
    const res = await fetch(API_URL, { method:'POST', body, signal:controller.signal });
    clearTimeout(t);

    let ok = res.ok;
    try {
      const data = await res.clone().json();
      ok = ok && data?.ok !== false;
      if (!ok && data?.error) setMessage('No se pudo guardar: ' + data.error);
    } catch {}

    if (ok) {
      setMessage('¡Gracias! Tu comentario fue guardado.');
      form.reset();
      if (sede) sede.selectedIndex = 0;
      if (area) area.selectedIndex = 0;
      if (cat)  cat.selectedIndex  = 0;
      if (rat)  rat.selectedIndex  = 0;
    } else {
      setMessage('No se pudo guardar. Intenta nuevamente.');
    }
  } catch(err) {
    setMessage(err?.name === 'AbortError' ? 'Conexión lenta. Intenta otra vez.' : 'Error de red. Intenta nuevamente.');
  } finally {
    setBusy(false);
  }
});
