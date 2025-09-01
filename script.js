/**
 * INTERCEPT BRASIL - JAVASCRIPT INTERATIVO
 * Funcionalidades que replicam o comportamento do site original
 * Mobile-first e acessível
 */

(function() {
    'use strict';

    // Variáveis globais
    let isMenuOpen = false;
    let isSearchOpen = false;
    let scrollPosition = 0;

    // =============================================================================
    // UTILITÁRIOS
    // =============================================================================

    /**
     * Debounce function para otimizar performance
     */
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    /**
     * Throttle function para scroll events
     */
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Detecta se é dispositivo móvel
     */
    function isMobile() {
        return window.innerWidth <= 768;
    }

    /**
     * Smooth scroll para elementos
     */
    function smoothScrollTo(element, duration = 800) {
        const targetPosition = element.offsetTop - 80; // Considera altura do header
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    // =============================================================================
    // HEADER INTERACTIONS
    // =============================================================================

    /**
     * Controla o comportamento do header no scroll
     */
    function initHeaderScroll() {
        const header = document.querySelector('.header-main');
        let lastScrollTop = 0;
        let ticking = false;

        function updateHeader() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Auto-hide header ao rolar para baixo (apenas desktop)
            if (!isMobile()) {
                if (scrollTop > lastScrollTop && scrollTop > 200) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
            }

            lastScrollTop = scrollTop;
            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    /**
     * Controla o menu hamburguer
     */
    function initMenuToggle() {
        const menuButton = document.querySelector('.btn-toggle-menu');
        const offcanvasMenu = document.getElementById('offcanvasMenu');
        const hamburgerIcon = document.querySelector('.hamburger-icon');

        if (!menuButton || !offcanvasMenu) return;

        // Bootstrap offcanvas events
        offcanvasMenu.addEventListener('show.bs.offcanvas', function() {
            isMenuOpen = true;
            hamburgerIcon.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        offcanvasMenu.addEventListener('hide.bs.offcanvas', function() {
            isMenuOpen = false;
            hamburgerIcon.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Animação do ícone hamburguer
        const style = document.createElement('style');
        style.textContent = `
            .hamburger-icon.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }
            .hamburger-icon.active span:nth-child(2) {
                opacity: 0;
            }
            .hamburger-icon.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -6px);
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Funcionalidade de busca
     */
    function initSearch() {
        const searchButton = document.querySelector('.btn-search');
        const searchForm = document.querySelector('.search-widget form');
        const searchInput = document.querySelector('.search-widget input');

        if (!searchButton || !searchForm) return;

        // Foco no input ao abrir o menu
        document.getElementById('offcanvasMenu').addEventListener('shown.bs.offcanvas', function() {
            if (searchInput) {
                setTimeout(() => searchInput.focus(), 300);
            }
        });

        // Submit da busca
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput.value.trim();
            
            if (query) {
                // Simula busca - em produção faria requisição real
                console.log('Buscando por:', query);
                
                // Feedback visual
                const button = this.querySelector('button');
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="bi bi-hourglass-split"></i>';
                button.disabled = true;
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.disabled = false;
                    searchInput.value = '';
                    // Aqui redirecionaria para página de resultados
                    alert(`Resultados para: "${query}"`);
                }, 1000);
            }
        });
    }

    // =============================================================================
    // NAVEGAÇÃO E MENU
    // =============================================================================

    /**
     * Controla submenus no offcanvas
     */
    function initSubmenuToggle() {
        const submenuItems = document.querySelectorAll('.has-submenu > .nav-link');

        submenuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const submenu = this.nextElementSibling;
                const isOpen = submenu.style.display === 'block';

                // Fecha outros submenus
                document.querySelectorAll('.submenu').forEach(menu => {
                    if (menu !== submenu) {
                        menu.style.display = 'none';
                        menu.previousElementSibling.classList.remove('active');
                    }
                });

                // Toggle do submenu atual
                if (isOpen) {
                    submenu.style.display = 'none';
                    this.classList.remove('active');
                } else {
                    submenu.style.display = 'block';
                    this.classList.add('active');
                }
            });
        });

        // CSS para indicador visual
        const style = document.createElement('style');
        style.textContent = `
            .has-submenu > .nav-link.active::after {
                transform: translateY(-50%) rotate(180deg);
            }
            .submenu {
                display: none;
                animation: slideDown 0.3s ease-out;
            }
            @keyframes slideDown {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }

    // =============================================================================
    // ARTIGOS E CONTEÚDO
    // =============================================================================

    /**
     * Lazy loading para imagens
     */
    function initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px'
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback para browsers antigos
            images.forEach(img => {
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
            });
        }
    }

    /**
     * Animações de entrada para cards
     */
    function initCardAnimations() {
        const cards = document.querySelectorAll('.card');
        
        if ('IntersectionObserver' in window) {
            const cardObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animationDelay = `${Math.random() * 0.3}s`;
                        entry.target.classList.add('animate-in');
                    }
                });
            }, {
                threshold: 0.1
            });

            cards.forEach(card => cardObserver.observe(card));

            // CSS para animação
            const style = document.createElement('style');
            style.textContent = `
                .card {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all 0.6s ease-out;
                }
                .card.animate-in {
                    opacity: 1;
                    transform: translateY(0);
                }
            `;
            document.head.appendChild(style);
        } else {
            // Fallback
            cards.forEach(card => card.classList.add('animate-in'));
        }
    }

    /**
     * Tracking de leitura de artigos
     */
    function initArticleTracking() {
        const articles = document.querySelectorAll('article');
        
        articles.forEach(article => {
            article.addEventListener('click', function(e) {
                const link = e.target.closest('a');
                if (link) {
                    const title = this.querySelector('h2, h3, h4')?.textContent || 'Artigo';
                    const category = this.querySelector('.article-category')?.textContent || 'Geral';
                    
                    // Analytics tracking (Google Analytics, etc.)
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'article_click', {
                            'article_title': title,
                            'article_category': category
                        });
                    }
                    
                    console.log('Artigo clicado:', { title, category });
                }
            });
        });
    }

    // =============================================================================
    // NEWSLETTER
    // =============================================================================

    /**
     * Controla o formulário de newsletter
     */
    function initNewsletter() {
        const form = document.querySelector('.newsletter-form');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            const button = this.querySelector('button[type="submit"]');
            const originalText = button.textContent;

            // Validação básica
            if (!email || !email.includes('@')) {
                showNotification('Por favor, insira um e-mail válido.', 'error');
                return;
            }

            // Loading state
            button.textContent = 'Inscrevendo...';
            button.disabled = true;

            // Simula requisição
            setTimeout(() => {
                // Em produção, faria requisição real para API
                showNotification('Obrigado! Você foi inscrito na nossa newsletter.', 'success');
                this.reset();
                button.textContent = originalText;
                button.disabled = false;
                
                // Analytics tracking
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'newsletter_signup', {
                        'email': email
                    });
                }
            }, 2000);
        });
    }

    /**
     * Sistema de notificações
     */
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Remove automaticamente após 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // =============================================================================
    // SOCIAL SHARING
    // =============================================================================

    /**
     * Funcionalidade de compartilhamento social
     */
    function initSocialSharing() {
        // Adiciona botões de compartilhamento aos artigos
        const articles = document.querySelectorAll('article');
        
        articles.forEach(article => {
            const title = article.querySelector('h2, h3, h4')?.textContent || '';
            const url = window.location.href;
            
            // Cria botões de share no hover (desktop)
            if (!isMobile()) {
                article.addEventListener('mouseenter', function() {
                    if (!this.querySelector('.share-buttons')) {
                        const shareButtons = createShareButtons(title, url);
                        this.style.position = 'relative';
                        this.appendChild(shareButtons);
                    }
                });
            }
        });
    }

    function createShareButtons(title, url) {
        const shareContainer = document.createElement('div');
        shareContainer.className = 'share-buttons position-absolute';
        shareContainer.style.cssText = `
            top: 10px;
            right: 10px;
            display: flex;
            gap: 8px;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const platforms = [
            {
                name: 'Twitter',
                icon: 'bi-twitter',
                url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
            },
            {
                name: 'Facebook',
                icon: 'bi-facebook',
                url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
            },
            {
                name: 'WhatsApp',
                icon: 'bi-whatsapp',
                url: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`
            }
        ];

        platforms.forEach(platform => {
            const button = document.createElement('a');
            button.href = platform.url;
            button.target = '_blank';
            button.rel = 'noopener noreferrer';
            button.className = 'btn btn-sm btn-primary';
            button.innerHTML = `<i class="bi ${platform.icon}"></i>`;
            button.title = `Compartilhar no ${platform.name}`;
            
            shareContainer.appendChild(button);
        });

        // Animação de entrada
        setTimeout(() => {
            shareContainer.style.opacity = '1';
        }, 100);

        return shareContainer;
    }

    // =============================================================================
    // PERFORMANCE E ACESSIBILIDADE
    // =============================================================================

    /**
     * Otimizações de performance
     */
    function initPerformanceOptimizations() {
        // Preload de páginas importantes no hover
        const importantLinks = document.querySelectorAll('a[href^="/"]');
        
        importantLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                const href = this.getAttribute('href');
                if (href && !document.querySelector(`link[href="${href}"]`)) {
                    const prefetchLink = document.createElement('link');
                    prefetchLink.rel = 'prefetch';
                    prefetchLink.href = href;
                    document.head.appendChild(prefetchLink);
                }
            }, { once: true });
        });

        // Otimização de imagens baseada na conexão
        if ('connection' in navigator) {
            const connection = navigator.connection;
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                document.body.classList.add('low-bandwidth');
                
                // CSS para conexões lentas
                const style = document.createElement('style');
                style.textContent = `
                    .low-bandwidth img {
                        filter: blur(0.5px);
                    }
                    .low-bandwidth .card:hover {
                        transform: none;
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }

    /**
     * Melhorias de acessibilidade
     */
    function initAccessibilityFeatures() {
        // Skip links
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link visually-hidden-focusable position-absolute';
        skipLink.textContent = 'Pular para o conteúdo principal';
        skipLink.style.cssText = `
            top: 10px;
            left: 10px;
            z-index: 9999;
            background: var(--color-primary);
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            text-decoration: none;
        `;
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Navegação por teclado
        document.addEventListener('keydown', function(e) {
            // ESC fecha modais/menus
            if (e.key === 'Escape') {
                if (isMenuOpen) {
                    const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasMenu'));
                    if (offcanvas) offcanvas.hide();
                }
            }
        });

        // Indicadores de foco melhorados
        const style = document.createElement('style');
        style.textContent = `
            .focus-visible {
                outline: 2px solid var(--color-primary) !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(style);

        // Suporte a prefers-reduced-motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduce-motion');
            
            const motionStyle = document.createElement('style');
            motionStyle.textContent = `
                .reduce-motion * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(motionStyle);
        }
    }

    // =============================================================================
    // INICIALIZAÇÃO
    // =============================================================================

    /**
     * Inicializa todas as funcionalidades quando DOM estiver pronto
     */
    function init() {
        // Core functionality
        initHeaderScroll();
        initMenuToggle();
        initSearch();
        initSubmenuToggle();
        
        // Content features
        initLazyLoading();
        initCardAnimations();
        initArticleTracking();
        initNewsletter();
        initSocialSharing();
        
        // Performance & Accessibility
        initPerformanceOptimizations();
        initAccessibilityFeatures();

        console.log('✅ Intercept Brasil - Todas as funcionalidades inicializadas');
    }

    // Aguarda o DOM estar pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Reinicializa funcionalidades em mudanças de orientação/resize
    window.addEventListener('resize', debounce(() => {
        // Recalcula elementos baseados no viewport
        initCardAnimations();
    }, 250));

})();
