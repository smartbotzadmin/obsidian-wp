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
            <button id="nextButton" class="flex flex-row justify-center items-center gap-2 bg-purple-500 hover:bg-purple-600 p-4 mt-6 h-11 rounded-md flex items-center">
                <span class="text-gray-50 font-semibold">
                    ${this.innerHTML}
                </span>
                <img src="/wp-content/plugins/owp/assets/icons/arrow-right.svg"/>
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
            this.querySelector('#nextButton').addEventListener('click', () => {
                window.location.hash = newVal;
            });
        }
    }
}

customElements.define('owp-next-button', OwpNextButton);