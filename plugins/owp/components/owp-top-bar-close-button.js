/**
 * @class OwpTopBarCloseButton
 * @augments HTMLElement
 * @description Web component for the close button and dropdown menu in the top bar.
 */
class OwpTopBarCloseButton extends HTMLElement {
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
    }

    /**
     * @description Generates the HTML template for the close button and dropdown.
     * @returns {string} The HTML string for the component.
     */
    getTemplate() {
        return `
            <style>
                .dropdown-content {
                    display: none;
                }
                .dropdown-content.show {
                    display: block;
                }
            </style>
            <div class="relative">
                <div id="crossButton" class="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <div id="dropdownContent" class="dropdown-content absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <a href="#" id="cancelButton" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Cancel</a>
                    <a href="${window.location.origin}/wp-admin/" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Exit</a>
                </div>
            </div>
        `;
    }

    /**
     * @description Toggles the visibility of the dropdown menu.
     * @returns {void}
     */
    toggleDropdown() {
        this.dropdownContent.classList.toggle('show');
    }
}

customElements.define('owp-top-bar-close-button', OwpTopBarCloseButton);