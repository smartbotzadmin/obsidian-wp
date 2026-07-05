/**
 * @class ObsiaContactAddressField
 * @augments HTMLElement
 * @description Web component for the address input field on the contact page.
 */
class ObsiaContactAddressField extends HTMLElement {
  /**
   * @description Constructs the ObsiaContactAddressField instance.
   * @returns {void}
   */
  constructor() {
    super();
    this.className = `flex flex-col mb-6`;
    this.innerHTML = `
            <label for="address" class="text-slate-300 text-sm font-semibold mb-2">Address</label>
            <input type="text" id="address" class="shadow appearance-none border border-slate-700 rounded-xl w-full h-11 px-3 text-md text-slate-100 leading-tight bg-slate-900 transition duration-300 ease-in-out ring ring-0 ring-transparent outline-none hover:ring-1 hover:ring-cyan-500 focus:ring-2 focus:ring-cyan-500" placeholder="Enter address">
        `;
  }

  /**
   * @description Called when the element is added to the document's DOM.
   * @returns {void}
   */
  connectedCallback() {
    this.addressInput = this.querySelector("#address");
    this.addressInput.addEventListener("input", this.#handleInputChange.bind(this));
    this.#loadInitialValue();
  }

  /**
   * @description Called when the element is removed from the document's DOM.
   * @returns {void}
   */
  disconnectedCallback() {
    // Cleanup event listeners if necessary
    this.addressInput.removeEventListener("input", this.#handleInputChange.bind(this));
  }

  /**
   * @private
   * @description Handles the input event on the address field, updating the session payload.
   * @param {Event} event - The input event.
   * @returns {void}
   */
  #handleInputChange(event) {
    const address = event.target.value;
    const currentPayload = window.obsiaSessionManager.getPayload();
    window.obsiaSessionManager.updatePayloadSection("contact", {
      ...currentPayload.contact,
      address: address,
    });
  }

  /**
   * @private
   * @description Loads the initial value from sessionStorage and sets it to the input field.
   * @returns {void}
   */
  #loadInitialValue() {
    const currentPayload = window.obsiaSessionManager.getPayload();
    if (currentPayload.contact && currentPayload.contact.address) {
      this.addressInput.value = currentPayload.contact.address;
    }
  }
}

customElements.define("obsia-contact-address-field", ObsiaContactAddressField);
