gsap.registerPlugin(ScrollTrigger, TextPlugin);

        // Always reset to top level on load (Robust Version)
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        window.addEventListener('beforeunload', function() {
            window.scrollTo(0, 0);
        });

        window.addEventListener('load', function() {
            setTimeout(function() {
                window.scrollTo(0, 0);
                if (typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.refresh();
                }
            }, 50);
            if (window.location.hash) {
                history.replaceState(null, null, window.location.pathname + window.location.search);
            }
        });

        document.getElementById('year').textContent = new Date().getFullYear();

        // --- Tab Switching Logic ---
        function switchTab(e, tabId) {
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            e.currentTarget.classList.add('active');
            document.getElementById('tab-' + tabId).classList.add('active');

            if (tabId === 'skills') {
                gsap.fromTo('.skill-tag', { scale: 0 }, { scale: 1, duration: 0.6, ease: "back.out(2)", stagger: 0.08 });
            }
        }

        // --- Mobile Menu ---
        const hamburger = document.querySelector('.hamburger');
        const navLinksEle = document.querySelector('.nav-links');
        const navItems = document.querySelectorAll('.nav-links li a');
        
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinksEle.classList.toggle('active');
        });
        
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinksEle.classList.remove('active');
            });
        });

        // --- Custom Cursor ---
        let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
        if (window.matchMedia('(pointer: fine)').matches) {
            const cursorDot = document.querySelector('.cursor-dot');
            const cursorRing = document.querySelector('.cursor-ring');
            
            window.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });

            // Smooth follow with GSAP
            gsap.ticker.add(() => {
                gsap.to(cursorDot, { x: mouseX, y: mouseY, duration: 0.15 });
                gsap.to(cursorRing, { x: mouseX, y: mouseY, duration: 0.35 });
            });

            // Hover effect on links
            document.querySelectorAll('a, button').forEach(el => {
                el.addEventListener('mouseenter', () => {
                    gsap.to(cursorRing, { width: 50, height: 50, borderColor: '#7b2fff', backgroundColor: 'rgba(123,47,255,0.1)', duration: 0.3 });
                });
                el.addEventListener('mouseleave', () => {
                    gsap.to(cursorRing, { width: 30, height: 30, borderColor: 'rgba(0,245,255,0.5)', backgroundColor: 'transparent', duration: 0.3 });
                });
            });
        }

        // --- Preloader & Initialization Animations ---
        window.addEventListener('load', () => {
            const tl = gsap.timeline();
            
            // Text fade in
            tl.to('.preloader-text', { opacity: 1, duration: 0.5 })
              // Preloader slide up
              .to('.preloader', { y: '-100%', duration: 0.8, ease: "power4.inOut", delay: 0.5 })
              // Hero name typing
              .to('.hero-name', { text: "Varnit Khandelwal", duration: 1.5, ease: "none" })
              // Subtitle & role fade in
              .fromTo('.hero-role, .hero-sub', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.2 }, "-=0.5")
              // Buttons bounce in
              .to('.btn', { scale: 1, duration: 0.8, ease: "back.out(1.7)", stagger: 0.2 }, "-=0.4");
              
            // Orb pulsing
            gsap.to('.orb-1', { scale: 1.15, duration: 4, yoyo: true, repeat: -1, ease: "sine.inOut" });
            gsap.to('.orb-2', { scale: 1.2, duration: 5, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 1 });
        });

        // --- Scroll Animations ---
        // Navbar shrink using ScrollTrigger for better efficiency
        ScrollTrigger.create({
            start: "top -50",
            onUpdate: (self) => {
                const nav = document.getElementById('navbar');
                if (self.isActive && self.direction === 1) { // 1 means scrolling down
                     if (!nav.classList.contains('scrolled')) {
                         nav.classList.add('scrolled');
                         gsap.to('.logo', { scale: 0.85, duration: 0.3 });
                     }
                }
            },
           onLeaveBack: () => {
                const nav = document.getElementById('navbar');
                nav.classList.remove('scrolled');
                gsap.to('.logo', { scale: 1, duration: 0.3 });
           }
        });

        // Floating UI elements (Anti-gravity feel)
        gsap.utils.toArray('.gs-float').forEach((el, index) => {
            const dur = 2.5 + (Math.random() * 2);
            gsap.to(el, { y: -15, rotation: (Math.random() * 4) - 2, duration: dur, ease: "sine.inOut", yoyo: true, repeat: -1, delay: Math.random() });
        });

        // Scroll Up Reveals
        gsap.utils.toArray('.gs-scroll-up').forEach(el => {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                },
                y: 80, opacity: 0, duration: 1, ease: "power3.out"
            });
        });

        // Background Parallax for project images
        gsap.utils.toArray('.project-img-container').forEach(container => {
            const img = container.querySelector('img');
            gsap.to(img, {
                yPercent: 20,
                ease: "none",
                scrollTrigger: {
                    trigger: container,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                }
            });
        });

        // --- Canvas Particles: Anti-Gravity Engine ---
        const canvas = document.getElementById('particle-canvas');
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let MAX_PARTICLES = 120;
        const CONNECTION_DISTANCE = 120;
        const MOUSE_REPULSION = 120;
        const REPULSION_FORCE = 0.5;

        function initCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            MAX_PARTICLES = width < 768 ? 40 : 120;
            particles = [];
            for (let i = 0; i < MAX_PARTICLES; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    radius: Math.random() * 1.5 + 0.5,
                    color: Math.random() > 0.5 ? '#00f5ff' : '#7b2fff',
                    baseAlpha: Math.random() * 0.4 + 0.3
                });
            }
        }

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        function animateCanvas() {
            if (width < 768) return; // completely disable canvas on mobile
            ctx.clearRect(0, 0, width, height);
            
            for (let i = 0; i < particles.length; i++) {
                let p = particles[i];

                // Mouse Repulsion Field
                let dx = p.x - mouseX;
                let dy = p.y - mouseY;
                let dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < MOUSE_REPULSION && dist > 0) {
                    p.vx += (dx / dist) * REPULSION_FORCE;
                    p.vy += (dy / dist) * REPULSION_FORCE;
                }

                // Dampen velocity to prevent flying
                const maxSpeed = 2.5;
                const minSpeed = 0.2;
                let speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                if(speed > maxSpeed) {
                    p.vx = (p.vx / speed) * maxSpeed;
                    p.vy = (p.vy / speed) * maxSpeed;
                }
                // Soft friction
                p.vx *= 0.98;
                p.vy *= 0.98;
                
                // Keep minimal drift
                if(speed < minSpeed) {
                    p.vx += (Math.random()-0.5) * 0.1;
                    p.vy += (Math.random()-0.5) * 0.1;
                }

                p.x += p.vx;
                p.y += p.vy;

                // Wall bouncing
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;
                
                // Draw Particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.baseAlpha;
                ctx.fill();

                // Draw connections
                if (width >= 768) {
                    for (let j = i + 1; j < particles.length; j++) {
                        let p2 = particles[j];
                        let dcdx = p.x - p2.x;
                        
                        // Quick efficiency check before expensive math
                        if (Math.abs(dcdx) > CONNECTION_DISTANCE) continue;
                        
                        let dcdy = p.y - p2.y;
                        if (Math.abs(dcdy) > CONNECTION_DISTANCE) continue;
                        
                        let cDist = Math.sqrt(dcdx * dcdx + dcdy * dcdy);

                        if (cDist < CONNECTION_DISTANCE) {
                            ctx.beginPath();
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.strokeStyle = '#ffffff';
                            // Opacity based on distance
                            ctx.globalAlpha = 0.15 * (1 - cDist / CONNECTION_DISTANCE);
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    }
                }
            }
            ctx.globalAlpha = 1;
            requestAnimationFrame(animateCanvas);
        }

        initCanvas();
        animateCanvas();

        // --- Contact Form EmailJS ---
        function sendEmail(e) {
            e.preventDefault();
            const btn = document.getElementById('send-btn');
            const originalText = btn.innerText;
            btn.innerText = "Sending...";
            
            // !! WARNING: Replace YOUR_SERVICE_ID and YOUR_TEMPLATE_ID with actual EmailJS keys
            emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', '#contact-form')
                .then(() => {
                    emitParticles();
                    btn.innerText = "Message Sent! 🚀";
                    btn.style.color = "#00ff88";
                    btn.style.borderColor = "#00ff88";
                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.style.color = "";
                        btn.style.borderColor = "";
                        document.getElementById('contact-form').reset();
                    }, 3000);
                }, (error) => {
                    btn.innerText = "Error! Try Again.";
                    btn.style.color = "#ff3333";
                    btn.style.borderColor = "#ff3333";
                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.style.color = "";
                        btn.style.borderColor = "";
                    }, 3000);
                });
        }

        // --- Button Particle Burst Effect ---
        function emitParticles() {
            const btn = document.getElementById('send-btn');
            const rect = btn.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            
            for(let i=0; i<30; i++) {
                const dot = document.createElement('div');
                dot.style.position = 'fixed';
                dot.style.width = '4px'; dot.style.height = '4px';
                dot.style.background = Math.random() > 0.5 ? '#00f5ff' : '#7b2fff';
                dot.style.borderRadius = '50%';
                dot.style.left = cx + 'px';
                dot.style.top = cy + 'px';
                dot.style.zIndex = 9999;
                dot.style.pointerEvents = 'none';
                document.body.appendChild(dot);
                
                const angle = Math.random() * Math.PI * 2;
                const distance = 50 + Math.random() * 100;
                
                gsap.to(dot, {
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    opacity: 0,
                    duration: 0.6 + Math.random() * 0.5,
                    ease: "power2.out",
                    onComplete: () => dot.remove()
                });
            }
        }

        // --- Achievements Anti-Gravity Animations ---
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        // 1 & 2. Floating Icons & Orbs (Disabled if reduced motion is preferred)
        if (!reduceMotion) {
            gsap.utils.toArray('.floating-icon').forEach((icon, i) => {
                gsap.to(icon, {
                    y: -12,
                    rotation: 3,
                    duration: i === 0 ? 2.8 : 3.5,
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1
                });
            });

            function randomBetween(min, max) { return Math.random() * (max - min) + min; }
            gsap.utils.toArray('.ach-orb').forEach((orb) => {
                gsap.to(orb, {
                    x: () => randomBetween(-20, 20),
                    y: () => randomBetween(-25, 25),
                    duration: () => randomBetween(3, 5),
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1
                });
            });
        }

        // 3. Card Scroll-In
        gsap.from('.achievement-card', {
            y: 100,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",
            stagger: 0.25,
            scrollTrigger: {
                trigger: '#achievements',
                start: "top 75%"
            }
        });

        // 4. Section Title Float-in
        const violetAchSpan = document.querySelector('.achievements-title .text-violet');
        if(violetAchSpan) {
            const titleChars = "Achievements".split('');
            violetAchSpan.innerHTML = titleChars.map(char => `<span style="display:inline-block" class="ach-char">${char}</span>`).join('');
            gsap.from('.ach-char', {
                y: 60,
                opacity: 0,
                duration: 0.8,
                stagger: 0.04,
                ease: "back.out(1.7)",
                scrollTrigger: { trigger: '.achievements-title', start: "top 80%" }
            });
        }

        // 5. Hover Anti-Gravity Lift
        gsap.utils.toArray('.achievement-card').forEach((card) => {
            card.addEventListener('mouseenter', () => {
                if (reduceMotion) return;
                gsap.to(card, {
                    y: -15,
                    rotationX: 5,
                    rotationY: -3,
                    scale: 1.02,
                    duration: 0.4,
                    ease: "power2.out"
                });
            });
            card.addEventListener('mouseleave', () => {
                if (reduceMotion) return;
                gsap.to(card, {
                    y: 0, rotationX: 0, rotationY: 0, scale: 1,
                    duration: 0.6, ease: "elastic.out(1, 0.5)"
                });
            });
        });

        // 7. Tag Chips Float-Pop
        gsap.utils.toArray('.achievement-card').forEach((card) => {
            const tags = card.querySelectorAll('.ach-tag-anim');
            gsap.from(tags, {
                scale: 0,
                opacity: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: "back.out(2.5)",
                delay: 0.4,
                scrollTrigger: {
                    trigger: card,
                    start: "top 80%"
                }
            });
        });

        // --- Slider Logic ---
        function slideGrid(btn, direction) {
            const container = btn.closest('.container');
            const grid = container.querySelector('.projects-grid.slider');
            if (grid) {
                const card = grid.querySelector('.project-card');
                const cardWidth = card.offsetWidth + 16; // width + gap
                grid.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
            }
        }

        // --- GSAP Scroll for Featured Projects Only ---
        window.addEventListener('load', () => {
            const featuredWrapper = document.getElementById('gsap-featured-wrapper');
            const featuredGrid = document.querySelector('.gsap-featured-grid');

            if (featuredWrapper && featuredGrid) {
                // Wait for minimal layout calculation
                let getScrollAmount = () => -(featuredGrid.scrollWidth - window.innerWidth + window.innerWidth * 0.1);

                const tween = gsap.to(featuredGrid, {
                    x: getScrollAmount,
                    ease: "none"
                });

                ScrollTrigger.create({
                    trigger: featuredWrapper,
                    start: "top 25%", // Shifted downward to reduce blank space at bottom
                    end: () => `+=${featuredGrid.scrollWidth}`, // Scroll duration equals width
                    pin: true,
                    animation: tween,
                    scrub: 1,
                    invalidateOnRefresh: true,
                    onEnter: () => gsap.set(featuredGrid, { overflow: "visible" })
                });
            }
        });
