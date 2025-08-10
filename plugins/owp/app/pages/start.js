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
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
            <link rel="stylesheet" href="${window.location.origin}/wp-content/plugins/owp/assets/css/output.css">
            
            <div class="h-screen bg-purple-50">
    
                <div class="bg-white p-12 rounded-lg shadow-md max-w-3xl mx-auto mt-20">
                    <h2 class="text-3xl font-bold mb-12">
                        Let's build your website!
                    </h2>
                    <p class="text-md text-gray-600 my-6">
                        Please share some basic details of the website to get started.
                    </p>
    
                    <owp-start-name-field></owp-start-name-field>
    
                    <div class="flex flex-col md:flex-row justify-between gap-6 my-6">
                        <owp-start-business-selector></owp-start-business-selector>
                        <owp-start-language-selector></owp-start-language-selector>
                    </div>
    
                    <div class="flex flex-row justify-between">
                        <!-- <owp-back-button data-owp-navigate="#start">Back</owp-back-button> -->
                        <owp-next-button data-owp-navigate="#describe">Next</owp-next-button>
                    </div>
                </div>

            </div>
        `;
    }
}

customElements.define('owp-start', OwpStart);