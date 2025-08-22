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
        this.className = `overflow-y-auto w-full max-h-screen pr-2`;
        this.innerHTML = `
            <div class="flex flex-wrap gap-6 justify-center pl-4 pr-2">
                ${this.getPlaceholderDesigns(9)}
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