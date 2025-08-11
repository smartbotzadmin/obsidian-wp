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
            <button class="flex items-center gap-2 text-slate-100 hover:text-cyan-400 font-semibold cursor-pointer p-2">
                <img src="/wp-content/plugins/owp/assets/icons/wand-sparkles-dark.svg"/>
                Write Using AI
            </button>
        `;
    }
}

customElements.define('owp-describe-ai-button', OwpDescribeAiButton);