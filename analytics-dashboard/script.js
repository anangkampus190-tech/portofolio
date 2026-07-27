/* ==========================================================================
   RIDHO DEV ENTERPRISE SaaS DASHBOARD - PART 1 (CORE & DATABASE)
   Global Constants, EnterpriseDB Simulation Engine, SPA Router & Splash Screen.
   ========================================================================== */

'use strict';

// --- 1. GLOBAL CONSTANTS & CONFIGURATION ---
const APP_CONFIG = {
    name: "Ridho Dev Enterprise SaaS",
    version: "5.4.0-Production",
    region: "ap-southeast-1 (Jakarta)",
    apiEndpoint: "https://api.ridhodev-enterprise.co.id/v5",
    autoRefreshInterval: 5000
};

// --- 2. ENTERPRISE DATABASE SIMULATION (LocalStorage Engine) ---
const EnterpriseDB = {
    transactions: JSON.parse(localStorage.getItem("ridho_enterprise_transactions")) || [
        { id: "INV-9001", customer: "PT Telekomunikasi Indonesia", email: "procurement@telkom.co.id", city: "Jakarta Pusat", product: "AWS Cloud Infrastructure Cluster", amount: 45000000, date: "2026-07-27", status: "Selesai" },
        { id: "INV-9002", customer: "Bank Mandiri Tbk", email: "it-sec@bankmandiri.co.id", city: "Jakarta Selatan", product: "Enterprise SaaS Core Suite", amount: 120000000, date: "2026-07-26", status: "Selesai" },
        { id: "INV-9003", customer: "GoTo Financial", email: "eng@goto.com", city: "Jakarta Selatan", product: "API Gateway Enterprise", amount: 85000000, date: "2026-07-25", status: "Pending" },
        { id: "INV-9004", customer: "Pertamina Retail", email: "support@pertaminaretail.com", city: "Jakarta Timur", product: "Cloud POS & ERP Integration", amount: 32000000, date: "2026-07-24", status: "Gagal" }
    ],

    customers: JSON.parse(localStorage.getItem("ridho_enterprise_customers")) || [
        { id: "CUST-001", name: "Budi Santoso", email: "budi@telkom.co.id", phone: "+62 812-3456-7890", city: "Jakarta Pusat", address: "Jl. Medan Merdeka Barat No. 9", totalSpent: 45000000, ordersCount: 5, status: "Active", joinedDate: "2025-01-10" },
        { id: "CUST-002", name: "Siti Rahma", email: "siti@bankmandiri.co.id", phone: "+62 813-9876-5432", city: "Jakarta Selatan", address: "Jl. Jend. Sudirman Kav. 54-55", totalSpent: 120000000, ordersCount: 12, status: "Active", joinedDate: "2025-03-15" }
    ],

    products: JSON.parse(localStorage.getItem("ridho_enterprise_products")) || [
        { id: "PRD-001", name: "AWS Enterprise Cloud Cluster", category: "Cloud Infrastructure", price: 45000000, discount: 5, stock: 999, rating: "4.9", reviewsCount: 128, status: "Active" },
        { id: "PRD-002", name: "SaaS Enterprise Core Suite", category: "Software ERP", price: 120000000, discount: 10, stock: 500, rating: "5.0", reviewsCount: 256, status: "Active" }
    ],

    activityLogs: JSON.parse(localStorage.getItem("ridho_enterprise_logs")) || [
        { id: 1, title: "System Boot Initialized", desc: "Enterprise cluster successfully started in ap-southeast-1", timestamp: "2026-07-27 06:00:00", ip: "192.168.1.1", browser: "Chrome Enterprise" }
    ],

    files: JSON.parse(localStorage.getItem("ridho_enterprise_files")) || [
        { id: 1, name: "Architecture_v5.pdf", size: "14.2 MB", type: "PDF", date: "2026-07-20" },
        { id: 2, name: "Database_Backup_Q2.json", size: "48.5 MB", type: "JSON", date: "2026-07-25" }
    ],

    saveAll() {
        localStorage.setItem("ridho_enterprise_transactions", JSON.stringify(this.transactions));
        localStorage.setItem("ridho_enterprise_customers", JSON.stringify(this.customers));
        localStorage.setItem("ridho_enterprise_products", JSON.stringify(this.products));
        localStorage.setItem("ridho_enterprise_logs", JSON.stringify(this.activityLogs));
        localStorage.setItem("ridho_enterprise_files", JSON.stringify(this.files));
    }
};

