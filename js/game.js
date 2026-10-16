/* =========================================================
   BÓVEDA NEURAL · Motor del juego (multilingüe ES / FR / EN)
   ========================================================= */
(() => {
  "use strict";

  /* ---------- utilidades ---------- */
  const $ = (s, el = document) => el.querySelector(s);
  const T = (k, v) => I18N.t(k, v);
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const norm = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase().replace(/\s+/g, "").trim();
  const fmt = (ms) => { const neg = ms < 0; ms = Math.abs(ms); const m = Math.floor(ms / 60000), s = Math.floor((ms % 60000) / 1000); return (neg ? "+" : "") + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0"); };
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const titleCase = (s) => s.toLowerCase().replace(/(^|\s|-)(\p{L})/gu, (m, a, b) => a + b.toUpperCase());
  const cursoText = () => (I18N.lang !== "es" && CONFIG.cursoI18n && CONFIG.cursoI18n[I18N.lang]) || CONFIG.curso;

  /* ---------- estado ---------- */
  const TOTAL_MS = CONFIG.minutos * 60000;
  const fresh = () => ({ name: "", startedAt: 0, penaltyMs: 0, unlocked: 0, keywords: [], resets: 0, hints: 0, hintRooms: [], finishedAt: 0, promptText: "", sound: true, wordIdx: [], order: [], activeMs: null });
  let S = fresh();
  let room = null, roomIdx = -1, stageIdx = -1, roomView = "";
  let screen = "screen-welcome";
  let timerId = null;

  /* Palabras clave y orden únicos por jugador (anti-copia).
     Se guarda el ÍNDICE de la palabra: así se muestra en el idioma elegido. */
  function rnd(n) {
    try { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] % n; } catch (e) { return Math.floor(Math.random() * n); }
  }
  function assignWords() {
    if (!Array.isArray(S.wordIdx) || S.wordIdx.length !== ROOMS.length) {
      // migración de partidas guardadas con la versión anterior (palabras en texto)
      const old = Array.isArray(S.words) ? S.words : [];
      S.wordIdx = ROOMS.map((r, i) => {
        if (old[i]) for (const l of I18N.langs) { const k = I18N.roomsOf(l)[i].palabras.findIndex(w => norm(w) === norm(old[i])); if (k >= 0) return k; }
        return rnd(r.palabras.length);
      });
      delete S.words;
    }
    if (!Array.isArray(S.order) || S.order.length !== ROOMS.length) {
      const o = ROOMS.map((r, i) => i);
      for (let i = o.length - 1; i > 0; i--) { const j = rnd(i + 1); [o[i], o[j]] = [o[j], o[i]]; }
      if (o.every((v, i) => v === i)) o.reverse();
      S.order = o;
    }
  }
  const word = (i) => ROOMS[i].palabras[S.wordIdx[i]];
  const solved = (i) => !!S.keywords[i];

  function save() { try { localStorage.setItem(CONFIG.storageKey, JSON.stringify(S)); } catch (e) {} }
  function load() { try { const r = localStorage.getItem(CONFIG.storageKey); return r ? Object.assign(fresh(), JSON.parse(r)) : null; } catch (e) { return null; } }
  function wipe() { try { localStorage.removeItem(CONFIG.storageKey); } catch (e) {} }

  /* ---------- pantallas ---------- */
  function show(id) {
    screen = id;
    document.querySelectorAll(".screen").forEach(s => s.classList.toggle("active", s.id === id));
    $("#hud").classList.toggle("hidden", id === "screen-welcome");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toast(msg, ms = 2600) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), ms);
  }

  function modal({ html, buttons, alert = false }) {
    buttons = buttons || [{ label: T("g.ok"), cls: "btn-primary" }];
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

  /* ---------- HUD y tiempo (tiempo activo) ---------- */
  let lastTick = Date.now(), tickCount = 0;
  function elapsed() {
    if (S.activeMs == null) return ((S.finishedAt || Date.now()) - S.startedAt) + S.penaltyMs; // partidas viejas
    return S.activeMs + S.penaltyMs;
  }
  function tick() {
    const now = Date.now(), d = now - lastTick;
    lastTick = now;
    if (!S.finishedAt && S.name && d > 0 && d < 120000) {
      S.activeMs = (S.activeMs || 0) + d;
      if (++tickCount % 5 === 0) save();
    }
    renderTimer();
  }
  function renderTimer() {
    const rem = TOTAL_MS - elapsed();
    const el = $("#hud-timer");
    el.textContent = fmt(rem);
    el.classList.toggle("low", rem < 10 * 60000 && rem >= 0);
    el.classList.toggle("over", rem < 0);
    if (rem < 0 && !S._overWarned && !S.finishedAt) { S._overWarned = true; toast(T("time.over"), 4000); }
  }
  function startTimer() { clearInterval(timerId); lastTick = Date.now(); renderTimer(); timerId = setInterval(tick, 1000); }

  function renderHUD() {
    $("#hud-name").textContent = S.name || "—";
    $("#hud-keys").innerHTML = ROOMS.map((r, i) => {
      const got = solved(i) && S.wordIdx.length;
      const sh = T("room.short", { n: i + 1 });
      return `<span class="key-slot ${got ? "got" : ""}" title="${esc(T("room.title", { n: i + 1 }))}">${got ? `<b>${sh}</b> ${esc(word(i))}` : sh}</span>`;
    }).join("");
    $("#btn-sound").textContent = S.sound ? "🔊" : "🔇";
  }
  function renderStaticLabels() {
    $("#btn-hint").textContent = T("room.hint", { min: CONFIG.penalidadPistaMin });
    $("#foot").textContent = T("foot", { curso: cursoText() });
  }

  /* ---------- bienvenida ---------- */
  let savedGame = null;
  function initWelcome() {
    savedGame = load();
    if (savedGame && savedGame.name) {
      $("#resume-box").classList.remove("hidden");
      $("#resume-text").innerHTML = T("w.resume", { name: esc(savedGame.name) });
      $("#form-name").classList.add("hidden");
      $("#btn-resume").onclick = () => { S = savedGame; SFX.set(S.sound); beginGame(); };
      $("#btn-new").onclick = async () => {
        const ok = await modal({ html: `<h3>${T("w.newTitle")}</h3><p>${T("w.newText", { name: esc(savedGame.name) })}</p>`, buttons: [{ label: T("g.cancel"), value: false }, { label: T("g.yesDelete"), cls: "btn-gold", value: true }] });
        if (ok) { wipe(); location.reload(); }
      };
    }
    $("#form-name").addEventListener("submit", (e) => {
      e.preventDefault();
      const raw = $("#input-name").value.replace(/\s+/g, " ").trim();
      if (raw.length < 3 || !/\p{L}{2,}/u.test(raw)) { toast(T("w.nameBad")); $("#input-name").focus(); return; }
      S = fresh(); S.name = titleCase(raw); S.startedAt = Date.now(); S.activeMs = 0; assignWords(); save();
      SFX.click();
      beginGame(true);
    });
  }

  async function beginGame(first = false) {
    assignWords(); save();
    renderHUD(); startTimer();
    if (S.finishedAt) { showCertificate(); return; }
    renderMap(); show("screen-map");
    if (first) {
      await modal({
        html: `<img src="assets/img/aria.svg" alt=""><h3>${T("intro.hello", { name: esc(S.name) })}</h3>
               <p>${T("intro.p")}</p><p class="explain">${T("intro.rules")}</p>`,
        buttons: [{ label: T("intro.go"), cls: "btn-primary" }]
      });
    }
  }

  /* ---------- mapa ---------- */
  function renderMap() {
    const lines = T("map.lines");
    $("#map-speech").innerHTML = `<b>ARIA:</b> ${lines[Math.min(S.unlocked, 6)]}`;
    $("#map-grid").innerHTML = ROOMS.map((r, i) => {
      const done = solved(i);
      const open = !done && i === S.unlocked;
      const cls = done ? "done" : open ? "open" : "locked";
      const badge = T(done ? "door.done" : open ? "door.open" : "door.locked");
      return `<div class="door ${cls}" data-i="${i}" tabindex="0" role="button" aria-label="${esc(T("door.aria", { n: i + 1, name: r.nombre }))}">
        <span class="badge">${badge}</span>
        <img src="${r.icono}" alt="">
        <h3>${i + 1}. ${esc(r.nombre)}</h3>
        <p>${esc(r.tema)} · ~${r.minutosSugeridos} min</p>
        ${done ? `<div class="kw">🔑 ${esc(word(i))}</div>` : ""}
      </div>`;
    }).join("");
    document.querySelectorAll(".door").forEach(d => {
      const go = () => {
        const i = +d.dataset.i;
        if (solved(i)) return toast(T("door.solved", { w: word(i) }));
        if (i !== S.unlocked) { SFX.error(); return toast(T("door.lockedToast")); }
        SFX.click(); enterRoom(i);
      };
      d.onclick = go; d.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } };
    });
    const n = ROOMS.filter((r, i) => solved(i)).length, all = n === ROOMS.length;
    $("#btn-vault").disabled = !all;
    $("#vault-status").textContent = all ? T("map.vaultReady") : T("map.vaultCount", { n, t: ROOMS.length });
  }

  /* ---------- salas ---------- */
  function roomHead() {
    $("#room-icon").src = room.icono;
    $("#room-kicker").textContent = T("room.kicker", { n: roomIdx + 1, t: ROOMS.length, tema: room.tema });
    $("#room-title").textContent = room.nombre;
  }
  function enterRoom(i) {
    roomIdx = i; room = ROOMS[i]; stageIdx = -1;
    roomHead();
    show("screen-room");
    renderIntro();
  }

  function leaveRoom() { Vision.stopCamera(); room = null; roomIdx = -1; roomView = ""; renderMap(); show("screen-map"); }

  function setProgress() {
    const p = stageIdx < 0 ? 0 : (stageIdx / room.etapas.length) * 100;
    $("#room-progress").style.width = p + "%";
  }

  function renderIntro() {
    roomView = "intro";
    setProgress();
    $("#room-body").innerHTML = `
      <div class="card" style="display:flex;gap:18px;align-items:center;flex-wrap:wrap">
        <img src="assets/img/aria.svg" alt="" style="width:110px">
        <div style="flex:1;min-width:220px">
          <p class="stage-title">${T("ri.says")}</p>
          <p>${esc(room.intro)}</p>
          <p class="stage-sub">${T("ri.sub", { n: room.etapas.length })}</p>
          <button class="btn btn-primary" id="btn-start-room">${T("ri.start")}</button>
        </div>
      </div>`;
    $("#btn-start-room").onclick = () => { SFX.click(); nextStage(); };
  }

  function renderStage() {
    roomView = "stage";
    $("#room-body").classList.remove("noanim");
    const st = room.etapas[stageIdx];
    RENDER[st.tipo](st);
  }
  function nextStage() {
    stageIdx++;
    setProgress();
    if (stageIdx >= room.etapas.length) return completeRoom();
    renderStage();
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
      html: `<img src="assets/img/alerta.svg" alt=""><h3>${T("fail.title")}</h3><p>${esc(msg)}</p>${explain ? `<p class="explain">${explain}</p>` : ""}`,
      buttons: [{ label: T("fail.retry"), cls: "btn-gold" }]
    });
    stageIdx = -1; nextStage();
  }

  function completeRoom() {
    Vision.stopCamera();
    S.keywords[roomIdx] = true;
    S.unlocked = Math.max(S.unlocked, roomIdx + 1);
    save(); renderHUD();
    SFX.key();
    renderDone();
  }
  function renderDone() {
    roomView = "done";
    $("#room-progress").style.width = "100%";
    $("#room-body").innerHTML = `
      <div class="card reveal">
        <img src="assets/img/llave.svg" alt="">
        <p class="stage-sub" style="margin:10px 0 0">${T("done.text", { name: esc(S.name.split(" ")[0]), n: roomIdx + 1 })}</p>
        <div class="keyword">${esc(word(roomIdx))}</div>
        <p class="stage-sub">${T("done.note")}</p>
        <button class="btn btn-primary" id="btn-room-done">${T("done.back")}</button>
      </div>`;
    $("#btn-room-done").onclick = () => { SFX.click(); leaveRoom(); };
  }

  function header(st, extra = "") {
    return `<p class="stage-title">${T("st.header", { i: stageIdx + 1, n: room.etapas.length, t: esc(st.titulo) })}</p>
            ${st.consigna ? `<p class="stage-sub">${esc(st.consigna)}</p>` : ""}${extra}`;
  }
  const aiLinks = () => `<div class="ai-links">
      <a class="btn btn-ghost small" href="https://gemini.google.com/" target="_blank" rel="noopener">Gemini ↗</a>
      <a class="btn btn-ghost small" href="https://chatgpt.com/" target="_blank" rel="noopener">ChatGPT ↗</a>
      <a class="btn btn-ghost small" href="https://copilot.microsoft.com/" target="_blank" rel="noopener">Copilot ↗</a></div>`;

  /* ---------- tipos de etapa ---------- */
  const RENDER = {
    classify(st) {
      const items = shuffle(st.items).slice(0, st.cantidad || st.items.length);
      let k = 0;
      const draw = () => {
        const it = items[k];
        $("#room-body").innerHTML = `<div class="card">${header(st)}
          <div class="counter">${T("cl.case", { k: k + 1, n: items.length })}</div>
          <div class="case">${esc(it.texto)}</div>
          <div class="options">${st.opciones.map(o => `<button class="opt" data-v="${esc(o)}">${esc(o)}</button>`).join("")}</div></div>`;
        document.querySelectorAll(".opt").forEach(b => b.onclick = async () => {
          document.querySelectorAll(".opt").forEach(x => x.disabled = true);
          if (b.dataset.v === it.r) {
            b.classList.add("correct"); SFX.ok(); await sleep(650);
            k++; k < items.length ? draw() : nextStage();
          } else {
            b.classList.add("wrong"); SFX.error(); await sleep(500);
            failRoom(T("cl.fail", { c: esc(it.texto), r: esc(it.r) }));
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
        else { b.classList.add("wrong"); SFX.error(); await sleep(500); failRoom(T("mcq.fail", { r: esc(ops.find(x => x.ok).t) })); }
      });
    },

    match(st) {
      const pares = shuffle(st.pares);
      const ders = shuffle(st.pares.map(p => p.der));
      $("#room-body").innerHTML = `<div class="card">${header(st)}
        ${pares.map((p, i) => `<div class="match-row"><div>${esc(p.izq)}</div>
          <select data-i="${i}" aria-label="${esc(T("mt.aria"))}"><option value="">${T("mt.choose")}</option>${ders.map(d => `<option>${esc(d)}</option>`).join("")}</select></div>`).join("")}
        <div class="row"><button class="btn btn-primary" id="btn-check" disabled>${T("mt.check")}</button></div></div>`;
      const sels = [...document.querySelectorAll("select")];
      sels.forEach(s => s.onchange = () => { SFX.click(); $("#btn-check").disabled = sels.some(x => !x.value); });
      $("#btn-check").onclick = () => {
        const bad = sels.filter(s => s.value !== pares[+s.dataset.i].der);
        if (!bad.length) { SFX.ok(); nextStage(); }
        else {
          const p = pares[+bad[0].dataset.i];
          failRoom(T("mt.fail", { n: bad.length, a: esc(p.izq), b: esc(p.der) }));
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
            <div class="order-col"><h4>${T("or.avail")}</h4><div class="order-list">
              ${pool.length ? pool.map((p, k) => `<button class="opt" data-pool="${k}">${esc(p.t)}</button>`).join("") : `<div class="slot-empty">${T("or.all")}</div>`}
            </div></div>
            <div class="order-col"><h4>${T("or.yours")}</h4><div class="order-list">
              ${chosen.length ? chosen.map((p, k) => `<div class="order-item"><span class="num">${k + 1}</span><button class="opt selected" style="flex:1" data-ch="${k}">${esc(p.t)}</button></div>`).join("") : `<div class="slot-empty">${T("or.none")}</div>`}
            </div></div>
          </div>
          <div class="row"><button class="btn btn-primary" id="btn-check" ${pool.length ? "disabled" : ""}>${T("or.run")}</button></div></div>`;
        setTimeout(() => $("#room-body").classList.add("noanim"), 400);
        document.querySelectorAll("[data-pool]").forEach(b => b.onclick = () => { SFX.click(); chosen.push(pool.splice(+b.dataset.pool, 1)[0]); draw(); });
        document.querySelectorAll("[data-ch]").forEach(b => b.onclick = () => { SFX.click(); pool.push(chosen.splice(+b.dataset.ch, 1)[0]); draw(); });
        $("#btn-check").onclick = () => {
          const k = chosen.findIndex((p, idx) => p.i !== idx);
          if (k === -1) { SFX.ok(); nextStage(); }
          else failRoom(T("or.fail", { k: k + 1, s: esc(st.pasos[k]) }));
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
        <div class="row"><button class="btn btn-primary" id="btn-check" disabled>${T("bd.check")}</button></div></div>`;
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
          S.promptLang = I18N.lang;
          save(); SFX.ok(); nextStage();
        } else {
          const p = piezas[badI], o = p.opciones[pick[badI]];
          failRoom(T("bd.fail", { p: esc(p.parte), fb: esc(o.fb || T("bd.notBest")) }));
        }
      };
    },

    aipractice(st) {
      // El prompt se arma con las piezas correctas en el idioma actual (si cambió el idioma, se traduce)
      const correct = room.etapas.find(e => e.tipo === "builder").piezas.map(p => p.opciones.find(o => o.ok).t).join(" ");
      const prompt = (S.promptText && S.promptLang === I18N.lang) ? S.promptText : correct;
      $("#room-body").innerHTML = `<div class="card">${header(st)}
        <p>${T("ai.s1")}</p>
        <div class="prompt-box" id="prompt-box">${esc(prompt)}</div>
        <div class="row"><button class="btn btn-gold small" id="btn-copy">${T("ai.copy")}</button></div>
        <p style="margin-top:18px">${T("ai.s2")}</p>
        ${aiLinks()}
        <p>${T("ai.s3")}</p>
        <textarea id="ai-answer" placeholder="${esc(T("ai.ph"))}"></textarea>
        <div class="charcount" id="charcount">${T("ai.chars", { n: 0, m: st.minCaracteres })}</div>
        <p class="feedback bad" id="ai-fb"></p>
        <div class="row">
          <button class="btn btn-primary" id="btn-check">${T("ai.send")}</button>
          <button class="btn btn-ghost small" id="btn-teacher">${T("ai.noAccess")}</button>
        </div></div>`;
      $("#btn-copy").onclick = async () => {
        try { await navigator.clipboard.writeText(prompt); toast(T("ai.copied")); }
        catch (e) { const r = document.createRange(); r.selectNodeContents($("#prompt-box")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); toast(T("ai.selected")); }
      };
      const ta = $("#ai-answer");
      ta.oninput = () => { $("#charcount").textContent = T("ai.chars", { n: ta.value.trim().length, m: st.minCaracteres }); };
      $("#btn-check").onclick = () => {
        const v = ta.value.trim();
        const fb = $("#ai-fb");
        if (v.length < st.minCaracteres) { SFX.error(); fb.textContent = T("ai.short"); return; }
        if (norm(v).includes(norm(prompt).slice(0, 80)) && v.length < prompt.length + 120) { SFX.error(); fb.textContent = T("ai.isPrompt"); return; }
        if ((v.match(/\d/g) || []).length < 3) { SFX.error(); fb.textContent = T("ai.noNum"); return; }
        SFX.ok(); toast(T("ai.ok")); nextStage();
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
              <div class="cam-msg" id="cam-msg">${T("v.start")}</div>
            </div>
            <div class="row">
              <button class="btn btn-primary" id="btn-cam">${T("v.cam")}</button>
              <label class="btn btn-ghost small" style="cursor:pointer">${T("v.upload")}<input type="file" accept="image/*" capture="environment" id="file-in" hidden></label>
              <button class="btn btn-ghost small" id="btn-teacher">${T("v.noCam")}</button>
            </div>
          </div>
          <div>
            <p class="stage-sub" style="margin-bottom:8px">${T("v.valid", { n: st.necesarios })}</p>
            <div class="targets">${st.objetivos.map((o, i) => `<div class="target" id="tg-${i}">${o.emoji} ${esc(o.nombre)}</div>`).join("")}</div>
            <div class="preds" id="preds"><p class="stage-sub">${T("v.hint")}</p></div>
          </div>
        </div></div>`;
      const video = $("#cam"), msg = $("#cam-msg");

      const showPreds = (preds) => {
        $("#preds").innerHTML = `<p class="stage-sub" style="margin:0 0 6px">${T("v.sees")}</p>` + preds.slice(0, 3).map(p => {
          const tr = Vision.translate(p.className, I18N.lang), raw = p.className.split(",")[0].trim();
          return `<div class="pred"><span>${esc(tr)}${tr.toLowerCase() !== raw.toLowerCase() ? ` <small style="color:var(--muted)">(${esc(raw)})</small>` : ""}</span><b>${Math.round(p.probability * 100)}%</b>
           <div class="bar"><div style="width:${Math.round(p.probability * 100)}%"></div></div></div>`;
        }).join("");
      };
      const check = (preds) => {
        showPreds(preds);
        st.objetivos.forEach((o, i) => {
          if (found.has(i)) return;
          const hit = preds.slice(0, 3).some(p => p.probability >= 0.12 && o.etiquetas.some(et => p.className.toLowerCase().includes(et)));
          if (hit) {
            found.add(i); $("#tg-" + i).classList.add("found"); SFX.ok();
            toast(T("v.found", { o: o.nombre, n: found.size, m: st.necesarios }));
          }
        });
        if (found.size >= st.necesarios) { running = false; cancelAnimationFrame(raf); Vision.stopCamera(); setTimeout(() => { if (roomView === "stage") nextStage(); }, 1200); }
      };
      const loop = async (t) => {
        if (!running || !document.body.contains(video)) return;
        if (!busy && t - last > 900 && video.readyState >= 2) {
          busy = true; last = t;
          try { check(await Vision.classify(video)); } catch (e) { console.warn(e); }
          busy = false;
        }
        raf = requestAnimationFrame(loop);
      };
      const ensureModel = async () => {
        if (Vision.ready) return true;
        msg.innerHTML = T("v.loading");
        try { await Vision.loadModel(); return true; }
        catch (e) { msg.innerHTML = T("v.loadFail"); return false; }
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
          msg.innerHTML = T("v.camFail");
        }
      };
      $("#file-in").onchange = async (e) => {
        const f = e.target.files[0]; if (!f) return;
        if (!(await ensureModel())) return;
        const img = new Image(); img.src = URL.createObjectURL(f);
        await img.decode().catch(() => {});
        running = false; Vision.stopCamera();
        const box = $("#cam-box"); box.innerHTML = ""; box.appendChild(img);
        try { check(await Vision.classify(img)); } catch (er) { toast(T("v.imgFail")); }
        e.target.value = "";
      };
      $("#btn-teacher").onclick = () => teacherCode(() => { running = false; Vision.stopCamera(); });
    }
  };

  async function teacherCode(before) {
    const res = await modal({
      html: `<h3>${T("tc.title")}</h3><p>${T("tc.text")}</p>
             <input type="text" id="tcode" placeholder="${esc(T("tc.ph"))}" style="text-align:center;text-transform:uppercase">`,
      buttons: [{ label: T("g.cancel"), value: false }, { label: T("tc.validate"), cls: "btn-primary", value: true }]
    });
    if (!res) return;
    const v = norm(document.getElementById("tcode")?.value || "");
    if (v === norm(CONFIG.codigoDocente)) { before && before(); SFX.ok(); toast(T("tc.ok")); nextStage(); }
    else { SFX.error(); toast(T("tc.bad")); }
  }

  /* ---------- pista ---------- */
  async function showHint() {
    if (!room) return;
    const paid = S.hintRooms.includes(room.id);
    if (!paid) {
      const ok = await modal({ html: `<img src="assets/img/aria.svg" alt=""><h3>${T("h.askTitle")}</h3><p>${T("h.askText", { min: CONFIG.penalidadPistaMin })}</p>`, buttons: [{ label: T("h.no"), value: false }, { label: T("h.yes"), cls: "btn-gold", value: true }] });
      if (!ok) return;
      S.hintRooms.push(room.id); S.hints++; S.penaltyMs += CONFIG.penalidadPistaMin * 60000; save(); renderTimer();
    }
    await modal({ html: `<img src="assets/img/aria.svg" alt=""><h3>${T("h.title")}</h3><p class="explain">${esc(room.pista)}</p>` });
  }

  /* ---------- bóveda final ---------- */
  function renderFinal(keep) {
    $("#form-final").innerHTML = S.order.map((ri, k) => `<div class="fslot">
      <div class="fslot-head"><span class="fslot-pos">${T("f.pos", { k: k + 1 })}</span><img src="${ROOMS[ri].icono}" alt=""><div><b>${T("f.room", { n: ri + 1 })}</b><small>${esc(ROOMS[ri].nombre)}</small></div></div>
      <input type="text" id="fk${k}" maxlength="18" aria-label="${esc(T("f.ph", { n: ri + 1 }))}" placeholder="${esc(T("f.ph", { n: ri + 1 }))}" value="${keep ? esc(keep[k] || "") : ""}"></div>`).join("");
    $("#final-feedback").textContent = ""; $("#final-feedback").className = "feedback";
    show("screen-final");
    if (!keep) setTimeout(() => $("#fk0")?.focus(), 300);
  }
  // Acepta la palabra en cualquiera de los 3 idiomas (mismo índice)
  const matches = (input, ri) => I18N.langs.some(l => norm(I18N.roomsOf(l)[ri].palabras[S.wordIdx[ri]]) === norm(input));
  async function tryOpenVault() {
    const fb = $("#final-feedback");
    let good = 0;
    S.order.forEach((ri, k) => {
      const inp = $("#fk" + k);
      const ok = matches(inp.value, ri);
      if (ok) good++;
      inp.classList.toggle("ok", ok);
      inp.classList.toggle("bad", !ok && inp.value.trim() !== "");
    });
    if (good < ROOMS.length) {
      SFX.error(); const card = $(".final"); card.classList.remove("shake"); void card.offsetWidth; card.classList.add("shake");
      fb.className = "feedback bad";
      fb.textContent = T("f.bad", { g: good, t: ROOMS.length });
      return;
    }
    fb.className = "feedback good"; fb.textContent = T("f.ok");
    $("#final-img").classList.add("opening"); SFX.win();
    tick(); S.finishedAt = Date.now(); save(); renderTimer(); clearInterval(timerId);
    await sleep(1600);
    showCertificate();
  }

  /* ---------- certificado ---------- */
  async function showCertificate() {
    show("screen-cert"); renderHUD(); renderTimer();
    const t = elapsed();
    const d = new Date(S.finishedAt || Date.now());
    const date = d.toLocaleDateString(I18N.locale, { day: "2-digit", month: "long", year: "numeric" });
    const time = (t <= TOTAL_MS ? fmt(t) : fmt(t) + T("c.extra")) + " min";
    $("#cert-summary").textContent = T("c.summary", { name: S.name, time, r: S.resets, h: S.hints });
    const data = { name: S.name, date, time, resets: S.resets, hints: S.hints, keywords: ROOMS.map((r, i) => word(i)), docente: CONFIG.docente, curso: cursoText(), institucion: CONFIG.institucion, tx: T, codeKey: d.toISOString().slice(0, 10) + "|" + S.wordIdx.join("") };
    await Certificate.draw($("#cert-canvas"), data);
  }

  /* ---------- cambio de idioma en cualquier momento ---------- */
  function onLangChange() {
    renderStaticLabels();
    if (!S.name) { if (savedGame && savedGame.name) $("#resume-text").innerHTML = T("w.resume", { name: esc(savedGame.name) }); return; }
    renderHUD();
    if (screen === "screen-welcome" && savedGame && savedGame.name) $("#resume-text").innerHTML = T("w.resume", { name: esc(savedGame.name) });
    if (screen === "screen-map") renderMap();
    if (screen === "screen-room" && roomIdx >= 0) {
      room = ROOMS[roomIdx]; roomHead();
      if (roomView === "intro") renderIntro();
      else if (roomView === "done") renderDone();
      else if (roomView === "stage") { Vision.stopCamera(); renderStage(); toast(T("lang.changedMid")); }
    }
    if (screen === "screen-final") { const keep = S.order.map((ri, k) => $("#fk" + k)?.value || ""); renderFinal(keep); }
    if (screen === "screen-cert") showCertificate();
  }

  /* ---------- menú y eventos globales ---------- */
  async function openMenu() {
    const v = await modal({
      html: `<h3>${T("m.title")}</h3><p>${T("m.agent", { name: esc(S.name) })}</p><p class="explain">${T("m.saved")}</p>`,
      buttons: [{ label: T("m.close"), value: 0 }, { label: T("m.reset"), cls: "btn-gold", value: 1 }]
    });
    if (v === 1) {
      const sure = await modal({ html: `<h3>${T("m.sureTitle")}</h3><p>${T("m.sureText")}</p>`, buttons: [{ label: T("g.cancel"), value: false }, { label: T("m.sureYes"), cls: "btn-gold", value: true }] });
      if (sure) { Vision.stopCamera(); wipe(); location.reload(); }
    }
  }

  function bind() {
    $("#btn-sound").onclick = () => { S.sound = SFX.toggle(); save(); renderHUD(); };
    $("#btn-menu").onclick = openMenu;
    $("#btn-hint").onclick = showHint;
    $("#btn-back-map").onclick = async () => {
      if (stageIdx >= 0 && room && !solved(roomIdx)) {
        const ok = await modal({ html: `<h3>${T("lv.title")}</h3><p>${T("lv.text")}</p>`, buttons: [{ label: T("lv.stay"), value: false }, { label: T("lv.exit"), cls: "btn-gold", value: true }] });
        if (!ok) return;
      }
      leaveRoom();
    };
    $("#btn-vault").onclick = () => { SFX.click(); renderFinal(); };
    $("#btn-final-back").onclick = () => { renderMap(); show("screen-map"); };
    $("#btn-final-open").onclick = tryOpenVault;
    $("#form-final").addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); tryOpenVault(); } });
    $("#btn-cert-download").onclick = () => Certificate.download($("#cert-canvas"), S.name, T("c.file"));
    $("#btn-cert-print").onclick = () => Certificate.print($("#cert-canvas"));
    $("#btn-cert-new").onclick = async () => {
      const ok = await modal({ html: `<h3>${T("c.newTitle")}</h3><p>${T("c.newText")}</p>`, buttons: [{ label: T("g.cancel"), value: false }, { label: T("c.newYes"), cls: "btn-gold", value: true }] });
      if (ok) { wipe(); location.reload(); }
    };
    window.addEventListener("beforeunload", () => { Vision.stopCamera(); if (S.name) { tick(); save(); } });
    document.addEventListener("visibilitychange", () => { if (S.name) { tick(); save(); } });
    I18N.onChange(onLangChange);
  }

  I18N.initPicker();
  I18N.apply();
  renderStaticLabels();
  bind();
  initWelcome();
})();
