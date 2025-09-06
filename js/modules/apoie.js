/**
 * Lógica específica para a página de Apoio
 */

function copyPix(button) {
    const pixKey = 'apoie@ubatubareage.com.br';
    navigator.clipboard.writeText(pixKey).then(() => {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="bi bi-check"></i> Copiado!';
        button.classList.add('btn-success');
        button.classList.remove('btn-primary');

        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.add('btn-primary');
            button.classList.remove('btn-success');
        }, 2000);
    });
}

export function initApoiePage() {
    const copyButton = document.querySelector('[data-action="copy-pix"]');
    if (copyButton) {
        copyButton.addEventListener('click', (e) => {
            e.preventDefault();
            copyPix(copyButton);
        });
    }
    console.log('✅ Página de Apoio inicializada');
}
