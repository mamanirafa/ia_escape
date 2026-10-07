/* =========================================================
   BÓVEDA NEURAL · Escape Room de IA
   Contenidos del juego (Unidades 2 y 3 · Programa EsencIA)
   ---------------------------------------------------------
   Para adaptar el juego, editá SOLO este archivo:
   - CONFIG: datos del docente, curso y tiempo.
   - ROOMS: salas, desafíos y palabras clave.
   ========================================================= */

const CONFIG = {
  titulo: "Bóveda Neural",
  subtitulo: "Escape del Banco Austral de Datos",
  docente: "Prof. Rafael Mamani",
  curso: "5.º año · Ciclo Orientado en Economía",
  institucion: "", // ej.: "Colegio Integral de Educación Ushuaia"
  minutos: 60,
  penalidadPistaMin: 2, // minutos que suma cada pista
  // Código que el docente puede dictar si un grupo no tiene cámara o acceso a una IA.
  // Cambialo antes de cada clase para que no circule.
  codigoDocente: "ARIA2031",
  storageKey: "boveda-neural-v1"
};

/* Tipos de etapa:
   classify  → una situación por vez, elegir la categoría correcta
   mcq       → pregunta de opción múltiple
   match     → unir conceptos con ejemplos
   order     → ordenar pasos de un algoritmo
   builder   → armar un prompt eligiendo piezas
   aipractice→ probar el prompt en una IA real y pegar la respuesta
   vision    → mostrar objetos a la cámara (IA de visión MobileNet)
   Cualquier error reinicia la sala completa. */

