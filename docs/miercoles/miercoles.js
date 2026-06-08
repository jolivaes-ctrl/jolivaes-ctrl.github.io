function getValue(id) {
  return document.getElementById(id)?.value.trim() || "";
}

function autoGrow(el) {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = el.scrollHeight + "px";
}

function formatDateToSpanish(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const dias = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
  const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  return `${dias[date.getDay()][0].toUpperCase() + dias[date.getDay()].slice(1)} ${d} de ${meses[m-1]}`;
}

function buildFinalMessage() {
  const grupo = getValue("Grupo");
  const fecha = formatDateToSpanish(getValue("serviceDate"));
  const mensajeInicial = getValue("mensajeInicial");
  const mensajeFinal = getValue("mensajeFinal");

  const director = getValue("Director");
  const alabanzas = getValue("alabanzas");
  const mensaje = getValue("mensaje1");

  const puerta = getValue("Puerta");

  let msg = [];

  // ===============================
  // TÍTULO DINÁMICO
  // ===============================
  
  msg.push(`*CULTO DE ORACIÓN*`)
  msg.push(`_${fecha}_`);
  msg.push("");

  // ===============================
  // MENSAJE INICIAL
  // ===============================
  if (mensajeInicial) {
    msg.push(mensajeInicial);
    msg.push("");
  }

  // ===============================
  // PROGRAMA PRINCIPAL
  // ===============================
  if (director) msg.push(`*Dirección:* ${director}`);
  if (alabanzas) msg.push(`*Alabanzas:* ${alabanzas}`);
  if (mensaje) msg.push(`*Mensaje:* ${mensaje}`);

  msg.push("");

  // ===============================
  // MENSAJE FINAL
  // ===============================
  if (mensajeFinal) msg.push(mensajeFinal);

  return msg.join("\n");
}

function sendToWhatsApp() {
  const message = buildFinalMessage();
  const url = "https://api.whatsapp.com/send?text=" + encodeURIComponent(message);
  window.open(url, "_blank");
}
