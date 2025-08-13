/**
 * @class OwpPicturesTabs
 * @augments HTMLElement
 * @description Web component for tab navigation on the pictures page.
 */
class OwpPicturesTabs extends HTMLElement {
    /**
     * @description Constructs the OwpPicturesTabs instance.
     * @returns {void}
     */
    constructor() {
        super();
       this.orientationOptions = [{
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

       this.selectedOrientationValue = this.orientationOptions[0].label; // Initialize with the first option

        this.className = `flex w-full border-b border-slate-700 mb-6 py-3 px-12`;
        this.innerHTML = `
            <button class="tab-button p-2 font-medium cursor-pointer text-[14px] text-slate-100 border-b-2 border-cyan-500 focus:outline-none" data-tab="search-results">Search Results</button>
            <button class="tab-button p-2 font-medium cursor-pointer text-[14px] text-slate-100 hover:text-slate-300 focus:outline-none" data-tab="upload-images">Upload Your Images</button>
            <button class="tab-button p-2 font-medium cursor-pointer text-[14px] text-slate-100 hover:text-slate-300 focus:outline-none" data-tab="selected-images">Selected Images</button>

            <div class="flex-grow"></div> <!-- spacing -->

            <div class="relative flex text-left">
                <div class="inline-flex justify-center w-full rounded-lg border border-slate-700 shadow-sm px-4 py-2 bg-slate-900 text-[14px] font-semibold text-slate-300 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 h-11 items-center cursor-pointer" id="orientation-menu-button" aria-expanded="true" aria-haspopup="true">
                    ${this.selectedOrientationValue}
                    <img src="/wp-content/plugins/owp/assets/icons/chevron-down.svg" class="ml-2 -mr-1 h-4 w-4" alt="Dropdown icon">
                </div>

                <div class="origin-top-right absolute top-full mt-2 right-0 w-56 rounded-md shadow-lg bg-slate-800 border border-slate-700 ring-opacity-5 focus:outline-none  hidden" role="menu" aria-orientation="vertical" aria-labelledby="orientation-menu-button" tabindex="-1">
                    <div class="py-1" role="none">
                        ${this.orientationOptions.map((option, index) => `
                            <a href="#" class="text-[14px] text-slate-300 block px-4 py-2 text-sm hover:bg-slate-700" role="menuitem" tabindex="-1" id="menu-item-${index}" data-value="${option.value}">${option.label}</a>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        this.tabButtons = this.querySelectorAll('.tab-button');
        this.tabButtons.forEach(button => {
            button.addEventListener('click', this.handleTabClick.bind(this));
        });

        this.orientationMenuButton = this.querySelector('#orientation-menu-button');
        this.orientationDropdown = this.orientationMenuButton.nextElementSibling;

        this.orientationMenuButton.addEventListener('click', this.handleOrientationMenuClick.bind(this));
        this.orientationDropdown.querySelectorAll('a').forEach(item => {
            item.addEventListener('click', this.handleOrientationSelection.bind(this));
        });

        document.addEventListener('click', (event) => {
            if (!this.orientationMenuButton.contains(event.target) && !this.orientationDropdown.contains(event.target)) {
                this.orientationDropdown.classList.add('hidden');
            }
        });
    }

    /**
     * @description Handles click events on the orientation menu button, toggling the dropdown visibility.
     * @param {Event} event - The click event.
     * @returns {void}
     */
    handleOrientationMenuClick(event) {
        event.stopPropagation();
        this.orientationDropdown.classList.toggle('hidden');
    }


    /**
     * @description Handles selection of an orientation from the dropdown.
     * @param {Event} event - The click event.
     * @returns {void}
     */
    handleOrientationSelection(event) {
        event.preventDefault();
        const selectedLabel = event.currentTarget.textContent;
        const selectedValue = event.currentTarget.dataset.value;

        this.orientationMenuButton.childNodes[0].nodeValue = selectedLabel;
        this.selectedOrientationValue = selectedLabel; // Store the selected label

        this.orientationDropdown.classList.add('hidden');

        this.dispatchEvent(new CustomEvent('orientation-changed', {
            detail: { orientation: selectedValue }
        }));
    }


    /**
     * @description Handles click events on tab buttons, updating the active tab.
     * @param {Event} event - The click event.
     * @returns {void}
     */
    handleTabClick(event) {
        this.tabButtons.forEach(button => {
            button.classList.remove('text-cyan-600', 'border-b-2', 'border-cyan-600');
            button.classList.add('text-slate-300', 'hover:text-slate-500');
        });
        event.currentTarget.classList.remove('text-slate-300', 'border-b-2', 'hover:text-slate-500');
        event.currentTarget.classList.add('text-cyan-600', 'border-b-2', 'border-cyan-600');
        // Optionally dispatch a custom event to notify parent of tab change
        this.dispatchEvent(new CustomEvent('tab-changed', {
            detail: { tab: event.currentTarget.dataset.tab }
        }));
    }
}

customElements.define('owp-pictures-tabs', OwpPicturesTabs);