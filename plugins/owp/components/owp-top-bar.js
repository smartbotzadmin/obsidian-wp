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
        this.innerHTML = `
            <link rel="stylesheet" href="${window.location.origin}/wp-content/plugins/owp/assets/css/output.css">
            <style>
                .dropdown-content {
                    display: none;
                }
                .dropdown-content.show {
                    display: block;
                }
            </style>
            <div class="flex items-center justify-between p-4 bg-white shadow-md h-18">
                <div class="flex items-center flex-grow justify-center">
                    <img src="${window.location.origin}/wp-content/plugins/owp/assets/icons/owp-logo-light.svg" alt="OWP Logo" class="h-8 w-auto mx-3 absolute left-4">
                    <nav class="flex gap-8 text-gray-600">
                        <span class="flex items-center text-blue-600 font-semibold">
                            <span class="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs mr-1">1</span>
                            Let's Start
                        </span>
                        <span class="flex items-center">
                            <span class="w-5 h-5 rounded-full border border-gray-400 text-gray-400 flex items-center justify-center text-xs mr-1">2</span>
                            Describe
                        </span>
                        <span class="flex items-center">
                            <span class="w-5 h-5 rounded-full border border-gray-400 text-gray-400 flex items-center justify-center text-xs mr-1">3</span>
                            Contact
                        </span>
                        <span class="flex items-center">
                            <span class="w-5 h-5 rounded-full border border-gray-400 text-gray-400 flex items-center justify-center text-xs mr-1">4</span>
                            Pictures
                        </span>
                        <span class="flex items-center">
                            <span class="w-5 h-5 rounded-full border border-gray-400 text-gray-400 flex items-center justify-center text-xs mr-1">5</span>
                            Design
                        </span>
                    </nav>
                </div>
                <div class="relative">
                    <button id="crossButton" class="text-gray-500 hover:text-gray-700 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div id="dropdownContent" class="dropdown-content absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                        <a href="#" id="cancelButton" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Cancel</a>
                        <a href="${window.location.origin}/wp-admin/" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Exit</a>
                    </div>
                </div>
            </div>
        `;

        this.crossButton = this.querySelector('#crossButton');
        this.dropdownContent = this.querySelector('#dropdownContent');
        this.cancelButton = this.querySelector('#cancelButton');

        this.crossButton.addEventListener('click', this.toggleDropdown.bind(this));
        this.cancelButton.addEventListener('click', this.toggleDropdown.bind(this));
    }

    /**
     * @description Toggles the visibility of the dropdown menu.
     * @returns {void}
     */
    toggleDropdown() {
        this.dropdownContent.classList.toggle('show');
    }
}

customElements.define('owp-top-bar', OwpTopBar);