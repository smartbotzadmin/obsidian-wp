/**
 * @class OwpTopbarStep
 * @augments HTMLElement
 * @description Web component for a single step in the top navigation bar.
 */
class OwpTopbarStep extends HTMLElement {
    /**
     * @description Constructs the OwpTopBarStep instance.
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
            const stepItemDiv = document.createElement('div');
            stepItemDiv.className = 'step-item cursor-pointer';

            const stepTextDiv = document.createElement('div');
            stepTextDiv.className = 'step-text';

            stepItemDiv.appendChild(stepTextDiv);
            this.appendChild(stepItemDiv);
        }
        this.updateContent();
    }

    /**
     * @description Observes changes to the 'name', 'page', 'is-active', and 'is-completed' attributes.
     * @returns {Array<string>} The observed attributes.
     */
    static get observedAttributes() {
        return ['name', 'page', 'is-active', 'is-completed'];
    }

    /**
     * @description Handles changes to observed attributes.
     * @param {string} name - The name of the attribute.
     * @param {string} oldVal - The old value of the attribute.
     * @param {string} newVal - The new value of the attribute.
     * @returns {void}
     */
    attributeChangedCallback(name, oldVal, newVal) {
        this.updateContent();
    }

    /**
     * @description Updates the content and classes of the step element.
     * @returns {void}
     */
    updateContent() {
        const name = this.getAttribute('name') || '';
        const page = this.getAttribute('page');
        const isActive = this.hasAttribute('is-active');
        const isCompleted = this.hasAttribute('is-completed');

        const stepTextElement = this.querySelector('.step-text');
        if (stepTextElement) {
            stepTextElement.textContent = name;
            let classList = ['step-text'];
            if (isActive || isCompleted) {
                classList.push('text-purple-400');
            } else {
                classList.push('text-gray-400');
            }
            stepTextElement.className = classList.join(' ');
        }

        if (page) {
            this.dataset.page = page;
        }
    }
}

customElements.define('owp-topbar-step', OwpTopbarStep);