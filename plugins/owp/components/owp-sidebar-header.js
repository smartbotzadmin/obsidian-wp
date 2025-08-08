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
            <div class="flex items-center justify-between p-4 h-[64px] border-b border-gray-200">
                <button id="returnButton" class="text-gray-500 hover:text-gray-700 focus:outline-none">
                    <img class="h-8 w-8 p-1 bg-gray-400 rounded-full cursor-pointer" src="${window.location.origin}/wp-content/plugins/owp/assets/icons/arrow-right.svg" alt="Return" />
                </button>
                <h2 class="flex-1 text-xl text-center font-semibold text-gray-600">AI ObsidianWP</h2>
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