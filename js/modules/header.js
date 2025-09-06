import { isMobile } from './utils.js';

let isMenuOpen = false;

function initHeaderScroll() {
    const header = document.querySelector('.header-main');
    if (!header) return;

    let lastScrollTop = 0;
    let ticking = false;

    function updateHeader() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (!isMobile()) {
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
}

function initMenuToggle() {
    const offcanvasMenu = document.getElementById('offcanvasMenu');
    const hamburgerIcon = document.querySelector('.hamburger-icon');

    if (!offcanvasMenu || !hamburgerIcon) return;

    offcanvasMenu.addEventListener('show.bs.offcanvas', function() {
        isMenuOpen = true;
        hamburgerIcon.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    offcanvasMenu.addEventListener('hide.bs.offcanvas', function() {
        isMenuOpen = false;
        hamburgerIcon.classList.remove('active');
        document.body.style.overflow = '';
    });
}

function initHeaderSearch() {
    const searchForm = document.querySelector('.search-widget form');
    const searchInput = document.querySelector('.search-widget input');

    if (!searchForm || !searchInput) return;

    document.getElementById('offcanvasMenu')?.addEventListener('shown.bs.offcanvas', function() {
        setTimeout(() => searchInput.focus(), 300);
    });

    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const query = searchInput.value.trim();

        if (query) {
            // Redirect to the actual search page
            window.location.href = `/busca.html?q=${encodeURIComponent(query)}`;
        }
    });
}

export function initHeader() {
    initHeaderScroll();
    initMenuToggle();
    initHeaderSearch();
    console.log('✅ Header inicializado');
}
