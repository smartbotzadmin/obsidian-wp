/**
 * Custom Web Component for the OWP Description Page.
 * This is a dummy component to be developed deeper later.
 */
class OwpDescriptionComponent extends HTMLElement {
    /**
     * Constructs the OwpDescriptionComponent instance.
     *
     * @return {void}
     */
    constructor() {
        super();
        this.innerHTML = `
            <p class="bg-blue-500">Description Page.</p>
        `;
    }
}


customElements.define('owp-description-component', OwpDescriptionComponent);