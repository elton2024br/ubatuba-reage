import analytics from './analytics.js';

/**
 * NEWSLETTER SYSTEM - UBATUBA REAGE
 * Sistema de inscrição com validação e integração
 */

class NewsletterSystem {
    constructor() {
        this.form = document.getElementById('newsletterForm');
        if (!this.form) return;

        this.emailInput = document.getElementById('newsletterEmail');
        this.submitBtn = document.getElementById('newsletterBtn');
        this.successMessage = document.getElementById('newsletterSuccess');
        this.errorMessage = document.getElementById('newsletterError');
        
        this.isSubmitting = false;
    }
    
    init() {
        if (!this.form) return;
        
        this.setupEventListeners();
        console.log('✅ Sistema de newsletter inicializado');
    }
    
    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmission();
        });
        
        // Real-time email validation
        this.emailInput.addEventListener('input', () => {
            this.validateEmail();
        });
        
        // Clear messages on focus
        this.emailInput.addEventListener('focus', () => {
            this.hideMessages();
            this.clearValidation();
        });
    }
    
    async handleSubmission() {
        if (this.isSubmitting) return;
        
        // Validate email
        if (!this.validateEmail()) {
            return;
        }
        
        const email = this.emailInput.value.trim();
        
        // Show loading state
        this.setLoadingState(true);
        this.hideMessages();
        
        try {
            // Simulate API call - replace with real integration
            const success = await this.submitToNewsletter(email);
            
            if (success) {
                this.showSuccess();
                this.resetForm();
                
                // Analytics tracking
                this.trackSubscription(email);
            } else {
                this.showError('Erro ao processar inscrição. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro na inscrição:', error);
            this.showError('Erro de conexão. Verifique sua internet e tente novamente.');
        } finally {
            this.setLoadingState(false);
        }
    }
    
    async submitToNewsletter(email) {
        // OPÇÃO 1: Integração com Netlify Forms (recomendado para MVP)
        if (this.isNetlifyDeployment()) {
            return await this.submitToNetlify(email);
        }
        
        // OPÇÃO 2: Integração com Formspree
        if (this.hasFormspreeEndpoint()) {
            return await this.submitToFormspree(email);
        }
        
        // OPÇÃO 3: Simulação para desenvolvimento local
        return await this.simulateSubmission(email);
    }
    
    async submitToNetlify(email) {
        try {
            const formData = new FormData();
            formData.append('form-name', 'newsletter');
            formData.append('email', email);
            formData.append('source', 'homepage');
            formData.append('timestamp', new Date().toISOString());
            
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });
            
            return response.ok;
        } catch (error) {
            console.error('Erro Netlify Forms:', error);
            return false;
        }
    }
    
    async submitToFormspree(email) {
        try {
            const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    source: 'newsletter_homepage',
                    timestamp: new Date().toISOString()
                })
            });
            
            return response.ok;
        } catch (error) {
            console.error('Erro Formspree:', error);
            return false;
        }
    }
    
    async simulateSubmission(email) {
        // Simula delay de API
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simula falha ocasional para teste
        if (Math.random() < 0.1) {
            throw new Error('Erro simulado');
        }
        
        // Salva no localStorage para desenvolvimento
        const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
        
        // Verifica se já está inscrito
        if (subscribers.some(sub => sub.email === email)) {
            throw new Error('E-mail já cadastrado');
        }
        
        subscribers.push({
            email: email,
            timestamp: new Date().toISOString(),
            source: 'homepage'
        });
        
        localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
        
        console.log('📧 Newsletter simulada:', email);
        return true;
    }
    
    validateEmail() {
        const email = this.emailInput.value.trim();
        
        if (!email) {
            this.showFieldError('E-mail é obrigatório');
            return false;
        }
        
        if (!this.isValidEmail(email)) {
            this.showFieldError('Digite um e-mail válido');
            return false;
        }
        
        this.clearValidation();
        return true;
    }
    
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    showFieldError(message) {
        this.emailInput.classList.add('is-invalid');
        const feedback = this.emailInput.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = message;
        }
    }
    
    clearValidation() {
        this.emailInput.classList.remove('is-invalid');
        const feedback = this.emailInput.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = '';
        }
    }
    
    setLoadingState(isLoading) {
        this.isSubmitting = isLoading;
        this.submitBtn.disabled = isLoading;
        
        const btnText = this.submitBtn.querySelector('.btn-text');
        const btnLoading = this.submitBtn.querySelector('.btn-loading');
        
        if (isLoading) {
            btnText.classList.add('d-none');
            btnLoading.classList.remove('d-none');
        } else {
            btnText.classList.remove('d-none');
            btnLoading.classList.add('d-none');
        }
    }
    
    showSuccess() {
        this.successMessage.style.display = 'block';
        this.errorMessage.style.display = 'none';
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            this.successMessage.style.display = 'none';
        }, 10000);
    }
    
    showError(message) {
        this.errorMessage.style.display = 'block';
        this.successMessage.style.display = 'none';
        
        const errorSpan = this.errorMessage.querySelector('.error-message');
        if (errorSpan) {
            errorSpan.textContent = message;
        }
        
        // Auto-hide after 8 seconds
        setTimeout(() => {
            this.errorMessage.style.display = 'none';
        }, 8000);
    }
    
    hideMessages() {
        this.successMessage.style.display = 'none';
        this.errorMessage.style.display = 'none';
    }
    
    resetForm() {
        this.emailInput.value = '';
        this.clearValidation();
    }
    
    trackSubscription(email) {
        // Google Analytics
        analytics.trackEvent('submit', 'newsletter_signup', {
            'method': 'homepage_form',
            'value': 1
        });
        
        // Facebook Pixel (se configurado) - genérico para o nosso sistema de analytics
        analytics.trackEvent('submit', 'fb_pixel_subscribe', {
            'source': 'newsletter'
        });
        
        console.log('📊 Newsletter signup tracked:', email);
    }
    
    isNetlifyDeployment() {
        return window.location.hostname.includes('netlify');
    }
    
    hasFormspreeEndpoint() {
        return false; // Configure como true e adicione o endpoint se usar Formspree
    }
}

export default NewsletterSystem;
