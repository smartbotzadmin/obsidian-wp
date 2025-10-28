/**
 * @class OwpSignin
 * @augments HTMLElement
 * @description Web component for the signin page.
 */
class OwpSignin extends HTMLElement {
  /**
   * @description Constructs the OwpSignin instance.
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
          Sign In
        </h2>

        <form id="signinForm" class="flex flex-col gap-2">

          <label for="login" class="text-slate-300 text-sm font-semibold">
            Email or Username
          </label>
          <input
            type="text"
            id="login"
            name="login"
            class="shadow appearance-none border border-slate-700 rounded-xl w-full h-11 px-3 text-slate-300 text-md bg-slate-900 leading-tight transition-all duration-300 ease-in-out ring ring-0 ring-transparent outline-none hover:ring-1 hover:ring-cyan-500 focus:ring-2 focus:ring-cyan-500 mb-6"
            placeholder="Enter your email or username"
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
            placeholder="Enter your password"
            required
            autocomplete="current-password"
          >

          <div class="flex items-center justify-between">
            <button id="signinButton" type="submit" class="w-24 h-11 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-md py-2 px-4 flex justify-center rounded-xl focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out cursor-pointer">
              Sign In
            </button>
            <div class="flex gap-2 items-center justify-center ">
              <span class="text-sm font-semibold text-slate-300 cursor-default">
                Don't have an account?
              </span>
              <a href="#signup" class="text-sm font-bold text-cyan-500 hover:text-cyan-800 cursor-pointer transition-all">
              Sign Up
              </a>
            </div>
          </div>

          <div id="signinMessage" class="h-5"></div>

        </form>
      </div>
    `;
    this.querySelector("#signinForm").addEventListener("submit", this.#handleSignin.bind(this));
  }

  /**
   * @description Called when the element is removed from the document's DOM.
   * @returns {void}
   */
  disconnectedCallback() {
    this.querySelector("#signinForm").removeEventListener("submit", this.#handleSignin.bind(this));
  }

  /**
   * @private
   * @description Handles the signin form submission.
   * @param {Event} event - The submit event.
   * @returns {void}
   */
  async #handleSignin(event) {
    event.preventDefault();
    const login = this.querySelector("#login").value;
    const password = this.querySelector("#password").value;
    const messageElement = this.querySelector("#signinMessage");
    const signinButton = this.querySelector("#signinButton");

    signinButton.innerHTML = /*html*/ `
      <img src="/wp-content/plugins/owp/assets/icons/loader.svg" class="animate-spin" />
    `;

    try {
      const response = await fetch("https://obsidian-signin-313065021854.us-east1.run.app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem(window.cookieName, data.token);
        messageElement.textContent = "Signed in successfully!";
        messageElement.className = "h-5 text-center text-sm font-medium text-green-500";
        setTimeout(() => {
          window.location.hash = "start";
          signinButton.innerHTML = /*html*/ `Sign In`;
        }, 1000);
      } else {
        messageElement.textContent = data.error || data;
        messageElement.className = "h-5 text-center text-sm font-medium text-red-500";
        signinButton.innerHTML = /*html*/ `Sign In`;
      }
    } catch (error) {
      console.error("Signin Error:", error);
      messageElement.textContent = "An unexpected error occurred.";
      messageElement.className = "h-5 text-center text-sm font-medium text-red-500";
      signinButton.innerHTML = /*html*/ `Sign In`;
    }
  }
}

customElements.define("owp-signin", OwpSignin);
