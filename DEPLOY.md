# 🚀 **GUIA DE DEPLOY - UBATUBA REAGE**

## 📋 **Pré-requisitos**

### **1. Contas necessárias:**
- [ ] **Netlify** ou **Vercel** (hosting)
- [ ] **Google Analytics** (opcional)
- [ ] **Google reCAPTCHA** (opcional)
- [ ] **Disqus** (opcional, para comentários)

### **2. Configurações obrigatórias:**
- [ ] Atualizar e-mails em `config/integrations.js`
- [ ] Configurar números de WhatsApp
- [ ] Definir URLs das redes sociais

---

## 🏗️ **OPÇÃO 1: Deploy no Netlify (Recomendado)**

### **Passo 1: Preparar o projeto**
```bash
# 1. Inicializar Git (se ainda não foi feito)
git init
git add .
git commit -m "Initial commit - Ubatuba Reage MVP"

# 2. Criar repositório no GitHub
# (Faça pelo site do GitHub)

# 3. Conectar repositório
git remote add origin https://github.com/SEU_USUARIO/ubatuba-reage.git
git branch -M main
git push -u origin main
```

### **Passo 2: Deploy no Netlify**
1. Acesse [netlify.com](https://netlify.com)
2. Clique em "New site from Git"
3. Conecte seu repositório GitHub
4. Configure:
   - **Build command**: (deixe vazio)
   - **Publish directory**: (deixe vazio ou "./")
5. Clique em "Deploy site"

### **Passo 3: Configurar formulários**
✅ **Netlify Forms já está configurado!**
- Os formulários têm `data-netlify="true"`
- reCAPTCHA tem `data-netlify-recaptcha="true"`
- Acesse Admin → Forms para ver submissões

### **Passo 4: Configurar domínio personalizado**
1. No painel Netlify: Site settings → Domain management
2. Adicione seu domínio personalizado
3. Configure DNS conforme instruções

---

## 🌐 **OPÇÃO 2: Deploy no Vercel**

### **Passo 1: Deploy**
```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Seguir instruções no terminal
```

### **Passo 2: Configurar formulários**
⚠️ **Vercel não suporta Netlify Forms**
1. Edite `config/integrations.js`:
```javascript
formspree: {
    enabled: true,
    endpoints: {
        newsletter: 'https://formspree.io/f/SEU_ID_NEWSLETTER',
        fontes: 'https://formspree.io/f/SEU_ID_FONTES'
    }
}
```
2. Registre-se em [formspree.io](https://formspree.io)
3. Crie formulários e obtenha os endpoints

---

## 🔧 **CONFIGURAÇÕES AVANÇADAS**

### **Google Analytics 4**
1. Acesse [analytics.google.com](https://analytics.google.com)
2. Crie propriedade GA4
3. Copie o Measurement ID (G-XXXXXXXXXX)
4. Edite `js/analytics.js`:
```javascript
GA_MEASUREMENT_ID: 'G-SEU_ID_AQUI'
```

### **Google Tag Manager (opcional)**
1. Acesse [tagmanager.google.com](https://tagmanager.google.com)
2. Crie container
3. Copie o Container ID (GTM-XXXXXXX)
4. Edite `js/analytics.js`:
```javascript
GTM_ID: 'GTM-SEU_ID_AQUI'
```

### **reCAPTCHA v3**
1. Acesse [google.com/recaptcha/admin](https://www.google.com/recaptcha/admin)
2. Adicione seu domínio
3. Copie a chave do site
4. Edite `js/recaptcha.js`:
```javascript
SITE_KEY: 'SUA_CHAVE_AQUI'
```
5. Configure a chave secreta no Netlify:
   - Site settings → Environment variables
   - Adicione: `RECAPTCHA_SECRET_KEY`

### **Disqus Comments**
1. Acesse [disqus.com](https://disqus.com)
2. Registre seu site
3. Obtenha o shortname
4. Edite `js/comments.js`:
```javascript
DISQUS_SHORTNAME: 'seu-shortname'
```

---

## 📧 **CONFIGURAÇÃO DE E-MAILS**

### **Netlify Forms (automático)**
- E-mails chegam automaticamente no e-mail do proprietário da conta
- Configure notificações em Site settings → Forms

### **Formspree**
- Configure webhooks para integração com outros serviços
- Exporte dados em CSV/JSON

### **Integração com Zapier (opcional)**
- Conecte Netlify Forms ou Formspree ao Zapier
- Automatize envio para Google Sheets, Slack, etc.

---

## 🔍 **MONITORAMENTO**

### **Analytics implementados:**
- ✅ **Page views** automáticos
- ✅ **Form submissions** (newsletter, denúncias)
- ✅ **Search queries** (sistema de busca)
- ✅ **Outbound links** tracking
- ✅ **Scroll depth** tracking
- ✅ **Time on page** tracking

### **Eventos customizados:**
```javascript
// Exemplo de uso
window.UbatubaAnalytics.trackEvent('engagement', 'video_play', {
    video_title: 'Nome do vídeo'
});
```

---

## ⚡ **PERFORMANCE**

### **Otimizações implementadas:**
- ✅ **Lazy loading** de imagens
- ✅ **Minified CSS/JS**
- ✅ **Font preloading**
- ✅ **Image optimization** (via Picsum placeholder)
- ✅ **Bootstrap CDN**

### **Próximos passos:**
- [ ] Implementar Service Worker (PWA)
- [ ] Configurar CDN para imagens
- [ ] Otimizar Core Web Vitals

---

## 🛡️ **SEGURANÇA**

### **Implementado:**
- ✅ **reCAPTCHA v3** anti-spam
- ✅ **Form validation** client-side
- ✅ **XSS protection** (escape HTML)
- ✅ **HTTPS** (automático no Netlify/Vercel)

### **Recomendações:**
- [ ] Implementar CSP headers
- [ ] Configurar rate limiting
- [ ] Backup regular dos dados

---

## 📱 **MOBILE & PWA**

### **Responsividade:**
- ✅ **Mobile-first** design
- ✅ **Bootstrap 5** responsive grid
- ✅ **Touch-friendly** navigation

### **PWA (opcional):**
```json
// manifest.json
{
    "name": "Ubatuba Reage",
    "short_name": "UbatubaReage",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#0e0e0e",
    "theme_color": "#007bff"
}
```

---

## 🚨 **TROUBLESHOOTING**

### **Formulários não funcionam:**
1. Verifique se está no Netlify (forms automáticos)
2. Ou configure Formspree (outros hosts)
3. Teste em produção, não localhost

### **Analytics não aparecem:**
1. Aguarde 24-48h para dados aparecerem
2. Verifique se IDs estão corretos
3. Teste em modo debug (console do navegador)

### **reCAPTCHA não carrega:**
1. Verifique se domínio está registrado
2. Confirme chaves no código
3. Teste em produção

### **Comentários não funcionam:**
1. Disqus: verifique shortname
2. Local: funciona apenas em produção
3. Limpe localStorage se necessário

---

## 📞 **SUPORTE**

### **Recursos úteis:**
- [Netlify Docs](https://docs.netlify.com/)
- [Vercel Docs](https://vercel.com/docs)
- [Bootstrap 5 Docs](https://getbootstrap.com/docs/5.0/)
- [Google Analytics Help](https://support.google.com/analytics/)

### **Próximas funcionalidades:**
- Sistema de busca avançado
- Painel administrativo
- API para mobile app
- Sistema de newsletters automático

---

**✅ MVP COMPLETO E PRONTO PARA PRODUÇÃO!**
