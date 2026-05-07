/* ══════════ CUSTOM CURSOR ══════════ */
const cursorDot = document.createElement('div');
const cursorRing = document.createElement('div');
cursorDot.className = 'cursor-dot';
cursorRing.className = 'cursor-ring';
document.body.appendChild(cursorDot);
document.body.appendChild(cursorRing);

let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorDot.style.left = mouseX - 4 + 'px';
    cursorDot.style.top = mouseY - 4 + 'px';
});
function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = ringX - 18 + 'px';
    cursorRing.style.top = ringY - 18 + 'px';
    requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .service-card, .project-card, .fleet-item, .contact-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
});

/* ══════════ FLYING BRICKS ══════════ */
function initBricks() {
    const canvas = document.querySelector('.bricks-canvas');
    if (!canvas) return;
    const brickCount = window.innerWidth < 768 ? 8 : 18;
    for (let i = 0; i < brickCount; i++) {
        const brick = document.createElement('div');
        brick.className = 'brick';
        const w = 30 + Math.random() * 50;
        const h = w * (0.4 + Math.random() * 0.3);
        brick.style.width = w + 'px';
        brick.style.height = h + 'px';
        brick.style.left = Math.random() * 100 + '%';
        const dur = 15 + Math.random() * 25;
        brick.style.animationDuration = dur + 's';
        brick.style.animationDelay = Math.random() * dur + 's';
        if (Math.random() > 0.7) brick.classList.add('glow');
        canvas.appendChild(brick);
    }
    // Collision sparkle effect
    setInterval(() => {
        const bricks = canvas.querySelectorAll('.brick');
        if (bricks.length < 2) return;
        const idx = Math.floor(Math.random() * bricks.length);
        const b = bricks[idx];
        const rect = b.getBoundingClientRect();
        if (rect.top > 0 && rect.top < window.innerHeight) {
            createSparkle(canvas, rect.left + rect.width/2, rect.top + rect.height/2);
        }
    }, 3000);
}

function createSparkle(container, x, y) {
    for (let i = 0; i < 6; i++) {
        const spark = document.createElement('div');
        spark.style.cssText = `
            position:fixed; width:4px; height:4px; background:#ff6b00;
            border-radius:50%; pointer-events:none; z-index:1;
            left:${x}px; top:${y}px; opacity:1;
            transition: all ${0.5 + Math.random()*0.5}s ease-out;
        `;
        container.appendChild(spark);
        requestAnimationFrame(() => {
            spark.style.left = (x + (Math.random()-0.5)*80) + 'px';
            spark.style.top = (y + (Math.random()-0.5)*80) + 'px';
            spark.style.opacity = '0';
            spark.style.transform = 'scale(0)';
        });
        setTimeout(() => spark.remove(), 1200);
    }
}

/* ══════════ PRELOADER ══════════ */
window.addEventListener('load', () => {
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) preloader.classList.add('hidden');
    }, 800);
});

/* ══════════ NAVBAR ══════════ */
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
}

const hamburger = document.getElementById('hamburger');
if (hamburger) {
    hamburger.addEventListener('click', () => {
        document.getElementById('navLinks').classList.toggle('open');
    });
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        const navLinks = document.getElementById('navLinks');
        if (navLinks) navLinks.classList.remove('open');
    });
});

/* ══════════ HERO SLIDER ══════════ */
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    if (slides.length === 0) return;
    let current = 0;
    function showSlide(n) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        current = (n + slides.length) % slides.length;
        slides[current].classList.add('active');
        if (dots[current]) dots[current].classList.add('active');
    }
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => showSlide(i));
    });
    setInterval(() => showSlide(current + 1), 5000);
}

/* ══════════ SCROLL REVEAL ══════════ */
function initReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    reveals.forEach(el => observer.observe(el));
}

/* ══════════ COUNTER ANIMATION ══════════ */
function initCounters() {
    const statsContainer = document.querySelector('.hero-stats');
    if (!statsContainer) return;
    function animateCounter(el, target) {
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = Math.floor(current) + '+';
        }, 25);
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = [
                    { el: document.getElementById('counterYears'), val: 19 },
                    { el: document.getElementById('counterProjects'), val: 200 },
                    { el: document.getElementById('counterVehicles'), val: 80 },
                    { el: document.getElementById('counterWorkers'), val: 150 }
                ];
                counters.forEach(c => { if (c.el) animateCounter(c.el, c.val); });
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });
    observer.observe(statsContainer);
}

/* ══════════ SCROLL TO TOP ══════════ */
function initScrollTop() {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 500);
    });
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ══════════ ACTIVE NAV ══════════ */
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Highlight current page in nav
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
            // Only for page-level, not hash links
            if (!href.startsWith('#')) link.classList.add('active');
        }
    });

    if (sections.length > 0) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY + 120;
            sections.forEach(section => {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                const id = section.getAttribute('id');
                const link = document.querySelector(`.nav-links a[href="#${id}"]`);
                if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + height);
            });
        });
    }
}

/* ══════════ INIT ══════════ */
document.addEventListener('DOMContentLoaded', () => {
    initBricks();
    initHeroSlider();
    initReveal();
    initCounters();
    initScrollTop();
    initActiveNav();
});
