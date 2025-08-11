/**
 * @class OwpPicturesTabs
 * @augments HTMLElement
 * @description Web component for tab navigation on the pictures page.
 */
class OwpPicturesTabs extends HTMLElement {
    /**
     * @description Constructs the OwpPicturesTabs instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.innerHTML = `
            <div class="flex border-b border-slate-700 mb-6">
                <button class="tab-button px-4 py-2 text-sm font-medium text-cyan-400 border-b-2 border-cyan-400 focus:outline-none" data-tab="search-results">Search Results</button>
                <button class="tab-button px-4 py-2 text-sm font-medium text-slate-100 hover:text-slate-300 focus:outline-none" data-tab="upload-images">Upload Your Images</button>
                <button class="tab-button px-4 py-2 text-sm font-medium text-slate-100 hover:text-slate-300 focus:outline-none" data-tab="selected-images">Selected Images</button>
                <div class="flex-grow"></div>
                <div class="relative">
                    <select class="block appearance-none w-full bg-slate-900 border border-slate-700 text-slate-300 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-slate-900 focus:border-slate-500 h-11">
                        <option>All orientations</option>
                        <option>Landscape</option>
                        <option>Portrait</option>
                        <option>Square</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-300">
                        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
            </div>
        `;
        this.tabButtons = this.querySelectorAll('.tab-button');
        this.tabButtons.forEach(button => {
            button.addEventListener('click', this.handleTabClick.bind(this));
        });
    }

    /**
     * @description Handles click events on tab buttons, updating the active tab.
     * @param {Event} event - The click event.
     * @returns {void}
     */
    handleTabClick(event) {
        this.tabButtons.forEach(button => {
            button.classList.remove('text-purple-600', 'border-purple-600');
            button.classList.add('text-gray-600', 'hover:text-gray-800');
        });
        event.currentTarget.classList.remove('text-gray-600', 'hover:text-gray-800');
        event.currentTarget.classList.add('text-purple-600', 'border-b-2', 'border-purple-600');
        // Optionally dispatch a custom event to notify parent of tab change
        this.dispatchEvent(new CustomEvent('tab-changed', {
            detail: { tab: event.currentTarget.dataset.tab }
        }));
    }
}

customElements.define('owp-pictures-tabs', OwpPicturesTabs);