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
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
            <link rel="stylesheet" href="${window.location.origin}/wp-content/plugins/owp/assets/css/output.css">
            <button id="backButton" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 my-6 rounded-md flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                <slot></slot>
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
            this.shadowRoot.getElementById('backButton').addEventListener('click', () => {
                window.location.href = newVal;
            });
        }
    }
}

customElements.define('owp-back-button', OwpBackButton);