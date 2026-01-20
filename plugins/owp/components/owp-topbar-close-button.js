/**
 * @class OwpTopbarCloseButton
 * @augments HTMLElement
 * @description Web component for the close button and dropdown menu in the top bar.
 */
class OwpTopbarCloseButton extends HTMLElement {
  crossButton = null;
  dropdownContent = null;
  cancelButton = null;
  boundHandleOutsideClick = null;

  /**
   * @description Constructs the OwpTopBarCloseButton instance.
   * @returns {void}
   */
  constructor() {
    super();
    this.classList = `relative w-40 flex justify-end items-center`;
    this.innerHTML = /*html*/ `

			<div id="crossButton" class="relative flex justify-center items-center size-10 bg-gray-800 hover:bg-gray-900 rounded-full transition-all cursor-pointer">
				<div class="focus:outline-none cursor-pointer">
					<img
						src="${owp_vars.plugin_url}assets/icons/x.svg"
						alt="Close"
					/>
				</div>
			</div>

			<div id="dropdownContent" class="absolute top-12 right-0 w-80 bg-slate-900 rounded-2xl shadow-lg p-2 z-10 border border-slate-800 hover:border-slate-700 transition-all duration-250 opacity-0 scale-90 pointer-events-none cursor-default select-none">
				<div class="px-4 py-2 text-md text-slate-100">
					<p>Are you sure you want to quit?</p>
				</div>
				<div class="flex justify-center items-center gap-4 p-2">
					<button id="cancelButton" class="px-5 py-1 text-md text-slate-100 font-bold bg-cyan-600 hover:bg-cyan-500 rounded-2xl transition-all cursor-pointer">Cancel</button>
					<a href="/wp-admin/" class="px-5 py-1 text-md text-slate-100 bg-slate-700 hover:bg-slate-800  rounded-2xl transition-all">Yes</a>
				</div>
			</div>
		`;
  }

  /**
   * @description Called when the element is added to the document's DOM.
   * @returns {void}
   */
  connectedCallback() {
    this.crossButton = this.querySelector("#crossButton");
    this.dropdownContent = this.querySelector("#dropdownContent");
    this.cancelButton = this.querySelector("#cancelButton");

    if (this.crossButton) {
      this.crossButton.addEventListener("click", this.#toggleDropdown.bind(this));
    }
    if (this.cancelButton) {
      this.cancelButton.addEventListener("click", this.#toggleDropdown.bind(this));
    }

    this.boundHandleOutsideClick = this.#handleOutsideClick.bind(this);
    document.addEventListener("click", this.boundHandleOutsideClick);
  }

  /**
   * @description Called when the element is removed from the document's DOM.
   * @returns {void}
   */
  disconnectedCallback() {
    document.removeEventListener("click", this.boundHandleOutsideClick);
    if (this.crossButton) {
      this.crossButton.removeEventListener("click", this.#toggleDropdown.bind(this));
    }
    if (this.cancelButton) {
      this.cancelButton.removeEventListener("click", this.#toggleDropdown.bind(this));
    }
  }

  /**
   * @private
   * @description Handles clicks outside the dropdown to close it.
   * @param {Event} event The click event.
   * @returns {void}
   */
  #handleOutsideClick(event) {
    if (
      !this.contains(event.target) &&
      this.dropdownContent &&
      this.dropdownContent.classList.contains("opacity-100")
    ) {
      this.#toggleDropdown(event);
    }
  }

  /**
   * @private
   * @description Toggles the visibility of the dropdown menu.
   * @param {Event} event The click event.
   * @returns {void}
   */
  #toggleDropdown(event) {
    event.stopPropagation();
    if (this.dropdownContent) {
      if (this.dropdownContent.classList.contains("opacity-0")) {
        this.dropdownContent.classList.remove("opacity-0");
        this.dropdownContent.classList.add("opacity-100");
      } else {
        this.dropdownContent.classList.remove("opacity-100");
        this.dropdownContent.classList.add("opacity-0");
      }
      if (this.dropdownContent.classList.contains("pointer-events-none")) {
        this.dropdownContent.classList.remove("pointer-events-none");
      } else {
        this.dropdownContent.classList.add("pointer-events-none");
      }
      if (this.dropdownContent.classList.contains("scale-100")) {
        this.dropdownContent.classList.remove("scale-100");
        this.dropdownContent.classList.add("scale-90");
      } else {
        this.dropdownContent.classList.remove("scale-90");
        this.dropdownContent.classList.add("scale-100");
      }
    }
  }
}

customElements.define("owp-topbar-close-button", OwpTopbarCloseButton);
