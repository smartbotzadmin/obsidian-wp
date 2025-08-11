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
            <input type="email" id="email" class="shadow appearance-none border border-slate-700 rounded-lg w-full h-11 px-3 text-md text-slate-100 leading-tight focus:outline-none focus:shadow-outline bg-slate-900" placeholder="Your email">
        `;
    }
}

customElements.define('owp-contact-email-field', OwpContactEmailField);