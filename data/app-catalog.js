// ArchiSpotter — datos de presentación y rutas predefinidas.
// Cargado antes de scripts/app.js; mantener nombres globales para compatibilidad.

const countryFlagsDict = {
            'Italia': '🇮🇹', 'España': '🇪🇸', 'Suiza': '🇨🇭', 'Brasil': '🇧🇷',
            'Indonesia': '🇮🇩', 'Argentina': '🇦🇷', 'Estados Unidos': '🇺🇸', 'Turquía': '🇹🇷', 'Reino Unido': '🇬🇧', 'Francia': '🇫🇷', 'Alemania': '🇩🇪', 'Marruecos': '🇲🇦', 'India': '🇮🇳', 'Zimbabue': '🇿🇼', 'Etiopía': '🇪🇹', 'Catar': '🇶🇦'
        };

const countryMapPositions = {
            'Italia': { top: '36%', left: '54%' },
            'España': { top: '39%', left: '46%' },
            'Suiza': { top: '32%', left: '50%' },
            'Brasil': { top: '68%', left: '33%' },
            'Indonesia': { top: '56%', left: '81%' },
            'Francia': { top: '34%', left: '48%' },
            'Estados Unidos': { top: '37%', left: '22%' },
            'Turquía': { top: '39%', left: '60%' }
        };

const cityWalkingRoutes = [
            {
                cityName: 'Roma',
                title: 'Ruta Imperial por la Roma Antigua',
                distance: '2.8 km',
                duration: '45 mins caminando',
                stops: ['Coliseo Romano', 'Foro Romano', 'Panteón de Agripa']
            },
            {
                cityName: 'Barcelona',
                title: 'Ruta Gaudí & Modernismo',
                distance: '3.2 km',
                duration: '50 mins caminando',
                stops: ['Basílica de la Sagrada Familia']
            }
        ];
