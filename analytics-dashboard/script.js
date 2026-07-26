k                plugins: {
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




