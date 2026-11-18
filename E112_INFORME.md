# ArchiSpotter — Etapa 112: medición de arranque y preparación de optimización

## Cambios realizados
- Instrumentación pasiva en `index.html` que captura tiempo hasta DOM listo, evento `load`, recursos JS/CSS/imágenes y bytes de transferencia reportados por el navegador.
- Preconexión a los dos orígenes externos ya utilizados (`cdn.tailwindcss.com` y `unpkg.com`), para intentar reducir la latencia inicial. La mejora no está garantizada sin medición real.
- Cabecera móvil: `padding-top` de 12 a 16 píxeles (desplazamiento interior de 4 px), sin cambiar el viewport ni el tratamiento de la franja inferior.
- No se modifica ningún archivo JS funcional, dato de monumento, idioma, mapa ni navegación.

## Cómo obtener mediciones
En Safari Web Inspector conectado al iPhone, abrir la consola de la PWA o de Safari y buscar `[ArchiSpotter E112 performance]`. La variable `window.__archiPerformance112` contiene la última medición. Para comparaciones válidas, realizar varias cargas en condiciones similares y distinguir carga fría y caliente.

## Limitaciones
- Las mediciones de Resource Timing pueden omitir transferencias de recursos externos por restricciones CORS/Timing-Allow-Origin.
- `load` no significa que todas las imágenes dinámicas estén listas ni que la interfaz sea interactiva; es una línea base, no una medición completa de experiencia de usuario.
- No se han realizado pruebas de ejecución en iOS ni mediciones de rendimiento real. No se han diferido scripts porque su orden y dependencias requieren una auditoría específica.
- La prueba visual de blur y zócalo en PWA instalada sigue pendiente de verificación del usuario.
