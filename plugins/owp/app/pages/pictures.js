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
        this.innerHTML = `
            <div class="flex flex-col h-screen bg-purple-50">
    
                <div class="bg-white p-6 rounded-lg shadow-md w-[98%] flex-1 mx-auto mt-20 mb-6">
                    <h2 class="text-2xl font-bold mb-4 text-center">
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