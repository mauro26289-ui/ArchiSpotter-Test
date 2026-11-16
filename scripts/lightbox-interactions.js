// Funciones extraídas de app.js sin alterar su implementación.
        function initLightboxInteractions() {
            const viewport = document.getElementById('lightbox-viewport');
            if (!viewport || viewport.dataset.initialized) return;

            viewport.dataset.initialized = 'true';

            viewport.addEventListener('wheel', (e) => {
                e.preventDefault();
                if (e.deltaY < 0) {
                    lightboxScale = Math.min(lightboxScale + 0.25, 4);
                } else {
                    lightboxScale = Math.max(lightboxScale - 0.25, 1);
                    if (lightboxScale === 1) { lightboxPanX = 0; lightboxPanY = 0; }
                }
                applyLightboxTransform();
            }, { passive: false });


            const startDrag = (x, y) => {
                if (lightboxScale > 1) {
                    isDraggingLightbox = true;
                    startPanX = x - lightboxPanX;
                    startPanY = y - lightboxPanY;
                }
            };

            const moveDrag = (x, y) => {
                if (isDraggingLightbox && lightboxScale > 1) {
                    lightboxPanX = x - startPanX;
                    lightboxPanY = y - startPanY;
                    applyLightboxTransform();
                }
            };

            const stopDrag = () => {
                isDraggingLightbox = false;
                initialPinchDistance = null;
            };

            viewport.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));
            window.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
            window.addEventListener('mouseup', stopDrag);

            // Deslizar entre imágenes únicamente con zoom estándar.
            // El gesto no interfiere con el arrastre ampliado ni con el pellizco.
            let swipeStartX = null;
            let swipeStartY = null;
            let swipeStartTime = 0;
            let swipeEligible = false;
            let swipeMultiTouch = false;
            let swipeTracking = false;
            let swipeOffset = 0;
            let swipeAnimating = false;
            const swipeImg = () => document.getElementById('lightbox-img');
            const clearSwipeVisual = () => {
                const img = swipeImg();
                if (img) {
                    img.style.transition = '';
                    img.style.opacity = '';
                    if (lightboxScale === 1) img.style.transform = 'translate(0px, 0px) scale(1)';
                }
                swipeOffset = 0;
                swipeTracking = false;
            };

            viewport.addEventListener('touchstart', (e) => {
                if (swipeAnimating) return;
                if (e.touches.length === 2) {
                    clearSwipeVisual();
                    swipeEligible = false;
                    swipeMultiTouch = true;
                    e.preventDefault();
                    isDraggingLightbox = false;
                    initialPinchDistance = archiGetPinchDistance(e.touches);
                    initialPinchScale = lightboxScale;
                } else if (e.touches.length === 1) {
                    const touch = e.touches[0];
                    swipeEligible = lightboxScale === 1 && !swipeMultiTouch;
                    swipeStartX = touch.clientX;
                    swipeStartY = touch.clientY;
                    swipeStartTime = Date.now();
                    swipeTracking = swipeEligible && lightboxImages.length > 1;
                    swipeOffset = 0;
                    const now = Date.now();
                    if (now - lastTapTime < 300) {
                        e.preventDefault();
                        if (lightboxScale > 1) {
                            resetLightboxZoom();
                        } else {
                            lightboxScale = 2.5;
                            applyLightboxTransform();
                        }
                        lastTapTime = 0;
                        swipeEligible = false;
                        swipeTracking = false;
                        return;
                    }
                    lastTapTime = now;
                    startDrag(e.touches[0].clientX, e.touches[0].clientY);
                }
            }, { passive: false });

            viewport.addEventListener('touchmove', (e) => {
                if (swipeAnimating) return;
                if (e.touches.length === 2 && initialPinchDistance !== null) {
                    e.preventDefault();
                    const currentDistance = archiGetPinchDistance(e.touches);
                    const scaleRatio = currentDistance / initialPinchDistance;
                    lightboxScale = Math.min(Math.max(initialPinchScale * scaleRatio, 1), 4);
                    if (lightboxScale === 1) {
                        lightboxPanX = 0;
                        lightboxPanY = 0;
                    }
                    applyLightboxTransform();
                } else if (e.touches.length === 1) {
                    const touch = e.touches[0];
                    if (swipeTracking && swipeEligible && lightboxScale === 1) {
                        const dx = touch.clientX - swipeStartX;
                        const dy = touch.clientY - swipeStartY;
                        if (archiShouldTrackLightboxSwipe(dx, dy)) {
                            e.preventDefault();
                            swipeOffset = dx;
                            const img = swipeImg();
                            if (img) {
                                img.style.transition = 'none';
                                img.style.transform = `translate3d(${dx}px, 0, 0) scale(1)`;
                            }
                        }
                    } else {
                        if (lightboxScale > 1) e.preventDefault();
                        moveDrag(touch.clientX, touch.clientY);
                    }
                }
            }, { passive: false });

            viewport.addEventListener('touchend', (e) => {
                if (e.touches.length < 2) {
                    initialPinchDistance = null;
                }
                if (e.touches.length === 1 && lightboxScale > 1) {
                    startDrag(e.touches[0].clientX, e.touches[0].clientY);
                } else if (e.touches.length === 0) {
                    if (swipeEligible && !swipeMultiTouch && lightboxScale === 1 && e.changedTouches.length === 1) {
                        const endTouch = e.changedTouches[0];
                        const dx = endTouch.clientX - swipeStartX;
                        const dy = endTouch.clientY - swipeStartY;
                        const elapsed = Date.now() - swipeStartTime;
                        const valid = archiShouldChangeLightboxImage(dx, dy, elapsed, lightboxImages.length);
                        const img = swipeImg();
                        if (img && Math.abs(swipeOffset) > 0) {
                            swipeAnimating = true;
                            img.style.transition = 'transform 200ms ease-out';
                            img.style.transform = valid
                                ? `translate3d(${dx < 0 ? -viewport.clientWidth : viewport.clientWidth}px, 0, 0) scale(1)`
                                : 'translate3d(0, 0, 0) scale(1)';
                            window.setTimeout(() => {
                                if (valid && !document.getElementById('fullscreen-lightbox').classList.contains('hidden')) {
                                    if (dx < 0) nextLightboxImage();
                                    else prevLightboxImage();
                                    const incoming = swipeImg();
                                    if (incoming) {
                                        incoming.style.transition = 'none';
                                        incoming.style.transform = `translate3d(${dx < 0 ? viewport.clientWidth : -viewport.clientWidth}px, 0, 0) scale(1)`;
                                        incoming.getBoundingClientRect();
                                        incoming.style.transition = 'transform 220ms ease-out';
                                        incoming.style.transform = 'translate3d(0, 0, 0) scale(1)';
                                    }
                                    lastTapTime = 0;
                                }
                                window.setTimeout(() => {
                                    clearSwipeVisual();
                                    swipeAnimating = false;
                                }, valid ? 230 : 0);
                            }, 205);
                        } else {
                            clearSwipeVisual();
                        }
                    } else {
                        clearSwipeVisual();
                    }
                    swipeEligible = false;
                    swipeMultiTouch = false;
                    stopDrag();
                }
            });
            viewport.addEventListener('touchcancel', () => {
                clearSwipeVisual();
                swipeEligible = false;
                swipeMultiTouch = false;
                stopDrag();
            });
        }

