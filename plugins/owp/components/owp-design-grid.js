/**
 * @class OwpDesignGrid
 * @augments HTMLElement
 * @description Web component for displaying a grid of design options on the design page.
 */
class OwpDesignGrid extends HTMLElement {
    designs = [];

    constructor() {
        super();
        this.getTemplates()
            .then(designs => {
                this.designs = designs
                console.log(this.designs)
                this.querySelector('#designGrid').innerHTML = /*html*/`
                    ${this.designs.map((design, index) => /*html*/`
                        <owp-design-option
                            option=${index + 1}
                            url=${design.url}
                        ></owp-design-option>
                    `).join('')}
                `;

            })
        this.className = `flex-1 overflow-y-auto w-full max-h-screen pr-2`;
        this.innerHTML = `
            <div id="designGrid" class="h-full flex flex-wrap gap-6 justify-center items-center text-2xl text-gray-300 font-semibold pl-4 pr-2">
                Loading...
            </div>
        `;
    }

    /**
     * @description Generates placeholder design option HTML.
     * @returns {string} The owp pre-made elementor templates, design options.
     */
    async getTemplates() {
        const res = await fetch(
            '/wp-json/owp/api/templates'
        )
        return await res.json()
    }
}

customElements.define('owp-design-grid', OwpDesignGrid);