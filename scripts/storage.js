/* ArchiSpotter V20 — almacenamiento local; cargar antes de app.js. */
        // Stability: browser storage can throw (private mode, quota, blocked cookies).
        function archiStorageGet(key, fallback = null) {
            try { return localStorage.getItem(key); }
            catch (error) { console.warn('ArchiSpotter: storage read failed:', key, error); return fallback; }
        }
        function archiStorageSet(key, value) {
            try { localStorage.setItem(key, value); return true; }
            catch (error) {
                console.warn('ArchiSpotter: changes could not be saved:', key, error);
                if (typeof showToast === 'function') showToast('No se pudo guardar el cambio en este dispositivo');
                return false;
            }
        }
        // Stability: invalid or unavailable browser storage must not prevent startup.
        function archiReadSavedIdList(key) {
            try {
                const value = JSON.parse(localStorage.getItem(key) || '[]');
                return Array.isArray(value) ? [...new Set(value.filter(id => typeof id === 'string'))] : [];
            } catch (error) {
                console.warn('ArchiSpotter: saved list unavailable or invalid:', key, error);
                return [];
            }
        }
