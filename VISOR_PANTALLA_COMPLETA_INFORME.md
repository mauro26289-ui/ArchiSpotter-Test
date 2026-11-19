# Visor de fotografías a pantalla completa
Base: E154 (última etapa validada). El visor ahora ocupa todo el alto y ancho del dispositivo, en vertical u horizontal. Las fotografías llenan la pantalla con object-fit:cover, sin deformación; los bordes pueden recortarse según proporción. Nuevo botón en cabecera para alternar a object-fit:contain y ver toda la imagen sin recortes. Controles superpuestos con degradados, respetando safe-area. Se preservan navegación, gestos y zoom.
Verificación estática: sintaxis JS, rutas locales, integridad ZIP. Requiere prueba visual en iPhone.
