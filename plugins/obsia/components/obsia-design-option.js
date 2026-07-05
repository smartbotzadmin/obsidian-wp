/**
 * @class ObsiaDesignOption
 * @augments HTMLElement
 * @description Web component for a single design option in the design grid.
 */
class ObsiaDesignOption extends HTMLElement {
  static observedAttributes = [
    "template-id",
    "url",
    "thumbnail",
    "name",
    "title",
    "option",
    "img-css-ids",
  ];

  /**
   * @description Constructs the ObsiaDesignOption instance.
   * @returns {void}
   */
  constructor() {
    super();
    this.id = null;
    this.url = null;
    this.thumbnail = null;
    this.name = null;
    this.option = null;
    this.imgContainer = null;
    this.thumbnailImg = null;
    this.hoverScroller = null;
    this.scrollInterval = null;
    this.currentScrollPostion = 0;
    this.scrollSpeed = 5;

    this.className = `flex flex-col max-w-1/3 h-[450px] bg-slate-950 rounded-lg border border-slate-700 cursor-pointer hover:border-slate-700 overflow-hidden`;
    this.innerHTML = /*html*/ `
            <div class="relative grow flex items-start justify-center bg-slate-900 text-slate-100 overflow-hidden">
                <img
                    id="loadingOption"
                    src="${obsia_vars.plugin_url}assets/icons/image.svg"
                    alt="Image Icon"
                    class="absolute z-3 w-full h-full opacity-10 animate-pulse"
                />
                <div id="hoverScroller" class="absolute w-full h-full z-2" ></div>
                <div id="imgContainer" class="w-full transition-transform duration-200 ease-linear">
                  <img
                      id="thumbnailImg"
                      class="w-full h-auto block"
                      src=""
                  />
                </div>
            </div>
            <div class="flex flex-col grow-0 shrink-0 p-4 cursor-default">
                <div class="flex justify-between items-center">
                    <span id="optionName" class="text-slate-100 text-md font-semibold">
                        Option
                    </span>
                    <div class="flex items-center gap-4">
                        <a href="#" class="text-slate-100 hover:text-slate-300 hover:opacity-75">
                            <img src="${obsia_vars.plugin_url}assets/icons/external-link.svg" alt="External Link Icon" class="w-5 h-5">
                        </a>
                        <a href="#" class="text-slate-100 hover:text-slate-300 hover:opacity-75">
                            <img src="${obsia_vars.plugin_url}assets/icons/info.svg" alt="Info Icon" class="w-5 h-5">
                        </a>
                    </div>
                </div>
            </div>
        `;
  }

  /**
   * @description Called when the element is added to the document's DOM.
   * @returns {void}
   */
  connectedCallback() {
    this.id = this.getAttribute("template-id");
    this.url = this.getAttribute("url");
    this.thumbnail = this.getAttribute("thumbnail");
    this.name = this.getAttribute("name");
    this.option = this.getAttribute("option");
    this.imgCssIds = this.getAttribute("img-css-ids");

    this.imgContainer = this.querySelector("#imgContainer");
    this.thumbnailImg = this.querySelector("#thumbnailImg");
    this.hoverScroller = this.querySelector("#hoverScroller");
    const optionNameElement = this.querySelector("#optionName");
    const loadingOptionImg = this.querySelector("#loadingOption");

    if (this.thumbnailImg) {
      this.thumbnailImg.src = this.thumbnail;
      this.thumbnailImg.onload = () => {
        if (loadingOptionImg) {
          loadingOptionImg.classList.add("hidden");
        }
      };
    }

    if (optionNameElement) {
      optionNameElement.textContent = `Option ${this.option} - ${this.name}`;
    }

    this.#scrollDownDesignOption();
    this.#scrollUpDesignOption();

    this.hoverScroller.addEventListener("click", this.#handleHoverScrollerClick.bind(this));
  }

  /**
   * @description Called when the element is removed from the document's DOM.
   * @returns {void}
   */
  disconnectedCallback() {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
      this.scrollInterval = null;
    }

    if (this.hoverScroller) {
      this.hoverScroller.removeEventListener("click", this.#handleHoverScrollerClick.bind(this));
      this.hoverScroller.onmouseenter = null;
      this.hoverScroller.onmouseleave = null;
    }
  }

  /**
   * @description Handles changes to observed attributes.
   * @param {string} name - The name of the attribute.
   * @param {string} oldVal - The old value of the attribute.
   * @param {string} newVal - The new value of the attribute.
   * @returns {void}
   */
  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) {
      return;
    }

    switch (name) {
      case "template-id":
        this.id = newVal;
        break;
      case "url":
        this.url = newVal;
        break;
      case "thumbnail":
        this.thumbnail = newVal;
        if (this.thumbnailImg) {
          this.thumbnailImg.src = this.thumbnail;
        }
        break;
      case "name":
        this.name = newVal;
        break;
      case "title":
        this.title = newVal;
        break;
      case "img-css-ids":
        this.imgCssIds = newVal;
        break;
      case "option":
        this.option = newVal;
        const optionNameElement = this.querySelector("#optionName");
        if (optionNameElement) {
          optionNameElement.textContent = `Option ${this.option}`;
        }
        break;
    }
  }

  /**
   * @private
   * @description Handles the click event on the hover scroller to open the preview modal.
   * @returns {void}
   */
  #handleHoverScrollerClick() {
    const obsiaApp = document.querySelector("obsia-app");

    if (obsiaApp) {
      const previewModal = new ObsiaDesignPreviewModal();
      previewModal.setAttribute("url", this.url);
      previewModal.setAttribute("template-id", this.id);
      previewModal.setAttribute("name", this.name);
      previewModal.setAttribute("title", this.title);
      previewModal.setAttribute("img-css-ids", this.imgCssIds);
      obsiaApp.shadowRoot.appendChild(previewModal);
    }
  }

  /**
   * @private
   * @description Scrolls the design thumbnail down on mouse enter.
   * @returns {void}
   */
  #scrollDownDesignOption() {
    this.hoverScroller.onmouseenter = () => {
      if (this.scrollInterval) {
        clearInterval(this.scrollInterval);
      }

      const containerHeight = this.hoverScroller.clientHeight;
      const imgHeight = this.thumbnailImg.clientHeight;
      const maxScroll = imgHeight - containerHeight;

      if (maxScroll <= 0) return;

      this.scrollInterval = setInterval(() => {
        if (this.currentScrollPostion < maxScroll) {
          this.currentScrollPostion += this.scrollSpeed;
          this.imgContainer.style.transform = `translateY(-${this.currentScrollPostion}px)`;
        }
      }, 20);
    };
  }

  /**
   * @private
   * @description Scrolls the design thumbnail up on mouse leave.
   * @returns {void}
   */
  #scrollUpDesignOption() {
    this.hoverScroller.onmouseleave = () => {
      if (this.scrollInterval) {
        clearInterval(this.scrollInterval);
      }

      this.scrollInterval = setInterval(() => {
        if (this.currentScrollPostion > 0) {
          this.currentScrollPostion -= this.scrollSpeed * 2;
          if (this.currentScrollPostion < 0) this.currentScrollPostion = 0;
          this.imgContainer.style.transform = `translateY(-${this.currentScrollPostion}px)`;
        } else {
          clearInterval(this.scrollInterval);
        }
      }, 20);
    };
  }
}

customElements.define("obsia-design-option", ObsiaDesignOption);
