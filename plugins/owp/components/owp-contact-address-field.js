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
            <input type="text" id="address" class="shadow appearance-none border border-slate-700 rounded-lg w-full h-11 px-3 text-md text-slate-100 leading-tight focus:outline-none focus:shadow-outline bg-slate-900" placeholder="Enter address">
        `;
    }
}

customElements.define('owp-contact-address-field', OwpContactAddressField);