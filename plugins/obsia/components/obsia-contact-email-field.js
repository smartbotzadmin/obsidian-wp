/**
 * @class ObsiaContactEmailField
 * @augments HTMLElement
 * @description Web component for the email input field on the contact page.
 */
class ObsiaContactEmailField extends HTMLElement {
  /**
   * @description Constructs the ObsiaContactEmailField instance.
   * @returns {void}
   */
  constructor() {
    super();
    this.className = `min-w-72`;
    this.innerHTML = `
            <label for="email" class="block text-slate-300 text-sm font-semibold mb-2">Email</label>
            <input type="email" id="email" class="shadow appearance-none border border-slate-700 rounded-xl w-full h-11 px-3 text-md text-slate-100 leading-tight bg-slate-900 transition duration-300 ease-in-out ring ring-0 ring-transparent outline-none hover:ring-1 hover:ring-cyan-500 focus:ring-2 focus:ring-cyan-500" placeholder="Your email">
        `;
  }

  /**
   * @description Called when the element is added to the document's DOM.
   * @returns {void}
   */
  connectedCallback() {
    this.emailInput = this.querySelector("#email");
    this.emailInput.addEventListener("input", this.#handleInputChange.bind(this));
    this.#loadInitialValue();
  }

  /**
   * @description Called when the element is removed from the document's DOM.
   * @returns {void}
   */
  disconnectedCallback() {
    // Cleanup event listeners if necessary
    this.emailInput.removeEventListener("input", this.#handleInputChange.bind(this));
  }

  /**
   * @private
   * @description Handles the input event on the email field, updating the session payload.
   * @param {Event} event - The input event.
   * @returns {void}
   */
  #handleInputChange(event) {
    const email = event.target.value;
    const currentPayload = window.obsiaSessionManager.getPayload();
    window.obsiaSessionManager.updatePayloadSection("contact", {
      ...currentPayload.contact,
      email: email,
    });
  }

  /**
   * @private
   * @description Loads the initial value from sessionStorage and sets it to the input field.
   * @returns {void}
   */
  #loadInitialValue() {
    const currentPayload = window.obsiaSessionManager.getPayload();
    if (currentPayload.contact && currentPayload.contact.email) {
      this.emailInput.value = currentPayload.contact.email;
    }
  }
}

customElements.define("obsia-contact-email-field", ObsiaContactEmailField);
