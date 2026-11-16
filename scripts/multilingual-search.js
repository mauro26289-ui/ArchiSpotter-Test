// Índice trilingüe para búsquedas: independiente del idioma visible.
function archiNormalizeSearch(value) {
    return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trim();
}
function archiMonumentMatchesSearch(monument, query, englishNames, italianNames, englishStyles, italianStyles) {
    const id = monument.id;
    const originalStyle = monument.style || '';
    const names = [monument.name, englishNames?.[id], italianNames?.[id]];
    const styles = [originalStyle, englishStyles?.[originalStyle], italianStyles?.[originalStyle]];
    const searchable = archiNormalizeSearch([...names, ...styles].filter(Boolean).join(' '));
    return searchable.includes(archiNormalizeSearch(query));
}
