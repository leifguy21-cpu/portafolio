# Cómo subir un proyecto

1. Copia la carpeta `_plantilla` y ponle un nombre corto sin espacios (ej. `tienda-online`).
2. Edita `info.json` con los datos del proyecto (`enlace` y `repo` pueden quedar vacíos).
3. Mete las capturas: `1.jpg`, `2.jpg`, `3.jpg`... (o .png, .webp, .svg). La 1 es la portada; las demás salen como miniaturas. Ideal: 1600×1000.
4. Haz commit y push. GitHub publica la página solo y el proyecto aparece.

`orden`: el número más bajo sale primero. Las carpetas que empiezan con `_` no se muestran.

Para verlo en tu PC antes de subirlo: `node generar-lista.mjs` y luego `npx serve .`
