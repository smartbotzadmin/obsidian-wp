/**
 * @class OwpPictures
 * @augments HTMLElement
 * @description Web component for the "Pictures" page, integrating top bar, search, tabs, and image grid components.
 */
class OwpPictures extends HTMLElement {
    /**
     * @description Constructs the OwpPictures instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.currentQuery = '';
        this.currentOrientation = '';
        this.currentTab = 'search-results'; // Default tab
    }


    /**
     * @description Called when the element is added to the document's DOM.
     * @returns {void}
     */
    connectedCallback() {
        this.className = `flex flex-col items-center h-screen w-full`;
        this.innerHTML = `
            <h2 class="text-3xl font-bold mt-20 mb-8 text-slate-100 text-center">
                Select the Images
            </h2>
            
            <owp-pictures-search-bar></owp-pictures-search-bar>

            <owp-pictures-tabs></owp-pictures-tabs>

            <owp-pictures-grid></owp-pictures-grid>

            <div class="flex flex-row justify-center items-center p-3 gap-4">
                <owp-skip-step-button data-owp-navigate="#design"></owp-skip-step-button>
                <owp-back-button data-owp-navigate="#contact">Back</owp-back-button>
                <owp-next-button data-owp-navigate="#design">Next</owp-next-button>
            </div>
        `;
        this.searchBar = this.querySelector('owp-pictures-search-bar');
        this.picturesGrid = this.querySelector('owp-pictures-grid');
        this.picturesTabs = this.querySelector('owp-pictures-tabs');

        this.searchBar.addEventListener('search-triggered', this.handleSearchTriggered.bind(this));
        this.searchBar.addEventListener('search-cleared', this.handleSearchCleared.bind(this));
        this.picturesTabs.addEventListener('orientation-changed', this.handleOrientationChanged.bind(this));
        this.picturesTabs.addEventListener('tab-changed', this.handleTabChanged.bind(this));
    }


    /**
     * @description Handles the 'search-triggered' event from the search bar.
     * @param {CustomEvent} event - The custom event containing the search query.
     * @returns {void}
     */
    handleSearchTriggered(event) {
        const newQuery = event.detail.query;
        if (this.picturesGrid) {
            if (!newQuery) {
                this.picturesGrid.loadImagesForEmptyQuery();
            } else if (this.currentQuery !== newQuery) {
                this.currentQuery = newQuery;
                this.picturesGrid.clearGrid(); // Clear displayed images
                this.picturesGrid.allImages = []; // Clear cached images for new search
                this.picturesGrid.currentPage = 1; // Reset page for new search
                this.picturesGrid.fetchImages(this.currentQuery, this.picturesGrid.currentPage);
            } else {
                // If query is the same, just re-filter with current orientation
                this.picturesGrid.filterAndDisplayImages(this.currentQuery, this.currentOrientation);
            }
        }
    }


    /**
     * @description Handles the 'search-cleared' event from the search bar.
     * @returns {void}
     */
    handleSearchCleared() {
        this.currentQuery = '';
        this.currentOrientation = ''; // Reset orientation when search is cleared
        if (this.picturesGrid) {
            this.picturesGrid.loadImagesForEmptyQuery();
        }
    }


    /**
     * @description Handles the 'orientation-changed' event from the tabs component.
     * @param {CustomEvent} event - The custom event containing the selected orientation.
     * @returns {void}
     */
    handleOrientationChanged(event) {
        this.currentOrientation = event.detail.orientation;
        if (this.picturesGrid) {
            // Filter and display images based on the new orientation, no re-fetch needed
            this.picturesGrid.filterAndDisplayImages(this.currentQuery, this.currentOrientation);
        }
    }
    /**
     * @description Handles the 'tab-changed' event from the tabs component.
     * @param {CustomEvent} event - The custom event containing the selected tab.
     * @returns {void}
     */
    handleTabChanged(event) {
        this.currentTab = event.detail.tab;
        if (this.picturesGrid) {
            this.picturesGrid.filterAndDisplayImages(this.currentQuery, this.currentOrientation, this.currentTab);
        }
    }
}

customElements.define('owp-pictures', OwpPictures);