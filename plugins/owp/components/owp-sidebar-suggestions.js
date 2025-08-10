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
            <div class="p-4 border-t border-slate-700 flex flex-wrap gap-2 bg-slate-700">
                <button class="bg-slate-100 hover:bg-slate-300 text-slate-900 text-sm px-3 py-1 rounded-full cursor-pointer">Write an attractive heading about...</button>
                <button class="bg-slate-100 hover:bg-slate-300 text-slate-900 text-sm px-3 py-1 rounded-full cursor-pointer">Write a sub-heading for...</button>
                <button class="bg-slate-100 hover:bg-slate-300 text-slate-900 text-sm px-3 py-1 rounded-full cursor-pointer">Paste from clipboard</button>
            </div>
        `;
    }
}


customElements.define('owp-sidebar-suggestions', OwpSidebarSuggestions);