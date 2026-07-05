/**
 * @class ObsiaDesign
 * @augments HTMLElement
 * @description Web component for the "Design" page, integrating top bar and design selection components.
 */
class ObsiaDesign extends HTMLElement {
  /**
   * @description Constructs the ObsiaDesign instance.
   * @returns {void}
   */
  constructor() {
    super();
  }

  /**
   * @description Called when the element is added to the document's DOM.
   * @returns {void}
   */
  connectedCallback() {
    this.className = `flex flex-col items-center h-screen w-full`;
    this.innerHTML = `
            <h2 class="text-3xl font-bold mt-20 mb-8 text-slate-100 text-center">
                Choose the Design
            </h2>

            <!-- <obsia-design-search-bar></obsia-design-search-bar> -->

            <obsia-design-grid></obsia-design-grid>

            <div class="flex flex-row justify-between items-center p-3 gap-4">
                <obsia-back-button data-obsia-navigate="#pictures">Back</obsia-back-button>
            </div>
        `;
  }
}

customElements.define("obsia-design", ObsiaDesign);
