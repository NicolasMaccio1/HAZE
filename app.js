// =====================================================================
//  CONFIGURACIÓN DE LA TIENDA  —  editá solo esta parte
// =====================================================================
const CONFIG = {
  // Tu WhatsApp en formato internacional, sin espacios ni "+": 549 + código de área + número
  whatsapp: "",
  // Fecha y hora del próximo drop (hora de Argentina)
  proximoDrop: "2026-10-24T20:00:00-03:00",
  unidadesPorDiseno: 30,
  talles: ["S", "M", "L", "XL", "XXL"],
};

// Para agregar, sacar o cambiar remeras, editá esta lista.
// "quedan" es el stock que queda (0 = agotado). "imagen" es el archivo dentro de la carpeta img.
const PRODUCTOS = [
  { nombre: "Rayos X",  color: "Negra", precio: "$ [PRECIO]", quedan: 30, imagen: "img/rayos-x.png",  desc: "Esqueleto en rayos X verde neón, con la H de Haze en el gorro." },
  { nombre: "Calavera", color: "Negra", precio: "$ [PRECIO]", quedan: 24, imagen: "img/calavera.png", desc: "Calavera en rayos X con gorra Haze y pañuelo paisley." },
  { nombre: "Puntos",   color: "Negra", precio: "$ [PRECIO]", quedan: 19, imagen: "img/puntos.png",   desc: "Figura en cuclillas armada con miles de puntos rojos." },
  { nombre: "Cromado",  color: "Negra", precio: "$ [PRECIO]", quedan: 26, imagen: "img/cromado.png",  desc: "Esqueleto de cromo tornasolado que cambia de color con la luz." },
  { nombre: "Rosas",    color: "Negra", precio: "$ [PRECIO]", quedan: 14, imagen: "img/rosas.png",    desc: "Collage en blanco y negro con rosas a color." },
  { nombre: "Besos",    color: "Negra", precio: "$ [PRECIO]", quedan: 9,  imagen: "img/jean.png",     desc: "Jean caído con dos besos rojos en el bolsillo." },
  { nombre: "Ciego",    color: "Negra", precio: "$ [PRECIO]", quedan: 30, imagen: "img/estatua.png",  desc: "Busto de mármol y oro con una venda de código en los ojos." },
  { nombre: "Neón",     color: "Negra", precio: "$ [PRECIO]", quedan: 22, imagen: "img/neon.png",     desc: "Esqueleto de perfil con máscara, en violeta y verde neón." },
  { nombre: "Brillo",   color: "Negra", precio: "$ [PRECIO]", quedan: 17, imagen: "img/mascara.png",  desc: "Máscara cubierta de brillos, de noche y con flash." },
  { nombre: "Pasamontañas", color: "Negra", precio: "$ [PRECIO]", quedan: 27, imagen: "img/pasamontanas.png", desc: "Pasamontañas blanco con los ojos encendidos." },
];
// =====================================================================

const $ = (s, el = document) => el.querySelector(s);
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const wa = (msg) => "https://wa.me/" + String(CONFIG.whatsapp).replace(/\D/g, "") + "?text=" + encodeURIComponent(msg);
const elegido = {};   // talle elegido por remera
const errores = {};

// ---------- enlaces generales de WhatsApp ----------
document.querySelectorAll("[data-wa]").forEach((a) => (a.href = wa("Hola Haze! Quería hacer una consulta.")));

// ---------- datos derivados ----------
function info(p) {
  const total = CONFIG.unidadesPorDiseno;
  const agotado = p.quedan <= 0;
  const ultimas = !agotado && p.quedan <= 5;
  return {
    agotado, ultimas,
    barra: Math.round((Math.max(0, p.quedan) / total) * 100) + "%",
    barraColor: ultimas ? "#ff9f0a" : "#f5f5f7",
    stockTxt: agotado ? "Agotado · 0 de " + total : "Quedan " + p.quedan + " de " + total,
  };
}

