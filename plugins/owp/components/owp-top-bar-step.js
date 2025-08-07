/**
 * @class OwpTopBarStep
 * @augments HTMLElement
 * @description Web component for a single step in the top navigation bar.
 */
class OwpTopBarStep extends HTMLElement {
    /**
     * @description Constructs the OwpTopBarStep instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.innerHTML = this.getTemplate();
    }

    /**
     * @description Called when the element is added to the document's DOM.
     * @returns {void}
     */
    connectedCallback() {
        const page = this.getAttribute('page');
        if (page) {
            this.dataset.page = page;
        }
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
        this.innerHTML = this.getTemplate();
    }

    /**
     * @description Generates the HTML template for the step.
     * @returns {string} The HTML string for the component.
     */
    getTemplate() {
        const name = this.getAttribute('name') || '';
        const page = this.getAttribute('page') || '';
        const isActive = this.hasAttribute('is-active');
        const isCompleted = this.hasAttribute('is-completed');

        const stepTextClass = isActive ? 'text-purple-500 text-lg' : (isCompleted ? 'text-purple-500 text-lg' : 'text-gray-600 font-normal text-lg');

        return `
            <style>
                .step-item {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                }
            </style>
            <div class="step-item">
                <div class="${stepTextClass}">${name}</div>
            </div>
        `;
    }

}

customElements.define('owp-top-bar-step', OwpTopBarStep);