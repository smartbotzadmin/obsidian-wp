/**
 * @class OwpTopbarLogo
 * @augments HTMLElement
 * @description Web component for the OWP logo in the top bar.
 */
class OwpTopbarLogo extends HTMLElement {
	/**
	 * @description Constructs the OwpTopBarLogo instance.
	 * @returns {void}
	 */
	constructor() {
		super();
		this.classList = `w-40 h-10 flex items-center gap-4`;
		this.innerHTML = /*html*/`
			<img src="${window.location.origin}/wp-content/plugins/owp/assets/icons/obsidian-logo.png" alt="OWP Logo" class="h-8 w-auto">
			<span class="font-gold font-bold text-gray-100 text-lg cursor-default select-none">OBSIDIAN</span>
		`;
	}


	/**
	 * @description Called when the element is added to the document's DOM.
	 * @returns {void}
	 */
	connectedCallback() {
		// No specific logic needed on connection for this component.
	}


	/**
	 * @description Called when the element is removed from the document's DOM.
	 * @returns {void}
	 */
	disconnectedCallback() {
		// No specific cleanup needed for this component.
	}
}

customElements.define('owp-topbar-logo', OwpTopbarLogo);