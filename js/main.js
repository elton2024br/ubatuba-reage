import analytics from './modules/analytics.js';
import { initAuth, requireRole } from './modules/auth.js';
import CommentsSystem from './modules/comments.js';
import FontesSystem from './modules/fontes.js';
import NewsletterSystem from './modules/newsletter.js';
import SearchSystem from './modules/search.js';
import { initDevTools } from './modules/identity-setup.js';
import { initHeader } from './modules/header.js';
import { initSubmenu } from './modules/navigation.js';
import { initContent } from './modules/content.js';
import { initPerformanceOptimizations } from './modules/performance.js';
import { initAccessibilityFeatures } from './modules/accessibility.js';
import { initApoiePage } from './modules/apoie.js';
import { initContatoPage } from './modules/contato.js';
import { initArticlePage } from './modules/article.js';
import { debounce } from './modules/utils.js';

/**
 * Ponto de entrada principal da aplicação
 * Orquestra a inicialização de todos os módulos.
 */
function main() {
    // --- Inicialização Global ---
    // Módulos que rodam em todas as páginas
    analytics.init();
    initAuth();
    initHeader();
    initSubmenu();
    initContent();
    initPerformanceOptimizations();
    initAccessibilityFeatures();

    // --- Inicialização Específica por Página ---

    // Página de Busca
    if (document.getElementById('searchForm')) {
        const search = new SearchSystem();
        search.init();
    }

    // Página de Matéria (comentários)
    if (document.getElementById('comments-section')) {
        const comments = new CommentsSystem();
        comments.init();
    }

    // Página "Seja nossa Fonte"
    if (document.getElementById('fontesForm')) {
        const fontes = new FontesSystem();
        fontes.init();
    }

    // Página de Newsletter dedicada
    if (document.getElementById('newsletterForm')) {
        const newsletter = new NewsletterSystem();
        newsletter.init();
    }

    // Página de Apoio
    if (document.querySelector('[data-action="copy-pix"]')) {
        initApoiePage();
    }

    // Página de Contato
    if (document.querySelector('form[name="contato"]')) {
        initContatoPage();
    }

    // Página de Matéria
    if (window.location.pathname.includes('/materia/')) {
        initArticlePage();
    }

    // Dashboard (página protegida)
    if (window.location.pathname.endsWith('dashboard.html')) {
        requireRole(['admin', 'editor']);
    }

    // Ferramentas de desenvolvimento (carregar condicionalmente)
    // Em um ambiente de produção real, isso seria envolvido por um if (process.env.NODE_ENV === 'development')
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('dev')) {
        initDevTools();
    }

    // --- Event Listeners Globais ---

    // Exemplo de reinicialização de um módulo em resize
    window.addEventListener('resize', debounce(() => {
        // A lógica de animação de cards pode precisar ser recalculada
        // initCardAnimations(); // Esta função está dentro de initContent()
    }, 250));

    console.log('🚀 Aplicação Ubatuba Reage inicializada com sucesso!');
}

// Aguarda o DOM estar pronto para executar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    main();
}
