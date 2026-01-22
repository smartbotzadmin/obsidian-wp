/**
 * @class ObsiaDesignGrid
 * @augments HTMLElement
 * @description Web component for displaying a grid of design options on the design page.
 */
class ObsiaDesignGrid extends HTMLElement {
  designs = [];

  constructor() {
    super();
    this.className = `w-screen h-full flex-1 flex justify-center flex-wrap gap-6 text-2xl text-gray-300 font-semibold pl-4 pr-2 overflow-y-auto `;
    this.innerHTML = `
            <div class="size-full picture-loader"> </div>
        `;
  }

  connectedCallback() {
    this.#getDesigns().then((designs) => {
      this.designs = designs;
      this.innerHTML = /*html*/ `
                    ${this.designs
                      .map(
                        (design, index) => /*html*/ `
                        <obsia-design-option
                            template-id=${design.ID}
                            option=${index + 1}
                            url=${design.url}
                            name=${design.name}
                            title=${design.title}
                            img-css-ids=${btoa(JSON.stringify(design.images_json))}
                        ></obsia-design-option>
                    `,
                      )
                      .join("")}
                `;
    });
  }

  /**
   * @description Called when the element is removed from the document's DOM.
   * @returns {void}
   */
  disconnectedCallback() {
    // No specific cleanup needed for this component's event listeners or observers.
  }

  /**
   * @private
   * @description Fetches design options from the API.
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of design objects.
   */
  async #getDesigns() {
    const res = await fetch("/wp-json/obsia/api/designs");
    return await res.json();
  }
}

customElements.define("obsia-design-grid", ObsiaDesignGrid);