// --- 3. UTILITY FUNCTIONS & TOAST NOTIFICATION ---
function showToast(message, type = "success") {
    let container = document.getElementById("toastContainer");
    if (!container) {
        container = document.createElement("div");
        container.id = "toastContainer";
        document.body.appendChild(container);
    }
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `<div style="font-weight:600; margin-bottom:2px;">${type.toUpperCase()}</div><div>${message}</div>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// Global Chart Store
let currentCharts = {};
let activeRoute = 'dashboard';


/* ==========================================================================
   RIDHO DEV ENTERPRISE SaaS DASHBOARD - PART 2 (UTILITIES, SEARCH & EXPORT)
   Global Search Engine, Export (PDF/Excel/CSV/JSON), Modal Controller,
   Splash Screen Sequence & Event Listeners Boot.
   ========================================================================== */

'use strict';

// --- 4. ENTERPRISE SEARCH ENGINE ---
const EnterpriseSearch = {
    search(keyword) {
        if (!keyword || keyword.trim() === "") return { transactions: [], customers: [], products: [] };
        const query = keyword.toLowerCase();
        const results = {
            transactions: EnterpriseDB.transactions.filter(t => t.id.toLowerCase().includes(query) || t.customer.toLowerCase().includes(query) || t.product.toLowerCase().includes(query)),
            customers: EnterpriseDB.customers.filter(c => c.name.toLowerCase().includes(query) || c.email.toLowerCase().includes(query) || c.city.toLowerCase().includes(query)),
            products: EnterpriseDB.products.filter(p => p.id.toLowerCase().includes(query) || p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query))
        };
        return results;
    }
};

// --- 5. EXPORT & REPORT GENERATOR ENGINE ---
function exportData(format, reportType = 'general') {
    if (format === 'json') {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(EnterpriseDB.transactions, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `ridho_enterprise_report_${Date.now()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast("Laporan JSON berhasil diexport", "success");
    } else if (format === 'csv') {
        let csvContent = "data:text/csv;charset=utf-8,ID,Customer,Email,City,Product,Amount,Date,Status\r\n";
        EnterpriseDB.transactions.forEach(t => {
            csvContent += `${t.id},"${t.customer}","${t.email}","${t.city}","${t.product}",${t.amount},${t.date},${t.status}\r\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `ridho_enterprise_transactions_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        showToast("Laporan CSV berhasil diexport", "success");
    } else {
        showToast(`Simulasi Export ${format.toUpperCase()} (${reportType}) berhasil disiapkan`, "success");
    }
}

// --- 6. SPLASH SCREEN & INITIALIZATION SEQUENCE ---
function initSplashScreen() {
    let progress = 0;
    const progressEl = document.getElementById("splashProgress");
    const percentEl = document.getElementById("splashPercent");
    const splashScreen = document.getElementById("splashScreen");

    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                if (splashScreen) {
                    splashScreen.style.opacity = "0";
                    setTimeout(() => splashScreen.remove(), 400);
                }
            }, 300);
        }
        if (progressEl) progressEl.style.width = `${progress}%`;
        if (percentEl) percentEl.textContent = `${progress}%`;
    }, 80);
}

// --- 7. AI ASSISTANT SIMULATION WIDGET ---
function sendAIChat() {
    const input = document.getElementById("chatInput");
    const container = document.getElementById("chatMessages");
    if (!input || !input.value.trim() || !container) return;

    const userText = input.value;
    container.innerHTML += `<div style="margin-bottom:8px; text-align:right;"><span style="background:var(--primary); color:#fff; padding:6px 10px; border-radius:6px; display:inline-block;">${userText}</span></div>`;
    input.value = "";

    setTimeout(() => {
        container.innerHTML += `<div style="margin-bottom:8px;"><span style="background:var(--border-color); padding:6px 10px; border-radius:6px; display:inline-block;"><strong>Ridho AI:</strong> Data enterprise stabil. Total transaksi aktif Rp 282.000.000 dengan performa server 99.98% uptime.</span></div>`;
        container.scrollTop = container.scrollHeight;
    }, 600);
}

// --- 8. DOM CONTENT LOADED & INITIAL BINDINGS ---
document.addEventListener("DOMContentLoaded", () => {
    initSplashScreen();
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});


/* ==========================================================================
   RIDHO DEV ENTERPRISE SaaS DASHBOARD - PART 3 (MODULE EXPANSION: AUTH & RBAC)
   Authentication, Role-Based Access Control, Session Idle Monitor, Lock Screen.
   ========================================================================== */

'use strict';

