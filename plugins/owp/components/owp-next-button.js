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
            <style>
                @keyframes bounce-outline {
                    0% { outline: 2px solid transparent; }
                    10%, 90% { outline: 2px solid #ef4444; } /* red-500 */
                    100% { outline: 2px solid transparent; }
                }
                .animate-bounce-outline {
                    animation: bounce-outline 2s linear;
                }
            </style>
            <button id="nextButton" class="flex flex-row justify-center items-center gap-2 bg-cyan-600 hover:bg-cyan-500 p-4 h-11 rounded-xl flex items-center cursor-pointer transition-colors duration-300">
                <span class="text-slate-100 text-md font-semibold">
                    ${this.innerHTML}
                </span>
                <img src="/wp-content/plugins/owp/assets/icons/arrow-right.svg"/>
            </button>
            <div id="popup" class="absolute bottom-full left-0 mb-2 p-3 w-64 bg-gray-100 text-slate-950 text-base rounded-lg shadow-lg border border-gray-200 outline outline-gray-300 font-semibold opacity-0 scale-0 transition-all duration-300 ease-in-out transform-origin-bottom-left">
                Please, complete the information
                <div class="absolute left-3 bottom-0 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-gray-100 translate-y-full"></div>
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
                this.popup.classList.remove('opacity-0', 'scale-0');
                this.popup.classList.add('opacity-100', 'scale-100');
                this.nextButton.classList.add('animate-bounce-outline');

                setTimeout(() => {
                    this.popup.classList.remove('opacity-100', 'scale-100');
                    this.popup.classList.add('opacity-0', 'scale-0');
                    this.nextButton.classList.remove('animate-bounce-outline');
                }, 2000);
            }
        }
    }
}

customElements.define('owp-next-button', OwpNextButton);