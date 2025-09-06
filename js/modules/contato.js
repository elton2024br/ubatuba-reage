/**
 * Lógica específica para a página de Contato
 */

function setupCharCounter() {
    const textarea = document.getElementById('mensagem');
    const counter = document.getElementById('char-count');
    if (!textarea || !counter) return;

    const maxLength = 2000;

    textarea.addEventListener('input', () => {
        const currentLength = textarea.value.length;
        counter.textContent = currentLength;

        if (currentLength > maxLength) {
            counter.parentElement.classList.add('text-danger');
            textarea.classList.add('is-invalid');
        } else {
            counter.parentElement.classList.remove('text-danger');
            textarea.classList.remove('is-invalid');
        }
    });
}

function setTimestamp() {
    const timestampInput = document.getElementById('timestamp');
    if (timestampInput) {
        timestampInput.value = new Date().toISOString();
    }
}

function setupFormSubmission() {
    const form = document.querySelector('form[name="contato"]');
    if (!form) return;

    form.addEventListener('submit', function() {
        const button = this.querySelector('button[type="submit"]');
        if (!button) return;

        const originalText = button.innerHTML;
        button.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Enviando...';
        button.disabled = true;

        // Re-enable after a timeout in case of submission error
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 4000);
    });
}

export function initContatoPage() {
    setupCharCounter();
    setTimestamp();
    setupFormSubmission();
    console.log('✅ Página de Contato inicializada');
}
