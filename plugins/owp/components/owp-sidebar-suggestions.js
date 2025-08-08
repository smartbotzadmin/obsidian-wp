/**
 * @class OwpSidebarSuggestions
 * @augments HTMLElement
 * @description Web component for displaying prompt suggestions in the sidebar.
 */
class OwpSidebarSuggestions extends HTMLElement {
    /**
     * @description Constructs the OwpSidebarSuggestions instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.innerHTML = `
            <div class="p-4 border-t border-gray-200 flex flex-wrap gap-2 bg-purple-50">
                <button class="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-3 py-1 rounded-full">Write an attractive heading about...</button>
                <button class="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-3 py-1 rounded-full">Write a sub-heading for...</button>
                <button class="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-3 py-1 rounded-full">Paste from clipboard</button>
            </div>
        `;
    }
}


customElements.define('owp-sidebar-suggestions', OwpSidebarSuggestions);