# Etapa 1 — 26 fotos Unsplash Free
Fecha: 2026-11-22
Rama: main, repositorio de prueba ArchiSpotter-Test.
Estado: 13 monumentos sustituidos en el código. Verificación de URL y revisión en Safari documentadas por separado.

## Selección (13 monumentos / 26 fotos)
1. Castillo de Sant'Angelo: https://unsplash.com/photos/WuFn2LrYSzU | https://unsplash.com/photos/rg7WH0NjWCw
2. Catedral de Milán: https://unsplash.com/photos/x9Qixy7lbzo | https://unsplash.com/photos/xEQLO9EGu64
3. Panteón de Agripa: https://unsplash.com/photos/Nyf74IoW07c | https://unsplash.com/photos/fbYpd5Xubf8
4. Fontana di Trevi: https://unsplash.com/photos/I1Lv2yX67GI | https://unsplash.com/photos/gZKzBhsO6KY
5. Foro Romano: https://unsplash.com/photos/Nu8ZBfP5zD8 | https://unsplash.com/photos/Le8MTO-kKac
6. Catedral de Florencia: https://unsplash.com/photos/PXLezcBjL7M | https://unsplash.com/photos/GiQ1ggqig2k
7. Ponte Vecchio: https://unsplash.com/photos/JnTdxjelx6E | https://unsplash.com/photos/2LE6eoeh5jo
8. Palazzo Vecchio: https://unsplash.com/photos/bq5r3Pve1nI | https://unsplash.com/photos/WEamHW0aQyU
9. Sagrada Familia: https://unsplash.com/photos/D8n_RJ3keAw | https://unsplash.com/photos/O_Hkk-MXKAE
10. Casa Batlló: https://unsplash.com/photos/LSscVPEyQpI | https://unsplash.com/photos/-FSYoN9OCsM
11. Parque Güell: https://unsplash.com/photos/GPbn2G1fdMo | https://unsplash.com/photos/G5lnbfU4i5A
12. Casa Milà: https://unsplash.com/photos/LTCLy5ZFGrY | https://unsplash.com/photos/gKvF99QzdBo
13. Coliseo: https://unsplash.com/photos/s87bBFZviAU | https://unsplash.com/photos/nAb-SFzL1GM

## Método
Se verificaron páginas individuales de Unsplash con título o ubicación del monumento, autor y condición «Free to use under the Unsplash License». Las dos fotografías por monumento corresponden a IDs de Unsplash diferentes. No se usaron Unsplash+ ni Wikimedia Commons para estas 26 nuevas fotografías. Las 76 restantes conservan provisionalmente Wikimedia Commons hasta las etapas 2–4.

## Cambios
- preview/assets/data/photo-pairs.js contiene las 26 fotos de Unsplash Free de etapa 1.
- Las tarjetas, fichas, Favoritos y Mi viaje consumen la misma tabla.
- Los créditos de las fichas indican Unsplash y enlazan la licencia.
- preview/photo-audit.html permite comparar los pares de fotografías.
- El workflow de auditoría de código verifica cobertura y duplicaciones.
- Se ejecuta un workflow separado para verificar HTTP de las 102 imágenes.

## Advertencias de verificación
La ficha pública de Unsplash acredita monumento, autor y licencia, pero la comprobación de enlaces directos y de su carga real en Safari debe basarse en el workflow HTTP y en pruebas de navegador. No declarar verificada la resolución nativa de las fotos de Unsplash sin consultar sus metadatos de imagen. La etapa 1 no modifica la versión estable.
