# ArchiSpotter E124 — Recuperación de imágenes al desplazarse

Base: E123. Cambio funcional exclusivamente en `scripts/photo-recovery.js`; cachebuster del módulo en `index.html`.

Cuando la conexión vuelve, las imágenes Unsplash con respaldo que estaban fuera de pantalla no se recuperaban si el usuario se desplazaba después. Ahora el desplazamiento (también en contenedores internos) y la restauración de página programan un intento para imágenes visibles, limitado a una vez por imagen y consolidado por frame. No se cambia proveedor ni contenido.

Comprobaciones: sintaxis JS, integridad ZIP, número de archivos y comparación de contenido editorial. Validación en PWA instalada pendiente.
