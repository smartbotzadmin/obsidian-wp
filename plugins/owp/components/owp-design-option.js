/**
 * @class OwpDesignOption
 * @augments HTMLElement
 * @description Web component for a single design option in the design grid.
 */
class OwpDesignOption extends HTMLElement {
    /**
     * @description Constructs the OwpDesignOption instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.innerHTML = `
            <div class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200">
                <div class="relative bg-gray-200 aspect-video flex items-center justify-center text-gray-500">
                    <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span class="absolute top-2 right-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">PREMIUM</span>
                </div>
                <div class="p-4">
                    <h3 class="font-semibold text-lg mb-2">Innovative Marketing Solutions for Your Business</h3>
                    <p class="text-gray-600 text-sm mb-4">We will write a persuasive introduction for you or your company. This can be about your products, offerings, or simply why you exist.</p>
                    <div class="flex justify-between items-center">
                        <span class="text-blue-600 text-sm font-medium">Option ${this.getAttribute('option-number') || '1'}</span>
                        <div class="flex items-center space-x-2">
                            <a href="#" class="text-gray-500 hover:text-gray-700">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                            </a>
                            <a href="#" class="text-gray-500 hover:text-gray-700">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * @description Observes changes to the 'option-number' attribute.
     * @returns {Array<string>} The observed attributes.
     */
    static get observedAttributes() {
        return ['option-number'];
    }

    /**
     * @description Handles changes to observed attributes.
     * @param {string} name - The name of the attribute.
     * @param {string} oldVal - The old value of the attribute.
     * @param {string} newVal - The new value of the attribute.
     * @returns {void}
     */
    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'option-number' && oldVal !== newVal) {
            this.querySelector('.text-blue-600').textContent = `Option ${newVal}`;
        }
    }
}

customElements.define('owp-design-option', OwpDesignOption);