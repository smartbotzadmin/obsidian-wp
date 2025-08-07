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
        this.innerHTML = `
            <div class="relative flex justify-center items-center mb-6">
                <input type="text" id="imageSearchInput" class="max-w-96 shadow appearance-none border border-gray-300 rounded-lg w-full h-11 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Search for images...">
                <button id="clearSearchButton" class="absolute right-3 text-gray-500 hover:text-gray-700 focus:outline-none hidden">
                    <img src="${window.location.origin}/wp-content/plugins/owp/assets/icons/x.svg" alt="Clear" class="h-5 w-5" />
                </button>
            </div>
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