function botonesTalle(i, grande) {
  return CONFIG.talles.map((t) => {
    const on = elegido[i] === t;
    return `<button type="button" data-talle="${i}|${t}" aria-pressed="${on}" style="min-width:${grande ? 52 : 44}px;height:${grande ? 48 : 44}px;padding:0 ${grande ? 12 : 10}px;border-radius:${grande ? 14 : 12}px;font-family:inherit;font-size:${grande ? 14 : 13}px;cursor:pointer;transition:background .25s,color .25s;background:${on ? "#f5f5f7" : "transparent"};color:${on ? "#000" : "#e8e8ea"};border:1px solid ${on ? "#f5f5f7" : "rgba(255,255,255,.22)"}">${t}</button>`;
  }).join("");
}

function accion(i, grande) {
  const p = PRODUCTOS[i];
  const t = elegido[i];
  const pad = grande ? "15px 22px" : "11px 20px";
  const fs = grande ? 16 : 14;
  let h = "";
  if (t) {
    const msg = `Hola Haze! Quiero la remera ${p.nombre} (${p.color}) en talle ${t}.`;
    h += `<a href="${esc(wa(msg))}" target="_blank" rel="noopener" style="${grande ? "margin-top:18px;text-align:center;font-weight:500;" : "align-self:flex-start;"}text-decoration:none;font-size:${fs}px;padding:${pad};border-radius:999px;background:#f5f5f7;color:#000">Pedir talle ${t}${grande ? " por WhatsApp" : ""}</a>`;
  } else {
    h += `<button type="button" data-falta="${i}" style="${grande ? "margin-top:18px;font-weight:500;" : "align-self:flex-start;"}font-family:inherit;font-size:${fs}px;padding:${pad};border-radius:999px;background:#f5f5f7;color:#000;border:none;cursor:pointer">${grande ? "Pedir por WhatsApp" : "Pedir"}</button>`;
  }
  if (errores[i] && !t) h += `<p style="margin:${grande ? "6px 0 0" : "-4px 0 0"};font-size:13px;color:#ff6961">Elegí un talle primero.</p>`;
  return h;
}

// ---------- tarjetas ----------
function tarjeta(p, i) {
  const d = info(p);
  const badge = d.agotado
    ? `<span style="position:absolute;top:16px;left:16px;font-size:12px;font-weight:500;background:rgba(255,255,255,.12);color:#f5f5f7;padding:5px 10px;border-radius:999px">Agotado</span>`
    : d.ultimas
    ? `<span style="position:absolute;top:16px;left:16px;display:flex;align-items:center;gap:6px;font-size:12px;font-weight:500;background:rgba(255,159,10,.16);color:#ffb340;padding:5px 10px;border-radius:999px"><span class="dot" style="width:6px;height:6px;border-radius:50%;background:#ff9f0a"></span>Últimas unidades</span>`
    : "";
  const stock = d.agotado
    ? `<p style="margin:8px 0 0;font-family:'Geist Mono',monospace;font-size:12px;color:#a1a1a6">${d.stockTxt}</p>`
    : `<p style="margin:8px 0 0;font-family:'Geist Mono',monospace;font-size:12px;color:#a1a1a6" aria-label="${d.stockTxt}">Quedan <span class="count" style="--to:${p.quedan}"></span> de ${CONFIG.unidadesPorDiseno}</p>`;
  const compra = d.agotado
    ? `<a href="#proximo" style="margin-top:auto;align-self:flex-start;text-decoration:none;font-size:14px;padding:11px 20px;border-radius:999px;color:#f5f5f7;border:1px solid #f5f5f7">Avisame del próximo drop</a>`
    : `<div style="margin-top:auto;display:flex;flex-direction:column;gap:14px"><div role="group" aria-label="Talle" style="display:flex;flex-wrap:wrap;gap:6px">${botonesTalle(i, false)}</div><div data-accion="${i}" style="display:flex;flex-direction:column;gap:14px">${accion(i, false)}</div></div>`;
  return `<div class="reveal" style="display:flex;perspective:900px">
  <article class="card" data-card="${i}" style="position:relative;width:100%;background:#111113;border:1px solid rgba(255,255,255,.08);border-radius:22px;overflow:hidden;display:flex;flex-direction:column">
    <button type="button" data-abrir="${i}" aria-label="Ver detalle de ${esc(p.nombre)}" style="height:280px;width:100%;border:none;padding:0;margin:0;cursor:pointer;font:inherit;display:flex;align-items:center;justify-content:center;position:relative;background:radial-gradient(ellipse at 50% 40%,#232325,#111113 70%)">
      <img class="shirt" src="${esc(p.imagen)}" alt="Remera ${esc(p.nombre)}" loading="lazy" style="height:262px;width:auto;max-width:92%;object-fit:contain">
      ${badge}
      <span style="position:absolute;bottom:14px;right:16px;font-size:12px;color:#86868b">Ver detalle</span>
    </button>
    <div style="padding:20px 22px 24px;display:flex;flex-direction:column;gap:4px;flex-grow:1">
      <h3 style="margin:0;font-weight:600;font-size:19px;letter-spacing:-.01em;color:#f5f5f7">${esc(p.nombre)}</h3>
      <p style="margin:0;font-size:14px;color:#86868b">${esc(p.color)} · Estampado DTF</p>
      <p style="margin:10px 0 0;font-size:15px;color:#e8e8ea">${esc(p.precio)}</p>
      <div style="margin:14px 0 18px"><div style="height:4px;border-radius:4px;background:rgba(255,255,255,.1);overflow:hidden"><div class="bar" style="height:100%;width:${d.barra};background:${d.barraColor};border-radius:4px"></div></div>${stock}</div>
      ${compra}
    </div>
  </article>
</div>`;
}

