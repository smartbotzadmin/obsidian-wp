/**
 * @class OwpBackButton
 * @augments HTMLElement
 * @description Web component for a customizable back button with redirection functionality.
 */
class OwpBackButton extends HTMLElement {
    /**
     * @description Observes changes to the 'redirect-to' attribute.
     * @returns {Array<string>} The observed attributes.
     */
    static get observedAttributes() {
        return ['data-owp-navigate'];
    }


    /**
     * @description Constructs the OwpBackButton instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.innerHTML = `
            <button id="backButton" class="flex flex-row justify-center items-center gap-2 bg-gray-200 hover:bg-gray-400 p-4 h-11 rounded-xl flex items-center cursor-pointer transition-colors duration-300">
                <img src="/wp-content/plugins/owp/assets/icons/arrow-left.svg"/>
                <span class="text-md text-gray-600 font-semibold">
                    ${this.innerHTML}
                </span>
            </button>
        `;
        this.backButton = null;
        this.redirectTo = this.getAttribute('data-owp-navigate');
    }


    /**
     * @description Called when the element is added to the document's DOM.
     * @returns {void}
     */
    connectedCallback() {
        this.backButton = this.querySelector('#backButton');
        if (this.backButton) {
            this.backButton.addEventListener('click', this.#handleButtonClick.bind(this));
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
     * @description Handles the click event for the back button.
     * @returns {void}
     */
    #handleButtonClick() {
        if (this.redirectTo) {
            window.location.hash = this.redirectTo;
        }
    }
}

customElements.define('owp-back-button', OwpBackButton);