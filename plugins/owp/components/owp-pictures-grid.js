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
        this.className = `overflow-y-auto w-full max-h-screen pr-2`;
        this.innerHTML = `
            <div class="flex flex-wrap gap-6 justify-center">
                ${this.getPlaceholderImages(100)}
            </div>
        `;
    }

    /**
     * @description Generates placeholder image HTML.
     * @param {number} count - The number of placeholder images to generate.
     * @returns {string} The HTML string for placeholder images.
     */
    getPlaceholderImages(count) {
        let imagesHtml = '';
        for (let i = 0; i < count; i++) {
            imagesHtml += `
                <div class="bg-slate-800 aspect-video rounded-lg flex items-center justify-center text-slate-100 w-full sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 h-auto">
                    <img class="w-10 h-10" src="/wp-content/plugins/owp/assets/icons/image.svg">
                </div>
            `;
        }
        return imagesHtml;
    }
}

customElements.define('owp-pictures-grid', OwpPicturesGrid);