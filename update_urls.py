#!/usr/bin/env python3
"""
Script to update all HTML files with clean URL routing
"""

import os
import re

# URL mappings
url_mappings = {
    '#services': '/services',
    '#internships': '/internships', 
    '#about': '/about',
    '#contact': '/contact',
    'servicePage.html': '/services',
    'internships.html': '/internships',
    'aboutus.html': '/about',
    'contactus.html': '/contact',
    'index.html': '/',
    'href="#"': 'href="/"'
}

def update_html_file(filepath):
    """Update a single HTML file with clean URLs"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Apply URL mappings
    for old_url, new_url in url_mappings.items():
        content = content.replace(old_url, new_url)
    
    # Convert remaining buttons to links for CTAs
    button_patterns = [
        (r'<button([^>]*>)Get a Quote</button>', r'<a\1 href="/contact">Get a Quote</a>'),
        (r'<button([^>]*>)Schedule a Consultation</button>', r'<a\1 href="/contact">Schedule a Consultation</a>'),
        (r'<button([^>]*>)Discover Our Services</button>', r'<a\1 href="/services">Discover Our Services</a>'),
        (r'<button([^>]*>)Join Our Internship Program</button>', r'<a\1 href="/internships">Join Our Internship Program</a>'),
        (r'<button([^>]*>)View Internships</button>', r'<a\1 href="/internships">View Internships</a>'),
        (r'<button([^>]*>)Apply Now</button>', r'<a\1 href="/contact">Apply Now</a>'),
        (r'<button([^>]*>)Request a Demo</button>', r'<a\1 href="/contact">Request a Demo</a>'),
    ]
    
    for pattern, replacement in button_patterns:
        content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)
    
    # Write updated content
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Updated {filepath}")

def main():
    """Main function to update all HTML files"""
    html_files = ['index.html', 'aboutus.html', 'contactus.html', 'internships.html', 'servicePage.html']
    
    for filename in html_files:
        if os.path.exists(filename):
            update_html_file(filename)
        else:
            print(f"File {filename} not found")
    
    print("\n✅ All HTML files updated with clean URL routing!")

if __name__ == "__main__":
    main()
