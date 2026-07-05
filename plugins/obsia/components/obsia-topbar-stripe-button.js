/**
 * @class ObsiaTopbarStripeButton
 * @augments HTMLElement
 * @description Web component for checking Stripe subscription status and providing a subscribe button.
 */
class ObsiaTopbarStripeButton extends HTMLElement {
  boundHandleHashChange = null;
  /**
   * @description Constructs the ObsiaTopbarStripeButton instance.
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
    this.classList = "absolute right-40 flex";
    this.boundHandleHashChange = this.#handleHashChange.bind(this);
    window.addEventListener("hashchange", this.boundHandleHashChange);
    // Initial check on load
    this.boundHandleHashChange({
      newURL: window.location.href,
      oldURL: "", // Simulate coming from nowhere
    });
  }

  /**
   * @description Called when the element is removed from the document's DOM.
   * @returns {void}
   */
  disconnectedCallback() {
    window.removeEventListener("hashchange", this.boundHandleHashChange);
  }

  /**
   * @private
   * @description Handles hash changes to determine if a status check is needed.
   * @param {HashChangeEvent} event - The hash change event.
   * @returns {void}
   */
  async #handleHashChange(event) {
    const oldHash = (event.oldURL.split("#")[1] || "").split("?")[0];
    const newHash = (event.newURL.split("#")[1] || "").split("?")[0];
    const authHashes = ["signin", "signup"];
    const isAuthPage = authHashes.includes(newHash);

    this.style.display = isAuthPage ? "none" : "";

    if (isAuthPage) {
      return;
    }

    const wasAuthPage = authHashes.includes(oldHash);
    const isInitialLoad = !event.oldURL;

    if (isInitialLoad || wasAuthPage) {
      this.innerHTML = /*html*/ `<span class="text-white">Loading...</span>`;
      await this.#checkSubscriptionStatus();
    }
  }

  /**
   * @private
   * @description Checks the user's Stripe subscription status by calling the dedicated endpoint.
   * @returns {Promise<void>}
   */
  async #checkSubscriptionStatus() {
    const token = localStorage.getItem(window.cookieName);
    if (!token) {
      this.innerHTML = ""; // Don't show anything if not logged in
      return;
    }

    try {
      const response = await fetch("https://obsidian-stripe-status-313065021854.us-east1.run.app", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch subscription status");
      }

      const data = await response.json();
      this.#render(data.hasActiveSubscription);
    } catch (error) {
      console.error("Error checking subscription status:", error);
      this.innerHTML = `<span class="text-red-500">Error</span>`;
    }
  }

  /**
   * @private
   * @description Renders the component's content based on the subscription status.
   * @param {boolean} hasActiveSubscription - Whether the user has an active subscription.
   * @returns {void}
   */
  #render(hasActiveSubscription) {
    if (hasActiveSubscription) {
      this.innerHTML = `
      <span class="px-4 py-2 font-gold font-medium text-green-400 rounded-md ring-2 ring-green-600 cursor-default">
        Active
      </span>`;
    } else {
      this.innerHTML = `
      <button id="subscribe-button" class="px-4 py-2 font-gold bg-cyan-600 hover:bg-cyan-500 text-white rounded-md text-sm ring-2 ring-cyan-700 hover:ring-cyan-600 cursor-pointer transition-all">
        Subscribe
      </button>`;
      this.querySelector("#subscribe-button").addEventListener(
        "click",
        this.#handleSubscribeClick.bind(this),
      );
    }
  }

  /**
   * @private
   * @description Handles the click event for the 'Subscribe' button, initiating the Stripe checkout process.
   * @returns {Promise<void>}
   */
  async #handleSubscribeClick() {
    const button = this.querySelector("#subscribe-button");
    button.disabled = true;
    button.textContent = "Redirecting...";

    const token = localStorage.getItem(window.cookieName);
    if (!token) {
      window.location.hash = "signin";
      return;
    }

    try {
      const response = await fetch(
        "https://obsidian-stripe-checkout-313065021854.us-east1.run.app",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            origin: window.location.href.split("#")[0], // Send URL without the hash
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.status === "active") {
        // User is already subscribed, update the UI directly.
        this.#render(true);
      } else {
        // Fallback for unexpected responses
        button.disabled = false;
        button.textContent = "Subscribe";
      }
    } catch (error) {
      console.error("Error creating Stripe checkout session:", error);
      button.disabled = false;
      button.textContent = "Subscribe";
      this.insertAdjacentHTML("beforeend", `<span class="text-red-500 ml-2">Try again.</span>`);
    }
  }
}

customElements.define("obsia-topbar-stripe-button", ObsiaTopbarStripeButton);
