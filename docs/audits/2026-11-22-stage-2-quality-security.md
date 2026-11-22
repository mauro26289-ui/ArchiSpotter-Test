# Etapa 2 — Auditoría de calidad, seguridad y duplicaciones funcionales
Fecha: 2026-11-22
Repositorio: mauro26289-ui/ArchiSpotter-Test; rama main
Alcance: nueve módulos JS activos de preview, HTML de entrada, datos trilingües, mapa, galería, autenticación, audioguías y estado persistido.
Método: inspección estática de código fuente y estructura de Git; comprobaciones de rutas y contenido; incorporación de QA automática. No se ejecutaron pruebas manuales en Safari/iPhone. No se modificó el repositorio estable ArchiSpotter.

## 1. Hallazgos por severidad

### P1 — Audioguías con rutas no publicadas
Archivo: preview/assets/js/monuments.js; preview/audio/
La tabla newAudioIds marca cinco monumentos como locales (15 combinaciones ES/EN/IT), pero preview/audio/ contiene solamente 10 MP3:
- castel-sant-angelo: en, es, it
- ponte-vecchio: en, es, it
- trevi-fountain: en, es, it
- palazzo-vecchio: en
Faltan en el repositorio de pruebas: palazzo-vecchio-es, palazzo-vecchio-it, casa-batllo-es, casa-batllo-en y casa-batllo-it. La interfaz habilita botones sin verificar presencia de archivo. Requiere publicar los MP3 reales; no fabricar archivos vacíos ni volver a consumir créditos. Los otros ocho monumentos mapeados usan archivos remotos del repositorio original.

### P1 — Autenticación de demostración, no apta como control de acceso real
Archivo: preview/assets/js/auth.js.
Usuario user/user123 codificado en cliente; credenciales de cuentas creadas guardadas como hash SHA-256 con sal en localStorage y sesión también local. El código del cliente y el almacenamiento pueden manipularse. No existe servidor que verifique identidad. SHA-256 rápido no reemplaza un sistema de autenticación gestionado. Mantener explícitamente como prototipo; antes de cuentas reales migrar a proveedor de identidad y política de datos. No cambiar claves de almacenamiento sin migración.

### P2 — Carrera temporal en swipe de galería
Archivo: preview/assets/js/monuments.js.
La transición usa setTimeout para terminar tras 200 ms; una transición anterior podía completar cuando se había abierto otra ficha. Corregido: cancelar el temporizador al volver a renderizar y al iniciar otro gesto, y verificar que el monumento siga siendo el mismo antes de finalizar. Debe probarse en Safari.

### P2 — Recuento fijo obsoleto en mapa
Archivo: preview/assets/js/map.js.
Se mostraba literalmente 48 aunque el catálogo contiene 51 monumentos. Corregido: el total se calcula desde countryCitySamples, no se duplica como constante. Falta prueba dinámica.

### P2 — Duplicación de lógica de almacenamiento
Archivos: monuments.js, saved.js, map.js, auth.js y app.js.
Existen varias funciones de lectura/escritura localStorage y parsing JSON, con distintas políticas de error. Las claves de favoritos y viaje se repiten. No es código muerto; centralizar detrás de un adaptador y migración en una etapa posterior. No cambiar ahora por riesgo de perder datos guardados.

### P2 — Repetición de localización y contratos globales
Archivos: app.js, explore.js, monuments.js, map.js, saved.js.
La selección de índice de idioma {es:0,en:1,it:2}, mensajes y etiquetas están repetidos. Los módulos dependen de window.ArchiSpotter* y de orden de scripts defer. La inicialización de navegación tiene protección initialized; otros módulos asumen arranque único. Proponer contrato central de idioma y pruebas de doble inicialización antes de refactorizar.

### P2 — Recursos externos sin garantía de disponibilidad
Archivos: photos.js, map.js, monuments.js.
Las imágenes proceden de Unsplash, Wikimedia Commons y API Wikipedia; los MP3 antiguos de GitHub raw. photos.js tiene caché y control de respuesta obsoleta mediante WeakMap, una protección positiva. No hay verificación automatizada de exactitud visual ni carga real en Safari. Las imágenes de Chillon incluyen créditos específicos; el resto necesita inventario de licencias. No confundir comprobación de URL con comprobación de contenido correcto.

