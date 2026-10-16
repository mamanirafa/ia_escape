/* =========================================================
   COFFRE NEURONAL · Contenus en FRANÇAIS
   Même structure et même ordre que data.js (espagnol).
   Les mots-clés suivent le même ordre que la version espagnole.
   ========================================================= */

const ROOMS_FR = [
  /* ---------------- SALLE 1 · BIG DATA ---------------- */
  {
    id: 1,
    nombre: "Centre de données",
    tema: "Big Data · Les 3 V",
    icono: "assets/img/sala1.svg",
    palabras: ["DONNÉES", "VOLUME", "VITESSE", "VARIÉTÉ", "CAPTEUR", "REGISTRE", "NUAGE", "SERVEUR"],
    minutosSugeridos: 8,
    intro: "Bienvenue au Centre de données. Chaque seconde, des millions d’informations arrivent : paiements, recherches, photos, capteurs… Pour ouvrir la première porte, montre que tu sais reconnaître ce qui rend le Big Data « big ».",
    pista: "Volume = COMBIEN de données sont stockées (une quantité énorme). Vitesse = À QUELLE VITESSE elles sont produites. Variété = DE COMBIEN DE TYPES elles sont (texte, audio, image, vidéo).",
    etapas: [
      {
        tipo: "classify",
        titulo: "Classe chaque flux de données",
        consigna: "Quel « V » du Big Data ressort dans chaque cas ?",
        opciones: ["Volume", "Vitesse", "Variété"],
        cantidad: 5,
        items: [
          { texto: "Un portefeuille numérique traite des milliers de paiements par seconde pendant le Black Friday.", r: "Vitesse" },
          { texto: "Un supermarché conserve 10 ans de tickets de caisse de tous ses magasins du pays.", r: "Volume" },
          { texto: "Une banque analyse en même temps des réclamations écrites, des appels du service client et des photos de chèques.", r: "Variété" },
          { texto: "La Bourse met à jour le prix des actions chaque milliseconde.", r: "Vitesse" },
          { texto: "Un réseau social stocke des milliards de publications d’utilisateurs du monde entier.", r: "Volume" },
          { texto: "Une application de livraison combine la position GPS, des avis écrits et des photos des plats.", r: "Variété" }
        ]
      },
      {
        tipo: "mcq",
        titulo: "Big Data + IA",
        pregunta: "Netflix te recommande une nouvelle série. Comment le Big Data et l’IA travaillent-ils ensemble dans ce cas ?",
        opciones: [
          { t: "Le Big Data fournit les données (ce que tu regardes, quand tu mets pause) et l’IA les analyse pour trouver des schémas et recommander.", ok: true },
          { t: "L’IA invente tes goûts sans avoir besoin de données, et le Big Data ne fait que stocker les films." },
          { t: "C’est la même chose : Big Data est un autre nom pour l’intelligence artificielle." },
          { t: "Un employé de Netflix vérifie ton historique à la main et choisit la série." }
        ]
      }
    ]
  },

  /* ---------------- SALLE 2 · ÉTHIQUE ---------------- */
  {
    id: 2,
    nombre: "Bureau de conformité",
    tema: "Éthique dans la gestion des données",
    icono: "assets/img/sala2.svg",
    palabras: ["CONFIANCE", "CONFIDENTIALITÉ", "PERMISSION", "RESPECT", "BOUCLIER", "CADENAS", "DROITS", "PRUDENCE"],
    minutosSugeridos: 8,
    intro: "Te voici à la Conformité : ici, on décide quelles entreprises peuvent utiliser les données des clients. Des dossiers suspects t’attendent sur le bureau. Identifie quel principe éthique est en jeu dans chacun.",
    pista: "Transparence = expliquer QUELLES données sont utilisées et POURQUOI. Consentement = demander la PERMISSION avant de les utiliser. Vie privée = PROTÉGER les données et ne pas les partager avec des tiers.",
    etapas: [
      {
        tipo: "classify",
        titulo: "Dossiers suspects",
        consigna: "Quel principe éthique est respecté ou violé dans chaque cas ?",
        opciones: ["Transparence", "Consentement", "Vie privée"],
        cantidad: 5,
        items: [
          { texto: "Un portefeuille numérique partage le détail de tes dépenses avec une compagnie d’assurance sans te prévenir.", r: "Vie privée" },
          { texto: "Une application de prêts te demande l’accès à tous tes contacts sans expliquer pourquoi.", r: "Transparence" },
          { texto: "Une boutique en ligne commence à utiliser ton historique d’achats pour la publicité sans te demander l’autorisation.", r: "Consentement" },
          { texto: "Une application de fitness vend tes données de santé à d’autres entreprises.", r: "Vie privée" },
          { texto: "La banque publie, avec des mots simples, quelles données elle utilise pour calculer ton score de crédit.", r: "Transparence" },
          { texto: "Avant d’activer les recommandations, la boutique te demande si tu acceptes qu’elle utilise ton historique.", r: "Consentement" }
        ]
      },
      {
        tipo: "mcq",
        titulo: "Décision finale de la Conformité",
        pregunta: "Si une entreprise ne respecte pas ces principes, que perd-elle EN PREMIER auprès de ses clients ?",
        opciones: [
          { t: "La confiance des utilisateurs, et elle peut aussi avoir des problèmes juridiques.", ok: true },
          { t: "Rien : si le service est gratuit, les données n’ont plus d’importance." },
          { t: "Elle perd seulement de la vitesse internet." },
          { t: "Elle gagne plus de clients parce qu’elle a plus de données." }
        ]
      }
    ]
  },

  /* ---------------- SALLE 3 · PENSÉE COMPUTATIONNELLE ---------------- */
  {
    id: 3,
    nombre: "Laboratoire des algorithmes",
    tema: "Pensée computationnelle",
    icono: "assets/img/sala3.svg",
    palabras: ["ALGORITHME", "MOTIF", "SÉQUENCE", "ABSTRACTION", "LOGIQUE", "BOUCLE", "DIAGRAMME", "ÉTAPES"],
    minutosSugeridos: 10,
    intro: "Ce laboratoire est le cerveau de la banque. ARIA a mélangé les processus. D’abord, associe chaque compétence de la pensée computationnelle à son exemple ; ensuite, reconstruis l’algorithme qui accorde les microcrédits.",
    pista: "Décomposer = diviser en parties. Motifs = quelque chose qui se répète. Séquence = des étapes dans l’ordre. Abstraction = garder l’essentiel. Dans l’algorithme, pense : d’abord les données et l’autorisation, à la fin la décision.",
    etapas: [
      {
        tipo: "match",
        titulo: "Associe chaque compétence à son exemple",
        consigna: "Choisis la compétence qui correspond à chaque situation.",
        pares: [
          { izq: "Diviser le budget du voyage de fin d’études en transport, logement, repas et sorties.", der: "Décomposition" },
          { izq: "Remarquer que les ventes de glaces augmentent chaque été.", der: "Reconnaissance de motifs" },
          { izq: "Suivre toujours les mêmes étapes : se connecter, vérifier le solde, confirmer et émettre le reçu.", der: "Séquence et algorithmes" },
          { izq: "Pour estimer l’inflation, utiliser seulement les variables clés et ignorer les données inutiles, comme le dessin des billets.", der: "Abstraction" }
        ]
      },
      {
        tipo: "order",
        titulo: "Reconstruis l’algorithme",
        consigna: "Touche les étapes dans le bon ordre pour accorder un microcrédit à un entrepreneur.",
        pasos: [
          "Recevoir la demande avec les données de l’entrepreneur",
          "Vérifier son identité et demander son consentement pour utiliser les données",
          "Analyser ses revenus et ses dépenses mensuels",
          "Comparer avec les habitudes de paiement de cas précédents",
          "Calculer le niveau de risque",
          "Accepter ou refuser et expliquer la raison"
        ]
      }
    ]
  },

  /* ---------------- SALLE 4 · MACHINE LEARNING ---------------- */
  {
    id: 4,
    nombre: "Usine à modèles",
    tema: "Machine Learning et Deep Learning",
    icono: "assets/img/sala4.svg",
    palabras: ["MODÈLE", "NEURONE", "ÉTIQUETTE", "PIXEL", "VISION", "PRÉDICTION", "CAMÉRA", "COUCHES"],
    minutosSugeridos: 10,
    intro: "Dans l’Usine à modèles, les machines apprennent à partir des données. D’abord, classe comment apprend chaque système. Ensuite, tu vas utiliser une vraie IA de vision : prépare la caméra !",
    pista: "Supervisé = apprend avec des exemples ÉTIQUETÉS (on connaît déjà la réponse). Non supervisé = cherche des GROUPES tout seul, sans étiquettes. Profond = utilise des RÉSEAUX DE NEURONES pour les images, la voix ou la vidéo.",
    etapas: [
      {
        tipo: "classify",
        titulo: "Comment apprend chaque système ?",
        consigna: "Choisis le type d’apprentissage.",
        opciones: ["Supervisé", "Non supervisé", "Profond (réseaux de neurones)"],
        cantidad: 5,
        items: [
          { texto: "Filtrer les spams grâce à des milliers de messages déjà étiquetés « spam » ou « pas spam ».", r: "Supervisé" },
          { texto: "Regrouper les clients d’une banque selon leur façon de dépenser, sans catégories définies à l’avance.", r: "Non supervisé" },
          { texto: "Détecter les faux billets en analysant des photos avec un réseau de neurones artificiels.", r: "Profond (réseaux de neurones)" },
          { texto: "Prédire si quelqu’un remboursera son prêt grâce à des historiques marqués « a payé » ou « n’a pas payé ».", r: "Supervisé" },
          { texto: "Découvrir quels produits sont achetés ensemble au supermarché sans rien indiquer au système.", r: "Non supervisé" },
          { texto: "Déverrouiller le téléphone en reconnaissant ton visage sous différents angles.", r: "Profond (réseaux de neurones)" }
        ]
      },
      {
        tipo: "vision",
        titulo: "Laboratoire de vision artificielle",
        consigna: "Montre à la caméra 2 objets DIFFÉRENTS de la liste. L’IA (un réseau de neurones entraîné avec des millions d’images) doit les reconnaître.",
        necesarios: 2,
        objetivos: [
          { nombre: "Téléphone", emoji: "📱", etiquetas: ["cellular telephone", "cellphone", "mobile phone", "ipod", "hand-held computer", "dial telephone"] },
          { nombre: "Bouteille", emoji: "🧴", etiquetas: ["water bottle", "pop bottle", "water jug", "beer bottle", "wine bottle", "pill bottle"] },
          { nombre: "Tasse ou verre", emoji: "☕", etiquetas: ["coffee mug", "cup", "beer glass", "goblet", "measuring cup"] },
          { nombre: "Clavier ou souris", emoji: "⌨️", etiquetas: ["computer keyboard", "typewriter keyboard", "space bar", "mouse, computer mouse", "computer mouse"] },
          { nombre: "Sac à dos", emoji: "🎒", etiquetas: ["backpack", "knapsack", "mailbag"] },
          { nombre: "Portefeuille", emoji: "👛", etiquetas: ["wallet", "purse", "billfold"] },
          { nombre: "Stylo ou crayon", emoji: "🖊️", etiquetas: ["ballpoint", "fountain pen", "pencil", "rubber eraser"] },
          { nombre: "Lunettes", emoji: "👓", etiquetas: ["sunglasses", "sunglass", "loupe"] }
        ]
      },
      {
        tipo: "mcq",
        titulo: "Que veut dire le pourcentage ?",
        pregunta: "Quand l’IA de vision affichait « tasse 62 % », qu’est-ce que cela voulait dire ?",
        opciones: [
          { t: "Que le modèle estime une probabilité : d’après les schémas qu’il a appris, c’est assez probablement une tasse, mais il peut se tromper.", ok: true },
          { t: "Que la tasse est remplie à 62 %." },
          { t: "Que l’IA est sûre à 100 % et ne se trompe jamais." },
          { t: "Qu’une personne a regardé la photo et a voté." }
        ]
      }
    ]
  },

  /* ---------------- SALLE 5 · PROMPT ENGINEERING ---------------- */
  {
    id: 5,
    nombre: "Studio des prompts",
    tema: "Prompt Engineering",
    icono: "assets/img/sala5.svg",
    palabras: ["PROMPT", "RÔLE", "CONTEXTE", "FORMAT", "EXEMPLE", "CLARTÉ", "ITÉRER", "TÂCHE"],
    minutosSugeridos: 12,
    intro: "ARIA n’obéit qu’aux instructions claires. Dans le Studio des prompts, tu vas reconnaître des techniques, construire le prompt parfait et le tester avec une vraie IA. La qualité de la réponse dépend de ton instruction.",
    pista: "Role prompting = « Tu es un… ». Zero shot = sans exemples. Few shot = avec des exemples. Chaîne de pensée = « Étape 1… Étape 2… ». Un bon prompt est clair, précis, avec du contexte et SANS données personnelles.",
    etapas: [
      {
        tipo: "classify",
        titulo: "Trouve la technique",
        consigna: "Quelle technique de prompting utilise chaque instruction ?",
        opciones: ["Role prompting", "Zero shot", "Few shot", "Chaîne de pensée"],
        cantidad: 4,
        items: [
          { texto: "« Tu es un conseiller financier spécialisé dans les jeunes. Explique-moi comment commencer à épargner. »", r: "Role prompting" },
          { texto: "« Décris les étapes de base pour lancer une petite entreprise de vente de vêtements. »", r: "Zero shot" },
          { texto: "« Voici des slogans : “Ton argent, ton avenir” et “Épargne aujourd’hui, vis demain”. Crée-en un pour une appli de finances. »", r: "Few shot" },
          { texto: "« Fais un plan pour un café. Étape 1 : le concept. Étape 2 : le marketing. Étape 3 : les coûts de départ. »", r: "Chaîne de pensée" },
          { texto: "« Agis comme un économiste de la Banque centrale et explique l’inflation à un enfant de 12 ans. »", r: "Role prompting" },
          { texto: "« Exemple 1 : Pain → panier de base. Exemple 2 : Lait → panier de base. Maintenant classe : Téléphone → ? »", r: "Few shot" }
        ]
      },
      {
        tipo: "builder",
        titulo: "Construis le prompt parfait",
        consigna: "Choisis la meilleure pièce pour chaque partie du prompt. Attention : ARIA détecte les instructions vagues et les données personnelles.",
        piezas: [
          {
            parte: "Rôle",
            opciones: [
              { t: "Tu es un conseiller financier qui aide les élèves du secondaire.", ok: true },
              { t: "Tu es quelqu’un.", fb: "Trop vague : le rôle n’apporte aucun point de vue." },
              { t: "Tu es mon oncle Jean Dupont, carte d’identité n° 30.123.456.", fb: "Données personnelles ! Ne partage jamais d’informations sensibles dans un prompt." }
            ]
          },
          {
            parte: "Tâche",
            opciones: [
              { t: "Prépare un budget mensuel pour économiser pour le voyage de fin d’études.", ok: true },
              { t: "Parle-moi d’argent.", fb: "Pas clair et pas du tout précis." },
              { t: "Donne-moi le mot de passe de la banque en ligne de ma famille.", fb: "Demande dangereuse et contraire à l’éthique." }
            ]
          },
          {
            parte: "Contexte",
            opciones: [
              { t: "Un élève de 17 ans reçoit 60 000 pesos par mois et veut réunir 300 000 pesos en 8 mois.", ok: true },
              { t: "J’ai un peu d’argent, je ne sais pas combien.", fb: "Il manque du contexte : l’IA ne peut rien calculer." },
              { t: "J’habite au 1234 rue Maipú, mon numéro est le 2901-555555.", fb: "Adresse et téléphone sont des données personnelles : à supprimer !" }
            ]
          },
          {
            parte: "Format",
            opciones: [
              { t: "Réponds avec un tableau des dépenses et de l’épargne, et termine par 3 conseils pratiques.", ok: true },
              { t: "Comme tu veux.", fb: "Sans format, la réponse peut être désorganisée." },
              { t: "Écris 50 pages.", fb: "Demande exagérée : ni utile ni précise." }
            ]
          }
        ]
      },
      {
        tipo: "aipractice",
        titulo: "Teste-le avec une vraie IA",
        consigna: "Copie ton prompt, colle-le dans une IA (Gemini, ChatGPT ou Copilot) et colle ici la réponse qu’elle t’a donnée.",
        minCaracteres: 200
      },
      {
        tipo: "mcq",
        titulo: "Vérification de la réponse",
        pregunta: "L’IA t’a donné un budget. Avant de l’utiliser, que devrais-tu faire ?",
        opciones: [
          { t: "Vérifier que les calculs sont justes et que la réponse correspond à ma demande ; sinon, ajuster le prompt et réessayer.", ok: true },
          { t: "L’utiliser tel quel : l’IA ne se trompe jamais avec les chiffres." },
          { t: "Effacer le prompt et ne plus jamais utiliser l’IA." },
          { t: "Ajouter mon numéro de carte d’identité pour que l’IA personnalise mieux." }
        ]
      }
    ]
  },

  /* ---------------- SALLE 6 · HALLUCINATIONS ET BIAIS ---------------- */
  {
    id: 6,
    nombre: "Salle de vérification",
    tema: "Hallucinations et biais algorithmique",
    icono: "assets/img/sala6.svg",
    palabras: ["VÉRITÉ", "BIAIS", "SOURCE", "PREUVE", "RÉVISION", "CONTRÔLE", "CRITÈRE", "FAIT"],
    minutosSugeridos: 8,
    intro: "Dernière salle avant le coffre. ARIA déraille : elle mélange des informations vraies et inventées. Repère ses hallucinations et résous un cas de biais. Si tu te trompes… tout recommence.",
    pista: "Une hallucination est une réponse inventée qui a l’air sûre d’elle. Méfie-toi des dates impossibles ou des œuvres qui n’existent pas. En cas de doute, vérifie dans une source fiable.",
    etapas: [
      {
        tipo: "classify",
        titulo: "Vrai ou hallucination ?",
        consigna: "ARIA affirme ceci. Est-ce vrai ou est-ce une hallucination ?",
        opciones: ["Vrai", "Hallucination"],
        cantidad: 5,
        items: [
          { texto: "« Adam Smith a publié “La Richesse des nations” en 1776. »", r: "Vrai" },
          { texto: "« John Maynard Keynes a reçu le prix Nobel d’économie en 1975. »", r: "Hallucination" },
          { texto: "« La Banque centrale de la République argentine a été créée en 1935. »", r: "Vrai" },
          { texto: "« Le Mercosur est né en 1991 avec la signature du traité d’Asunción. »", r: "Vrai" },
          { texto: "« Gabriel García Márquez a publié son roman “Le Solitaire de la mer” en 2022. »", r: "Hallucination" },
          { texto: "« Netflix a été fondé par Google en 2015. »", r: "Hallucination" },
          { texto: "« La monnaie officielle de l’Uruguay est le peso uruguayen. »", r: "Vrai" }
        ]
      },
      {
        tipo: "mcq",
        titulo: "Un cas de biais algorithmique",
        pregunta: "Une IA de recrutement a appris avec les données d’une entreprise qui, pendant des années, a embauché presque uniquement des hommes. Maintenant, elle rejette beaucoup de femmes. Que s’est-il passé et que faut-il faire ?",
        opciones: [
          { t: "C’est un biais algorithmique : les données d’entraînement n’étaient pas représentatives. Il faut revoir et équilibrer les données et contrôler les résultats.", ok: true },
          { t: "C’est une hallucination d’image : il faut lui demander de mieux dessiner." },
          { t: "L’IA a raison, parce que les données ne mentent jamais." },
          { t: "Ce n’est pas grave : les décisions automatiques n’ont pas besoin de contrôle humain." }
        ]
      }
    ]
  }
];

const ALERTAS_FR = [
  "ALERTE ! Réponse incorrecte détectée. Redémarrage de la salle…",
  "Erreur système. Les données se sont encore mélangées.",
  "ARIA a verrouillé la porte. Recommence la salle depuis le début.",
  "Accès refusé. Respire, lis attentivement et réessaie."
];
