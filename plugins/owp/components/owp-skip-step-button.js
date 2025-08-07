/**
 * @class OwpSkipStepButton
 * @augments HTMLElement
 * @description Web component for a customizable skip step button with redirection functionality.
 */
class OwpSkipStepButton extends HTMLElement {
    /**
     * @description Constructs the OwpSkipStepButton instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.innerHTML = `
            <button id="skipButton" class="text-gray-500 hover:text-gray-700 font-bold py-2 px-4 mt-6 h-11 rounded-md flex items-center">
                Skip Step
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
            this.querySelector('#skipButton').addEventListener('click', () => {
                window.location.href = newVal;
            });
        }
    }
}

customElements.define('owp-skip-step-button', OwpSkipStepButton);