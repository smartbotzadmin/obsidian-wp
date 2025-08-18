/**
 * @class OwpTopbar
 * @augments HTMLElement
 * @description Web component for the top navigation bar, including the logo, step indicator, and exit options.
 */
class OwpTopbar extends HTMLElement {
    /**
     * @description Constructs the OwpTopBar instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.steps = [
            { name: "Start", page: "owp-start" },
            { name: "Describe", page: "owp-describe" },
            { name: "Contact", page: "owp-contact" },
            { name: "Pictures", page: "owp-pictures" },
            { name: "Design", page: "owp-design" }
        ];
        this.innerHTML = this.getTemplate();
    }

    /**
     * @description Observes changes to the 'current-page' attribute.
     * @returns {Array<string>} The observed attributes.
     */
    static get observedAttributes() {
        return ['current-page'];
    }

    /**
     * @description Handles changes to observed attributes.
     * @param {string} name - The name of the attribute.
     * @param {string} oldVal - The old value of the attribute.
     * @param {string} newVal - The new value of the attribute.
     * @returns {void}
     */
    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'current-page' && oldVal !== newVal) {
            this.updateStepsHighlighting(newVal);
            this.addStepEventListeners(); // Re-add listeners if steps are re-rendered
        }
    }

    /**
     * @description Called when the element is added to the document's DOM.
     * @returns {void}
     */
    connectedCallback() {
        // Set initial current-page based on hash, which will trigger updateStepsHighlighting via attributeChangedCallback
        this.handleHashChange();
        this.addStepEventListeners(); // Ensure listeners are added after initial render
        window.addEventListener('hashchange', this.handleHashChange.bind(this));
    }

    /**
     * @description Called when the element is removed from the document's DOM.
     * @returns {void}
     */
    disconnectedCallback() {
        window.removeEventListener('hashchange', this.handleHashChange.bind(this));
    }


    /**
     * @description Handles hash change event to update the current page.
     * @returns {void}
     */
    handleHashChange() {
        const currentHash = window.location.hash.substring(1); // Remove '#'
        const currentPage = this.steps.find(step => step.name.toLowerCase().replace(/\s/g, '-') === currentHash)?.page;
        if (currentPage) {
            this.setAttribute('current-page', currentPage);
        }
    }

    /**
     * @description Handles click event for a step item.
     * @param {Event} event - The click event.
     * @returns {void}
     */
    handleStepClick(event) {
        const page = event.currentTarget.dataset.page;
        const stepName = event.currentTarget.getAttribute('name');
        if (page && stepName) {
            const hash = stepName.toLowerCase().replace(/\s/g, '-');
            window.location.hash = hash;
            // The hashchange event listener will now handle updating 'current-page'
        }
    }


    /**
     * @description Adds click event listeners to each step item for navigation.
     * @returns {void}
     */
    addStepEventListeners() {
        // Remove existing listeners to prevent duplicates
        this.querySelectorAll('owp-topbar-step').forEach(stepElement => {
            stepElement.removeEventListener('click', this.handleStepClick);
        });

        this.querySelectorAll('owp-topbar-step').forEach(stepElement => {
            stepElement.addEventListener('click', this.handleStepClick);
        });
    }

    /**
     * @description Generates the static HTML template for the top bar.
     * @returns {string} The HTML string for the component.
     */
    getTemplate() {
        return `
            <div class="fixed top-0 right-0 w-full max-h-18 flex items-center justify-between p-4 bg-slate-950 border-b border-slate-700 shadow-md">
                <owp-topbar-logo></owp-topbar-logo>
                <div class="flex items-center flex-grow justify-center">
                    <nav class="flex items-center text-gray-600 font-semibold" id="step-navigation">
                    </nav>
                </div>
                <owp-topbar-close-button></owp-topbar-close-button>
            </div>
        `;
    }

    /**
     * @description Updates the highlighting of the steps based on the current URL.
     * @param {string} currentPage - The current page slug.
     * @returns {void}
     */
    updateStepsHighlighting(currentPage) {
        const navElement = this.querySelector('#step-navigation');
        if (!navElement) {
            return;
        }

        const currentPageIndex = this.steps.findIndex(step => step.page === currentPage);

        // Clear existing steps to prevent duplicates on re-render
        navElement.innerHTML = '';

        this.steps.forEach((step, index) => {
            const isActive = index === currentPageIndex;
            const isCompleted = index < currentPageIndex;

            const stepElement = document.createElement('owp-topbar-step');
            stepElement.setAttribute('name', step.name);
            stepElement.setAttribute('page', step.page);

            if (isActive) {
                stepElement.setAttribute('is-active', '');
            } else {
                stepElement.removeAttribute('is-active');
            }

            if (isCompleted) {
                stepElement.setAttribute('is-completed', '');
            } else {
                stepElement.removeAttribute('is-completed');
            }
            navElement.appendChild(stepElement);

            if (index < this.steps.length - 1) {
                const separatorElement = document.createElement('owp-topbar-step-separator');
                if (isCompleted) {
                    separatorElement.setAttribute('is-completed', '');
                } else {
                    separatorElement.removeAttribute('is-completed');
                }
                if (index + 1 === currentPageIndex) {
                    separatorElement.setAttribute('is-active', '');
                } else {
                    separatorElement.removeAttribute('is-active');
                }
                navElement.appendChild(separatorElement);
            }
        });
    }
}

customElements.define('owp-topbar', OwpTopbar);