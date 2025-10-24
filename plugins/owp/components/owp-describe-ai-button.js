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
            <button id="writeAiButton" class="flex items-center gap-2 text-slate-100 hover:text-cyan-400 font-semibold cursor-pointer p-2 rounded-xl transition-all duration-300 outline outline-transparent hover:outline-cyan-500 hover:outline-1 focus:outline-cyan-500 focus:outline-2">
                <img src="/wp-content/plugins/owp/assets/icons/wand-sparkles-dark.svg"/>
                Write Using AI
            </button>
        `;
        this.writeAiButton = this.querySelector('#writeAiButton');
    }


    /**
     * @description Called when the element is added to the document's DOM.
     * @returns {void}
     */
    connectedCallback() {
        this.writeAiButton.addEventListener('click', this.#handleWriteAiClick.bind(this));
    }


    /**
     * @description Called when the element is removed from the document's DOM.
     * @returns {void}
     */
    disconnectedCallback() {
        this.writeAiButton.removeEventListener('click', this.#handleWriteAiClick.bind(this));
    }


    /**
     * @private
     * @description Handles the click event for the "Write Using AI" button,
     *              makes an API call, and dispatches the response.
     * @returns {void}
     */
    async #handleWriteAiClick() {
        this.writeAiButton.disabled = true;
        this.writeAiButton.classList.add('opacity-50', 'cursor-not-allowed');

        try {
            const payload = window.owpSessionManager.getPayload();
            const { name, business, language } = payload.start;

            const token = localStorage.getItem(window.cookieName);
            const response = await fetch('https://obsidian-describe-generator-313065021854.us-east1.run.app', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, business, language: language.toUpperCase() }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            window.dispatchEvent(new CustomEvent('ai-text-generated', {
                detail: { text: data.content }
            }));

        } catch (error) {
            console.error('Error fetching AI description:', error);
        } finally {
            this.writeAiButton.disabled = false;
            this.writeAiButton.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }
}

customElements.define('owp-describe-ai-button', OwpDescribeAiButton);