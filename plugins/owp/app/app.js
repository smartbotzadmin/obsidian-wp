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
            <img class="absolute -z-2 object-cover h-full w-full" src="/wp-content/plugins/owp/assets/icons/obsidian-background.webp"/>
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
    /**
     * @description Handles routing for the Single Page Application (SPA) within the WordPress admin.
     * If no hash is present or if the hash is not mapped in this.routes, redirects to '#let's-start'.
     * @returns {void}
     */
    handleRouting() {
        const currentHash = window.location.hash.substring(1);
        const defaultHash = 'start';
        const baseUrl = window.location.origin + window.location.pathname + window.location.search;

        if (!currentHash || !this.routes[currentHash]) {
            window.location.replace(`${baseUrl}#${defaultHash}`);
            return;
        }
        this.renderPage(currentHash);
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


/**
 * @class OwpSessionManager
 * @description Manages the 'owp_payload' in sessionStorage, providing methods for initialization, retrieval, and updates.
 */
class OwpSessionManager {
    /**
     * @private
     * @type {string}
     * @description The key for the sessionStorage variable.
     */
    #payloadKey = 'owp_payload';

    /**
     * @private
     * @type {Object}
     * @description The default structure for the owp_payload.
     */
    #defaultPayload = {
        "start": {
            "name": "",
            "business": "",
            "language": ""
        },
        "describe": "",
        "contact": {
            "email": "",
            "address": "",
            "phone": ""
        },
        "pictures": []
    };

    /**
     * @description Constructs the OwpSessionManager instance.
     * Initializes the payload from sessionStorage or sets a default.
     * @returns {void}
     */
    constructor() {
        this.#initializePayload();
    }

    /**
     * @private
     * @description Initializes the owp_payload in sessionStorage.
     * If it doesn't exist or is invalid, it sets the default structure.
     * @returns {void}
     */
    #initializePayload() {
        try {
            const storedPayload = sessionStorage.getItem(this.#payloadKey);
            if (storedPayload) {
                const parsedPayload = JSON.parse(storedPayload);
                // Merge with default to ensure all keys exist, especially if structure changes
                this.setPayload({ ...this.#defaultPayload, ...parsedPayload });
            } else {
                this.setPayload(this.#defaultPayload);
            }
        } catch (error) {
            console.error('Error parsing owp_payload from sessionStorage, resetting:', error);
            this.setPayload(this.#defaultPayload);
        }
    }

    /**
     * @description Retrieves the current owp_payload from sessionStorage.
     * @returns {Object} The current owp_payload.
     */
    getPayload() {
        try {
            const storedPayload = sessionStorage.getItem(this.#payloadKey);
            return storedPayload ? JSON.parse(storedPayload) : this.#defaultPayload;
        } catch (error) {
            console.error('Error retrieving owp_payload from sessionStorage:', error);
            return this.#defaultPayload;
        }
    }

    /**
     * @description Sets the entire owp_payload in sessionStorage.
     * @param {Object} payload - The new payload object to save.
     * @returns {void}
     */
    setPayload(payload) {
        try {
            sessionStorage.setItem(this.#payloadKey, JSON.stringify(payload));
        } catch (error) {
            console.error('Error saving owp_payload to sessionStorage:', error);
        }
    }

    /**
     * @description Updates a specific section of the owp_payload.
     * @param {string} section - The top-level key to update (e.g., 'start', 'describe', 'contact', 'pictures').
     * @param {any} data - The data to set for that section.
     * @returns {void}
     */
    updatePayloadSection(section, data) {
        const currentPayload = this.getPayload();
        currentPayload[section] = data;
        this.setPayload(currentPayload);
    }
}

// Instantiate the session manager globally
window.owpSessionManager = new OwpSessionManager();
