/**
 * @class OwpTopBarStepSeparator
 * @augments HTMLElement
 * @description Web component for the separator between steps in the top navigation bar.
 */
class OwpTopBarStepSeparator extends HTMLElement {
    /**
     * @description Constructs the OwpTopBarStepSeparator instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.innerHTML = this.getTemplate();
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
        this.innerHTML = this.getTemplate();
    }

    /**
     * @description Generates the HTML template for the separator.
     * @returns {string} The HTML string for the component.
     */
    getTemplate() {
        const isActive = this.hasAttribute('is-active');
        const isCompleted = this.hasAttribute('is-completed');

        const lineClass = (isActive || isCompleted) ? 'bg-purple-500' : 'bg-gray-300';

        return `
            <div class="h-0.5 w-6 mx-2 ${lineClass}"></div>
        `;
    }

}

customElements.define('owp-top-bar-step-separator', OwpTopBarStepSeparator);