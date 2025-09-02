// Script para configurar Netlify Identity automaticamente
document.addEventListener('DOMContentLoaded', function() {
    // Aguarda o Netlify Identity carregar
    if (window.netlifyIdentity) {
        // Verifica se já existe um usuário logado
        if (!netlifyIdentity.currentUser()) {
            console.log('Netlify Identity carregado, configurando usuário admin...');
            
            // Tenta fazer login com as credenciais padrão
            setTimeout(() => {
                // Se não conseguir fazer login, tenta criar o usuário
                netlifyIdentity.open('signup');
                
                // Preenche automaticamente o formulário
                setTimeout(() => {
                    const emailInput = document.querySelector('input[type="email"]');
                    const passwordInput = document.querySelector('input[type="password"]');
                    
                    if (emailInput && passwordInput) {
                        emailInput.value = 'angycalm@powerscrews.com';
                        passwordInput.value = 'admin123456';
                        
                        // Simula o clique no botão de signup
                        const signupButton = document.querySelector('button[type="submit"]');
                        if (signupButton) {
                            signupButton.click();
                        }
                    }
                }, 1000);
            }, 2000);
        }
    }
});

// Função para criar usuário admin via API (fallback)
async function createAdminUser() {
    try {
        const response = await fetch('/.netlify/functions/create-admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'angycalm@powerscrews.com',
                password: 'admin123456'
            })
        });
        
        if (response.ok) {
            console.log('Usuário admin criado com sucesso!');
        }
    } catch (error) {
        console.error('Erro ao criar usuário admin:', error);
    }
}
