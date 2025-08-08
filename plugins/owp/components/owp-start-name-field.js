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
        this.innerHTML = `
            <div class="mb-4">
                <label for="siteName" class="block text-gray-600 text-sm font-semibold mb-2">Name of the website.*</label>
                <input type="text" id="siteName" class="shadow appearance-none border border-gray-300 rounded-lg w-full h-11 px-3 text-gray-600 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter name or title of the website">
            </div>
        `;
    }
}

customElements.define('owp-start-name-field', OwpStartNameField);