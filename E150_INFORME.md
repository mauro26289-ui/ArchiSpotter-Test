# E150 — Estabilidad de distancias GPS
Se limita el valor intermedio de la fórmula haversine al intervalo matemático [0,1], para prevenir NaN por errores de redondeo en coordenadas casi antipodales. No cambia los datos, persistencia, diseño ni mapa.
