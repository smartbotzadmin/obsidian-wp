/**
 * @class ObsiaTopbarLogo
 * @augments HTMLElement
 * @description Web component for the OBSIA logo in the top bar.
 */
class ObsiaTopbarLogo extends HTMLElement {
  /**
   * @description Constructs the ObsiaTopBarLogo instance.
   * @returns {void}
   */
  constructor() {
    super();
    this.classList = `w-40 h-10 flex items-center gap-4`;
    this.innerHTML = /*html*/ `
			<img src="${window.location.origin}/wp-content/plugins/obsia/assets/icons/obsidian-logo.png" alt="OBSIA Logo" class="h-8 w-auto">
			<span class="font-gold font-bold text-gray-100 text-lg cursor-default select-none">OBSIDIAN</span>
		`;
  }

  /**
   * @description Called when the element is added to the document's DOM.
   * @returns {void}
   */
  connectedCallback() {
    // No specific logic needed on connection for this component.
  }

  /**
   * @description Called when the element is removed from the document's DOM.
   * @returns {void}
   */
  disconnectedCallback() {
    // No specific cleanup needed for this component.
  }
}

customElements.define("obsia-topbar-logo", ObsiaTopbarLogo);
