/**
 * @class OwpTopbarLogo
 * @augments HTMLElement
 * @description Web component for the OWP logo in the top bar.
 */
class OwpTopbarLogo extends HTMLElement {
    /**
     * @description Constructs the OwpTopBarLogo instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.innerHTML = this.#getTemplate();
    }


    /**
     * @description Called when the element is added to the document's DOM.
     * @returns {void}
     */
    connectedCallback() {
        // No specific logic needed on connection for this component.
    }


    /**
     * @description Called when the element is removed from the document's DOM.
     * @returns {void}
     */
    disconnectedCallback() {
        // No specific cleanup needed for this component.
    }


    /**
     * @private
     * @description Generates the HTML template for the OWP logo.
     * @returns {string} The HTML string for the component.
     */
    #getTemplate() {
        return `
            <img src="${window.location.origin}/wp-content/plugins/owp/assets/icons/obsidian-logo.png" alt="OWP Logo" class="h-8 w-auto">
        `;
    }
}

customElements.define('owp-topbar-logo', OwpTopbarLogo);