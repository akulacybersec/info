// Universal Router for Akula Cybersecurity Website
// Works with both local development servers and production servers

class SimpleRouter {
    constructor() {
        this.routes = {
            '/': 'index.html',
            '/about': 'aboutus.html', 
            '/contact': 'contactus.html',
            '/internships': 'internships.html',
            '/services': 'servicePage.html'
        };
        
        // Handle initial page load
        this.handleInitialLoad();
        
        // Handle browser navigation
        this.handleNavigation();
    }
    
    handleInitialLoad() {
        const currentPath = window.location.pathname;
        const cleanPath = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;
        
        // If we have a clean URL, load the corresponding HTML file
        if (this.routes[cleanPath]) {
            this.loadPage(this.routes[cleanPath]);
        } else if (currentPath.includes('.html')) {
            // Handle direct .html access - redirect to clean URL
            this.redirectToCleanUrl(currentPath);
        } else {
            // Default to home page
            this.loadPage('index.html');
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
        
        // Handle back/forward browser navigation
        window.addEventListener('popstate', () => {
            this.handleInitialLoad();
        });
    }
    
    navigateTo(path) {
        // Update URL without reload
        window.history.pushState({}, '', path);
        
        // Load the corresponding page
        const htmlFile = this.routes[path];
        if (htmlFile) {
            this.loadPage(htmlFile);
        }
    }
    
    loadPage(htmlFile) {
        // For single-page application behavior
        fetch(htmlFile)
            .then(response => response.text())
            .then(html => {
                // Create a temporary div to parse the HTML
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                
                // Extract the main content (adjust selector based on your HTML structure)
                const mainContent = tempDiv.querySelector('main') || tempDiv.querySelector('.content') || tempDiv;
                const headContent = tempDiv.querySelector('head');
                
                // Update the page content
                if (mainContent) {
                    const currentMain = document.querySelector('main') || document.querySelector('.content');
                    if (currentMain) {
                        currentMain.innerHTML = mainContent.innerHTML;
                    }
                }
                
                // Update page title
                const title = tempDiv.querySelector('title');
                if (title) {
                    document.title = title.textContent;
                }
                
                // Re-initialize any interactive elements
                this.initializeInteractivity();
            })
            .catch(error => {
                console.error('Error loading page:', error);
                // Fallback: redirect to the actual HTML file
                window.location.href = htmlFile;
            });
    }
    
    redirectToCleanUrl(htmlPath) {
        // Map HTML files to clean URLs
        const cleanUrlMap = {
            'index.html': '/',
            'aboutus.html': '/about',
            'contactus.html': '/contact', 
            'internships.html': '/internships',
            'servicePage.html': '/services'
        };
        
        const cleanUrl = cleanUrlMap[htmlPath];
        if (cleanUrl) {
            window.history.replaceState({}, '', cleanUrl);
            // Reload with clean URL
            this.loadPage(htmlPath);
        }
    }
    
    initializeInteractivity() {
        // Re-initialize any JavaScript functionality
        // This is where you'd reinitialize tabs, modals, etc.
        console.log('Page interactivity reinitialized');
    }
}

// Initialize router when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SimpleRouter();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SimpleRouter;
}
