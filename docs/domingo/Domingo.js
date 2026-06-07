// remember tha document//
// my-website , WMscript2.js //

// UTF-8 percent-encode a string using TextEncoder when available.
function utf8PercentEncode(str) {
  try {
    if (typeof TextEncoder !== 'undefined') {
      const encoder = new TextEncoder();
      const bytes = encoder.encode(String(str));
      return Array.from(bytes).map(b => '%' + b.toString(16).toUpperCase().padStart(2, '0')).join('');
    }
  } catch (e) {
    // fall through to fallback below
  }
  // fallback: use encodeURIComponent (usually fine)
  return encodeURIComponent(String(str));
}

// Read form values in one place
function getFormValues() {
  return {
    serviceDate: document.getElementById('serviceDate')?.value || '',
    dirige: document.getElementById('dirige')?.value || '',
    alabanzas: document.getElementById('alabanzas')?.value || '',
    ofrendas: document.getElementById('ofrendas')?.value || '',
    mensaje: document.getElementById('mensaje')?.value || '',
    puerta: document.getElementById('puerta')?.value || '',
    parqueo: document.getElementById('parqueo')?.value || '',
    bocadillos: document.getElementById('bocadillos')?.value || '',
    recordatorio: document.getElementById('recordatorioMessage')?.value || '',
    whatsappMessage: document.getElementById('whatsappMessage')?.value || ''
  };
}

function formatDateToSpanish(isoDate) {
  if (!isoDate) return '';
  const parts = String(isoDate).split('-');
  if (parts.length < 3) return isoDate;
  const year = parseInt(parts[0], 10);
  const monthIndex = parseInt(parts[1], 10) - 1;
  const dayOfMonth = parseInt(parts[2], 10);
  const date = new Date(year, monthIndex, dayOfMonth);
  if (isNaN(date.getTime())) return isoDate;

  const weekdays = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  const weekday = weekdays[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  return `${capitalizedWeekday}, ${day} de ${month}`;
}

function formatDateToSpanishTitle(isoDate) {
  if (!isoDate) return '';
  const parts = String(isoDate).split('-');
  if (parts.length < 3) return '';
  const year = parseInt(parts[0], 10);
  const monthIndex = parseInt(parts[1], 10) - 1;
  const dayOfMonth = parseInt(parts[2], 10);
  const date = new Date(year, monthIndex, dayOfMonth);
  if (isNaN(date.getTime())) return '';

  const weekdays = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  const weekday = weekdays[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const capWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  const capMonth = month.charAt(0).toUpperCase() + month.slice(1);
  return `${capWeekday}, ${day} de ${capMonth}`;
}

function buildFinalMessage(overrideFinalSpecial) {
  const vals = getFormValues();
  const firstSpecial = vals.recordatorio.trim();
  const finalSpecial = (typeof overrideFinalSpecial !== 'undefined' && overrideFinalSpecial !== null && String(overrideFinalSpecial).trim() !== '')
    ? String(overrideFinalSpecial).trim()
    : vals.whatsappMessage.trim();

  const serviceDateFormatted = formatDateToSpanish(vals.serviceDate);
  const serviceDateTitle = formatDateToSpanishTitle(vals.serviceDate);

const lines = [];

if (vals.dirige)   lines.push(`*Dirige:* ${vals.dirige}`);
if (vals.alabanzas) lines.push(`*Alabanzas:* ${vals.alabanzas}`);
if (vals.ofrendas) lines.push(`*Ofrendas:* ${vals.ofrendas}`);
if (vals.mensaje)  lines.push(`*Mensaje:* ${vals.mensaje}`);

// ONLY show these if filled
if (vals.puerta)   lines.push(`*Puerta:* ${vals.puerta}`);
if (vals.parqueo)  lines.push(`*Parqueo:* ${vals.parqueo}`);
if (vals.bocadillos) lines.push(`*Bocadillos:* ${vals.bocadillos}`);

const formLines = lines.join('\n');

  let finalMessage = '';
  if (firstSpecial) finalMessage += firstSpecial + '\n\n';
  if (serviceDateTitle) finalMessage += `*${serviceDateTitle}*` + '\n\n';
  finalMessage += formLines;
  if (finalSpecial) finalMessage += '\n\n' + finalSpecial;
  
  return finalMessage;
}

function buildWhatsAppUrl(message) {
  // Encode UTF-8 + preserve newlines
  const encoded = encodeURIComponent(message).replace(/%20/g, '+');
  return 'https://api.whatsapp.com/send?text=' + encoded;
}

function sendToWhatsApp(specialText) {
  const finalMessage = buildFinalMessage(specialText);
  const finalUrl = buildWhatsAppUrl(finalMessage);
  console.log('WhatsApp URL:', finalUrl);
  try {
    window.open(finalUrl, '_blank');
  } catch (e) {
    // fallback: navigate
    window.location.href = finalUrl;
  }
}

function debugWhatsAppUrl() {
  const finalMessage = buildFinalMessage();
  const apiUrl = buildWhatsAppUrl(finalMessage);
  // also provide the wa.me short link variant
  const waMeUrl = 'https://wa.me/?text=' + utf8PercentEncode(finalMessage);

  // Log both URLs
  console.log('WhatsApp URL (api):', apiUrl);
  console.log('WhatsApp URL (wa.me):', waMeUrl);

  // Populate the on-page debug box for easy copy/paste and inspection
  const dbg = document.getElementById('whatsappDebug');
  if (dbg) {
    dbg.style.display = 'block';
    dbg.innerHTML = '';

    const preMsg = document.createElement('pre');
    preMsg.textContent = 'Final message:\n' + finalMessage;
    preMsg.style.whiteSpace = 'pre-wrap';
    preMsg.style.marginBottom = '8px';
    dbg.appendChild(preMsg);

    const addUrlRow = (label, url) => {
      const div = document.createElement('div');
      div.style.marginBottom = '6px';
      const strong = document.createElement('strong');
      strong.textContent = label + ': ';
      div.appendChild(strong);
      const a = document.createElement('a');
      a.href = url;
      a.textContent = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.style.display = 'inline-block';
      a.style.marginRight = '8px';
      div.appendChild(a);

      const copyBtn = document.createElement('button');
      copyBtn.textContent = 'Copy';
      copyBtn.addEventListener('click', () => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(() => {
            copyBtn.textContent = 'Copied!';
            setTimeout(() => copyBtn.textContent = 'Copy', 1500);
          }).catch(() => alert('Unable to copy'));
        } else {
          alert('Clipboard API not available');
        }
      });
      div.appendChild(copyBtn);

      const openBtn = document.createElement('button');
      openBtn.textContent = 'Open';
      openBtn.style.marginLeft = '6px';
      openBtn.addEventListener('click', () => {
        try { window.open(url, '_blank'); } catch (e) { window.location.href = url; }
      });
      div.appendChild(openBtn);

      dbg.appendChild(div);
    };

    addUrlRow('api.whatsapp.com', apiUrl);
    addUrlRow('wa.me', waMeUrl);
  }
}

