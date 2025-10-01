/**
 * @class OwpDesignGrid
 * @augments HTMLElement
 * @description Web component for displaying a grid of design options on the design page.
 */
class OwpDesignGrid extends HTMLElement {
    designs = [];

    constructor() {
        super();
        this.className = `flex-1 overflow-y-auto w-full max-h-screen pr-2`;
        this.innerHTML = `
            <div id="designGrid" class="h-full flex flex-wrap gap-6 justify-center items-center text-2xl text-gray-300 font-semibold pl-4 pr-2">
                Loading...
            </div>
        `;
    }

    connectedCallback() {
        this.getDesigns()
            .then(designs => {
                this.designs = designs
                this.querySelector('#designGrid').innerHTML = /*html*/`
                    ${this.designs.map((design, index) => /*html*/`
                        <owp-design-option
                            template-id=${design.ID}
                            option=${index + 1}
                            url=${design.url}
                            name=${design.title}
                        ></owp-design-option>
                    `).join('')}
                `;
            })
    }

    /**
     * @description Generates placeholder design option HTML.
     * @returns {string} The owp pre-made elementor templates, design options.
     */
    async getDesigns() {
        const res = await fetch('/wp-json/owp/api/designs')
        return await res.json()
    }
}

customElements.define('owp-design-grid', OwpDesignGrid);