/**
 * @class OwpDesignSearchBar
 * @augments HTMLElement
 * @description Web component for the design search bar on the design page.
 */
class OwpDesignSearchBar extends HTMLElement {
    /**
     * @description Constructs the OwpDesignSearchBar instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.className = `flex flex-row shrink-0 justify-between items-center gap-2 mb-6 w-1/3 border border-slate-700 rounded-lg h-11 px-2 bg-slate-900`;
        this.innerHTML = `
            <img src="/wp-content/plugins/owp/assets/icons/menu.svg" class="h-5 w-5 cursor-pointer" />
            <input class="flex-grow px-1 text-md text-slate-300 h-full appearance-none focus:outline-none focus:shadow-outline" type="text" id="designSearchInput" placeholder="agency, consultant, web designer">
            <img src="/wp-content/plugins/owp/assets/icons/x.svg" id="clearSearchButton" class="h-5 w-5 hidden cursor-pointer h-full" />
        `;
        this.searchInput = this.querySelector('#designSearchInput');
        this.clearButton = this.querySelector('#clearSearchButton');

        this.searchInput.addEventListener('input', this.handleInputChange.bind(this));
        this.clearButton.addEventListener('click', this.handleClearSearch.bind(this));
    }

    /**
     * @description Handles input changes in the search bar, showing/hiding the clear button.
     * @returns {void}
     */
    handleInputChange() {
        if (this.searchInput.value.length > 0) {
            this.clearButton.classList.remove('hidden');
        } else {
            this.clearButton.classList.add('hidden');
        }
    }

    /**
     * @description Clears the search input and hides the clear button.
     * @returns {void}
     */
    handleClearSearch() {
        this.searchInput.value = '';
        this.clearButton.classList.add('hidden');
    }
}

customElements.define('owp-design-search-bar', OwpDesignSearchBar);