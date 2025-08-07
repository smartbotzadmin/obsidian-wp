/**
 * @class OwpNextButton
 * @augments HTMLElement
 * @description Web component for a customizable next button with redirection functionality.
 */
class OwpNextButton extends HTMLElement {
    /**
     * @description Constructs the OwpNextButton instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.innerHTML = `
            <button id="nextButton" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-6 h-11 rounded-md flex items-center">
                ${this.innerHTML}
                <img class="pl-2" src="/wp-content/plugins/owp/assets/icons/arrow-right.svg"/>
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
            this.querySelector('#nextButton').addEventListener('click', () => {
                window.location.href = newVal;
            });
        }
    }
}

customElements.define('owp-next-button', OwpNextButton);