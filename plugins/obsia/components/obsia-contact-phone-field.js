/**
 * @class ObsiaContactPhoneField
 * @augments HTMLElement
 * @description Web component for the phone number input field on the contact page.
 */
class ObsiaContactPhoneField extends HTMLElement {
  /**
   * @description Constructs the ObsiaContactPhoneField instance.
   * @returns {void}
   */
  constructor() {
    super();
    this.className = `min-w-72`;
    this.innerHTML = `
            <label for="phoneNumber" class="block text-slate-300 text-sm font-semibold mb-2">Phone Number</label>
            <input type="tel" id="phoneNumber" class="shadow appearance-none border border-slate-700 rounded-xl w-full h-11 px-3 text-md text-slate-100 leading-tight bg-slate-900 transition duration-300 ease-in-out ring ring-0 ring-transparent outline-none hover:ring-1 hover:ring-cyan-500 focus:ring-2 focus:ring-cyan-500" placeholder="Your phone number">
        `;
  }

  /**
   * @description Called when the element is added to the document's DOM.
   * @returns {void}
   */
  connectedCallback() {
    this.phoneNumberInput = this.querySelector("#phoneNumber");
    this.phoneNumberInput.addEventListener("input", this.#handleInputChange.bind(this));
    this.#loadInitialValue();
  }

  /**
   * @description Called when the element is removed from the document's DOM.
   * @returns {void}
   */
  disconnectedCallback() {
    // Cleanup event listeners if necessary
    this.phoneNumberInput.removeEventListener("input", this.#handleInputChange.bind(this));
  }

  /**
   * @private
   * @description Handles the input event on the phone number field, updating the session payload.
   * @param {Event} event - The input event.
   * @returns {void}
   */
  #handleInputChange(event) {
    const phoneNumber = event.target.value;
    const currentPayload = window.obsiaSessionManager.getPayload();
    window.obsiaSessionManager.updatePayloadSection("contact", {
      ...currentPayload.contact,
      phone: phoneNumber,
    });
  }

  /**
   * @private
   * @description Loads the initial value from sessionStorage and sets it to the input field.
   * @returns {void}
   */
  #loadInitialValue() {
    const currentPayload = window.obsiaSessionManager.getPayload();
    if (currentPayload.contact && currentPayload.contact.phone) {
      this.phoneNumberInput.value = currentPayload.contact.phone;
    }
  }
}

customElements.define("obsia-contact-phone-field", ObsiaContactPhoneField);
