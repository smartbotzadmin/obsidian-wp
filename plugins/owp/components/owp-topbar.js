/**
 * @class OwpTopbar
 * @augments HTMLElement
 * @description Web component for the top navigation bar, including the logo, step indicator, and exit options.
 */
class OwpTopbar extends HTMLElement {
	steps = [
		{ name: "Start", page: "owp-start" },
		{ name: "Describe", page: "owp-describe" },
		{ name: "Contact", page: "owp-contact" },
		{ name: "Pictures", page: "owp-pictures" },
		{ name: "Design", page: "owp-design" }
	];
	navElement = null;
	boundHandleHashChange = null;


	/**
	 * @description Observes changes to the 'current-page' attribute.
	 * @returns {Array<string>} The observed attributes.
	 */
	static get observedAttributes() {
		return ['current-page'];
	}


	/**
	 * @description Constructs the OwpTopBar instance.
	 * @returns {void}
	 */
	constructor() {
		super();
		this.classList = `fixed top-0 right-0 left-0 flex items-center justify-between p-5`;
		this.innerHTML = /*html*/`
			<owp-topbar-logo></owp-topbar-logo>
			<div class="flex items-center justify-center">
				<nav class="flex items-center text-gray-600 font-semibold" id="step-navigation"></nav>
			</div>
			<owp-topbar-close-button></owp-topbar-close-button>
		`;
	}


	/**
	 * @description Called when the element is added to the document's DOM.
	 * @returns {void}
	 */
	connectedCallback() {
		this.navElement = this.querySelector('#step-navigation');
		this.boundHandleHashChange = this.#handleHashChange.bind(this);

		// Set initial current-page based on hash, which will trigger updateStepsHighlighting via attributeChangedCallback
		this.boundHandleHashChange();
		window.addEventListener('hashchange', this.boundHandleHashChange);
	}


	/**
	 * @description Called when the element is removed from the document's DOM.
	 * @returns {void}
	 */
	disconnectedCallback() {
		window.removeEventListener('hashchange', this.boundHandleHashChange);
	}


	/**
	 * @description Handles changes to observed attributes.
	 * @param {string} name - The name of the attribute.
	 * @param {string} oldVal - The old value of the attribute.
	 * @param {string} newVal - The new value of the attribute.
	 * @returns {void}
	 */
	attributeChangedCallback(name, oldVal, newVal) {
		if (name === 'current-page' && oldVal !== newVal) {
			this.#updateStepsHighlighting(newVal);
		}
	}


	/**
	 * @private
	 * @description Handles hash change event to update the current page.
	 * @returns {void}
	 */
	#handleHashChange() {
		const currentHash = window.location.hash.substring(1); // Remove '#'
		const currentPage = this.steps.find(step => step.name.toLowerCase().replace(/\s/g, '-') === currentHash)?.page;
		if (currentPage) {
			this.setAttribute('current-page', currentPage);
		}
	}


	/**
	 * @private
	 * @description Updates the highlighting of the steps based on the current URL.
	 * @param {string} currentPage - The current page slug.
	 * @returns {void}
	 */
	#updateStepsHighlighting(currentPage) {
		if (!this.navElement) {
			return;
		}

		const currentPageIndex = this.steps.findIndex(step => step.page === currentPage);

		// Clear existing steps to prevent duplicates on re-render
		this.navElement.innerHTML = '';

		this.steps.forEach((step, index) => {
			const isActive = index === currentPageIndex;
			const isCompleted = index < currentPageIndex;

			const stepElement = document.createElement('owp-topbar-step');
			stepElement.setAttribute('name', step.name);
			stepElement.setAttribute('page', step.page);

			if (isActive) {
				stepElement.setAttribute('is-active', '');
			} else {
				stepElement.removeAttribute('is-active');
			}

			if (isCompleted) {
				stepElement.setAttribute('is-completed', '');
			} else {
				stepElement.removeAttribute('is-completed');
			}
			this.navElement.appendChild(stepElement);

			if (index < this.steps.length - 1) {
				const separatorElement = document.createElement('owp-topbar-step-separator');
				if (isCompleted) {
					separatorElement.setAttribute('is-completed', '');
				} else {
					separatorElement.removeAttribute('is-completed');
				}
				if (index + 1 === currentPageIndex) {
					separatorElement.setAttribute('is-active', '');
				} else {
					separatorElement.removeAttribute('is-active');
				}
				this.navElement.appendChild(separatorElement);
			}
		});
	}
}

customElements.define('owp-topbar', OwpTopbar);