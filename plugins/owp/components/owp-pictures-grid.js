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
        this.innerHTML = `
            <div class="overflow-y-auto max-h-screen pr-2">
                <div class="flex flex-wrap gap-6 justify-center">
                    ${this.getPlaceholderImages(8)}
                </div>
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
                <div class="bg-slate-900 aspect-video rounded-lg flex items-center justify-center text-slate-100 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
                    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
            `;
        }
        return imagesHtml;
    }
}

customElements.define('owp-pictures-grid', OwpPicturesGrid);