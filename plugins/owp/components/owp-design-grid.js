/**
 * @class OwpDesignGrid
 * @augments HTMLElement
 * @description Web component for displaying a grid of design options on the design page.
 */
class OwpDesignGrid extends HTMLElement {
    /**
     * @description Constructs the OwpDesignGrid instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.innerHTML = `
            <div class="w-full overflow-y-auto max-h-[calc(100vh-280px)] pr-2">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center">
                    ${this.getPlaceholderDesigns(8)}
                </div>
            </div>
        `;
    }

    /**
     * @description Generates placeholder design option HTML.
     * @param {number} count - The number of placeholder design options to generate.
     * @returns {string} The HTML string for placeholder design options.
     */
    getPlaceholderDesigns(count) {
        let designsHtml = '';
        for (let i = 0; i < count; i++) {
            designsHtml += `
                <owp-design-option option-number="${i + 1}"></owp-design-option>
            `;
        }
        return designsHtml;
    }
}

customElements.define('owp-design-grid', OwpDesignGrid);