// Global JavaScript for UniCoFinder UI Prototype

document.addEventListener('DOMContentLoaded', () => {
    initFloatingParticles();
    initMobileMenu();
    initModals();
    initButtonStates();
});

// Floating Academic Particles (Adapted from ui-template)
function initFloatingParticles() {
    const bgGlow = document.querySelector('.bg-glow');
    if (!bgGlow) return; // Only run if bg-glow exists on page
    
    const symbols = [
        "π", "∑", "√", "∫", "∞", "Δ", "λ",
        "H₂O", "CO₂", "NaCl",
        "⬡", "▲", "●", "◆",
        "GPA", "IELTS", "TOEFL"
    ];

    function spawn() {
        const el = document.createElement("div");
        el.className = "float-item";
        if (Math.random() > 0.8) el.classList.add("big");
        el.innerText = symbols[Math.floor(Math.random() * symbols.length)];

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const side = Math.floor(Math.random() * 4);
        let xStart, yStart, dx, dy;

        if (side === 0) { // left → right
            xStart = -50; yStart = Math.random() * vh;
            dx = vw + 120; dy = (Math.random() - 0.5) * vh;
        } else if (side === 1) { // right → left
            xStart = vw + 50; yStart = Math.random() * vh;
            dx = -(vw + 120); dy = (Math.random() - 0.5) * vh;
        } else if (side === 2) { // top → bottom
            xStart = Math.random() * vw; yStart = -50;
            dx = (Math.random() - 0.5) * vw; dy = vh + 120;
        } else { // bottom → top
            xStart = Math.random() * vw; yStart = vh + 50;
            dx = (Math.random() - 0.5) * vw; dy = -(vh + 120);
        }

        el.style.left = xStart + "px";
        el.style.top = yStart + "px";
        el.style.setProperty("--dx", dx + "px");
        el.style.setProperty("--dy", dy + "px");
        el.style.animationDuration = (8 + Math.random() * 8) + "s"; // Slightly slower for background effect

        document.body.appendChild(el);
        setTimeout(() => el.remove(), 16000);
    }

    // Spawn less frequently to not distract too much from UI
    setInterval(spawn, 600);
}

// Mobile Menu Toggle
function initMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.navbar-nav');
    if(btn && nav) {
        btn.addEventListener('click', () => {
            // Simple toggle for prototype
            if (nav.style.display === 'flex') {
                nav.style.display = 'none';
            } else {
                nav.style.display = 'flex';
                nav.style.flexDirection = 'column';
                nav.style.position = 'absolute';
                nav.style.top = '100%';
                nav.style.left = '0';
                nav.style.width = '100%';
                nav.style.background = 'rgba(5, 8, 22, 0.95)';
                nav.style.padding = '1rem';
                nav.style.borderBottom = '1px solid var(--border-color)';
            }
        });
    }
}

// Modal System
function initModals() {
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    const closeBtns = document.querySelectorAll('.modal-close, [data-modal-close]');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = trigger.getAttribute('data-modal-target');
            const modal = document.getElementById(targetId);
            if (modal) modal.classList.add('active');
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            btn.closest('.modal-backdrop').classList.remove('active');
        });
    });
}

// Button States (Simulate API Calls)
function initButtonStates() {
    const forms = document.querySelectorAll('form[data-simulate]');
    const actionBtns = document.querySelectorAll('button[data-simulate]');

    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            simulateLoading(btn, form.getAttribute('data-simulate-redirect'));
        });
    });

    actionBtns.forEach(btn => {
        if(btn.type !== 'submit') {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                simulateLoading(btn, btn.getAttribute('data-simulate-redirect'));
            });
        }
    });
}

function simulateLoading(btn, redirectUrl) {
    if (!btn) return;
    
    const originalText = btn.innerHTML;
    btn.classList.add('loading');
    btn.innerHTML = '<span class="spinner"></span> Loading...';
    btn.disabled = true;

    setTimeout(() => {
        btn.classList.remove('loading');
        btn.innerHTML = 'Success!';
        btn.classList.replace('btn-primary', 'btn-success') || btn.classList.add('btn-success');
        
        setTimeout(() => {
            if (redirectUrl) {
                window.location.href = redirectUrl;
            } else {
                btn.innerHTML = originalText;
                btn.disabled = false;
                btn.classList.remove('btn-success');
            }
        }, 800);
    }, 1500);
}
