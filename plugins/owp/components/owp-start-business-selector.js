/**
 * @class OwpStartBusinessSelector
 * @augments HTMLElement
 * @description Web component for the website niche selection.
 */
class OwpStartBusinessSelector extends HTMLElement {
    /**
     * @private
     * @type {Array<string>}
     * @description List of available business options.
     */
    #businessOptions = [
        "Agency", "Restaurant", "Entrepreneur", "Event", "Non-profit",
        "Local business", "Gym", "Spa", "SaaS", "Dentist"
    ];

    /**
     * @public
     * @type {string|null}
     * @description Stores the currently selected business.
     */
    selectedBusiness = null;

    /**
     * @description Constructs the OwpStartBusinessSelector instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.className = "min-w-86 flex flex-col relative mb-6";
        this.innerHTML = `
            <label for="websiteFor" class="text-sm text-slate-300 mb-2 font-semibold">This website is for</label>
            <div class="flex items-center h-11 px-3 text-md text-slate-100 bg-slate-900 border border-slate-700 rounded-lg focus-within:border-slate-500 cursor-pointer">
                <div id="websiteForSearch" class="flex-grow bg-transparent focus:outline-none text-slate-100">Type to search your business</div>
                <div class="h-5 w-5">
                    <img src="/wp-content/plugins/owp/assets/icons/chevron-down.svg" />
                </div>
            </div>
            <div id="websiteForDropdown" class="absolute w-full bg-slate-900 border border-slate-700 rounded-lg shadow-lg z-10 hidden max-h-60 overflow-y-auto" style="top: 105%; left: 0;">
                <div class="py-1">
                    ${this.#businessOptions.map(option => `
                        <div class="flex items-center justify-between px-4 py-2 text-md text-slate-100 hover:bg-slate-800 cursor-pointer" data-value="${option}">
                            <span>${option}</span>
                            <span class="check-icon hidden">
                                <img src="/wp-content/plugins/owp/assets/icons/check.svg" />
                            </span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        this.websiteForSearch = this.querySelector('#websiteForSearch');
        this.websiteForDropdown = this.querySelector('#websiteForDropdown');
        this.websiteForInputContainer = this.querySelector('.flex.items-center.h-11');

        this.websiteForInputContainer.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent document click from immediately closing
            this.websiteForDropdown.classList.toggle('hidden');
        });
        // Use a single blur event on the container to hide the dropdown

        this.websiteForDropdown.querySelectorAll('div[data-value]').forEach(item => {
            item.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent event bubbling
                const selectedValue = event.currentTarget.dataset.value;
                this.websiteForSearch.textContent = selectedValue;
                this.selectedBusiness = selectedValue;
                this.websiteForDropdown.classList.add('hidden');

                const currentPayload = window.owpSessionManager.getPayload();
                window.owpSessionManager.updatePayloadSection('start', {
                    ...currentPayload.start,
                    business: selectedValue
                });

                this.websiteForDropdown.querySelectorAll('.check-icon').forEach(icon => {
                    icon.classList.add('hidden');
                });
                event.currentTarget.querySelector('.check-icon').classList.remove('hidden');
            });
        });
    }


    /**
     * @description Called when the element is inserted into the DOM.
     * @returns {void}
     */
    connectedCallback() {
        document.addEventListener('click', this.#handleClickOutside);
        this.#loadInitialValue();
    }


    /**
     * @description Called when the element is removed from the DOM.
     * @returns {void}
     */
    disconnectedCallback() {
        document.removeEventListener('click', this.#handleClickOutside);
    }


    /**
     * @private
     * @description Handles clicks outside the component to close the dropdown.
     * @param {Event} event - The click event.
     * @returns {void}
     */
    #handleClickOutside = (event) => {
        // If the click is outside the component (both input and dropdown) and the dropdown is visible, hide it.
        if (!this.contains(event.target) && !this.websiteForDropdown.classList.contains('hidden')) {
            this.websiteForDropdown.classList.add('hidden');
        }
    };


    /**
     * @private
     * @description Loads the initial value from sessionStorage and sets it to the display.
     * @returns {void}
     */
    #loadInitialValue() {
        const currentPayload = window.owpSessionManager.getPayload();
        if (currentPayload.start && currentPayload.start.business) {
            this.selectedBusiness = currentPayload.start.business;
            this.websiteForSearch.textContent = currentPayload.start.business;
            // Also update the checkmark for the pre-selected option
            this.websiteForDropdown.querySelectorAll('div[data-value]').forEach(item => {
                if (item.dataset.value === currentPayload.start.business) {
                    item.querySelector('.check-icon').classList.remove('hidden');
                } else {
                    item.querySelector('.check-icon').classList.add('hidden');
                }
            });
        }
    }
}

customElements.define('owp-start-business-selector', OwpStartBusinessSelector);