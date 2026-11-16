// Bloque original extraído de app.js sin alterar su comportamiento.
        function translateOpenMonument(m) {
            if(!m) return;
            document.getElementById('modal-title').textContent=monumentLabel(m);
            document.getElementById('modal-style').textContent=styleLabel(m.style);
            document.getElementById('modal-year').textContent=localYear(m.year);
            document.getElementById('modal-location').innerHTML=`<i class="fa-solid fa-location-dot text-amber-500 mr-1"></i> ${cityLabel(m.city)}, ${countryLabel(m.country)} ${getFlagForCountry(m.country,m.flag)}`;
            document.getElementById('modal-history').innerText=monumentField(m,'history');
            document.getElementById('modal-secret-text').textContent=monumentField(m,'secret')||'';
            document.getElementById('modal-architecture').innerHTML=architectureLabel(m).map(item=>`<div class="flex items-start space-x-2"><i class="fa-solid fa-check text-amber-500 text-[10px] mt-1"></i><span>${item}</span></div>`).join('');
        }
