/**
 * @class ObsiaDescribe
 * @augments HTMLElement
 * @description Web component for the "Describe" page, integrating top bar and form components.
 */
class ObsiaDescribe extends HTMLElement {
  /**
   * @description Constructs the ObsiaDescribe instance.
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
            <div class="w-[800px] bg-slate-950 p-12 rounded-3xl border border-slate-700">
                <h2 class="text-3xl font-bold mb-12 text-slate-100">
                    What is <span class="underline--magical">${window.obsiaSessionManager.getPayload().start.name}</span>? Tell us more about the restaurant.
                </h2>
                <p class="text-lg text-slate-100 mb-12">
                    Please be as descriptive as you can. Share details such as a brief about the restaurant, specialty, menu, etc.
                </p>

                <obsia-describe-text-area class="mb-2"></obsia-describe-text-area>

                <div class="flex flex-row justify-between">
                    <obsia-back-button data-obsia-navigate="#let's-start">Back</obsia-back-button>
                    <obsia-next-button data-obsia-navigate="#contact">Next</obsia-next-button>
                </div>
            </div>
        `;
  }
}

customElements.define("obsia-describe", ObsiaDescribe);
