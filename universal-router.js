// Universal Router for Akula Cybersecurity Website
// Automatically adapts to GitHub Pages, local development, and production servers

class UniversalRouter {
    constructor() {
        this.routes = {
            '/': 'index.html',
            '/about': 'aboutus.html', 
            '/contact': 'contactus.html',
            '/internships': 'internships.html',
            '/services': 'servicePage.html'
        };
        
        this.htmlRoutes = {
            'index.html': '/',
            'aboutus.html': '/about',
            'contactus.html': '/contact', 
            'internships.html': '/internships',
            'servicePage.html': '/services'
        };
        
        // Detect environment
        this.environment = this.detectEnvironment();
        
        // Handle initial page load
        this.handleInitialLoad();
        
        // Handle navigation
        this.handleNavigation();
    }
    
    detectEnvironment() {
        const hostname = window.location.hostname;
        const protocol = window.location.protocol;
        
        // GitHub Pages detection
        if (hostname.includes('github.io') || hostname.includes('githubusercontent.com')) {
            return 'github-pages';
        }
        
        // Local development detection
        if (hostname === 'localhost' || hostname === '127.0.0.1' || protocol === 'file:') {
            return 'local';
        }
        
        // Production server detection (Apache, IIS, etc.)
        return 'production';
    }
    
    handleInitialLoad() {
        const currentPath = window.location.pathname;
        
        // For GitHub Pages and local development, ensure we're on the correct page
        if (this.environment === 'github-pages' || this.environment === 'local') {
            // If we're on a clean URL, redirect to HTML file
            if (this.routes[currentPath] && !currentPath.includes('.html')) {
                window.location.href = this.routes[currentPath];
                return;
            }
        }
        
        // For production, handle .html redirects to clean URLs
        if (this.environment === 'production' && currentPath.includes('.html')) {
            this.redirectToCleanUrl(currentPath);
        }
    }
    
    handleNavigation() {
        // Intercept link clicks
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                const href = e.target.getAttribute('href');
                if (href && href.startsWith('/') && this.routes[href]) {
                    e.preventDefault();
                    this.navigateTo(href);
                }
            }
        });
    }
    
    navigateTo(path) {
        if (this.environment === 'github-pages' || this.environment === 'local') {
            // Use HTML files for GitHub Pages and local development
            const htmlFile = this.routes[path];
            if (htmlFile) {
                window.location.href = htmlFile;
            }
        } else {
            // Use clean URLs for production servers
            window.history.pushState({}, '', path);
            this.loadPage(this.routes[path]);
        }
    }
    
    loadPage(htmlFile) {
        fetch(htmlFile)
            .then(response => response.text())
            .then(html => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                
                const mainContent = tempDiv.querySelector('main') || tempDiv.querySelector('.content') || tempDiv;
                if (mainContent) {
                    const currentMain = document.querySelector('main') || document.querySelector('.content');
                    if (currentMain) {
                        currentMain.innerHTML = mainContent.innerHTML;
                    }
                }
                
                const title = tempDiv.querySelector('title');
                if (title) {
                    document.title = title.textContent;
                }
                
                // Update navigation links based on environment
                this.updateNavigationLinks();
                
                // Re-initialize any interactive elements
                this.initializeInteractivity();
            })
            .catch(error => {
                console.error('Error loading page:', error);
                window.location.href = htmlFile;
            });
    }
    
    redirectToCleanUrl(htmlPath) {
        const cleanUrl = this.htmlRoutes[htmlPath];
        if (cleanUrl) {
            window.history.replaceState({}, '', cleanUrl);
            this.loadPage(htmlPath);
        }
    }
    
    updateNavigationLinks() {
        // Update all navigation links based on current environment
        const navLinks = document.querySelectorAll('a[href^="/"]');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (this.routes[href]) {
                if (this.environment === 'github-pages' || this.environment === 'local') {
                    link.setAttribute('href', this.routes[href]);
                } else {
                    link.setAttribute('href', href);
                }
            }
        });
    }
    
    initializeInteractivity() {
        console.log('Page interactivity reinitialized for', this.environment);
    }
    
    // Public method to get current environment
    getEnvironment() {
        return this.environment;
    }
    
    // Public method to get appropriate URL
    getUrl(path) {
        if (this.environment === 'github-pages' || this.environment === 'local') {
            return this.routes[path];
        } else {
            return path;
        }
    }
}

// Initialize router when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.akulaRouter = new UniversalRouter();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UniversalRouter;
}
