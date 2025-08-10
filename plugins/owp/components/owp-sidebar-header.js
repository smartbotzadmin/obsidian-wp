/**
 * @class OwpSidebarHeader
 * @augments HTMLElement
 * @description Web component for the sidebar header, including a back button and title.
 */
class OwpSidebarHeader extends HTMLElement {
    /**
     * @description Constructs the OwpSidebarHeader instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.innerHTML = `
            <div class="flex items-center justify-between p-4 h-[64px] border-b border-slate-700 bg-slate-800">
                <button id="returnButton">
                    <img class="h-8 w-8 p-1 bg-slate-600 hover:bg-slate-500 rounded-full cursor-pointer" src="${window.location.origin}/wp-content/plugins/owp/assets/icons/arrow-right.svg" alt="Return" />
                </button>
                <h2 class="flex-1 text-xl text-center font-semibold text-slate-100 cursor-default">AI ObsidianWP</h2>
                <img class="w-8" src="/wp-content/plugins/owp/assets/icons/obsidian-logo.png" /> <!-- alignment placeholder -->
            </div>
        `;
        this.returnButton = this.querySelector('#returnButton');
        this.returnButton.addEventListener('click', () => {
            const sidebar = document.querySelector('owp-sidebar');
            if (sidebar && typeof sidebar.toggleSidebar === 'function') {
                sidebar.toggleSidebar();
            }
        });
    }
}


customElements.define('owp-sidebar-header', OwpSidebarHeader);