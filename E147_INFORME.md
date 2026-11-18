# E147 — Reversión preventiva de la regresión en Favoritos y Mi viaje

- La etapa 146 no fue aprobada en iPhone: Favoritos y Mi viaje fallaron en la prueba.
- Se restituye exactamente `scripts/storage.js` de la etapa 145, última etapa validada para estas funciones.
- Se actualiza el parámetro de versión del script en `index.html` para favorecer su recarga en la PWA.
- No se modifica ni elimina el almacenamiento del usuario. Se conservan las demás mejoras de la etapa 146 y anteriores.
- La reversión está validada a nivel de archivos y sintaxis, pero requiere prueba real en iPhone.
