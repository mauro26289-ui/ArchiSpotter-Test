// Código trasladado desde app.js, sin cambios funcionales.
        function filterStyle(styleName) {
            triggerHaptic();
            currentActiveStyle = styleName;
            document.querySelectorAll('.style-btn').forEach(btn => {
                if (btn.textContent.trim().toLowerCase() === styleName.toLowerCase() || (styleName === 'all' && btn.textContent.trim() === 'Todos')) {
                    btn.className = 'style-btn active px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-semibold whitespace-nowrap';
                } else {
                    btn.className = 'style-btn px-3 py-1 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 whitespace-nowrap';
                }
            });
            renderMonuments();
        }

        function handleSearch() {
            renderMonuments();
        }

