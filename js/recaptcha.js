/**
 * reCAPTCHA v3 SYSTEM - UBATUBA REAGE
 * Sistema independente de reCAPTCHA para formulários
 */

class RecaptchaSystem {
    constructor() {
        this.config = {
            SITE_KEY: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', // Test key - substitua pela sua chave real
            ENABLED: !this.isLocalhost(),
            DEBUG: this.isLocalhost()
        };
        
        this.isLoaded = false;
        this.pendingCallbacks = [];
        
        if (this.config.ENABLED) {
            this.init();
        } else {
            console.log('🔒 reCAPTCHA desabilitado em localhost');
        }
    }
    
    init() {
        this.loadRecaptchaScript();
        console.log('🔒 reCAPTCHA v3 inicializado');
    }
    
    isLocalhost() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.hostname === '';
    }
    
    loadRecaptchaScript() {
        if (document.querySelector('script[src*="recaptcha"]')) {
            this.isLoaded = true;
            this.processPendingCallbacks();
            return;
        }
        
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${this.config.SITE_KEY}`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
            this.isLoaded = true;
            this.processPendingCallbacks();
        };
        
        script.onerror = () => {
            console.error('❌ Erro ao carregar reCAPTCHA');
        };
        
        document.head.appendChild(script);
    }
    
    processPendingCallbacks() {
        this.pendingCallbacks.forEach(callback => callback());
        this.pendingCallbacks = [];
    }
    
    async getToken(action = 'submit') {
        if (!this.config.ENABLED) {
            if (this.config.DEBUG) {
                console.log('🔒 reCAPTCHA simulado para:', action);
            }
            return 'test-token-' + Date.now();
        }
        
        return new Promise((resolve, reject) => {
            const executeRecaptcha = () => {
                if (typeof grecaptcha !== 'undefined' && grecaptcha.ready) {
                    grecaptcha.ready(() => {
                        grecaptcha.execute(this.config.SITE_KEY, { action: action })
                            .then(token => {
                                if (this.config.DEBUG) {
                                    console.log('🔒 reCAPTCHA token obtido para:', action);
                                }
                                resolve(token);
                            })
                            .catch(error => {
                                console.error('❌ Erro ao obter token reCAPTCHA:', error);
                                reject(error);
                            });
                    });
                } else {
                    reject(new Error('reCAPTCHA não carregado'));
                }
            };
            
            if (this.isLoaded) {
                executeRecaptcha();
            } else {
                this.pendingCallbacks.push(executeRecaptcha);
            }
        });
    }
    
    async validateForm(formElement, action = 'submit') {
        if (!formElement) {
            throw new Error('Elemento do formulário não encontrado');
        }
        
        try {
            const token = await this.getToken(action);
            
            // Adiciona o token ao formulário
            let tokenInput = formElement.querySelector('input[name="g-recaptcha-response"]');
            if (!tokenInput) {
                tokenInput = document.createElement('input');
                tokenInput.type = 'hidden';
                tokenInput.name = 'g-recaptcha-response';
                formElement.appendChild(tokenInput);
            }
            tokenInput.value = token;
            
            return { success: true, token: token };
        } catch (error) {
            console.error('❌ Validação reCAPTCHA falhou:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Método para integração com formulários existentes
    attachToForm(formSelector, options = {}) {
        const form = document.querySelector(formSelector);
        if (!form) {
            console.error('❌ Formulário não encontrado:', formSelector);
            return;
        }
        
        const config = {
            action: options.action || 'submit',
            onSuccess: options.onSuccess || (() => {}),
            onError: options.onError || (() => {}),
            showBadge: options.showBadge !== false
        };
        
        // Adiciona badge do reCAPTCHA
        if (config.showBadge && this.config.ENABLED) {
            this.addRecaptchaBadge(form);
        }
        
        // Intercepta o submit do formulário
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const result = await this.validateForm(form, config.action);
                
                if (result.success) {
                    config.onSuccess(result.token);
                    // Permite o submit normal do formulário
                    form.removeEventListener('submit', arguments.callee);
                    form.submit();
                } else {
                    config.onError(result.error);
                }
            } catch (error) {
                config.onError(error.message);
            }
        });
    }
    
    addRecaptchaBadge(formElement) {
        if (formElement.querySelector('.recaptcha-badge')) return;
        
        const badge = document.createElement('div');
        badge.className = 'recaptcha-badge';
        badge.innerHTML = `
            <div class="d-flex align-items-center gap-2 mt-2">
                <small class="text-muted">
                    <i class="bi bi-shield-check"></i>
                    Protegido por reCAPTCHA
                </small>
                <small class="text-muted">
                    <a href="https://policies.google.com/privacy" target="_blank" class="text-muted">Privacidade</a>
                    -
                    <a href="https://policies.google.com/terms" target="_blank" class="text-muted">Termos</a>
                </small>
            </div>
        `;
        
        formElement.appendChild(badge);
    }
    
    // Método para verificar score (apenas para referência, verificação real deve ser no backend)
    async getScore(action = 'submit') {
        const token = await this.getToken(action);
        
        // NOTA: Esta verificação deve ser feita no seu backend
        // Aqui é apenas para demonstração
        if (this.config.DEBUG) {
            console.log('🔒 Token para verificação no backend:', token);
        }
        
        return token;
    }
    
    // Método para reset em caso de erro
    reset() {
        if (typeof grecaptcha !== 'undefined' && grecaptcha.reset) {
            grecaptcha.reset();
        }
    }
    
    // Configuração de privacidade
    setPrivacyMode(enabled = true) {
        if (enabled) {
            // Remove badges visuais para conformidade com LGPD
            document.querySelectorAll('.grecaptcha-badge').forEach(badge => {
                badge.style.display = 'none';
            });
        }
    }
}

// Instância global
window.UbatubaRecaptcha = new RecaptchaSystem();

// Auto-attach para formulários com data-recaptcha
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('form[data-recaptcha]').forEach(form => {
        const action = form.getAttribute('data-recaptcha-action') || 'submit';
        
        window.UbatubaRecaptcha.attachToForm(`#${form.id}`, {
            action: action,
            onSuccess: (token) => {
                console.log('✅ reCAPTCHA validado para formulário:', form.id);
            },
            onError: (error) => {
                console.error('❌ Erro reCAPTCHA no formulário:', form.id, error);
                // Mostra erro para o usuário
                const errorDiv = form.querySelector('.recaptcha-error') || document.createElement('div');
                errorDiv.className = 'alert alert-danger mt-2 recaptcha-error';
                errorDiv.textContent = 'Erro de segurança. Tente novamente.';
                if (!form.querySelector('.recaptcha-error')) {
                    form.appendChild(errorDiv);
                }
            }
        });
    });
});

// Export
window.RecaptchaSystem = RecaptchaSystem;
