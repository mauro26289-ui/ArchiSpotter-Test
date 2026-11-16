// Busca en los tres idiomas, independientemente del idioma seleccionado.
// Conserva los nombres originales y los estilos del catálogo.
function archiNormalizeSearch(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trim();
}
function archiMonumentMatchesSearch(monument, term, englishNames, italianNames, englishStyles, italianStyles) {
    const names = [monument.name, englishNames[monument.id], italianNames[monument.id]];
    const styles = [monument.style, englishStyles[monument.style], italianStyles[monument.style]];
    return archiNormalizeSearch(names.concat(styles).filter(Boolean).join(' ')).includes(term);
}
