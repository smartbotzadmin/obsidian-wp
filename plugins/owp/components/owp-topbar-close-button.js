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
                <div id="crossButton" class="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer">
                    <img src="${window.location.origin}/wp-content/plugins/owp/assets/icons/x.svg" alt="Close" class="h-6 w-6" />
                </div>
                <div id="dropdownContent" class="hidden absolute right-0 w-64 bg-white rounded-md shadow-lg p-4 z-10 border border-gray-200">
                    <div class="px-4 py-2 text-sm text-gray-500">
                        <p>Cancel will close this dialog.</p>
                        <p>Exit will take you to the WordPress admin dashboard.</p>
                    </div>
                    <div class="flex justify-end gap-2 px-4">
                        <a href="#" id="cancelButton" class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">Cancel</a>
                        <a href="${window.location.origin}/wp-admin/" class="px-4 py-2 text-sm bg-purple-500 text-white hover:bg-purple-600 rounded-md">Exit</a>
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