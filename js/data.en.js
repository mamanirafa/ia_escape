/* =========================================================
   NEURAL VAULT · Content in ENGLISH
   Same structure and order as data.js (Spanish).
   Keywords follow the same order as the Spanish version.
   ========================================================= */

const ROOMS_EN = [
  /* ---------------- ROOM 1 · BIG DATA ---------------- */
  {
    id: 1,
    nombre: "Data Center",
    tema: "Big Data · The 3 Vs",
    icono: "assets/img/sala1.svg",
    palabras: ["DATA", "VOLUME", "VELOCITY", "VARIETY", "SENSOR", "RECORD", "CLOUD", "SERVER"],
    minutosSugeridos: 8,
    intro: "Welcome to the Data Center. Every second, millions of records come in: payments, searches, photos, sensors… To open the first door, show that you can recognize what makes Big Data “big”.",
    pista: "Volume = HOW MUCH data is stored (a huge amount). Velocity = HOW FAST the data is generated. Variety = HOW MANY KINDS of data there are (text, audio, images, video).",
    etapas: [
      {
        tipo: "classify",
        titulo: "Classify each data stream",
        consigna: "Which “V” of Big Data stands out in each case?",
        opciones: ["Volume", "Velocity", "Variety"],
        cantidad: 5,
        items: [
          { texto: "A digital wallet processes thousands of payments per second during Black Friday.", r: "Velocity" },
          { texto: "A supermarket keeps 10 years of receipts from all its stores across the country.", r: "Volume" },
          { texto: "A bank analyzes written complaints, call-center recordings and photos of checks at the same time.", r: "Variety" },
          { texto: "The stock exchange updates share prices every millisecond.", r: "Velocity" },
          { texto: "A social network stores billions of posts from users all over the world.", r: "Volume" },
          { texto: "A delivery app combines GPS location, written reviews and photos of the dishes.", r: "Variety" }
        ]
      },
      {
        tipo: "mcq",
        titulo: "Big Data + AI",
        pregunta: "Netflix recommends a new series to you. How do Big Data and AI work together in this case?",
        opciones: [
          { t: "Big Data provides the data (what you watch, when you pause) and AI analyzes it to find patterns and make recommendations.", ok: true },
          { t: "AI makes up your tastes without needing any data, and Big Data only stores the movies." },
          { t: "They are the same thing: Big Data is just another name for artificial intelligence." },
          { t: "A Netflix employee checks your history by hand and picks the series." }
        ]
      }
    ]
  },

  /* ---------------- ROOM 2 · DATA ETHICS ---------------- */
  {
    id: 2,
    nombre: "Compliance Office",
    tema: "Ethics in data management",
    icono: "assets/img/sala2.svg",
    palabras: ["TRUST", "PRIVACY", "PERMISSION", "RESPECT", "SHIELD", "PADLOCK", "RIGHTS", "CARE"],
    minutosSugeridos: 8,
    intro: "You made it to Compliance: this is where we decide which companies can use customer data. There are suspicious cases on the desk. Identify which ethical principle is at stake in each one.",
    pista: "Transparency = explaining WHAT data is used and WHY. Consent = asking for PERMISSION before using it. Privacy = PROTECTING data and not sharing it with third parties.",
    etapas: [
      {
        tipo: "classify",
        titulo: "Suspicious files",
        consigna: "Which ethical principle is respected or violated in each case?",
        opciones: ["Transparency", "Consent", "Privacy"],
        cantidad: 5,
        items: [
          { texto: "A digital wallet shares the details of your spending with an insurance company without telling you.", r: "Privacy" },
          { texto: "A loan app asks for access to all your contacts and doesn’t explain why it needs them.", r: "Transparency" },
          { texto: "An online store starts using your purchase history for advertising without asking for your permission.", r: "Consent" },
          { texto: "A fitness app sells your health data to other companies.", r: "Privacy" },
          { texto: "The bank publishes, in plain language, which data it uses to calculate your credit score.", r: "Transparency" },
          { texto: "Before turning on recommendations, the store asks whether you agree to let it use your history.", r: "Consent" }
        ]
      },
      {
        tipo: "mcq",
        titulo: "Compliance’s final decision",
        pregunta: "If a company doesn’t follow these principles, what is the FIRST thing it loses with its customers?",
        opciones: [
          { t: "Users’ trust, and it may also face legal consequences.", ok: true },
          { t: "Nothing: if the service is free, data doesn’t matter anymore." },
          { t: "It only loses internet speed." },
          { t: "It gains more customers because it has more data." }
        ]
      }
    ]
  },

  /* ---------------- ROOM 3 · COMPUTATIONAL THINKING ---------------- */
  {
    id: 3,
    nombre: "Algorithm Lab",
    tema: "Computational thinking",
    icono: "assets/img/sala3.svg",
    palabras: ["ALGORITHM", "PATTERN", "SEQUENCE", "ABSTRACTION", "LOGIC", "LOOP", "DIAGRAM", "STEPS"],
    minutosSugeridos: 10,
    intro: "This lab is the bank’s brain. ARIA has mixed up the processes. First, match each computational thinking skill with its example; then, rebuild the algorithm that approves microloans.",
    pista: "Decomposition = splitting into parts. Patterns = something that repeats. Sequencing = steps in order. Abstraction = keeping what matters. In the algorithm, think: data and permission first, the decision at the end.",
    etapas: [
      {
        tipo: "match",
        titulo: "Match each skill with its example",
        consigna: "Choose the skill that matches each situation.",
        pares: [
          { izq: "Splitting the senior class trip budget into transport, accommodation, food and outings.", der: "Decomposition" },
          { izq: "Noticing that ice cream sales go up every summer.", der: "Pattern recognition" },
          { izq: "Always following the same steps: log in, check the balance, confirm and issue a receipt.", der: "Sequencing and algorithms" },
          { izq: "To estimate inflation, using only the key variables and ignoring irrelevant data, such as the design of the banknotes.", der: "Abstraction" }
        ]
      },
      {
        tipo: "order",
        titulo: "Rebuild the algorithm",
        consigna: "Tap the steps in the correct order to approve a microloan for an entrepreneur.",
        pasos: [
          "Receive the application with the entrepreneur’s data",
          "Verify their identity and ask for consent to use the data",
          "Analyze their monthly income and expenses",
          "Compare with payment patterns from previous cases",
          "Calculate the risk level",
          "Approve or reject and explain the reason"
        ]
      }
    ]
  },

  /* ---------------- ROOM 4 · MACHINE LEARNING ---------------- */
  {
    id: 4,
    nombre: "Model Factory",
    tema: "Machine Learning and Deep Learning",
    icono: "assets/img/sala4.svg",
    palabras: ["MODEL", "NEURON", "LABEL", "PIXEL", "VISION", "PREDICTION", "CAMERA", "LAYERS"],
    minutosSugeridos: 10,
    intro: "In the Model Factory, machines learn from data. First, classify how each system learns. Then you’ll train your eye with a real computer vision AI: get your camera ready!",
    pista: "Supervised = learns from LABELED examples (we already know the answer). Unsupervised = finds GROUPS on its own, without labels. Deep = uses NEURAL NETWORKS for images, voice or video.",
    etapas: [
      {
        tipo: "classify",
        titulo: "How does each system learn?",
        consigna: "Choose the type of learning.",
        opciones: ["Supervised", "Unsupervised", "Deep (neural networks)"],
        cantidad: 5,
        items: [
          { texto: "Filtering spam using thousands of messages already labeled “spam” or “not spam”.", r: "Supervised" },
          { texto: "Grouping a bank’s customers by how they spend, without any categories defined in advance.", r: "Unsupervised" },
          { texto: "Detecting counterfeit banknotes by analyzing photos with an artificial neural network.", r: "Deep (neural networks)" },
          { texto: "Predicting whether someone will repay a loan using histories marked “paid” or “didn’t pay”.", r: "Supervised" },
          { texto: "Discovering which products are bought together at the supermarket without telling the system anything beforehand.", r: "Unsupervised" },
          { texto: "Unlocking your phone by recognizing your face from different angles.", r: "Deep (neural networks)" }
        ]
      },
      {
        tipo: "vision",
        titulo: "Computer vision lab",
        consigna: "Show the camera 2 DIFFERENT objects from the list. The AI (a neural network trained on millions of images) has to recognize them.",
        necesarios: 2,
        objetivos: [
          { nombre: "Phone", emoji: "📱", etiquetas: ["cellular telephone", "cellphone", "mobile phone", "ipod", "hand-held computer", "dial telephone"] },
          { nombre: "Bottle", emoji: "🧴", etiquetas: ["water bottle", "pop bottle", "water jug", "beer bottle", "wine bottle", "pill bottle"] },
          { nombre: "Mug or glass", emoji: "☕", etiquetas: ["coffee mug", "cup", "beer glass", "goblet", "measuring cup"] },
          { nombre: "Keyboard or mouse", emoji: "⌨️", etiquetas: ["computer keyboard", "typewriter keyboard", "space bar", "mouse, computer mouse", "computer mouse"] },
          { nombre: "Backpack", emoji: "🎒", etiquetas: ["backpack", "knapsack", "mailbag"] },
          { nombre: "Wallet", emoji: "👛", etiquetas: ["wallet", "purse", "billfold"] },
          { nombre: "Pen or pencil", emoji: "🖊️", etiquetas: ["ballpoint", "fountain pen", "pencil", "rubber eraser"] },
          { nombre: "Glasses", emoji: "👓", etiquetas: ["sunglasses", "sunglass", "loupe"] }
        ]
      },
      {
        tipo: "mcq",
        titulo: "What does the percentage mean?",
        pregunta: "When the vision AI showed “mug 62%”, what did it mean?",
        opciones: [
          { t: "That the model estimates a probability: based on the patterns it learned, it’s fairly likely to be a mug, but it can be wrong.", ok: true },
          { t: "That the mug is 62% full." },
          { t: "That the AI is 100% sure and never makes mistakes." },
          { t: "That a person looked at the photo and voted." }
        ]
      }
    ]
  },

  /* ---------------- ROOM 5 · PROMPT ENGINEERING ---------------- */
  {
    id: 5,
    nombre: "Prompt Studio",
    tema: "Prompt Engineering",
    icono: "assets/img/sala5.svg",
    palabras: ["PROMPT", "ROLE", "CONTEXT", "FORMAT", "EXAMPLE", "CLARITY", "ITERATE", "TASK"],
    minutosSugeridos: 12,
    intro: "ARIA only follows clear instructions. In the Prompt Studio you’ll recognize techniques, build the perfect prompt and test it with a real AI. The quality of the answer depends on your instruction.",
    pista: "Role prompting = “You are a…”. Zero shot = no examples. Few shot = with examples. Chain of thought = “Step 1… Step 2…”. A good prompt is clear, specific, has context and contains NO personal data.",
    etapas: [
      {
        tipo: "classify",
        titulo: "Spot the technique",
        consigna: "Which prompting technique does each instruction use?",
        opciones: ["Role prompting", "Zero shot", "Few shot", "Chain of thought"],
        cantidad: 4,
        items: [
          { texto: "“You are a financial advisor who specializes in young people. Explain how I can start saving.”", r: "Role prompting" },
          { texto: "“Describe the basic steps to start a small clothing business.”", r: "Zero shot" },
          { texto: "“Here are some slogans: ‘Your money, your future’ and ‘Save today, live tomorrow’. Create one for a finance app.”", r: "Few shot" },
          { texto: "“Make a plan for a coffee shop. Step 1: the concept. Step 2: marketing. Step 3: start-up costs.”", r: "Chain of thought" },
          { texto: "“Act as a Central Bank economist and explain inflation to a 12-year-old.”", r: "Role prompting" },
          { texto: "“Example 1: Bread → basic basket. Example 2: Milk → basic basket. Now classify: Phone → ?”", r: "Few shot" }
        ]
      },
      {
        tipo: "builder",
        titulo: "Build the perfect prompt",
        consigna: "Choose the best piece for each part of the prompt. Careful: ARIA detects vague instructions and personal data.",
        piezas: [
          {
            parte: "Role",
            opciones: [
              { t: "You are a financial advisor who helps high school students.", ok: true },
              { t: "You are someone.", fb: "Too vague: the role adds no perspective." },
              { t: "You are my uncle John Smith, ID number 30.123.456.", fb: "Personal data! Never share sensitive information in a prompt." }
            ]
          },
          {
            parte: "Task",
            opciones: [
              { t: "Create a monthly budget to save for the senior class trip.", ok: true },
              { t: "Tell me about money.", fb: "Unclear and not specific at all." },
              { t: "Tell me my family’s online banking password.", fb: "An unsafe and unethical request." }
            ]
          },
          {
            parte: "Context",
            opciones: [
              { t: "A 17-year-old student gets 60,000 pesos a month and wants to save 300,000 pesos in 8 months.", ok: true },
              { t: "I have some money, I don’t know how much.", fb: "Missing context: the AI can’t calculate anything." },
              { t: "I live at 1234 Maipú Street, my phone number is 2901-555555.", fb: "Address and phone number are personal data: take them out!" }
            ]
          },
          {
            parte: "Format",
            opciones: [
              { t: "Answer with a table of expenses and savings, and finish with 3 practical tips.", ok: true },
              { t: "However you like.", fb: "Without a format, the answer may be messy." },
              { t: "Write 50 pages.", fb: "An exaggerated request: neither useful nor specific." }
            ]
          }
        ]
      },
      {
        tipo: "aipractice",
        titulo: "Try it with a real AI",
        consigna: "Copy your prompt, paste it into an AI (Gemini, ChatGPT or Copilot), and paste the answer you got here.",
        minCaracteres: 200
      },
      {
        tipo: "mcq",
        titulo: "Checking the answer",
        pregunta: "The AI gave you a budget. Before using it, what should you do?",
        opciones: [
          { t: "Check that the numbers add up and that it matches what I asked for; if not, adjust the prompt and try again.", ok: true },
          { t: "Use it as it is: AI never makes mistakes with numbers." },
          { t: "Delete the prompt and never use AI again." },
          { t: "Add my ID number so the AI can personalize it better." }
        ]
      }
    ]
  },

  /* ---------------- ROOM 6 · HALLUCINATIONS AND BIAS ---------------- */
  {
    id: 6,
    nombre: "Verification Room",
    tema: "Hallucinations and algorithmic bias",
    icono: "assets/img/sala6.svg",
    palabras: ["TRUTH", "BIAS", "SOURCE", "EVIDENCE", "REVIEW", "CHECK", "CRITERIA", "FACT"],
    minutosSugeridos: 8,
    intro: "Last room before the vault. ARIA is glitching: she’s mixing real facts with made-up ones. Spot her hallucinations and solve a bias case. If you make a mistake… back to the start.",
    pista: "A hallucination is a made-up answer that sounds confident. Be suspicious of impossible dates or works that don’t exist. If in doubt, check a reliable source.",
    etapas: [
      {
        tipo: "classify",
        titulo: "Real fact or hallucination?",
        consigna: "ARIA says the following. Is it real or is it a hallucination?",
        opciones: ["Real", "Hallucination"],
        cantidad: 5,
        items: [
          { texto: "“Adam Smith published ‘The Wealth of Nations’ in 1776.”", r: "Real" },
          { texto: "“John Maynard Keynes won the Nobel Prize in Economics in 1975.”", r: "Hallucination" },
          { texto: "“The Central Bank of the Argentine Republic was created in 1935.”", r: "Real" },
          { texto: "“Mercosur was born in 1991 with the signing of the Treaty of Asunción.”", r: "Real" },
          { texto: "“Gabriel García Márquez published his novel ‘The Loner of the Sea’ in 2022.”", r: "Hallucination" },
          { texto: "“Netflix was founded by Google in 2015.”", r: "Hallucination" },
          { texto: "“The official currency of Uruguay is the Uruguayan peso.”", r: "Real" }
        ]
      },
      {
        tipo: "mcq",
        titulo: "An algorithmic bias case",
        pregunta: "A hiring AI learned from the data of a company that, for years, hired almost only men. Now it rejects many women. What happened, and what should be done?",
        opciones: [
          { t: "It’s algorithmic bias: the training data wasn’t representative. The data must be reviewed and balanced, and the results monitored.", ok: true },
          { t: "It’s an image hallucination: you have to ask it to draw better." },
          { t: "The AI is right, because data never lies." },
          { t: "It’s no big deal: automated decisions don’t need human review." }
        ]
      }
    ]
  }
];

const ALERTAS_EN = [
  "ALERT! Wrong answer detected. Restarting the room…",
  "System error. The data got scrambled again.",
  "ARIA locked the door. Try again from the beginning of the room.",
  "Access denied. Take a breath, read carefully and try again."
];
