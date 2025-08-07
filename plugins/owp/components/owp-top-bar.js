/**
 * @class OwpTopBar
 * @augments HTMLElement
 * @description Web component for the top navigation bar, including the logo, step indicator, and exit options.
 */
class OwpTopBar extends HTMLElement {
    /**
     * @description Constructs the OwpTopBar instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.steps = [
            { name: "Let's Start", page: "owp-start" },
            { name: "Describe", page: "owp-describe" },
            { name: "Contact", page: "owp-contact" },
            { name: "Pictures", page: "owp-pictures" },
            { name: "Design", page: "owp-design" },
        ];
        this.innerHTML = this.getTemplate();
    }

    /**
     * @description Called when the element is added to the document's DOM.
     * @returns {void}
     */
    connectedCallback() {
        this.updateStepsHighlighting();
        this.addStepEventListeners();
    }

    /**
     * @description Adds click event listeners to each step item for navigation.
     * @returns {void}
     */
    addStepEventListeners() {
        this.querySelectorAll('owp-top-bar-step').forEach(stepElement => {
            stepElement.addEventListener('click', (event) => {
                const page = event.currentTarget.dataset.page;
                if (page) {
                    window.location.href = `${window.location.origin}/wp-admin/admin.php?page=${page}`;
                }
            });
        });
    }

    /**
     * @description Generates the HTML template for the top bar, including dynamic step highlighting.
     * @returns {string} The HTML string for the component.
     */
    getTemplate() {
        const currentPath = window.location.search;
        const currentPage = currentPath.split('page=')[1];
        const currentPageIndex = this.steps.findIndex(step => step.page === currentPage);

        const stepHtml = this.steps.map((step, index) => {
            const isActive = index === currentPageIndex;
            const isCompleted = index < currentPageIndex;

            return `
                <owp-top-bar-step name="${step.name}" page="${step.page}" ${isActive ? 'is-active' : ''} ${isCompleted ? 'is-completed' : ''}></owp-top-bar-step>
                ${index < this.steps.length - 1 ? `<owp-top-bar-step-separator ${isActive || isCompleted ? 'is-active is-completed' : ''}></owp-top-bar-step-separator>` : ''}
            `;
        }).join('');

        return `
            <link rel="stylesheet" href="${window.location.origin}/wp-content/plugins/owp/assets/css/output.css">
            <div class="flex items-center justify-between p-4 bg-white shadow-md h-18">
                <owp-top-bar-logo class="ml-2"></owp-top-bar-logo>
                <div class="flex items-center flex-grow justify-center">
                    <nav class="flex items-center text-gray-600 font-bold">
                        ${stepHtml}
                    </nav>
                </div>
                <owp-top-bar-close-button></owp-top-bar-close-button>
            </div>
        `;
    }

    /**
     * @description Updates the highlighting of the steps based on the current URL.
     * @returns {void}
     */
    updateStepsHighlighting() {
        this.innerHTML = this.getTemplate();
    }

}

customElements.define('owp-top-bar', OwpTopBar);