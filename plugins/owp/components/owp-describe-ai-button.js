/**
 * @class OwpDescribeAiButton
 * @augments HTMLElement
 * @description Web component for the "Write Using AI" button.
 */
class OwpDescribeAiButton extends HTMLElement {
    /**
     * @description Constructs the OwpDescribeAiButton instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.innerHTML = `
            <button class="flex items-center text-blue-600 font-semibold">
                <img class="pr-2" src="${window.location.origin}/wp-content/plugins/owp/assets/icons/wand-sparkles.svg"/>
                Write Using AI
            </button>
        `;
    }
}

customElements.define('owp-describe-ai-button', OwpDescribeAiButton);