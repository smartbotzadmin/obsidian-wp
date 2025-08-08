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
        this.innerHTML = this.getTemplate();
    }

    /**
     * @description Generates the HTML template for the OWP logo.
     * @returns {string} The HTML string for the component.
     */
    getTemplate() {
        return `
            <img src="${window.location.origin}/wp-content/plugins/owp/assets/icons/obsidian-logo.png" alt="OWP Logo" class="h-8 w-auto">
        `;
    }
}

customElements.define('owp-topbar-logo', OwpTopbarLogo);