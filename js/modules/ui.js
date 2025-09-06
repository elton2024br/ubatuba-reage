/**
 * Funções de UI reutilizáveis
 */

/**
 * Sistema de notificações
 * @param {string} message The message to display.
 * @param {'info'|'success'|'error'} type The type of notification.
 */
export function showNotification(message, type = 'info') {
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
            // Use bootstrap's dispose method if available, otherwise just remove
            const bsAlert = bootstrap.Alert.getOrCreateInstance(notification);
            if (bsAlert) {
                bsAlert.close();
            } else {
                notification.remove();
            }
        }
    }, 5000);
}
