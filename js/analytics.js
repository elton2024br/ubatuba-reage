/**
 * ANALYTICS SYSTEM - UBATUBA REAGE
 * Google Analytics 4 + Google Tag Manager Integration
 */

class AnalyticsSystem {
    constructor() {
        this.config = {
            // Substitua pelos seus IDs reais
            GA_MEASUREMENT_ID: 'G-XXXXXXXXXX', // Seu Google Analytics 4 ID
            GTM_ID: 'GTM-XXXXXXX', // Seu Google Tag Manager ID
            DEBUG: window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')
        };
        
        this.init();
    }
    
    init() {
        if (this.config.DEBUG) {
            console.log('🔍 Analytics em modo DEBUG - dados não serão enviados');
            return;
        }
        
        this.loadGoogleTagManager();
        this.loadGoogleAnalytics();
        this.setupCustomEvents();
        
        console.log('📊 Analytics inicializado');
    }
    
    loadGoogleTagManager() {
        // Google Tag Manager
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer',this.config.GTM_ID);
        
        // Initialize dataLayer
        window.dataLayer = window.dataLayer || [];
    }
    
    loadGoogleAnalytics() {
        // Google Analytics 4
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.GA_MEASUREMENT_ID}`;
        document.head.appendChild(script);
        
        script.onload = () => {
            window.gtag = window.gtag || function(){dataLayer.push(arguments);};
            gtag('js', new Date());
            gtag('config', this.config.GA_MEASUREMENT_ID, {
                // Configurações de privacidade LGPD/GDPR
                anonymize_ip: true,
                allow_google_signals: false,
                allow_ad_personalization_signals: false
            });
        };
    }
    
    setupCustomEvents() {
        // Track page views for SPA-like navigation
        this.trackPageView();
        
        // Track outbound links
        this.trackOutboundLinks();
        
        // Track file downloads
        this.trackDownloads();
        
        // Track scroll depth
        this.trackScrollDepth();
        
        // Track newsletter signups (já implementado nos formulários)
        // Track search queries (já implementado no sistema de busca)
        // Track form submissions (já implementado nos formulários)
    }
    
    trackPageView(page_title = document.title, page_location = window.location.href) {
        if (this.config.DEBUG) {
            console.log('📊 Page view:', { page_title, page_location });
            return;
        }
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: page_title,
                page_location: page_location
            });
        }
    }
    
    trackOutboundLinks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;
            
            const href = link.getAttribute('href');
            if (!href) return;
            
            // Check if it's an outbound link
            const isOutbound = href.startsWith('http') && 
                              !href.includes(window.location.hostname);
            
            if (isOutbound) {
                this.trackEvent('click', 'outbound_link', {
                    link_url: href,
                    link_text: link.textContent.trim()
                });
            }
        });
    }
    
    trackDownloads() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;
            
            const href = link.getAttribute('href');
            if (!href) return;
            
            // Check if it's a download link
            const downloadExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip', '.rar'];
            const isDownload = downloadExtensions.some(ext => href.toLowerCase().includes(ext));
            
            if (isDownload) {
                this.trackEvent('click', 'file_download', {
                    file_url: href,
                    file_name: href.split('/').pop()
                });
            }
        });
    }
    
    trackScrollDepth() {
        let maxScroll = 0;
        const milestones = [25, 50, 75, 90, 100];
        const tracked = new Set();
        
        const trackScroll = () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                milestones.forEach(milestone => {
                    if (scrollPercent >= milestone && !tracked.has(milestone)) {
                        tracked.add(milestone);
                        this.trackEvent('scroll', 'scroll_depth', {
                            percent_scrolled: milestone
                        });
                    }
                });
            }
        };
        
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    trackScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    // Método público para tracking de eventos customizados
    trackEvent(action, event_name, parameters = {}) {
        if (this.config.DEBUG) {
            console.log('📊 Custom event:', { action, event_name, parameters });
            return;
        }
        
        if (typeof gtag !== 'undefined') {
            gtag('event', event_name, {
                event_category: action,
                ...parameters
            });
        }
        
        // Também envia para GTM dataLayer
        if (window.dataLayer) {
            window.dataLayer.push({
                event: event_name,
                eventAction: action,
                ...parameters
            });
        }
    }
    
    // Método para tracking de conversões
    trackConversion(conversion_id, conversion_value = null) {
        if (this.config.DEBUG) {
            console.log('📊 Conversion:', { conversion_id, conversion_value });
            return;
        }
        
        this.trackEvent('conversion', 'conversion', {
            conversion_id: conversion_id,
            value: conversion_value
        });
    }
    
    // Método para tracking de tempo de permanência
    trackTimeOnPage() {
        const startTime = Date.now();
        
        const sendTimeOnPage = () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            
            if (timeSpent > 10) { // Só trackea se ficou mais de 10 segundos
                this.trackEvent('engagement', 'time_on_page', {
                    time_spent: timeSpent,
                    page_url: window.location.pathname
                });
            }
        };
        
        // Track quando sair da página
        window.addEventListener('beforeunload', sendTimeOnPage);
        
        // Track a cada 30 segundos para sessões longas
        setInterval(() => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            if (timeSpent > 0 && timeSpent % 30 === 0) {
                this.trackEvent('engagement', 'time_milestone', {
                    time_spent: timeSpent,
                    page_url: window.location.pathname
                });
            }
        }, 1000);
    }
    
    // Configuração de consentimento (LGPD/GDPR)
    setConsentMode(analytics_consent = 'denied', ad_consent = 'denied') {
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': analytics_consent,
                'ad_storage': ad_consent
            });
        }
    }
    
    // Método para opt-out do usuário
    optOut() {
        // Disable Google Analytics
        window[`ga-disable-${this.config.GA_MEASUREMENT_ID}`] = true;
        
        // Remove tracking cookies
        document.cookie = '_ga=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = '_ga_' + this.config.GA_MEASUREMENT_ID.split('-')[1] + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        
        console.log('📊 Analytics opt-out ativado');
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.UbatubaAnalytics = new AnalyticsSystem();
    
    // Track time on page
    window.UbatubaAnalytics.trackTimeOnPage();
});

// Adicionar noscript para GTM no body (será inserido via HTML)
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('gtm-noscript')) return;
    
    const noscript = document.createElement('noscript');
    noscript.id = 'gtm-noscript';
    noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    document.body.insertBefore(noscript, document.body.firstChild);
});

// Exportar para uso externo
window.AnalyticsSystem = AnalyticsSystem;
