/* ==========================================
   RIDHO DEV ANALYTICS DASHBOARD - SCRIPT.JS
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. INITIALIZE LUCIDE ICONS
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. SIDEBAR & OVERLAY TOGGLE
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggleBtn = document.querySelector('#sidebar-toggle, .mobile-toggle, [data-sidebar-toggle]');
    const sidebarCloseBtn = document.querySelector('#sidebar-close, .sidebar-close');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');

    const closeSidebar = () => {
        if (sidebar) sidebar.classList.remove('active');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    };

    if (sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener('click', () => {
            if (sidebar) sidebar.classList.toggle('active');
            if (sidebarOverlay) sidebarOverlay.classList.toggle('active');
        });
    }

    if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

    // 3. THEME TOGGLE (DARK / LIGHT)
    const themeToggleBtn = document.querySelector('#theme-toggle, .theme-toggle');
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        if (savedTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    };
    initTheme();

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            if (isLight) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // 4. ANIMATE COUNTERS
    const animateCounters = () => {
        const counters = document.querySelectorAll('.stat-value, .metric-value');
        counters.forEach(counter => {
            const targetText = counter.getAttribute('data-target') || counter.innerText;
            const target = parseFloat(targetText.replace(/[^0-9.-]+/g, ''));
            if (isNaN(target)) return;
            
            let count = 0;
            const speed = 200;
            const inc = target / speed;

            const updateCount = () => {
                count += inc;
                if (count < target) {
                    if (targetText.includes('Rp')) {
                        counter.innerText = 'Rp ' + Math.ceil(count).toLocaleString('id-ID');
                    } else if (targetText.includes('%')) {
                        counter.innerText = count.toFixed(2) + '%';
                    } else {
                        counter.innerText = Math.ceil(count).toLocaleString('id-ID');
                    }
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = targetText;
                }
            };
            updateCount();
        });
    };

    // 5. NAVIGASI MENU SIDEBAR DINAMIS
    const mainContent = document.querySelector('.main-content') || document.querySelector('main');
    const originalDashboardHtml = mainContent ? mainContent.innerHTML : '';
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a, .sidebar a, .nav-item');

    sidebarLinks.forEach((link) => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === '#' || this.classList.contains('nav-item')) {
                e.preventDefault();
            }

            sidebarLinks.forEach(m => m.classList.remove('active'));
            this.classList.add('active');

            const menuText = this.querySelector('span')?.innerText.trim() || this.innerText.trim();

            if (!mainContent) return;

            if (menuText.toLowerCase().includes('dashboard') || menuText.toLowerCase().includes('utama')) {
                mainContent.innerHTML = originalDashboardHtml;
                animateCounters();
                if (typeof lucide !== 'undefined') lucide.createIcons();
            } else {
                mainContent.innerHTML = `
                    <div style="padding: 1rem 0;">
                        <div class="page-header" style="margin-bottom: 2rem;">
                            <h1 style="font-size: 1.8rem; font-weight: 700; color: #fff;">Halaman ${menuText}</h1>
                            <p style="color: #94a3b8;">Modul ${menuText} pada Ridho Dev Dashboard.</p>
                        </div>
                        <div class="card glass-card" style="padding: 2rem; border-radius: 12px; background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255, 255, 255, 0.1);">
                            <h3 style="color: #fff;">Panel ${menuText}</h3>
                            <p style="margin-top: 0.5rem; color: #94a3b8;">
                                Data dan informasi untuk modul <strong>${menuText}</strong> berhasil dimuat secara dinamis.
                            </p>
                        </div>
                    </div>
                `;
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }

            closeSidebar();
        });
    });

    animateCounters();
});

console.log('%c Ridho Dev Analytics Dashboard initialized successfully! ', 'background: #6366f1; color: #ffffff');

