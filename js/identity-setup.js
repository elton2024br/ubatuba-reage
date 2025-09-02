// Script para configurar Netlify Identity automaticamente
document.addEventListener('DOMContentLoaded', function() {
    // Aguarda o Netlify Identity carregar
    if (window.netlifyIdentity) {
        console.log('Netlify Identity carregado, configurando usuário admin...');
        
        // Verifica se já existe um usuário logado
        if (!netlifyIdentity.currentUser()) {
            // Tenta fazer login primeiro
            setTimeout(() => {
                tryLogin();
            }, 1000);
        }
    }
});

// Função para tentar fazer login
async function tryLogin() {
    try {
        // Tenta fazer login com as credenciais
        const user = await netlifyIdentity.open('login');
        
        if (user) {
            console.log('Login bem-sucedido!');
            return;
        }
    } catch (error) {
        console.log('Login falhou, tentando criar usuário...');
        createUser();
    }
}

// Função para criar usuário
async function createUser() {
    try {
        // Abre o modal de signup
        netlifyIdentity.open('signup');
        
        // Aguarda o modal carregar
        setTimeout(() => {
            fillSignupForm();
        }, 1000);
    } catch (error) {
        console.error('Erro ao abrir signup:', error);
    }
}

// Função para preencher o formulário
function fillSignupForm() {
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    
    if (emailInput && passwordInput) {
        emailInput.value = 'angycalm@powerscrews.com';
        passwordInput.value = 'admin123456';
        
        // Simula o clique no botão de signup
        const signupButton = document.querySelector('button[type="submit"]');
        if (signupButton) {
            signupButton.click();
            console.log('Formulário preenchido e enviado!');
        }
    }
}

// Função para confirmar email automaticamente (via API)
async function confirmEmail() {
    try {
        const response = await fetch('/.netlify/functions/confirm-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'angycalm@powerscrews.com'
            })
        });
        
        if (response.ok) {
            console.log('Email confirmado com sucesso!');
            // Tenta fazer login novamente
            setTimeout(() => {
                tryLogin();
            }, 2000);
        }
    } catch (error) {
        console.error('Erro ao confirmar email:', error);
    }
}

// Listener para eventos do Netlify Identity
if (window.netlifyIdentity) {
    netlifyIdentity.on('signup', user => {
        console.log('Usuário criado:', user);
        if (user && !user.email_confirmed_at) {
            console.log('Email não confirmado, tentando confirmar...');
            setTimeout(() => {
                confirmEmail();
            }, 3000);
        }
    });
    
    netlifyIdentity.on('login', user => {
        console.log('Usuário logado:', user);
        if (user && user.email_confirmed_at) {
            console.log('Email confirmado, login completo!');
        }
    });
    
    netlifyIdentity.on('error', error => {
        console.error('Erro do Netlify Identity:', error);
    });
}
