/**
 * @class OwpDesign
 * @augments HTMLElement
 * @description Web component for the "Design" page, integrating top bar and design selection components.
 */
class OwpDesign extends HTMLElement {
    /**
     * @description Constructs the OwpDesign instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.innerHTML = `
            <div class="h-screen bg-purple-50">
    
                <div class="w-full p-6 rounded-lg mt-10">
                    <h2 class="text-2xl font-bold mb-4 text-center">
                        Choose the Design
                    </h2>
                    <p class="text-md text-gray-600 my-6 text-center">
                        Select a design that best fits your website.
                    </p>
                    
                    <owp-design-search-bar></owp-design-search-bar>

                    <owp-design-grid class="w-full"></owp-design-grid>

                    <div class="flex flex-row justify-between mt-10">
                        <owp-back-button data-owp-navigate="#pictures">Back</owp-back-button>
                        <owp-next-button data-owp-navigate="#publish">Next</owp-next-button>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('owp-design', OwpDesign);