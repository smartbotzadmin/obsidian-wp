/**
 * @class ObsiaStart
 * @augments HTMLElement
 * @description Web component for the "Let's Start" page, integrating top bar and form components.
 */
class ObsiaStart extends HTMLElement {
  /**
   * @description Constructs the ObsiaStart instance.
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
    this.className = `flex justify-center items-center h-screen`;
    this.innerHTML = /*html*/ `
      <div class="flex flex-col justify-center w-[800px] p-12 rounded-3xl bg-slate-950 border border-slate-700">
        <h2 class="text-3xl font-bold mb-12 text-slate-100">
          Let's build your website!
        </h2>

        <div class="text-lg text-slate-100 mb-12">
          Please share some basic details of the website to get started.
        </div>

        <obsia-start-name-field></obsia-start-name-field>

        <div class="flex flex-col md:flex-row justify-between mb-6">
          <obsia-start-business-selector></obsia-start-business-selector>
          <obsia-start-language-selector></obsia-start-language-selector>
        </div>

        <div class="flex flex-row justify-between">
          <obsia-next-button data-obsia-navigate="#describe">Next</obsia-next-button>
        </div>
      </div>
    `;
  }
}

customElements.define("obsia-start", ObsiaStart);
