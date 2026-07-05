/**
 * @class ObsiaTopbarStepSeparator
 * @augments HTMLElement
 * @description Web component for the separator between steps in the top navigation bar.
 */
class ObsiaTopbarStepSeparator extends HTMLElement {
  separatorLineDiv = null;

  /**
   * @description Observes changes to the 'is-active' and 'is-completed' attributes.
   * @returns {Array<string>} The observed attributes.
   */
  static get observedAttributes() {
    return ["is-active", "is-completed"];
  }

  /**
   * @description Constructs the ObsiaTopBarStepSeparator instance.
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
      this.separatorLineDiv = document.createElement("div");
      this.separatorLineDiv.className = "separator-line";
      this.appendChild(this.separatorLineDiv);
    } else {
      this.separatorLineDiv = this.querySelector(".separator-line");
    }
    this.#updateLineClass();
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
    this.#updateLineClass();
  }

  /**
   * @private
   * @description Updates the class of the separator line.
   * @returns {void}
   */
  #updateLineClass() {
    const isActive = this.hasAttribute("is-active");
    const isCompleted = this.hasAttribute("is-completed");

    if (this.separatorLineDiv) {
      let classList = ["h-[1px]", "w-4", "mx-2"];
      if (isActive) {
        classList.push("bg-cyan-400");
      } else if (isCompleted) {
        classList.push("bg-cyan-900");
      } else {
        classList.push("bg-slate-300");
      }
      this.separatorLineDiv.className = classList.join(" ");
    }
  }
}

customElements.define("obsia-topbar-step-separator", ObsiaTopbarStepSeparator);