const ROOMS = [
  /* ---------------- SALA 1 · BIG DATA ---------------- */
  {
    id: 1,
    nombre: "Centro de Datos",
    tema: "Big Data · Las 3 V",
    icono: "assets/img/sala1.svg",
    palabra: "DATOS",
    minutosSugeridos: 8,
    intro: "Bienvenido/a al Centro de Datos. Cada segundo entran millones de registros: pagos, búsquedas, fotos, sensores… Para abrir la primera puerta, demostrá que sabés reconocer qué hace “grande” al Big Data.",
    pista: "Volumen = CUÁNTO se guarda (enorme cantidad). Velocidad = QUÉ TAN RÁPIDO se generan los datos. Variedad = DE CUÁNTOS TIPOS son (texto, audio, imagen, video).",
    etapas: [
      {
        tipo: "classify",
        titulo: "Clasificá cada flujo de datos",
        consigna: "¿Qué “V” del Big Data se destaca en cada caso?",
        opciones: ["Volumen", "Velocidad", "Variedad"],
        cantidad: 5,
        items: [
          { texto: "Una billetera virtual procesa miles de pagos por segundo durante el Black Friday.", r: "Velocidad" },
          { texto: "Un supermercado guarda 10 años de tickets de compra de todas sus sucursales del país.", r: "Volumen" },
          { texto: "Un banco analiza a la vez reclamos escritos, audios del call center y fotos de cheques.", r: "Variedad" },
          { texto: "La bolsa de valores actualiza los precios de las acciones cada milisegundo.", r: "Velocidad" },
          { texto: "Una red social almacena miles de millones de publicaciones de usuarios de todo el mundo.", r: "Volumen" },
          { texto: "Una app de delivery combina ubicación GPS, reseñas escritas y fotos de los platos.", r: "Variedad" }
        ]
      },
      {
        tipo: "mcq",
        titulo: "Big Data + IA",
        pregunta: "Netflix te recomienda una serie nueva. ¿Cómo trabajan juntos el Big Data y la IA en ese caso?",
        opciones: [
          { t: "El Big Data aporta los datos (qué mirás, cuándo pausás) y la IA los analiza para encontrar patrones y recomendar.", ok: true },
          { t: "La IA inventa tus gustos sin necesidad de datos, y el Big Data solo guarda las películas." },
          { t: "Son lo mismo: Big Data es otro nombre para la inteligencia artificial." },
          { t: "Un empleado de Netflix revisa tu historial a mano y elige la serie." }
        ]
      }
    ]
  },

  /* ---------------- SALA 2 · ÉTICA DE DATOS ---------------- */
  {
    id: 2,
    nombre: "Oficina de Cumplimiento",
    tema: "Ética en el manejo de datos",
    icono: "assets/img/sala2.svg",
    palabra: "CONFIANZA",
    minutosSugeridos: 8,
    intro: "Llegaste a Cumplimiento: acá se decide qué empresas pueden usar datos de clientes. Hay casos sospechosos sobre el escritorio. Identificá qué principio ético está en juego en cada uno.",
    pista: "Transparencia = explicar QUÉ datos se usan y PARA QUÉ. Consentimiento = pedir PERMISO antes de usarlos. Privacidad = PROTEGER los datos y no compartirlos con terceros.",
    etapas: [
      {
        tipo: "classify",
        titulo: "Expedientes sospechosos",
        consigna: "¿Qué principio ético se cumple o se viola en cada caso?",
        opciones: ["Transparencia", "Consentimiento", "Privacidad"],
        cantidad: 5,
        items: [
          { texto: "Una billetera virtual comparte el detalle de tus gastos con una aseguradora sin avisarte.", r: "Privacidad" },
          { texto: "Una app de préstamos te pide acceso a todos tus contactos y no explica para qué los necesita.", r: "Transparencia" },
          { texto: "Una tienda online empieza a usar tu historial de compras para publicidad sin pedirte autorización.", r: "Consentimiento" },
          { texto: "Una app de fitness vende tus datos de salud a otras empresas.", r: "Privacidad" },
          { texto: "El banco publica, en lenguaje simple, qué datos usa para calcular tu puntaje crediticio.", r: "Transparencia" },
          { texto: "Antes de activar las recomendaciones, la tienda te pregunta si aceptás que use tu historial.", r: "Consentimiento" }
        ]
      },
      {
        tipo: "mcq",
        titulo: "Decisión final de Cumplimiento",
        pregunta: "Si una empresa no respeta estos principios, ¿qué es lo PRIMERO que pierde con sus clientes?",
        opciones: [
          { t: "La confianza de los usuarios, y además puede enfrentar consecuencias legales.", ok: true },
          { t: "Nada: si el servicio es gratis, los datos ya no importan." },
          { t: "Solo pierde velocidad de internet." },
          { t: "Gana más clientes porque tiene más datos." }
        ]
      }
    ]
  },

  /* ---------------- SALA 3 · PENSAMIENTO COMPUTACIONAL ---------------- */
  {
    id: 3,
    nombre: "Laboratorio de Algoritmos",
    tema: "Pensamiento computacional",
    icono: "assets/img/sala3.svg",
    palabra: "ALGORITMO",
    minutosSugeridos: 10,
    intro: "Este laboratorio es el cerebro del banco. ARIA desordenó los procesos. Primero uní cada habilidad del pensamiento computacional con su ejemplo; después reconstruí el algoritmo que aprueba microcréditos.",
    pista: "Descomponer = dividir en partes. Patrones = algo que se repite. Secuenciación = pasos en orden. Abstracción = quedarse con lo importante. En el algoritmo, pensá: primero los datos y el permiso, al final la decisión.",
    etapas: [
      {
        tipo: "match",
        titulo: "Uní cada habilidad con su ejemplo",
        consigna: "Elegí la habilidad que corresponde a cada situación.",
        pares: [
          { izq: "Dividir el presupuesto del viaje de egresados en transporte, alojamiento, comida y salidas.", der: "Descomposición" },
          { izq: "Notar que las ventas de helado suben todos los veranos.", der: "Reconocimiento de patrones" },
          { izq: "Seguir siempre los mismos pasos: ingresar, verificar saldo, confirmar y emitir comprobante.", der: "Secuenciación y algoritmos" },
          { izq: "Para estimar la inflación, usar solo las variables clave e ignorar datos irrelevantes como el diseño de los billetes.", der: "Abstracción" }
        ]
      },
      {
        tipo: "order",
        titulo: "Reconstruí el algoritmo",
        consigna: "Tocá los pasos en el orden correcto para aprobar un microcrédito a un emprendedor.",
        pasos: [
          "Recibir la solicitud con los datos del emprendedor",
          "Verificar su identidad y pedir su consentimiento para usar los datos",
          "Analizar sus ingresos y gastos mensuales",
          "Comparar con patrones de pago de casos anteriores",
          "Calcular el nivel de riesgo",
          "Aprobar o rechazar e informar el motivo"
        ]
      }
    ]
  },

  /* ---------------- SALA 4 · MACHINE LEARNING ---------------- */
  {
    id: 4,
    nombre: "Fábrica de Modelos",
    tema: "Machine Learning y Deep Learning",
    icono: "assets/img/sala4.svg",
    palabra: "MODELO",
    minutosSugeridos: 10,
    intro: "En la Fábrica de Modelos las máquinas aprenden de los datos. Primero clasificá cómo aprende cada sistema. Después vas a entrenar tu ojo con una IA de visión real: ¡prepará la cámara!",
    pista: "Supervisado = aprende con ejemplos ETIQUETADOS (ya sabemos la respuesta). No supervisado = busca GRUPOS solo, sin etiquetas. Profundo = usa REDES NEURONALES para imágenes, voz o video.",
    etapas: [
      {
        tipo: "classify",
        titulo: "¿Cómo aprende cada sistema?",
        consigna: "Elegí el tipo de aprendizaje.",
        opciones: ["Supervisado", "No supervisado", "Profundo (redes neuronales)"],
        cantidad: 5,
        items: [
          { texto: "Filtrar correos spam usando miles de mensajes ya etiquetados como “spam” o “no spam”.", r: "Supervisado" },
          { texto: "Agrupar a los clientes de un banco según cómo gastan, sin categorías definidas de antemano.", r: "No supervisado" },
          { texto: "Detectar billetes falsos analizando fotos con una red neuronal artificial.", r: "Profundo (redes neuronales)" },
          { texto: "Predecir si alguien pagará su préstamo usando historiales marcados como “pagó” o “no pagó”.", r: "Supervisado" },
          { texto: "Descubrir qué productos se compran juntos en el supermercado sin decirle nada previo al sistema.", r: "No supervisado" },
          { texto: "Desbloquear el celular reconociendo tu rostro desde distintos ángulos.", r: "Profundo (redes neuronales)" }
        ]
      },
      {
        tipo: "vision",
        titulo: "Laboratorio de visión artificial",
        consigna: "Mostrale a la cámara 2 objetos DISTINTOS de la lista. La IA (una red neuronal entrenada con millones de imágenes) tiene que reconocerlos.",
        necesarios: 2,
        objetivos: [
          { nombre: "Celular", emoji: "📱", etiquetas: ["cellular telephone", "cellphone", "mobile phone", "ipod", "hand-held computer", "dial telephone"] },
          { nombre: "Botella", emoji: "🧴", etiquetas: ["water bottle", "pop bottle", "water jug", "beer bottle", "wine bottle", "pill bottle"] },
          { nombre: "Taza o vaso", emoji: "☕", etiquetas: ["coffee mug", "cup", "beer glass", "goblet", "measuring cup"] },
          { nombre: "Teclado o mouse", emoji: "⌨️", etiquetas: ["computer keyboard", "typewriter keyboard", "space bar", "mouse, computer mouse", "computer mouse"] },
          { nombre: "Mochila", emoji: "🎒", etiquetas: ["backpack", "knapsack", "mailbag"] },
          { nombre: "Billetera", emoji: "👛", etiquetas: ["wallet", "purse", "billfold"] },
          { nombre: "Lapicera o lápiz", emoji: "🖊️", etiquetas: ["ballpoint", "fountain pen", "pencil", "rubber eraser"] },
          { nombre: "Anteojos", emoji: "👓", etiquetas: ["sunglasses", "sunglass", "loupe"] }
        ]
      },
      {
        tipo: "mcq",
        titulo: "¿Qué significa el porcentaje?",
        pregunta: "Cuando la IA de visión mostraba “taza 62 %”, ¿qué quería decir?",
        opciones: [
          { t: "Que el modelo estima una probabilidad: según los patrones que aprendió, es bastante probable que sea una taza, pero puede equivocarse.", ok: true },
          { t: "Que la taza está llena al 62 %." },
          { t: "Que la IA está 100 % segura y nunca se equivoca." },
          { t: "Que una persona revisó la foto y votó." }
        ]
      }
    ]
  },

  /* ---------------- SALA 5 · PROMPT ENGINEERING ---------------- */
  {
    id: 5,
    nombre: "Estudio de Prompts",
    tema: "Prompt Engineering",
    icono: "assets/img/sala5.svg",
    palabra: "PROMPT",
    minutosSugeridos: 12,
    intro: "ARIA solo obedece instrucciones claras. En el Estudio de Prompts vas a reconocer técnicas, armar el prompt perfecto y probarlo con una IA real. La calidad de la respuesta depende de tu instrucción.",
    pista: "Role prompting = “Sos un…”. Zero shot = sin ejemplos. Few shot = con ejemplos. Cadena de pensamiento = “Paso 1… Paso 2…”. Un buen prompt es claro, específico, con contexto y SIN datos personales.",
    etapas: [
      {
        tipo: "classify",
        titulo: "Detectá la técnica",
        consigna: "¿Qué técnica de prompting usa cada instrucción?",
        opciones: ["Role prompting", "Zero shot", "Few shot", "Cadena de pensamiento"],
        cantidad: 4,
        items: [
          { texto: "“Sos un asesor financiero especializado en jóvenes. Explicame cómo empezar a ahorrar.”", r: "Role prompting" },
          { texto: "“Describí los pasos básicos para abrir un emprendimiento de venta de ropa.”", r: "Zero shot" },
          { texto: "“Estos son slogans: ‘Tu dinero, tu futuro’ y ‘Ahorrá hoy, viví mañana’. Creá uno para una app de finanzas.”", r: "Few shot" },
          { texto: "“Armá un plan para una cafetería. Paso 1: el concepto. Paso 2: el marketing. Paso 3: los costos iniciales.”", r: "Cadena de pensamiento" },
          { texto: "“Actuá como economista del Banco Central y explicá qué es la inflación a un chico de 12 años.”", r: "Role prompting" },
          { texto: "“Ejemplo 1: Pan → canasta básica. Ejemplo 2: Leche → canasta básica. Ahora clasificá: Celular → ?”", r: "Few shot" }
        ]
      },
      {
        tipo: "builder",
        titulo: "Armá el prompt perfecto",
        consigna: "Elegí la mejor pieza para cada parte del prompt. Ojo: ARIA detecta instrucciones vagas y datos personales.",
        piezas: [
          {
            parte: "Rol",
            opciones: [
              { t: "Sos un asesor financiero que ayuda a estudiantes secundarios.", ok: true },
              { t: "Sos alguien.", fb: "Demasiado vago: el rol no aporta ninguna perspectiva." },
              { t: "Sos mi tío Juan Pérez, DNI 30.123.456.", fb: "¡Datos personales! Nunca compartas información sensible en un prompt." }
            ]
          },
          {
            parte: "Tarea",
            opciones: [
              { t: "Armá un presupuesto mensual para ahorrar para el viaje de egresados.", ok: true },
              { t: "Hablame de plata.", fb: "Poco claro y nada específico." },
              { t: "Decime la contraseña del home banking de mi familia.", fb: "Pedido inseguro y no ético." }
            ]
          },
          {
            parte: "Contexto",
            opciones: [
              { t: "Un estudiante de 17 años recibe $60.000 por mes y quiere juntar $300.000 en 8 meses.", ok: true },
              { t: "Tengo algo de plata, no sé cuánto.", fb: "Falta contexto: la IA no puede calcular nada." },
              { t: "Vivo en calle Maipú 1234, mi celular es 2901-555555.", fb: "Dirección y teléfono son datos personales: ¡fuera!" }
            ]
          },
          {
            parte: "Formato",
            opciones: [
              { t: "Respondé con una tabla de gastos y ahorro, y terminá con 3 consejos prácticos.", ok: true },
              { t: "Como quieras.", fb: "Sin formato, la respuesta puede ser desordenada." },
              { t: "Escribí 50 páginas.", fb: "Pedido exagerado: no es útil ni específico." }
            ]
          }
        ]
      },
      {
        tipo: "aipractice",
        titulo: "Probalo con una IA real",
        consigna: "Copiá tu prompt, pegalo en una IA (Gemini, ChatGPT o Copilot), y pegá acá la respuesta que te dio.",
        minCaracteres: 200
      },
      {
        tipo: "mcq",
        titulo: "Revisión de la respuesta",
        pregunta: "La IA te devolvió un presupuesto. Antes de usarlo, ¿qué deberías hacer?",
        opciones: [
          { t: "Revisar que las cuentas den bien y que cumpla lo que pedí; si no, ajustar el prompt y volver a intentar.", ok: true },
          { t: "Usarlo tal cual: la IA nunca se equivoca con números." },
          { t: "Borrar el prompt y no usar más la IA." },
          { t: "Agregarle mi DNI para que la IA lo personalice mejor." }
        ]
      }
    ]
  },

  /* ---------------- SALA 6 · ALUCINACIONES Y SESGO ---------------- */
  {
    id: 6,
    nombre: "Sala de Verificación",
    tema: "Alucinaciones y sesgo algorítmico",
    icono: "assets/img/sala6.svg",
    palabra: "VERDAD",
    minutosSugeridos: 8,
    intro: "Última sala antes de la bóveda. ARIA está fallando: mezcla datos reales con datos inventados. Detectá sus alucinaciones y resolvé un caso de sesgo. Si te equivocás… vuelta a empezar.",
    pista: "Una alucinación es una respuesta inventada que suena segura. Desconfiá de fechas imposibles u obras que no existen. Si dudás, verificá en una fuente confiable.",
    etapas: [
      {
        tipo: "classify",
        titulo: "¿Dato real o alucinación?",
        consigna: "ARIA afirma lo siguiente. ¿Es real o es una alucinación?",
        opciones: ["Real", "Alucinación"],
        cantidad: 5,
        items: [
          { texto: "“Adam Smith publicó ‘La riqueza de las naciones’ en 1776.”", r: "Real" },
          { texto: "“John Maynard Keynes recibió el Premio Nobel de Economía en 1975.”", r: "Alucinación" },
          { texto: "“El Banco Central de la República Argentina fue creado en 1935.”", r: "Real" },
          { texto: "“El Mercosur nació en 1991 con la firma del Tratado de Asunción.”", r: "Real" },
          { texto: "“Gabriel García Márquez publicó su novela ‘El solitario del mar’ en 2022.”", r: "Alucinación" },
          { texto: "“Netflix fue fundada por Google en 2015.”", r: "Alucinación" },
          { texto: "“La moneda oficial de Uruguay es el peso uruguayo.”", r: "Real" }
        ]
      },
      {
        tipo: "mcq",
        titulo: "Caso de sesgo algorítmico",
        pregunta: "Una IA para elegir personal aprendió con datos de una empresa que durante años contrató casi solo varones. Ahora rechaza a muchas mujeres. ¿Qué pasó y qué conviene hacer?",
        opciones: [
          { t: "Es sesgo algorítmico: los datos de entrenamiento no eran representativos. Hay que revisar y equilibrar los datos y controlar los resultados.", ok: true },
          { t: "Es una alucinación de imagen: hay que pedirle que dibuje mejor." },
          { t: "La IA tiene razón porque los datos nunca mienten." },
          { t: "No pasa nada: las decisiones automáticas no necesitan revisión humana." }
        ]
      }
    ]
  }
];

/* Mensajes de ARIA cuando la sala se reinicia */
const ALERTAS = [
  "¡ALERTA! Respuesta incorrecta detectada. Reiniciando la sala…",
  "Error en el sistema. Los datos se mezclaron otra vez.",
  "ARIA bloqueó la puerta. Volvé a intentarlo desde el principio de la sala.",
  "Acceso denegado. Respirá, leé con atención y probá de nuevo."
];
