/**
 * @class OwpPictures
 * @augments HTMLElement
 * @description Web component for the "Pictures" page, integrating top bar, search, tabs, and image grid components.
 */
class OwpPictures extends HTMLElement {
    /**
     * @description Constructs the OwpPictures instance.
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
        this.className = `flex flex-col items-center h-screen w-full`;
        this.innerHTML = `
            <h2 class="text-3xl font-bold mt-20 mb-8 text-slate-100 text-center">
                Select the Images
            </h2>
            
            <owp-pictures-search-bar></owp-pictures-search-bar>

            <owp-pictures-tabs></owp-pictures-tabs>

            <owp-pictures-grid></owp-pictures-grid>

            <div class="flex flex-row justify-center items-center p-3 gap-4">
                <owp-skip-step-button data-owp-navigate="#design"></owp-skip-step-button>
                <owp-back-button data-owp-navigate="#contact">Back</owp-back-button>
                <owp-next-button data-owp-navigate="#design">Next</owp-next-button>
            </div>
        `;
    }
}

customElements.define('owp-pictures', OwpPictures);