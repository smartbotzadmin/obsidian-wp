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
        this.className = `flex justify-center items-center bg-slate-900 h-screen w-full`;
        this.innerHTML = `
            <div class="flex flex-col h-screen bg-slate-950">
    
                <div class="bg-slate-950 p-6 rounded-lg border border-slate-700 flex-1">
                    <h2 class="text-3xl font-bold mb-12 text-slate-100 text-center">
                        Select the Images
                    </h2>
                    
                    <owp-pictures-search-bar></owp-pictures-search-bar>
 
                    <owp-pictures-tabs></owp-pictures-tabs>
 
                    <owp-pictures-grid></owp-pictures-grid>
    
                    <div class="flex flex-row justify-end mt-6 gap-4">
                        <owp-skip-step-button data-owp-navigate="#design"></owp-skip-step-button>
                        <owp-back-button data-owp-navigate="#contact">Back</owp-back-button>
                        <owp-next-button data-owp-navigate="#design">Next</owp-next-button>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('owp-pictures', OwpPictures);