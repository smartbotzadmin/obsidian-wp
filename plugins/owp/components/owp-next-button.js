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
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
            <link rel="stylesheet" href="${window.location.origin}/wp-content/plugins/owp/assets/css/output.css">
            <button id="nextButton" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 my-6 rounded-md flex items-center">
                <slot></slot>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
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
            this.shadowRoot.getElementById('nextButton').addEventListener('click', () => {
                window.location.href = newVal;
            });
        }
    }
}

customElements.define('owp-next-button', OwpNextButton);