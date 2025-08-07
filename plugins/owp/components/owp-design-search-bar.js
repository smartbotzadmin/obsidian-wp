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
        this.innerHTML = `
            <div class="relative flex justify-center items-center mb-6">
                <div class="relative min-w-96">
                    <input type="text" id="designSearchInput" class="shadow appearance-none border border-gray-300 rounded-lg w-full h-11 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10" placeholder="agency, consultant, web designer">
                    <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    <button id="clearSearchButton" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none hidden">
                        <img src="${window.location.origin}/wp-content/plugins/owp/assets/icons/x.svg" alt="Clear" class="h-5 w-5" />
                    </button>
                </div>
            </div>
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