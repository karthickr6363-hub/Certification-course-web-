// Main JavaScript file for CertiLearn Platform

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile menu toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const button = document.querySelector('[onclick="toggleMobileMenu()"]');
    if (menu) {
        menu.classList.toggle('hidden');
        // Toggle hamburger icon between bars and times
        if (button) {
            const icon = button.querySelector('i');
            if (icon) {
                if (menu.classList.contains('hidden')) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                } else {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                }
            }
        }
    }
}

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Add loading states to buttons
document.querySelectorAll('button[type="submit"]').forEach(button => {
    button.addEventListener('click', function() {
        if (this.form && this.form.checkValidity()) {
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';
        }
    });
});

// Add active menu styles
function addActiveMenuStyles() {
    if (!document.getElementById('active-menu-styles')) {
        const style = document.createElement('style');
        style.id = 'active-menu-styles';
        style.textContent = `
            /* Active menu item styles */
            .active-menu {
                color: #667eea !important;
                font-weight: 600 !important;
            }
            
            /* Desktop menu active state */
            .tabmenubar .active-menu {
                color: #667eea !important;
                font-weight: 600 !important;
                position: relative;
            }
            
            .tabmenubar .active-menu::after {
                content: '';
                position: absolute;
                bottom: -4px;
                left: 0;
                right: 0;
                height: 2px;
                background-color: #667eea;
                border-radius: 2px;
            }
            
            /* Mobile menu active state */
            .mobilemenubar .active-menu {
                color: #667eea !important;
                font-weight: 600 !important;
                background-color: #f3f4f6 !important;
            }
            
            /* Dropdown active item */
            .dropdown-menu .active-menu {
                background-color: #f3f4f6 !important;
                color: #667eea !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Active menu highlighting
function setActiveMenu() {
    // Get current page filename
    let currentPage = window.location.pathname.split('/').pop();
    if (!currentPage || currentPage === '') {
        currentPage = 'index.html';
    }
    
    // Normalize current page (remove query strings and hash)
    currentPage = currentPage.split('?')[0].split('#')[0];
    
    // Find all menu containers (desktop and mobile)
    const desktopMenu = document.querySelector('.tabmenubar');
    const mobileMenu = document.querySelector('.mobilemenubar');
    
    // Function to normalize href for comparison
    function normalizeHref(href) {
        if (!href || href.startsWith('#') || href === 'javascript:void(0)') {
            return null;
        }
        let page = href.split('/').pop();
        page = page.split('?')[0].split('#')[0];
        return page || 'index.html';
    }
    
    // Function to set active state on a link
    function setActiveLink(link, isDropdownItem = false) {
        if (!link) return false;
        
        const href = link.getAttribute('href');
        const linkPage = normalizeHref(href);
        
        if (linkPage && linkPage === currentPage) {
            // Add active class
            link.classList.add('active-menu');
            
            // For dropdown items, also highlight the parent dropdown
            if (isDropdownItem) {
                const parentDropdown = link.closest('.dropdown');
                if (parentDropdown) {
                    const parentLink = parentDropdown.querySelector('a:first-child');
                    if (parentLink) {
                        parentLink.classList.add('active-menu');
                    }
                }
            }
            return true;
        }
        return false;
    }
    
    // Process desktop menu
    if (desktopMenu) {
        // Regular menu links (excluding dropdown triggers)
        const menuLinks = desktopMenu.querySelectorAll('a[href]');
        menuLinks.forEach(link => {
            // Skip dropdown trigger links (they're inside a .dropdown that has .dropdown-menu)
            const parentDropdown = link.closest('.dropdown');
            const hasDropdownMenu = parentDropdown && parentDropdown.querySelector('.dropdown-menu');
            if (!hasDropdownMenu) {
                setActiveLink(link);
            }
        });
        
        // Dropdown menu items
        const dropdownItems = desktopMenu.querySelectorAll('.dropdown-menu a');
        dropdownItems.forEach(link => {
            setActiveLink(link, true);
        });
    }
    
    // Process mobile menu
    if (mobileMenu) {
        // Regular menu links (excluding dropdown buttons)
        const menuLinks = mobileMenu.querySelectorAll('a[href]');
        menuLinks.forEach(link => {
            // Skip links inside dropdowns (they're handled separately)
            const isInDropdown = link.closest('#mobile-home-dropdown, #mobile-account-dropdown');
            if (!isInDropdown) {
                setActiveLink(link);
            }
        });
        
        // Dropdown menu items (mobile)
        const dropdownItems = mobileMenu.querySelectorAll('#mobile-home-dropdown a, #mobile-account-dropdown a');
        dropdownItems.forEach(link => {
            if (setActiveLink(link, true)) {
                // Also highlight the dropdown button if a child is active
                const dropdownContainer = link.closest('div[id$="-dropdown"]');
                if (dropdownContainer) {
                    const parentButton = dropdownContainer.previousElementSibling;
                    if (parentButton && parentButton.tagName === 'BUTTON') {
                        parentButton.classList.add('active-menu');
                    }
                }
            }
        });
    }
}

// Initialize active menu highlighting when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        addActiveMenuStyles();
        setActiveMenu();
    });
} else {
    addActiveMenuStyles();
    setActiveMenu();
}

// Theme Toggle Functionality
function initTheme() {
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply theme immediately to prevent flash
    if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    
    // Update theme toggle button icons
    updateThemeIcons(currentTheme);
}

function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    
    if (isDark) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        updateThemeIcons('light');
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        updateThemeIcons('dark');
    }
}

function updateThemeIcons(theme) {
    const themeButtons = document.querySelectorAll('[data-theme-toggle]');
    themeButtons.forEach(button => {
        const icon = button.querySelector('i');
        if (icon) {
            if (theme === 'dark') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
    });
}

// Initialize theme on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    initTheme();
}

// Console log for debugging
console.log('CertiLearn Platform - JavaScript Loaded Successfully');

