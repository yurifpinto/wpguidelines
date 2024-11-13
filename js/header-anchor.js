document.addEventListener('DOMContentLoaded', function() {
    // Find all headings with IDs
    const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');

    headings.forEach(heading => {
        // Create anchor link
        const anchor = document.createElement('a');
        anchor.className = 'anchor-link';
        anchor.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" style="pointer-events: auto;">
                <path fill="currentColor" fill-rule="evenodd" d="M16.92 0c1.859 0 3.608.655 5.03 2.073 2.733 2.727 2.733 7.309 0 10.036l-3.28 3.273c-1.422 1.418-3.171 2.073-5.03 2.073-1.859 0-3.608-.655-5.03-2.073L7.517 14.29 9.813 12l1.094 1.09c.765.655 1.64 1.092 2.733 1.092 1.093 0 1.968-.327 2.734-1.091l1.64-1.636 1.64-1.637a3.813 3.813 0 0 0 0-5.454c-.766-.655-1.64-1.091-2.734-1.091-1.093 0-1.968.327-2.733 1.09l-.547.655c-.984-.436-2.187-.654-3.28-.654h-.765l2.296-2.291C13.312.655 15.06 0 16.92 0zM9.813 19.636l.547-.654c.984.436 2.187.654 3.28.654h.765l-2.296 2.291C10.688 23.345 8.94 24 7.08 24c-1.858 0-3.607-.655-5.029-2.073-2.733-2.727-2.733-7.309 0-10.036l3.28-3.273C6.752 7.2 8.501 6.545 10.36 6.545c1.859 0 3.608.655 5.03 2.073l1.093 1.091L14.187 12l-1.094-1.09c-.765-.655-1.64-1.092-2.733-1.092-1.093 0-1.968.327-2.734 1.091l-1.64 1.636-1.64 1.637a3.813 3.813 0 0 0 0 5.454c.766.655 1.64 1.091 2.734 1.091 1.093 0 1.968-.327 2.733-1.09z" style="pointer-events: auto;"></path>
            </svg>
        `;
        anchor.setAttribute('aria-label', 'Copy link to section');

        // Add click handler
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            // Get the full URL with the anchor
            const url = window.location.href.split('#')[0] + '#' + heading.id;

            // Copy to clipboard
            navigator.clipboard.writeText(url);
        });

        // Add the anchor link to the heading
        heading.appendChild(anchor);
    });
});