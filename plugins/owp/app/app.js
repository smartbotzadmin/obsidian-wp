/**
 * @class OwpApp
 * @augments HTMLElement
 * @description Main web component for the Obsidian WP Single Page Application.
 */
class OwpApp extends HTMLElement {
  /**
   * @description Constructs the OwpApp instance.
   * @returns {void}
   */
  constructor() {
    super();
    this._isAuthChecking = false;
    this._loaderElement = null;
    this._planSelector = null;
  }

  /**
   * @description Called when the element is added to the document's DOM.
   * @returns {void}
   */
  async connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" });

    shadowRoot.innerHTML = /*html*/ `
      <link rel="stylesheet" href="${owp_vars.plugin_url}assets/css/output.css">
      <img class="absolute -z-2 object-cover h-full w-full" src="${owp_vars.plugin_url}assets/icons/obsidian-background.webp"/>
      <div class="absolute -z-1 w-full h-full bg-slate-900 opacity-50"></div>
      <div id="loader" class="fixed inset-0 bg-black/70 flex justify-center items-center z-[1000] hidden">
        <img src="${owp_vars.plugin_url}assets/icons/loader.svg" class="animate-spin h-24 w-24" alt="Loading"/>
      </div>
      <owp-topbar></owp-topbar>
      <owp-plan-selector></owp-plan-selector>
    `;

    this._loaderElement = shadowRoot.querySelector("#loader");
    this._planSelector = shadowRoot.querySelector("owp-plan-selector");
    document.querySelector("#wpfooter")?.remove();
    document.querySelector(".notice.notice-warning.update-nag.inline")?.remove();
    document.querySelector("astra-sites-on-active")?.remove();

    this.routes = {
      "": "owp-start",
      start: "owp-start",
      describe: "owp-describe",
      contact: "owp-contact",
      pictures: "owp-pictures",
      design: "owp-design",
      signup: "owp-signup",
      signin: "owp-signin",
      "google-signin-redirect": "owp-google-signin-redirect",
    };

    await this._performAuthCheckAndRoute();
    window.addEventListener("hashchange", this._performAuthCheckAndRoute.bind(this));
    this.shadowRoot.addEventListener("click", this.handleNavigationClick.bind(this));
  }

  /**
   * @private
   * @description Performs authentication check and routes accordingly.
   * @returns {void}
   */
  async _performAuthCheckAndRoute() {
    const fullHash = window.location.hash.substring(1);
    const [currentHash] = fullHash.split("?");
    const authRequiredPages = ["start", "describe", "pictures", "design", "contact"];
    const isAuthRequiredPage = authRequiredPages.includes(currentHash);
    const isAuthPage = currentHash === "signin" || currentHash === "signup";

    if (isAuthRequiredPage) {
      this._loaderElement.classList.remove("hidden");
      const isValidToken = await this._checkAuthToken();
      this._loaderElement.classList.add("hidden");

      if (isValidToken) {
        this.handleRouting();
      } else {
        window.location.hash = "signin";
        localStorage.removeItem(window.cookieName);
      }
    } else if (isAuthPage) {
      // If on signin/signup page, and a token exists, redirect to start
      const token = localStorage.getItem(window.cookieName);
      if (token) {
        this._loaderElement.classList.remove("hidden");
        const isValidToken = await this._checkAuthToken();
        this._loaderElement.classList.add("hidden");
        if (isValidToken) {
          window.location.hash = "start";
        } else {
          this.handleRouting(); // Stay on signin/signup if token invalid
        }
      } else {
        this.handleRouting(); // No token, stay on signin/signup
      }
    } else {
      this.handleRouting(); // For other pages not requiring auth, just route
    }
  }

  /**
   * @private
   * @description Checks if the authentication token is valid.
   * @returns {Promise<boolean>} True if the token is valid, false otherwise.
   */
  async _checkAuthToken() {
    this._isAuthChecking = true;
    const token = localStorage.getItem(window.cookieName);
    if (!token) {
      this._isAuthChecking = false;
      return false;
    }

    try {
      const response = await fetch("https://obsidian-validate-313065021854.us-east1.run.app", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 402) {
        this._ensurePlanSelectorExists();
        this._planSelector.show();
        this._isAuthChecking = false;
        return true;
      }

      this._isAuthChecking = false;
      return response.ok; // Returns true for 200 status, false otherwise
    } catch (error) {
      console.error("Authentication check failed:", error);
      this._isAuthChecking = false;
      return false;
    }
  }

  /**
   * @description Handles routing for the Single Page Application (SPA) within the WordPress admin.
   * If no hash is present or if the hash is not mapped in this.routes, redirects to '#let's-start'.
   * @returns {void}
   */
  handleRouting() {
    new Promise((resolve) => setTimeout(resolve, 5000));
    if (this._isAuthChecking) {
      return;
    }
    new Promise((resolve) => setTimeout(resolve, 5000));

    const fullHash = window.location.hash.substring(1);
    const [currentHash] = fullHash.split("?");
    const defaultHash = "start";
    const baseUrl = window.location.origin + window.location.pathname + window.location.search;

    if (!currentHash || !this.routes[currentHash]) {
      window.location.replace(`${baseUrl}#${defaultHash}`);
      return;
    }
    this.renderPage(currentHash);
  }

  /**
   * @description Renders the appropriate web component based on the current hash.
   * @param {string} path The path from the URL hash.
   * @returns {void}
   */
  renderPage(path) {
    const tagName = this.routes[path] || this.routes[""];
    const currentPage = this.shadowRoot.querySelector("#page");
    if (currentPage) {
      currentPage.remove();
    }

    if (tagName) {
      const page = document.createElement(tagName);
      page.id = "page";
      this.shadowRoot.appendChild(page);
    } else {
      const notFoundElement = document.createElement("p");
      notFoundElement.id = "page";
      notFoundElement.textContent = "Page not found.";
      this.shadowRoot.appendChild(notFoundElement);
    }
  }

  /**
   * @description Handles navigation clicks within the SPA.
   * @param {Event} event The click event.
   * @returns {void}
   */
  handleNavigationClick(event) {
    const target = event.target;
    if (target.matches("[data-owp-navigate]")) {
      event.preventDefault();
      const page = target.getAttribute("data-owp-navigate");
      window.location.hash = page;
    }
  }

  /**
   * @private
   * @description Ensures the plan selector modal exists in the shadow DOM.
   * If it has been removed, it will be re-created and appended.
   * @returns {void}
   */
  _ensurePlanSelectorExists() {
    if (!this.shadowRoot.querySelector("owp-plan-selector")) {
      const planSelector = document.createElement("owp-plan-selector");
      this.shadowRoot.appendChild(planSelector);
      this._planSelector = planSelector;
    }
  }
}

