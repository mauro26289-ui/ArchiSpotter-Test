// Código trasladado desde app.js, sin cambios funcionales.
        function navigateBack() {
            triggerHaptic();
            let destination = 'countries';
            if (selectedCity) { selectedCity = null; destination = 'cities'; }
            else if (selectedCountry) { selectedCountry = null; destination = 'countries'; }
            renderNavigationFlow();
            archiRestoreExploreScroll(destination);
        }

        function goHome() {
            triggerHaptic();
            selectedCountry = null;
            selectedCity = null;
            switchTab('explore');
            renderNavigationFlow();
        }

