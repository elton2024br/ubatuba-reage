/**
 * Melhorias de acessibilidade
 */
export function initAccessibilityFeatures() {
    // Adiciona "Skip to content" link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Pular para o conteúdo principal';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Navegação por teclado para fechar menu offcanvas
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const offcanvasMenu = document.querySelector('.offcanvas.show');
            if (offcanvasMenu) {
                const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasMenu);
                if (offcanvasInstance) {
                    offcanvasInstance.hide();
                }
            }
        }
    });

    // Suporte a 'prefers-reduced-motion'
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reduce-motion');
    }
    console.log('✅ Funcionalidades de acessibilidade inicializadas');
}
