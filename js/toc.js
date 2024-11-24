// Mobile toggle
document.addEventListener('DOMContentLoaded', function() {
    const tocToggles = document.querySelectorAll('.guidelines-toc .toc-toggle');
    
    tocToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
        });
    });

    // Close TOC when clicking a link on mobile
    const tocLinks = document.querySelectorAll('.guidelines-toc .toc-item');
    tocLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                const toggle = this.closest('.guidelines-toc')
                    .querySelector('.toc-toggle');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
});

// Dynamic text color
document.addEventListener('DOMContentLoaded', function() {
    const toc = document.querySelector('.guidelines-toc');
    if (!toc) return;
    
    const groupBlocks = document.querySelectorAll('.entry-content .wp-block-group.has-background.alignfull');

    // Checks if a color is dark
    function isColorDark(r, g, b) {
        // Using relative luminance formula
        return ((r * 0.299 + g * 0.587 + b * 0.114) / 255) < 0.5;
    }

    // Gets BG color
    function getBackgroundColor(el) {
        var color = window.getComputedStyle(el).backgroundColor;
        var vals = color.substring(color.indexOf('(') +1, color.length -1).split(', ');

        return {
            r: parseInt(vals[0]),
            g: parseInt(vals[1]),
            b: parseInt(vals[2])
        };
    }

    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                var color = getBackgroundColor(entry.target);
                if (color) {
                    if ( isColorDark(color.r, color.g, color.b) ) {
                        toc.classList.add("toc-has-dark-bg");
                    }
                }
            } else {
                toc.classList.remove("toc-has-dark-bg");
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });

    // Observe the probe
    groupBlocks.forEach((block) => {
        observer.observe(block);
    });
});