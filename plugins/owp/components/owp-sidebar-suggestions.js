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
            <div class="p-2 border-t border-slate-700 flex flex-wrap gap-2 bg-slate-800 text-slate-300 text-[14px] font-medium">
                <button class="bg-slate-950 hover:bg-slate-900 px-3 py-1 rounded-full cursor-pointer">Write an attractive heading about...</button>
                <button class="bg-slate-950 hover:bg-slate-900 px-3 py-1 rounded-full cursor-pointer">Write a sub-heading for...</button>
                <button class="bg-slate-950 hover:bg-slate-900 px-3 py-1 rounded-full cursor-pointer">Paste from clipboard</button>
            </div>
        `;
    }
}


customElements.define('owp-sidebar-suggestions', OwpSidebarSuggestions);