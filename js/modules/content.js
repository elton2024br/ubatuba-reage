import { isMobile } from './utils.js';
import analytics from './analytics.js';

/**
 * Lazy loading para imagens
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: '50px 0px' });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback para browsers antigos
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
        });
    }
}

/**
 * Animações de entrada para cards
 */
function initCardAnimations() {
    const cards = document.querySelectorAll('.card-animate');

    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const cardObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationDelay = `${Math.random() * 0.2}s`;
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(card => cardObserver.observe(card));
    } else {
        // Fallback or reduced motion
        cards.forEach(card => card.classList.add('animate-in'));
    }
}

/**
 * Tracking de leitura de artigos
 */
function initArticleTracking() {
    document.body.addEventListener('click', function(e) {
        const articleLink = e.target.closest('article a');
        if (!articleLink) return;

        const article = articleLink.closest('article');
        if (!article) return;

        const title = article.querySelector('h2, h3, h4')?.textContent.trim() || 'Artigo sem título';
        const category = article.querySelector('.article-category')?.textContent.trim() || 'Geral';

        analytics.trackEvent('click', 'article_click', {
            'article_title': title,
            'article_category': category,
            'link_url': articleLink.href
        });
    });
}

/**
 * Funcionalidade de compartilhamento social
 */
function createShareButtons(title, url) {
    const shareContainer = document.createElement('div');
    shareContainer.className = 'share-buttons position-absolute';

    const platforms = [
        { name: 'Twitter', icon: 'bi-twitter', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}` },
        { name: 'Facebook', icon: 'bi-facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
        { name: 'WhatsApp', icon: 'bi-whatsapp', url: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}` }
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

    return shareContainer;
}

function initSocialSharing() {
    if (isMobile()) return; // Only on desktop

    document.querySelectorAll('article.has-share-buttons').forEach(article => {
        article.addEventListener('mouseenter', function() {
            if (this.querySelector('.share-buttons')) return;

            const title = this.querySelector('h2, h3, h4')?.textContent || document.title;
            const url = this.querySelector('a')?.href || window.location.href;

            const shareButtons = createShareButtons(title, url);
            this.style.position = 'relative';
            this.appendChild(shareButtons);

            setTimeout(() => { shareButtons.classList.add('visible'); }, 10);
        });

        article.addEventListener('mouseleave', function() {
            const shareButtons = this.querySelector('.share-buttons');
            if (shareButtons) {
                shareButtons.classList.remove('visible');
                setTimeout(() => { shareButtons.remove(); }, 300);
            }
        });
    });
}

/**
 * Controla o formulário de newsletter genérico (não o da página dedicada)
 */
function initNewsletterForm() {
    document.querySelectorAll('.newsletter-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput.value;
            const button = form.querySelector('button[type="submit"]');
            const originalText = button.textContent;

            if (!email || !email.includes('@')) {
                // This should be handled by a proper UI module, but for now, alert.
                alert('Por favor, insira um e-mail válido.');
                return;
            }

            button.textContent = 'Inscrevendo...';
            button.disabled = true;

            analytics.trackEvent('submit', 'newsletter_signup', {
                'source': form.dataset.source || 'unknown_form'
            });

            // Simulate submission
            setTimeout(() => {
                alert('Obrigado! Você foi inscrito na nossa newsletter.');
                form.reset();
                button.textContent = originalText;
                button.disabled = false;
            }, 1500);
        });
    });
}


export function initContent() {
    initLazyLoading();
    initCardAnimations();
    initArticleTracking();
    initSocialSharing();
    initNewsletterForm();
    console.log('✅ Módulos de conteúdo inicializados');
}