// expose helpers for debugging from browser console / HTML buttons
window.buildFinalMessage = buildFinalMessage;
window.buildWhatsAppUrl = buildWhatsAppUrl;
window.debugWhatsAppUrl = debugWhatsAppUrl;
window.sendToWhatsApp = sendToWhatsApp;

// Auto-grow helper for the invitation textarea
function autoGrow(el) {
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = (el.scrollHeight) + 'px';
}

// Initialize textarea height on load (in case there's prefilled content)
window.addEventListener('DOMContentLoaded', function () {
  const ta = document.getElementById('whatsappMessage');
  if (ta) autoGrow(ta);
});

// Insert an emoji (or any text) into an input/textarea at the cursor position
function insertEmoji(ch, targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;

  // For inputs (type=text) and textareas, handle insertion at cursor
  const isTextArea = el.tagName.toLowerCase() === 'textarea';
  try {
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const value = el.value || '';
    el.value = value.slice(0, start) + ch + value.slice(end);
    const newPos = start + ch.length;
    el.selectionStart = el.selectionEnd = newPos;
    el.focus();
    if (isTextArea) autoGrow(el);
  } catch (e) {
    // fallback: append and focus
    el.value = (el.value || '') + ch;
    el.focus();
    if (isTextArea) autoGrow(el);
  }
}

// Show/hide emoji palette near focused input with data-emoji="true"
function setupEmojiPalette() {
  const palette = document.getElementById('emojiPalette');
  if (!palette) return;

  function showForTarget(target) {
    // append palette to body and position it under the target element
    if (document.body && palette.parentElement !== document.body) document.body.appendChild(palette);
    const rect = target.getBoundingClientRect();
    const top = rect.bottom + window.scrollY + 6; // small gap
    const left = rect.left + window.scrollX;
    palette.style.top = top + 'px';
    palette.style.left = left + 'px';
    palette.classList.add('show');
    palette.setAttribute('aria-hidden', 'false');
  }

  // Prevent the input from losing focus when the user presses an emoji button
  // This avoids a race where blur/hide happens before the click fires.
  palette.addEventListener('mousedown', (e) => { e.preventDefault(); });
  palette.addEventListener('touchstart', (e) => { /* prevent mobile blur */ e.preventDefault(); });

  function hidePalette() {
    palette.classList.remove('show');
    palette.setAttribute('aria-hidden', 'true');
  }

  document.addEventListener('focusin', (e) => {
    const t = e.target;
    if (t && t.getAttribute && t.getAttribute('data-emoji') === 'true') {
      showForTarget(t);
    } else if (palette.contains(t)) {
      // focusing inside the palette (e.g., clicking a button) -> keep it shown
      return;
    } else {
      // if focusing somewhere else, hide the palette
      hidePalette();
    }
  });

  // hide palette when clicking outside
  document.addEventListener('click', (e) => {
    if (!palette.contains(e.target) && !(e.target && e.target.getAttribute && e.target.getAttribute('data-emoji') === 'true')) {
      hidePalette();
    }
  });

  // hide on scroll/resize to avoid mispositioned palette
  window.addEventListener('scroll', hidePalette);
  window.addEventListener('resize', hidePalette);
}

