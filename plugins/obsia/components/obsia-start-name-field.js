/**
 * @class ObsiaStartNameField
 * @augments HTMLElement
 * @description Web component for the website name input field.
 */
class ObsiaStartNameField extends HTMLElement {
  siteNameInput = null;

  /**
   * @description Constructs the ObsiaStartNameField instance.
   * @returns {void}
   */
  constructor() {
    super();
    this.className = `mb-6`;
    this.innerHTML = `
            <label for="siteName" class="block text-slate-300 text-sm font-semibold mb-2">Name of the website</label>
            <input type="text" id="siteName" class="shadow appearance-none border border-slate-700 rounded-xl w-full h-11 px-3 text-slate-300 text-md bg-slate-900 leading-tight transition-all duration-300 ease-in-out ring ring-0 ring-transparent outline-none hover:ring-1 hover:ring-cyan-500 focus:ring-2 focus:ring-cyan-500" placeholder="Enter name or title of the website">
        `;
  }

  /**
   * @description Called when the element is added to the document's DOM.
   * @returns {void}
   */
  connectedCallback() {
    this.siteNameInput = this.querySelector("#siteName");
    this.siteNameInput.addEventListener("input", this.#handleInputChange.bind(this));
    this.#loadInitialValue();
  }

  /**
   * @description Called when the element is removed from the document's DOM.
   * @returns {void}
   */
  disconnectedCallback() {
    if (this.siteNameInput) {
      this.siteNameInput.removeEventListener("input", this.#handleInputChange.bind(this));
    }
  }

  /**
   * @private
   * @description Handles the input event on the site name field, updating the session payload.
   * @param {Event} event - The input event.
   * @returns {void}
   */
  #handleInputChange(event) {
    const siteName = event.target.value;
    const currentPayload = window.obsiaSessionManager.getPayload();
    window.obsiaSessionManager.updatePayloadSection("start", {
      ...currentPayload.start,
      name: siteName,
    });
  }

  /**
   * @private
   * @description Loads the initial value from sessionStorage and sets it to the input field.
   * @returns {void}
   */
  #loadInitialValue() {
    const currentPayload = window.obsiaSessionManager.getPayload();
    if (currentPayload.start && currentPayload.start.name) {
      this.siteNameInput.value = currentPayload.start.name;
    }
  }
}

customElements.define("obsia-start-name-field", ObsiaStartNameField);
