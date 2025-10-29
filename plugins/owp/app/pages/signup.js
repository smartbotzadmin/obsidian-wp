/**
 * @class OwpSignup
 * @augments HTMLElement
 * @description Web component for the signup page.
 */
class OwpSignup extends HTMLElement {
  #boundGoogleHandler = null;

  /**
   * @description Constructs the OwpSignup instance.
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
      <div class="w-[500px] bg-slate-950 p-8 flex flex-col rounded-3xl border border-slate-700">
        <h2 class="text-3xl font-bold mb-10 text-slate-100 text-center">
          Sign Up
        </h2>

        <form id="signupForm" class="flex flex-col gap-2">

          <label for="email" class="text-slate-300 text-sm font-semibold">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            class="shadow appearance-none border border-slate-700 rounded-xl w-full h-11 px-3 text-slate-300 text-md bg-slate-900 leading-tight transition-all duration-300 ease-in-out ring ring-0 ring-transparent outline-none hover:ring-1 hover:ring-cyan-500 focus:ring-2 focus:ring-cyan-500 mb-6"
            placeholder="Enter your email"
            required
            autocomplete="email"
          >

          <label for="username" class="text-slate-300 text-sm font-semibold">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            class="shadow appearance-none border border-slate-700 rounded-xl w-full h-11 px-3 text-slate-300 text-md bg-slate-900 leading-tight transition-all duration-300 ease-in-out ring ring-0 ring-transparent outline-none hover:ring-1 hover:ring-cyan-500 focus:ring-2 focus:ring-cyan-500 mb-6"
            placeholder="Choose a username"
            required
            autocomplete="username"
          >

          <label for="password" class="text-slate-300 text-sm font-semibold">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            class="shadow appearance-none border border-slate-700 rounded-xl w-full h-11 px-3 text-slate-300 text-md bg-slate-900 leading-tight transition-all duration-300 ease-in-out ring ring-0 ring-transparent outline-none hover:ring-1 hover:ring-cyan-500 focus:ring-2 focus:ring-cyan-500 mb-6"
            placeholder="Create a password"
            required
            autocomplete="new-password"
          >

          <div class="flex items-center justify-between">
            <button id="signupButton" type="submit" class="w-24 h-11 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-md py-2 px-4 flex justify-center rounded-xl focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out cursor-pointer">
              Sign Up
            </button>
            <div class="flex gap-2 items-center justify-center ">
              <span class="text-sm font-semibold text-slate-300 cursor-default">
                Already have an account?
              </span>
              <a href="#signin" class="text-sm font-bold text-cyan-500 hover:text-cyan-800 cursor-pointer transition-all">
                Sign In
              </a>
            </div>
          </div>

          <div id="signupMessage" class="h-5"></div>
        </form>

        <div class="relative py-4">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-slate-700"></div>
          </div>
          <div class="relative flex justify-center">
            <span class="bg-slate-950 px-4 text-sm text-slate-400">
              Or
            </span>
          </div>
        </div>

        <owp-google-signin></owp-google-signin>

      </div>
    `;

    this.querySelector("#signupForm").addEventListener("submit", this.#handleSignup.bind(this));
    this.querySelector("owp-google-signin").addEventListener(
      "google-signin-result",
      this.#handleGoogleSigninResult.bind(this),
    );
  }

  /**
   * @description Called when the element is removed from the document's DOM.
   * @returns {void}
   */
  disconnectedCallback() {
    this.querySelector("#signupForm").removeEventListener("submit", this.#handleSignup.bind(this));
    this.querySelector("owp-google-signin").removeEventListener(
      "google-signin-result",
      this.#handleGoogleSigninResult.bind(this),
    );
  }

  /**
   * @private
   * @description Handles the signup form submission.
   * @param {Event} event - The submit event.
   * @returns {void}
   */
  async #handleSignup(event) {
    event.preventDefault();
    const email = this.querySelector("#email").value;
    const username = this.querySelector("#username").value;
    const password = this.querySelector("#password").value;
    const messageElement = this.querySelector("#signupMessage");
    const signupButton = this.querySelector("#signupButton");

    signupButton.innerHTML = /*html*/ `
      <img src="/wp-content/plugins/owp/assets/icons/loader.svg" class="animate-spin" />
    `;

    try {
      const response = await fetch("https://obsidian-signup-313065021854.us-east1.run.app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        messageElement.textContent = data.message;
        messageElement.className = "h-5 text-center text-sm font-semibold text-green-500";
        setTimeout(() => {
          window.location.hash = "signin";
          this.querySelector("#signupForm").reset();
          signupButton.innerHTML = /*html*/ `Sign Up`;
        }, 1000);
      } else {
        messageElement.textContent = data.error || data;
        messageElement.className = "h-5 text-center text-sm font-semibold text-red-500";
        signupButton.innerHTML = /*html*/ `Sign Up`;
      }
    } catch (error) {
      console.error("Signup Error:", error);
      messageElement.textContent = "An unexpected error occurred.";
      messageElement.className = "h-5 text-center text-sm font-semibold text-red-500";
      signupButton.innerHTML = /*html*/ `Sign Up`;
    }
  }

  /**
   * @private
   * @description Handles the result from the Google Sign-in component.
   * @param {CustomEvent} event - The event carrying the result status.
   * @returns {void}
   */
  #handleGoogleSigninResult(event) {
    const messageElement = this.querySelector("#signupMessage");

    if (event.detail.status === "success" && event.detail.token) {
      localStorage.setItem(window.cookieName, event.detail.token);
      messageElement.textContent = "Signed in successfully!";
      messageElement.className = "h-5 text-center text-sm font-semibold text-green-500";
      setTimeout(() => {
        window.location.hash = "start";
      }, 1000);
    } else {
      messageElement.textContent = "Google sign-up failed. Please try again.";
      messageElement.className = "h-5 text-center text-sm font-semibold text-red-500";
    }
  }
}

customElements.define("owp-signup", OwpSignup);
