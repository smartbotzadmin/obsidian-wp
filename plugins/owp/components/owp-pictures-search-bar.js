/**
 * @class OwpPicturesSearchBar
 * @augments HTMLElement
 * @description Web component for the image search bar on the pictures page.
 */
class OwpPicturesSearchBar extends HTMLElement {
    searchInput = null;
    clearButton = null;

    /**
     * @description Constructs the OwpPicturesSearchBar instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.className = `relative flex justify-center items-center w-1/3 mb-3`;
        this.innerHTML = `
            <input type="text" id="imageSearchInput" class="shadow appearance-none rounded-xl w-full h-11 px-3 text-md text-slate-300 bg-slate-900 ring ring-0 ring-transparent outline-none hover:ring-1 hover:ring-cyan-500 focus:ring-2 focus:ring-cyan-500 transition-all duration-300 ease-in-out" placeholder="Search for images...">
            <button id="clearSearchButton" class="absolute right-3 cursor-pointer hidden">
                <img src="/wp-content/plugins/owp/assets/icons/x.svg" class="h-5 w-5" />
            </button>
        `;
    }


    /**
     * @description Called when the element is added to the document's DOM.
     * @returns {void}
     */
    connectedCallback() {
        this.searchInput = this.querySelector('#imageSearchInput');
        this.clearButton = this.querySelector('#clearSearchButton');

        this.searchInput.addEventListener('input', this.#handleInputChange.bind(this));
        this.searchInput.addEventListener('keydown', this.#handleSearchKeyDown.bind(this));
        this.clearButton.addEventListener('click', this.#handleClearSearch.bind(this));
    }


    /**
     * @description Called when the element is removed from the document's DOM.
     * @returns {void}
     */
    disconnectedCallback() {
        if (this.searchInput) {
            this.searchInput.removeEventListener('input', this.#handleInputChange.bind(this));
            this.searchInput.removeEventListener('keydown', this.#handleSearchKeyDown.bind(this));
        }
        if (this.clearButton) {
            this.clearButton.removeEventListener('click', this.#handleClearSearch.bind(this));
        }
    }


    /**
     * @private
     * @description Handles input changes in the search bar, showing/hiding the clear button.
     * @returns {void}
     */
    #handleInputChange() {
        if (this.searchInput.value.length > 0) {
            this.clearButton.classList.remove('hidden');
        } else {
            this.clearButton.classList.add('hidden');
        }
    }


    /**
     * @private
     * @description Clears the search input and hides the clear button.
     * @returns {void}
     */
    #handleClearSearch() {
        this.searchInput.value = '';
        this.clearButton.classList.add('hidden');
        window.dispatchEvent(new CustomEvent('search-cleared'));
    }


    /**
     * @private
     * @description Handles keydown events on the search bar, triggering a search on Enter key.
     * @param {KeyboardEvent} event - The keyboard event.
     * @returns {void}
     */
    #handleSearchKeyDown(event) {
        if (event.key === 'Enter') {
            const query = this.searchInput.value.trim();
            window.dispatchEvent(new CustomEvent('search-triggered', {
                detail: { query: query }
            }));
        }
    }
}

customElements.define('owp-pictures-search-bar', OwpPicturesSearchBar);