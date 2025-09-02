// Script para configurar Netlify Identity automaticamente

// Lista de emails autorizados como administradores (global)
if (typeof window.ADMIN_EMAILS === 'undefined') {
    window.ADMIN_EMAILS = [
        'angycalm@powerscrews.com',
        'instant32@powerscrews.com'
    ];
}

// Função para verificar se um email é de administrador
function isAdminEmail(email) {
    return window.ADMIN_EMAILS.includes(email.toLowerCase());
}

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
    
    // Proteger páginas admin
    protectAdminPages();
});

// Função para proteger páginas admin
function protectAdminPages() {
    const isAdminPage = window.location.pathname.includes('/admin') || 
                       window.location.pathname.includes('dashboard.html');
    
    if (isAdminPage) {
        console.log('🔒 Página admin detectada, verificando permissões...');
        
        if (window.netlifyIdentity) {
            const user = netlifyIdentity.currentUser();
            if (!user) {
                console.log('❌ Usuário não logado, redirecionando para login...');
                netlifyIdentity.open('login');
                return;
            }
            
            // Verifica se o usuário tem role admin
            checkUserRole(user);
        }
    }
}

// Função para verificar role do usuário
async function checkUserRole(user) {
    try {
        // Busca informações detalhadas do usuário
        const response = await fetch('/.netlify/identity/user', {
            headers: {
                'Authorization': `Bearer ${user.token.access_token}`
            }
        });
        
        if (response.ok) {
            const userData = await response.json();
            console.log('👤 Dados do usuário:', userData);
            
            // Verifica se tem role admin ou se é email autorizado
            if (userData.app_metadata && userData.app_metadata.roles && userData.app_metadata.roles.includes('admin')) {
                console.log('✅ Usuário é admin por role, acesso permitido!');
                showAdminContent();
            } else if (isAdminEmail(user.email)) {
                console.log('✅ Email admin autorizado detectado, acesso permitido!');
                showAdminContent();
            } else {
                console.log('❌ Usuário não é admin, acesso negado!');
                denyAccess();
            }
        } else {
            // Fallback: verifica se é email admin autorizado
            if (isAdminEmail(user.email)) {
                console.log('✅ Email admin autorizado detectado, acesso permitido!');
                showAdminContent();
            } else {
                console.log('❌ Usuário não autorizado, acesso negado!');
                denyAccess();
            }
        }
    } catch (error) {
        console.error('Erro ao verificar role:', error);
        // Fallback: verifica se é email admin autorizado
        if (isAdminEmail(user.email)) {
            console.log('✅ Email admin autorizado detectado, acesso permitido!');
            showAdminContent();
        } else {
            console.log('❌ Usuário não autorizado, acesso negado!');
            denyAccess();
        }
    }
}

// Função para mostrar conteúdo admin
function showAdminContent() {
    console.log('🎉 Conteúdo admin liberado!');
    // Remove qualquer bloqueio de conteúdo
    const adminBlocks = document.querySelectorAll('.admin-block');
    adminBlocks.forEach(block => block.style.display = 'block');
}

// Função para negar acesso
function denyAccess() {
    console.log('🚫 Acesso negado ao painel admin!');
    
    // Mostra mensagem de erro
    const body = document.body;
    body.innerHTML = `
        <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
            <h1 style="color: #dc3545;">🚫 Acesso Negado</h1>
            <p>Você não tem permissão para acessar esta página.</p>
            <p>Apenas administradores podem acessar o painel.</p>
            <p><strong>Emails autorizados:</strong></p>
            <ul style="list-style: none; padding: 0;">
                ${window.ADMIN_EMAILS.map(email => `<li style="margin: 5px 0; color: #666;">• ${email}</li>`).join('')}
            </ul>
            <button onclick="window.history.back()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Voltar
            </button>
        </div>
    `;
}

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
        
        // Aguarda o modal carregar e tenta preencher múltiplas vezes
        let attempts = 0;
        const maxAttempts = 10;
        
        const tryFillForm = () => {
            attempts++;
            console.log(`Tentativa ${attempts} de preencher formulário...`);
            
            if (fillSignupForm()) {
                console.log('✅ Formulário preenchido com sucesso!');
                return;
            }
            
            if (attempts < maxAttempts) {
                console.log(`⏳ Aguardando modal carregar... (${attempts}/${maxAttempts})`);
                setTimeout(tryFillForm, 500);
            } else {
                console.log('❌ Não foi possível preencher o formulário após várias tentativas');
            }
        };
        
        setTimeout(tryFillForm, 1000);
        
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
            return true;
        } else {
            console.log('Botão de signup não encontrado');
            return false;
        }
    } else {
        console.log('Campos de formulário não encontrados');
        return false;
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
            console.log('🎉 Login completo!');
            
            // Se estiver em página admin, verifica permissões
            if (window.location.pathname.includes('/admin') || 
                window.location.pathname.includes('dashboard.html')) {
                checkUserRole(user);
            } else {
                // Redireciona para o painel admin
                setTimeout(() => {
                    window.location.href = '/admin/';
                }, 1000);
            }
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
            
            // Se estiver em página admin, verifica permissões
            if (window.location.pathname.includes('/admin') || 
                window.location.pathname.includes('dashboard.html')) {
                checkUserRole(user);
            }
        } else {
            console.log('🔒 Nenhum usuário logado');
        }
    });
}
