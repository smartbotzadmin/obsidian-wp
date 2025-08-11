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
            <button id="skipButton" class="text-slate-100 hover:text-slate-300 font-bold p-4 h-11 rounded-md flex justify-center items-center cursor-pointer">
                Skip Step
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
            this.querySelector('#skipButton').addEventListener('click', () => {
                window.location.hash = newVal;
            });
        }
    }
}

customElements.define('owp-skip-step-button', OwpSkipStepButton);