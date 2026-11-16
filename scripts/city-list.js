// Agrupa los monumentos por ciudad, preservando el orden y la imagen original.
function archiBuildCityList(filteredMonuments, architecturePlaceholder) {
    const citiesMap = {};
    filteredMonuments.forEach(m => {
        const city = m.city || 'Desconocido';
        if (!citiesMap[city]) {
            citiesMap[city] = { name: city, count: 0, image: (Array.isArray(m.images) && m.images[0]) || architecturePlaceholder() };
        }
        citiesMap[city].count++;
    });
    return Object.values(citiesMap);
}