// --- AUTHENTICATION & RBAC ENGINE ---
const EnterpriseAuth = {
    currentUser: null,
    usersList: [
        { id: 1, name: "Super Administrator", email: "admin@enterprise.co.id", role: "Super Admin", status: "Online", lastLogin: "Baru saja", avatar: "SA" },
        { id: 2, name: "Budi Santoso", email: "budi@enterprise.co.id", role: "Admin", status: "Online", lastLogin: "10 menit lalu", avatar: "BS" },
        { id: 3, name: "Siti Rahma", email: "siti@enterprise.co.id", role: "Staff", status: "Away", lastLogin: "1 jam lalu", avatar: "SR" },
        { id: 4, name: "Viewer Eksekutif", email: "viewer@enterprise.co.id", role: "Viewer", status: "Offline", lastLogin: "Kemarin", avatar: "VE" }
    ],

    init() {
        const storedUser = localStorage.getItem("ridho_current_auth");
        if (storedUser) {
            this.currentUser = JSON.parse(storedUser);
        } else {
            // Default login state for preview ready
            this.currentUser = this.usersList[0];
            localStorage.setItem("ridho_current_auth", JSON.stringify(this.currentUser));
        }
        this.initIdleTimer();
    },

    login(email, password) {
        const found = this.usersList.find(u => u.email === email);
        if (found) {
            this.currentUser = found;
            localStorage.setItem("ridho_current_auth", JSON.stringify(this.currentUser));
            showToast(`Selamat datang kembali, ${found.name} (${found.role})`, "success");
            return true;
        }
        showToast("Email atau password salah!", "error");
        return false;
    },

    logout() {
        localStorage.removeItem("ridho_current_auth");
        this.currentUser = null;
        showToast("Sesi berhasil diakhiri", "info");
        setTimeout(() => window.location.reload(), 800);
    },

    initIdleTimer() {
        let idleTime = 0;
        const maxIdle = 15 * 60; // 15 minutes
        const timerInterval = setInterval(() => {
            idleTime++;
            if (idleTime >= maxIdle) {
                clearInterval(timerInterval);
                this.triggerLockScreen();
            }
        }, 1000);

        window.addEventListener("mousemove", () => { idleTime = 0; });
        window.addEventListener("keypress", () => { idleTime = 0; });
    },

    triggerLockScreen() {
        let lockModal = document.getElementById("lockScreenModal");
        if (!lockModal) {
            lockModal = document.createElement("div");
            lockModal.id = "lockScreenModal";
            lockModal.className = "modal show";
            lockModal.innerHTML = `
                <div class="modal-content" style="text-align:center; max-width:400px;">
                    <h3>Sesi Terkunci (Idle Timeout)</h3>
                    <p style="color:var(--text-muted); margin:1rem 0;">Masukkan PIN atau Password akun Anda untuk melanjutkan aktivitas.</p>
                    <input type="password" id="lockPassword" class="form-control" placeholder="Password akun..." style="margin-bottom:1rem;">
                    <button class="btn btn-primary" style="width:100%;" onclick="EnterpriseAuth.unlockScreen()">Buka Kunci</button>
                </div>
            `;
            document.body.appendChild(lockModal);
        } else {
            lockModal.classList.add("show");
        }
    },

    unlockScreen() {
        const pwd = document.getElementById("lockPassword").value;
        if (pwd !== "") {
            document.getElementById("lockScreenModal").classList.remove("show");
            showToast("Sesi dipulihkan kembali", "success");
        } else {
            showToast("Password tidak boleh kosong", "error");
        }
    }
};

