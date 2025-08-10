/**
 * @desc Handles routing for the Single Page Application (SPA) within the WordPress admin.
 * @return {void}
 */
function handleRouting() {
    const routes = {
        '': 'owp-start',
        'start': 'owp-start',
        'describe': 'owp-describe',
        'contact': 'owp-contact',
        'pictures': 'owp-pictures',
        'design': 'owp-design',
    };

    /**
     * @desc Renders the appropriate web component based on the current hash.
     * @param {string} path The path from the URL hash.
     * @return {void}
     */
    function renderPage(path) {
        const container = document.getElementById('owp-spa-container');
        if (!container) {
            console.error('SPA container not found!');
            return;
        }

        const tagName = routes[path] || routes['']; // Default to 'start' if path is not found
        if (tagName) {
            container.innerHTML = `<${tagName}></${tagName}>`;
        } else {
            container.innerHTML = '<p>Page not found.</p>';
        }
    }

    // Initial render
    renderPage(window.location.hash.substring(1));

    // Listen for hash changes
    window.addEventListener('hashchange', () => {
        renderPage(window.location.hash.substring(1));
    });

    // Handle navigation buttons
    document.addEventListener('click', (event) => {
        const target = event.target;
        if (target.matches('[data-owp-navigate]')) {
            event.preventDefault();
            const page = target.getAttribute('data-owp-navigate');
            window.location.hash = page;
        }
    });
}

document.addEventListener('DOMContentLoaded', handleRouting);