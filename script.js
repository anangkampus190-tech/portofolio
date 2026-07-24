/**
 * Main JavaScript File
 * Mengatur interaktivitas: Dark Mode, Navigasi Mobile, Smooth Scroll, & Form Handling.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. MANAJEMEN TEMA (DARK / LIGHT MODE)
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Cek preferensi tema sebelumnya di localStorage
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Set tema awal berdasarkan preferensi
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fa-solid fa-sun';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.className = 'fa-solid fa-moon';
    }

    // Toggle Fitur Ganti Tema
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        let newTheme = 'light';

        if (currentTheme === 'light') {
            newTheme = 'dark';
            themeIcon.className = 'fa-solid fa-sun';
        } else {
            themeIcon.className = 'fa-solid fa-moon';
        }

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // ==========================================
    // 2. NAVIGASI MOBILE (HAMBURGER MENU)
    // ==========================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu mobile
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Tutup menu saat salah satu link diklik
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // ==========================================
    // 3. EFEK NAVBAR SHADOW SAAT SCROLL
    // ==========================================
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // ==========================================
    // 4. PENANGANAN FORM KONTAK (DUMMY SUBMIT)
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const formAlert = document.getElementById('form-alert');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Mencegah reload halaman

        // Ambil Nilai Input
        const name = document.getElementById('name').value;

        // Simulasi status pengiriman berhasil
        formAlert.className = 'form-alert success';
        formAlert.textContent = `Terima kasih, ${name}! Pesan Anda berhasil terkirim. Saya akan segera menghubungi Anda.`;

        // Reset Form
        contactForm.reset();

        // Sembunyikan notifikasi setelah 5 detik
        setTimeout(() => {
            formAlert.style.display = 'none';
        }, 5000);
    });

});

