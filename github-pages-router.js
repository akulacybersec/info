// GitHub Pages Compatible Router
// Works on GitHub Pages, local development, and production servers

class GitHubPagesRouter {
    constructor() {
        this.routes = {
            '/': 'index.html',
            '/about': 'aboutus.html', 
            '/contact': 'contactus.html',
            '/internships': 'internships.html',
            '/services': 'servicePage.html'
        };
        
        this.isGitHubPages = this.detectGitHubPages();
        
        // Handle initial page load
        this.handleInitialLoad();
        
        // Handle navigation
        this.handleNavigation();
    }
    
    detectGitHubPages() {
        // Detect if we're on GitHub Pages
        return window.location.hostname.includes('github.io') || 
               window.location.hostname.includes('githubusercontent.com') ||
               document.querySelector('meta[name="github-pages"]') !== null;
    }
    
    handleInitialLoad() {
        const currentPath = window.location.pathname;
        const cleanPath = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;
        
        // If we're on GitHub Pages and accessing a clean URL directly
        if (this.isGitHubPages && this.routes[cleanPath] && !currentPath.includes('.html')) {
            // Redirect to the actual HTML file
            window.location.href = this.routes[cleanPath];
            return;
        }
        
        // Handle direct .html access - redirect to clean URL if not GitHub Pages
        if (!this.isGitHubPages && currentPath.includes('.html')) {
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
        if (this.isGitHubPages) {
            // On GitHub Pages, navigate to HTML file
            const htmlFile = this.routes[path];
            if (htmlFile) {
                window.location.href = htmlFile;
            }
        } else {
            // On other servers, use clean URLs
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
                
                // Re-initialize any interactive elements
                this.initializeInteractivity();
            })
            .catch(error => {
                console.error('Error loading page:', error);
                window.location.href = htmlFile;
            });
    }
    
    redirectToCleanUrl(htmlPath) {
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
            this.loadPage(htmlPath);
        }
    }
    
    initializeInteractivity() {
        console.log('Page interactivity reinitialized');
    }
}

// Initialize router when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GitHubPagesRouter();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GitHubPagesRouter;
}
