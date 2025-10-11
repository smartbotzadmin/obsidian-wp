/**
 * @class OwpSidebarChat
 * @augments HTMLElement
 * @description Web component for wrapping message history in the sidebar, including a welcome message and scrollable area.
 */
class OwpSidebarChat extends HTMLElement {
    /**
     * @description Constructs the OwpSidebarChat instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.innerHTML = `
            <div class="h-full overflow-y-auto p-2 bg-slate-950">
                <div class="flex flex-col items-center justify-center h-full text-center text-white">
                    <img src="${window.location.origin}/wp-content/plugins/owp/assets/icons/wand-sparkles-dark.svg" alt="Sparkles" class="h-12 w-12 mb-4" />
                    <p class="text-lg text-slate-100 font-semibold mb-2 cursor-default">Hi there! I'm here to assist you.</p>
                    <p class="text-sm text-slate-100 cursor-default">Choose a prompt below or write on your own.</p>
                    <p class="text-sm text-slate-100 cursor-default">Ask me about what you need.</p>
                </div>
                <!-- Message history will be appended here -->
            </div>
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


customElements.define('owp-sidebar-chat', OwpSidebarChat);