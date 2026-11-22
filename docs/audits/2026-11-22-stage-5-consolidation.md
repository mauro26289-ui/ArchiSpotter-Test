# Etapa 5 — Consolidación progresiva y deuda técnica
Fecha: 2026-11-22
Estado: implementación parcial, con primera migración funcional completada; no certificada en Safari.

## Objetivo
Consolidar funciones duplicadas de forma incremental, preservando las claves persistidas, los 51 monumentos, los tres idiomas y la versión estable en el repositorio independiente ArchiSpotter.

## Implementado
1. preview/assets/js/storage.js: único adaptador de listas persistidas, lectura tolerante a JSON inválido, filtrado de valores no textuales, escritura segura con resultado booleano, claves actuales sin cambio.
2. preview/assets/js/saved.js: lectura, reordenamiento y eliminación mediante adaptador compartido.
3. preview/assets/js/monuments.js: favoritos y Mi viaje utilizan el mismo adaptador, sin alterar la lógica de interfaz.
4. preview/index.html: carga del adaptador antes de monuments.js y saved.js, con renovación de versiones de caché.
5. scripts/audit-preview.mjs: pruebas de compatibilidad de claves, orden, JSON malformado y filtrado de datos no válidos.

## Verificaciones
- GitHub Actions Audit ArchiSpotter preview tuvo ejecuciones verdes tras la integración inicial.
- La última ejecución, que incluye los tests adicionales de almacenamiento, estaba en cola al consultarla.
- No se alteraron los nombres de las claves ni la representación JSON.
- No se tocó el repositorio original estable.

## Pendiente para cerrar etapa 5
- Centralizar el registro de rutas de audio y verificar MP3 existentes sin inventar archivos.
- Consolidar progresivamente IDs y datos de recursos sin perder compatibilidad con favoritos y viajes.
- Auditar funciones sin uso antes de eliminarlas (incluyendo las otras entradas HTML).
- Unificar los textos de interfaz repetidos sin resumir ni alterar las traducciones.
- Ampliar las pruebas de integración y verificar Safari/PWA en iPhone.
- Confirmar el resultado verde del último workflow y el despliegue de GitHub Pages.

## Precauciones
No se borró código histórico, no se cambió el sistema de autenticación, no se eliminaron fotografías, audios ni monumentos. Esta etapa no debe considerarse completa hasta que las tareas pendientes estén ejecutadas y comprobadas.
