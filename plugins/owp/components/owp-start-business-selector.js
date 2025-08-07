/**
 * @class OwpStartBusinessSelector
 * @augments HTMLElement
 * @description Web component for the website niche selection.
 */
class OwpStartBusinessSelector extends HTMLElement {
    /**
     * @description Constructs the OwpStartBusinessSelector instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.innerHTML = `
            <div class="min-w-86">
                <label for="websiteFor" class="block text-gray-700 text-sm font-bold mb-2">This website is for</label>
                <div class="relative">
                    <input type="text" id="websiteForSearch" class="shadow appearance-none border border-gray-300 rounded-lg w-full h-9 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10" placeholder="Type to search your business">
                    <svg class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <div id="websiteForDropdown" class="absolute w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10 hidden">
                        <div class="py-1">
                            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-value="Agency">Agency</a>
                            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-value="Restaurant">Restaurant</a>
                            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-value="Entrepreneur">Entrepreneur</a>
                            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-value="Event">Event</a>
                            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-value="Non-profit">Non-profit</a>
                            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-value="Local business">Local business</a>
                            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-value="Gym">Gym</a>
                            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-value="Spa">Spa</a>
                            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-value="SaaS">SaaS</a>
                            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-value="Dentist">Dentist</a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.websiteForSearch = this.querySelector('#websiteForSearch');
        this.websiteForDropdown = this.querySelector('#websiteForDropdown');

        this.websiteForSearch.addEventListener('focus', () => this.websiteForDropdown.classList.remove('hidden'));
        this.websiteForSearch.addEventListener('blur', () => setTimeout(() => this.websiteForDropdown.classList.add('hidden'), 100));
        this.websiteForDropdown.querySelectorAll('a').forEach(item => {
            item.addEventListener('click', (event) => {
                event.preventDefault();
                this.websiteForSearch.value = event.target.dataset.value;
                this.websiteForDropdown.classList.add('hidden');
            });
        });
    }
}

customElements.define('owp-start-business-selector', OwpStartBusinessSelector);