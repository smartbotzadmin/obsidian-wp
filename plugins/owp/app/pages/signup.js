/**
 * @class OwpSignup
 * @augments HTMLElement
 * @description Web component for the signup page.
 */
class OwpSignup extends HTMLElement {
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
    console.log(window.cookieName)
    this.className = `flex justify-center items-center h-screen`;
    this.innerHTML = /*html*/`
      <div class="w-[400px] bg-slate-950 p-8 rounded-3xl border border-slate-700">
        <h2 class="text-3xl font-bold mb-8 text-slate-100 text-center">Sign Up</h2>
        <form id="signupForm">
          <div class="mb-4">
            <label for="email" class="block text-slate-300 text-sm font-semibold mb-2">Email</label>
            <input type="email" id="email" name="email" class="shadow appearance-none border border-slate-700 rounded-xl w-full h-11 px-3 text-slate-300 text-md bg-slate-900 leading-tight transition-all duration-300 ease-in-out ring ring-0 ring-transparent outline-none hover:ring-1 hover:ring-cyan-500 focus:ring-2 focus:ring-cyan-500" placeholder="Enter your email" required>
          </div>
          <div class="mb-4">
            <label for="username" class="block text-slate-300 text-sm font-semibold mb-2">Username</label>
            <input type="text" id="username" name="username" class="shadow appearance-none border border-slate-700 rounded-xl w-full h-11 px-3 text-slate-300 text-md bg-slate-900 leading-tight transition-all duration-300 ease-in-out ring ring-0 ring-transparent outline-none hover:ring-1 hover:ring-cyan-500 focus:ring-2 focus:ring-cyan-500" placeholder="Choose a username" required>
          </div>
          <div class="mb-6">
            <label for="password" class="block text-slate-300 text-sm font-semibold mb-2">Password</label>
            <input type="password" id="password" name="password" class="shadow appearance-none border border-slate-700 rounded-xl w-full h-11 px-3 text-slate-300 text-md bg-slate-900 leading-tight transition-all duration-300 ease-in-out ring ring-0 ring-transparent outline-none hover:ring-1 hover:ring-cyan-500 focus:ring-2 focus:ring-cyan-500" placeholder="Create a password" required>
          </div>
          <div class="flex items-center justify-between">
            <button type="submit" class="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out">
              Sign Up
            </button>
            <a href="#signin" class="inline-block align-baseline font-bold text-sm text-cyan-500 hover:text-cyan-800">
              Already have an account? Sign In
            </a>
          </div>
          <div id="signupMessage" class="mt-4 text-center text-sm font-semibold"></div>
        </form>
      </div>
    `;

    this.querySelector('#signupForm').addEventListener('submit', this.#handleSignup.bind(this));
  }

  /**
   * @description Called when the element is removed from the document's DOM.
   * @returns {void}
   */
  disconnectedCallback() {
    this.querySelector('#signupForm').removeEventListener('submit', this.#handleSignup.bind(this));
  }

  /**
   * @private
   * @description Handles the signup form submission.
   * @param {Event} event - The submit event.
   * @returns {void}
   */
  async #handleSignup(event) {
    event.preventDefault();
    const email = this.querySelector('#email').value;
    const username = this.querySelector('#username').value;
    const password = this.querySelector('#password').value;
    const messageElement = this.querySelector('#signupMessage');

    try {
      const response = await fetch('https://obsidian-signup-313065021854.us-east1.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        messageElement.textContent = data.message;
        messageElement.className = 'mt-4 text-center text-sm font-semibold text-green-500';
        this.querySelector('#signupForm').reset();
      } else {
        messageElement.textContent = data.error || data;
        messageElement.className = 'mt-4 text-center text-sm font-semibold text-red-500';
      }
    } catch (error) {
      console.error('Signup Error:', error);
      messageElement.textContent = 'An unexpected error occurred.';
      messageElement.className = 'mt-4 text-center text-sm font-semibold text-red-500';
    }
  }
}

customElements.define('owp-signup', OwpSignup);