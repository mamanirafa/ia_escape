# 🔐 Bóveda Neural · Escape Room de Inteligencia Artificial

Juego educativo tipo **sala de escape** para jugar en línea, pensado para estudiantes de **5.º año del Ciclo Orientado en Economía** (16–17 años). Trabaja los contenidos de las **Unidades 2 y 3 del programa EsencIA**:

- **Unidad 2:** Big Data (las 3 V), ética de datos, pensamiento computacional, Machine Learning, Deep Learning y tipos de aprendizaje.
- **Unidad 3:** Prompt Engineering, técnicas de prompting, ética al escribir prompts, sesgo algorítmico y alucinaciones.

> **Historia:** Ushuaia, 2031. Sos pasante en el *Banco Austral de Datos*. ARIA, la IA del edificio, tuvo una falla y cerró todas las puertas. Tenés **60 minutos** para atravesar **6 salas**, conseguir **6 palabras clave** y abrir la bóveda final.

---

## 🎮 Cómo se juega

| # | Sala | Contenido | Desafíos | Palabra clave |
|---|------|-----------|----------|---------------|
| 1 | Centro de Datos | Big Data · 3 V | Clasificar 5 casos + pregunta Big Data/IA | sorteada |
| 2 | Oficina de Cumplimiento | Ética de datos | Transparencia / Consentimiento / Privacidad | sorteada |
| 3 | Laboratorio de Algoritmos | Pensamiento computacional | Unir habilidades + ordenar un algoritmo | sorteada |
| 4 | Fábrica de Modelos | ML y DL | Tipos de aprendizaje + **cámara con IA de visión** | sorteada |
| 5 | Estudio de Prompts | Prompt Engineering | Técnicas + armar prompt + **probarlo en una IA real** | sorteada |
| 6 | Sala de Verificación | Alucinaciones y sesgo | ¿Real o alucinación? + caso de sesgo | sorteada |

**Reglas**

- El jugador escribe su **nombre** al inicio; se muestra en todo momento y queda en el **certificado final**.
- **Un error reinicia la sala** (las preguntas se mezclan de nuevo).
- Las **pistas** cuestan +2 minutos.
- **Anti-copia:** cada jugador recibe palabras clave sorteadas (8 posibles por sala) y un orden propio para la bóveda final.
- Al terminar se genera un **certificado** descargable en PNG o imprimible en PDF, con nombre, tiempo, reinicios, pistas y código de verificación.
- El progreso se guarda en el navegador: si se recarga la página, se vuelve al mapa con las palabras obtenidas.

**Uso de IA dentro del juego**

- **Sala 4:** la cámara (o una foto) se analiza con **MobileNet** (TensorFlow.js), una red neuronal real que corre en el navegador. Se ven las predicciones con su probabilidad.
- **Sala 5:** el estudiante copia el prompt que armó, lo prueba en **Gemini, ChatGPT o Copilot** y pega la respuesta.
- Si no hay cámara o acceso a una IA, el docente puede habilitar el avance con el **código docente** (ver `js/data.js`).

---

## 🚀 Publicar en GitHub Pages

### Opción A — Desde la web de GitHub (sin instalar nada)
1. Entrá a <https://github.com/mamanirafa/ia_escape>.
2. **Add file → Upload files** y arrastrá **todo el contenido** de esta carpeta (incluidas `css/`, `js/`, `assets/`, `docs/` y `.github/`).
3. **Commit changes**.
4. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
5. En la pestaña **Actions** vas a ver “Publicar en GitHub Pages”. Cuando termine (✔ verde), el juego queda en:
   **<https://mamanirafa.github.io/ia_escape/>**

> Alternativa sin Actions: en **Settings → Pages** elegí *Deploy from a branch* → `main` → `/ (root)`.

### Opción B — Con Git en la terminal
```bash
cd ia_escape
git init
git add .
git commit -m "Bóveda Neural: escape room de IA (Unidades 2 y 3)"
git branch -M main
git remote add origin https://github.com/mamanirafa/ia_escape.git
git push -u origin main
```
Luego hacé el paso 4 de la opción A.

### Probar en tu computadora
Abrí `index.html` con doble clic, o mejor con un servidor local (necesario para la cámara):
```bash
python -m http.server 8000
# abrir http://localhost:8000
```
> La cámara solo funciona con **https** (GitHub Pages) o **localhost**.

---

## 🛠️ Personalizar

Todo el contenido está en **`js/data.js`**:

- `CONFIG.docente`, `CONFIG.curso`, `CONFIG.institucion` → aparecen en el certificado.
- `CONFIG.minutos` → duración total.
- `CONFIG.codigoDocente` → **cambialo antes de cada clase**.
- `ROOMS` → salas, casos, preguntas, pistas y palabras clave.

## 📁 Estructura
```
ia_escape/
├── index.html              # Interfaz (pantallas, HUD, modales)
├── css/styles.css          # Estilo visual
├── js/
│   ├── data.js             # ⚙️ Contenidos y configuración (editar acá)
│   ├── game.js             # Motor del juego
│   ├── vision.js           # IA de visión (TensorFlow.js + MobileNet)
│   ├── certificate.js      # Certificado en canvas (PNG / PDF)
│   └── audio.js            # Efectos de sonido (Web Audio)
├── assets/img/             # Ilustraciones SVG originales (ARIA, salas, bóveda…)
├── docs/
│   ├── FLUJO_DE_TRABAJO.md # Proceso de diseño, desarrollo y publicación
│   └── GUIA_DOCENTE.md     # Planificación de la clase y solucionario
└── .github/workflows/pages.yml
```

## 📚 Créditos
- Contenidos basados en las guías del programa **EsencIA** (Eidos Global, con el apoyo de Google.org), Unidades 2 y 3.
- Diseño y adaptación didáctica: **Prof. Rafael Mamani**.
- IA de visión: [TensorFlow.js](https://www.tensorflow.org/js) + MobileNet v2 (ImageNet).
- Ilustraciones: SVG originales creados para este proyecto.
