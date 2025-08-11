/**
 * @class OwpTopbarCloseButton
 * @augments HTMLElement
 * @description Web component for the close button and dropdown menu in the top bar.
 */
class OwpTopbarCloseButton extends HTMLElement {
    /**
     * @description Constructs the OwpTopBarCloseButton instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.innerHTML = this.getTemplate();
        this.crossButton = this.querySelector('#crossButton');
        this.dropdownContent = this.querySelector('#dropdownContent');
        this.cancelButton = this.querySelector('#cancelButton');

        this.crossButton.addEventListener('click', this.toggleDropdown.bind(this));
        this.cancelButton.addEventListener('click', this.toggleDropdown.bind(this));
        this.boundHandleOutsideClick = this.handleOutsideClick.bind(this);
    }

    /**
     * @description Called when the element is added to the document's DOM.
     * @returns {void}
     */
    connectedCallback() {
        document.addEventListener('click', this.boundHandleOutsideClick);
    }

    /**
     * @description Called when the element is removed from the document's DOM.
     * @returns {void}
     */
    disconnectedCallback() {
        document.removeEventListener('click', this.boundHandleOutsideClick);
    }

    /**
     * @description Handles clicks outside the dropdown to close it.
     * @param {Event} event The click event.
     * @returns {void}
     */
    handleOutsideClick(event) {
        if (!this.contains(event.target) && this.dropdownContent.classList.contains('block')) {
            this.toggleDropdown(event);
        }
    }

    /**
     * @description Generates the HTML template for the close button and dropdown.
     * @returns {string} The HTML string for the component.
     */
    getTemplate() {
        return `
            <div class="relative">
                <div id="crossButton" class="focus:outline-none cursor-pointer">
                    <img src="/wp-content/plugins/owp/assets/icons/x.svg" alt="Close" class="h-6 w-auto" />
                </div>
                <div id="dropdownContent" class="hidden absolute right-0 w-72 bg-slate-800 rounded-md shadow-lg p-2 z-10 border border-slate-700">
                    <div class="px-4 py-2 text-md text-slate-100">
                        <p><b>Cancel</b> will close this dialog.</p>
                        <p><b>Exit</b> will take you to the WordPress admin dashboard.</p>
                    </div>
                    <div class="flex justify-end gap-4 p-4">
                        <a href="#" id="cancelButton" class="px-4 py-2 text-md text-slate-100 bg-slate-700 hover:bg-slate-600 rounded-md">Cancel</a>
                        <a href="/wp-admin/" class="px-4 py-2 text-md bg-cyan-600 text-slate-100 hover:bg-cyan-500 rounded-md">Exit</a>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * @description Toggles the visibility of the dropdown menu.
     * @param {Event} event The click event.
     * @returns {void}
     */
    toggleDropdown(event) {
        event.stopPropagation();
        if (this.dropdownContent.classList.contains('hidden')) {
            this.dropdownContent.classList.remove('hidden');
            this.dropdownContent.classList.add('block');
        } else {
            this.dropdownContent.classList.remove('block');
            this.dropdownContent.classList.add('hidden');
        }
    }
}

customElements.define('owp-topbar-close-button', OwpTopbarCloseButton);