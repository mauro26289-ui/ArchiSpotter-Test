/* ArchiSpotter V24 — avisos y vibración, sin cambios de lógica. */
function triggerHaptic() {
            if (navigator.vibrate) navigator.vibrate(25);
        }

        let archiToastTimeout;
        function showToast(msg) {
            const toast = document.getElementById('toast');
            if (!toast) return;
            // El mensaje no debe quedar atrapado debajo del modal de la ficha.
            if (toast.parentElement !== document.body) document.body.appendChild(toast);
            const label = document.getElementById('toast-message');
            if (label) label.textContent = msg;
            toast.classList.remove('hidden');
            // Prioridad explícita sobre modales y capas con transform/filter en iOS.
            toast.style.setProperty('position', 'fixed', 'important');
            toast.style.setProperty('z-index', '2147483647', 'important');
            toast.style.setProperty('top', 'max(88px, calc(env(safe-area-inset-top, 0px) + 28px))', 'important');
            toast.style.setProperty('left', '50%', 'important');
            toast.style.setProperty('transform', 'translateX(-50%)', 'important');
            toast.style.setProperty('opacity', '1', 'important');
            clearTimeout(archiToastTimeout);
            archiToastTimeout = setTimeout(() => toast.classList.add('hidden'), 3000);
        }

