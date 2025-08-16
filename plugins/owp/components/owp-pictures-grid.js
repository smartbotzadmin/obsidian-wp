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
        this.selectedImages = this.loadSelectedImages();
        this.currentTab = 'search-results'; // Initialize currentTab


        this.className = `flex-1 w-full max-h-screen overflow-y-auto px-4`;
        this.innerHTML = `
            <div class="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 p-2" id="imageGridContainer">
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
        this.addEventListener('click', this.handleImageClick.bind(this));
        // Load initial selected images from owp_payload on connectedCallback
        this.selectedImages = this.loadSelectedImages();
        this.filterAndDisplayImages(this.currentQuery, this.currentOrientation, this.currentTab);
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
            this.filterAndDisplayImages(this.currentQuery, this.currentOrientation, this.currentTab);
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
                this.filterAndDisplayImages(this.currentQuery, this.currentOrientation, this.currentTab);
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
     * @param {string} currentTab - The currently active tab.
     * @returns {void}
     */
    filterAndDisplayImages(query, orientation, currentTab = 'search-results') {
        this.imageGridContainer.innerHTML = ''; // Clear existing images
        this.currentQuery = query; // Keep current query for lazy loading
        this.currentOrientation = orientation;
        this.currentTab = currentTab; // Update currentTab property

        let imagesToFilter = this.allImages;
        if (currentTab === 'selected-images') {
            imagesToFilter = this.selectedImages;
        }

        let filtered = imagesToFilter.filter(image => {
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
            const isSelected = this.selectedImages.some(selectedImg => selectedImg.id === image.id);
            const selectedClass = isSelected ? 'ring-cyan-500' : 'ring-slate-700';

            imgDiv.className = `relative mb-3 break-inside-avoid cursor-pointer group`;
            imgDiv.dataset.imageId = image.id; // Store image ID for selection
            imgDiv.dataset.imageJson = JSON.stringify(image); // Store full image data

            imgDiv.innerHTML = `
                <img src="${image.urls.small}"
                     alt="${image.alt_description || 'Unsplash Image'}"
                     class="rounded-md p-0.5 ring-2 ${selectedClass} hover:ring-cyan-500" draggable="false">
                ${isSelected ? `
                    <div class="absolute top-2 right-2 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                        <img src="/wp-content/plugins/owp/assets/icons/check.svg" class="w-5 h-5" alt="Selected">
                    </div>
                ` : ''}
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


    /**
     * @description Loads selected images from sessionStorage.
     * @returns {Array<Object>} An array of selected image objects.
     */
    loadSelectedImages() {
        try {
            const owpPayload = window.owpSessionManager.getPayload();
            if (owpPayload.pictures && owpPayload.pictures.length > 0) {
                return owpPayload.pictures;
            }

            const storedImages = sessionStorage.getItem('owp_selected_images');
            return storedImages ? JSON.parse(storedImages) : [];
        } catch (error) {
            console.error('Error loading selected images from sessionStorage:', error);
            return [];
        }
    }

    /**
     * @description Saves selected images to sessionStorage.
     * @param {Array<Object>} images - The array of image objects to save.
     * @returns {void}
     */
    saveSelectedImages(images) {
        try {
            sessionStorage.setItem('owp_selected_images', JSON.stringify(images));
        } catch (error) {
            console.error('Error saving selected images to sessionStorage:', error);
        }
    }

    /**
     * @description Handles click events on images to toggle selection.
     * @param {Event} event - The click event.
     * @returns {void}
     */
    handleImageClick(event) {
        const imgDiv = event.target.closest('[data-image-id]');
        if (!imgDiv) {
            return;
        }

        const imageId = imgDiv.dataset.imageId;
        const imageData = JSON.parse(imgDiv.dataset.imageJson);

        const index = this.selectedImages.findIndex(img => img.id === imageId);

        if (index > -1) {
            // Image is already selected, remove it
            this.selectedImages.splice(index, 1);
        } else {
            // Image is not selected, add it
            this.selectedImages.push(imageData);
        }

        this.saveSelectedImages(this.selectedImages);
        window.owpSessionManager.updatePayloadSection('pictures', this.selectedImages); // Update owp_payload
        this.filterAndDisplayImages(this.currentQuery, this.currentOrientation, this.currentTab);
    }
}

customElements.define('owp-pictures-grid', OwpPicturesGrid);