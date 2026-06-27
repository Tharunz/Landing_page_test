document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for Reveal Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-up, .reveal-clip');
    revealElements.forEach(el => observer.observe(el));

    // 2. Magnetic Button Effect
    const magneticButtons = document.querySelectorAll('.btn--magnetic');
    
    magneticButtons.forEach(btn => {
        const text = btn.querySelector('.btn-text') || btn;
        
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            // Move button slightly
            btn.style.transform = `translate(${deltaX * 10}px, ${deltaY * 10}px)`;
            
            // Move text slightly more for parallax
            if (text !== btn) {
                text.style.transform = `translate(${deltaX * 5}px, ${deltaY * 5}px)`;
            }
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
            if (text !== btn) {
                text.style.transform = '';
            }
        });
    });

    // 3. 3D Tilt Effect
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation (max 10 degrees)
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    // 4. Cursor Spotlight Effect
    const spotlightArea = document.querySelector('.hero');
    const spotlight = document.querySelector('.cursor-spotlight');
    if (spotlightArea && spotlight) {
        spotlightArea.addEventListener('mousemove', (e) => {
            const rect = spotlightArea.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            spotlight.style.setProperty('--mouse-x', `${x}%`);
            spotlight.style.setProperty('--mouse-y', `${y}%`);
        });
    }

    // 5. Typing Effect (Run Once)
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        // The CSS animation runs for 2 seconds. Add finished class shortly after.
        setTimeout(() => {
            typingText.classList.add('finished');
        }, 2200);
    }

    // 6. Tabbed Showcase Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const indicator = document.querySelector('.tab-indicator');

    function updateIndicator(btn) {
        if (!indicator || !btn) return;
        const rect = btn.getBoundingClientRect();
        const parentRect = btn.parentElement.getBoundingClientRect();
        
        // Calculate offset relative to the parent container
        const offsetLeft = rect.left - parentRect.left + btn.parentElement.scrollLeft;
        
        indicator.style.width = `${rect.width}px`;
        indicator.style.transform = `translateX(${offsetLeft}px)`;
    }

    if (tabBtns.length > 0) {
        // Initialize indicator
        setTimeout(() => updateIndicator(document.querySelector('.tab-btn.is-active')), 100);
        window.addEventListener('resize', () => {
            updateIndicator(document.querySelector('.tab-btn.is-active'));
        });

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update buttons
                tabBtns.forEach(b => b.classList.remove('is-active'));
                btn.classList.add('is-active');

                // Move indicator
                updateIndicator(btn);

                // Update panes
                const targetId = btn.getAttribute('data-target');
                tabPanes.forEach(pane => {
                    pane.classList.remove('is-active');
                    if (pane.id === targetId) {
                        pane.classList.add('is-active');
                        // Retrigger animations by removing and re-adding classes
                        const animatedCards = pane.querySelectorAll('.animate-slide-up');
                        animatedCards.forEach(card => {
                            card.style.animation = 'none';
                            card.offsetHeight; /* trigger reflow */
                            card.style.animation = null; 
                        });
                    }
                });
            });
        });
    }

    // Text Fader removed in favor of CSS Gradient Pan
});
