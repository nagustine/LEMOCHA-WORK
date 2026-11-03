document.addEventListener("DOMContentLoaded", () => {
    
    // 1. MOBILE MENU
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
            });
        });
    }

    // 2. SCROLL REVEAL (IntersectionObserver)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });
    revealElements.forEach(el => revealObserver.observe(el));

    // 3. HERO STATS COUNT-UP ANIMATION
    const countUpElements = document.querySelectorAll('.count-up');
    const countUpObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseFloat(entry.target.getAttribute('data-target'));
                const decimals = parseInt(entry.target.getAttribute('data-decimals')) || 0;
                const duration = 2000; // 2 detik
                const startTime = performance.now();

                function updateCount(currentTime) {
                    const elapsedTime = currentTime - startTime;
                    const progress = Math.min(elapsedTime / duration, 1);
                    // Ease out cubic
                    const easeOutProgress = 1 - Math.pow(1 - progress, 3);
                    const currentValue = easeOutProgress * target;
                    
                    entry.target.textContent = currentValue.toFixed(decimals);

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        entry.target.textContent = target.toFixed(decimals);
                    }
                }
                requestAnimationFrame(updateCount);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    countUpElements.forEach(el => countUpObserver.observe(el));

    // 4. FAQ ACCORDION
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const summary = item.querySelector('summary');
        const answer = item.querySelector('.faq-answer');
        
        summary.addEventListener('click', (e) => {
            e.preventDefault(); // Cegah buka-tutup instan bawaan browser
            
            // Jika sedang terbuka, tutup
            if (item.hasAttribute('open')) {
                answer.style.maxHeight = null;
                setTimeout(() => item.removeAttribute('open'), 300);
            } 
            // Jika tertutup, tutup yang lain dulu, lalu buka ini
            else {
                faqItems.forEach(otherItem => {
                    if (otherItem.hasAttribute('open')) {
                        const otherAns = otherItem.querySelector('.faq-answer');
                        otherAns.style.maxHeight = null;
                        setTimeout(() => otherItem.removeAttribute('open'), 300);
                    }
                });
                
                item.setAttribute('open', '');
                setTimeout(() => {
                    answer.style.maxHeight = answer.scrollHeight + "px";
                }, 10);
            }
        });
    });

    // 5. NAVBAR SCROLLSPY & DYNAMIC SHADOW
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section-observe');

    const navObserverOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', 
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => navObserver.observe(section));

    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.4)';
            } else {
                navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            }
        }
    });

    // 6. ANIMASI KARTU NFC INTERAKTIF
    let currentStep = 1;
    let isAutoPlaying = true;
    let animationTimer = null;
    const totalSteps = 3;

    const phone = document.getElementById('phone');
    const nfcWaves = document.getElementById('nfcWaves');
    const screenDefault = document.getElementById('screenDefault');
    const screenReview = document.getElementById('screenReview');
    const stars = document.querySelectorAll('.star-icon');
    const reviewSuccessText = document.getElementById('reviewSuccessText');
    const playIcon = document.getElementById('playIcon');
    const playText = document.getElementById('playText');
    const stepItems = [
        document.getElementById('step1'),
        document.getElementById('step2'),
        document.getElementById('step3')
    ];

    function runStep(step) {
        currentStep = step;

        // Update class untuk indikator steps
        stepItems.forEach((el, index) => {
            if (!el) return;
            if (index + 1 === step) {
                el.classList.add('active', 'border-brandBlue/50', 'bg-brandCardDark/90');
            } else {
                el.classList.remove('active', 'border-brandBlue/50', 'bg-brandCardDark/90');
            }
        });

        // Logika UI Mockup HP
        if (step === 1) {
            phone.classList.add('tapped');
            nfcWaves.classList.remove('opacity-0');
            screenReview.classList.add('opacity-0', 'translate-y-4');
            screenDefault.classList.remove('opacity-0');
            resetStars();
        } else if (step === 2) {
            phone.classList.add('tapped');
            nfcWaves.classList.add('opacity-0');
            screenDefault.classList.add('opacity-0');
            screenReview.classList.remove('opacity-0', 'translate-y-4');
            resetStars();
        } else if (step === 3) {
            phone.classList.remove('tapped');
            nfcWaves.classList.add('opacity-0');
            screenDefault.classList.add('opacity-0');
            screenReview.classList.remove('opacity-0', 'translate-y-4');

            stars.forEach((star, index) => {
                setTimeout(() => {
                    if (currentStep === 3) {
                        star.classList.add('active');
                    }
                }, index * 200);
            });

            setTimeout(() => {
                if (currentStep === 3) {
                    reviewSuccessText.classList.remove('opacity-0');
                }
            }, 1200);
        }
    }

    function resetStars() {
        if (!stars.length || !reviewSuccessText) return;
        stars.forEach(star => star.classList.remove('active'));
        reviewSuccessText.classList.add('opacity-0');
    }

    function startSequence() {
        if (!phone) return;
        runStep(currentStep);
        if (animationTimer) clearInterval(animationTimer);

        animationTimer = setInterval(() => {
            if (isAutoPlaying) {
                currentStep = (currentStep % totalSteps) + 1;
                runStep(currentStep);
            }
        }, 3500);
    }

    function updatePlayPauseUI() {
        if (!playIcon || !playText) return;
        if (isAutoPlaying) {
            playIcon.className = "fa-solid fa-pause text-brandOrange";
            playText.textContent = "Jeda";
        } else {
            playIcon.className = "fa-solid fa-play text-brandOrange";
            playText.textContent = "Putar";
        }
    }

    // Global functions untuk inline onclick di HTML
    window.jumpToStep = function(step) {
        isAutoPlaying = false;
        updatePlayPauseUI();
        runStep(step);
    };

    window.toggleAutoPlay = function() {
        isAutoPlaying = !isAutoPlaying;
        updatePlayPauseUI();
        if (isAutoPlaying) {
            startSequence();
        }
    };

    window.restartAnimation = function() {
        isAutoPlaying = true;
        updatePlayPauseUI();
        currentStep = 1;
        startSequence();
    };

    if (phone) {
        phone.addEventListener('click', () => {
            isAutoPlaying = false;
            updatePlayPauseUI();
            const next = (currentStep % totalSteps) + 1;
            runStep(next);
        });

        window.addEventListener('load', () => {
            startSequence();
        });
    }
});