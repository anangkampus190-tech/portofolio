/**
 * Ridho Dev — Premium Analytics Dashboard
 * Author: Ridho Gusti Cahyadi
 * Description: Clean, modern, responsive vanilla JS dashboard logic.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* ==========================================================================
       1. STATE MANAGEMENT & DOM ELEMENTS
       ========================================================================== */
    const DOM = {
        html: document.documentElement,
        themeToggleBtn: document.getElementById('themeToggleBtn'),
        sidebar: document.getElementById('sidebar'),
        sidebarOverlay: document.getElementById('sidebarOverlay'),
        sidebarToggleBtn: document.getElementById('sidebarToggleBtn'),
        sidebarCloseBtn: document.getElementById('sidebarCloseBtn'),
        globalSearch: document.getElementById('globalSearch'),
        dropdownContainers: document.querySelectorAll('.dropdown-container'),
        counterElements: document.querySelectorAll('[data-counter]'),
        exportBtn: document.getElementById('exportBtn'),
        exportModal: document.getElementById('exportModal'),
        closeModalBtn: document.getElementById('closeModalBtn'),
        cancelModalBtn: document.getElementById('cancelModalBtn'),
        confirmExportBtn: document.getElementById('confirmExportBtn'),
        segmentedBtns: document.querySelectorAll('.segmented-btn'),
        rippleElements: document.querySelectorAll('.ripple')
    };

    /* ==========================================================================
       2. THEME SWITCHER (DARK / LIGHT MODE)
       ========================================================================== */
    const initTheme = () => {
        const savedTheme = localStorage.getItem('ridho_dev_theme') || 'dark';
        DOM.html.setAttribute('data-theme', savedTheme);
    };

    const toggleTheme = () => {
        const currentTheme = DOM.html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        DOM.html.setAttribute('data-theme', newTheme);
        localStorage.setItem('ridho_dev_theme', newTheme);

        // Update charts to match theme
        updateChartColors(newTheme);
    };

    if (DOM.themeToggleBtn) {
        DOM.themeToggleBtn.addEventListener('click', toggleTheme);
    }

    /* ==========================================================================
       3. SIDEBAR RESPONSIVE TOGGLE
       ========================================================================== */
    const openSidebar = () => {
        DOM.sidebar.classList.add('open');
        DOM.sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeSidebar = () => {
        DOM.sidebar.classList.remove('open');
        DOM.sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (DOM.sidebarToggleBtn) DOM.sidebarToggleBtn.addEventListener('click', openSidebar);
    if (DOM.sidebarCloseBtn) DOM.sidebarCloseBtn.addEventListener('click', closeSidebar);
    if (DOM.sidebarOverlay) DOM.sidebarOverlay.addEventListener('click', closeSidebar);

    /* ==========================================================================
       4. DROPDOWN MANAGEMENT
       ========================================================================== */
    DOM.dropdownContainers.forEach(container => {
        const trigger = container.querySelector('.dropdown-trigger');

        if (trigger) {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Close other open dropdowns
                DOM.dropdownContainers.forEach(otherContainer => {
                    if (otherContainer !== container) {
                        otherContainer.classList.remove('open');
                    }
                });

                container.classList.toggle('open');
            });
        }
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        DOM.dropdownContainers.forEach(container => {
            container.classList.remove('open');
        });
    });

    /* ==========================================================================
       5. COUNTER ANIMATION
       ========================================================================== */
    const animateCounters = () => {
        DOM.counterElements.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-counter'));
            const prefix = counter.getAttribute('data-prefix') || '';
            const suffix = counter.getAttribute('data-suffix') || '';
            const decimals = parseInt(counter.getAttribute('data-decimals')) || 0;
            const duration = 1500; // ms
            const stepTime = 20; // ms
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }

                let formattedValue = current.toLocaleString('id-ID', {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals
                });

                counter.textContent = `${prefix}${formattedValue}${suffix}`;
            }, stepTime);
        });
    };

    /* ==========================================================================
       6. RIPPLE BUTTON EFFECT
       ========================================================================== */
    DOM.rippleElements.forEach(button => {
        button.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    /* ==========================================================================
       7. KEYBOARD SHORTCUTS
       ========================================================================== */
    document.addEventListener('keydown', (e) => {
        // Ctrl + K or Cmd + K -> Focus Search
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (DOM.globalSearch) {
                DOM.globalSearch.focus();
            }
        }

        // Escape Key -> Close Modals and Sidebar
        if (e.key === 'Escape') {
            if (DOM.exportModal && DOM.exportModal.classList.contains('active')) {
                closeModal();
            }
            closeSidebar();
            DOM.dropdownContainers.forEach(container => container.classList.remove('open'));
        }
    });

    /* ==========================================================================
       8. EXPORT MODAL LOGIC
       ========================================================================== */
    const openModal = () => {
        if (DOM.exportModal) DOM.exportModal.classList.add('active');
    };

    const closeModal = () => {
        if (DOM.exportModal) DOM.exportModal.classList.remove('active');
    };

    if (DOM.exportBtn) DOM.exportBtn.addEventListener('click', openModal);
    if (DOM.closeModalBtn) DOM.closeModalBtn.addEventListener('click', closeModal);
    if (DOM.cancelModalBtn) DOM.cancelModalBtn.addEventListener('click', closeModal);

    if (DOM.confirmExportBtn) {
        DOM.confirmExportBtn.addEventListener('click', () => {
            const selectedFormat = document.querySelector('input[name="exportFormat"]:checked')?.value || 'pdf';
            DOM.confirmExportBtn.innerHTML = '<i data-lucide="loader"></i> Memproses...';
            if (typeof lucide !== 'undefined') lucide.createIcons();

            setTimeout(() => {
                alert(`Laporan berhasil diekspor dalam format ${selectedFormat.toUpperCase()}!`);
                closeModal();
                DOM.confirmExportBtn.innerHTML = '<i data-lucide="download"></i> Download Laporan';
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }, 1000);
        });
    }

    /* ==========================================================================
       9. CHART.JS INITIALIZATION & DATA
       ========================================================================== */
    let revenueChartInstance = null;
    let visitorsChartInstance = null;

    const getChartThemeColors = (isDark) => {
        return {
            textPrimary: isDark ? '#f8fafc' : '#0f172a',
            textMuted: isDark ? '#64748b' : '#94a3b8',
            gridColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
            cardBg: isDark ? '#121621' : '#ffffff'
        };
    };

    // Revenue Chart (Line / Area)
    const initRevenueChart = () => {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;

        const isDark = DOM.html.getAttribute('data-theme') === 'dark';
        const colors = getChartThemeColors(isDark);

        const monthlyLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const revenueData = [45, 52, 58, 65, 72, 68, 85, 92, 88, 96, 110, 128];
        const salesData = [30, 38, 42, 48, 55, 50, 62, 70, 65, 74, 82, 95];

        const gradientPrimary = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
        gradientPrimary.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
        gradientPrimary.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

        const gradientSuccess = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
        gradientSuccess.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
        gradientSuccess.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

        revenueChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: monthlyLabels,
                datasets: [
                    {
                        label: 'Pendapatan (Juta Rp)',
                        data: revenueData,
                        borderColor: '#6366f1',
                        borderWidth: 3,
                        backgroundColor: gradientPrimary,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#6366f1',
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Total Penjualan',
                        data: salesData,
                        borderColor: '#10b981',
                        borderWidth: 2,
                        backgroundColor: gradientSuccess,
                        borderDash: [5, 5],
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#10b981',
                        pointHoverRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: {
                            color: colors.textPrimary,
                            usePointStyle: true,
                            boxWidth: 8,
                            font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' }
                        }
                    },
                    tooltip: {
                        backgroundColor: colors.cardBg,
                        titleColor: colors.textPrimary,
                        bodyColor: colors.textMuted,
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        padding: 12,
                        boxPadding: 6,
                        usePointStyle: true,
                        bodyFont: { family: 'Plus Jakarta Sans' }
                    }
                },
                scales: {
                    x: {
                        grid: { color: colors.gridColor },
                        ticks: { color: colors.textMuted, font: { family: 'Plus Jakarta Sans', size: 11 } }
                    },
                    y: {
                        grid: { color: colors.gridColor },
                        ticks: { color: colors.textMuted, font: { family: 'Plus Jakarta Sans', size: 11 } }
                    }
                }
            }
        });
    };

    // Visitors Chart (Doughnut)
    const initVisitorsChart = () => {
        const ctx = document.getElementById('visitorsChart');
        if (!ctx) return;

        const isDark = DOM.html.getAttribute('data-theme') === 'dark';
        const colors = getChartThemeColors(isDark);

        const visitorData = {
            labels: ['Pencarian Organik', 'Sosial Media', 'Rujukan (Referral)', 'Langsung (Direct)'],
            datasets: [{
                data: [42, 28, 18, 12],
                backgroundColor: ['#6366f1', '#10b981', '#06b6d4', '#f59e0b'],
                borderWidth: 0,
                hoverOffset: 6
            }]
        };

        visitorsChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: visitorData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: colors.cardBg,
                        titleColor: colors.textPrimary,
                        bodyColor: colors.textMuted,
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                return ` ${context.label}: ${context.raw}%`;
                            }
                        }
                    }
                }
            }
        });

        // Generate Custom Legend
        const legendContainer = document.getElementById('donutLegend');
        if (legendContainer) {
            legendContainer.innerHTML = '';
            visitorData.labels.forEach((label, index) => {
                const color = visitorData.datasets[0].backgroundColor[index];
                const value = visitorData.datasets[0].data[index];

                const itemHtml = `
                    <div class="legend-item">
                        <div class="legend-info">
                            <span class="legend-color" style="background-color: ${color}"></span>
                            <span>${label}</span>
                        </div>
                        <span class="legend-value">${value}%</span>
                    </div>
                `;
                legendContainer.innerHTML += itemHtml;
            });
        }
    };

    // Update Chart Colors dynamically on Theme Toggle
    const updateChartColors = (theme) => {
        const isDark = theme === 'dark';
        const colors = getChartThemeColors(isDark);

        if (revenueChartInstance) {
            revenueChartInstance.options.plugins.legend.labels.color = colors.textPrimary;
            revenueChartInstance.options.plugins.tooltip.backgroundColor = colors.cardBg;
            revenueChartInstance.options.plugins.tooltip.titleColor = colors.textPrimary;
            revenueChartInstance.options.plugins.tooltip.bodyColor = colors.textMuted;
            revenueChartInstance.options.scales.x.grid.color = colors.gridColor;
            revenueChartInstance.options.scales.x.ticks.color = colors.textMuted;
            revenueChartInstance.options.scales.y.grid.color = colors.gridColor;
            revenueChartInstance.options.scales.y.ticks.color = colors.textMuted;
            revenueChartInstance.update();
        }

        if (visitorsChartInstance) {
            visitorsChartInstance.options.plugins.tooltip.backgroundColor = colors.cardBg;
            visitorsChartInstance.options.plugins.tooltip.titleColor = colors.textPrimary;
            visitorsChartInstance.options.plugins.tooltip.bodyColor = colors.textMuted;
            visitorsChartInstance.update();
        }
    };

    /* ==========================================================================
       10. SEGMENTED CONTROL SWITCHER (MONTHLY / WEEKLY)
       ========================================================================== */
    DOM.segmentedBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            DOM.segmentedBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const period = btn.getAttribute('data-period');
            if (revenueChartInstance) {
                if (period === 'weekly') {
                    revenueChartInstance.data.labels = ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'];
                    revenueChartInstance.data.datasets[0].data = [22, 28, 35, 43];
                    revenueChartInstance.data.datasets[1].data = [15, 20, 24, 31];
                } else {
                    revenueChartInstance.data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
                    revenueChartInstance.data.datasets[0].data = [45, 52, 58, 65, 72, 68, 85, 92, 88, 96, 110, 128];
                    revenueChartInstance.data.datasets[1].data = [30, 38, 42, 48, 55, 50, 62, 70, 65, 74, 82, 95];
                }
                revenueChartInstance.update();
            }
        });
    });

    /* ==========================================================================
       11. INITIALIZATION EXECUTION
       ========================================================================== */
    initTheme();
    animateCounters();
    initRevenueChart();
    initVisitorsChart();

    console.log('%c Ridho Dev Analytics Dashboard initialized successfully! ', 'background: #6366f1; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
});

