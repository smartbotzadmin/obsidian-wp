/**
 * @class OwpApp
 * @augments HTMLElement
 * @description Main web component for the Obsidian WP Single Page Application.
 */
class OwpApp extends HTMLElement {
    /**
     * @description Constructs the OwpApp instance.
     * @returns {void}
     */
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
            <link rel="stylesheet" href="${window.location.origin}/wp-content/plugins/owp/assets/css/output.css">
            <div id="owp-spa-container"></div>
        `;
        this.container = shadowRoot.getElementById('owp-spa-container');
        this.routes = {
            '': 'owp-start',
            'start': 'owp-start',
            'describe': 'owp-describe',
            'contact': 'owp-contact',
            'pictures': 'owp-pictures',
            'design': 'owp-design',
        };
    }

    /**
     * @description Called when the element is added to the document's DOM.
     * @returns {void}
     */
    connectedCallback() {
        this.handleRouting();
        window.addEventListener('hashchange', this.handleRouting.bind(this));
        this.shadowRoot.addEventListener('click', this.handleNavigationClick.bind(this));
    }

    /**
     * @description Handles routing for the Single Page Application (SPA) within the WordPress admin.
     * @returns {void}
     */
    handleRouting() {
        const path = window.location.hash.substring(1);
        this.renderPage(path);
    }

    /**
     * @description Renders the appropriate web component based on the current hash.
     * @param {string} path The path from the URL hash.
     * @returns {void}
     */
    renderPage(path) {
        if (!this.container) {
            console.error('SPA container not found!');
            return;
        }

        const tagName = this.routes[path] || this.routes['']; // Default to 'start' if path is not found
        if (tagName) {
            this.container.innerHTML = `<owp-topbar></owp-topbar><${tagName}></${tagName}>`;
        } else {
            this.container.innerHTML = '<p>Page not found.</p>';
        }
    }

    /**
     * @description Handles navigation clicks within the SPA.
     * @param {Event} event The click event.
     * @returns {void}
     */
    handleNavigationClick(event) {
        const target = event.target;
        if (target.matches('[data-owp-navigate]')) {
            event.preventDefault();
            const page = target.getAttribute('data-owp-navigate');
            window.location.hash = page;
        }
    }
}

customElements.define('owp-app', OwpApp);

document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('owp-spa-container');
    if (appContainer) {
        appContainer.innerHTML = '<owp-app></owp-app>';
    }
});