function pintarGrilla() {
  $("#grid").innerHTML = PRODUCTOS.map(tarjeta).join("");
  $("#dropCount").textContent = ["Cero", "Un", "Dos", "Tres", "Cuatro", "Cinco", "Seis", "Siete", "Ocho", "Nueve", "Diez", "Once", "Doce"][PRODUCTOS.length] || PRODUCTOS.length;
}

function refrescarTarjeta(i) {
  const card = document.querySelector(`[data-card="${i}"]`);
  if (!card) return;
  const grupo = card.querySelector('[role="group"]');
  if (grupo) grupo.innerHTML = botonesTalle(i, false);
  const acc = card.querySelector(`[data-accion="${i}"]`);
  if (acc) acc.innerHTML = accion(i, false);
}

// ---------- ventana de producto ----------
let abierto = null, lado = "frente";
const ESPALDA = `<svg class="float" viewBox="0 0 400 420" width="300" height="316" aria-hidden="true"><path d="M150 22 C170 32 230 32 250 22 L360 62 L392 152 L322 174 L322 404 L78 404 L78 174 L8 152 L40 62 Z" fill="#141415" stroke="#3a3a3c" stroke-width="2"/><path d="M78 174 L78 404 L130 404 L120 180 Z M322 174 L322 404 L270 404 L280 180 Z" fill="#000" fill-opacity=".12"/><path d="M150 22 C170 34 230 34 250 22" fill="none" stroke="#2c2c2e" stroke-width="7"/></svg>`;