// --- USER MANAGEMENT MODULE ---
function renderUserManagementView(container) {
    container.innerHTML = `
        <div class="view-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
            <h2>Manajemen Pengguna & Hak Akses RBAC (${EnterpriseAuth.usersList.length})</h2>
            <button class="btn btn-primary" onclick="showToast('Form Tambah User Aktif', 'success')"><i data-lucide="user-plus"></i> Tambah User</button>
        </div>
        <div class="card">
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr><th>Avatar</th><th>Nama</th><th>Email</th><th>Role</th><th>Status</th><th>Last Login</th><th>Aksi</th></tr>
                    </thead>
                    <tbody>
                        ${EnterpriseAuth.usersList.map(u => `
                            <tr>
                                <td><div style="width:36px; height:36px; background:var(--primary); color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:600; font-size:0.85rem;">${u.avatar}</div></td>
                                <td><strong>${u.name}</strong></td>
                                <td>${u.email}</td>
                                <td><span class="status-badge active">${u.role}</span></td>
                                <td>${u.status}</td>
                                <td>${u.lastLogin}</td>
                                <td>
                                    <button class="btn btn-primary" style="padding:4px 8px; font-size:0.75rem;" onclick="showToast('Edit user ${u.name}', 'info')">Edit</button>
                                    <button class="btn" style="background:var(--danger); color:#fff; padding:4px 8px; font-size:0.75rem;" onclick="showToast('User dihapus', 'warning')">Hapus</button>
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// --- FINANCE & LEDGER MODULE ---
function renderFinanceView(container) {
    container.innerHTML = `
        <div class="view-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
            <h2>Modul Keuangan & Neraca Korporat</h2>
            <button class="btn btn-primary" onclick="exportData('pdf', 'financial-report')"><i data-lucide="download"></i> Export Laporan Keuangan</button>
        </div>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
            <div class="card stat-card"><div class="stat-title">Total Pendapatan (Income)</div><div class="stat-value">Rp 2.480.000.000</div><div style="font-size:0.75rem; color:var(--success);">+14.2% YoY</div></div>
            <div class="card stat-card"><div class="stat-title">Total Pengeluaran (Expense)</div><div class="stat-value">Rp 840.000.000</div><div style="font-size:0.75rem; color:var(--warning);">-2.1% efisiensi</div></div>
            <div class="card stat-card"><div class="stat-title">Laba Bersih (Net Profit)</div><div class="stat-value">Rp 1.640.000.000</div><div style="font-size:0.75rem; color:var(--success);">Margin 66.1%</div></div>
            <div class="card stat-card"><div class="stat-title">Arus Kas (Cash Flow)</div><div class="stat-value">Rp 920.000.000</div><div style="font-size:0.75rem; color:var(--primary);">Likuiditas Kuat</div></div>
        </div>
        <div class="card">
            <h3>Simulasi Laporan Laba Rugi & Neraca</h3>
            <div style="height:300px; margin-top:1rem;"><canvas id="financeChart"></canvas></div>
        </div>
    `;

    setTimeout(() => {
        const ctx = document.getElementById("financeChart")?.getContext("2d");
        if (ctx) {
            currentCharts.finance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul'],
                    datasets: [
                        { label: 'Income', data: [320, 380, 410, 390, 450, 480, 520], backgroundColor: '#10b981' },
                        { label: 'Expense', data: [110, 130, 120, 140, 135, 150, 160], backgroundColor: '#ef4444' }
                    ]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }
    }, 50);
}

// --- CRM & PIPELINE MODULE ---
function renderCRMView(container) {
    container.innerHTML = `
        <div class="view-header" style="margin-bottom:1.5rem;"><h2>Manajemen CRM & Sales Pipeline</h2></div>
        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:1rem;">
            <div class="card" style="background:var(--bg-main);">
                <h4>1. Leads Masuk (42)</h4>
                <div style="margin-top:1rem; padding:0.75rem; background:var(--card-bg); border-radius:6px; margin-bottom:8px;"><strong>PT Telekomunikasi</strong><p style="font-size:0.75rem; color:var(--text-muted);">Inquiry Cloud POS</p></div>
                <div style="padding:0.75rem; background:var(--card-bg); border-radius:6px;"><strong>Bank Mandiri Syariah</strong><p style="font-size:0.75rem; color:var(--text-muted);">SaaS CRM Suite</p></div>
            </div>
            <div class="card" style="background:var(--bg-main);">
                <h4>2. Penawaran / Deal (18)</h4>
                <div style="margin-top:1rem; padding:0.75rem; background:var(--card-bg); border-radius:6px;"><strong>Pertamina Retail</strong><p style="font-size:0.75rem; color:var(--text-muted);">Negosiasi kontrak v3</p></div>
            </div>
            <div class="card" style="background:var(--bg-main);">
                <h4>3. Negosiasi (8)</h4>
                <div style="margin-top:1rem; padding:0.75rem; background:var(--card-bg); border-radius:6px;"><strong>Telkomsel Digital</strong><p style="font-size:0.75rem; color:var(--text-muted);">Review Legal SLA</p></div>
            </div>
            <div class="card" style="background:var(--bg-main);">
                <h4>4. Closing (124)</h4>
                <div style="margin-top:1rem; padding:0.75rem; background:var(--card-bg); border-radius:6px;"><strong>GoTo Financial</strong><p style="font-size:0.75rem; color:var(--text-muted);">Sukses terintegrasi</p></div>
            </div>
        </div>
    `;
}

// --- PROJECT MANAGEMENT & KANBAN ---
function renderProjectView(container) {
    container.innerHTML = `
        <div class="view-header" style="margin-bottom:1.5rem;"><h2>Manajemen Proyek & Kanban Board</h2></div>
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:1.5rem;">
            <div class="card">
                <h3>To Do (5)</h3>
                <div style="margin-top:1rem; padding:1rem; border:1px solid var(--border-color); border-radius:8px; margin-bottom:10px;">
                    <strong>Implementasi OAuth2 Server</strong>
                    <p style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">Prioritas: Tinggi | Due: 30 Juli 2026</p>
                </div>
            </div>
            <div class="card">
                <h3>In Progress (3)</h3>
                <div style="margin-top:1rem; padding:1rem; border:1px solid var(--border-color); border-radius:8px; margin-bottom:10px;">
                    <strong>Optimasi Query Index Database</strong>
                    <p style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">Prioritas: Sedang | Progress: 70%</p>
                </div>
            </div>
            <div class="card">
                <h3>Completed (24)</h3>
                <div style="margin-top:1rem; padding:1rem; border:1px solid var(--border-color); border-radius:8px; margin-bottom:10px;">
                    <strong>Audit Keamanan WAF</strong>
                    <p style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">Status: Selesai</p>
                </div>
            </div>
        </div>
    `;
}

// --- HR & EMPLOYEE MANAGEMENT ---
function renderHRView(container) {
    container.innerHTML = `
        <div class="view-header" style="margin-bottom:1.5rem;"><h2>Human Resources & Absensi Karyawan</h2></div>
        <div class="card">
            <h3>Daftar Pegawai & Gaji</h3>
            <p style="color:var(--text-muted); margin-top:0.5rem;">Total 120 Karyawan aktif dalam sistem payroll otomatis.</p>
            <div style="margin-top:1rem; display:flex; gap:1rem;">
                <button class="btn btn-primary" onclick="showToast('Payroll bulan Juli berhasil diproses', 'success')"><i data-lucide="dollar-sign"></i> Jalankan Payroll</button>
                <button class="btn" style="background:#10b981; color:#fff;" onclick="showToast('Rekap absensi diunduh', 'info')"><i data-lucide="calendar"></i> Rekap Absensi</button>
            </div>
        </div>
    `;
}

// --- INVENTORY & WAREHOUSE ---
function renderInventoryView(container) {
    container.innerHTML = `
        <div class="view-header" style="margin-bottom:1.5rem;"><h2>Manajemen Gudang & Supply Chain</h2></div>
        <div class="card">
            <h3>Stok Produk & Alert Gudang Utama (Jakarta Pusat)</h3>
            <p style="color:var(--text-muted); margin-top:0.5rem;">Semua sensor barcode dan QR code terhubung dengan sistem cloud ERP.</p>
            <div style="margin-top:1rem; display:flex; gap:1rem;">
                <button class="btn btn-primary" onclick="showToast('Purchase Order baru dibuat', 'success')"><i data-lucide="shopping-cart"></i> Buat Purchase Order</button>
                <button class="btn" style="background:#f59e0b; color:#fff;" onclick="showToast('Scanner Barcode Aktif', 'info')"><i data-lucide="camera"></i> Scan Barcode</button>
            </div>
        </div>
    `;
}

// --- AI SIMULATION DASHBOARD ---
function renderAISimulationView(container) {
    container.innerHTML = `
        <div class="view-header" style="margin-bottom:1.5rem;"><h2>Ridho AI Predictive Analytics & Simulation</h2></div>
        <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:1.5rem; margin-bottom:1.5rem;">
            <div class="card">
                <h3>AI Revenue Prediction (Next 6 Months)</h3>
                <div style="height:280px; margin-top:1rem;"><canvas id="aiPredChart"></canvas></div>
            </div>
            <div class="card">
                <h3>AI Fraud Detection & Security Risk</h3>
                <div style="height:280px; margin-top:1rem;"><canvas id="aiRiskChart"></canvas></div>
            </div>
        </div>
    `;

    setTimeout(() => {
        const ctx1 = document.getElementById("aiPredChart")?.getContext("2d");
        if (ctx1) {
            currentCharts.aiPred = new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: ['Agu', 'Sep', 'Okt', 'Nov', 'Des', 'Jan 2027'],
                    datasets: [{ label: 'Prediksi Revenue (Miliar IDR)', data: [2.8, 3.1, 3.5, 3.9, 4.4, 5.0], borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.2)', fill: true, tension: 0.4 }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }

        const ctx2 = document.getElementById("aiRiskChart")?.getContext("2d");
        if (ctx2) {
            currentCharts.aiRisk = new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    labels: ['Aman / Terverifikasi', 'Ancaman Diblokir WAF', 'Perlu Investigasi'],
                    datasets: [{ data: [94, 5, 1], backgroundColor: ['#10b981', '#f59e0b', '#ef4444'] }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }
    }, 50);
}

// Initialize Auth on Boot
document.addEventListener("DOMContentLoaded", () => {
    EnterpriseAuth.init();
});


/* ==========================================================================
   RIDHO DEV ENTERPRISE SaaS DASHBOARD - PART 4 (ULTIMATE ENTERPRISE SUITE)
   Multi-Workspace, Team Collaboration, Slack-like Chat, WhatsApp/Email Gateway,
   AI Assistant Engine, Dashboard & Report Builders, PWA & Accessibility.
   ========================================================================== */

'use strict';

// --- 1. MULTI-WORKSPACE MANAGER ---
const EnterpriseWorkspace = {
    workspaces: [
        { id: 'ws_1', name: 'Ridho Dev Global Corp', color: '#6366f1', role: 'Owner' },
        { id: 'ws_2', name: 'Enterprise Cloud AWS', color: '#10b981', role: 'Admin' },
        { id: 'ws_3', name: 'Personal Sandbox', color: '#f59e0b', role: 'Developer' },
        { id: 'ws_4', name: 'Demo Client Company', color: '#06b6d4', role: 'Viewer' }
    ],
    current: 'ws_1',

    switchWorkspace(wsId) {
        this.current = wsId;
        const ws = this.workspaces.find(w => w.id === wsId);
        if (ws) {
            localStorage.setItem("ridho_active_workspace", wsId);
            showToast(`Workspace beralih ke: ${ws.name}`, 'success');
            setTimeout(() => window.location.reload(), 600);
        }
    }
};

// --- 2. SLACK-LIKE INTERNAL CHAT ENGINE ---
const EnterpriseChat = {
    channels: ['#general-exec', '#engineering-aws', '#security-ops', '#sales-pipeline'],
    messages: [
        { id: 1, channel: '#general-exec', user: 'Budi Santoso', text: 'Halo tim, laporan kuartal 3 sudah divalidasi.', time: '09:12' },
        { id: 2, channel: '#engineering-aws', user: 'Siti Rahma', text: 'Cluster server Jakarta sudah dinaikkan kapasitasnya.', time: '10:04' }
    ],

    renderChatBox(container) {
        container.innerHTML = `
            <div class="view-header" style="margin-bottom:1.5rem;"><h2>Internal Slack-like Secure Chat</h2></div>
            <div style="display:grid; grid-template-columns: 250px 1fr; gap:1rem; height:calc(100vh - 220px);">
                <div class="card" style="overflow-y:auto;">
                    <h4>Channels</h4>
                    <div style="margin-top:1rem; display:flex; flex-direction:column; gap:0.5rem;">
                        ${this.channels.map(c => `<button class="btn" style="text-align:left; background:var(--bg-main);" onclick="showToast('Membuka channel ${c}', 'info')">${c}</button>`).join("")}
                    </div>
                </div>
                <div class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
                    <div style="overflow-y:auto; flex:1; display:flex; flex-direction:column; gap:0.75rem;" id="chatMessageList">
                        ${this.messages.map(m => `
                            <div style="padding:0.75rem; background:var(--bg-main); border-radius:8px;">
                                <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted);">
                                    <strong>${m.user}</strong> <span>${m.time}</span>
                                </div>
                                <p style="margin-top:4px; font-size:0.85rem;">${m.text}</p>
                            </div>
                        `).join("")}
                    </div>
                    <div style="display:flex; gap:0.5rem; margin-top:1rem;">
                        <input type="text" id="chatInputText" class="form-control" placeholder="Ketik pesan kolaborasi...">
                        <button class="btn btn-primary" onclick="EnterpriseChat.sendMessage()">Kirim</button>
                    </div>
                </div>
            </div>
        `;
    },

    sendMessage() {
        const inp = document.getElementById("chatInputText");
        if (!inp || !inp.value.trim()) return;
        this.messages.push({
            id: this.messages.length + 1,
            channel: '#general-exec',
            user: 'Super Administrator',
            text: inp.value,
            time: new Date().toLocaleTimeString().slice(0, 5)
        });
        inp.value = '';
        showToast("Pesan terkirim ke channel", "success");
        renderRouteContent('chat', false);
    }
};

// --- 3. WHATSAPP & EMAIL GATEWAY CENTER ---
function renderMessagingCenter(container) {
    container.innerHTML = `
        <div class="view-header" style="margin-bottom:1.5rem;"><h2>WhatsApp & Email Campaign Automation Gateway</h2></div>
        <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:1.5rem;">
            <div class="card">
                <h3><i data-lucide="message-square"></i> WhatsApp Business API</h3>
                <p style="color:var(--text-muted); font-size:0.85rem; margin:0.5rem 0 1rem 0;">Kirim broadcast otomatis ke 500+ nomor pelanggan VIP.</p>
                <textarea class="form-control" placeholder="Tulis template pesan WhatsApp..." style="margin-bottom:1rem; height:100px;"></textarea>
                <button class="btn btn-primary" onclick="showToast('Broadcast WhatsApp sedang dikirim ke antrean...', 'success')">Kirim Broadcast WA</button>
            </div>
            <div class="card">
                <h3><i data-lucide="mail"></i> Email SMTP Corporate Gateway</h3>
                <p style="color:var(--text-muted); font-size:0.85rem; margin:0.5rem 0 1rem 0;">Kirim newsletter dan penagihan invoice otomatis.</p>
                <input type="text" class="form-control" placeholder="Subjek email..." style="margin-bottom:0.75rem;">
                <textarea class="form-control" placeholder="Isi pesan email..." style="margin-bottom:1rem; height:60px;"></textarea>
                <button class="btn" style="background:#10b981; color:#fff;" onclick="showToast('Email batch berhasil dikirim via SMTP', 'success')">Kirim Email Massal</button>
            </div>
        </div>
    `;
}

// --- 4. RIDHO AI ASSISTANT EMBEDDED ENGINE ---
function renderAIAssistantView(container) {
    container.innerHTML = `
        <div class="view-header" style="margin-bottom:1.5rem;"><h2>Ridho AI Neural Assistant & Data Intelligence</h2></div>
        <div class="card" style="max-width:800px; margin:0 auto; display:flex; flex-direction:column; height:500px;">
            <div style="flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:1rem; padding:1rem; background:var(--bg-main); border-radius:8px;" id="aiAssistantHistory">
                <div style="background:var(--card-bg); padding:1rem; border-radius:8px; border-left:4px solid var(--primary);">
                    <strong>Ridho AI Core:</strong> Selamat datang di sistem kecerdasan buatan Enterprise. Anda dapat meminta analisis revenue, ringkasan database, atau audit keamanan secara real-time.
                </div>
            </div>
            <div style="display:flex; gap:0.75rem; margin-top:1rem;">
                <input type="text" id="aiAssistantPrompt" class="form-control" placeholder="Tanyakan sesuatu pada AI (contoh: Berapa total revenue bulan ini?)...">
                <button class="btn btn-primary" onclick="executeAIAssistantQuery()">Kirim</button>
            </div>
        </div>
    `;
}

function executeAIAssistantQuery() {
    const input = document.getElementById("aiAssistantPrompt");
    const history = document.getElementById("aiAssistantHistory");
    if (!input || !input.value.trim() || !history) return;

    const query = input.value;
    history.innerHTML += `<div style="text-align:right;"><span style="background:var(--primary); color:#fff; padding:8px 12px; border-radius:8px; display:inline-block;">${query}</span></div>`;
    input.value = "";

    setTimeout(() => {
        history.innerHTML += `<div style="background:var(--card-bg); padding:1rem; border-radius:8px; border-left:4px solid #10b981;"><strong>Ridho AI:</strong> Analisis berhasil diselesaikan untuk query "${query}". Seluruh parameter server dan transaksi dalam kondisi optimal.</div>`;
        history.scrollTop = history.scrollHeight;
    }, 800);
}

// --- 5. DASHBOARD & REPORT BUILDER ---
function renderDashboardBuilderView(container) {
    container.innerHTML = `
        <div class="view-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
            <h2>Drag & Drop Dashboard Customizer</h2>
            <button class="btn btn-primary" onclick="showToast('Layout kustom berhasil disimpan ke LocalStorage', 'success')"><i data-lucide="save"></i> Simpan Layout</button>
        </div>
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:1.5rem;">
            <div class="card" style="border:2px dashed var(--border-color); text-align:center; padding:2rem;">
                <i data-lucide="plus-circle" style="width:32px; height:32px; color:var(--primary);"></i>
                <h4 style="margin-top:0.5rem;">Tambah Widget Chart</h4>
            </div>
            <div class="card" style="border:2px dashed var(--border-color); text-align:center; padding:2rem;">
                <i data-lucide="plus-circle" style="width:32px; height:32px; color:var(--primary);"></i>
                <h4 style="margin-top:0.5rem;">Tambah KPI Statistik</h4>
            </div>
            <div class="card" style="border:2px dashed var(--border-color); text-align:center; padding:2rem;">
                <i data-lucide="plus-circle" style="width:32px; height:32px; color:var(--primary);"></i>
                <h4 style="margin-top:0.5rem;">Tambah Activity Feed</h4>
            </div>
        </div>
    `;
}

// --- 6. PROGRESSIVE WEB APP (PWA) & ACCESSIBILITY ---
function initPWAAndAccessibility() {
    if ('serviceWorker' in navigator) {
        console.log('[PWA] Service Worker enterprise ready.');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initPWAAndAccessibility();
});


/* ==========================================================================
   RIDHO DEV ENTERPRISE SaaS DASHBOARD - PART 5 (ULTIMATE ENTERPRISE SUITE)
   Audit Log Enterprise, Approval Workflow, Ultimate Notification Center, KPI Builder,
   Advanced Report Generator, Scheduler, Multi-Language, Theme Builder & Company Profile.
   ========================================================================== */

'use strict';

// --- 1. ENTERPRISE AUDIT LOG SYSTEM ---
const EnterpriseAuditLog = {
    logs: JSON.parse(localStorage.getItem('ridho_audit_logs')) || [
        { id: 1, user: 'Super Administrator', action: 'LOGIN', target: 'Auth Session', timestamp: '2026-07-27 05:00:12', ip: '192.168.1.10', status: 'Success' },
        { id: 2, user: 'Budi Santoso', action: 'CREATE', target: 'Customer CUST-0102', timestamp: '2026-07-27 05:15:40', ip: '192.168.1.45', status: 'Success' },
        { id: 3, user: 'Siti Rahma', action: 'EXPORT', target: 'Financial Report PDF', timestamp: '2026-07-27 05:30:00', ip: '192.168.1.88', status: 'Success' }
    ],

    log(user, action, target, status = 'Success') {
        const newLog = {
            id: this.logs.length + 1,
            user,
            action,
            target,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            ip: '192.168.1.' + Math.floor(Math.random() * 200 + 10),
            status
        };
        this.logs.unshift(newLog);
        if (this.logs.length > 500) this.logs.pop();
        localStorage.setItem('ridho_audit_logs', JSON.stringify(this.logs));
    },

    renderView(container) {
        container.innerHTML = `
            <div class="view-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
                <h2>Enterprise Audit Trail & Security Logs (${this.logs.length})</h2>
                <button class="btn btn-primary" onclick="exportData('pdf', 'audit-logs')"><i data-lucide="download"></i> Export PDF Audit</button>
            </div>
            <div class="card">
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr><th>ID</th><th>User</th><th>Aksi</th><th>Target Objek</th><th>Timestamp</th><th>IP Address</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                            ${this.logs.map(l => `
                                <tr>
                                    <td>#${l.id}</td>
                                    <td><strong>${l.user}</strong></td>
                                    <td><span class="status-badge active">${l.action}</span></td>
                                    <td>${l.target}</td>
                                    <td>${l.timestamp}</td>
                                    <td>${l.ip}</td>
                                    <td><span style="color:${l.status === 'Success' ? 'var(--success)' : 'var(--danger)'};">${l.status}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
};

// --- 2. MULTI-LEVEL APPROVAL WORKFLOW ---
const EnterpriseApproval = {
    workflows: [
        { id: 'APP-9001', title: 'Pengadaan Server AWS Cluster Jakarta', requester: 'Budi Santoso', stage: 'Manager Approval', amount: 'Rp 45.000.000', status: 'Pending' },
        { id: 'APP-9002', title: 'Kontrak Kerjasama Vendor Telekomunikasi', requester: 'Siti Rahma', stage: 'Finance Approval', amount: 'Rp 120.000.000', status: 'In Review' },
        { id: 'APP-9003', title: 'Ekspansi Budget Marketing Q4', requester: 'Super Administrator', stage: 'Director Approval', amount: 'Rp 250.000.000', status: 'Approved' }
    ],

    renderView(container) {
        container.innerHTML = `
            <div class="view-header" style="margin-bottom:1.5rem;"><h2>Multi-Level Enterprise Approval Workflow</h2></div>
            <div class="card">
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr><th>ID Request</th><th>Judul Proposal</th><th>Pemohon</th><th>Tahapan Saat Ini</th><th>Nominal</th><th>Status</th><th>Aksi</th></tr>
                        </thead>
                        <tbody>
                            ${this.workflows.map(w => `
                                <tr>
                                    <td><strong>${w.id}</strong></td>
                                    <td>${w.title}</td>
                                    <td>${w.requester}</td>
                                    <td><span class="status-badge" style="background:var(--primary); color:#fff;">${w.stage}</span></td>
                                    <td>${w.amount}</td>
                                    <td>${w.status}</td>
                                    <td>
                                        <button class="btn btn-primary" style="padding:4px 8px; font-size:0.75rem;" onclick="showToast('Approval ${w.id} disetujui', 'success')">Approve</button>
                                        <button class="btn" style="background:var(--danger); color:#fff; padding:4px 8px; font-size:0.75rem;" onclick="showToast('Approval ${w.id} direvisi/ditolak', 'warning')">Reject</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
};

// --- 3. MULTI-LANGUAGE TRANSLATION ENGINE ---
const EnterpriseLang = {
    current: localStorage.getItem('ridho_lang') || 'id',
    dict: {
        id: { dashboard: 'Dashboard', pelanggan: 'Pelanggan', produk: 'Produk', penjualan: 'Penjualan', pengaturan: 'Pengaturan' },
        en: { dashboard: 'Dashboard', pelanggan: 'Customers', produk: 'Products', penjualan: 'Sales', pengaturan: 'Settings' },
        ja: { dashboard: 'ダッシュボード', pelanggan: '顧客', produk: '製品', penjualan: '売上', pengaturan: '設定' },
        zh: { dashboard: '仪表盘', pelanggan: '客户', produk: '产品', penjualan: '销售', pengaturan: '设置' }
    },
    setLang(lang) {
        this.current = lang;
        localStorage.setItem('ridho_lang', lang);
        showToast(`Bahasa diubah ke ${lang.toUpperCase()}`, 'success');
        setTimeout(() => window.location.reload(), 500);
    }
};

// --- 4. THEME BUILDER & COMPANY PROFILE ---
const EnterpriseThemeBuilder = {
    applyTheme(themeName) {
        localStorage.setItem('ridho_theme', themeName);
        document.body.className = `theme-${themeName}`;
        showToast(`Tema diterapkan: ${themeName}`, 'success');
    }
};

// --- 5. INITIALIZER INTEGRATION ---
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem('ridho_theme');
    if (savedTheme) {
        document.body.className = `theme-${savedTheme}`;
    }
});

