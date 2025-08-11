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
}

customElements.define('owp-contact-phone-field', OwpContactPhoneField);