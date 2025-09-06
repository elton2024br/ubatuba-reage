/**
 * DEVELOPMENT & SETUP TOOLS for Netlify Identity
 * - Auto-login/signup for admins
 * - Page protection for admin areas
 * This module should only be loaded in a development environment.
 */

// Lista de emails autorizados como administradores (global)
const ADMIN_EMAILS = [
    'angycalm@powerscrews.com',
    'instant32@powerscrews.com'
];

function isAdminEmail(email) {
    return ADMIN_EMAILS.includes(email.toLowerCase());
}

let permissionsChecked = false;

function protectAdminPages() {
    const isAdminPage = window.location.pathname.includes('/admin') ||
                       window.location.pathname.includes('dashboard.html');

    if (isAdminPage && !permissionsChecked) {
        console.log('🔒 Página admin detectada, verificando permissões...');

        if (window.netlifyIdentity) {
            const user = netlifyIdentity.currentUser();
            if (!user) {
                console.log('❌ Usuário não logado, redirecionando para login...');
                netlifyIdentity.open('login');
                return;
            }
            checkUserRole(user);
        }
    }
}

async function checkUserRole(user) {
    if (permissionsChecked) return;

    try {
        const response = await fetch('/.netlify/identity/user', {
            headers: { 'Authorization': `Bearer ${user.token.access_token}` }
        });

        let hasAccess = false;
        if (response.ok) {
            const userData = await response.json();
            if (userData.app_metadata?.roles?.includes('admin')) {
                hasAccess = true;
            }
        }

        if (!hasAccess && isAdminEmail(user.email)) {
            hasAccess = true;
        }

        if (hasAccess) {
            console.log('✅ Acesso de admin permitido!');
            showAdminContent();
        } else {
            console.log('❌ Usuário não é admin, acesso negado!');
            denyAccess();
        }
    } catch (error) {
        console.error('Erro ao verificar role:', error);
        if (isAdminEmail(user.email)) {
            showAdminContent();
        } else {
            denyAccess();
        }
    } finally {
        permissionsChecked = true;
    }
}

function showAdminContent() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) loadingScreen.style.display = 'none';

    const adminContainer = document.getElementById('adminContainer');
    if (adminContainer) adminContainer.style.display = 'flex';
}

function denyAccess() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) loadingScreen.style.display = 'none';

    document.body.innerHTML = `
        <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
            <h1 style="color: #dc3545;">🚫 Acesso Negado</h1>
            <p>Você não tem permissão para acessar esta página.</p>
            <button onclick="window.history.back()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Voltar
            </button>
        </div>
    `;
}

async function tryLogin() {
    try {
        await netlifyIdentity.open('login');
    } catch (error) {
        console.log('Login falhou, tentando criar usuário...');
        createUser();
    }
}

function createUser() {
    netlifyIdentity.open('signup');
}

function setupEventListeners() {
    if (!window.netlifyIdentity) return;

    netlifyIdentity.on('login', user => {
        console.log('✅ Usuário logado:', user.email);
        protectAdminPages();
    });

    netlifyIdentity.on('init', user => {
        console.log('Netlify Identity inicializado.');
        if (user) {
            console.log('✅ Usuário já logado:', user.email);
        } else {
            console.log('🔒 Nenhum usuário logado');
        }
        protectAdminPages();
    });
}

export function initDevTools() {
    if (!window.netlifyIdentity) {
        console.log("Netlify Identity widget não encontrado. Ferramentas de dev desabilitadas.");
        return;
    }

    console.log('🛠️ Inicializando ferramentas de desenvolvimento do Identity...');
    setupEventListeners();

    // Auto-login se não houver usuário
    setTimeout(() => {
        if (!netlifyIdentity.currentUser()) {
            tryLogin();
        }
    }, 1000);
}
