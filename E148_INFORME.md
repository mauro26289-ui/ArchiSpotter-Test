# Etapa 148 — Validación de coordenadas para rutas externas

La selección de rutas personalizadas y predefinidas descarta monumentos con coordenadas ausentes, no finitas o fuera del rango terrestre antes de construir enlaces a Google Maps. Se mantiene el aviso existente cuando quedan menos de dos paradas. No se modifican favoritos, Mi viaje, pasaporte, contenido, mapa ni estilos.

Validaciones: pruebas unitarias de coordenadas, sintaxis JS, scripts locales, integridad del ZIP. La validación real en iPhone corresponde al usuario.
