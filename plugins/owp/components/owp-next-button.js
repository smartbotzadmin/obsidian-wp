/**
 * @class OwpNextButton
 * @augments HTMLElement
 * @description Web component for a customizable next button with redirection functionality.
 */
class OwpNextButton extends HTMLElement {

  constructor() {
    super();
    this.className += ` relative`;
    this.innerHTML = /*html*/`
      <button id="nextButton" class="flex flex-row justify-center items-center gap-2 bg-cyan-600 hover:bg-cyan-500 p-4 h-11 rounded-md flex items-center cursor-pointer">
        <span class="text-slate-100 text-md font-semibold">
          ${this.innerHTML}
        </span>
        <img src="/wp-content/plugins/owp/assets/icons/arrow-right.svg"/>
      </button>
      <div id="popup" class="absolute p-2 -top-16 w-40 bg-red-600 rounded-md border border-red-700 outline outline-red-400 text-gray-100 font-semibold invisible">
        Please, complete the information
      </div>
    `;
  }

  /**
   * @description Observes changes to the 'redirect-to' attribute.
   * @returns {Array<string>} The observed attributes.
   */
  static get observedAttributes() {
    return ['data-owp-navigate'];
  }

  /**
   * @description Handles changes to observed attributes.
   * @param {string} name - The name of the attribute.
   * @param {string} oldVal - The old value of the attribute.
   * @param {string} newVal - The new value of the attribute.
   * @returns {void}
   */
  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'data-owp-navigate' && newVal) {
      this.querySelector('#nextButton').addEventListener('click', () => {
        const currentHash = window.location.hash.replace('#', '')
        const statusPayload = window.owpSessionManager.checkPayloadStatus()
        const isFilledCurrentStep = statusPayload[currentHash]
        if (isFilledCurrentStep) {
          window.location.hash = newVal;
        } else {
          this.querySelector('#popup').classList.remove('invisible')

          setTimeout(() => {
            this.querySelector('#popup').classList.add('invisible')
          }, 2000)
        }
      });
    }
  }
}

customElements.define('owp-next-button', OwpNextButton);