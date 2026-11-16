// Bloque original extraído de app.js sin alterar su comportamiento.
        // iOS Safari: escuchar el selector REAL de Ajustes. El antiguo listener
        // observaba #language-select, que no existe en la ventana actual.
        function archiHandleLanguageSelection(event) {
            const target=event.target;
            if (!target || !['archi-settings-language','language-select'].includes(target.id)) return;
            const requested=target.value;
            if (!['es','en','it'].includes(requested) || requested===appLanguage) return;
            setLanguage(requested);
        }
        document.addEventListener('change',archiHandleLanguageSelection);
        document.addEventListener('input',archiHandleLanguageSelection);
