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
        this.className += ``;
        this.innerHTML = `
            <button id="nextButton" class="flex flex-row justify-center items-center gap-2 bg-cyan-600 hover:bg-cyan-500 p-4 h-11 rounded-md flex items-center cursor-pointer">
                <span class="text-slate-100 text-md font-semibold">
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