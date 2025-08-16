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

        /**
         * @public
         * @type {string}
         * @description The currently selected language code.
         */
        this.selectedLanguage = 'en';

        /**
         * @private
         * @type {Array<Object>}
         * @description List of supported languages.
         */
        this.languages = [
            { code: 'en', name: 'English', default: true },
            { code: 'es', name: 'Español' },
            { code: 'fr', name: 'Français' },
            { code: 'de', name: 'Deutsch' },
            { code: 'zh', name: '中文' },
            { code: 'ja', name: '日本語' },
            { code: 'ko', name: '한국어' },
            { code: 'ru', name: 'Русский' },
            { code: 'pt', name: 'Português' },
            { code: 'it', name: 'Italiano' },
            { code: 'ar', name: 'العربية' },
            { code: 'hi', name: 'हिन्दी' },
            { code: 'bn', name: 'বাংলা' },
            { code: 'pa', name: 'ਪੰਜਾਬੀ' },
            { code: 'jv', name: 'Basa Jawa' },
            { code: 'tr', name: 'Türkçe' },
            { code: 'vi', name: 'Tiếng Việt' },
            { code: 'pl', name: 'Polski' },
            { code: 'nl', name: 'Nederlands' },
            { code: 'sv', name: 'Svenska' },
        ];

        
        const defaultLang = this.languages.find(lang => lang.default);
        
        this.className = "min-w-64 mb-6";
        this.innerHTML = `
            <label for="websiteLanguage" class="block text-slate-300 text-sm font-semibold mb-2">Language of the Site</label>
            <div class="relative flex items-center border border-slate-700 rounded-lg bg-slate-900 w-full h-11 px-3 text-slate-200 text-md leading-tight focus:outline-none focus:shadow-outline cursor-pointer" id="websiteLanguageInput">
                <span id="selectedLanguageDisplay" class="flex-grow">${defaultLang ? `${defaultLang.code.toUpperCase()} ${defaultLang.name}` : 'EN English'}</span>
                <img src="/wp-content/plugins/owp/assets/icons/chevron-down.svg" class="w-5 h-5 text-slate-100 cursor-pointer chevron-icon" />
                <div id="websiteLanguageDropdown" class="absolute left-0 right-0 bg-slate-900 border border-slate-700 rounded-lg shadow-lg mt-1 z-10 hidden max-h-60 overflow-y-auto" style="top: 100%;">
                    <div class="py-1">
                        ${this.languages.map(lang => `
                            <a href="#" class="block px-4 py-2 text-md text-slate-100 hover:bg-slate-800 flex justify-between items-center" data-value="${lang.code}">
                                ${lang.code.toUpperCase()} ${lang.name}
                            </a>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        this.websiteLanguageInput = this.querySelector('#websiteLanguageInput');
        this.selectedLanguageDisplay = this.querySelector('#selectedLanguageDisplay');
        this.websiteLanguageDropdown = this.querySelector('#websiteLanguageDropdown');
        this.chevronIcon = this.querySelector('.chevron-icon');

        if (defaultLang) {
            this.selectedLanguage = defaultLang.code;
        }

        this.websiteLanguageInput.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent the document click listener from immediately closing it
            this.websiteLanguageDropdown.classList.toggle('hidden');
        });
        document.addEventListener('click', (event) => {
            if (!this.websiteLanguageInput.contains(event.target) && !this.websiteLanguageDropdown.contains(event.target)) {
                this.websiteLanguageDropdown.classList.add('hidden');
            }
        });

        this.#loadInitialValue();

        this.websiteLanguageDropdown.querySelectorAll('a').forEach(item => {
            item.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation(); // Add this line to prevent event bubbling
                const selectedCode = event.currentTarget.dataset.value;
                const selectedLang = this.languages.find(lang => lang.code === selectedCode);

                if (selectedLang) {
                    this.selectedLanguageDisplay.textContent = `${selectedLang.code.toUpperCase()} ${selectedLang.name}`;
                    this.selectedLanguage = selectedCode;

                    const currentPayload = window.owpSessionManager.getPayload();
                    window.owpSessionManager.updatePayloadSection('start', {
                        ...currentPayload.start,
                        language: selectedCode
                    });
                }
                this.websiteLanguageDropdown.classList.add('hidden');
            });
        });
    }


    /**
     * @private
     * @description Loads the initial value from sessionStorage and sets it to the display.
     * @returns {void}
     */
    #loadInitialValue() {
        const currentPayload = window.owpSessionManager.getPayload();
        if (currentPayload.start && currentPayload.start.language) {
            const storedLangCode = currentPayload.start.language;
            const storedLang = this.languages.find(lang => lang.code === storedLangCode);
            if (storedLang) {
                this.selectedLanguage = storedLangCode;
                this.selectedLanguageDisplay.textContent = `${storedLang.code.toUpperCase()} ${storedLang.name}`;
            }
        }
    }
}

customElements.define('owp-start-language-selector', OwpStartLanguageSelector);