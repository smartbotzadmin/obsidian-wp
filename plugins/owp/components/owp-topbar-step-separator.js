/**
 * @class OwpTopbarStepSeparator
 * @augments HTMLElement
 * @description Web component for the separator between steps in the top navigation bar.
 */
class OwpTopbarStepSeparator extends HTMLElement {
    /**
     * @description Constructs the OwpTopBarStepSeparator instance.
     * @returns {void}
     */
    constructor() {
        super();
    }

    /**
     * @description Called when the element is added to the document's DOM.
     * @returns {void}
     */
    connectedCallback() {
        if (!this.hasChildNodes()) {
            const separatorLineDiv = document.createElement('div');
            separatorLineDiv.className = 'separator-line';
            this.appendChild(separatorLineDiv);
        }
        this.updateLineClass();
    }

    /**
     * @description Observes changes to the 'is-active' and 'is-completed' attributes.
     * @returns {Array<string>} The observed attributes.
     */
    static get observedAttributes() {
        return ['is-active', 'is-completed'];
    }

    /**
     * @description Handles changes to observed attributes.
     * @param {string} name - The name of the attribute.
     * @param {string} oldVal - The old value of the attribute.
     * @param {string} newVal - The new value of the attribute.
     * @returns {void}
     */
    attributeChangedCallback(name, oldVal, newVal) {
        this.updateLineClass();
    }

    /**
     * @description Updates the class of the separator line.
     * @returns {void}
     */
    updateLineClass() {
        const isActive = this.hasAttribute('is-active');
        const isCompleted = this.hasAttribute('is-completed');
        const lineElement = this.querySelector('.separator-line');

        if (lineElement) {
            let classList = ['h-0.5', 'w-6', 'mx-2'];
            if (isActive || isCompleted) {
                classList.push('bg-purple-500');
            } else {
                classList.push('bg-gray-300');
            }
            lineElement.className = classList.join(' ');
        }
    }
}

customElements.define('owp-topbar-step-separator', OwpTopbarStepSeparator);