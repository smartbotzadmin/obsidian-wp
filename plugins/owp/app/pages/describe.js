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
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
            <link rel="stylesheet" href="${window.location.origin}/wp-content/plugins/owp/assets/css/output.css">
            
            <div class="h-screen bg-purple-50">
                <owp-topbar current-page="owp-describe"></owp-topbar>
    
                <div class="bg-white p-12 rounded-lg shadow-md max-w-3xl mx-auto mt-20">
                    <h2 class="text-2xl font-bold mb-4">
                        What is asd? Tell us more about the restaurant.
                    </h2>
                    <p class="text-md text-gray-600 my-6">
                        Please be as descriptive as you can. Share details such as a brief about the restaurant, specialty, menu, etc.
                    </p>
    
                    <owp-describe-text-area></owp-describe-text-area>

                    <div class="flex flex-row justify-between mt-6">
                        <owp-back-button data-owp-navigate="start">Back</owp-back-button>
                        <owp-next-button data-owp-navigate="contact">Next</owp-next-button>
                    </div>
                </div>

            </div>
        `;
    }
}

customElements.define('owp-describe', OwpDescribe);