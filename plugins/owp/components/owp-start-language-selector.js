/**
 * @class OwpStartLanguageSelector
 * @augments HTMLElement
 * @description Web component for the website language selection.
 */
class OwpStartLanguageSelector extends HTMLElement {
    /**
     * @description Constructs the OwpStartLanguageSelector instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.innerHTML = `
            <div class="min-w-64">
                <label for="websiteLanguage" class="block text-gray-700 text-sm font-bold mb-2">This website will be in</label>
                <div class="relative">
                    <input type="text" id="websiteLanguageSearch" class="shadow appearance-none border border-gray-300 rounded-lg w-full h-11 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10" value="EN English (Default)">
                    <svg class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    <div id="websiteLanguageDropdown" class="absolute w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10 hidden">
                        <div class="py-1">
                            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-value="EN-GB">EN-GB English (UK)</a>
                            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-value="EN-AU">EN-AU English (Australia)</a>
                            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-value="EN-NZ">EN-NZ English (New Zealand)</a>
                            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-value="EN-CA">EN-CA English (Canada)</a>
                            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex justify-between items-center" data-value="EN">EN English <svg class="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg></a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.websiteLanguageSearch = this.querySelector('#websiteLanguageSearch');
        this.websiteLanguageDropdown = this.querySelector('#websiteLanguageDropdown');

        this.websiteLanguageSearch.addEventListener('focus', () => this.websiteLanguageDropdown.classList.remove('hidden'));
        this.websiteLanguageSearch.addEventListener('blur', () => setTimeout(() => this.websiteLanguageDropdown.classList.add('hidden'), 100));
        this.websiteLanguageDropdown.querySelectorAll('a').forEach(item => {
            item.addEventListener('click', (event) => {
                event.preventDefault();
                this.websiteLanguageSearch.value = event.target.textContent.trim();
                this.websiteLanguageDropdown.classList.add('hidden');
            });
        });
    }
}

customElements.define('owp-start-language-selector', OwpStartLanguageSelector);