function pintarModal() {
  const m = $("#modal");
  if (abierto === null) { m.hidden = true; m.innerHTML = ""; document.body.style.overflow = ""; return; }
  const i = abierto, p = PRODUCTOS[i], d = info(p), fr = lado === "frente";
  const compra = d.agotado
    ? `<a href="#proximo" data-cerrar style="margin-top:18px;text-align:center;text-decoration:none;font-size:16px;padding:15px 22px;border-radius:999px;color:#f5f5f7;border:1px solid #f5f5f7">Agotado · Avisame del próximo drop</a>`
    : `<p style="margin:10px 0 2px;font-size:14px;color:#f5f5f7">Talle <a href="#talles" data-cerrar style="color:#2997ff;text-decoration:none;margin-left:6px">Ver medidas ›</a></p>
       <div role="group" aria-label="Talle" style="display:flex;flex-wrap:wrap;gap:8px">${botonesTalle(i, true)}</div>
       <div data-accion-modal style="display:flex;flex-direction:column">${accion(i, true)}</div>`;
  m.innerHTML = `<div class="backdrop" data-cerrar style="position:fixed;inset:0;z-index:60;background:rgba(0,0,0,.62);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);display:flex;align-items:center;justify-content:center;padding:20px">
  <div role="dialog" aria-modal="true" aria-label="${esc(p.nombre)}" class="sheet" style="position:relative;width:100%;max-width:940px;max-height:calc(100vh - 40px);overflow-y:auto;background:#111113;border:1px solid rgba(255,255,255,.1);border-radius:30px;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))">
    <button type="button" data-cerrar aria-label="Cerrar" style="position:absolute;top:16px;right:16px;z-index:2;width:44px;height:44px;border-radius:50%;border:none;background:rgba(255,255,255,.1);color:#f5f5f7;font-size:22px;line-height:1;cursor:pointer">×</button>
    <div style="position:relative;min-height:440px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:40px 20px;background:radial-gradient(ellipse at 50% 42%,#2a2a2c,#111113 70%)">
      ${fr ? `<img class="float" src="${esc(p.imagen)}" alt="Remera ${esc(p.nombre)}, frente" style="width:min(360px,80vw);height:auto">` : ESPALDA}
      <div role="group" aria-label="Vista" style="display:flex;gap:4px;padding:4px;border-radius:999px;background:rgba(255,255,255,.08)">
        <button type="button" data-lado="frente" aria-pressed="${fr}" style="height:36px;padding:0 16px;border-radius:999px;border:none;font-family:inherit;font-size:13px;cursor:pointer;background:${fr ? "#f5f5f7" : "transparent"};color:${fr ? "#000" : "#e8e8ea"}">Frente</button>
        <button type="button" data-lado="espalda" aria-pressed="${!fr}" style="height:36px;padding:0 16px;border-radius:999px;border:none;font-family:inherit;font-size:13px;cursor:pointer;background:${fr ? "transparent" : "#f5f5f7"};color:${fr ? "#e8e8ea" : "#000"}">Espalda</button>
      </div>
    </div>
    <div style="padding:44px 32px 36px;display:flex;flex-direction:column;gap:8px">
      <p style="margin:0;font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#86868b">Drop 001</p>
      <h3 style="margin:0;font-weight:600;font-size:32px;letter-spacing:-.02em;color:#f5f5f7">${esc(p.nombre)}</h3>
      <p style="margin:0;font-size:15px;color:#86868b">${esc(p.color)} · Estampado DTF</p>
      <p style="margin:8px 0 0;font-size:20px;color:#f5f5f7">${esc(p.precio)}</p>
      <p style="margin:12px 0 0;font-size:16px;line-height:1.6;color:#c7c7cc">${esc(p.desc)}</p>
      <div style="margin:14px 0 0;display:flex;flex-direction:column;gap:6px;font-size:14px;color:#a1a1a6"><span>Algodón peinado 24/1 · Corte oversize</span><span>Estampado DTF · Lavar del revés en frío</span></div>
      <div style="margin:18px 0 6px"><div style="height:4px;border-radius:4px;background:rgba(255,255,255,.1);overflow:hidden"><div style="height:100%;width:${d.barra};background:${d.barraColor};border-radius:4px"></div></div><p style="margin:8px 0 0;font-family:'Geist Mono',monospace;font-size:12px;color:#a1a1a6">${d.stockTxt}</p></div>
      ${compra}
    </div>
  </div>
</div>`;
  m.hidden = false;
  document.body.style.overflow = "hidden";
}

// ---------- clics ----------
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-talle],[data-falta],[data-abrir],[data-lado],[data-cerrar]");
  if (!t) return;
  if (t.dataset.talle) {
    const [i, talle] = t.dataset.talle.split("|");
    elegido[i] = talle; errores[i] = false;
    refrescarTarjeta(i);
    if (abierto !== null) pintarModal();
  } else if (t.dataset.falta !== undefined) {
    errores[t.dataset.falta] = true;
    refrescarTarjeta(t.dataset.falta);
    if (abierto !== null) pintarModal();
  } else if (t.dataset.abrir !== undefined) {
    abierto = +t.dataset.abrir; lado = "frente"; pintarModal();
  } else if (t.dataset.lado) {
    lado = t.dataset.lado; pintarModal();
  } else if (t.hasAttribute("data-cerrar")) {
    if (t.classList.contains("backdrop") && e.target !== t) return;   // clic dentro de la ventana
    abierto = null; pintarModal();
  }
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && abierto !== null) { abierto = null; pintarModal(); } });

