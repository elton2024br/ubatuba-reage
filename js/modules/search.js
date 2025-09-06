import analytics from './analytics.js';

/**
 * SISTEMA DE BUSCA - UBATUBA REAGE
 * Busca local com JSON, filtros e ordenação
 */

class SearchSystem {
    constructor() {
        this.articles = [];
        this.currentResults = [];
        this.currentQuery = '';
        this.currentSort = 'date';
        
        // DOM Elements
        this.searchForm = document.getElementById('searchForm');
        this.searchInput = document.getElementById('searchInput');
        this.resultsHeader = document.getElementById('resultsHeader');
        this.resultsList = document.getElementById('resultsList');
        this.resultsCount = document.getElementById('resultsCount');
        this.searchTerm = document.getElementById('searchTerm');
        this.noResults = document.getElementById('noResults');
        this.initialState = document.getElementById('initialState');
        this.loadingState = document.getElementById('loadingState');
    }
    
    async init() {
        if (!this.searchForm) return; // Não inicializa se não estiver na página de busca

        try {
            // Load articles data
            await this.loadArticles();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Check for URL parameters
            this.checkUrlParams();
            
            console.log('✅ Sistema de busca inicializado');
        } catch (error) {
            console.error('❌ Erro ao inicializar busca:', error);
        }
    }
    
    async loadArticles() {
        try {
            const response = await fetch('data/articles.json');
            if (!response.ok) throw new Error('Erro ao carregar dados');
            
            const data = await response.json();
            // Suporta dois formatos: array direto ou objeto { articles: [...] }
            this.articles = Array.isArray(data) ? data : (data.articles || []);
        } catch (error) {
            console.error('Erro ao carregar artigos:', error);
            // Fallback data se necessário
            this.articles = [];
        }
    }
    
