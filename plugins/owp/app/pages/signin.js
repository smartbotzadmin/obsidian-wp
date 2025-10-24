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
    this.innerHTML = /*html*/`
      <div class="w-[400px] bg-slate-950 p-8 rounded-3xl border border-slate-700">
        <h2 class="text-3xl font-bold mb-8 text-slate-100 text-center">Sign In</h2>
        <form id="signinForm">
          <div class="mb-4">
            <label for="login" class="block text-slate-300 text-sm font-semibold mb-2">Email or Username</label>
            <input type="text" id="login" name="login" class="shadow appearance-none border border-slate-700 rounded-xl w-full h-11 px-3 text-slate-300 text-md bg-slate-900 leading-tight transition-all duration-300 ease-in-out ring ring-0 ring-transparent outline-none hover:ring-1 hover:ring-cyan-500 focus:ring-2 focus:ring-cyan-500" placeholder="Enter your email or username" required>
          </div>
          <div class="mb-6">
            <label for="password" class="block text-slate-300 text-sm font-semibold mb-2">Password</label>
            <input type="password" id="password" name="password" class="shadow appearance-none border border-slate-700 rounded-xl w-full h-11 px-3 text-slate-300 text-md bg-slate-900 leading-tight transition-all duration-300 ease-in-out ring ring-0 ring-transparent outline-none hover:ring-1 hover:ring-cyan-500 focus:ring-2 focus:ring-cyan-500" placeholder="Enter your password" required>
          </div>
          <div class="flex items-center justify-between">
            <button type="submit" class="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out">
              Sign In
            </button>
            <a href="#signup" class="inline-block align-baseline font-bold text-sm text-cyan-500 hover:text-cyan-800">
              Don't have an account? Sign Up
            </a>
          </div>
          <div id="signinMessage" class="mt-4 text-center text-sm font-semibold"></div>
        </form>
      </div>
    `;
    this.querySelector('#signinForm').addEventListener('submit', this.#handleSignin.bind(this));
  }

  /**
   * @description Called when the element is removed from the document's DOM.
   * @returns {void}
   */
  disconnectedCallback() {
    this.querySelector('#signinForm').removeEventListener('submit', this.#handleSignin.bind(this));
  }

  /**
   * @private
   * @description Handles the signin form submission.
   * @param {Event} event - The submit event.
   * @returns {void}
   */
  async #handleSignin(event) {
    event.preventDefault();
    const login = this.querySelector('#login').value;
    const password = this.querySelector('#password').value;
    const messageElement = this.querySelector('#signinMessage');

    try {
      const response = await fetch('https://obsidian-signin-313065021854.us-east1.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('owp_auth_token', data.token);
        messageElement.textContent = 'Signed in successfully!';
        messageElement.className = 'mt-4 text-center text-sm font-semibold text-green-500';
        // Redirect or update UI as needed
      } else {
        messageElement.textContent = data.error || data;
        messageElement.className = 'mt-4 text-center text-sm font-semibold text-red-500';
      }
    } catch (error) {
      console.error('Signin Error:', error);
      messageElement.textContent = 'An unexpected error occurred.';
      messageElement.className = 'mt-4 text-center text-sm font-semibold text-red-500';
    }
  }
}

customElements.define('owp-signin', OwpSignin);