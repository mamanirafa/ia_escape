# Flujo de trabajo · Bóveda Neural

Proceso para diseñar, construir, probar y publicar un escape room educativo en línea. Sirve para este juego y para crear nuevas versiones con otras unidades.

## 1. Análisis (15 min)
- **Destinatarios:** 5.º año, Ciclo Orientado en Economía, 16–17 años, nociones básicas de IA.
- **Contenidos:** Unidad 2 (Big Data, ética, pensamiento computacional, ML/DL) y Unidad 3 (prompting, ética, sesgo, alucinaciones).
- **Objetivo del juego:** que sea divertido y desafiante. Repasa conceptos clave sin profundizar en exceso.
- **Restricciones:** 60 minutos, en línea, celular o computadora, sin instalar nada.

## 2. Diseño del juego (30 min)
1. **Narrativa:** un contexto cercano a Economía (un banco de datos en Ushuaia) y un personaje guía (ARIA).
2. **Mapa de salas:** 1 sala = 1 tema = 1 palabra clave. Orden de lo más simple a lo más complejo.
3. **Presupuesto de tiempo:** 8–12 min por sala (≈ 56 min) + 4 min de bóveda final.
4. **Mecánicas variadas** para sostener la atención:
   | Mecánica | Para qué sirve |
   |---|---|
   | Clasificar casos | Reconocer conceptos en situaciones reales |
   | Unir pares | Relacionar definición y ejemplo |
   | Ordenar pasos | Secuenciación / algoritmos |
   | Armar un prompt | Aplicar buenas prácticas y ética |
   | IA real (texto) | Probar un prompt y evaluar la respuesta |
   | IA real (visión) | Ver cómo “percibe” una red neuronal |
5. **Regla de tensión:** un error reinicia la sala y las preguntas se mezclan (hay más casos que preguntas).
6. **Recompensas:** palabra clave animada, sonido, avance visible en el HUD y certificado final.

## 3. Contenido (30 min)
- Escribir casos en lenguaje adolescente con ejemplos económicos: billeteras virtuales, presupuesto del viaje de egresados, microcréditos, inflación.
- Cada etapa incluye la **explicación del error**: el reinicio también enseña.
- Todo el contenido vive en `js/data.js`, separado del motor.

## 4. Desarrollo (técnico)
- **Stack:** HTML + CSS + JavaScript puro (sin frameworks ni compilación) → se publica tal cual en GitHub Pages.
- **Estado:** objeto `S` guardado en `localStorage` (nombre, palabras, tiempo, reinicios, pistas).
- **Motor por etapas:** cada tipo (`classify`, `mcq`, `match`, `order`, `builder`, `aipractice`, `vision`) es una función de render. Agregar un tipo nuevo implica sumar una función a `RENDER`.
- **IA de visión:** TensorFlow.js + MobileNet v2 desde CDN, cargado solo al llegar a la Sala 4.
- **Imágenes:** SVG propios (livianos, nítidos en cualquier pantalla).
- **Certificado:** se dibuja en `<canvas>` → PNG descargable o impresión en PDF.

## 5. Pruebas
- [ ] Recorrido completo sin errores (≈ 25 min para alguien que conoce las respuestas).
- [ ] Forzar un error en cada sala y verificar el reinicio.
- [ ] Recargar la página a mitad de juego y verificar que se conserva el progreso.
- [ ] Cámara en celular (Android/iOS) y en notebook con https.
- [ ] “Subir foto” y “Código docente” como alternativas.
- [ ] Certificado: nombres largos, tildes y ñ.
- [ ] Vista en celular (390 px) y en proyector.

## 6. Publicación
1. Subir el repositorio a `github.com/mamanirafa/ia_escape`.
2. Settings → Pages → Source: **GitHub Actions** (el workflow `pages.yml` publica en cada push).
3. Compartir el enlace `https://mamanirafa.github.io/ia_escape/` (o un QR) en el aula virtual.

## 7. Implementación en el aula y mejora
- Aplicar según la `GUIA_DOCENTE.md`.
- Recoger los certificados (tiempo, reinicios, pistas) como evidencia.
- Revisar qué sala generó más reinicios y ajustar casos o pistas en `data.js`.
- Versionar los cambios con commits descriptivos (`git commit -m "Sala 3: nuevo caso"`).
