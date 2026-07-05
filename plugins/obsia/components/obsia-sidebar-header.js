/**
 * @class ObsiaSidebarHeader
 * @augments HTMLElement
 * @description Web component for the sidebar header, including a back button and title.
 */
class ObsiaSidebarHeader extends HTMLElement {
  returnButton = null;

  /**
   * @description Constructs the ObsiaSidebarHeader instance.
   * @returns {void}
   */
  constructor() {
    super();
    this.innerHTML = `
            <div class="flex items-center justify-between p-2 h-[64px] border-b border-slate-700 bg-slate-800">
                <button id="returnButton">
                    <img class="h-8 w-8 p-1 bg-slate-600 hover:bg-slate-500 rounded-full cursor-pointer" src="${window.location.origin}/wp-content/plugins/obsia/assets/icons/arrow-right.svg" alt="Return" />
                </button>
                <h2 class="flex-1 text-xl text-center font-semibold text-slate-100 cursor-default">AI ObsidianWP</h2>
                <img class="w-8" src="/wp-content/plugins/obsia/assets/icons/obsidian-logo.png" /> <!-- alignment placeholder -->
            </div>
        `;
  }

  /**
   * @description Called when the element is added to the document's DOM.
   * @returns {void}
   */
  connectedCallback() {
    this.returnButton = this.querySelector("#returnButton");
    if (this.returnButton) {
      this.returnButton.addEventListener("click", this.#handleReturnClick.bind(this));
    }
  }

  /**
   * @description Called when the element is removed from the document's DOM.
   * @returns {void}
   */
  disconnectedCallback() {
    if (this.returnButton) {
      this.returnButton.removeEventListener("click", this.#handleReturnClick.bind(this));
    }
  }

  /**
   * @private
   * @description Handles the click event for the return button, toggling the sidebar.
   * @returns {void}
   */
  #handleReturnClick() {
    window.dispatchEvent(new CustomEvent("toggle-sidebar"));
  }
}

customElements.define("obsia-sidebar-header", ObsiaSidebarHeader);