// initialize on DOM ready
window.addEventListener('DOMContentLoaded', function () {
  const ta = document.getElementById('whatsappMessage');
  if (ta) autoGrow(ta);
  setupEmojiPalette();
});

// Show QR code for the current page URL so a phone can scan to open it.
function showQr() {
  const qrArea = document.getElementById('qrArea');
  const qrImage = document.getElementById('qrImage');
  const qrMessage = document.getElementById('qrMessage');
  if (!qrArea || !qrImage || !qrMessage) return;

  const pageUrl = window.location.href;
  // allow overriding host (useful when page is served as localhost but phone needs PC IP)
  const hostOverride = (document.getElementById('qrHost') && document.getElementById('qrHost').value) ? String(document.getElementById('qrHost').value).trim() : '';
  let effectiveUrl = pageUrl;
  if (hostOverride) {
    try {
      const u = new URL(pageUrl);
      // preserve path and query, only replace host and port
      const newUrl = u.protocol + '//' + hostOverride + u.pathname + u.search + u.hash;
      effectiveUrl = newUrl;
    } catch (e) {
      // if URL parsing fails, fallback to pageUrl
      effectiveUrl = pageUrl;
    }
  }
  // If the page is opened via file:// you'll need to serve it via HTTP for phone access
  if (pageUrl.startsWith('file://')) {
    qrArea.style.display = 'block';
    qrMessage.textContent = 'This page is opened from local files (file://). To open from a phone, serve the folder with a local web server (see README).';
    qrImage.src = '';
    return;
  }
  // Prefer an in-page QR library (offline). If it's not available, try to load it
  // dynamically from a CDN. As a last resort we fall back to the external QR image
  // generator (requires network).
  function renderWithLib() {
    try {
      // create a temporary container for QRCode to render into
      const tmp = document.createElement('div');
      tmp.style.position = 'absolute';
      tmp.style.left = '-9999px';
      document.body.appendChild(tmp);
      // QRCode constructor provided by common QR libs (e.g., davidshimjs/qrcodejs)
  const q = new QRCode(tmp, { text: effectiveUrl, width: 300, height: 300, colorDark: '#000000', colorLight: '#ffffff' });
      // try to extract an <img> or <canvas> data URL
      const img = tmp.querySelector('img');
      if (img && img.src) {
        qrImage.src = img.src;
      } else {
        const canvas = tmp.querySelector('canvas');
        if (canvas && canvas.toDataURL) qrImage.src = canvas.toDataURL('image/png');
        else qrImage.src = '';
      }
  qrMessage.textContent = 'Scan this QR to open: ' + effectiveUrl;
      qrArea.style.display = 'block';
      // cleanup temporary node
      setTimeout(() => { try { document.body.removeChild(tmp); } catch(e){} }, 50);
    } catch (err) {
      qrMessage.textContent = 'QR generation failed: ' + (err && err.message ? err.message : String(err));
      qrArea.style.display = 'block';
    }
  }

  if (window.QRCode) {
    renderWithLib();
    return;
  }

  // Dynamically load a small QR library from CDN (only if online).
  qrMessage.textContent = 'Loading QR generator...';
  const script = document.createElement('script');
  // Using a widely available CDN location for davidshimjs/qrcodejs
  script.src = 'https://cdn.jsdelivr.net/gh/davidshimjs/qrcodejs@master/qrcode.min.js';
  script.async = true;
  script.onload = function () {
    try { renderWithLib(); } catch (e) {
      // fallback to external image
      const size = 300;
  const api = 'https://api.qrserver.com/v1/create-qr-code/';
  qrImage.src = api + '?size=' + size + 'x' + size + '&data=' + encodeURIComponent(effectiveUrl);
  qrMessage.textContent = 'Scan this QR to open: ' + effectiveUrl + '\n(Note: offline QR generation library loaded fallback)';
      qrArea.style.display = 'block';
    }
  };
  script.onerror = function () {
    // offline or CDN failed; show message and use external image as a best-effort fallback
    const size = 300;
  const api = 'https://api.qrserver.com/v1/create-qr-code/';
  qrImage.src = api + '?size=' + size + 'x' + size + '&data=' + encodeURIComponent(effectiveUrl);
  qrMessage.textContent = 'QR library not available locally and CDN failed. Showing generated image as fallback. To make QR work offline, add a local qrcode.min.js to the project (I can add it).';
    qrArea.style.display = 'block';
  };
  document.head.appendChild(script);
}

window.showQr = showQr;
