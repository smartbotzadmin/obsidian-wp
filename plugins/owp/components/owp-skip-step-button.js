/**
 * @class OwpSkipStepButton
 * @augments HTMLElement
 * @description Web component for a customizable skip step button with redirection functionality.
 */
class OwpSkipStepButton extends HTMLElement {
    skipButton = null;
    redirectTo = null;


    /**
     * @description Observes changes to the 'redirect-to' attribute.
     * @returns {Array<string>} The observed attributes.
     */
    static get observedAttributes() {
        return ['data-owp-navigate'];
    }


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
     * @description Called when the element is added to the document's DOM.
     * @returns {void}
     */
    connectedCallback() {
        this.skipButton = this.querySelector('#skipButton');
        this.redirectTo = this.getAttribute('data-owp-navigate');

        if (this.skipButton) {
            this.skipButton.addEventListener('click', this.#handleButtonClick.bind(this));
        }
    }


    /**
     * @description Called when the element is removed from the document's DOM.
     * @returns {void}
     */
    disconnectedCallback() {
        if (this.skipButton) {
            this.skipButton.removeEventListener('click', this.#handleButtonClick.bind(this));
        }
    }


    /**
     * @description Handles changes to observed attributes.
     * @param {string} name - The name of the attribute.
     * @param {string} oldVal - The old value of the attribute.
     * @param {string} newVal - The new value of the attribute.
     * @returns {void}
     */
    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'data-owp-navigate') {
            this.redirectTo = newVal;
        }
    }


    /**
     * @private
     * @description Handles the click event for the skip button.
     * @returns {void}
     */
    #handleButtonClick() {
        if (this.redirectTo) {
            window.location.hash = this.redirectTo;
        }
    }
}

customElements.define('owp-skip-step-button', OwpSkipStepButton);