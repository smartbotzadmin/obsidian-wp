/**
 * @class OwpPlanSelector
 * @augments HTMLElement
 * @description Web component for displaying subscription plans in a modal.
 */
class OwpPlanSelector extends HTMLElement {
  /**
   * @description Constructs the OwpPlanSelector instance.
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
    this.className = `fixed inset-0 bg-black/80 flex justify-center items-center z-[1000] hidden`;
    this.innerHTML = /*html*/ `
      <div class="flex flex-col justify-center w-[960px] p-12 rounded-3xl bg-slate-950 border border-slate-700 text-slate-100">
        <h2 class="text-4xl font-bold mb-4 text-center">
          Upgrade Your Plan
        </h2>
        <p class="text-lg text-slate-300 mb-12 text-center">
          Your free trials have run out. Please select a plan to continue.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${this._createPlanCard({
            name: "Free",
            price: "$0",
            period: "/ month",
            buttonText: "Current Plan",
            buttonDisabled: true,
            features: ["2 Free basic website generation"],
          })}
          ${this._createPlanCard({
            name: "Pro",
            price: "$5",
            period: "/ mo",
            buttonText: "Upgrade to Pro",
            planId: "pro",
            highlight: true,
            features: ["Unlimited website generations", "Advanced customization", "Email support"],
          })}
          ${this._createPlanCard({
            name: "Business+",
            price: "Let's talk",
            period: "",
            buttonText: "Contact Us",
            planId: "business",
            features: [
              "For teams and agencies",
              "Custom features",
              "Dedicated support",
              "Volume discounts",
            ],
          })}
        </div>
      </div>
    `;

    this.querySelector(".grid").addEventListener("click", this._handlePlanSelection.bind(this));
    this.addEventListener("click", (e) => {
      if (e.target === this) {
        this.hide();
      }
    });
  }

  /**
   * @description Shows the modal.
   * @returns {void}
   */
  show() {
    if (this) {
      this.classList.remove("hidden");
    }
  }

  /**
   * @description Hides the modal.
   * @returns {void}
   */
  hide() {
    if (this) {
      this.classList.add("hidden");
    }
  }

  /**
   * @private
   * @description Creates the HTML for a single plan card.
   * @param {object} plan - The plan details.
   * @returns {string} The HTML string for the plan card.
   */
  _createPlanCard({
    name,
    price,
    period,
    buttonText,
    buttonDisabled = false,
    features = [],
    highlight = false,
    planId = "",
  }) {
    const highlightClasses = highlight
      ? "ring-2 ring-indigo-500 border-indigo-500"
      : "border-slate-700";
    const buttonClasses = buttonDisabled
      ? "bg-slate-700 text-slate-400 cursor-not-allowed"
      : planId === "business"
        ? "bg-blue-600 hover:bg-blue-700 text-white"
        : "bg-green-500 hover:bg-green-600 text-white";

    return /*html*/ `
      <div class="flex flex-col p-8 rounded-xl bg-slate-900 border ${highlightClasses}">
        <h3 class="text-2xl font-gold text-center mb-1">
          ${name}
        </h3>
        <div class="w-16 h-1 bg-orange-500 mx-auto mb-8"></div>
        <div class="flex justify-center items-center gap-2 mb-8">
          <p class="text-3xl font-semibold text-center">${price}</p>
          <p class="text-slate-300 text-center font-medium">${period}</p>
        </div>
        <button data-plan-id="${planId}" class="font-semibold py-3 px-4 rounded-xl text-md ${buttonClasses}" ${
          buttonDisabled ? "disabled" : ""
        }>
          ${buttonText}
        </button>
        <ul class="text-slate-300 mt-8 space-y-3 text-center">
          ${features.map((feature) => `<li>${feature}</li>`).join("")}
        </ul>
      </div>
    `;
  }

  /**
   * @private
   * @description Handles plan selection button clicks.
   * @param {Event} event - The click event.
   * @returns {void}
   */
  _handlePlanSelection(event) {
    const button = event.target.closest("button[data-plan-id]");
    if (!button || button.disabled) return;

    const planId = button.dataset.planId;
    if (planId === "pro") {
      // Placeholder for payment logic
      console.log("Pro plan selected. Redirecting to payment...");
    } else if (planId === "business") {
      this.hide();
      window.location.hash = "contact";
    }
  }
}

customElements.define("owp-plan-selector", OwpPlanSelector);
