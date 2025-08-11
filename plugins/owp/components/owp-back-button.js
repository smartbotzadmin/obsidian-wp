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
            <button id="backButton" class="flex flex-row justify-center items-center gap-2 bg-gray-200 hover:bg-gray-300 p-4 h-11 rounded-md flex items-center cursor-pointer">
                <img src="/wp-content/plugins/owp/assets/icons/arrow-left.svg"/>
                <span class="text-md text-gray-600 font-semibold">
                    ${this.innerHTML}
                </span>
            </button>
        `;
    }

    /**
     * @description Observes changes to the 'redirect-to' attribute.
     * @returns {Array<string>} The observed attributes.
     */
    static get observedAttributes() {
        return ['data-owp-navigate'];
    }

    /**
     * @description Handles changes to observed attributes.
     * @param {string} name - The name of the attribute.
     * @param {string} oldVal - The old value of the attribute.
     * @param {string} newVal - The new value of the attribute.
     * @returns {void}
     */
    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'data-owp-navigate' && newVal) {
            this.querySelector('#backButton').addEventListener('click', () => {
                window.location.hash = newVal;
            });
        }
    }
}

customElements.define('owp-back-button', OwpBackButton);