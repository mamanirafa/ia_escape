/* =========================================================
   Visión artificial con TensorFlow.js + MobileNet
   Se carga solo cuando el jugador llega a la Sala 4.
   ========================================================= */
const Vision = (() => {
  const TF_URL = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js";
  const MN_URL = "https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.1/dist/mobilenet.min.js";
  let model = null;
  let loading = null;
  let stream = null;

  function loadScript(src) {
    return new Promise((res, rej) => {
      if ([...document.scripts].some(s => s.src === src)) return res();
      const s = document.createElement("script");
      s.src = src; s.async = true;
      s.onload = res; s.onerror = () => rej(new Error("No se pudo cargar " + src));
      document.head.appendChild(s);
    });
  }

  async function loadModel() {
    if (model) return model;
    if (!loading) {
      loading = (async () => {
        await loadScript(TF_URL);
        await loadScript(MN_URL);
        model = await window.mobilenet.load({ version: 2, alpha: 1.0 });
        return model;
      })().catch(e => { loading = null; throw e; });
    }
    return loading;
  }

  async function startCamera(video) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error("Este navegador no permite usar la cámara.");
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } }, audio: false });
    video.srcObject = stream;
    await video.play();
  }

  function stopCamera() {
    if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
  }

  async function classify(el) {
    const m = await loadModel();
    return m.classify(el, 5); // [{className, probability}]
  }

  /* Traducción breve de etiquetas frecuentes (ImageNet está en inglés) */
  const ES = {
    "cellular telephone": "teléfono celular", "water bottle": "botella de agua", "coffee mug": "taza", "cup": "taza/vaso",
    "computer keyboard": "teclado", "mouse": "mouse", "backpack": "mochila", "wallet": "billetera", "purse": "cartera/monedero",
    "ballpoint": "lapicera", "fountain pen": "pluma", "pencil": "lápiz", "sunglasses": "anteojos de sol", "sunglass": "anteojos",
    "pop bottle": "botella", "notebook": "notebook", "laptop": "laptop", "monitor": "monitor", "screen": "pantalla",
    "desktop computer": "computadora", "television": "televisor", "remote control": "control remoto", "book jacket": "libro",
    "envelope": "sobre", "binder": "carpeta", "pill bottle": "frasco", "beer glass": "vaso", "water jug": "bidón",
    "lab coat": "guardapolvo", "jersey": "remera", "sweatshirt": "buzo", "wig": "peluca", "mask": "máscara", "hand-held computer": "dispositivo de mano",
    "ipod": "reproductor", "analog clock": "reloj", "wall clock": "reloj de pared", "digital clock": "reloj digital", "tennis ball": "pelota de tenis", "paper towel": "rollo de papel", "toilet tissue": "papel higiénico", "web site": "sitio web", "calculator": "calculadora", "pencil box": "cartuchera", "carton": "caja", "plastic bag": "bolsa", "t-shirt": "remera", "cardigan": "saquito", "spotlight": "foco", "lampshade": "lámpara", "table lamp": "lámpara", "desk": "escritorio", "chair": "silla", "folding chair": "silla", "window shade": "persiana", "street sign": "cartel", "banana": "banana", "orange": "naranja", "granny smith": "manzana", "loupe": "lupa", "rubber eraser": "goma de borrar", "space bar": "teclado", "typewriter keyboard": "teclado"
  };
  function translate(className) {
    const first = className.split(",")[0].trim().toLowerCase();
    if (ES[first]) return ES[first];
    for (const k in ES) if (first.includes(k)) return ES[k];
    return first;
  }

  return { loadModel, startCamera, stopCamera, classify, translate, get ready() { return !!model; } };
})();
