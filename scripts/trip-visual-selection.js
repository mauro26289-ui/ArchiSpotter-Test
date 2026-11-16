// Selección de tarjetas de la sección Mi viaje.
// Mantiene la lógica original: paradas seleccionadas o catálogo, máximo 12.
function archiTripVisualMonuments(selectedMonuments, allMonuments) {
    return (selectedMonuments.length ? selectedMonuments : allMonuments).slice(0, 12);
}
