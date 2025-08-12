/**
 * @class OwpPicturesSearchBar
 * @augments HTMLElement
 * @description Web component for the image search bar on the pictures page.
 */
class OwpPicturesSearchBar extends HTMLElement {
    /**
     * @description Constructs the OwpPicturesSearchBar instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.className = `relative flex justify-center items-center w-1/3 mb-3`;
        this.innerHTML = `
            <input type="text" id="imageSearchInput" class="shadow appearance-none border border-slate-700 rounded-lg w-full h-11 px-3 text-md text-slate-300 focus:outline-none focus:shadow-outline bg-slate-900" placeholder="Search for images...">
            <button id="clearSearchButton" class="absolute right-3 cursor-pointer hidden">
                <img src="/wp-content/plugins/owp/assets/icons/x.svg" class="h-5 w-5" />
            </button>
        `;
        this.searchInput = this.querySelector('#imageSearchInput');
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
        // Optionally trigger a search update here if needed
    }
}

customElements.define('owp-pictures-search-bar', OwpPicturesSearchBar);