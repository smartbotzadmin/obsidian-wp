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
            <div class="h-full overflow-y-auto p-4 bg-gray-100">
                <div class="flex flex-col items-center justify-center h-full text-center text-gray-600">
                    <img src="${window.location.origin}/wp-content/plugins/owp/assets/icons/wand-sparkles.svg" alt="Sparkles" class="h-12 w-12 mb-4" />
                    <p class="text-lg font-semibold mb-2">Hi there! I'm here to assist you.</p>
                    <p class="text-sm">Choose a prompt below or write on your own.</p>
                    <p class="text-sm">Ask me about what you need.</p>
                </div>
                <!-- Message history will be appended here -->
            </div>
        `;
    }
}


customElements.define('owp-sidebar-chat', OwpSidebarChat);