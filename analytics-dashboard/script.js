/* ==========================================
   RIDHO DEV ANALYTICS DASHBOARD - FULL SCRIPT
   ========================================== */

let revenueChartInstance = null;
let visitorsChartInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    // 1. INITIALIZE LUCIDE ICONS
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. SIDEBAR & OVERLAY TOGGLE (MOBILE)
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
            if (typeof updateChartColors === 'function') updateChartColors();
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
            const speed = 40;
            const inc = target / speed;

            const updateCount = () => {
                count += inc;
                if (count < target) {
                    if (targetText.includes('Rp')) {
                        counter.innerText = 'Rp ' + Math.ceil(count).toLocaleString('id-ID');
                    } else if (targetText.includes('%')) {
                        counter.innerText = count.toFixed(2).replace('.', ',') + '%';
                    } else {
                        counter.innerText = Math.ceil(count).toLocaleString('id-ID');
                    }
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = targetText;
                }
            };
            updateCount();
        });
    };

    // 5. CHART INITIALIZATION (REVENUE & VISITORS)
    const initRevenueChart = () => {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;
        if (revenueChartInstance) revenueChartInstance.destroy();

        const chartCtx = ctx.getContext('2d');
        const gradient = chartCtx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

        revenueChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
                datasets: [{
                    label: 'Pendapatan',
                    data: [45, 52, 58, 65, 72, 68, 85, 92, 88, 96, 110, 128],
                    borderColor: '#6366f1',
                    borderWidth: 3,
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#6366f1',
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: 'rgba(255, 255, 255, 0.05)' } }
                }
            }
        });
    };

    const initVisitorsChart = () => {
        const ctx = document.getElementById('visitorsChart');
        if (!ctx) return;
        if (visitorsChartInstance) visitorsChartInstance.destroy();

        visitorsChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Pencarian Organik', 'Sosial Media', 'Rujukan (Referral)', 'Langsung (Direct)'],
                datasets: [{
                    data: [42, 28, 18, 12],
                    backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: { legend: { display: false } }
            }
        });
    };

    // 6. SEGMENTED CONTROL SWITCHER (BULANAN / MINGGUAN)
    const initSegmentedControl = () => {
        const segmentedBtns = document.querySelectorAll('.segmented-control button, [data-period]');
        segmentedBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                segmentedBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const period = btn.getAttribute('data-period');
                if (revenueChartInstance) {
                    if (period === 'weekly') {
                        revenueChartInstance.data.labels = ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'];
                        revenueChartInstance.data.datasets[0].data = [22, 28, 35, 43];
                    } else {
                        revenueChartInstance.data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
                        revenueChartInstance.data.datasets[0].data = [45, 52, 58, 65, 72, 68, 85, 92, 88, 96, 110, 128];
                    }
                    revenueChartInstance.update();
                }
            });
        });
    };

    // Fungsi Pembantu untuk Memuat Seluruh Komponen Dashboard Utama
    const loadDashboardComponents = () => {
        animateCounters();
        initRevenueChart();
        initVisitorsChart();
        initSegmentedControl();
        if (typeof lucide !== 'undefined') lucide.createIcons();
    };

    // 7. NAVIGASI MENU SIDEBAR DINAMIS (SEMUA MENU BISA DIKLIK)
    const mainContentArea = document.querySelector('.main-content') || document.querySelector('main');
    const originalDashboardHtml = mainContentArea ? mainContentArea.innerHTML : '';
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a, .sidebar a, .nav-item');

    sidebarLinks.forEach((link) => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === '#' || href.startsWith('javascript') || this.classList.contains('nav-item')) {
                e.preventDefault();
            }

            // Tandai Menu Aktif
            sidebarLinks.forEach(m => m.classList.remove('active'));
            this.classList.add('active');

            // Ambil Nama Menu
            const menuText = this.querySelector('span')?.innerText.trim() || this.innerText.trim();

            if (!mainContentArea) return;

            // Jika Klik "Dashboard" atau "Utama"
            if (menuText.toLowerCase().includes('dashboard') || menuText.toLowerCase().includes('utama')) {
                mainContentArea.innerHTML = originalDashboardHtml;
                loadDashboardComponents(); // Re-initialize chart & counter
            } else {
                // Tampilan Halaman Dinamis untuk Menu Lain
                mainContentArea.innerHTML = `
                    <div style="padding: 1rem 0;">
                        <div class="page-header" style="margin-bottom: 2rem;">
                            <h1 style="font-size: 1.8rem; font-weight: 700; color: #fff;">Halaman ${menuText}</h1>
                            <p style="color: #94a3b8;">Modul ${menuText} pada dashboard Ridho Dev.</p>
                        </div>
                        <div class="card glass-card" style="padding: 2rem; border-radius: 12px; background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255, 255, 255, 0.1);">
                            <h3 style="color: #fff; margin-bottom: 0.5rem;">Modul ${menuText}</h3>
                            <p style="color: #94a3b8;">
                                Fitur dan data untuk <strong>${menuText}</strong> berhasil dimuat secara dinamis. Silakan kelola informasi panel ini.
                            </p>
                        </div>
                    </div>
                `;
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }

            closeSidebar();
        });
    });

    // Inisialisasi Pertama Kali Saat Web Dibuka
    loadDashboardComponents();
});

console.log('%c Ridho Dev Analytics Dashboard initialized successfully! ', 'background: #6366f1; color: #ffffff');

