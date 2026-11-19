# ArchiSpotter E136 — Activar CARTO con tu API key

1. Descomprime el ZIP en tu computadora.
2. Abre `scripts/carto-config.js` con un editor de texto.
3. Sustituye **solo** `PEGA_AQUI_TU_API_KEY_CARTO` por tu API key oficial de CARTO, conservando las comillas simples.
4. Guarda el archivo y sube **todos** los archivos descomprimidos a GitHub, como siempre. No subas el ZIP sin configurar si quieres ver CARTO.
5. En CARTO, restringe la clave al host `mauro26289-ui.github.io` si esa es la URL publicada de tu GitHub Pages; confirma primero el dominio real.
6. Recarga la PWA; si ves mosaicos antiguos con marca de agua, fuerza la actualización o espera a que se renueve la caché.

CARTO usa `?key=` en las URL de mosaicos; Positron en claro y Dark Matter en oscuro. Si la clave está sin configurar, se utiliza OpenStreetMap como respaldo para evitar mosaicos con marca de agua. La clave será visible en el JavaScript público de GitHub Pages: no la trates como un secreto del servidor. Conserva las atribuciones CARTO/OpenStreetMap.

La etapa 136 incluye todos los cambios de las etapas 134 y 135.
