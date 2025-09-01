# 🌊 Ubatuba Reage

Portal de notícias independente da cidade de Ubatuba - SP

> *"Ubatuba não é terra de ninguém. É nossa."*

## 📖 Sobre o Projeto

O **Ubatuba Reage** é um movimento cidadão independente que visa dar visibilidade às questões da nossa cidade. Não somos partido, não somos mídia oficial - somos a voz de uma comunidade que quer ver Ubatuba prosperar.

### 🎯 Nossos Objetivos
- 📢 Dar visibilidade às denúncias da população
- ✊ Transformar informação em pressão pública  
- 🌱 Cobrar soluções e celebrar vitórias
- 🤝 Fortalecer a participação cidadã

## ⚡ Funcionalidades

### 🏠 Portal Principal
- ✅ Design responsivo (mobile-first)
- ✅ Feed de notícias organizado por categorias
- ✅ Sistema de newsletter
- ✅ Banner de apoio/doações

### 🔍 Sistema de Busca
- ✅ Busca em tempo real
- ✅ Filtros por categoria
- ✅ Ordenação por relevância/data
- ✅ Destaque de termos pesquisados

### 📝 Formulários Inteligentes  
- ✅ Newsletter com validação
- ✅ "Seja nossa fonte" (denúncias anônimas)
- ✅ Proteção anti-spam (reCAPTCHA v3)
- ✅ Estados visuais de carregamento

### 👤 Sistema Administrativo
- ✅ Painel CMS (Decap) para criação de conteúdo
- ✅ Sistema de login integrado
- ✅ Controle de acesso (admin/editor/colaborador)
- ✅ Dashboard protegido

### 📊 Monitoramento
- ✅ Google Analytics 4
- ✅ Métricas avançadas (scroll, tempo, downloads)
- ✅ Sistema de comentários (Disqus)

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Framework CSS**: Bootstrap 5.3
- **CMS**: Decap CMS (Netlify CMS)
- **Hosting**: Netlify
- **Formulários**: Netlify Forms
- **Autenticação**: Netlify Identity
- **Analytics**: Google Analytics 4 + Google Tag Manager
- **Comentários**: Disqus
- **Segurança**: reCAPTCHA v3

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js (para Netlify CLI)
- Git

### Instalação
```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/ubatuba-reage.git
cd ubatuba-reage

# Instale o Netlify CLI (se não tiver)
npm install -g netlify-cli

# Inicie o servidor local
netlify dev
```

O site estará disponível em `http://localhost:8888`

## 📁 Estrutura do Projeto

```
/
├── admin/                 # Painel administrativo (Decap CMS)
├── categoria/            # Páginas de categoria
├── config/               # Configurações de integração
├── data/                 # Dados JSON (artigos, busca)
├── js/                   # Scripts JavaScript
├── materia/              # Páginas de artigos
├── index.html            # Página principal
├── busca.html            # Página de busca
├── fontes.html           # Formulário de denúncias
├── sobre.html            # Sobre o projeto
├── styles.css            # Estilos customizados
├── script.js             # Script principal
├── netlify.toml          # Configuração Netlify
└── README.md             # Este arquivo
```

## 🔧 Configuração para Produção

### 1. Variáveis de Ambiente
Configure no Netlify:
- `GOOGLE_ANALYTICS_ID`: Seu ID do GA4
- `GOOGLE_TAG_MANAGER_ID`: Seu ID do GTM  
- `RECAPTCHA_SITE_KEY`: Chave pública do reCAPTCHA
- `DISQUS_SHORTNAME`: Nome do seu site no Disqus

### 2. Netlify Identity
- Ative o Netlify Identity no dashboard
- Configure como `invite_only`
- Adicione usuários com roles: `admin`, `editor`, `contributor`

### 3. Git Gateway
- Ative no Netlify para permitir edição via CMS
- Configure branch padrão como `main`

## 🤝 Como Contribuir

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

- **Site**: [ubatubareage.com.br](https://ubatubareage.com.br)
- **Email**: contato@ubatubareage.com.br
- **Redes Sociais**: @ubatubareage

---

**Desenvolvido com ❤️ pela comunidade de Ubatuba**

*Se você acredita que Ubatuba merece respeito, reaja com a gente!*