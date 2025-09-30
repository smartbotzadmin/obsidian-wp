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
    }


    /**
     * @description Called when the element is added to the document's DOM.
     * @returns {void}
     */
    connectedCallback() {
        this.className = `flex flex-col items-center h-screen w-full`;
        this.innerHTML = `
            <h2 class="text-3xl font-bold mt-20 mb-8 text-slate-100 text-center">
                Choose the Design
            </h2>
            
            <owp-design-search-bar></owp-design-search-bar>

            <owp-design-grid></owp-design-grid>

            <div class="flex flex-row justify-between items-center p-3 gap-4">
                <owp-back-button data-owp-navigate="#pictures">Back</owp-back-button>
            </div>
        `;
    }
}

customElements.define('owp-design', OwpDesign);