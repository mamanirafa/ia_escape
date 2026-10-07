/* =========================================================
   BÓVEDA NEURAL · Motor del juego
   ========================================================= */
(() => {
  "use strict";

  /* ---------- utilidades ---------- */
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const norm = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase().replace(/\s+/g, "").trim();
  const fmt = (ms) => { const neg = ms < 0; ms = Math.abs(ms); const m = Math.floor(ms / 60000), s = Math.floor((ms % 60000) / 1000); return (neg ? "+" : "") + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0"); };
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const titleCase = (s) => s.toLowerCase().replace(/(^|\s|-)(\p{L})/gu, (m, a, b) => a + b.toUpperCase());

  /* ---------- estado ---------- */
  const TOTAL_MS = CONFIG.minutos * 60000;
  const fresh = () => ({ name: "", startedAt: 0, penaltyMs: 0, unlocked: 0, keywords: [], resets: 0, hints: 0, hintRooms: [], finishedAt: 0, promptText: "", sound: true });
  let S = fresh();
  let room = null, roomIdx = -1, stageIdx = -1;
  let timerId = null;

  function save() { try { localStorage.setItem(CONFIG.storageKey, JSON.stringify(S)); } catch (e) {} }
  function load() { try { const r = localStorage.getItem(CONFIG.storageKey); return r ? Object.assign(fresh(), JSON.parse(r)) : null; } catch (e) { return null; } }
  function wipe() { try { localStorage.removeItem(CONFIG.storageKey); } catch (e) {} }

  /* ---------- pantallas ---------- */
  function show(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.toggle("active", s.id === id));
    $("#hud").classList.toggle("hidden", id === "screen-welcome");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toast(msg, ms = 2600) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), ms);
  }

  function modal({ html, buttons = [{ label: "Entendido", cls: "btn-primary" }], alert = false }) {
    return new Promise(res => {
      $("#modal-box").classList.toggle("alert", alert);
      $("#modal-content").innerHTML = html;
      const act = $("#modal-actions"); act.innerHTML = "";
      buttons.forEach((b, i) => {
        const el = document.createElement("button");
        el.className = "btn " + (b.cls || "btn-ghost"); el.textContent = b.label;
        el.onclick = () => { $("#modal").classList.add("hidden"); res(b.value ?? i); };
        act.appendChild(el);
      });
      $("#modal").classList.remove("hidden");
      act.querySelector("button")?.focus();
    });
  }

  /* ---------- HUD y tiempo ---------- */
  function elapsed() { return ((S.finishedAt || Date.now()) - S.startedAt) + S.penaltyMs; }
  function renderTimer() {
    const rem = TOTAL_MS - elapsed();
    const el = $("#hud-timer");
    el.textContent = fmt(rem);
    el.classList.toggle("low", rem < 10 * 60000 && rem >= 0);
    el.classList.toggle("over", rem < 0);
    if (rem < 0 && !S._overWarned && !S.finishedAt) {
      S._overWarned = true;
      toast("⏰ ¡Se terminaron los 60 minutos! Podés seguir en tiempo extra.", 4000);
    }
  }
  function startTimer() { clearInterval(timerId); renderTimer(); timerId = setInterval(renderTimer, 1000); }

  function renderHUD() {
    $("#hud-name").textContent = S.name;
    $("#hud-keys").innerHTML = ROOMS.map((r, i) => {
      const got = S.keywords[i];
      return `<span class="key-slot ${got ? "got" : ""}" title="Sala ${i + 1}">${got ? esc(got) : i + 1}</span>`;
    }).join("");
    $("#btn-sound").textContent = S.sound ? "🔊" : "🔇";
  }

  /* ---------- bienvenida ---------- */
  function initWelcome() {
    const saved = load();
    if (saved && saved.name) {
      $("#resume-box").classList.remove("hidden");
      $("#resume-name").textContent = saved.name;
      $("#form-name").classList.add("hidden");
      $("#btn-resume").onclick = () => { S = saved; SFX.set(S.sound); beginGame(); };
      $("#btn-new").onclick = async () => {
        const ok = await modal({ html: `<h3>¿Nuevo jugador?</h3><p>Se borrará la partida de <strong>${esc(saved.name)}</strong>.</p>`, buttons: [{ label: "Cancelar", value: false }, { label: "Sí, borrar", cls: "btn-gold", value: true }] });
        if (ok) { wipe(); location.reload(); }
      };
    }
    $("#form-name").addEventListener("submit", (e) => {
      e.preventDefault();
      const raw = $("#input-name").value.replace(/\s+/g, " ").trim();
      if (raw.length < 3 || !/\p{L}{2,}/u.test(raw)) { toast("Escribí tu nombre y apellido (mínimo 3 letras)."); $("#input-name").focus(); return; }
      S = fresh(); S.name = titleCase(raw); S.startedAt = Date.now(); save();
      SFX.click();
      beginGame(true);
    });
  }

  async function beginGame(first = false) {
    renderHUD(); startTimer();
    if (S.finishedAt) { showCertificate(); return; }
    renderMap(); show("screen-map");
    if (first) {
      await modal({
        html: `<img src="assets/img/aria.svg" alt=""><h3>Hola, ${esc(S.name)}</h3>
               <p>Soy <b>ARIA</b>, la IA del banco. Tuve un error y cerré todo. 😬</p>
               <p class="explain">• Resolvé las salas en orden.<br>• Cada sala te da una <b>palabra clave</b>: anotala.<br>• Un error = la sala se reinicia.<br>• Las pistas suman 2 minutos.<br>• Tenés 60 minutos. ¡El reloj ya corre!</p>`,
        buttons: [{ label: "¡Vamos! ▶", cls: "btn-primary" }]
      });
    }
  }

  /* ---------- mapa ---------- */
  const MAP_LINES = [
    "Tu primera misión es el <b>Centro de Datos</b>. Tocá la puerta 1 para empezar.",
    "¡Bien! Ya tenés tu primera palabra. Seguí con <b>Cumplimiento</b>: ahí se cuida la ética de los datos.",
    "Vas muy bien. Ahora el <b>Laboratorio de Algoritmos</b>: pensá como una computadora.",
    "Mitad del camino. En la <b>Fábrica de Modelos</b> vas a usar la cámara con una IA de visión real.",
    "¡Excelente! En el <b>Estudio de Prompts</b> vas a darle instrucciones a una IA de verdad.",
    "Última sala: la <b>Sala de Verificación</b>. No confíes en todo lo que dice una IA… ni siquiera en mí.",
    "¡Tenés las 6 palabras! Andá a la <b>bóveda final</b> y escribilas en orden."
  ];
  function renderMap() {
    $("#map-speech").innerHTML = `<b>ARIA:</b> ${MAP_LINES[Math.min(S.unlocked, 6)]}`;
    $("#map-grid").innerHTML = ROOMS.map((r, i) => {
      const done = !!S.keywords[i];
      const open = !done && i === S.unlocked;
      const cls = done ? "done" : open ? "open" : "locked";
      const badge = done ? "✔ Resuelta" : open ? "Abierta" : "🔒 Bloqueada";
      return `<div class="door ${cls}" data-i="${i}" tabindex="0" role="button" aria-label="Sala ${i + 1}: ${esc(r.nombre)}">
        <span class="badge">${badge}</span>
        <img src="${r.icono}" alt="">
        <h3>${i + 1}. ${esc(r.nombre)}</h3>
        <p>${esc(r.tema)} · ~${r.minutosSugeridos} min</p>
        ${done ? `<div class="kw">🔑 ${esc(S.keywords[i])}</div>` : ""}
      </div>`;
    }).join("");
    document.querySelectorAll(".door").forEach(d => {
      const go = () => {
        const i = +d.dataset.i;
        if (S.keywords[i]) return toast(`Ya resolviste esta sala. Tu palabra es ${S.keywords[i]}.`);
        if (i !== S.unlocked) { SFX.error(); return toast("🔒 Primero resolvé la sala anterior."); }
        SFX.click(); enterRoom(i);
      };
      d.onclick = go; d.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } };
    });
    const all = S.keywords.filter(Boolean).length === ROOMS.length;
    $("#btn-vault").disabled = !all;
    $("#vault-status").textContent = all ? "¡Lista para abrir! Escribí las 6 palabras en orden." : `Palabras obtenidas: ${S.keywords.filter(Boolean).length} de ${ROOMS.length}.`;
  }

  /* ---------- salas ---------- */
  function enterRoom(i) {
    roomIdx = i; room = ROOMS[i]; stageIdx = -1;
    $("#room-icon").src = room.icono;
    $("#room-kicker").textContent = `Sala ${i + 1} de ${ROOMS.length} · ${room.tema}`;
    $("#room-title").textContent = room.nombre;
    show("screen-room");
    renderIntro();
  }

  function leaveRoom() { Vision.stopCamera(); room = null; roomIdx = -1; renderMap(); show("screen-map"); }

  function setProgress() {
    const p = stageIdx < 0 ? 0 : (stageIdx / room.etapas.length) * 100;
    $("#room-progress").style.width = p + "%";
  }

  function renderIntro() {
    setProgress();
    $("#room-body").innerHTML = `
      <div class="card" style="display:flex;gap:18px;align-items:center;flex-wrap:wrap">
        <img src="assets/img/aria.svg" alt="" style="width:110px">
        <div style="flex:1;min-width:220px">
          <p class="stage-title">ARIA dice:</p>
          <p>${esc(room.intro)}</p>
          <p class="stage-sub">Desafíos en esta sala: <b>${room.etapas.length}</b>. Si te equivocás en cualquiera, la sala se reinicia.</p>
          <button class="btn btn-primary" id="btn-start-room">Comenzar sala ▶</button>
        </div>
      </div>`;
    $("#btn-start-room").onclick = () => { SFX.click(); nextStage(); };
  }

  function nextStage() {
    stageIdx++;
    setProgress();
    if (stageIdx >= room.etapas.length) return completeRoom();
    $("#room-body").classList.remove("noanim");
    const st = room.etapas[stageIdx];
    const R = RENDER[st.tipo];
    R(st);
  }

  async function failRoom(explain) {
    SFX.alarm();
    document.body.classList.add("alarm");
    setTimeout(() => document.body.classList.remove("alarm"), 1600);
    S.resets++; save();
    Vision.stopCamera();
    const msg = ALERTAS[Math.floor(Math.random() * ALERTAS.length)];
    await modal({
      alert: true,
      html: `<img src="assets/img/alerta.svg" alt=""><h3>¡SALA REINICIADA!</h3><p>${esc(msg)}</p>${explain ? `<p class="explain">${explain}</p>` : ""}`,
      buttons: [{ label: "Reintentar la sala ↻", cls: "btn-gold" }]
    });
    stageIdx = -1; nextStage();
  }

  async function completeRoom() {
    Vision.stopCamera();
    S.keywords[roomIdx] = room.palabra;
    S.unlocked = Math.max(S.unlocked, roomIdx + 1);
    save(); renderHUD();
    SFX.key();
    $("#room-progress").style.width = "100%";
    $("#room-body").innerHTML = `
      <div class="card reveal">
        <img src="assets/img/llave.svg" alt="">
        <p class="stage-sub" style="margin:10px 0 0">¡Sala superada, ${esc(S.name.split(" ")[0])}! Tu palabra clave ${roomIdx + 1} es:</p>
        <div class="keyword">${esc(room.palabra)}</div>
        <p class="stage-sub">Anotala: la vas a necesitar en la bóveda final.</p>
        <button class="btn btn-primary" id="btn-room-done">Volver al mapa ▶</button>
      </div>`;
    $("#btn-room-done").onclick = () => { SFX.click(); leaveRoom(); };
  }

  function header(st, extra = "") {
    return `<p class="stage-title">Desafío ${stageIdx + 1}/${room.etapas.length} · ${esc(st.titulo)}</p>
            ${st.consigna ? `<p class="stage-sub">${esc(st.consigna)}</p>` : ""}${extra}`;
  }

  /* ---------- tipos de etapa ---------- */
  const RENDER = {
    classify(st) {
      const items = shuffle(st.items).slice(0, st.cantidad || st.items.length);
      let k = 0;
      const draw = () => {
        const it = items[k];
        $("#room-body").innerHTML = `<div class="card">${header(st)}
          <div class="counter">CASO ${k + 1} DE ${items.length}</div>
          <div class="case">${esc(it.texto)}</div>
          <div class="options">${st.opciones.map(o => `<button class="opt" data-v="${esc(o)}">${esc(o)}</button>`).join("")}</div></div>`;
        document.querySelectorAll(".opt").forEach(b => b.onclick = async () => {
          document.querySelectorAll(".opt").forEach(x => x.disabled = true);
          if (b.dataset.v === it.r) {
            b.classList.add("correct"); SFX.ok(); await sleep(650);
            k++; k < items.length ? draw() : nextStage();
          } else {
            b.classList.add("wrong"); SFX.error(); await sleep(500);
            failRoom(`Caso: “${esc(it.texto)}”<br>Respuesta correcta: <b>${esc(it.r)}</b>.`);
          }
        });
      };
      draw();
    },

    mcq(st) {
      const ops = shuffle(st.opciones);
      $("#room-body").innerHTML = `<div class="card">${header(st)}
        <div class="case">${esc(st.pregunta)}</div>
        <div class="options col">${ops.map((o, i) => `<button class="opt" data-i="${i}">${esc(o.t)}</button>`).join("")}</div></div>`;
      document.querySelectorAll(".opt").forEach(b => b.onclick = async () => {
        document.querySelectorAll(".opt").forEach(x => x.disabled = true);
        const o = ops[+b.dataset.i];
        if (o.ok) { b.classList.add("correct"); SFX.ok(); await sleep(700); nextStage(); }
        else { b.classList.add("wrong"); SFX.error(); await sleep(500); failRoom(`La respuesta correcta era: <b>${esc(ops.find(x => x.ok).t)}</b>`); }
      });
    },

    match(st) {
      const pares = shuffle(st.pares);
      const ders = shuffle(st.pares.map(p => p.der));
      $("#room-body").innerHTML = `<div class="card">${header(st)}
        ${pares.map((p, i) => `<div class="match-row"><div>${esc(p.izq)}</div>
          <select data-i="${i}" aria-label="Habilidad"><option value="">Elegí…</option>${ders.map(d => `<option>${esc(d)}</option>`).join("")}</select></div>`).join("")}
        <div class="row"><button class="btn btn-primary" id="btn-check" disabled>Verificar</button></div></div>`;
      const sels = [...document.querySelectorAll("select")];
      sels.forEach(s => s.onchange = () => { SFX.click(); $("#btn-check").disabled = sels.some(x => !x.value); });
      $("#btn-check").onclick = () => {
        const bad = sels.filter(s => s.value !== pares[+s.dataset.i].der);
        if (!bad.length) { SFX.ok(); nextStage(); }
        else {
          const p = pares[+bad[0].dataset.i];
          failRoom(`Tenés ${bad.length} unión(es) incorrecta(s). Por ejemplo: “${esc(p.izq)}” corresponde a <b>${esc(p.der)}</b>.`);
        }
      };
    },

    order(st) {
      let pool = shuffle(st.pasos.map((t, i) => ({ t, i })));
      while (pool.every((p, k) => p.i === k)) pool = shuffle(pool);
      let chosen = [];
      const draw = () => {
        $("#room-body").innerHTML = `<div class="card">${header(st)}
          <div class="order-wrap">
            <div class="order-col"><h4>Pasos disponibles</h4><div class="order-list">
              ${pool.length ? pool.map((p, k) => `<button class="opt" data-pool="${k}">${esc(p.t)}</button>`).join("") : `<div class="slot-empty">¡Ubicaste todos los pasos!</div>`}
            </div></div>
            <div class="order-col"><h4>Tu algoritmo (tocá un paso para quitarlo)</h4><div class="order-list">
              ${chosen.length ? chosen.map((p, k) => `<div class="order-item"><span class="num">${k + 1}</span><button class="opt selected" style="flex:1" data-ch="${k}">${esc(p.t)}</button></div>`).join("") : `<div class="slot-empty">Todavía no elegiste ningún paso.</div>`}
            </div></div>
          </div>
          <div class="row"><button class="btn btn-primary" id="btn-check" ${pool.length ? "disabled" : ""}>Ejecutar algoritmo ▶</button></div></div>`;
        setTimeout(() => $("#room-body").classList.add("noanim"), 400);
        document.querySelectorAll("[data-pool]").forEach(b => b.onclick = () => { SFX.click(); chosen.push(pool.splice(+b.dataset.pool, 1)[0]); draw(); });
        document.querySelectorAll("[data-ch]").forEach(b => b.onclick = () => { SFX.click(); pool.push(chosen.splice(+b.dataset.ch, 1)[0]); draw(); });
        $("#btn-check").onclick = () => {
          const k = chosen.findIndex((p, idx) => p.i !== idx);
          if (k === -1) { SFX.ok(); nextStage(); }
          else failRoom(`El algoritmo falló en el paso ${k + 1}. Ahí correspondía: <b>${esc(st.pasos[k])}</b>.`);
        };
      };
      draw();
    },

    builder(st) {
      const piezas = st.piezas.map(p => ({ ...p, opciones: shuffle(p.opciones) }));
      const pick = {};
      $("#room-body").innerHTML = `<div class="card">${header(st)}
        ${piezas.map((p, i) => `<div class="piece"><h4>${i + 1}. ${esc(p.parte.toUpperCase())}</h4>
          <div class="options col">${p.opciones.map((o, j) => `<button class="opt" data-p="${i}" data-o="${j}">${esc(o.t)}</button>`).join("")}</div></div>`).join("")}
        <div class="row"><button class="btn btn-primary" id="btn-check" disabled>Verificar prompt</button></div></div>`;
      document.querySelectorAll("[data-p]").forEach(b => b.onclick = () => {
        SFX.click();
        const i = +b.dataset.p;
        document.querySelectorAll(`[data-p="${i}"]`).forEach(x => x.classList.remove("selected"));
        b.classList.add("selected"); pick[i] = +b.dataset.o;
        $("#btn-check").disabled = Object.keys(pick).length < piezas.length;
      });
      $("#btn-check").onclick = () => {
        const badI = piezas.findIndex((p, i) => !p.opciones[pick[i]].ok);
        if (badI === -1) {
          S.promptText = piezas.map((p, i) => p.opciones[pick[i]].t).join(" ");
          save(); SFX.ok(); nextStage();
        } else {
          const p = piezas[badI], o = p.opciones[pick[badI]];
          failRoom(`Pieza “${esc(p.parte)}”: ${esc(o.fb || "no es la mejor opción.")}`);
        }
      };
    },

    aipractice(st) {
      const prompt = S.promptText || room.etapas.find(e => e.tipo === "builder").piezas.map(p => p.opciones.find(o => o.ok).t).join(" ");
      $("#room-body").innerHTML = `<div class="card">${header(st)}
        <p><b>1.</b> Copiá tu prompt:</p>
        <div class="prompt-box" id="prompt-box">${esc(prompt)}</div>
        <div class="row"><button class="btn btn-gold small" id="btn-copy">📋 Copiar prompt</button></div>
        <p style="margin-top:18px"><b>2.</b> Abrí una IA en otra pestaña y pegá el prompt:</p>
        <div class="ai-links">
          <a class="btn btn-ghost small" href="https://gemini.google.com/" target="_blank" rel="noopener">Gemini ↗</a>
          <a class="btn btn-ghost small" href="https://chatgpt.com/" target="_blank" rel="noopener">ChatGPT ↗</a>
          <a class="btn btn-ghost small" href="https://copilot.microsoft.com/" target="_blank" rel="noopener">Copilot ↗</a>
        </div>
        <p><b>3.</b> Pegá acá la respuesta que te dio la IA:</p>
        <textarea id="ai-answer" placeholder="Pegá la respuesta completa de la IA…"></textarea>
        <div class="charcount" id="charcount">0 / ${st.minCaracteres} caracteres mínimos</div>
        <p class="feedback bad" id="ai-fb"></p>
        <div class="row">
          <button class="btn btn-primary" id="btn-check">Enviar a ARIA ▶</button>
          <button class="btn btn-ghost small" id="btn-teacher">No tengo acceso a una IA</button>
        </div></div>`;
      $("#btn-copy").onclick = async () => {
        try { await navigator.clipboard.writeText(prompt); toast("✅ Prompt copiado. ¡Pegalo en la IA!"); }
        catch (e) { const r = document.createRange(); r.selectNodeContents($("#prompt-box")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); toast("Seleccioné el texto: copialo con Ctrl+C."); }
      };
      const ta = $("#ai-answer");
      ta.oninput = () => { $("#charcount").textContent = `${ta.value.trim().length} / ${st.minCaracteres} caracteres mínimos`; };
      $("#btn-check").onclick = () => {
        const v = ta.value.trim();
        const fb = $("#ai-fb");
        if (v.length < st.minCaracteres) { SFX.error(); fb.textContent = "La respuesta es muy corta. Pegá la respuesta completa de la IA."; return; }
        if (norm(v).includes(norm(prompt).slice(0, 80)) && v.length < prompt.length + 120) { SFX.error(); fb.textContent = "Eso parece tu prompt, no la respuesta de la IA. 😉"; return; }
        if ((v.match(/\d/g) || []).length < 3) { SFX.error(); fb.textContent = "Pediste un presupuesto: la respuesta debería tener números. ¿Seguro que es la respuesta de la IA?"; return; }
        SFX.ok(); toast("🤖 ARIA analizó la respuesta: ¡tiene números y estructura!"); nextStage();
      };
      $("#btn-teacher").onclick = () => teacherCode();
    },

    vision(st) {
      const found = new Set();
      let running = false, busy = false, last = 0, raf = 0;
      $("#room-body").innerHTML = `<div class="card">${header(st)}
        <div class="vision">
          <div>
            <div class="cam-box" id="cam-box">
              <video id="cam" playsinline muted></video>
              <div class="cam-msg" id="cam-msg">📷 Tocá “Activar cámara”.<br><small>El navegador te va a pedir permiso.</small></div>
            </div>
            <div class="row">
              <button class="btn btn-primary" id="btn-cam">📷 Activar cámara</button>
              <label class="btn btn-ghost small" style="cursor:pointer">🖼️ Subir foto<input type="file" accept="image/*" capture="environment" id="file-in" hidden></label>
              <button class="btn btn-ghost small" id="btn-teacher">Sin cámara</button>
            </div>
          </div>
          <div>
            <p class="stage-sub" style="margin-bottom:8px">Objetos válidos (necesitás <b>${st.necesarios}</b>):</p>
            <div class="targets">${st.objetivos.map((o, i) => `<div class="target" id="tg-${i}">${o.emoji} ${esc(o.nombre)}</div>`).join("")}</div>
            <div class="preds" id="preds"><p class="stage-sub">Lo que “ve” la IA aparecerá acá con su probabilidad.</p></div>
          </div>
        </div></div>`;
      const video = $("#cam"), msg = $("#cam-msg");

      const showPreds = (preds) => {
        $("#preds").innerHTML = `<p class="stage-sub" style="margin:0 0 6px">La IA cree que ve:</p>` + preds.slice(0, 3).map(p =>
          `<div class="pred"><span>${esc(Vision.translate(p.className))}${Vision.translate(p.className) !== p.className.split(",")[0].trim().toLowerCase() ? ` <small style="color:var(--muted)">(${esc(p.className.split(",")[0])})</small>` : ""}</span><b>${Math.round(p.probability * 100)}%</b>
           <div class="bar"><div style="width:${Math.round(p.probability * 100)}%"></div></div></div>`).join("");
      };
      const check = (preds) => {
        showPreds(preds);
        st.objetivos.forEach((o, i) => {
          if (found.has(i)) return;
          const hit = preds.slice(0, 3).some(p => p.probability >= 0.12 && o.etiquetas.some(et => p.className.toLowerCase().includes(et)));
          if (hit) {
            found.add(i); $("#tg-" + i).classList.add("found"); SFX.ok();
            toast(`✅ ¡La IA reconoció: ${o.nombre}! (${found.size}/${st.necesarios})`);
          }
        });
        if (found.size >= st.necesarios) { running = false; cancelAnimationFrame(raf); Vision.stopCamera(); setTimeout(nextStage, 1200); }
      };
      const loop = async (t) => {
        if (!running) return;
        if (!busy && t - last > 900 && video.readyState >= 2) {
          busy = true; last = t;
          try { check(await Vision.classify(video)); } catch (e) { console.warn(e); }
          busy = false;
        }
        raf = requestAnimationFrame(loop);
      };
      const ensureModel = async () => {
        if (Vision.ready) return true;
        msg.innerHTML = "⏳ Cargando la red neuronal MobileNet…<br><small>(solo la primera vez, puede tardar unos segundos)</small>";
        try { await Vision.loadModel(); return true; }
        catch (e) { msg.innerHTML = "⚠️ No se pudo cargar la IA de visión (¿sin internet?).<br><small>Pedile el código a tu docente con el botón “Sin cámara”.</small>"; return false; }
      };
      $("#btn-cam").onclick = async () => {
        SFX.click();
        $("#btn-cam").disabled = true;
        if (!(await ensureModel())) { $("#btn-cam").disabled = false; return; }
        try {
          await Vision.startCamera(video);
          msg.remove(); const sc = document.createElement("div"); sc.className = "scan"; $("#cam-box").appendChild(sc);
          running = true; raf = requestAnimationFrame(loop);
        } catch (e) {
          $("#btn-cam").disabled = false;
          msg.innerHTML = "⚠️ No pude acceder a la cámara.<br><small>Revisá el permiso del navegador o usá “Subir foto”.</small>";
        }
      };
      $("#file-in").onchange = async (e) => {
        const f = e.target.files[0]; if (!f) return;
        if (!(await ensureModel())) return;
        const img = new Image(); img.src = URL.createObjectURL(f);
        await img.decode().catch(() => {});
        running = false; Vision.stopCamera();
        const box = $("#cam-box"); box.innerHTML = ""; box.appendChild(img);
        try { check(await Vision.classify(img)); } catch (er) { toast("No pude analizar esa imagen."); }
        e.target.value = "";
      };
      $("#btn-teacher").onclick = () => teacherCode(() => { running = false; Vision.stopCamera(); });
    }
  };

  async function teacherCode(before) {
    const res = await modal({
      html: `<h3>Código del docente</h3><p>Si no podés usar la cámara o una IA, pedile a tu docente el código de habilitación.</p>
             <input type="text" id="tcode" placeholder="Código" style="text-align:center;text-transform:uppercase">`,
      buttons: [{ label: "Cancelar", value: false }, { label: "Validar", cls: "btn-primary", value: true }]
    });
    if (!res) return;
    const v = norm(document.getElementById("tcode")?.value || "");
    if (v === norm(CONFIG.codigoDocente)) { before && before(); SFX.ok(); toast("Código correcto. ¡Seguimos!"); nextStage(); }
    else { SFX.error(); toast("Código incorrecto."); }
  }

  /* ---------- pista ---------- */
  async function showHint() {
    if (!room) return;
    const paid = S.hintRooms.includes(room.id);
    if (!paid) {
      const ok = await modal({ html: `<img src="assets/img/aria.svg" alt=""><h3>¿Pedir una pista?</h3><p>Te va a costar <b>${CONFIG.penalidadPistaMin} minutos</b> extra.</p>`, buttons: [{ label: "Mejor no", value: false }, { label: "Sí, quiero la pista", cls: "btn-gold", value: true }] });
      if (!ok) return;
      S.hintRooms.push(room.id); S.hints++; S.penaltyMs += CONFIG.penalidadPistaMin * 60000; save(); renderTimer();
    }
    await modal({ html: `<img src="assets/img/aria.svg" alt=""><h3>💡 Pista de ARIA</h3><p class="explain">${esc(room.pista)}</p>` });
  }

  /* ---------- bóveda final ---------- */
  function renderFinal() {
    $("#form-final").innerHTML = ROOMS.map((r, i) => `<div><label for="fk${i}">${i + 1}. ${esc(r.nombre)}</label><input type="text" id="fk${i}" maxlength="14"></div>`).join("");
    $("#final-feedback").textContent = ""; $("#final-feedback").className = "feedback";
    show("screen-final");
    setTimeout(() => $("#fk0")?.focus(), 300);
  }
  async function tryOpenVault() {
    const vals = ROOMS.map((r, i) => norm($("#fk" + i).value));
    const ok = vals.every((v, i) => v === norm(ROOMS[i].palabra));
    const fb = $("#final-feedback");
    if (!ok) {
      SFX.error(); const card = $(".final"); card.classList.remove("shake"); void card.offsetWidth; card.classList.add("shake");
      fb.className = "feedback bad"; fb.textContent = "❌ Código incorrecto. Revisá la ortografía y el ORDEN de las salas.";
      return;
    }
    fb.className = "feedback good"; fb.textContent = "✅ ¡Código aceptado! Abriendo la bóveda…";
    $("#final-img").classList.add("opening"); SFX.win();
    S.finishedAt = Date.now(); save(); renderTimer(); clearInterval(timerId);
    await sleep(1600);
    showCertificate();
  }

  /* ---------- certificado ---------- */
  async function showCertificate() {
    show("screen-cert"); renderHUD(); renderTimer();
    const t = elapsed();
    const d = new Date(S.finishedAt || Date.now());
    const date = d.toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" });
    const time = (t <= TOTAL_MS ? fmt(t) : fmt(t) + " (con tiempo extra)") + " min";
    $("#cert-summary").textContent = `${S.name}: tiempo ${time} · reinicios ${S.resets} · pistas ${S.hints}`;
    const data = { name: S.name, date, time, resets: S.resets, hints: S.hints, keywords: ROOMS.map(r => r.palabra), docente: CONFIG.docente, curso: CONFIG.curso, institucion: CONFIG.institucion };
    await Certificate.draw($("#cert-canvas"), data);
  }

  /* ---------- menú y eventos globales ---------- */
  async function openMenu() {
    const v = await modal({
      html: `<h3>⚙️ Opciones</h3><p>Agente: <b>${esc(S.name)}</b></p><p class="explain">Tu progreso se guarda en este navegador. Si recargás la página, volvés al mapa con tus palabras clave.</p>`,
      buttons: [{ label: "Cerrar", value: 0 }, { label: "Reiniciar juego completo", cls: "btn-gold", value: 1 }]
    });
    if (v === 1) {
      const sure = await modal({ html: `<h3>¿Seguro?</h3><p>Se borra todo el progreso y el nombre.</p>`, buttons: [{ label: "Cancelar", value: false }, { label: "Sí, borrar todo", cls: "btn-gold", value: true }] });
      if (sure) { Vision.stopCamera(); wipe(); location.reload(); }
    }
  }

  function bind() {
    $("#btn-sound").onclick = () => { S.sound = SFX.toggle(); save(); renderHUD(); };
    $("#btn-menu").onclick = openMenu;
    $("#btn-hint").onclick = showHint;
    $("#btn-back-map").onclick = async () => {
      if (stageIdx >= 0 && room && !S.keywords[roomIdx]) {
        const ok = await modal({ html: `<h3>¿Salir de la sala?</h3><p>Vas a perder el avance de esta sala y tendrás que empezarla de nuevo.</p>`, buttons: [{ label: "Quedarme", value: false }, { label: "Salir al mapa", cls: "btn-gold", value: true }] });
        if (!ok) return;
      }
      leaveRoom();
    };
    $("#btn-vault").onclick = () => { SFX.click(); renderFinal(); };
    $("#btn-final-back").onclick = () => { renderMap(); show("screen-map"); };
    $("#btn-final-open").onclick = tryOpenVault;
    $("#form-final").addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); tryOpenVault(); } });
    $("#btn-cert-download").onclick = () => Certificate.download($("#cert-canvas"), S.name);
    $("#btn-cert-print").onclick = () => Certificate.print($("#cert-canvas"));
    $("#btn-cert-new").onclick = async () => {
      const ok = await modal({ html: `<h3>¿Nuevo jugador?</h3><p>Descargá antes tu certificado: se borrará esta partida.</p>`, buttons: [{ label: "Cancelar", value: false }, { label: "Sí, nuevo jugador", cls: "btn-gold", value: true }] });
      if (ok) { wipe(); location.reload(); }
    };
    $("#foot-course").textContent = CONFIG.curso;
    window.addEventListener("beforeunload", () => Vision.stopCamera());
  }

  bind();
  initWelcome();
})();
