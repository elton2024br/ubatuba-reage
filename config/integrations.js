/**
 * CONFIGURAÇÕES DE INTEGRAÇÕES - UBATUBA REAGE
 * Centralize todas as configurações de serviços externos aqui
 */

window.UbatubaConfig = {
    // NETLIFY FORMS
    netlify: {
        enabled: true,
        forms: {
            newsletter: 'newsletter',
            fontes: 'fontes'
        }
    },
    
    // GOOGLE ANALYTICS 4
    analytics: {
        enabled: !window.location.hostname.includes('localhost'),
        ga4_measurement_id: 'G-XXXXXXXXXX', // ⚠️ SUBSTITUIR PELO SEU ID
        gtm_id: 'GTM-XXXXXXX', // ⚠️ SUBSTITUIR PELO SEU ID
        debug: window.location.hostname.includes('localhost')
    },
    
    // reCAPTCHA v3
    recaptcha: {
        enabled: !window.location.hostname.includes('localhost'),
        site_key: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', // ⚠️ SUBSTITUIR PELA SUA CHAVE
        actions: {
            newsletter: 'newsletter',
            denuncia: 'denuncia',
            contato: 'contato'
        }
    },
    
    // DISQUS COMMENTS
    disqus: {
        enabled: !window.location.hostname.includes('localhost'),
        shortname: 'ubatuba-reage', // ⚠️ SUBSTITUIR PELO SEU SHORTNAME
        language: 'pt_BR'
    },
    
    // FORMSPREE (alternativa ao Netlify Forms)
    formspree: {
        enabled: false, // Ative se preferir usar Formspree
        endpoints: {
            newsletter: 'https://formspree.io/f/YOUR_NEWSLETTER_ID',
            fontes: 'https://formspree.io/f/YOUR_FONTES_ID'
        }
    },
    
    // SOCIAL MEDIA
    social: {
        whatsapp: '5512999999999', // ⚠️ SUBSTITUIR PELO SEU NÚMERO
        email: 'contato@ubatubaReage.com.br', // ⚠️ SUBSTITUIR PELO SEU EMAIL
        facebook: 'https://facebook.com/ubatubaReage',
        instagram: 'https://instagram.com/ubatubaReage',
        twitter: 'https://twitter.com/ubatubaReage'
    },
    
    // EMAIL SERVICES
    email: {
        newsletter_service: 'netlify', // 'netlify', 'formspree', 'mailchimp'
        mailchimp_endpoint: '', // Se usar Mailchimp
        contact_email: 'fontes@ubatubaReage.com.br'
    },
    
    // DEVELOPMENT/PRODUCTION
    environment: {
        is_development: window.location.hostname.includes('localhost'),
        is_production: !window.location.hostname.includes('localhost'),
        debug_mode: window.location.hostname.includes('localhost')
    }
};

/**
 * INSTRUÇÕES DE CONFIGURAÇÃO
 * 
 * 1. NETLIFY FORMS:
 *    - Já configurado nos HTMLs com data-netlify="true"
 *    - Funciona automaticamente quando hospedado no Netlify
 * 
 * 2. GOOGLE ANALYTICS:
 *    - Substitua 'G-XXXXXXXXXX' pelo seu Measurement ID
 *    - Substitua 'GTM-XXXXXXX' pelo seu Container ID (opcional)
 * 
 * 3. reCAPTCHA:
 *    - Registre seu site em https://www.google.com/recaptcha/admin
 *    - Substitua a site_key pela sua chave pública
 *    - Configure a chave secreta no seu backend/Netlify
 * 
 * 4. DISQUS:
 *    - Crie conta em https://disqus.com/
 *    - Registre seu site e obtenha o shortname
 *    - Substitua 'ubatuba-reage' pelo seu shortname
 * 
 * 5. FORMSPREE (opcional):
 *    - Registre em https://formspree.io/
 *    - Crie formulários e obtenha os endpoints
 *    - Ative formspree.enabled = true se preferir usar
 * 
 * 6. REDES SOCIAIS:
 *    - Atualize todos os links e números de contato
 * 
 * 7. DEPLOY:
 *    - Netlify: Faça push para Git, deploy automático
 *    - Vercel: Similar ao Netlify
 *    - GitHub Pages: Não suporta Netlify Forms (use Formspree)
 */

console.log('⚙️ Configurações carregadas:', window.UbatubaConfig.environment.is_development ? 'DESENVOLVIMENTO' : 'PRODUÇÃO');
