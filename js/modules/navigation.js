/**
 * Controla submenus no offcanvas
 */
export function initSubmenu() {
    const submenuItems = document.querySelectorAll('.has-submenu > .nav-link');

    submenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const submenu = this.nextElementSibling;
            if (!submenu) return;

            const isOpen = submenu.style.display === 'block';

            // Fecha outros submenus abertos
            document.querySelectorAll('.submenu').forEach(menu => {
                if (menu !== submenu) {
                    menu.style.display = 'none';
                    menu.previousElementSibling?.classList.remove('active');
                }
            });

            // Alterna o estado do submenu atual
            submenu.style.display = isOpen ? 'none' : 'block';
            this.classList.toggle('active', !isOpen);
        });
    });
    console.log('✅ Submenus inicializados');
}
