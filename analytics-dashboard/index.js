document.addEventListener('DOMContentLoaded', () => {
    // 1. Inisialisasi Lucide Icons
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // 2. Sidebar & Overlay Toggle
    const sidebar = document.getElementById('sidebar');
    const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
    const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    const closeSidebar = () => {
        sidebar?.classList.remove('active');
        sidebarOverlay?.classList.remove('active');
    };

    sidebarToggleBtn?.addEventListener('click', () => {
        sidebar?.classList.add('active');
        sidebarOverlay?.classList.add('active');
    });
    sidebarCloseBtn?.addEventListener('click', closeSidebar);
    sidebarOverlay?.addEventListener('click', closeSidebar);

    // 3. Dropdown Menu (Notifikasi & Profil)
    document.querySelectorAll('.dropdown-container').forEach(container => {
        const trigger = container.querySelector('.dropdown-trigger');
        trigger?.addEventListener('click', (e) => {
            e.stopPropagation();
            container.classList.toggle('active');
        });
    });
    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-container').forEach(c => c.classList.remove('active'));
    });

    // 4. Dark / Light Theme Toggle
    document.getElementById('themeToggleBtn')?.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        document.documentElement.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
    });

    // 5. Modal Ekspor Data
    const exportModal = document.getElementById('exportModal');
    document.getElementById('exportBtn')?.addEventListener('click', () => exportModal?.classList.add('active'));
    document.getElementById('closeModalBtn')?.addEventListener('click', () => exportModal?.classList.remove('active'));
    document.getElementById('cancelModalBtn')?.addEventListener('click', () => exportModal?.classList.remove('active'));

    // 6. Simpan Tampilan Asli Dashboard
    const mainContent = document.querySelector('.content-body');
    const originalDashboard = mainContent ? mainContent.innerHTML : '';

    // 7. Event Handler Menu Sidebar
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            // Aktifkan indikator menu
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            const menuName = item.querySelector('span')?.innerText.trim();
            if (!mainContent) return;

            if (menuName === 'Dashboard') {
                mainContent.innerHTML = originalDashboard;
                initCharts(); // Re-render grafik saat kembali ke Dashboard
            } else {
                // Tampilkan halaman modul dengan rapi
                mainContent.innerHTML = '';
                
                const headerDiv = document.createElement('div');
                headerDiv.className = 'page-header';
                
                const title = document.createElement('h1');
                title.textContent = 'Halaman ' + menuName;
                
                const subtitle = document.createElement('p');
                subtitle.textContent = 'Ini adalah tampilan modul ' + menuName + ' pada dashboard Ridho Dev.';
                
                headerDiv.appendChild(title);
                headerDiv.appendChild(subtitle);

                const cardDiv = document.createElement('div');
                cardDiv.className = 'card glass-card';
                cardDiv.style.padding = '2rem';
                cardDiv.innerHTML = '<h3>Statistik ' + menuName + '</h3><p>Data dan laporan untuk modul <strong>' + menuName + '</strong> siap dikembangkan lebih lanjut.</p>';

                mainContent.appendChild(headerDiv);
                mainContent.appendChild(cardDiv);
            }

            if (typeof lucide !== 'undefined') lucide.createIcons();
            closeSidebar();
        });
    });

    // 8. Fungsi Render Grafik
    function initCharts() {
        const revCanvas = document.getElementById('revenueChart');
        if (revCanvas && typeof Chart !== 'undefined') {
            new Chart(revCanvas, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul'],
                    datasets: [{
                        label: 'Pendapatan',
                        data: [45, 52, 58, 65, 72, 85, 128],
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.2)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }
    }

    initCharts();
});