// ---------- inclinación 3D de las tarjetas ----------
document.addEventListener("mousemove", (e) => {
  const el = e.target.closest && e.target.closest(".card");
  document.querySelectorAll(".card[data-tilt]").forEach((c) => { if (c !== el) { c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); c.removeAttribute("data-tilt"); } });
  if (!el) return;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
  el.style.setProperty("--ry", ((x - 0.5) * 10).toFixed(2) + "deg");
  el.style.setProperty("--rx", ((0.5 - y) * 10).toFixed(2) + "deg");
  el.style.setProperty("--mx", Math.round(x * 100) + "%");
  el.style.setProperty("--my", Math.round(y * 100) + "%");
  el.setAttribute("data-tilt", "");
});

// ---------- portada: la remera va cambiando ----------
function portada() {
  const stack = $("#heroStack"), dots = $("#heroDots"), name = $("#heroName");
  stack.innerHTML = PRODUCTOS.map((p) => `<div style="position:absolute;inset:0;opacity:0;transform:translateY(26px) scale(.94);filter:blur(14px);transition:opacity 1.2s cubic-bezier(.2,.7,.2,1),transform 1.2s cubic-bezier(.2,.7,.2,1),filter 1.2s ease"><img src="${esc(p.imagen)}" alt="Remera ${esc(p.nombre)}" style="width:380px;height:auto;display:block"></div>`).join("");
  dots.innerHTML = PRODUCTOS.map(() => `<span style="height:6px;border-radius:6px;transition:width .6s cubic-bezier(.2,.7,.2,1),background .6s;width:6px;background:rgba(255,255,255,.28)"></span>`).join("");
  let k = 0;
  const show = () => {
    [...stack.children].forEach((c, j) => { const on = j === k; c.style.opacity = on ? 1 : 0; c.style.transform = on ? "none" : "translateY(26px) scale(.94)"; c.style.filter = on ? "blur(0)" : "blur(14px)"; });
    [...dots.children].forEach((c, j) => { c.style.width = j === k ? "22px" : "6px"; c.style.background = j === k ? "#f5f5f7" : "rgba(255,255,255,.28)"; });
    name.textContent = PRODUCTOS[k].nombre + " · " + PRODUCTOS[k].color;
    k = (k + 1) % PRODUCTOS.length;
  };
  show();
  setInterval(show, 4000);
}

// ---------- cuenta regresiva ----------
function cuenta() {
  const target = Date.parse(CONFIG.proximoDrop);
  const pad = (n) => String(n).padStart(2, "0");
  const tick = () => {
    const s = Math.max(0, Math.floor(((isNaN(target) ? 0 : target) - Date.now()) / 1000));
    $("#cd-d").textContent = pad(Math.floor(s / 86400));
    $("#cd-h").textContent = pad(Math.floor((s % 86400) / 3600));
    $("#cd-m").textContent = pad(Math.floor((s % 3600) / 60));
    $("#cd-s").textContent = pad(s % 60);
  };
  tick();
  setInterval(tick, 1000);
}

// ---------- aviso del próximo drop (abre WhatsApp con el contacto) ----------
$("#avisoBtn").addEventListener("click", () => {
  const v = $("#aviso").value.trim();
  if (!v) { $("#avisoErr").hidden = false; return; }
  $("#avisoErr").hidden = true;
  $("#avisoForm").hidden = true;
  $("#avisoDone").hidden = false;
  window.open(wa("Hola Haze! Quiero que me avisen del próximo drop. Mi contacto: " + v), "_blank", "noopener");
});
$("#aviso").addEventListener("input", () => ($("#avisoErr").hidden = true));

pintarGrilla();
portada();
cuenta();
