/* ===================================================
   DigitalPro Landing Page - Premium JavaScript
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. SMOOTH SCROLL (LENIS)
    // ==========================================
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // ==========================================
    // 1. PRELOADER
    // ==========================================
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.classList.add('site-loaded');
            document.body.style.overflow = '';
            initRevealAnimations();
            triggerGlitch();
        }, 1800);
    });
    // Fallback: hide preloader after 3s even if load event already fired
    setTimeout(() => {
        if (!preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
            document.body.classList.add('site-loaded');
            document.body.style.overflow = '';
            initRevealAnimations();
            triggerGlitch();
        }
    }, 3000);

    // ==========================================
    // 2. CUSTOM CURSOR
    // ==========================================
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    const mouseGlow = document.getElementById('mouse-glow');

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let glowX = 0, glowY = 0;

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
        document.body.classList.add('custom-cursor-active');
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        function animateCursor() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';

            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;
            mouseGlow.style.left = glowX + 'px';
            mouseGlow.style.top = glowY + 'px';

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effects for interactive elements
        const hoverTargets = document.querySelectorAll('a, button, input, textarea, select, .service-card, .portfolio-item');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('hover');
                cursorRing.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('hover');
                cursorRing.classList.remove('hover');
            });
        });
    }

    // ==========================================
    // 3. NAVBAR
    // ==========================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 200;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (link) {
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    navLinksItems.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });

    // ==========================================
    // 4. PARTICLE SYSTEM
    // ==========================================
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 1.5; // שינוי מהירות (הוגדל מ-0.5 ל-1.5)
            this.speedY = (Math.random() - 0.5) * 1.5; // שינוי מהירות (הוגדל מ-0.5 ל-1.5)
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            // רתיעה מהעכבר (Flee from mouse)
            if (!isTouchDevice) {
                const dx = this.x - particleMouseX;
                const dy = this.y - particleMouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const repelRadius = 150; // רדיוס הבריחה (אפשר להגדיל אם רוצים שיתרחקו ממרחק רב יותר)

                if (distance < repelRadius && distance > 0) {
                    const force = (repelRadius - distance) / repelRadius;
                    this.x += (dx / distance) * force * 5; // עוצמת הבריחה (אפשר לשנות את ה-5)
                    this.y += (dy / distance) * force * 5;
                }
            }

            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(139, 92, 246, ${this.opacity})`; // צבע החלקיקים (סגול)
            ctx.fill();
        }
    }

    // Initialize particles
    const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // ==========================================
    // --- אפקט פיצוץ מטורף בקליק (Click Explosion) ---
    // ==========================================
    let explosions = [];
    class ExplosionParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 4 + 1;
            this.speedX = (Math.random() - 0.5) * 25; // מהירות התעופה לצדדים
            this.speedY = (Math.random() - 0.5) * 25; // מהירות התעופה למעלה/למטה
            this.color = `hsl(${Math.random() * 360}, 100%, 60%)`; // צבע אקראי מטורף
            this.life = 1; // אורך חיים
            this.decay = Math.random() * 0.02 + 0.01; // קצב ההיעלמות
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.speedY += 0.4; // אפקט כבידה (Gravity) שמושך אותם למטה
            this.life -= this.decay;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = Math.max(0, this.life);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    window.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        // מוודאים שהקליק בוצע באזור המסך הראשי
        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            for (let i = 0; i < 60; i++) { // ייצור של 60 חלקיקים בבת אחת!
                explosions.push(new ExplosionParticle(x, y));
            }
        }
    });

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const opacity = (1 - distance / 150) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`; // צבע הקווים בין החלקיקים
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    // Mouse interaction with particles
    // נגדיר מיקום התחלתי מחוץ למסך כדי שהחלקיקים לא יברחו בטעות מפינת המסך (0,0) לפני שהזזנו את העכבר
    let particleMouseX = -1000, particleMouseY = -1000;
    canvas.addEventListener('mousemove', (e) => {
        particleMouseX = e.clientX;
        particleMouseY = e.clientY;
    });

    // ציור ועדכון חלקיקי הפיצוץ הצבעוניים
    for (let i = explosions.length - 1; i >= 0; i--) {
        explosions[i].update();
        explosions[i].draw();
        if (explosions[i].life <= 0) {
            explosions.splice(i, 1);
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        animationId = requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // Pause particles when not visible
    const heroSection = document.getElementById('hero');
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animationId) animateParticles();
            } else {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        });
    }, { threshold: 0.1 });
    heroObserver.observe(heroSection);

    // ==========================================
    // 5. TYPING EFFECT
    // ==========================================
    const typingElement = document.getElementById('typing-text');
    const phrases = [
        'פיתוח אתרים מתקדמים',
        'קידום אורגני SEO',
        'פרסום ממומן PPC',
        'עיצוב חוויית משתמש',
        'ניהול רשתות חברתיות',
        'אסטרטגיה דיגיטלית'
    ];
    const phraseColors = [
        '#8b5cf6', // סגול לפיתוח אתרים
        '#10b981', // ירוק ל-SEO
        '#3b82f6', // כחול ל-PPC
        '#f59e0b', // כתום לעיצוב
        '#ec4899', // ורוד לרשתות חברתיות
        '#06b6d4'  // טורקיז לאסטרטגיה
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        typingElement.style.color = phraseColors[phraseIndex];

        if (!isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentPhrase.length) {
                isDeleting = true;
                typingSpeed = 2000; // Pause at end
            } else {
                typingSpeed = Math.random() * 80 + 40; // מהירות הקלדה אנושית ומשתנה
            }
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 300; // Pause before next phrase
            } else {
                typingSpeed = 20; // מחיקה מהירה וחלקה יותר
            }
        }

        setTimeout(typeEffect, typingSpeed);
    }
    setTimeout(typeEffect, 2000);

    // ==========================================
    // 6. SCROLL REVEAL ANIMATIONS
    // ==========================================
    function initRevealAnimations() {
        const reveals = document.querySelectorAll('.reveal-up');
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        reveals.forEach(el => revealObserver.observe(el));
    }

    // ==========================================
    // 7. COUNTER ANIMATION
    // ==========================================
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                function updateCounter() {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                }
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // ==========================================
    // 8. 3D TILT EFFECT
    // ==========================================
    if (!isTouchDevice) {
        const tiltCards = document.querySelectorAll('.tilt-card');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / centerY * -5;
                const rotateY = (x - centerX) / centerX * 5;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;

                // Update glow position
                const glow = card.querySelector('.service-card-glow');
                if (glow) {
                    const percentX = (x / rect.width) * 100;
                    const percentY = (y / rect.height) * 100;
                    glow.style.setProperty('--mouse-x', percentX + '%');
                    glow.style.setProperty('--mouse-y', percentY + '%');
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    // ==========================================
    // 9. MAGNETIC BUTTONS
    // ==========================================
    if (!isTouchDevice) {
        const magneticBtns = document.querySelectorAll('.magnetic-btn');
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    // ==========================================
    // 10. TESTIMONIALS CAROUSEL
    // ==========================================
    const track = document.getElementById('testimonials-track');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    const dotsContainer = document.getElementById('testimonials-dots');
    const cards = track.querySelectorAll('.testimonial-card');
    let currentSlide = 0;
    let slidesPerView = 3;
    let totalSlides;

    function updateSlidesPerView() {
        if (window.innerWidth <= 768) {
            slidesPerView = 1;
        } else if (window.innerWidth <= 1024) {
            slidesPerView = 2;
        } else {
            slidesPerView = 3;
        }
        totalSlides = Math.max(1, cards.length - slidesPerView + 1);
        if (currentSlide >= totalSlides) currentSlide = totalSlides - 1;
        updateCarousel();
        createDots();
    }

    function createDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === currentSlide) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentSlide = i;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function updateCarousel() {
        const gap = 24;
        const cardWidth = cards[0].offsetWidth + gap;
        track.style.transform = `translateX(${currentSlide * cardWidth}px)`;

        // Update dots
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((d, i) => {
            d.classList.toggle('active', i === currentSlide);
        });
    }

    prevBtn.addEventListener('click', () => {
        currentSlide = currentSlide > 0 ? currentSlide - 1 : totalSlides - 1;
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        currentSlide = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0;
        updateCarousel();
    });

    window.addEventListener('resize', updateSlidesPerView);
    updateSlidesPerView();

    // Auto-play testimonials
    let autoPlayInterval = setInterval(() => {
        currentSlide = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0;
        updateCarousel();
    }, 5000);

    track.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    track.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(() => {
            currentSlide = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0;
            updateCarousel();
        }, 5000);
    });

    // ==========================================
    // 11. CONTACT FORM
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = 'שולח...';

        setTimeout(() => {
            formSuccess.classList.add('show');
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').textContent = 'שלחו הודעה';
            contactForm.reset();

            setTimeout(() => {
                formSuccess.classList.remove('show');
            }, 4000);
        }, 1500);
    });

    // Form input animations
    const formInputs = document.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });

    // ==========================================
    // 12. SMOOTH SCROLL
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // 13. SERVICE CARD GLOW TRACKING
    // ==========================================
    if (!isTouchDevice) {
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                const glow = card.querySelector('.service-card-glow');
                if (glow) {
                    glow.style.setProperty('--mouse-x', x + '%');
                    glow.style.setProperty('--mouse-y', y + '%');
                }
            });
        });
    }

    // ==========================================
    // 14. PARALLAX SCROLL EFFECTS & MARQUEE & PROCESS LINE
    // ==========================================
    const parallaxElements = document.querySelectorAll('.orb, .stats-orb, .cta-orb');
    const servicesMarquee = document.getElementById('services-marquee');
    const processTimeline = document.getElementById('process-timeline');
    const processLineFill = document.getElementById('process-line-fill');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Orbs
        parallaxElements.forEach((el, index) => {
            const speed = 0.03 + (index * 0.01);
            el.style.transform = `translateY(${scrollY * speed}px)`;
        });

        // Marquee text
        if (servicesMarquee) {
            const marqueeSpeed = 0.15;
            servicesMarquee.style.transform = `translateY(-50%) translateX(${scrollY * marqueeSpeed}px)`;
        }

        // Process line draw
        if (processTimeline && processLineFill) {
            const timelineRect = processTimeline.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Start drawing when the top of timeline hits middle of screen
            const drawStart = timelineRect.top - windowHeight / 2;
            const drawLength = timelineRect.height;

            let progress = 0;
            if (drawStart < 0) {
                progress = Math.abs(drawStart) / drawLength;
            }
            progress = Math.max(0, Math.min(1, progress));

            processLineFill.style.height = `${progress * 100}%`;
        }
    });

    // ==========================================
    // 15. NUMBER FORMAT (with commas)
    // ==========================================
    // Already handled by counter animation

    // ==========================================
    // 16. LAZY LOADING PERFORMANCE
    // ==========================================
    // Use requestIdleCallback for non-critical tasks
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            // Add additional hover effects or non-critical animations here
            console.log('DigitalPro Landing Page - All systems operational ✨');
        });
    }

    // ==========================================
    // 17. SCROLL PROGRESS BAR
    // ==========================================
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scrollProgress.style.width = scrolled + '%';
        });
    }

    // ==========================================
    // 18. GLITCH TEXT EFFECT
    // ==========================================
    function triggerGlitch() {
        const target = document.getElementById('glitch-title');
        if (!target) return;

        const originalText = target.getAttribute('data-text');
        const chars = 'דיגיטלית'; // אותיות מהמילה דיגיטלית בלבד
        let activeGlitchInterval;
        let initialTimeout;

        function runGlitch() {
            let iterations = 0;
            const maxIterations = 30;

            if (activeGlitchInterval) clearInterval(activeGlitchInterval);

            activeGlitchInterval = setInterval(() => {
                target.innerText = originalText.split('').map((char, index) => {
                    if (index < iterations / 3) {
                        return originalText[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join('');

                if (iterations >= maxIterations) {
                    clearInterval(activeGlitchInterval);
                    target.innerText = originalText;

                    // הוספת אנימציית קפיצה (Bounce)
                    target.classList.remove('animate-bounce');
                    void target.offsetWidth; // טריק קטן לאיפוס האנימציה (Reflow)
                    target.classList.add('animate-bounce');
                }
                iterations++;
            }, 40);
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initialTimeout = setTimeout(runGlitch, 200);
                } else {
                    clearTimeout(initialTimeout);
                    if (activeGlitchInterval) clearInterval(activeGlitchInterval);
                    target.innerText = originalText;
                }
            });
        }, { threshold: 0.1 });

        observer.observe(target);
    }

    // ==========================================
    // 19. TEXT REVEAL ON SCROLL
    // ==========================================
    const revealTextContainers = document.querySelectorAll('.text-reveal-scroll');
    revealTextContainers.forEach(container => {
        const text = container.textContent.trim();
        container.innerHTML = ''; // מנקה את הטקסט המקורי

        // מפצל את הטקסט למילים עטופות ב-span
        const words = text.split(/\s+/);
        words.forEach(word => {
            const span = document.createElement('span');
            span.textContent = word + ' ';
            span.classList.add('reveal-word');
            container.appendChild(span);
        });
    });

    function handleTextReveal() {
        const windowHeight = window.innerHeight;

        revealTextContainers.forEach(container => {
            const rect = container.getBoundingClientRect();
            // מחשב כמה מהאלמנט כבר נכנס לפריים
            let progress = (windowHeight - rect.top) / (windowHeight * 0.8);
            progress = Math.max(0, Math.min(1, progress));

            const words = container.querySelectorAll('.reveal-word');
            const totalWords = words.length;

            words.forEach((word, index) => {
                const step = index / totalWords;
                if (progress > step) {
                    word.style.opacity = '1';
                    word.style.textShadow = '0 0 10px rgba(255,255,255,0.3)'; // הטקסט מואר כשמגיעים אליו
                } else {
                    word.style.opacity = '0.2';
                    word.style.textShadow = 'none'; // טקסט שעוד לא הגענו אליו נשאר כהה
                }
            });
        });
    }

    window.addEventListener('scroll', handleTextReveal);
    handleTextReveal(); // קריאה מיידית כדי שהטקסט יקבל שקיפות נכונה מיד בטעינה

    // ==========================================
    // 20. BUTTON RIPPLE EFFECT
    // ==========================================
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            // צבע קבוע לאפקט הגלים התואם לצבעי האתר
            ripple.style.background = `rgba(99, 102, 241, 0.4)`;
            ripple.style.boxShadow = `0 0 20px rgba(99, 102, 241, 0.6)`;

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // ==========================================
    // 21. BACK TO TOP BUTTON
    // ==========================================
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

});
