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
        this.innerHTML = `
            <div class="min-w-72 mb-4 flex-1">
                <label for="phoneNumber" class="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
                <input type="tel" id="phoneNumber" class="shadow appearance-none border border-gray-300 rounded-lg w-full h-11 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Your phone number">
            </div>
        `;
    }
}

customElements.define('owp-contact-phone-field', OwpContactPhoneField);