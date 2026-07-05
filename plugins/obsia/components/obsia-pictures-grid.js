/**
 * @class ObsiaPicturesGrid
 * @augments HTMLElement
 * @description Web component for displaying a grid of images on the pictures page.
 */
class ObsiaPicturesGrid extends HTMLElement {
  currentQuery = "";
  currentPage = 1;
  isLoading = false;
  perPage = 20;
  currentOrientation = "";
  allImages = [];
  displayedImages = [];
  currentTab = "search-results"; // Initialize currentTab
  imageGridContainer = null;
  loadingSpinner = null;
  observer = null;
  selectedImages = [];

  /**
   * @description Constructs the ObsiaPicturesGrid instance.
   * @returns {void}
   */
  constructor() {
    super();
    this.className = `flex-1 w-full max-h-screen overflow-y-auto px-4`;
    this.innerHTML = /*html*/ `
      <div
        id="imageGridContainer"
        class="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 p-2"
      ></div>
      <div id="loadingSpinner" class="text-slate-100 text-center py-4 hidden">
        <div class="picture-loader mx-auto"></div>
      </div>
   `;
  }

  /**
   * @private
   * @description Updates the visual display of a single image element based on its selection state.
   * @param {HTMLElement} imgDiv - The div element containing the image.
   * @param {Object} imageData - The image data object.
   * @param {boolean} animate - Whether to apply selection/deselection animations.
   * @returns {void}
   */
  #updateImageDisplay(imgDiv, imageData, animate = true) {
    const isSelected = this.selectedImages.some((selectedImg) => selectedImg.id === imageData.id);
    const imgElement = imgDiv.querySelector("img");
    let checkIconContainer = imgDiv.querySelector(".check-icon-container");

    // Update ring color and size
    if (isSelected) {
      imgElement.classList.remove("ring-slate-700", "ring-1");
      imgElement.classList.add("ring-cyan-500", "ring-2");
    } else {
      imgElement.classList.remove("ring-cyan-500", "ring-2");
      imgElement.classList.add("ring-slate-700", "ring-1");
    }

