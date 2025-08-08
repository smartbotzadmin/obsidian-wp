/**
 * @class OwpSidebarInput
 * @augments HTMLElement
 * @description Web component for the sidebar input, including a text area and send button.
 */
class OwpSidebarInput extends HTMLElement {
    /**
     * @description Constructs the OwpSidebarInput instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.innerHTML = `
            <div class="p-4 border-t border-gray-200">
                <textarea class="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="How can I help you?" rows="3"></textarea>
                <div class="flex justify-between items-center mt-2 text-gray-500 text-sm">
                    <span class="w-1/2 text-wrap">AI Assistant can make mistakes. Want to disable it?</span>
                    <button class="flex items-center text-blue-600 font-semibold">
                        <img class="p-2 bg-gray-200 hover:bg-gray-300 rounded-md" src="${window.location.origin}/wp-content/plugins/owp/assets/icons/send.svg" alt="Send" />
                    </button>
                </div>
            </div>
        `;
    }
}


customElements.define('owp-sidebar-input', OwpSidebarInput);