/**
 * @class OwpSessionManager
 * @description Manages the 'owp_payload' in sessionStorage, providing methods for initialization, retrieval, and updates.
 */
class OwpSessionManager {
  /**
   * @private
   * @type {string}
   * @description The key for the sessionStorage variable.
   */
  #payloadKey = "owp_payload";

  /**
   * @private
   * @type {Object}
   * @description The default structure for the owp_payload.
   */
  #defaultPayload = {
    start: {
      name: null,
      business: null,
      language: null,
    },
    describe: null,
    contact: {
      email: null,
      address: null,
      phone: null,
    },
    pictures: {
      selected: [],
      default: [],
      merge: [],
    },
    design: {
      template: null,
      font: null,
      palette: null,
    },
  };

  /**
   * @description Constructs the OwpSessionManager instance.
   * Initializes the payload from sessionStorage or sets a default.
   * @returns {void}
   */
  constructor() {
    this.#initializePayload();
  }

  /**
   * @private
   * @description Initializes the owp_payload in sessionStorage.
   * If it doesn't exist or is invalid, it sets the default structure.
   * @returns {void}
   */
  #initializePayload() {
    try {
      const storedPayload = sessionStorage.getItem(this.#payloadKey);
      if (storedPayload) {
        const parsedPayload = JSON.parse(storedPayload);
        // Merge with default to ensure all keys exist, especially if structure changes
        this.setPayload({ ...this.#defaultPayload, ...parsedPayload });
      } else {
        this.setPayload(this.#defaultPayload);
      }
    } catch (error) {
      console.error("Error parsing owp_payload from sessionStorage, resetting:", error);
      this.setPayload(this.#defaultPayload);
    }
  }

  /**
   * @description Retrieves the current owp_payload from sessionStorage.
   * @returns {Object} The current owp_payload.
   */
  getPayload() {
    try {
      const storedPayload = sessionStorage.getItem(this.#payloadKey);
      return storedPayload ? JSON.parse(storedPayload) : this.#defaultPayload;
    } catch (error) {
      console.error("Error retrieving owp_payload from sessionStorage:", error);
      return this.#defaultPayload;
    }
  }

  /**
   * @description Sets the entire owp_payload in sessionStorage.
   * @param {Object} payload - The new payload object to save.
   * @returns {void}
   */
  setPayload(payload) {
    try {
      sessionStorage.setItem(this.#payloadKey, JSON.stringify(payload));
    } catch (error) {
      console.error("Error saving owp_payload to sessionStorage:", error);
    }
  }

  /**
   * @description Updates a specific section of the owp_payload.
   * @param {string} section - The top-level key to update (e.g., 'start', 'describe', 'contact', 'pictures').
   * @param {any} data - The data to set for that section.
   * @returns {void}
   */
  updatePayloadSection(section, data) {
    const currentPayload = this.getPayload();
    currentPayload[section] = data;
    this.setPayload(currentPayload);
  }

  checkPayloadStatus() {
    const currentPayload = window.owpSessionManager.getPayload();
    const statusPayload = {};

    statusPayload.start =
      currentPayload.start.name === null ||
      currentPayload.start.business === null ||
      currentPayload.start.language === null
        ? false
        : true;

    statusPayload.describe = currentPayload.describe === null ? false : true;

    statusPayload.contact =
      currentPayload.contact.email === null ||
      currentPayload.contact.address === null ||
      currentPayload.contact.phone === null
        ? false
        : true;

    statusPayload.pictures =
      currentPayload.pictures.default.length === 0 || currentPayload.pictures.selected.length === 0
        ? false
        : true;

    statusPayload.design =
      currentPayload.design.template === null ||
      currentPayload.design.font === null ||
      currentPayload.design.palette === null
        ? false
        : true;

    return statusPayload;
  }
}

window.owpSessionManager = new OwpSessionManager();
window.cookieName = "CqD1plTkmEVPayc0GvR4qQ";
customElements.define("owp-app", OwpApp);
