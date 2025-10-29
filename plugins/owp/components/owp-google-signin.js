/**
 * @class OwpGoogleSignin
 * @augments HTMLElement
 * @description Web component for the Google Sign-in button.
 */
class OwpGoogleSignin extends HTMLElement {
  #channel = null;

  /**
   * @description Constructs the OwpGoogleSignin instance.
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
    this.innerHTML = /*html*/ `
      <button id="googleSigninButton" class="w-full h-11 bg-transparent hover:bg-slate-900 border border-slate-700 text-white font-semibold text-md py-2 px-4 flex justify-center items-center gap-2 rounded-xl focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out cursor-pointer">
        <img src="/wp-content/plugins/owp/assets/icons/google-icon.svg" class="w-5 h-5" />
        Sign in with Google
      </button>
    `;

    this.querySelector("#googleSigninButton").addEventListener(
      "click",
      this.#handleGoogleSignin.bind(this),
    );
  }

  /**
   * @description Called when the element is removed from the document's DOM.
   * @returns {void}
   */
  disconnectedCallback() {
    this.querySelector("#googleSigninButton").removeEventListener(
      "click",
      this.#handleGoogleSignin.bind(this),
    );
    if (this.#channel) {
      this.#channel.close();
    }
  }

  /**
   * @private
   * @description Handles the Google sign-in process.
   * @returns {void}
   */
  #handleGoogleSignin() {
    const width = 600;
    const height = 600;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;
    const url = "https://obsidian-google-oauth-authorization-313065021854.us-east1.run.app";

    const baseUrl = window.location.origin + window.location.pathname + window.location.search;
    const redirectUrl = baseUrl + "#google-signin-redirect";
    const state = btoa(redirectUrl);

    window.open(
      url + `?state=${state}`,
      "google-signin",
      `popup,width=${width},height=${height},left=${left},top=${top}`,
    );

    this.#channel = new BroadcastChannel("google-signin-result");
    this.#channel.onmessage = (event) => {
      this.dispatchEvent(
        new CustomEvent("google-signin-result", {
          detail: event.data,
          bubbles: true,
          composed: true,
        }),
      );
      this.#channel.close();
      this.#channel = null;
    };
  }
}

customElements.define("owp-google-signin", OwpGoogleSignin);
