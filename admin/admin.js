// Admin Panel JavaScript

// Função para verificar se um email é de administrador (usa variável global)
function isAdminEmail(email) {
    return window.ADMIN_EMAILS && window.ADMIN_EMAILS.includes(email.toLowerCase());
}

class AdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.charts = {};
        this.data = {
            articles: [],
            users: [],
            analytics: {}
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadDashboard();
        this.setupCharts();
        this.loadMockData();
        this.hideLoadingScreen();
    }
    
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.navigateToSection(section);
            });
        });
        
        // Mobile sidebar toggle
        document.getElementById('openSidebar')?.addEventListener('click', () => {
            document.getElementById('adminSidebar').classList.add('show');
        });
        
        document.getElementById('closeSidebar')?.addEventListener('click', () => {
            document.getElementById('adminSidebar').classList.remove('show');
        });
        
        // Action buttons
        document.getElementById('newArticleBtn')?.addEventListener('click', () => {
            this.showNewArticleModal();
        });
        
        document.getElementById('inviteUserBtn')?.addEventListener('click', () => {
            this.showInviteUserModal();
        });
        
        // Logout buttons - CORRIGIDO
        const logoutButtons = document.querySelectorAll('#logoutBtn, #headerLogoutBtn');
        logoutButtons.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
            }
        });
        
        // Profile and settings dropdown (robust event delegation)
        document.addEventListener('click', (e) => {
            const actionEl = e.target.closest && e.target.closest('[data-action]');
            if (!actionEl) return;
            const action = actionEl.getAttribute('data-action');
            if (action === 'profile') {
                e.preventDefault();
                this.showProfileModal();
            } else if (action === 'settings') {
                e.preventDefault();
                this.navigateToSection('settings');
            }
        });
        
        // Form submissions
        document.getElementById('newArticleForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.createArticle();
        });
        
        document.getElementById('inviteUserForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.inviteUser();
        });
        
        // Settings forms
        document.getElementById('generalSettingsForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveGeneralSettings();
        });
        
        document.getElementById('emailSettingsForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEmailSettings();
        });
        
        // Analytics date picker
        document.getElementById('updateAnalytics')?.addEventListener('click', () => {
            this.updateAnalytics();
        });
        
        // Chart period buttons
        document.querySelectorAll('.chart-actions .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.chart-actions .btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateViewsChart(e.target.getAttribute('data-period'));
            });
        });
        
        // Notifications button
        document.getElementById('notificationsBtn')?.addEventListener('click', () => {
            this.showNotifications();
        });
    }
    
    navigateToSection(section) {
        // Update active nav link
        document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');
        
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(sectionEl => {
            sectionEl.classList.remove('active');
        });
        
        // Show target section
        document.getElementById(`${section}Section`).classList.add('active');
        
        // Update page title
        document.getElementById('pageTitle').textContent = this.getSectionTitle(section);
        
        // Load section data
        this.loadSectionData(section);
        
        this.currentSection = section;
    }
    
    getSectionTitle(section) {
        const titles = {
            dashboard: 'Dashboard',
            content: 'Gerenciamento de Conteúdo',
            users: 'Gestão de Usuários',
            analytics: 'Analytics e Métricas',
            settings: 'Configurações do Sistema'
        };
        return titles[section] || 'Dashboard';
    }
    
    loadSectionData(section) {
        switch(section) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'content':
                this.loadContent();
                break;
            case 'users':
                this.loadUsers();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }
    
    loadDashboard() {
        this.updateStats();
        this.loadRecentActivity();
        this.setupCharts(); // Recarrega os gráficos se necessário
    }
    
    loadContent() {
        this.loadArticles();
    }
    
    loadUsers() {
        this.loadUsersList();
    }
    
    loadAnalytics() {
        this.loadAnalyticsData();
    }
    
    loadSettings() {
        this.loadSettingsData();
    }
    
    updateStats() {
        // Update stat numbers with animation
        const stats = {
            totalArticles: this.data.articles.length,
            totalViews: this.data.articles.reduce((sum, article) => sum + article.views, 0),
            totalUsers: this.data.users.length,
            totalNewsletters: Math.floor(Math.random() * 1000) + 500
        };
        
        Object.keys(stats).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                this.animateNumber(element, 0, stats[key], 1000);
            }
        });
    }
    
    animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (end - start) * progress);
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }
    
    loadRecentActivity() {
        const activityList = document.getElementById('activityList');
        if (!activityList) return;
        
        const activities = [
            { type: 'article', title: 'Novo artigo publicado', time: '2 horas atrás', icon: 'bi-file-text', color: 'bg-primary' },
            { type: 'user', title: 'Usuário se cadastrou', time: '4 horas atrás', icon: 'bi-person-plus', color: 'bg-success' },
            { type: 'comment', title: 'Novo comentário', time: '6 horas atrás', icon: 'bi-chat-dots', color: 'bg-info' },
            { type: 'view', title: 'Pico de visualizações', time: '1 dia atrás', icon: 'bi-eye', color: 'bg-warning' }
        ];
        
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.color}">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <h6 class="activity-title">${activity.title}</h6>
                    <p class="activity-time">${activity.time}</p>
                </div>
            </div>
        `).join('');
    }
    
    loadArticles() {
        const tbody = document.getElementById('articlesTableBody');
        if (!tbody) return;
        
        const articles = this.data.articles.map(article => `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${article.image}" alt="${article.title}" class="rounded me-3" width="50" height="50">
                        <div>
                            <h6 class="mb-0">${article.title}</h6>
                            <small class="text-muted">${article.excerpt}</small>
                        </div>
                    </div>
                </td>
                <td><span class="badge bg-secondary">${article.category}</span></td>
                <td>${article.author}</td>
                <td><span class="status-badge status-${article.status}">${article.status}</span></td>
                <td>${new Date(article.date).toLocaleDateString('pt-BR')}</td>
                <td>${article.views.toLocaleString()}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-outline-primary" onclick="adminPanel.editArticle('${article.id}')">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="adminPanel.deleteArticle('${article.id}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        tbody.innerHTML = articles;
    }
    
    loadUsersList() {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;
        
        const users = this.data.users.map(user => `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="user-avatar me-3">
                            <i class="bi bi-person-circle"></i>
                        </div>
                        <div>
                            <h6 class="mb-0">${user.name}</h6>
                            <small class="text-muted">${user.email}</small>
                        </div>
                    </div>
                </td>
                <td>${user.email}</td>
                <td><span class="badge bg-${user.role === 'admin' ? 'danger' : 'secondary'}">${user.role}</span></td>
                <td><span class="status-badge status-${user.status}">${user.status}</span></td>
                <td>${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('pt-BR') : 'Nunca'}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-outline-primary" onclick="adminPanel.editUser('${user.id}')">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-warning" onclick="adminPanel.changeUserRole('${user.id}')">
                            <i class="bi bi-shield"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        tbody.innerHTML = users;
    }
    
    loadAnalyticsData() {
        this.updateDeviceChart();
        this.updateSourceChart();
        this.updatePerformanceChart();
    }
    
    loadSettingsData() {
        // Load current settings
        document.getElementById('siteName').value = 'Ubatuba Reage';
        document.getElementById('siteUrl').value = 'https://ubatubareage.com.br';
        document.getElementById('contactEmail').value = 'contato@ubatubareage.com.br';
    }
    
    setupCharts() {
        // Views Chart
        const viewsCtx = document.getElementById('viewsChart');
        if (viewsCtx) {
            // Destruir gráfico existente se houver
            if (this.charts.views) {
                this.charts.views.destroy();
            }
            
            this.charts.views = new Chart(viewsCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                    datasets: [{
                        label: 'Visualizações',
                        data: [1200, 1900, 3000, 5000, 2000, 3000],
                        borderColor: '#0d6efd',
                        backgroundColor: 'rgba(13, 110, 253, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }
        
        // Categories Chart
        const categoriesCtx = document.getElementById('categoriesChart');
        if (categoriesCtx) {
            // Destruir gráfico existente se houver
            if (this.charts.categories) {
                this.charts.categories.destroy();
            }
            
            this.charts.categories = new Chart(categoriesCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Cidade', 'Meio Ambiente', 'Cultura', 'Praias', 'Infraestrutura'],
                    datasets: [{
                        data: [30, 25, 20, 15, 10],
                        backgroundColor: [
                            '#0d6efd',
                            '#198754',
                            '#ffc107',
                            '#dc3545',
                            '#6c757d'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    }
    
    updateViewsChart(period) {
        if (!this.charts.views) return;
        
        const data = this.getViewsData(period);
        this.charts.views.data.labels = data.labels;
        this.charts.views.data.datasets[0].data = data.values;
        this.charts.views.update();
    }
    
    getViewsData(period) {
        const periods = {
            7: { labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'], values: [1200, 1900, 3000, 5000, 2000, 3000, 4000] },
            30: { labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'], values: [1200, 1900, 3000, 5000, 2000, 3000] },
            90: { labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'], values: [1200, 1900, 3000, 5000, 2000, 3000] }
        };
        
        return periods[period] || periods[30];
    }
    
    updateDeviceChart() {
        const deviceCtx = document.getElementById('deviceChart');
        if (!deviceCtx) return;
        
        new Chart(deviceCtx, {
            type: 'doughnut',
            data: {
                labels: ['Desktop', 'Mobile', 'Tablet'],
                datasets: [{
                    data: [60, 35, 5],
                    backgroundColor: ['#0d6efd', '#198754', '#ffc107']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    updateSourceChart() {
        const sourceCtx = document.getElementById('sourceChart');
        if (!sourceCtx) return;
        
        new Chart(sourceCtx, {
            type: 'bar',
            data: {
                labels: ['Google', 'Facebook', 'Twitter', 'Direto', 'Outros'],
                datasets: [{
                    label: 'Visitas',
                    data: [45, 25, 15, 10, 5],
                    backgroundColor: '#0d6efd'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    updatePerformanceChart() {
        const performanceCtx = document.getElementById('performanceChart');
        if (!performanceCtx) return;
        
        new Chart(performanceCtx, {
            type: 'line',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                datasets: [{
                    label: 'Usuários Online',
                    data: [50, 30, 80, 120, 150, 100],
                    borderColor: '#198754',
                    backgroundColor: 'rgba(25, 135, 84, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    loadMockData() {
        // Mock articles data
        this.data.articles = [
            {
                id: '1',
                title: 'Prefeitura de Ubatuba notifica Google e Meta por fake news',
                excerpt: 'Administração municipal pediu a remoção de publicações com informações não comprovadas...',
                category: 'cidade',
                author: 'Redação Ubatuba Reage',
                status: 'published',
                date: '2025-01-15',
                views: 15420,
                image: 'https://picsum.photos/50/50?random=1'
            },
            {
                id: '2',
                title: 'Ubatuba lança licitação de quase R$ 2 milhões para pavimentação',
                excerpt: 'Edital de concorrência eletrônica busca contratar empresa de engenharia...',
                category: 'infraestrutura',
                author: 'Ana Silva',
                status: 'draft',
                date: '2025-01-14',
                views: 8920,
                image: 'https://picsum.photos/50/50?random=2'
            },
            {
                id: '3',
                title: 'Ondas azuis: moradores registram fenômeno de bioluminescência',
                excerpt: 'Fenômeno natural raro iluminou a arrebentação em março...',
                category: 'meio-ambiente',
                author: 'Carlos Santos',
                status: 'pending',
                date: '2025-01-13',
                views: 12340,
                image: 'https://picsum.photos/50/50?random=3'
            }
        ];
        
        // Mock users data
        this.data.users = [
            {
                id: '1',
                name: 'Admin Principal',
                email: 'angycalm@powerscrews.com',
                role: 'admin',
                status: 'active',
                lastLogin: '2025-01-15T10:30:00Z'
            },
            {
                id: '2',
                name: 'Editor Chefe',
                email: 'instant32@powerscrews.com',
                role: 'admin',
                status: 'active',
                lastLogin: '2025-01-15T09:15:00Z'
            },
            {
                id: '3',
                name: 'Repórter',
                email: 'reporter@ubatubareage.com.br',
                role: 'user',
                status: 'active',
                lastLogin: '2025-01-14T16:45:00Z'
            }
        ];
    }
    
    showNewArticleModal() {
        console.log('🔍 Tentando abrir modal de novo artigo...');
        
        const modalElement = document.getElementById('newArticleModal');
        if (!modalElement) {
            console.error('❌ Elemento do modal não encontrado!');
            this.showNotification('Erro: Modal não encontrado!', 'danger');
            return;
        }
        
        console.log('✅ Elemento do modal encontrado');
        
        try {
            // Tentar usar Bootstrap Modal
            if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                console.log('🚀 Usando Bootstrap Modal...');
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
                console.log('✅ Modal aberto com Bootstrap');
            } else {
                console.warn('⚠️ Bootstrap não disponível, abrindo modal manualmente...');
                // Fallback manual
                modalElement.style.display = 'block';
                modalElement.classList.add('show');
                document.body.classList.add('modal-open');
                
                // Adicionar backdrop
                const backdrop = document.createElement('div');
                backdrop.className = 'modal-backdrop fade show';
                document.body.appendChild(backdrop);
                
                console.log('✅ Modal aberto manualmente');
            }
            
            // Focar no primeiro campo
            setTimeout(() => {
                const firstInput = modalElement.querySelector('input[name="title"]');
                if (firstInput) {
                    firstInput.focus();
                    console.log('✅ Foco definido no campo título');
                }
            }, 300);
            
        } catch (error) {
            console.error('❌ Erro ao abrir modal:', error);
            this.showNotification('Erro ao abrir modal: ' + error.message, 'danger');
        }
    }
    
    showInviteUserModal() {
        const modal = new bootstrap.Modal(document.getElementById('inviteUserModal'));
        modal.show();
    }
    
    showProfileModal() {
        // Criar modal de perfil dinamicamente
        const profileModal = `
            <div class="modal fade" id="profileModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Meu Perfil</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="text-center mb-4">
                                <div class="profile-avatar mb-3">
                                    <i class="bi bi-person-circle" style="font-size: 4rem; color: #0d6efd;"></i>
                                </div>
                                <h5 id="profileUserName">${this.getCurrentUser()?.email || 'Admin'}</h5>
                                <p class="text-muted">Administrador</p>
                            </div>
                            <form id="profileForm">
                                <div class="mb-3">
                                    <label class="form-label">Nome</label>
                                    <input type="text" class="form-control" value="Administrador" id="profileName">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Email</label>
                                    <input type="email" class="form-control" value="${this.getCurrentUser()?.email || ''}" id="profileEmail" readonly>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Nova Senha</label>
                                    <input type="password" class="form-control" placeholder="Deixe em branco para manter a atual">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Confirmar Nova Senha</label>
                                    <input type="password" class="form-control" placeholder="Confirme a nova senha">
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" onclick="adminPanel.saveProfile()">Salvar Alterações</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remover modal existente se houver
        const existingModal = document.getElementById('profileModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Adicionar novo modal ao body
        document.body.insertAdjacentHTML('beforeend', profileModal);
        
        // Mostrar modal
        const modal = new bootstrap.Modal(document.getElementById('profileModal'));
        modal.show();
    }
    
    showNotifications() {
        // Criar modal de notificações dinamicamente
        const notificationsModal = `
            <div class="modal fade" id="notificationsModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Notificações</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="notification-list">
                                <div class="notification-item unread">
                                    <div class="notification-icon bg-primary">
                                        <i class="bi bi-file-text"></i>
                                    </div>
                                    <div class="notification-content">
                                        <h6>Novo artigo publicado</h6>
                                        <p>O artigo "Ubatuba lança licitação" foi publicado com sucesso.</p>
                                        <small class="text-muted">2 horas atrás</small>
                                    </div>
                                    <button class="btn btn-sm btn-outline-primary">Ver</button>
                                </div>
                                <div class="notification-item unread">
                                    <div class="notification-icon bg-success">
                                        <i class="bi bi-person-plus"></i>
                                    </div>
                                    <div class="notification-content">
                                        <h6>Novo usuário registrado</h6>
                                        <p>Um novo usuário se cadastrou no sistema.</p>
                                        <small class="text-muted">4 horas atrás</small>
                                    </div>
                                    <button class="btn btn-sm btn-outline-primary">Ver</button>
                                </div>
                                <div class="notification-item">
                                    <div class="notification-icon bg-warning">
                                        <i class="bi bi-exclamation-triangle"></i>
                                    </div>
                                    <div class="notification-content">
                                        <h6>Backup automático</h6>
                                        <p>Backup do sistema realizado com sucesso.</p>
                                        <small class="text-muted">1 dia atrás</small>
                                    </div>
                                    <button class="btn btn-sm btn-outline-secondary">Ver</button>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                            <button type="button" class="btn btn-primary" onclick="adminPanel.markAllAsRead()">Marcar todas como lidas</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remover modal existente se houver
        const existingModal = document.getElementById('notificationsModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Adicionar novo modal ao body
        document.body.insertAdjacentHTML('beforeend', notificationsModal);
        
        // Mostrar modal
        const modal = new bootstrap.Modal(document.getElementById('notificationsModal'));
        modal.show();
    }
    
    getCurrentUser() {
        if (window.netlifyIdentity) {
            return netlifyIdentity.currentUser();
        }
        return null;
    }
    
    saveProfile() {
        this.showNotification('Perfil atualizado com sucesso!', 'success');
        bootstrap.Modal.getInstance(document.getElementById('profileModal')).hide();
    }
    
    markAllAsRead() {
        this.showNotification('Todas as notificações foram marcadas como lidas!', 'success');
        document.getElementById('notificationCount').textContent = '0';
        bootstrap.Modal.getInstance(document.getElementById('notificationsModal')).hide();
    }
    
    createArticle() {
        console.log('🚀 Iniciando criação de artigo...');
        
        // Verificar se o formulário existe
        const form = document.getElementById('newArticleForm');
        if (!form) {
            console.error('❌ Formulário newArticleForm não encontrado!');
            this.showNotification('Erro: Formulário não encontrado!', 'danger');
            return;
        }
        
        console.log('✅ Formulário encontrado, coletando dados...');
        
        // Coletar dados do formulário
        const formData = new FormData(form);
        const title = formData.get('title');
        const category = formData.get('category');
        const status = formData.get('status');
        const excerpt = formData.get('excerpt');
        const content = formData.get('content');
        
        console.log('📝 Dados coletados:', { title, category, status, excerpt, content });
        
        // Validar dados obrigatórios
        if (!title || !category || !status) {
            console.error('❌ Dados obrigatórios não preenchidos!');
            this.showNotification('Por favor, preencha todos os campos obrigatórios!', 'warning');
            return;
        }
        
        // Criar novo artigo
        const newArticle = {
            id: Date.now().toString(),
            title: title,
            excerpt: excerpt || 'Resumo do artigo...',
            category: category,
            author: this.getCurrentUser()?.email || 'Admin',
            status: status,
            date: new Date().toISOString().split('T')[0],
            views: 0,
            image: 'https://picsum.photos/50/50?random=' + Math.floor(Math.random() * 1000)
        };
        
        console.log('📰 Novo artigo criado:', newArticle);
        
        // Adicionar ao array de artigos
        this.data.articles.unshift(newArticle);
        console.log('✅ Artigo adicionado ao array. Total de artigos:', this.data.articles.length);
        
        // Fechar modal
        try {
            const modal = bootstrap.Modal.getInstance(document.getElementById('newArticleModal'));
            if (modal) {
                modal.hide();
                console.log('✅ Modal fechado com sucesso');
            } else {
                console.warn('⚠️ Modal não encontrado, tentando fechar manualmente...');
                const modalElement = document.getElementById('newArticleModal');
                if (modalElement) {
                    modalElement.classList.remove('show');
                    modalElement.style.display = 'none';
                    document.body.classList.remove('modal-open');
                    const backdrop = document.querySelector('.modal-backdrop');
                    if (backdrop) backdrop.remove();
                }
            }
        } catch (error) {
            console.error('❌ Erro ao fechar modal:', error);
        }
        
        // Limpar formulário
        form.reset();
        console.log('✅ Formulário limpo');
        
        // Atualizar interface
        this.loadArticles();
        this.updateStats();
        
        // Mostrar mensagem de sucesso
        this.showNotification('Artigo criado com sucesso!', 'success');
        console.log('🎉 Artigo criado com sucesso!');
        
        // Atualizar contador de artigos na interface
        const totalArticlesElement = document.getElementById('totalArticles');
        if (totalArticlesElement) {
            totalArticlesElement.textContent = this.data.articles.length;
        }
    }
    
    inviteUser() {
        // Simulate user invitation
        const form = document.getElementById('inviteUserForm');
        const formData = new FormData(form);
        
        // Add to users array
        const newUser = {
            id: Date.now().toString(),
            name: 'Usuário Convidado',
            email: formData.get('email'),
            role: formData.get('role') || 'user',
            status: 'pending',
            lastLogin: null
        };
        
        this.data.users.push(newUser);
        
        // Close modal and refresh
        bootstrap.Modal.getInstance(document.getElementById('inviteUserModal')).hide();
        form.reset();
        this.loadUsersList();
        this.updateStats();
        
        // Show success message
        this.showNotification('Convite enviado com sucesso!', 'success');
    }
    
    saveGeneralSettings() {
        this.showNotification('Configurações gerais salvas!', 'success');
    }
    
    saveEmailSettings() {
        this.showNotification('Configurações de email salvas!', 'success');
    }
    
    updateAnalytics() {
        this.showNotification('Analytics atualizados!', 'info');
        this.loadAnalyticsData();
    }
    
    editArticle(id) {
        this.showNotification(`Editando artigo ${id}...`, 'info');
    }
    
    deleteArticle(id) {
        if (confirm('Tem certeza que deseja excluir este artigo?')) {
            this.data.articles = this.data.articles.filter(article => article.id !== id);
            this.loadArticles();
            this.updateStats();
            this.showNotification('Artigo excluído com sucesso!', 'success');
        }
    }
    
    editUser(id) {
        this.showNotification(`Editando usuário ${id}...`, 'info');
    }
    
    changeUserRole(id) {
        this.showNotification(`Alterando role do usuário ${id}...`, 'info');
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
    
    logout() {
        console.log('🚪 Fazendo logout...');
        if (window.netlifyIdentity) {
            netlifyIdentity.logout();
        } else {
            console.log('⚠️ Netlify Identity não disponível, redirecionando...');
            window.location.href = '/';
        }
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const adminContainer = document.getElementById('adminContainer');
        
        if (loadingScreen && adminContainer) {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    adminContainer.style.display = 'flex';
                }, 300);
            }, 1000);
        }
    }
    
    updateUserInfo(user) {
        if (user) {
            // Atualiza informações do usuário na sidebar
            const userNameElement = document.getElementById('userName');
            if (userNameElement) {
                userNameElement.textContent = user.email || 'Admin';
            }
            
            // Atualiza informações no header
            const headerUserNameElement = document.getElementById('headerUserName');
            if (headerUserNameElement) {
                headerUserNameElement.textContent = user.email || 'Admin';
            }
        }
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM carregado, verificando dependências...');
    
    // Verificar se Bootstrap está disponível
    if (typeof bootstrap === 'undefined') {
        console.error('❌ Bootstrap não está disponível!');
        alert('Erro: Bootstrap não foi carregado. Recarregue a página.');
        return;
    }
    
    console.log('✅ Bootstrap disponível:', bootstrap.version || 'versão desconhecida');
    
    // Check if user is authenticated
    if (window.netlifyIdentity) {
        console.log('🔐 Netlify Identity disponível');
        
        netlifyIdentity.on('init', user => {
            console.log('🔄 Netlify Identity inicializado:', user);
            if (user) {
                // Verifica se o usuário é autorizado
                if (isAdminEmail(user.email)) {
                    console.log('✅ Usuário autorizado, criando painel admin...');
                    window.adminPanel = new AdminPanel();
                    window.adminPanel.updateUserInfo(user);
                } else {
                    console.log('❌ Usuário não autorizado:', user.email);
                    alert('Você não tem permissão para acessar o painel administrativo. Emails autorizados: ' + (window.ADMIN_EMAILS ? window.ADMIN_EMAILS.join(', ') : 'Nenhum'));
                    window.location.href = '/';
                }
            } else {
                console.log('🔒 Nenhum usuário logado, abrindo login...');
                // Redirect to login if not authenticated
                netlifyIdentity.open('login');
            }
        });
        
        netlifyIdentity.on('login', user => {
            console.log('✅ Usuário logado:', user);
            if (user) {
                // Verifica se o usuário é autorizado
                if (isAdminEmail(user.email)) {
                    console.log('✅ Usuário autorizado após login');
                    if (!window.adminPanel) {
                        console.log('🚀 Criando novo painel admin...');
                        window.adminPanel = new AdminPanel();
                    }
                    window.adminPanel.updateUserInfo(user);
                } else {
                    console.log('❌ Usuário não autorizado após login:', user.email);
                    alert('Você não tem permissão para acessar o painel administrativo. Emails autorizados: ' + (window.ADMIN_EMAILS ? window.ADMIN_EMAILS.join(', ') : 'Nenhum'));
                    netlifyIdentity.logout();
                }
            }
        });
        
        netlifyIdentity.on('logout', () => {
            console.log('🚪 Usuário fez logout, redirecionando...');
            window.location.href = '/';
        });
    } else {
        console.warn('⚠️ Netlify Identity não disponível, criando painel sem autenticação...');
        // Fallback if Netlify Identity is not available
        window.adminPanel = new AdminPanel();
    }
});

// Global functions for inline onclick handlers
window.adminPanel = null;

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminPanel;
}
