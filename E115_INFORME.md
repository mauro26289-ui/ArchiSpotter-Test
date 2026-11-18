# ArchiSpotter — Etapa 115: estabilidad de la pestaña Mapa

Base: etapa 114, validada en PWA instalada por el usuario.

## Cambio funcional acotado
En `scripts/tab-navigation.js`, se cancela el temporizador de refresco de Leaflet si el usuario sale de Mapa antes de que transcurran 120 ms. Si el usuario vuelve a entrar rápidamente, se mantiene un único refresco pendiente. Antes de ejecutarlo se verifica que la pestaña Mapa siga activa y visible. El mapa sigue inicializándose o actualizando su tamaño con la misma lógica cuando corresponde.

No se cambia el temporizador de inicialización de arranque ni los controles GPS, las rutas, los marcadores o el contenido.

## Validaciones estáticas
Se comprobó integridad del ZIP, sintaxis de todos los JS y conservación byte a byte del resto de archivos, salvo la referencia de caché de `tab-navigation.js` en `index.html` y este informe.

## Pruebas pendientes en iPhone
Abrir Mapa, alternar rápidamente Mapa/Mi viaje/Explorar, volver a Mapa y comprobar marcadores, desplazamiento, zoom, GPS si se usa, navegación, galerías y ausencia de zócalo. No se afirma validación de ejecución real en iOS.
