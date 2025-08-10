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
            <div class="p-4 border-t border-slate-700 bg-slate-800">
                <textarea class="w-full p-2 border border-slate-700 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-100 bg-slate-950" placeholder="How can I help you?" rows="3"></textarea>
                <div class="flex justify-between items-center mt-2 text-slate-100 text-sm cursor-default">
                    <span class="w-1/2 text-wrap text-xs">
                        AI Assistant can make mistakes. Please check the results.
                    </span>
                    <button class="flex items-center cursor-pointer">
                        <img class="p-2 bg-cyan-500 hover:bg-cyan-600 rounded-md" src="${window.location.origin}/wp-content/plugins/owp/assets/icons/send.svg" alt="Send" />
                    </button>
                </div>
            </div>
        `;
    }
}


customElements.define('owp-sidebar-input', OwpSidebarInput);