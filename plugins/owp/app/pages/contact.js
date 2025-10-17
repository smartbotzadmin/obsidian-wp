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
        this.className = `flex justify-center items-center h-screen`;
        this.innerHTML = /*html*/`
            <div class="w-[800px] bg-slate-950 p-12 rounded-3xl border border-slate-700">
                <h2 class="text-3xl font-bold mb-12 text-slate-100">
                    How can people get in touch with <span class="underline--magical">${window.owpSessionManager.getPayload().start.name}</span>
                </h2>
                <p class="text-lg text-slate-100 mb-12">
                    Please provide the contact information below. These will be used on the website.
                </p>

                <div class="flex flex-col md:flex-row justify-between gap-6 mb-6">
                    <owp-contact-email-field></owp-contact-email-field>
                    <owp-contact-phone-field></owp-contact-phone-field>
                </div>

                <owp-contact-address-field></owp-contact-address-field>

                <owp-contact-social-media></owp-contact-social-media>

                <div class="flex flex-row justify-end items-center gap-4">
                    <owp-skip-step-button data-owp-navigate="#pictures"></owp-skip-step-button>
                    <owp-back-button data-owp-navigate="#describe">Back</owp-back-button>
                    <owp-next-button data-owp-navigate="#pictures">Next</owp-next-button>
                </div>
            </div>
        `;
    }
}

customElements.define('owp-contact', OwpContact);