/**
 * @class OwpStartNameField
 * @augments HTMLElement
 * @description Web component for the website name input field.
 */
class OwpStartNameField extends HTMLElement {
    /**
     * @description Constructs the OwpStartNameField instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.className = `mb-6`;
        this.innerHTML = `
            <label for="siteName" class="block text-slate-300 text-sm font-semibold mb-2">Name of the website</label>
            <input type="text" id="siteName" class="shadow appearance-none border border-slate-700 rounded-lg w-full h-11 px-3 text-slate-300 text-md bg-slate-900 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter name or title of the website">
        `;
    }
}

customElements.define('owp-start-name-field', OwpStartNameField);