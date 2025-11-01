// Simple Navigation Fix for Local Development
// This script ensures navigation works in both local development and production

document.addEventListener('DOMContentLoaded', function() {
    // Function to handle navigation
    function handleNavigation() {
        // Get all navigation links
        const navLinks = document.querySelectorAll('a[href^="/"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Check if we're in local development
                if (window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ||
                    window.location.protocol === 'file:') {
                    
                    e.preventDefault();
                    
                    // Map clean URLs to actual HTML files for local development
                    const urlMap = {
                        '/': 'index.html',
                        '/about': 'aboutus.html',
                        '/contact': 'contactus.html', 
                        '/internships': 'internships.html',
                        '/services': 'servicePage.html'
                    };
                    
                    const htmlFile = urlMap[href];
                    if (htmlFile) {
                        window.location.href = htmlFile;
                    }
                }
                // For production, let the server handle the routing
            });
        });
        
        // Handle direct URL access in local development
        if (window.location.hostname === 'localhost' || 
            window.location.hostname === '127.0.0.1' ||
            window.location.protocol === 'file:') {
            
            const currentPath = window.location.pathname;
            const urlMap = {
                '/': 'index.html',
                '/about': 'aboutus.html',
                '/contact': 'contactus.html',
                '/internships': 'internships.html', 
                '/services': 'servicePage.html'
            };
            
            // If accessing a clean URL directly, redirect to HTML file
            if (urlMap[currentPath] && !currentPath.includes('.html')) {
                window.location.href = urlMap[currentPath];
            }
        }
    }
    
    handleNavigation();
});
