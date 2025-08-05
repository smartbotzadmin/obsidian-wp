/**
 * Custom Web Component for the OWP Contact Page.
 * This is a dummy component to be developed deeper later.
 */
class OwpContactComponent extends HTMLElement {
    /**
     * Constructs the OwpContactComponent instance.
     *
     * @return {void}
     */
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    border: 1px solid #eee;
                    padding: 20px;
                    background-color: #f9f9f9;
                    text-align: center;
                }
                p {
                    color: #333;
                    font-size: 1.1em;
                }
            </style>
            <p>This is the OWP Contact Component (placeholder).</p>
        `;
    }
}


customElements.define('owp-contact-component', OwpContactComponent);