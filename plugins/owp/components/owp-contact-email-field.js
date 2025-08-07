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
        this.innerHTML = `
            <div class="min-w-72 mb-4 flex-1">
                <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input type="email" id="email" class="shadow appearance-none border border-gray-300 rounded-lg w-full h-11 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Your email">
            </div>
        `;
    }
}

customElements.define('owp-contact-email-field', OwpContactEmailField);