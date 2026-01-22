/**
 * @class ObsiaStartBusinessSelector
 * @augments HTMLElement
 * @description Web component for the website niche selection.
 */
class ObsiaStartBusinessSelector extends HTMLElement {
  /**
   * @private
   * @type {Array<string>}
   * @description List of available business options.
   */
  #businessOptions = [
    "Agency",
    "Restaurant",
    "Entrepreneur",
    "Event",
    "Non-profit",
    "Local business",
    "Gym",
    "Spa",
    "SaaS",
    "Dentist",
  ];

  /**
   * @public
   * @type {string|null}
   * @description Stores the currently selected business.
   */
  selectedBusiness = null;

  websiteForSearch = null;
  websiteForDropdown = null;
  websiteForInputContainer = null;
  boundHandleClickOutside = null;

  /**
   * @description Constructs the ObsiaStartBusinessSelector instance.
   * @returns {void}
   */
  constructor() {
    super();
    this.className = "min-w-86 flex flex-col relative mb-6";
    this.innerHTML = /*html*/ `
            <label for="websiteFor" class="text-sm text-slate-300 mb-2 font-semibold">This website is for</label>
            <div class="flex items-center h-11 px-3 text-md text-slate-100 bg-slate-900 border border-slate-700 rounded-xl transition-all duration-300 ease-in-out outline-transparent hover:outline-1 hover:outline-cyan-500 focus-within:outline-2 focus-within:outline-cyan-500 cursor-pointer" id="websiteForInputContainer">
                <div id="websiteForSearch" class="flex-grow bg-transparent focus:outline-none text-slate-100">Select your business</div>
                <div class="h-5 w-5">
                    <img src="/wp-content/plugins/obsia/assets/icons/chevron-down.svg" class="chevron-icon transition-transform duration-300 ease-in-out" />
                </div>
            </div>
            <div id="websiteForDropdown" class="absolute left-0 right-0 top-full mt-2 z-10 bg-slate-900 border border-slate-700 rounded-xl shadow-lg  opacity-0 scale-96 pointer-events-none transition-all duration-300 ease-in-out origin-top max-h-50 overflow-y-auto">
                <div class="py-1">
                    ${this.#businessOptions
                      .map(
                        (option) => `
                        <div class="flex items-center justify-between px-4 py-2 text-md text-slate-100 hover:bg-slate-800 cursor-pointer" data-value="${option}">
                            <span>${option}</span>
                            <span class="check-icon hidden">
                                <img src="/wp-content/plugins/obsia/assets/icons/check.svg" />
                            </span>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>
        `;
  }

  /**
   * @description Called when the element is inserted into the DOM.
   * @returns {void}
   */
  connectedCallback() {
    this.websiteForSearch = this.querySelector("#websiteForSearch");
    this.websiteForDropdown = this.querySelector("#websiteForDropdown");
    this.websiteForInputContainer = this.querySelector(".flex.items-center.h-11");

    this.websiteForInputContainer.addEventListener(
      "click",
      this.#handleInputContainerClick.bind(this),
    );
    this.websiteForDropdown.querySelectorAll("div[data-value]").forEach((item) => {
      item.addEventListener("click", this.#handleOptionClick.bind(this));
    });

    this.boundHandleClickOutside = this.#handleClickOutside.bind(this);
    document.addEventListener("click", this.boundHandleClickOutside);
    this.#loadInitialValue();
  }

  /**
   * @description Called when the element is removed from the DOM.
   * @returns {void}
   */
  disconnectedCallback() {
    document.removeEventListener("click", this.boundHandleClickOutside);
    if (this.websiteForInputContainer) {
      this.websiteForInputContainer.removeEventListener(
        "click",
        this.#handleInputContainerClick.bind(this),
      );
    }
    if (this.websiteForDropdown) {
      this.websiteForDropdown.querySelectorAll("div[data-value]").forEach((item) => {
        item.removeEventListener("click", this.#handleOptionClick.bind(this));
      });
    }
  }

  /**
   * @private
   * @description Handles clicks on the input container to toggle the dropdown.
   * @param {Event} event - The click event.
   * @returns {void}
   */
  #handleInputContainerClick(event) {
    event.stopPropagation(); // Prevent document click from immediately closing
    this.websiteForDropdown.classList.toggle("opacity-0");
    this.websiteForDropdown.classList.toggle("scale-96");
    this.websiteForDropdown.classList.toggle("pointer-events-none");
    this.querySelector(".chevron-icon").classList.toggle("rotate-180");
  }

  /**
   * @private
   * @description Handles clicks on a business option in the dropdown.
   * @param {Event} event - The click event.
   * @returns {void}
   */
  #handleOptionClick(event) {
    event.stopPropagation(); // Prevent event bubbling
    const selectedValue = event.currentTarget.dataset.value;
    this.websiteForSearch.textContent = selectedValue;
    this.selectedBusiness = selectedValue;
    this.websiteForDropdown.classList.add("opacity-0");
    this.websiteForDropdown.classList.add("scale-96");
    this.websiteForDropdown.classList.add("pointer-events-none");
    this.querySelector(".chevron-icon").classList.remove("rotate-180");

    const currentPayload = window.obsiaSessionManager.getPayload();
    window.obsiaSessionManager.updatePayloadSection("start", {
      ...currentPayload.start,
      business: selectedValue,
    });

    this.websiteForDropdown.querySelectorAll(".check-icon").forEach((icon) => {
      icon.classList.add("hidden");
    });
    event.currentTarget.querySelector(".check-icon").classList.remove("hidden");
  }

  /**
   * @private
   * @description Handles clicks outside the component to close the dropdown.
   * @param {Event} event - The click event.
   * @returns {void}
   */
  #handleClickOutside(event) {
    // If the click is outside the component (both input and dropdown) and the dropdown is visible, hide it.
    if (
      !this.contains(event.target) &&
      this.websiteForDropdown &&
      !this.websiteForDropdown.classList.contains("opacity-0")
    ) {
      this.websiteForDropdown.classList.add("opacity-0");
      this.websiteForDropdown.classList.add("scale-96");
      this.websiteForDropdown.classList.add("pointer-events-none");
      this.querySelector(".chevron-icon").classList.remove("rotate-180");
    }
  }

  /**
   * @private
   * @description Loads the initial value from sessionStorage and sets it to the display.
   * @returns {void}
   */
  #loadInitialValue() {
    const currentPayload = window.obsiaSessionManager.getPayload();
    if (currentPayload.start && currentPayload.start.business) {
      this.selectedBusiness = currentPayload.start.business;
      this.websiteForSearch.textContent = currentPayload.start.business;
      // Also update the checkmark for the pre-selected option
      this.websiteForDropdown.querySelectorAll("div[data-value]").forEach((item) => {
        if (item.dataset.value === currentPayload.start.business) {
          item.querySelector(".check-icon").classList.remove("hidden");
        } else {
          item.querySelector(".check-icon").classList.add("hidden");
        }
      });
    } else {
      this.websiteForSearch.textContent = "Select your business";
    }
  }
}

customElements.define("obsia-start-business-selector", ObsiaStartBusinessSelector);
