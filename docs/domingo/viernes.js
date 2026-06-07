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
  const ofrendas = getValue("ofrendas");
  const mensaje = getValue("mensaje1");

  const encargadoEspecial = getValue("especialGrupo");
  const esp1 = getValue("esp1");
  const esp2 = getValue("esp2");
  const esp3 = getValue("esp3");

  const puerta = getValue("Puerta");
  const bocadillos = getValue("bocadillos");

  let msg = [];

  // ===============================
  // TÍTULO DINÁMICO
  // ===============================
  if (grupo === "Viernes") {
    msg.push(`*Programa del Viernes*`);
  } else {
    msg.push(`*Culto de ${grupo || "[Grupo]"}*`);
  }

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
  if (ofrendas) msg.push(`*Ofrendas:* ${ofrendas}`);
  if (mensaje) msg.push(`*Mensaje:* ${mensaje}`);

  // ===============================
  // ESPECIALES
  // ===============================
  msg.push(`*Especiales:*`);

  if (grupo === "Viernes") {
    // Viernes → no encargado, just “Especial de [grupo]”
    
  } else {
    // Other groups → show encargado if exists
    if (encargadoEspecial) {
      msg.push(`_Especial de ${grupo} → ${encargadoEspecial}_`);
    } else {
      msg.push(`_Especial de ${grupo}_`);
    }
  }

  // Permanent numbered list (always 3 lines)
  msg.push(`1.${esp1 ? " " + esp1 : ""}`);
  msg.push(`2.${esp2 ? " " + esp2 : ""}`);
  msg.push(`3.${esp3 ? " " + esp3 : ""}`);

  // ===============================
  // PUERTA Y BOCADILLOS
  // ===============================
  if (puerta) msg.push(`*Puerta:* ${puerta}`);
  if (bocadillos) msg.push(`*Bocadillos:* ${bocadillos}`);

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