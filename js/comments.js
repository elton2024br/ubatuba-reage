/**
 * COMMENTS SYSTEM - UBATUBA REAGE
 * Sistema de comentários com Disqus + fallback local
 */

class CommentsSystem {
    constructor() {
        this.config = {
            DISQUS_SHORTNAME: 'ubatuba-reage', // Substitua pelo seu shortname do Disqus
            ENABLE_DISQUS: !this.isLocalhost(),
            ENABLE_LOCAL_COMMENTS: true,
            DEBUG: this.isLocalhost()
        };
        
        this.localComments = this.loadLocalComments();
        this.init();
    }
    
    init() {
        const commentContainer = document.getElementById('comments-section');
        if (!commentContainer) return;
        
        if (this.config.ENABLE_DISQUS) {
            this.initDisqus(commentContainer);
        } else if (this.config.ENABLE_LOCAL_COMMENTS) {
            this.initLocalComments(commentContainer);
        }
        
        console.log('💬 Sistema de comentários inicializado');
    }
    
    isLocalhost() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.hostname === '';
    }
    
    // DISQUS Integration
    initDisqus(container) {
        const pageUrl = window.location.href;
        const pageId = this.getPageId();
        
        // Create Disqus container
        const disqusDiv = document.createElement('div');
        disqusDiv.id = 'disqus_thread';
        container.appendChild(disqusDiv);
        
        // Configure Disqus
        window.disqus_config = function () {
            this.page.url = pageUrl;
            this.page.identifier = pageId;
            this.language = 'pt_BR';
        };
        
        // Load Disqus script
        const script = document.createElement('script');
        script.src = `https://${this.config.DISQUS_SHORTNAME}.disqus.com/embed.js`;
        script.setAttribute('data-timestamp', +new Date());
        (document.head || document.body).appendChild(script);
        
        // Add Disqus count
        this.loadDisqusCount();
    }
    
    loadDisqusCount() {
        const script = document.createElement('script');
        script.id = 'dsq-count-scr';
        script.src = `https://${this.config.DISQUS_SHORTNAME}.disqus.com/count.js`;
        script.async = true;
        document.body.appendChild(script);
    }
    
    // Local Comments System
    initLocalComments(container) {
        const pageId = this.getPageId();
        
        container.innerHTML = `
            <div class="comments-local">
                <div class="comments-header d-flex justify-content-between align-items-center mb-4">
                    <h3 class="h5 fw-bold text-white mb-0">
                        <i class="bi bi-chat-left-text me-2"></i>
                        Comentários (<span id="comments-count">${this.getCommentsCount(pageId)}</span>)
                    </h3>
                    <button class="btn btn-primary btn-sm" onclick="UbatubaComments.toggleCommentForm()">
                        <i class="bi bi-plus-lg me-1"></i>
                        Comentar
                    </button>
                </div>
                
                <!-- Comment Form -->
                <div id="comment-form" class="comment-form mb-4" style="display: none;">
                    <div class="card bg-dark border-0" style="border: 1px solid rgba(255,255,255,0.08) !important;">
                        <div class="card-body">
                            <form id="local-comment-form">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <input type="text" 
                                               class="form-control" 
                                               id="comment-name" 
                                               placeholder="Seu nome"
                                               required>
                                    </div>
                                    <div class="col-md-6">
                                        <input type="email" 
                                               class="form-control" 
                                               id="comment-email" 
                                               placeholder="Seu e-mail (não será publicado)"
                                               required>
                                    </div>
                                    <div class="col-12">
                                        <textarea class="form-control" 
                                                  id="comment-text" 
                                                  rows="4" 
                                                  placeholder="Escreva seu comentário..."
                                                  required
                                                  maxlength="1000"></textarea>
                                        <div class="form-text text-white-50">
                                            <span id="comment-char-count">0</span>/1000 caracteres
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="d-flex justify-content-between align-items-center mt-3">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="comment-notify">
                                        <label class="form-check-label text-white-50" for="comment-notify">
                                            Notificar sobre novas respostas
                                        </label>
                                    </div>
                                    <div class="d-flex gap-2">
                                        <button type="button" class="btn btn-outline-light btn-sm" onclick="UbatubaComments.toggleCommentForm()">
                                            Cancelar
                                        </button>
                                        <button type="submit" class="btn btn-primary btn-sm">
                                            <span class="btn-text">Publicar</span>
                                            <span class="btn-loading d-none">
                                                <span class="spinner-border spinner-border-sm me-1" role="status"></span>
                                                Enviando...
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                
                <!-- Comments List -->
                <div id="comments-list" class="comments-list">
                    ${this.renderComments(pageId)}
                </div>
                
                <!-- Load More -->
                <div id="load-more-comments" class="text-center mt-4" style="display: none;">
                    <button class="btn btn-outline-light btn-sm" onclick="UbatubaComments.loadMoreComments()">
                        <i class="bi bi-arrow-down me-1"></i>
                        Carregar mais comentários
                    </button>
                </div>
            </div>
        `;
        
        this.setupLocalCommentsEvents();
    }
    
    setupLocalCommentsEvents() {
        // Form submission
        const form = document.getElementById('local-comment-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitLocalComment();
            });
        }
        
        // Character counter
        const textarea = document.getElementById('comment-text');
        const counter = document.getElementById('comment-char-count');
        if (textarea && counter) {
            textarea.addEventListener('input', () => {
                counter.textContent = textarea.value.length;
                counter.className = textarea.value.length > 900 ? 'text-warning' : 'text-white-50';
            });
        }
    }
    
    async submitLocalComment() {
        const form = document.getElementById('local-comment-form');
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Get form data
        const formData = {
            name: document.getElementById('comment-name').value.trim(),
            email: document.getElementById('comment-email').value.trim(),
            text: document.getElementById('comment-text').value.trim(),
            notify: document.getElementById('comment-notify').checked,
            pageId: this.getPageId(),
            timestamp: new Date().toISOString(),
            id: Date.now()
        };
        
        // Validate
        if (!formData.name || !formData.email || !formData.text) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        // Show loading
        submitBtn.disabled = true;
        btnText.classList.add('d-none');
        btnLoading.classList.remove('d-none');
        
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Save comment
            this.saveLocalComment(formData);
            
            // Reset form
            form.reset();
            this.toggleCommentForm();
            
            // Refresh comments
            this.refreshComments();
            
            // Show success
            this.showCommentSuccess();
            
            // Track event
            if (window.UbatubaAnalytics) {
                window.UbatubaAnalytics.trackEvent('engagement', 'comment_posted', {
                    page_id: formData.pageId
                });
            }
        } catch (error) {
            console.error('Erro ao enviar comentário:', error);
            alert('Erro ao enviar comentário. Tente novamente.');
        } finally {
            submitBtn.disabled = false;
            btnText.classList.remove('d-none');
            btnLoading.classList.add('d-none');
        }
    }
    
    saveLocalComment(comment) {
        const pageId = comment.pageId;
        
        if (!this.localComments[pageId]) {
            this.localComments[pageId] = [];
        }
        
        this.localComments[pageId].push(comment);
        localStorage.setItem('ubatuba_comments', JSON.stringify(this.localComments));
    }
    
    loadLocalComments() {
        try {
            return JSON.parse(localStorage.getItem('ubatuba_comments') || '{}');
        } catch {
            return {};
        }
    }
    
    renderComments(pageId) {
        const comments = this.localComments[pageId] || [];
        
        if (comments.length === 0) {
            return `
                <div class="text-center py-5">
                    <i class="bi bi-chat-left fs-1 text-white-50 mb-3"></i>
                    <h4 class="h6 text-white mb-2">Nenhum comentário ainda</h4>
                    <p class="text-white-50 small">Seja o primeiro a comentar esta matéria!</p>
                </div>
            `;
        }
        
        return comments
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map(comment => this.renderComment(comment))
            .join('');
    }
    
    renderComment(comment) {
        const date = new Date(comment.timestamp);
        const timeAgo = this.getTimeAgo(date);
        const avatar = this.generateAvatar(comment.name);
        
        return `
            <div class="comment mb-4 p-3 rounded" style="background: #111; border: 1px solid rgba(255,255,255,0.08);">
                <div class="d-flex gap-3">
                    <div class="comment-avatar">
                        <div class="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" style="width: 40px; height: 40px;">
                            ${avatar}
                        </div>
                    </div>
                    <div class="comment-content flex-grow-1">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <div>
                                <strong class="text-white">${this.escapeHtml(comment.name)}</strong>
                                <small class="text-white-50 ms-2">${timeAgo}</small>
                            </div>
                            <button class="btn btn-sm btn-outline-light" onclick="UbatubaComments.replyToComment('${comment.id}')">
                                <i class="bi bi-reply me-1"></i>
                                Responder
                            </button>
                        </div>
                        <p class="text-white-50 mb-0">${this.escapeHtml(comment.text).replace(/\\n/g, '<br>')}</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateAvatar(name) {
        return name.charAt(0).toUpperCase();
    }
    
    getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'agora mesmo';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min atrás`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d atrás`;
        
        return date.toLocaleDateString('pt-BR');
    }
    
    getPageId() {
        return window.location.pathname.replace(/[^a-zA-Z0-9]/g, '_');
    }
    
    getCommentsCount(pageId) {
        return (this.localComments[pageId] || []).length;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Public methods
    toggleCommentForm() {
        const form = document.getElementById('comment-form');
        if (form) {
            form.style.display = form.style.display === 'none' ? 'block' : 'none';
        }
    }
    
    refreshComments() {
        const pageId = this.getPageId();
        const commentsList = document.getElementById('comments-list');
        const commentsCount = document.getElementById('comments-count');
        
        if (commentsList) {
            commentsList.innerHTML = this.renderComments(pageId);
        }
        
        if (commentsCount) {
            commentsCount.textContent = this.getCommentsCount(pageId);
        }
    }
    
    showCommentSuccess() {
        const success = document.createElement('div');
        success.className = 'alert alert-success alert-dismissible fade show';
        success.innerHTML = `
            <i class="bi bi-check-circle-fill me-2"></i>
            <strong>Comentário publicado!</strong> Obrigado por participar da discussão.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const container = document.getElementById('comments-section');
        container.insertBefore(success, container.firstChild);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (success.parentNode) {
                success.remove();
            }
        }, 5000);
    }
    
    replyToComment(commentId) {
        // TODO: Implement reply functionality
        console.log('Reply to comment:', commentId);
        this.toggleCommentForm();
        
        const textarea = document.getElementById('comment-text');
        if (textarea) {
            textarea.focus();
        }
    }
    
    loadMoreComments() {
        // TODO: Implement pagination
        console.log('Load more comments');
    }
    
    // Moderation helpers (for admin)
    deleteComment(commentId, pageId) {
        if (!confirm('Tem certeza que deseja excluir este comentário?')) return;
        
        const comments = this.localComments[pageId] || [];
        this.localComments[pageId] = comments.filter(c => c.id !== commentId);
        localStorage.setItem('ubatuba_comments', JSON.stringify(this.localComments));
        this.refreshComments();
    }
    
    // Export comments (for backup/migration)
    exportComments() {
        const data = JSON.stringify(this.localComments, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `ubatuba-comments-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('comments-section')) {
        window.UbatubaComments = new CommentsSystem();
    }
});

// Export
window.CommentsSystem = CommentsSystem;
