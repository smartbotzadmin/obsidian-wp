/**
 * @class OwpContactPhoneField
 * @augments HTMLElement
 * @description Web component for the phone number input field on the contact page.
 */
class OwpContactPhoneField extends HTMLElement {
    /**
     * @description Constructs the OwpContactPhoneField instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.className = `min-w-72`;
        this.innerHTML = `
            <label for="phoneNumber" class="block text-slate-300 text-sm font-semibold mb-2">Phone Number</label>
            <input type="tel" id="phoneNumber" class="shadow appearance-none border border-slate-700 rounded-lg w-full h-11 px-3 text-md text-slate-100 leading-tight focus:outline-none focus:shadow-outline bg-slate-900" placeholder="Your phone number">
        `;
    }


    /**
     * @description Called when the element is added to the document's DOM.
     * @returns {void}
     */
    connectedCallback() {
        this.phoneNumberInput = this.querySelector('#phoneNumber');
        this.phoneNumberInput.addEventListener('input', this.#handleInputChange.bind(this));
        this.#loadInitialValue();
    }


    /**
     * @private
     * @description Handles the input event on the phone number field, updating the session payload.
     * @param {Event} event - The input event.
     * @returns {void}
     */
    #handleInputChange(event) {
        const phoneNumber = event.target.value;
        const currentPayload = window.owpSessionManager.getPayload();
        window.owpSessionManager.updatePayloadSection('contact', {
            ...currentPayload.contact,
            phone: phoneNumber
        });
    }


    /**
     * @private
     * @description Loads the initial value from sessionStorage and sets it to the input field.
     * @returns {void}
     */
    #loadInitialValue() {
        const currentPayload = window.owpSessionManager.getPayload();
        if (currentPayload.contact && currentPayload.contact.phone) {
            this.phoneNumberInput.value = currentPayload.contact.phone;
        }
    }
}

customElements.define('owp-contact-phone-field', OwpContactPhoneField);