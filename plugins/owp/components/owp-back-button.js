/**
 * @class OwpBackButton
 * @augments HTMLElement
 * @description Web component for a customizable back button with redirection functionality.
 */
class OwpBackButton extends HTMLElement {
    /**
     * @description Constructs the OwpBackButton instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.innerHTML = `
            <button id="backButton" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 mt-6 h-11 rounded-md flex items-center">
                <img class="pr-2" src="/wp-content/plugins/owp/assets/icons/arrow-left.svg"/>
                ${this.innerHTML}
            </button>
        `;
    }

    /**
     * @description Observes changes to the 'redirect-to' attribute.
     * @returns {Array<string>} The observed attributes.
     */
    static get observedAttributes() {
        return ['redirect-to'];
    }

    /**
     * @description Handles changes to observed attributes.
     * @param {string} name - The name of the attribute.
     * @param {string} oldVal - The old value of the attribute.
     * @param {string} newVal - The new value of the attribute.
     * @returns {void}
     */
    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'redirect-to' && newVal) {
            this.querySelector('#backButton').addEventListener('click', () => {
                window.location.href = newVal;
            });
        }
    }
}

customElements.define('owp-back-button', OwpBackButton);