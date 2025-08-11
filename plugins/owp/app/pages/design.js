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
        this.className = `flex justify-center items-center h-screen`;
        this.innerHTML = `
            <div class="w-[800px] p-12 rounded-lg bg-slate-950 border border-slate-700">
                <h2 class="text-3xl font-bold mb-12 text-slate-100 text-center">
                    Choose the Design
                </h2>
                <p class="text-lg text-slate-100 mb-12 text-center">
                    Select a design that best fits your website.
                </p>
                
                <owp-design-search-bar></owp-design-search-bar>

                <owp-design-grid class="w-full"></owp-design-grid>

                <div class="flex flex-row justify-between mt-10">
                    <owp-back-button data-owp-navigate="#pictures">Back</owp-back-button>
                    <owp-next-button data-owp-navigate="#publish">Next</owp-next-button>
                </div>
            </div>
        `;
    }
}

customElements.define('owp-design', OwpDesign);