    // Update check icon
    if (isSelected && !checkIconContainer) {
      // Add check icon
      checkIconContainer = document.createElement("div");
      checkIconContainer.className = `check-icon-container absolute top-2 right-2 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center transition-opacity duration-100 ease-in-out opacity-0`;
      checkIconContainer.innerHTML = `<img src="/wp-content/plugins/obsia/assets/icons/check.svg" class="w-5 h-5" alt="Selected">`;
      imgDiv.appendChild(checkIconContainer);
      if (animate) {
        requestAnimationFrame(() => {
          checkIconContainer.classList.add("opacity-100");
        });
      } else {
        checkIconContainer.classList.add("opacity-100");
      }
    } else if (!isSelected && checkIconContainer) {
      // Remove check icon with transition
      if (animate) {
        checkIconContainer.classList.remove("opacity-100");
        checkIconContainer.addEventListener("transitionend", () => checkIconContainer.remove(), {
          once: true,
        });
      } else {
        checkIconContainer.remove();
      }
    }
  }

  /**
   * @description Called when the element is added to the document's DOM.
   * @returns {Promise<void>}
   */
  async connectedCallback() {
    this.imageGridContainer = this.querySelector("#imageGridContainer");
    this.loadingSpinner = this.querySelector("#loadingSpinner");

    this.setupIntersectionObserver();
    this.addEventListener("click", this.handleImageClick);
    window.addEventListener("search-triggered", this.#handleSearchTriggered.bind(this));
    window.addEventListener("search-cleared", this.#handleSearchCleared.bind(this));
    window.addEventListener("orientation-changed", this.#handleOrientationChanged.bind(this));
    window.addEventListener("tab-changed", this.#handleTabChanged.bind(this));
    await this.loadDefaultImages();
    this.selectedImages = this.loadSelectedImages();
    this.filterAndDisplayImages(this.currentQuery, this.currentOrientation, this.currentTab);
  }

  /**
   * @description Called when the element is removed from the document's DOM.
   * @returns {void}
   */
  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.removeEventListener("click", this.handleImageClick);
    window.removeEventListener("search-triggered", this.#handleSearchTriggered.bind(this));
    window.removeEventListener("search-cleared", this.#handleSearchCleared.bind(this));
    window.removeEventListener("orientation-changed", this.#handleOrientationChanged.bind(this));
    window.removeEventListener("tab-changed", this.#handleTabChanged.bind(this));
  }

  /**
   * @private
   * @description Sets up the Intersection Observer for lazy loading.
   * @returns {void}
   */
  setupIntersectionObserver() {
    const options = {
      root: this,
      rootMargin: "0px",
      threshold: 0.1,
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
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
    if (this.isLoading || !query) {
      return;
    }

    const cacheKey = `unsplash_images_${query}_page_${page}`;
    const cachedData = sessionStorage.getItem(cacheKey);

    if (cachedData) {
      const data = JSON.parse(cachedData);
      this.allImages = [...this.allImages, ...data.results];
      this.currentPage++;
      return;
    }

    this.isLoading = true;
    this.loadingSpinner.classList.remove("hidden");
    this.currentQuery = query; // Update current query

    let url = `https://unsplash-images-313065021854.us-east1.run.app?query=${query}&per_page=${this.perPage}&page=${page}`;
    const token = localStorage.getItem(window.cookieName);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data && data.results) {
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
        this.allImages = [...this.allImages, ...data.results];
        this.currentPage++;
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      this.isLoading = false;
      this.loadingSpinner.classList.add("hidden");
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
      return "landscape";
    } else if (height > width) {
      return "portrait";
    } else {
      return "squarish";
    }
  }

  /**
   * @description Filters and displays images based on the current query and orientation.
   * @param {string} query - The search query.
   * @param {string} orientation - The orientation filter.
   * @param {string} currentTab - The currently active tab.
   * @returns {void}
   */
  async filterAndDisplayImages(
    newQuery,
    newOrientation,
    newTab = "search-results",
    forceAnimate = false,
  ) {
    const oldQuery = this.currentQuery;
    const oldOrientation = this.currentOrientation;
    const oldTab = this.currentTab;

    this.currentQuery = newQuery;
    if (newQuery) {
      sessionStorage.setItem("obsia_last_picture_query", newQuery);
    }
    this.currentOrientation = newOrientation;
    this.currentTab = newTab;

    const isQueryChanging = oldQuery !== newQuery;
    const isOrientationChanging = oldOrientation !== newOrientation;
    const isTabChanging = oldTab !== newTab;

    const shouldAnimate = forceAnimate || isTabChanging || isOrientationChanging;

    if (shouldAnimate) {
      Array.from(this.imageGridContainer.children).forEach((imgDiv) => {
        imgDiv.classList.add("opacity-0", "scale-96");
        imgDiv.classList.remove("opacity-100", "scale-100");
      });

      await new Promise((resolve) => setTimeout(resolve, 300)); // Wait for fade-out
    }

    this.imageGridContainer.innerHTML = ""; // Clear grid after animation

    // Only fetch/load if query changed or it's the initial load and allImages is empty
    if (isQueryChanging || (this.allImages.length === 0 && newQuery)) {
      this.allImages = []; // Reset allImages for new search
      this.currentPage = 1; // Reset page for new search
      if (newQuery) {
        await this.fetchImages(newQuery, 1);
      } else {
        await this.loadDefaultImages();
      }
    }

    this.#processAndDisplayImages(newQuery, newOrientation, newTab, shouldAnimate);
  }

  /**
   * @private
   * @description Helper to filter and append images to the grid.
   * @param {string} query - The search query.
   * @param {string} orientation - The orientation filter.
   * @param {string} currentTab - The currently active tab.
   * @param {boolean} animateTransition - Whether to animate the scale and opacity.
   * @returns {void}
   */
  #processAndDisplayImages(query, orientation, currentTab, animateTransition) {
    let imagesToFilter = this.allImages;
    if (currentTab === "selected-images") {
      imagesToFilter = this.selectedImages;
    }

    let filtered = imagesToFilter.filter((image) => {
      // If no orientation filter is selected, show all images
      if (!orientation) {
        return true;
      }
      const imageOrientation = this.getImageOrientation(image.width, image.height);
      return imageOrientation === orientation;
    });

    this.appendImagesToGrid(filtered, animateTransition); // Append all filtered images
    this.displayedImages = filtered; // Update displayed images to the full filtered set
  }

  /**
   * @description Appends image elements to the grid.
   * @param {Array<Object>} images - An array of image objects from the Unsplash API.
   * @param {boolean} animateTransition - Whether to animate the scale and opacity.
   * @returns {void}
   */
  appendImagesToGrid(images, animateTransition) {
    const fragment = document.createDocumentFragment();
    images.forEach((image) => {
      const imgDiv = document.createElement("div");
      imgDiv.className = `relative mb-3 break-inside-avoid cursor-pointer group`;
      imgDiv.dataset.imageId = image.id; // Store image ID for selection
      imgDiv.dataset.imageJson = JSON.stringify(image); // Store full image data

      imgDiv.innerHTML = /*html*/ `
        <img
          src="${image.urls.small}"
          alt="${image.alt_description || "Unsplash Image"}"
          class="rounded-md p-0.5 ring-1 ring-slate-700 hover:ring-cyan-500 w-full h-auto transition-all duration-100 ease-in-out"
          draggable="false"
          loading="lazy"
        />
      `;
      fragment.appendChild(imgDiv);

      this.#updateImageDisplay(imgDiv, image, false); // Initial render, no selection animation

      if (animateTransition) {
        imgDiv.classList.add("opacity-0", "scale-96");
        requestAnimationFrame(() => {
          imgDiv.classList.remove("opacity-0", "scale-96");
          imgDiv.classList.add(
            "opacity-100",
            "scale-100",
            "transition-all",
            "duration-100",
            "ease-in-out",
          );
        });
      } else {
        imgDiv.classList.add("opacity-100", "scale-100");
      }
    });
    this.imageGridContainer.appendChild(fragment);
  }

  /**
   * @description Loads selected images from sessionStorage.
   * @returns {Array<Object>} An array of selected image objects.
   */
  loadSelectedImages() {
    try {
      const obsiaPayload = window.obsiaSessionManager.getPayload();
      if (obsiaPayload.pictures.selected && obsiaPayload.pictures.selected.length > 0) {
        return obsiaPayload.pictures.selected;
      }

      const storedImages = sessionStorage.getItem("obsia_selected_images");
      return storedImages ? JSON.parse(storedImages) : [];
    } catch (error) {
      console.error("Error loading selected images from sessionStorage:", error);
      return [];
    }
  }

  async loadDefaultImages() {
    const currentPayload = window.obsiaSessionManager.getPayload();
    const defaultQuery = currentPayload.start.business.toLowerCase();
    const cacheKey = `unsplash_images_${defaultQuery}_page_1`;

    // 1. Prioritize currentPayload.pictures.default
    if (currentPayload.pictures.default && currentPayload.pictures.default.length > 0) {
      this.allImages = currentPayload.pictures.default;
      return;
    }

    // 2. Check sessionStorage cache
    const cachedData = sessionStorage.getItem(cacheKey);
    if (cachedData) {
      this.allImages = JSON.parse(cachedData).results;
      return;
    }

    // 3. Fetch from API if neither of the above
    this.loadingSpinner.classList.remove("hidden"); // Show loader for default images
    let url = `https://unsplash-images-313065021854.us-east1.run.app?query=${defaultQuery}&per_page=${this.perPage}&page=1`;
    const token = localStorage.getItem(window.cookieName);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data && data.results) {
        sessionStorage.setItem(cacheKey, JSON.stringify(data)); // Cache the fetched data
        const currentPictures = window.obsiaSessionManager.getPayload().pictures;
        window.obsiaSessionManager.updatePayloadSection("pictures", {
          ...currentPictures,
          default: data.results,
          merge: [new Set([...currentPictures.selected, ...data.results])],
        });
        this.allImages = data.results; // Assign directly, not append, as this is the initial load
      }
    } catch (error) {
      console.log("Error fetching default images", error);
    } finally {
      this.loadingSpinner.classList.add("hidden"); // Hide loader after fetching default images
    }
  }

  /**
   * @description Saves selected images to sessionStorage.
   * @param {Array<Object>} images - The array of image objects to save.
   * @returns {void}
   */
  saveSelectedImages(images) {
    try {
      sessionStorage.setItem("obsia_selected_images", JSON.stringify(images));
    } catch (error) {
      console.error("Error saving selected images to sessionStorage:", error);
    }
  }

  /**
   * @description Clears the image grid and resets image data.
   * @returns {void}
   */
  clearGrid() {
    this.imageGridContainer.innerHTML = "";
    this.allImages = [];
    this.displayedImages = [];
    this.currentPage = 1; // Ensure currentPage is reset
    this.isLoading = false;
  }

  /**
   * @description Handles click events on images to toggle selection.
   * @param {Event} event - The click event.
   * @returns {void}
   */
  handleImageClick(event) {
    const imgDiv = event.target.closest("[data-image-id]");
    if (!imgDiv) {
      return;
    }

    const imageId = imgDiv.dataset.imageId;
    const imageData = JSON.parse(imgDiv.dataset.imageJson);

    const index = this.selectedImages.findIndex((img) => img.id === imageId);

    if (index > -1) {
      // Image is already selected, remove it
      this.selectedImages.splice(index, 1);
    } else {
      // Image is not selected, add it
      this.selectedImages.push(imageData);
    }

    this.saveSelectedImages(this.selectedImages);
    const currentPictures = window.obsiaSessionManager.getPayload().pictures;
    window.obsiaSessionManager.updatePayloadSection("pictures", {
      ...currentPictures,
      selected: this.selectedImages,
      merge: [...new Set([...currentPictures.selected, ...currentPictures.default])],
    });
    this.#updateImageDisplay(imgDiv, imageData);
  }

  /**
   * @description Clears the grid and loads default images when the search query is empty.
   * @returns {Promise<void>}
   */
  /**
   * @description This method is no longer used as its functionality is absorbed into #handleSearchCleared and filterAndDisplayImages.
   * @returns {Promise<void>}
   */
  async loadImagesForEmptyQuery() {
    // No action needed.
  }

  /**
   * @private
   * @description Handles the 'search-triggered' event from the search bar.
   * @param {CustomEvent} event - The custom event containing the search query.
   * @returns {void}
   */
  #handleSearchTriggered(event) {
    const query = event.detail.query;
    if (!query) {
      this.#handleSearchCleared(); // Treat empty search as a clear
      return;
    }
    this.filterAndDisplayImages(query, this.currentOrientation, this.currentTab, true); // Force animation for search
  }

  /**
   * @private
   * @description Handles the 'search-cleared' event from the search bar.
   * @returns {void}
   */
  #handleSearchCleared() {
    const currentPayload = window.obsiaSessionManager.getPayload();
    const defaultQuery = currentPayload.start.business.toLowerCase();
    this.filterAndDisplayImages(defaultQuery, this.currentOrientation, this.currentTab, true); // Force animation for clear
  }

  /**
   * @private
   * @description Handles the 'orientation-changed' event from the tabs component.
   * @param {CustomEvent} event - The custom event containing the selected orientation.
   * @returns {void}
   */
  #handleOrientationChanged(event) {
    const orientation = event.detail.orientation;
    this.filterAndDisplayImages(this.currentQuery, orientation, this.currentTab);
  }

  /**
   * @private
   * @description Handles the 'tab-changed' event from the tabs component.
   * @param {CustomEvent} event - The custom event containing the selected tab.
   * @returns {void}
   */
  #handleTabChanged(event) {
    const tab = event.detail.tab;
    this.filterAndDisplayImages(this.currentQuery, this.currentOrientation, tab);
  }
}

customElements.define("obsia-pictures-grid", ObsiaPicturesGrid);
