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
        this.innerHTML = `
            <div class="mb-4">
                <label for="address" class="block text-gray-700 text-sm font-bold mb-2">Address</label>
                <input type="text" id="address" class="shadow appearance-none border border-gray-300 rounded-lg w-full h-11 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter address">
            </div>
        `;
    }
}

customElements.define('owp-contact-address-field', OwpContactAddressField);