    setupEventListeners() {
        // Search form
        if (this.searchForm) {
            this.searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.performSearch();
            });
        }
        
        // Real-time search (com debounce)
        if (this.searchInput) {
            let timeout;
            this.searchInput.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    if (this.searchInput.value.length >= 2) {
                        this.performSearch();
                    } else if (this.searchInput.value.length === 0) {
                        this.showInitialState();
                    }
                }, 300);
            });
        }
        
        // Quick filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                this.searchInput.value = filter;
                this.performSearch();
            });
        });
        
        // Sort options
        document.querySelectorAll('.sort-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.currentSort = btn.dataset.sort;
                this.sortAndDisplayResults();
            });
        });
        
        // Tag links
        document.querySelectorAll('.tag-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tag = link.dataset.tag;
                this.searchInput.value = tag;
                this.performSearch();
            });
        });
    }
    
    checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        
        if (query) {
            this.searchInput.value = query;
            this.performSearch();
        }
    }
    
    performSearch() {
        const query = this.searchInput.value.trim().toLowerCase();
        
        if (!query) {
            this.showInitialState();
            return;
        }
        
        this.currentQuery = query;
        this.showLoading();
        
        // Simulate API delay for better UX
        setTimeout(() => {
            const results = this.searchArticles(query);
            this.currentResults = results;
            this.displayResults();
        }, 300);
        
        // Update URL
        const url = new URL(window.location);
        url.searchParams.set('q', query);
        window.history.replaceState({}, '', url);
    }
    
    searchArticles(query) {
        return this.articles.filter(article => {
            // Search in title, excerpt, category, tags
            const searchableText = [
                article.title,
                article.excerpt,
                article.category,
                article.author,
                ...article.tags
            ].join(' ').toLowerCase();
            
            // Simple search - can be enhanced with fuzzy matching
            const words = query.split(' ').filter(word => word.length > 1);
            return words.some(word => searchableText.includes(word));
        });
    }
    
    sortAndDisplayResults() {
        switch (this.currentSort) {
            case 'date':
                this.currentResults.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'title':
                this.currentResults.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'relevance':
                // Simple relevance: title matches score higher
                this.currentResults.sort((a, b) => {
                    const aScore = a.title.toLowerCase().includes(this.currentQuery) ? 2 : 1;
                    const bScore = b.title.toLowerCase().includes(this.currentQuery) ? 2 : 1;
                    return bScore - aScore;
                });
                break;
        }
        
        this.displayResults();
    }
    
    displayResults() {
        this.hideAllStates();
        
        if (this.currentResults.length === 0) {
            this.showNoResults();
            return;
        }
        
        // Update header
        this.resultsCount.textContent = this.currentResults.length;
        this.searchTerm.textContent = `para "${this.currentQuery}"`;
        this.resultsHeader.style.display = 'block';
        
        // Generate results HTML
        this.resultsList.innerHTML = this.currentResults.map(article => 
            this.generateArticleCard(article)
        ).join('');
        
        // Add click tracking
        this.trackResultClicks();
    }
    
    generateArticleCard(article) {
        // Highlight search terms in title and excerpt
        const highlightedTitle = this.highlightSearchTerms(article.title);
        const highlightedExcerpt = this.highlightSearchTerms(article.excerpt);
        
        return `
            <div class="col-12">
                <article class="card bg-dark border-0 mb-3" style="border: 1px solid rgba(255,255,255,0.08) !important;">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${article.image}" 
                                 class="img-fluid rounded-start h-100 object-fit-cover" 
                                 alt="${article.title}"
                                 style="min-height: 200px;">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body h-100 d-flex flex-column">
                                <div class="mb-2">
                                    <span class="badge bg-primary">${article.category}</span>
                                </div>
                                <h3 class="card-title h5 text-white">
                                    <a href="${article.url}" class="text-decoration-none text-white search-result-link" data-article-id="${article.id}">
                                        ${highlightedTitle}
                                    </a>
                                </h3>
                                <p class="card-text text-white-50 flex-grow-1">
                                    ${highlightedExcerpt}
                                </p>
                                <div class="d-flex justify-content-between align-items-center mt-auto">
                                    <small class="text-white-50">
                                        Por <strong>${article.author}</strong>
                                    </small>
                                    <small class="text-white-50">
                                        <i class="bi bi-calendar3 me-1"></i>
                                        ${article.dateFormatted}
                                    </small>
                                </div>
                                ${article.tags.length > 0 ? `
                                <div class="mt-2">
                                    ${article.tags.slice(0, 3).map(tag => 
                                        `<span class="badge bg-secondary me-1">${tag}</span>`
                                    ).join('')}
                                </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        `;
    }
    
    highlightSearchTerms(text) {
        if (!this.currentQuery) return text;
        
        const words = this.currentQuery.split(' ').filter(word => word.length > 1);
        let highlightedText = text;
        
        words.forEach(word => {
            const regex = new RegExp(`(${word})`, 'gi');
            highlightedText = highlightedText.replace(regex, '<mark class="bg-warning text-dark">$1</mark>');
        });
        
        return highlightedText;
    }
    
    trackResultClicks() {
        document.querySelectorAll('.search-result-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const articleId = e.target.closest('.search-result-link').dataset.articleId;
                
                // Analytics tracking
                analytics.trackEvent('click', 'search_result_click', {
                    'search_term': this.currentQuery,
                    'article_id': articleId,
                    'result_position': Array.from(document.querySelectorAll('.search-result-link')).indexOf(e.target) + 1
                });
                
                console.log(`🔍 Clique no resultado: ${articleId} para busca: "${this.currentQuery}"`);
            });
        });
    }
    
    showLoading() {
        this.hideAllStates();
        this.loadingState.style.display = 'block';
    }
    
    showNoResults() {
        this.hideAllStates();
        this.noResults.style.display = 'block';
    }
    
    showInitialState() {
        this.hideAllStates();
        this.initialState.style.display = 'block';
        
        // Clear URL
        const url = new URL(window.location);
        url.searchParams.delete('q');
        window.history.replaceState({}, '', url);
    }
    
    hideAllStates() {
        this.loadingState.style.display = 'none';
        this.resultsHeader.style.display = 'none';
        this.resultsList.innerHTML = '';
        this.noResults.style.display = 'none';
        this.initialState.style.display = 'none';
    }
}

export default SearchSystem;