### P2 — Reproductores con tecnologías diferentes
Archivos: explore.js y monuments.js.
Las ciudades usan speechSynthesis del navegador (voz es-ES para español), mientras los monumentos usan MP3 ElevenLabs. El botón de la ciudad gestiona estado de voz mediante speechSynthesis.speaking global y actualiza su texto al terminar; no gestiona todos los errores/cancelaciones. La diferencia es deliberada hoy, pero conviene definir contrato de audio común y parada al salir de pantalla.

### P2 — Estado temporal de navegación y eventos
Archivos: navigation.js, monuments.js, gallery.js.
Hay listeners globales document para touch y teclado; la navegación previene inicialización repetida. El visor ampliado usa pointer events y gestos en tiempo real; la galería usa touch handlers. La navegación usa setTimeout para cerrar una transición; no hay prueba automatizada de navegación rápida/cancelación. No duplicar manejadores en refactor sin tests.

### P3 — Datos y mapa duplicados por nombre
Archivo: map.js.
Las coordenadas están en un objeto independiente del catálogo; los nombres son las claves de enlace. Riesgo de desincronización al renombrar. Unificar por IDs estables en futura migración, conservando claves antiguas.

### P3 — UI y textos no totalmente centralizados
Archivos: explore.js, monuments.js, map.js, saved.js, auth.js.
Muchos textos ES/EN/IT están codificados en módulos. auth.js tiene errores exclusivamente en español. La etapa de i18n deberá localizar mensajes sin alterar estructura de datos.

## 2. Señales positivas verificadas
- Se utiliza textContent y createElement para las fichas; no se encontraron asignaciones innerHTML ni eval en los nueve módulos revisados.
- La navegación tiene guarda de inicialización y el mapa evita construir instancias duplicadas.
- photos.js utiliza WeakMap para descartar respuestas tardías de imágenes.
- El visor ampliado usa pointer events y límites de escala; la galería de monumentos sigue el dedo durante el arrastre.
- El catálogo activo contiene 51 nombres únicos, 51 fichas editoriales y tres idiomas en el contenido inspeccionado.
- La separación original /ArchiSpotter vs /ArchiSpotter-Test se mantiene.

## 3. Cambios de código de esta etapa
1. map.js: recuento total derivado de catálogo en vez de valor 48.
2. monuments.js: cancelar temporizadores obsoletos y evitar completar una transición sobre otra ficha.
3. preview/index.html: actualizar versiones de caché para los dos módulos.
4. scripts/audit-preview.mjs: auditoría automática sin dependencias npm de sintaxis, referencias locales, duplicados, integridad editorial y advertencias de MP3 faltantes.
5. .github/workflows/audit-preview.yml: ejecución del comprobador en push, pull_request y manualmente.

## 4. Criterios de validación y límites
La inspección de código y las rutas se realizaron. El workflow quedó configurado, pero no se pudo consultar su ejecución desde las herramientas disponibles; por tanto NO se afirma que haya pasado en GitHub Actions. Las cinco advertencias de MP3 faltantes son intencionalmente no bloqueantes hasta publicar los archivos. No se ejecutaron pruebas E2E ni Safari físico, análisis de vulnerabilidades de dependencias o medición de rendimiento.

## 5. Pendientes ordenados para siguiente etapa
1. Subir cinco MP3 reales pendientes y validar reproducción ES/EN/IT.
2. Confirmar ejecución verde de Audit ArchiSpotter preview y corregir cualquier fallo.
3. Probar en iPhone swipe rápido/cancelado, volver atrás, abrir otra ficha, zoom, audio y mapa.
4. Crear adaptador de almacenamiento con tests de compatibilidad antes de migrar datos.
5. Crear registro de monumentos por IDs y manifiesto de recursos con tests, sin modificar las claves persistidas.
6. Revisar autenticación antes de exposición pública; no prometer seguridad de cuentas locales.
7. Validar fotos reales y licencias por monumento, y automatizar checks de recursos.
