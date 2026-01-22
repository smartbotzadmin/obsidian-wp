/**
 * @class ObsiaGoogleSigninRedirect
 * @augments HTMLElement
 * @description Web component to handle the Google Sign-in redirect.
 */
class ObsiaGoogleSigninRedirect extends HTMLElement {
  /**
   * @description Constructs the ObsiaGoogleSigninRedirect instance.
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
    this.className = `flex justify-center items-center h-screen`;
    this.innerHTML = /*html*/ `
      <div class="w-[500px] bg-slate-950 p-8 flex flex-col rounded-3xl border border-slate-700 text-center">
        <h2 class="text-3xl font-bold mb-10 text-slate-100">
          Processing Sign-In
        </h2>
        <p class="text-slate-300">
          This window should close automatically. If it doesn't, please close it manually.
        </p>
      </div>
    `;
    this.#processRedirect();
  }

  /**
   * @private
   * @description Processes the redirect, communicates the result, and closes the window.
   * @returns {void}
   */
  #processRedirect() {
    const fullHash = window.location.hash.substring(1);
    const queryString = fullHash.split("?")[1] || "";
    const searchParams = new URLSearchParams(queryString);
    const success = searchParams.get("success") === "true";
    const token = searchParams.get("token");

    const channel = new BroadcastChannel("google-signin-result");

    if (success && token) {
      channel.postMessage({ status: "success", token: token });
    } else {
      channel.postMessage({ status: "failed" });
    }

    channel.close();

    window.close();
  }
}

customElements.define("obsia-google-signin-redirect", ObsiaGoogleSigninRedirect);
