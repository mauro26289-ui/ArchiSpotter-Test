ArchiSpotter — Etapa 41
Base: etapa 40.
Separación conservadora de las funciones de pronunciación de audioguías a scripts/speech-formatting.js.
Se mantiene el gesto limitado de la etapa 39 y toda la navegación.
Orden de carga: speech-formatting.js antes de app.js.
Validar en iPhone: inicio, idiomas, ficha, audioguía, mapa, Mi viaje y favoritos.

Etapa 42: extraída segmentación audioChunks a scripts/audio-chunks.js, sin modificar algoritmo.

Etapa 43: función de construcción de enlaces de rutas extraída a scripts/route-links.js.

Etapa 49: swipe horizontal en visor a escala 1, umbral 55px, predominio horizontal, sin interferir con zoom/pinch.

Etapa 54: cálculo geográfico de cercanía extraído a scripts/geo-distance.js; fórmula idéntica. Validar GPS y monumentos cercanos en iPhone.
