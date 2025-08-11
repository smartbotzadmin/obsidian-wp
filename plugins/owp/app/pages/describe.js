/**
 * @class OwpDescribe
 * @augments HTMLElement
 * @description Web component for the "Describe" page, integrating top bar and form components.
 */
class OwpDescribe extends HTMLElement {
    /**
     * @description Constructs the OwpDescribe instance.
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
        this.className = `flex justify-center items-center h-screen bg-slate-800`;
        this.innerHTML = `
            <div class="w-[800px] h-[600px] bg-white p-12 rounded-lg shadow-md">
                <h2 class="text-2xl font-bold mb-4">
                    What is asd? Tell us more about the restaurant.
                </h2>
                <p class="text-md text-gray-600 my-6">
                    Please be as descriptive as you can. Share details such as a brief about the restaurant, specialty, menu, etc.
                </p>

                <owp-describe-text-area></owp-describe-text-area>

                <div class="flex flex-row justify-between mt-6">
                    <owp-back-button data-owp-navigate="#start">Back</owp-back-button>
                    <owp-next-button data-owp-navigate="#contact">Next</owp-next-button>
                </div>
            </div>
        `;
    }
}

customElements.define('owp-describe', OwpDescribe);