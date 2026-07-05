/**
 * @class ObsiaTopbarStep
 * @augments HTMLElement
 * @description Web component for a single step in the top navigation bar.
 */
class ObsiaTopbarStep extends HTMLElement {
  stepItemDiv = null;
  stepTextDiv = null;

  /**
   * @description Observes changes to the 'name', 'page', 'is-active', and 'is-completed' attributes.
   * @returns {Array<string>} The observed attributes.
   */
  static get observedAttributes() {
    return ["name", "page", "is-active", "is-completed"];
  }

  /**
   * @description Constructs the ObsiaTopBarStep instance.
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
    if (!this.hasChildNodes()) {
      this.stepItemDiv = document.createElement("div");
      this.stepItemDiv.className = "step-item";

      this.stepTextDiv = document.createElement("div");
      this.stepTextDiv.className = "step-text";

      this.stepItemDiv.appendChild(this.stepTextDiv);
      this.appendChild(this.stepItemDiv);
    } else {
      this.stepItemDiv = this.querySelector(".step-item");
      this.stepTextDiv = this.querySelector(".step-text");
    }
    this.#updateContent();
  }

  /**
   * @description Called when the element is removed from the document's DOM.
   * @returns {void}
   */
  disconnectedCallback() {
    // No specific cleanup needed for this component.
  }

  /**
   * @description Handles changes to observed attributes.
   * @param {string} name - The name of the attribute.
   * @param {string} oldVal - The old value of the attribute.
   * @param {string} newVal - The new value of the attribute.
   * @returns {void}
   */
  attributeChangedCallback(name, oldVal, newVal) {
    this.#updateContent();
  }

  /**
   * @private
   * @description Updates the content and classes of the step element.
   * @returns {void}
   */
  #updateContent() {
    const name = this.getAttribute("name") || "";
    const page = this.getAttribute("page");
    const isActive = this.hasAttribute("is-active");
    const isCompleted = this.hasAttribute("is-completed");

    if (this.stepTextDiv) {
      this.stepTextDiv.textContent = name;
      let classList = ["step-text", "font-gold text-md cursor-default"];
      if (isActive) {
        classList.push("text-cyan-400");
        classList.push("gradient-text-step");
      } else if (isCompleted) {
        classList.push("text-cyan-900");
      } else {
        classList.push("text-slate-300");
      }
      this.stepTextDiv.className = classList.join(" ");
    }

    if (page) {
      this.dataset.page = page;
    }
  }
}

customElements.define("obsia-topbar-step", ObsiaTopbarStep);
