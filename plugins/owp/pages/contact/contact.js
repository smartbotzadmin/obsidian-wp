/**
 * @desc Custom Web Component for the OWP Contact Page.
 * This is a dummy component to be developed deeper later.
 */
class OwpContactComponent extends HTMLElement {


    /**
     * @desc Constructs the OwpContactComponent instance.
     * @return {void}
     */
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
            <link rel="stylesheet" href="${window.location.origin}/wp-content/plugins/owp/assets/css/output.css">

            <p class="bg-blue-100 m-0 flex text-xl justify-center items-center p-2">
                Contact Page.
            </p>
        `;
    }
}


customElements.define('owp-contact-component', OwpContactComponent);