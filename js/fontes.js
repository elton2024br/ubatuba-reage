/**
 * SISTEMA DE FONTES - UBATUBA REAGE
 * Formulário de denúncias com validação e segurança
 */

class FontesSystem {
    constructor() {
        this.form = document.getElementById('fontesForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.successMessage = document.getElementById('successMessage');
        this.errorMessage = document.getElementById('errorMessage');
        
        // Form fields
        this.tipoProblema = document.getElementById('tipoProblema');
        this.localizacao = document.getElementById('localizacao');
        this.assunto = document.getElementById('assunto');
        this.descricao = document.getElementById('descricao');
        this.evidencias = document.getElementById('evidencias');
        this.anonimo = document.getElementById('anonimo');
        this.dadosContato = document.getElementById('dadosContato');
        this.termos = document.getElementById('termos');
        
        // Character counters
        this.assuntoCount = document.getElementById('assuntoCount');
        this.descricaoCount = document.getElementById('descricaoCount');
        
        this.isSubmitting = false;
        
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.setupEventListeners();
        this.updateCharacterCounters();
        console.log('✅ Sistema de fontes inicializado');
    }
    
    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmission();
        });
        
        // Anonymous toggle
        this.anonimo.addEventListener('change', () => {
            this.toggleContactFields();
        });
        
        // Character counters
        this.assunto.addEventListener('input', () => {
            this.updateCharacterCounters();
        });
        
        this.descricao.addEventListener('input', () => {
            this.updateCharacterCounters();
        });
        
        // Real-time validation
        [this.tipoProblema, this.localizacao, this.assunto, this.descricao].forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
            
            field.addEventListener('input', () => {
                this.clearFieldError(field);
            });
        });
        
        // Clear messages on form interaction
        this.form.addEventListener('input', () => {
            this.hideMessages();
        });
    }
    
    toggleContactFields() {
        if (this.anonimo.checked) {
            this.dadosContato.style.display = 'none';
            // Clear contact fields when anonymous
            this.clearContactFields();
        } else {
            this.dadosContato.style.display = 'block';
        }
    }
    
    clearContactFields() {
        document.getElementById('nomeContato').value = '';
        document.getElementById('emailContato').value = '';
        document.getElementById('telefoneContato').value = '';
    }
    
    updateCharacterCounters() {
        this.assuntoCount.textContent = this.assunto.value.length;
        this.descricaoCount.textContent = this.descricao.value.length;
        
        // Update colors based on limits
        const assuntoLimit = 100;
        const descricaoLimit = 2000;
        
        this.assuntoCount.className = this.assunto.value.length > assuntoLimit * 0.9 ? 'text-warning' : 'text-white-50';
        this.descricaoCount.className = this.descricao.value.length > descricaoLimit * 0.9 ? 'text-warning' : 'text-white-50';
    }
    
    async handleSubmission() {
        if (this.isSubmitting) return;
        
        // Validate form
        if (!this.validateForm()) {
            return;
        }
        
        // Collect form data
        const formData = this.collectFormData();
        
        // Show loading state
        this.setLoadingState(true);
        this.hideMessages();
        
        try {
            const success = await this.submitDenuncia(formData);
            
            if (success) {
                this.showSuccess();
                this.resetForm();
                this.trackSubmission(formData);
            } else {
                this.showError('Erro ao processar denúncia. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro no envio:', error);
            this.showError('Erro de conexão. Verifique sua internet e tente novamente.');
        } finally {
            this.setLoadingState(false);
        }
    }
    
    validateForm() {
        let isValid = true;
        
        // Required fields validation
        const requiredFields = [
            { field: this.tipoProblema, message: 'Selecione o tipo de problema' },
            { field: this.localizacao, message: 'Informe a localização' },
            { field: this.assunto, message: 'Informe o assunto' },
            { field: this.descricao, message: 'Descreva o problema' }
        ];
        
        requiredFields.forEach(({ field, message }) => {
            if (!field.value.trim()) {
                this.showFieldError(field, message);
                isValid = false;
            }
        });
        
        // Email validation (if provided)
        const emailContato = document.getElementById('emailContato');
        if (!this.anonimo.checked && emailContato.value) {
            if (!this.isValidEmail(emailContato.value)) {
                this.showFieldError(emailContato, 'E-mail inválido');
                isValid = false;
            }
        }
        
        // Terms acceptance
        if (!this.termos.checked) {
            this.showFieldError(this.termos, 'Você deve aceitar os termos');
            isValid = false;
        }
        
        return isValid;
    }
    
    validateField(field) {
        if (field.hasAttribute('required') && !field.value.trim()) {
            this.showFieldError(field, 'Este campo é obrigatório');
            return false;
        }
        
        if (field.type === 'email' && field.value && !this.isValidEmail(field.value)) {
            this.showFieldError(field, 'E-mail inválido');
            return false;
        }
        
        this.clearFieldError(field);
        return true;
    }
    
    collectFormData() {
        const urgenciaElement = document.querySelector('input[name="urgencia"]:checked');
        
        const data = {
            tipo: this.tipoProblema.value,
            localizacao: this.localizacao.value.trim(),
            assunto: this.assunto.value.trim(),
            descricao: this.descricao.value.trim(),
            evidencias: this.evidencias.value.trim(),
            urgencia: urgenciaElement ? urgenciaElement.value : 'baixa',
            anonimo: this.anonimo.checked,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };
        
        // Add contact data if not anonymous
        if (!this.anonimo.checked) {
            data.contato = {
                nome: document.getElementById('nomeContato').value.trim(),
                email: document.getElementById('emailContato').value.trim(),
                telefone: document.getElementById('telefoneContato').value.trim()
            };
        }
        
        return data;
    }
    
    async submitDenuncia(formData) {
        // OPÇÃO 1: Integração com Netlify Forms
        if (this.isNetlifyDeployment()) {
            return await this.submitToNetlify(formData);
        }
        
        // OPÇÃO 2: Integração com Formspree
        if (this.hasFormspreeEndpoint()) {
            return await this.submitToFormspree(formData);
        }
        
        // OPÇÃO 3: Simulação para desenvolvimento
        return await this.simulateSubmission(formData);
    }
    
    async submitToNetlify(formData) {
        try {
            const netlifyData = new FormData();
            netlifyData.append('form-name', 'fontes');
            
            // Flatten form data for Netlify
            Object.keys(formData).forEach(key => {
                if (typeof formData[key] === 'object') {
                    netlifyData.append(key, JSON.stringify(formData[key]));
                } else {
                    netlifyData.append(key, formData[key]);
                }
            });
            
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(netlifyData).toString()
            });
            
            return response.ok;
        } catch (error) {
            console.error('Erro Netlify Forms:', error);
            return false;
        }
    }
    
    async submitToFormspree(formData) {
        try {
            const response = await fetch('https://formspree.io/f/YOUR_FONTES_FORM_ID', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            return response.ok;
        } catch (error) {
            console.error('Erro Formspree:', error);
            return false;
        }
    }
    
    async simulateSubmission(formData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate occasional failure for testing
        if (Math.random() < 0.05) {
            throw new Error('Erro simulado');
        }
        
        // Save to localStorage for development
        const denuncias = JSON.parse(localStorage.getItem('denuncias_ubatuba') || '[]');
        
        const denuncia = {
            id: Date.now(),
            ...formData,
            status: 'recebida'
        };
        
        denuncias.push(denuncia);
        localStorage.setItem('denuncias_ubatuba', JSON.stringify(denuncias));
        
        console.log('🚨 Denúncia simulada:', denuncia);
        return true;
    }
    
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    showFieldError(field, message) {
        field.classList.add('is-invalid');
        
        // Create or update error message
        let errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            field.parentNode.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
    }
    
    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.textContent = '';
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
        
        // Scroll to message
        this.successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-hide after 15 seconds
        setTimeout(() => {
            this.successMessage.style.display = 'none';
        }, 15000);
    }
    
    showError(message) {
        this.errorMessage.style.display = 'block';
        this.successMessage.style.display = 'none';
        
        const errorText = this.errorMessage.querySelector('.error-text');
        if (errorText) {
            errorText.textContent = message;
        }
        
        // Scroll to message
        this.errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            this.errorMessage.style.display = 'none';
        }, 10000);
    }
    
    hideMessages() {
        this.successMessage.style.display = 'none';
        this.errorMessage.style.display = 'none';
    }
    
    resetForm() {
        this.form.reset();
        this.updateCharacterCounters();
        this.toggleContactFields(); // Reset contact visibility
        
        // Clear all validation states
        this.form.querySelectorAll('.is-invalid').forEach(field => {
            field.classList.remove('is-invalid');
        });
    }
    
    trackSubmission(formData) {
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'denuncia_submitted', {
                'tipo': formData.tipo,
                'urgencia': formData.urgencia,
                'anonimo': formData.anonimo,
                'value': 1
            });
        }
        
        console.log('📊 Denúncia tracked:', {
            tipo: formData.tipo,
            urgencia: formData.urgencia,
            anonimo: formData.anonimo
        });
    }
    
    isNetlifyDeployment() {
        return window.location.hostname.includes('netlify');
    }
    
    hasFormspreeEndpoint() {
        return false; // Configure como true e adicione o endpoint se usar Formspree
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new FontesSystem();
});

// Export for external use
window.FontesSystem = FontesSystem;
