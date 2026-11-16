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


/* iOS: se desactiva la capitalización sugerida sin modificar el valor escrito.
   Los nombres de usuario mantienen sus mayúsculas y minúsculas originales. */
(function archiConfigureDevUsernameKeyboard(){
    const input = document.getElementById('dev-user');
    if (!input) return;
    input.setAttribute('autocapitalize', 'none');
    input.setAttribute('autocorrect', 'off');
    input.setAttribute('spellcheck', 'false');
})();
