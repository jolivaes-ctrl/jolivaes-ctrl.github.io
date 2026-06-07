/* ===============================
   DYNAMIC INPUTS
================================ */

function addInput(containerId, event) {
  if (event) event.preventDefault();

  const container = document.getElementById(containerId);
  if (!container) return;

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Petición de Oración, Nombre de Hno(a)';
  input.style.marginTop = '6px';
  input.style.display = 'block';

  container.appendChild(input);
}

/* ===============================
   HELPERS
================================ */

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function getList(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return [];

  return Array.from(container.querySelectorAll('input'))
    .map(i => i.value.trim())
    .filter(v => v !== '');
}

function formatDateToSpanishTitle(isoDate) {
  if (!isoDate) return '';

  const d = new Date(isoDate);
  if (isNaN(d)) return '';

  const dias = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
  const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

  return `${dias[d.getDay()][0].toUpperCase() + dias[d.getDay()].slice(1)} ${d.getDate()} de ${meses[d.getMonth()]}`;
}

/* ===============================
   MESSAGE BUILDER
================================ */

function buildWhatsAppMessage() {
  let msg = [];

  /* -------- MENSAJE INICIAL -------- */
  const saludo = getValue('Saludos');
  const finalMessage = getValue('finalMessage');
  const fecha = formatDateToSpanishTitle(getValue('serviceDate'));

  if (saludo) msg.push(saludo);
  msg.push('*Ayuno*');
  if (fecha) msg.push(`_${fecha}_`);
  msg.push('');

  /* -------- PARTE 1 -------- */
  msg.push('_*Parte 1*_');

  msg.push(`*Oración y adoración:* ${getValue('oracion')}`);
  msg.push(`*Lectura:* ${getValue('lectura')}`);
  msg.push('');

  /* -------- PARTE 2 -------- */
  msg.push('_*Parte 2*_');

  msg.push(`*Dirigir:* ${getValue('dirigir1')}`);
  msg.push(`*Adoración:* ${getValue('adoracion1')}`);
  msg.push(`*Enseñanza:* ${getValue('enseñanza1')}`);

  const oraciones2 = getList('oracion2-container');
  if (oraciones2.length) {
    msg.push('*Oración:*');
    oraciones2.forEach(o => msg.push(`- ${o}`));
  }

  msg.push('');

  /* -------- PARTE 3 -------- */
  msg.push('_*Parte 3*_');

  msg.push(`*Dirigir:* ${getValue('dirigir2')}`);
  msg.push(`*Adoración:* ${getValue('adoracion2')}`);
  msg.push(`*Enseñanza:* ${getValue('enseñanza2')}`);

  const oraciones3 = getList('oracion3-container');
  if (oraciones3.length) {
    msg.push('*Oración:*');
    oraciones3.forEach(o => msg.push(`- ${o}`));
  }

 if (finalMessage) {
    msg.push("");
    msg.push(finalMessage);
  }

  return msg.join("\n");
}


/* ===============================
   SEND TO WHATSAPP
================================ */


function sendToWhatsApp() {
  const message = buildWhatsAppMessage1();
  const url = "https://api.whatsapp.com/send?text=" + encodeURIComponent(message);
  window.open(url, "_blank");
}


/* ===============================
   TEXTAREA AUTO-GROW
================================ */

function autoGrow(el) {
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}
/* ===============================
   END OF FILE

================================ */
