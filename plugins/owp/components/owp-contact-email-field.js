/**
 * @class OwpContactEmailField
 * @augments HTMLElement
 * @description Web component for the email input field on the contact page.
 */
class OwpContactEmailField extends HTMLElement {
    /**
     * @description Constructs the OwpContactEmailField instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.className = `min-w-72`;
        this.innerHTML = `
            <label for="email" class="block text-slate-300 text-sm font-semibold mb-2">Email</label>
            <input type="email" id="email" class="shadow appearance-none border border-slate-700 rounded-xl w-full h-11 px-3 text-md text-slate-100 leading-tight bg-slate-900 transition duration-300 ease-in-out outline outline-transparent hover:outline-1 hover:outline-cyan-500 focus:outline-2 focus:outline-cyan-500" placeholder="Your email">
        `;
    }


    /**
     * @description Called when the element is added to the document's DOM.
     * @returns {void}
     */
    connectedCallback() {
        this.emailInput = this.querySelector('#email');
        this.emailInput.addEventListener('input', this.#handleInputChange.bind(this));
        this.#loadInitialValue();
    }


    /**
     * @description Called when the element is removed from the document's DOM.
     * @returns {void}
     */
    disconnectedCallback() {
        // Cleanup event listeners if necessary
        this.emailInput.removeEventListener('input', this.#handleInputChange.bind(this));
    }


    /**
     * @private
     * @description Handles the input event on the email field, updating the session payload.
     * @param {Event} event - The input event.
     * @returns {void}
     */
    #handleInputChange(event) {
        const email = event.target.value;
        const currentPayload = window.owpSessionManager.getPayload();
        window.owpSessionManager.updatePayloadSection('contact', {
            ...currentPayload.contact,
            email: email
        });
    }


    /**
     * @private
     * @description Loads the initial value from sessionStorage and sets it to the input field.
     * @returns {void}
     */
    #loadInitialValue() {
        const currentPayload = window.owpSessionManager.getPayload();
        if (currentPayload.contact && currentPayload.contact.email) {
            this.emailInput.value = currentPayload.contact.email;
        }
    }
}

customElements.define('owp-contact-email-field', OwpContactEmailField);