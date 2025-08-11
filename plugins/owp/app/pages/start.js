/**
 * @class OwpStart
 * @augments HTMLElement
 * @description Web component for the "Let's Start" page, integrating top bar and form components.
 */
class OwpStart extends HTMLElement {
    /**
     * @description Constructs the OwpStart instance.
     * @returns {void}
     */
    constructor() {
        super();
    }

    /**
     * @description Called when the element is added to the document's DOM.
     * @returns {void}
     */
    connectedCallback() {
        this.className = `flex justify-center items-center bg-slate-900 h-screen`;
        this.innerHTML = `
            <div class="flex flex-col justify-center gap-2 w-[800px] h-[600px] p-12 rounded-lg bg-slate-950">
                <h2 class="text-3xl font-bold mb-12 text-slate-100">
                    Let's build your website!
                </h2>

                <div class="text-lg text-gray-600 mb-12">
                    Please share some basic details of the website to get started.
                </div>

                <owp-start-name-field></owp-start-name-field>

                <div class="flex flex-col md:flex-row justify-between gap-6 my-6">
                    <owp-start-business-selector></owp-start-business-selector>
                    <owp-start-language-selector></owp-start-language-selector>
                </div>

                <div class="flex flex-row justify-between">
                    <owp-next-button data-owp-navigate="#describe">Next</owp-next-button>
                </div>
            </div>
        `;
    }
}

customElements.define('owp-start', OwpStart);