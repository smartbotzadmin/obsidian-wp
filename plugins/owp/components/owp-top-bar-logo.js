/**
 * @class OwpTopBarLogo
 * @augments HTMLElement
 * @description Web component for the OWP logo in the top bar.
 */
class OwpTopBarLogo extends HTMLElement {
    /**
     * @description Constructs the OwpTopBarLogo instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.innerHTML = this.getTemplate();
    }

    /**
     * @description Generates the HTML template for the OWP logo.
     * @returns {string} The HTML string for the component.
     */
    getTemplate() {
        return `
            <img src="${window.location.origin}/wp-content/plugins/owp/assets/icons/owp-logo-light.svg" alt="OWP Logo" class="h-8 w-auto">
        `;
    }
}

customElements.define('owp-top-bar-logo', OwpTopBarLogo);