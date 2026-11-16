// Agrupación de países del explorador. Conserva el orden y las reglas originales.
function archiBuildCountryList(monumentsData, getFlagForCountry) {
    const countriesMap = {};
    monumentsData.forEach(m => {
        const cName = m.country || 'Otros';
        const countryFlag = getFlagForCountry(cName, m.flag);
        if (!countriesMap[cName]) {
            countriesMap[cName] = { name: cName, flag: countryFlag, count: 0 };
        }
        countriesMap[cName].count++;
    });
    return Object.values(countriesMap);
}
