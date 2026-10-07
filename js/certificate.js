/* =========================================================
   Certificado: se dibuja en <canvas> (sin imágenes externas,
   así puede descargarse como PNG incluso abriendo el archivo local)
   ========================================================= */
const Certificate = (() => {
  function code(name, date) {
    let h = 2166136261;
    const s = name + "|" + date;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return "BN-" + (h >>> 0).toString(36).toUpperCase().padStart(7, "0");
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  function fitText(ctx, text, maxW, size, font) {
    let s = size;
    do { ctx.font = `${font.replace("{s}", s)}`; s -= 2; } while (ctx.measureText(text).width > maxW && s > 20);
  }

  function drawSeal(ctx, cx, cy, r) {
    // estrella dentada
    ctx.save(); ctx.translate(cx, cy);
    ctx.beginPath();
    const n = 28;
    for (let i = 0; i < n * 2; i++) {
      const rr = i % 2 ? r * 0.9 : r;
      const a = (Math.PI * i) / n;
      ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
    }
    ctx.closePath();
    const g = ctx.createRadialGradient(0, -r * .3, r * .1, 0, 0, r);
    g.addColorStop(0, "#ffe39a"); g.addColorStop(1, "#d9962a");
    ctx.fillStyle = g; ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, r * .72, 0, Math.PI * 2); ctx.fillStyle = "#0b1a3d"; ctx.fill();
    ctx.lineWidth = 4; ctx.strokeStyle = "#f5b942"; ctx.stroke();
    // cerebro/circuito simplificado
    ctx.strokeStyle = "#19d3c5"; ctx.lineWidth = 5; ctx.lineCap = "round";
    const pts = [[-28, -10], [0, -30], [28, -10], [18, 22], [-18, 22]];
    ctx.beginPath(); pts.forEach((p, i) => { i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -30); ctx.lineTo(0, 0); ctx.lineTo(-28, -10); ctx.moveTo(0, 0); ctx.lineTo(28, -10); ctx.moveTo(0, 0); ctx.lineTo(-18, 22); ctx.moveTo(0, 0); ctx.lineTo(18, 22); ctx.stroke();
    ctx.fillStyle = "#f5b942";
    [...pts, [0, 0]].forEach(p => { ctx.beginPath(); ctx.arc(p[0], p[1], 7, 0, Math.PI * 2); ctx.fill(); });
    ctx.fillStyle = "#f5b942"; ctx.font = "700 16px Orbitron, sans-serif"; ctx.textAlign = "center";
    ctx.fillText("ESCAPE", 0, 52);
    ctx.restore();
  }

  async function draw(canvas, data) {
    try { await document.fonts.ready; } catch (e) {}
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;

    // fondo
    ctx.fillStyle = "#fbf8f0"; ctx.fillRect(0, 0, W, H);
    // patrón sutil
    ctx.strokeStyle = "rgba(14,159,149,.07)"; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // bordes
    ctx.lineWidth = 18; ctx.strokeStyle = "#0b1a3d"; roundRect(ctx, 30, 30, W - 60, H - 60, 26); ctx.stroke();
    ctx.lineWidth = 4; ctx.strokeStyle = "#f5b942"; roundRect(ctx, 58, 58, W - 116, H - 116, 18); ctx.stroke();
    ctx.lineWidth = 2; ctx.strokeStyle = "#19d3c5"; roundRect(ctx, 72, 72, W - 144, H - 144, 14); ctx.stroke();

    // banda superior
    const grd = ctx.createLinearGradient(0, 0, W, 0);
    grd.addColorStop(0, "#0b1a3d"); grd.addColorStop(1, "#123a6b");
    ctx.fillStyle = grd; roundRect(ctx, 72, 72, W - 144, 150, 14); ctx.fill();
    ctx.fillStyle = "#19d3c5"; ctx.font = "900 46px Orbitron, sans-serif"; ctx.textAlign = "center";
    ctx.fillText("BÓVEDA NEURAL", W / 2, 140);
    ctx.fillStyle = "#f5b942"; ctx.font = "600 22px Inter, sans-serif";
    ctx.fillText("ESCAPE DEL BANCO AUSTRAL DE DATOS · ESCAPE ROOM DE INTELIGENCIA ARTIFICIAL", W / 2, 186);

    // título
    ctx.fillStyle = "#0b1a3d"; ctx.font = "700 58px Orbitron, sans-serif";
    ctx.fillText("CERTIFICADO DE ESCAPE", W / 2, 320);
    ctx.fillStyle = "#4a5878"; ctx.font = "400 26px Inter, sans-serif";
    ctx.fillText("Se certifica que", W / 2, 380);

    // nombre
    ctx.fillStyle = "#0e9f95";
    fitText(ctx, data.name, W - 360, 80, "700 {s}px Inter, sans-serif");
    ctx.fillText(data.name, W / 2, 470);
    ctx.strokeStyle = "#f5b942"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(W / 2 - 420, 500); ctx.lineTo(W / 2 + 420, 500); ctx.stroke();

    // texto
    ctx.fillStyle = "#26314d"; ctx.font = "400 26px Inter, sans-serif";
    ctx.fillText("logró escapar de la Bóveda Neural superando las 6 salas y demostrando conocimientos sobre", W / 2, 556);
    ctx.font = "600 26px Inter, sans-serif";
    ctx.fillText("Big Data, ética de datos, pensamiento computacional, Machine Learning y Prompt Engineering.", W / 2, 596);

    // palabras clave
    const kws = data.keywords;
    let fs = 22, pad = 22, gap = 16, widths, total;
    do {
      ctx.font = `700 ${fs}px Orbitron, sans-serif`;
      widths = kws.map(k => ctx.measureText(k).width + pad * 2);
      total = widths.reduce((a, b) => a + b, 0) + gap * (kws.length - 1);
      if (total > W - 220) { fs -= 1; pad = Math.max(12, pad - 1); gap = Math.max(8, gap - 1); }
    } while (total > W - 220 && fs > 12);
    let x = W / 2 - total / 2;
    kws.forEach((k, i) => {
      ctx.fillStyle = "#0b1a3d"; roundRect(ctx, x, 640, widths[i], 50, 25); ctx.fill();
      ctx.fillStyle = "#f5b942"; ctx.textAlign = "center"; ctx.fillText(k, x + widths[i] / 2, 665 + fs * 0.4);
      x += widths[i] + gap;
    });

    // datos
    ctx.textAlign = "center"; ctx.fillStyle = "#26314d"; ctx.font = "500 24px Inter, sans-serif";
    ctx.fillText(`Tiempo: ${data.time}   ·   Reinicios de sala: ${data.resets}   ·   Pistas usadas: ${data.hints}`, W / 2, 750);

    // sello
    drawSeal(ctx, W / 2, 880, 92);

    // firmas
    ctx.strokeStyle = "#0b1a3d"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(190, 920); ctx.lineTo(590, 920); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W - 590, 920); ctx.lineTo(W - 190, 920); ctx.stroke();
    ctx.fillStyle = "#0b1a3d"; ctx.font = "700 24px Inter, sans-serif";
    ctx.fillText(data.docente, 390, 955);
    ctx.fillText(data.date, W - 390, 955);
    ctx.fillStyle = "#4a5878"; ctx.font = "400 20px Inter, sans-serif";
    ctx.fillText("Docente", 390, 985);
    ctx.fillText("Fecha", W - 390, 985);
    ctx.fillStyle = "#4a5878"; ctx.font = "400 20px Inter, sans-serif";
    const inst = [data.curso, data.institucion].filter(Boolean).join(" · ");
    ctx.fillText(inst, W / 2, 1010);
    ctx.font = "400 16px Inter, sans-serif"; ctx.fillStyle = "#8090ad";
    ctx.fillText(`Código de verificación: ${code(data.name, data.date)}   ·   Contenidos: Programa EsencIA, Unidades 2 y 3`, W / 2, 1040);
  }

  function download(canvas, name) {
    const a = document.createElement("a");
    a.download = "Certificado_Boveda_Neural_" + name.replace(/[^\p{L}\p{N}]+/gu, "_") + ".png";
    a.href = canvas.toDataURL("image/png");
    document.body.appendChild(a); a.click(); a.remove();
  }

  function print(canvas) {
    let holder = document.getElementById("cert-print");
    if (!holder) { holder = document.createElement("div"); holder.id = "cert-print"; document.body.appendChild(holder); }
    holder.innerHTML = "";
    const img = new Image(); img.style.width = "100%"; img.src = canvas.toDataURL("image/png");
    holder.appendChild(img);
    img.onload = () => { window.print(); setTimeout(() => holder.remove(), 1000); };
  }

  return { draw, download, print, code };
})();
