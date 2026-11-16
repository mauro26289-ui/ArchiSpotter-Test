// Funciones originales extraídas de app.js, sin alterar su lógica.
        function switchDevTab(tab) {
            triggerHaptic();
            const createBtn = document.getElementById('dev-tab-create-btn');
            const editBtn = document.getElementById('dev-tab-edit-btn');
            const formCont = document.getElementById('dev-tab-form-container');
            const listCont = document.getElementById('dev-tab-list-container');

            if (tab === 'create') {
                createBtn.className = 'flex-1 py-1.5 text-xs font-bold rounded-lg bg-amber-500 text-slate-950 transition';
                editBtn.className = 'flex-1 py-1.5 text-xs font-bold rounded-lg text-slate-400 hover:text-white transition';
                formCont.classList.remove('hidden');
                listCont.classList.add('hidden');
                document.getElementById('dev-add-form').reset();
                document.getElementById('dev-edit-id').value = '';
            } else {
                editBtn.className = 'flex-1 py-1.5 text-xs font-bold rounded-lg bg-amber-500 text-slate-950 transition';
                createBtn.className = 'flex-1 py-1.5 text-xs font-bold rounded-lg text-slate-400 hover:text-white transition';
                listCont.classList.remove('hidden');
                formCont.classList.add('hidden');
            }
        }

        function saveNewMonument(e) {
            e.preventDefault();
            triggerHaptic();

            const editId = document.getElementById('dev-edit-id').value;
            const newM = {
                id: editId || 'monument_' + Date.now(),
                name: document.getElementById('dev-name').value,
                city: document.getElementById('dev-city').value,
                country: document.getElementById('dev-country').value,
                style: document.getElementById('dev-style').value,
                year: document.getElementById('dev-year').value,
                coords: {
                    lat: parseFloat(document.getElementById('dev-lat').value) || 41.8902,
                    lng: parseFloat(document.getElementById('dev-lng').value) || 12.4922
                },
                images: document.getElementById('dev-images').value.split(',').map(s => s.trim()),
                secret: document.getElementById('dev-secret').value || '',
                ticketLink: document.getElementById('dev-website').value,
                history: document.getElementById('dev-history').value,
                architecture: ['Arquitectura destacada catalogada']
            };

            if (editId) {
                const idx = monumentsData.findIndex(m => m.id === editId);
                if (idx !== -1) monumentsData[idx] = newM;
            } else {
                monumentsData.push(newM);
            }

            archiStorageSet('archispotter_monuments', JSON.stringify(monumentsData));
            closeDevModal();
            renderCountries();
            renderMapPins();
            showToast(tr("Monumento guardado correctamente ✨","Monument saved successfully ✨"));
        }

        function renderDevMonumentsList() {
            const listCont = document.getElementById('dev-monuments-list');
            if (!listCont) return;

            listCont.innerHTML = monumentsData.map(m => `
                <div class="bg-slate-800 border border-slate-700 rounded-xl p-3 flex items-center justify-between">
                    <div>
                        <h4 class="font-serif font-bold text-xs text-white">${m.name}</h4>
                        <span class="text-[10px] text-slate-400">${cityLabel(m.city)}, ${countryLabel(m.country)}</span>
                    </div>
                    <div class="flex items-center space-x-1.5">
                        <button onclick="editMonumentDev('${m.id}')" class="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg text-xs"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button onclick="deleteMonumentDev('${m.id}')" class="p-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            `).join('');
        }

        function editMonumentDev(id) {
            const m = monumentsData.find(item => item.id === id);
            if (!m) return;
            switchDevTab('create');
            document.getElementById('dev-edit-id').value = m.id;
            document.getElementById('dev-name').value = m.name;
            document.getElementById('dev-city').value = m.city;
            document.getElementById('dev-country').value = m.country;
            document.getElementById('dev-lat').value = m.coords ? m.coords.lat : '';
            document.getElementById('dev-lng').value = m.coords ? m.coords.lng : '';
            document.getElementById('dev-style').value = m.style;
            document.getElementById('dev-year').value = m.year;
            document.getElementById('dev-images').value = (m.images || []).join(', ');
            document.getElementById('dev-secret').value = m.secret || '';
            document.getElementById('dev-website').value = m.ticketLink || '';
            document.getElementById('dev-history').value = m.history;
        }

        function deleteMonumentDev(id) {
            triggerHaptic();
            monumentsData = monumentsData.filter(m => m.id !== id);
            archiStorageSet('archispotter_monuments', JSON.stringify(monumentsData));
            renderDevMonumentsList();
            renderCountries();
            renderMapPins();
            showToast(tr("Monumento eliminado","Monument deleted"));
        }

        function exportJsCode() {
            triggerHaptic();
            const jsCode = `const initialMonumentsData = ${JSON.stringify(monumentsData, null, 4)};`;
            document.getElementById('export-code-area').value = jsCode;
            document.getElementById('export-modal').classList.remove('hidden');
        }

        function closeExportModal() {
            triggerHaptic();
            document.getElementById('export-modal').classList.add('hidden');
        }

        function copyExportedCode() {
            triggerHaptic();
            const textarea = document.getElementById('export-code-area');
            textarea.select();
            document.execCommand('copy');
            showToast(tr("Código JS copiado al portapapeles 📋","JavaScript code copied to clipboard 📋"));
        }
    