/**
 * Otimizações de performance
 */
export function initPerformanceOptimizations() {
    // Preload de páginas importantes no hover
    const importantLinks = document.querySelectorAll('a[href^="/"]');

    importantLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const href = this.getAttribute('href');
            if (href && !document.querySelector(`link[rel="prefetch"][href="${href}"]`)) {
                const prefetchLink = document.createElement('link');
                prefetchLink.rel = 'prefetch';
                prefetchLink.href = href;
                document.head.appendChild(prefetchLink);
            }
        }, { once: true, passive: true });
    });

    // Otimização de imagens baseada na conexão
    if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection.saveData || connection.effectiveType?.includes('2g')) {
            document.body.classList.add('low-bandwidth');
        }
    }
    console.log('✅ Otimizações de performance inicializadas');
}
