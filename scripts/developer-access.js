/* ArchiSpotter V31: controles de acceso y apertura/cierre del panel desarrollador. */
        function toggleDevModal() {
            triggerHaptic();
            if (!devAuthenticated) {
                document.getElementById('dev-auth-modal').classList.remove('hidden');
            } else {
                document.getElementById('dev-panel-modal').classList.remove('hidden');
                renderDevMonumentsList();
            }
        }

        function closeDevAuthModal() {
            triggerHaptic();
            document.getElementById('dev-auth-modal').classList.add('hidden');
        }

        function closeDevModal() {
            triggerHaptic();
            document.getElementById('dev-panel-modal').classList.add('hidden');
        }

        function handleDevAuth(e) {
            e.preventDefault();
            const u = document.getElementById('dev-user').value;
            const p = document.getElementById('dev-pass').value;

            if (u === 'admin' && p === 'admin123') {
                devAuthenticated = true;
                closeDevAuthModal();
                document.getElementById('dev-panel-modal').classList.remove('hidden');
                renderDevMonumentsList();
                showToast(tr("Modo Desarrollador Activo 🛠️","Developer mode enabled 🛠️"));
            } else {
                const err = document.getElementById('dev-auth-error');
                err.textContent = 'Credenciales incorrectas (admin / admin123)';
                err.classList.remove('hidden');
            }
        }


/* iOS: además de autocapitalize, normalizar la primera letra en cada entrada.
   No altera el resto del texto ni las credenciales existentes. */
(function archiInstallDevUsernameLowercase(){
    const input = document.getElementById('dev-user');
    if (!input) return;
    input.setAttribute('autocapitalize', 'off');
    input.setAttribute('autocorrect', 'off');
    input.setAttribute('spellcheck', 'false');
    input.addEventListener('input', function(){
        if (!this.value || this.value[0] === this.value[0].toLowerCase()) return;
        const start = this.selectionStart, end = this.selectionEnd;
        this.value = this.value[0].toLowerCase() + this.value.slice(1);
        if (start !== null && end !== null) this.setSelectionRange(start, end);
    });
})();
