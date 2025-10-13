/**
 * @class OwpContactAddressField
 * @augments HTMLElement
 * @description Web component for the address input field on the contact page.
 */
class OwpContactAddressField extends HTMLElement {
    /**
     * @description Constructs the OwpContactAddressField instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.className = `flex flex-col mb-6`;
        this.innerHTML = `
            <label for="address" class="text-slate-300 text-sm font-semibold mb-2">Address</label>
            <input type="text" id="address" class="shadow appearance-none border border-slate-700 rounded-xl w-full h-11 px-3 text-md text-slate-100 leading-tight bg-slate-900 transition duration-300 ease-in-out outline outline-transparent hover:outline-1 hover:outline-cyan-500 focus:outline-2 focus:outline-cyan-500" placeholder="Enter address">
        `;
    }


    /**
     * @description Called when the element is added to the document's DOM.
     * @returns {void}
     */
    connectedCallback() {
        this.addressInput = this.querySelector('#address');
        this.addressInput.addEventListener('input', this.#handleInputChange.bind(this));
        this.#loadInitialValue();
    }


    /**
     * @description Called when the element is removed from the document's DOM.
     * @returns {void}
     */
    disconnectedCallback() {
        // Cleanup event listeners if necessary
        this.addressInput.removeEventListener('input', this.#handleInputChange.bind(this));
    }


    /**
     * @private
     * @description Handles the input event on the address field, updating the session payload.
     * @param {Event} event - The input event.
     * @returns {void}
     */
    #handleInputChange(event) {
        const address = event.target.value;
        const currentPayload = window.owpSessionManager.getPayload();
        window.owpSessionManager.updatePayloadSection('contact', {
            ...currentPayload.contact,
            address: address
        });
    }


    /**
     * @private
     * @description Loads the initial value from sessionStorage and sets it to the input field.
     * @returns {void}
     */
    #loadInitialValue() {
        const currentPayload = window.owpSessionManager.getPayload();
        if (currentPayload.contact && currentPayload.contact.address) {
            this.addressInput.value = currentPayload.contact.address;
        }
    }
}

customElements.define('owp-contact-address-field', OwpContactAddressField);