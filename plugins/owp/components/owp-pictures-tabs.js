/**
 * @class OwpPicturesTabs
 * @augments HTMLElement
 * @description Web component for tab navigation on the pictures page.
 */
class OwpPicturesTabs extends HTMLElement {
    orientationOptions = [{
        label: 'All orientations',
        value: ''
    }, {
        label: 'Landscape',
        value: 'landscape'
    }, {
        label: 'Portrait',
        value: 'portrait'
    }, {
        label: 'Square',
        value: 'squarish'
    }, ];

    selectedOrientationValue = this.orientationOptions[0].label; // Initialize with the first option
    tabButtons = null;
    orientationMenuButton = null;
    orientationDropdown = null;
    boundHandleOutsideClick = null;


    /**
     * @description Constructs the OwpPicturesTabs instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.className = `flex w-full border-b border-slate-700 mb-6 py-3 px-12 gap-4`;
        this.innerHTML = `
            <button class="tab-button p-2 font-medium cursor-pointer text-[14px] text-slate-100 transition-all duration-300 ease-in-out rounded-xl underline-fill-cyan active" data-tab="search-results">Search Results</button>
            <button class="tab-button p-2 font-medium cursor-pointer text-[14px] text-slate-100 transition-all duration-300 ease-in-out rounded-xl underline-fill-cyan" data-tab="selected-images">Selected Images</button>

            <div class="flex-grow"></div> <!-- spacing -->

            <div class="relative flex text-left">
                <div class="inline-flex justify-center w-full rounded-xl shadow-sm px-4 py-2 bg-slate-900 text-[14px] font-semibold text-slate-300 hover:bg-slate-800 transition-all duration-300 ease-in-out outline outline-0 outline-transparent hover:outline-1 hover:outline-cyan-500 focus:outline-2 focus:outline-cyan-500 h-11 items-center cursor-pointer" id="orientation-menu-button" aria-expanded="true" aria-haspopup="true">
                    ${this.selectedOrientationValue}
                    <img src="/wp-content/plugins/owp/assets/icons/chevron-down.svg" class="ml-2 -mr-1 h-4 w-4 transition-transform duration-300 ease-in-out" alt="Dropdown icon">
                </div>

                <div class="origin-top-right absolute top-full mt-2 right-0 w-56 rounded-xl shadow-lg bg-slate-800 outline outline-0 outline-transparent hover:outline-1 hover:outline-cyan-500 focus:outline-2 focus:outline-cyan-500 ring-opacity-5 focus:outline-none opacity-0 scale-96 pointer-events-none transition-all duration-300 ease-in-out z-10 overflow-hidden" role="menu" aria-orientation="vertical" aria-labelledby="orientation-menu-button" tabindex="-1">
                    <div class="py-2" role="none">
                        ${this.orientationOptions.map((option, index) => `
                            <a href="#" class="text-[14px] text-slate-300 block px-4 py-2 text-sm hover:bg-cyan-600" role="menuitem" tabindex="-1" id="menu-item-${index}" data-value="${option.value}">${option.label}</a>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }


    /**
     * @description Called when the element is added to the document's DOM.
     * @returns {void}
     */
    connectedCallback() {
        this.tabButtons = this.querySelectorAll('.tab-button');
        this.tabButtons.forEach(button => {
            button.addEventListener('click', this.#handleTabClick.bind(this));
        });

        this.orientationMenuButton = this.querySelector('#orientation-menu-button');
        this.orientationDropdown = this.orientationMenuButton.nextElementSibling;

        this.orientationMenuButton.addEventListener('click', this.#handleOrientationMenuClick.bind(this));
        this.orientationDropdown.querySelectorAll('a').forEach(item => {
            item.addEventListener('click', this.#handleOrientationSelection.bind(this));
        });

        this.boundHandleOutsideClick = this.#handleOutsideClick.bind(this);
        document.addEventListener('click', this.boundHandleOutsideClick);
    }


    /**
     * @description Called when the element is removed from the document's DOM.
     * @returns {void}
     */
    disconnectedCallback() {
        this.tabButtons.forEach(button => {
            button.removeEventListener('click', this.#handleTabClick.bind(this));
        });
        if (this.orientationMenuButton) {
            this.orientationMenuButton.removeEventListener('click', this.#handleOrientationMenuClick.bind(this));
        }
        if (this.orientationDropdown) {
            this.orientationDropdown.querySelectorAll('a').forEach(item => {
                item.removeEventListener('click', this.#handleOrientationSelection.bind(this));
            });
        }
        document.removeEventListener('click', this.boundHandleOutsideClick);
    }


    /**
     * @private
     * @description Handles clicks outside the orientation menu and dropdown to hide the dropdown.
     * @param {Event} event - The click event.
     * @returns {void}
     */
    #handleOutsideClick(event) {
        const chevronIcon = this.orientationMenuButton.querySelector('img');
        if (!this.orientationMenuButton.contains(event.target) && !this.orientationDropdown.contains(event.target)) {
            this.orientationDropdown.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
            this.orientationDropdown.classList.add('opacity-0', 'scale-96', 'pointer-events-none');
            chevronIcon.classList.remove('rotate-180');
        }
    }


    /**
     * @private
     * @description Handles click events on the orientation menu button, toggling the dropdown visibility.
     * @param {Event} event - The click event.
     * @returns {void}
     */
    #handleOrientationMenuClick(event) {
        event.stopPropagation();
        const chevronIcon = this.orientationMenuButton.querySelector('img');
        if (this.orientationDropdown.classList.contains('opacity-0')) {
            this.orientationDropdown.classList.remove('opacity-0', 'scale-96', 'pointer-events-none');
            this.orientationDropdown.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');
            chevronIcon.classList.add('rotate-180');
        } else {
            this.orientationDropdown.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
            this.orientationDropdown.classList.add('opacity-0', 'scale-96', 'pointer-events-none');
            chevronIcon.classList.remove('rotate-180');
        }
    }


    /**
     * @private
     * @description Handles selection of an orientation from the dropdown.
     * @param {Event} event - The click event.
     * @returns {void}
     */
    #handleOrientationSelection(event) {
        event.preventDefault();
        const selectedLabel = event.currentTarget.textContent;
        const selectedValue = event.currentTarget.dataset.value;

        this.orientationMenuButton.childNodes[0].nodeValue = selectedLabel;
        this.selectedOrientationValue = selectedLabel; // Store the selected label

        this.orientationDropdown.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
        this.orientationDropdown.classList.add('opacity-0', 'scale-96', 'pointer-events-none');
        this.orientationMenuButton.querySelector('img').classList.remove('rotate-180');

        window.dispatchEvent(new CustomEvent('orientation-changed', {
            detail: { orientation: selectedValue }
        }));
    }


    /**
     * @private
     * @description Handles click events on tab buttons, updating the active tab.
     * @param {Event} event - The click event.
     * @returns {void}
     */
    #handleTabClick(event) {
        this.tabButtons.forEach(button => {
            button.classList.remove('active');
        });
        event.currentTarget.classList.add('active');
        // Optionally dispatch a custom event to notify parent of tab change
        window.dispatchEvent(new CustomEvent('tab-changed', {
            detail: { tab: event.currentTarget.dataset.tab }
        }));
    }
}

customElements.define('owp-pictures-tabs', OwpPicturesTabs);