# Etapa 144 — Auditoría de caché de fotografías

- Se valida que la caché de miniaturas sea un objeto no nulo y no un arreglo antes de usarla.
- Si el almacenamiento contiene JSON válido pero de tipo incorrecto, se descarta de forma segura y se recuperan las imágenes desde el proveedor.
- No se cambian los monumentos, los estilos, el mapa ni las imágenes editoriales.
- Comprobaciones estáticas: sintaxis JS, referencias de scripts e integridad ZIP. Prueba en iPhone pendiente.
