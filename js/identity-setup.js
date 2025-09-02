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
        console.log('Tentando fazer login...');
        
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
        console.log('Abrindo formulário de cadastro...');
        
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
    console.log('Preenchendo formulário...');
    
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    
    if (emailInput && passwordInput) {
        emailInput.value = 'angycalm@powerscrews.com';
        passwordInput.value = 'admin123456';
        
        console.log('Formulário preenchido:', {
            email: emailInput.value,
            password: passwordInput.value
        });
        
        // Simula o clique no botão de signup
        const signupButton = document.querySelector('button[type="submit"]');
        if (signupButton) {
            console.log('Clicando no botão de signup...');
            signupButton.click();
        } else {
            console.log('Botão de signup não encontrado');
        }
    } else {
        console.log('Campos de formulário não encontrados');
    }
}

// Listener para eventos do Netlify Identity
if (window.netlifyIdentity) {
    netlifyIdentity.on('signup', user => {
        console.log('Usuário criado:', user);
        if (user) {
            console.log('✅ Usuário admin criado com sucesso!');
            // Tenta fazer login automaticamente
            setTimeout(() => {
                tryLogin();
            }, 2000);
        }
    });
    
    netlifyIdentity.on('login', user => {
        console.log('✅ Usuário logado com sucesso:', user);
        if (user) {
            console.log('🎉 Login completo! Redirecionando para admin...');
            // Redireciona para o painel admin
            setTimeout(() => {
                window.location.href = '/admin/';
            }, 1000);
        }
    });
    
    netlifyIdentity.on('error', error => {
        console.error('❌ Erro do Netlify Identity:', error);
        
        // Se o erro for de email não confirmado, tenta criar usuário
        if (error && error.message && error.message.includes('Email not confirmed')) {
            console.log('🔄 Email não confirmado, tentando criar usuário...');
            setTimeout(() => {
                createUser();
            }, 2000);
        }
    });
    
    netlifyIdentity.on('init', user => {
        console.log('Netlify Identity inicializado:', user);
        if (user) {
            console.log('✅ Usuário já logado:', user.email);
        } else {
            console.log('🔒 Nenhum usuário logado');
        }
    });
}
