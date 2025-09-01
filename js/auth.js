/**
 * AUTH & RBAC for Ubatuba Reage
 * - Injects Admin menu (Entrar/Painel/Dashboard/Sair) in offcanvas menu
 * - Controls visibility based on Netlify Identity session and roles
 * - Provides helpers to protect pages (requireRole)
 */

(function () {
  const STATE = {
    user: null,
    roles: [],
  };

  function getBasePath() {
    const p = window.location.pathname;
    if (p.includes('/categoria/') || p.includes('/materia/')) return '../';
    return '';
  }

  function getRoles(user) {
    if (!user) return [];
    const appMeta = user.app_metadata || user.user_metadata || {};
    const roles = appMeta.roles || [];
    return Array.isArray(roles) ? roles : [];
  }

  function isAuthorized(allowed) {
    if (!allowed || allowed.length === 0) return !!STATE.user;
    return STATE.roles.some((r) => allowed.includes(r));
  }

  function ensureAdminMenu() {
    const navList = document.querySelector('nav.menu-navigation ul.list-unstyled');
    if (!navList) return;

    if (navList.querySelector('[data-admin-menu="true"]')) return; // already inserted

    const base = getBasePath();

    const divider = document.createElement('li');
    divider.setAttribute('data-admin-menu', 'true');
    divider.className = 'mt-2';
    divider.style.cssText = 'border-top:1px solid rgba(255,255,255,0.08); padding-top:8px;';

    const label = document.createElement('li');
    label.setAttribute('data-admin-menu', 'true');
    label.className = 'text-white-50 small';
    label.style.cssText = 'padding:6px 0;';
    label.textContent = 'Administração';

    const liLogin = document.createElement('li');
    liLogin.setAttribute('data-admin-menu', 'true');
    liLogin.id = 'menu-login';
    liLogin.innerHTML = `<a href="#" class="nav-link"><i class="bi bi-person me-1"></i> Entrar</a>`;
    liLogin.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.netlifyIdentity) {
        window.netlifyIdentity.open();
      } else {
        alert('Login disponível em produção (Netlify Identity).');
      }
    });

    const liPanel = document.createElement('li');
    liPanel.setAttribute('data-admin-menu', 'true');
    liPanel.id = 'menu-admin';
    liPanel.className = 'd-none';
    liPanel.innerHTML = `<a href="${base}admin/index.html" class="nav-link"><i class="bi bi-speedometer2 me-1"></i> Painel</a>`;

    const liDash = document.createElement('li');
    liDash.setAttribute('data-admin-menu', 'true');
    liDash.id = 'menu-dashboard';
    liDash.className = 'd-none';
    liDash.innerHTML = `<a href="${base}dashboard.html" class="nav-link"><i class="bi bi-layout-text-sidebar-reverse me-1"></i> Dashboard</a>`;

    const liLogout = document.createElement('li');
    liLogout.setAttribute('data-admin-menu', 'true');
    liLogout.id = 'menu-logout';
    liLogout.className = 'd-none';
    liLogout.innerHTML = `<a href="#" class="nav-link"><i class="bi bi-box-arrow-right me-1"></i> Sair</a>`;
    liLogout.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.netlifyIdentity) {
        window.netlifyIdentity.logout();
      }
    });

    navList.appendChild(divider);
    navList.appendChild(label);
    navList.appendChild(liLogin);
    navList.appendChild(liPanel);
    navList.appendChild(liDash);
    navList.appendChild(liLogout);
  }

  function updateMenuVisibility() {
    ensureAdminMenu();
    const elLogin = document.getElementById('menu-login');
    const elPanel = document.getElementById('menu-admin');
    const elDash = document.getElementById('menu-dashboard');
    const elLogout = document.getElementById('menu-logout');

    const logged = !!STATE.user;
    if (elLogin) elLogin.classList.toggle('d-none', logged);
    if (elLogout) elLogout.classList.toggle('d-none', !logged);

    // Panel: qualquer usuário autenticado
    const canPanel = logged;
    if (elPanel) elPanel.classList.toggle('d-none', !canPanel);

    // Dashboard: somente admin e editor
    const canDash = isAuthorized(['admin', 'editor']);
    if (elDash) elDash.classList.toggle('d-none', !canDash);
  }

  function initIdentityHandlers() {
    if (!window.netlifyIdentity) {
      // Identity não disponível (provavelmente fora do Netlify)
      updateMenuVisibility();
      return;
    }

    window.netlifyIdentity.on('init', (user) => {
      STATE.user = user || null;
      STATE.roles = getRoles(STATE.user);
      updateMenuVisibility();
    });

    window.netlifyIdentity.on('login', (user) => {
      STATE.user = user || null;
      STATE.roles = getRoles(STATE.user);
      updateMenuVisibility();
      window.netlifyIdentity.close();
      if (window.UbatubaAnalytics) {
        window.UbatubaAnalytics.trackEvent('auth', 'login_success');
      }
    });

    window.netlifyIdentity.on('logout', () => {
      STATE.user = null;
      STATE.roles = [];
      updateMenuVisibility();
      if (window.UbatubaAnalytics) {
        window.UbatubaAnalytics.trackEvent('auth', 'logout');
      }
    });

    // Trigger init
    window.netlifyIdentity.init({});
  }

  // Public helpers
  window.UbaAuth = {
    isLoggedIn() {
      return !!STATE.user;
    },
    hasRole(role) {
      return STATE.roles.includes(role);
    },
    requireRole(allowed) {
      if (!isAuthorized(allowed)) {
        alert('Acesso restrito. Faça login com uma conta autorizada.');
        const base = getBasePath();
        window.location.href = base + 'index.html';
        return false;
      }
      return true;
    },
  };

  document.addEventListener('DOMContentLoaded', () => {
    ensureAdminMenu();
    initIdentityHandlers();
  });
})();


