/**
 * Lógica específica para as páginas de Matéria
 */

function setupShareButton() {
    const shareButton = document.querySelector('[data-action="share-article"]');
    if (!shareButton) return;

    shareButton.addEventListener('click', () => {
        const title = document.title;
        const url = window.location.href;

        if (navigator.share) {
            navigator.share({
                title: title,
                url: url,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(url).then(() => {
                const originalText = shareButton.innerHTML;
                shareButton.innerHTML = '<i class="bi bi-check-lg me-1"></i> Link copiado!';
                setTimeout(() => {
                    shareButton.innerHTML = originalText;
                }, 2000);
            }).catch(console.error);
        }
    });
}

async function renderArticleFromSlug() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    if (!slug) return;

    try {
        const res = await fetch(`../data/posts/${slug}.json`);
        if (!res.ok) throw new Error('Matéria não encontrada');
        const post = await res.json();

        document.getElementById('doc-title').textContent = post.title + ' • Ubatuba Reage';
        document.getElementById('doc-description').setAttribute('content', post.excerpt || '');
        document.getElementById('article-title').textContent = post.title;
        document.getElementById('article-excerpt').textContent = post.excerpt || '';
        document.getElementById('article-author').textContent = post.author || 'Redação Ubatuba Reage';
        document.getElementById('article-author-email').textContent = post.authorEmail || '';
        document.getElementById('article-date').textContent = new Date(post.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
        document.getElementById('article-image').src = post.image;
        document.getElementById('article-image').alt = post.title;
        document.getElementById('article-category').textContent = post.category;
        document.getElementById('bc-category').textContent = post.category;
        document.getElementById('bc-category').href = `../categoria/${post.categorySlug || 'cidade'}.html`;
        document.getElementById('bc-title').textContent = post.title;

        // Render body (assuming it's simple HTML or text)
        document.getElementById('article-body').innerHTML = (post.body || '').replace(/\n/g, '<br>');

    } catch (e) {
        console.error("Erro ao carregar matéria:", e);
        document.getElementById('article-title').textContent = 'Matéria não encontrada';
        document.getElementById('article-excerpt').textContent = 'O link que você seguiu pode estar quebrado ou a matéria pode ter sido removida.';
        document.getElementById('article-body').innerHTML = '';
    }
}


export function initArticlePage() {
    setupShareButton();
    renderArticleFromSlug();
    console.log('✅ Página de Matéria inicializada');
}
