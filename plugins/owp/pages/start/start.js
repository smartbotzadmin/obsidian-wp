class OwpStart extends HTMLElement {
    /**
     * Constructs the OwpStart instance.
     *
     * @return {void}
     */
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
            <link rel="stylesheet" href="${window.location.origin}/wp-content/plugins/owp/assets/css/output.css">

            <p class="bg-blue-100 m-0 flex text-xl justify-center items-center p-2">
                Start Page.
            </p>
        `;
    }
}


customElements.define('owp-start', OwpStart);