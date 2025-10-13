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
        this.className = `flex justify-center items-center h-screen`;
        this.innerHTML = /*html*/`
            <div class="w-[800px] bg-slate-950 p-12 rounded-3xl border border-slate-700">
                <h2 class="text-3xl font-bold mb-12 text-slate-100">
                    What is <span class="underline--magical">${window.owpSessionManager.getPayload().start.name}</span>? Tell us more about the restaurant.
                </h2>
                <p class="text-lg text-slate-100 mb-12">
                    Please be as descriptive as you can. Share details such as a brief about the restaurant, specialty, menu, etc.
                </p>

                <owp-describe-text-area class="mb-2"></owp-describe-text-area>

                <div class="flex flex-row justify-between">
                    <owp-back-button data-owp-navigate="#let's-start">Back</owp-back-button>
                    <owp-next-button data-owp-navigate="#contact">Next</owp-next-button>
                </div>
            </div>
        `;
    }
}

customElements.define('owp-describe', OwpDescribe);