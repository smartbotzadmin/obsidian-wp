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
            <link rel="stylesheet" href="/wp-content/plugins/owp/assets/css/output.css">
            <img class="absolute -z-2 object-cover h-full w-auto" src="/wp-content/plugins/owp/assets/icons/obsidian-background.webp"/>
            <div class="absolute -z-1 w-full h-full bg-slate-900 opacity-50"></div>
            <owp-topbar></owp-topbar>
        `;
        
        document.querySelector('#wpfooter').remove();

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
        const tagName = this.routes[path] || this.routes[''];
        if (this.shadowRoot.children.length > 4) {
            this.shadowRoot.lastElementChild.remove();
        }

        if (tagName) {
            this.shadowRoot.appendChild(document.createElement(tagName));
        } else {
            const notFoundElement = document.createElement('p');
            notFoundElement.textContent = 'Page not found.';
            this.shadowRoot.appendChild(notFoundElement);
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
