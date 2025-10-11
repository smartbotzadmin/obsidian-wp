/**
 * @class OwpNextButton
 * @augments HTMLElement
 * @description Web component for a customizable next button with redirection functionality.
 */
class OwpNextButton extends HTMLElement {
    nextButton = null;
    popup = null;
    redirectTo = null;


    /**
     * @description Observes changes to the 'redirect-to' attribute.
     * @returns {Array<string>} The observed attributes.
     */
    static get observedAttributes() {
        return ['data-owp-navigate'];
    }


    /**
     * @description Constructs the OwpNextButton instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.className += ` relative`;
        this.innerHTML = /*html*/`
            <button id="nextButton" class="flex flex-row justify-center items-center gap-2 bg-cyan-600 hover:bg-cyan-500 p-4 h-11 rounded-md flex items-center cursor-pointer">
                <span class="text-slate-100 text-md font-semibold">
                    ${this.innerHTML}
                </span>
                <img src="/wp-content/plugins/owp/assets/icons/arrow-right.svg"/>
            </button>
            <div id="popup" class="absolute p-2 -top-16 w-40 bg-red-600 rounded-md border border-red-700 outline outline-red-400 text-gray-100 font-semibold invisible">
                Please, complete the information
            </div>
        `;
    }


    /**
     * @description Called when the element is added to the document's DOM.
     * @returns {void}
     */
    connectedCallback() {
        this.nextButton = this.querySelector('#nextButton');
        this.popup = this.querySelector('#popup');
        this.redirectTo = this.getAttribute('data-owp-navigate');

        if (this.nextButton) {
            this.nextButton.addEventListener('click', this.#handleButtonClick.bind(this));
        }
    }


    /**
     * @description Called when the element is removed from the document's DOM.
     * @returns {void}
     */
    disconnectedCallback() {
        if (this.nextButton) {
            this.nextButton.removeEventListener('click', this.#handleButtonClick.bind(this));
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
     * @description Handles the click event for the next button.
     * @returns {void}
     */
    #handleButtonClick() {
        const currentHash = window.location.hash.replace('#', '');
        const statusPayload = window.owpSessionManager.checkPayloadStatus();
        const isFilledCurrentStep = statusPayload[currentHash];

        if (isFilledCurrentStep) {
            if (this.redirectTo) {
                window.location.hash = this.redirectTo;
            }
        } else {
            if (this.popup) {
                this.popup.classList.remove('invisible');
                setTimeout(() => {
                    this.popup.classList.add('invisible');
                }, 2000);
            }
        }
    }
}

customElements.define('owp-next-button', OwpNextButton);