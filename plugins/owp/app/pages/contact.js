/**
 * @class OwpContact
 * @augments HTMLElement
 * @description Web component for the "Contact" page, integrating top bar and contact form components.
 */
class OwpContact extends HTMLElement {
    /**
     * @description Constructs the OwpContact instance.
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
        this.innerHTML = `
            <div class="h-screen bg-purple-50">
    
                <div class="bg-white p-12 rounded-lg shadow-md max-w-3xl mx-auto mt-20">
                    <h2 class="text-2xl font-bold mb-4">
                        How can people get in touch with asd
                    </h2>
                    <p class="text-md text-gray-600 my-6">
                        Please provide the contact information below. These will be used on the website.
                    </p>
    
                    <div class="flex flex-col md:flex-row justify-between gap-6 my-6">
                        <owp-contact-email-field></owp-contact-email-field>
                        <owp-contact-phone-field></owp-contact-phone-field>
                    </div>
    
                    <owp-contact-address-field></owp-contact-address-field>

                    <owp-contact-social-media></owp-contact-social-media>
    
                    <div class="flex flex-row justify-end items-center mt-6 gap-4">
                        <owp-skip-step-button data-owp-navigate="#pictures"></owp-skip-step-button>
                        <owp-back-button data-owp-navigate="#describe">Back</owp-back-button>
                        <owp-next-button data-owp-navigate="#pictures">Next</owp-next-button>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('owp-contact', OwpContact);