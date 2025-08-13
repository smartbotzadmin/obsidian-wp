/**
 * @class OwpPicturesGrid
 * @augments HTMLElement
 * @description Web component for displaying a grid of images on the pictures page.
 */
class OwpPicturesGrid extends HTMLElement {
    /**
     * @description Constructs the OwpPicturesGrid instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.currentQuery = '';
        this.currentPage = 1;
        this.isLoading = false;
        this.perPage = 12;
        this.currentOrientation = '';
        this.allImages = [];
        this.displayedImages = [];


        this.className = `overflow-y-auto w-full max-h-screen px-4`;
        this.innerHTML = `
            <div class="flex flex-wrap justify-center" id="imageGridContainer">
            </div>
            <div id="loadingSpinner" class="text-slate-100 text-center py-4 hidden">Loading...</div>
        `;

        this.imageGridContainer = this.querySelector('#imageGridContainer');
        this.loadingSpinner = this.querySelector('#loadingSpinner');
    }


    /**
     * @description Called when the element is added to the document's DOM.
     * @returns {void}
     */
    connectedCallback() {
        this.setupIntersectionObserver();
    }


    /**
     * @description Sets up the Intersection Observer for lazy loading.
     * @returns {void}
     */
    setupIntersectionObserver() {
        const options = {
            root: this,
            rootMargin: '0px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isLoading && this.currentQuery) {
                    // Only fetch new pages if we are at the end of the currently filtered images
                    if (this.displayedImages.length === this.allImages.length) {
                        this.fetchImages(this.currentQuery, this.currentPage, this.currentOrientation);
                    }
                }
            });
        }, options);

        this.observer.observe(this.loadingSpinner);
    }


    /**
     * @description Fetches images from the Unsplash API.
     * @param {string} query - The search query.
     * @param {number} page - The page number to fetch.
     * @returns {Promise<void>}
     */
    async fetchImages(query, page) {
        if (this.isLoading) {
            return;
        }

        const cacheKey = `unsplash_images_${query}_page_${page}`;
        const cachedData = sessionStorage.getItem(cacheKey);

        if (cachedData) {
            const data = JSON.parse(cachedData);
            this.allImages = [...this.allImages, ...data.results];
            this.currentPage++;
            this.filterAndDisplayImages(this.currentQuery, this.currentOrientation);
            return;
        }

        this.isLoading = true;
        this.loadingSpinner.classList.remove('hidden');
        this.currentQuery = query; // Update current query

        let url = `https://unsplash-images-313065021854.us-east1.run.app?query=${query}&per_page=${this.perPage}&page=${page}`;

        try {
            const response = await fetch(url, {
                method: 'POST'
            });
            const data = await response.json();

            if (data && data.results) {
                sessionStorage.setItem(cacheKey, JSON.stringify(data));
                this.allImages = [...this.allImages, ...data.results];
                this.currentPage++;
                this.filterAndDisplayImages(this.currentQuery, this.currentOrientation);
            }
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            this.isLoading = false;
            this.loadingSpinner.classList.add('hidden');
        }
    }


    /**
     * @description Determines the orientation of an image.
     * @param {number} width - The width of the image.
     * @param {number} height - The height of the image.
     * @returns {string} 'landscape', 'portrait', or 'squarish'.
     */
    getImageOrientation(width, height) {
        if (width > height) {
            return 'landscape';
        } else if (height > width) {
            return 'portrait';
        } else {
            return 'squarish';
        }
    }


    /**
     * @description Filters and displays images based on the current query and orientation.
     * @param {string} query - The search query.
     * @param {string} orientation - The orientation filter.
     * @returns {void}
     */
    filterAndDisplayImages(query, orientation) {
        this.imageGridContainer.innerHTML = ''; // Clear existing images
        this.currentQuery = query; // Keep current query for lazy loading
        this.currentOrientation = orientation;

        let filtered = this.allImages.filter(image => {
            // If no orientation filter is selected, show all images
            if (!orientation) {
                return true;
            }
            const imageOrientation = this.getImageOrientation(image.width, image.height);
            return imageOrientation === orientation;
        });

        this.appendImagesToGrid(filtered); // Append all filtered images
        this.displayedImages = filtered; // Update displayed images to the full filtered set
    }


    /**
     * @description Appends image elements to the grid.
     * @param {Array<Object>} images - An array of image objects from the Unsplash API.
     * @returns {void}
     */
    appendImagesToGrid(images) {
        const fragment = document.createDocumentFragment();
        images.forEach(image => {
            const imgDiv = document.createElement('div');
            // Re-introducing responsive width classes and ensuring padding
            imgDiv.className = `p-1 w-full sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6`;
            imgDiv.innerHTML = `
                <img src="${image.urls.small}"
                     alt="${image.alt_description || 'Unsplash Image'}"
                     class="rounded-md ring-2 ring-slate-700"
                     style="max-width: 100%; height: auto; display: block;">
            `;
            fragment.appendChild(imgDiv);
        });
        this.imageGridContainer.appendChild(fragment);
    }


    /**
     * @description Clears the current images in the grid and resets pagination.
     * @returns {void}
     */
    clearGrid() {
        this.imageGridContainer.innerHTML = '';
        this.currentPage = 1;
        this.displayedImages = [];
        // Do NOT clear this.allImages, this.currentQuery, this.currentOrientation here
        // They are managed by the parent component or filterAndDisplayImages
    }
}

customElements.define('owp-pictures-grid', OwpPicturesGrid);