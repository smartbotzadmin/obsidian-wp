/**
 * @class OwpStartLanguageSelector
 * @augments HTMLElement
 * @description Web component for the website language selection.
 */
class OwpStartLanguageSelector extends HTMLElement {
	/**
	 * @public
	 * @type {string}
	 * @description The currently selected language code.
	 */
	selectedLanguage = 'en';

	/**
	 * @private
	 * @type {Array<Object>}
	 * @description List of supported languages.
	 */
	languages = [
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

	websiteLanguageInput = null;
	selectedLanguageDisplay = null;
	websiteLanguageDropdown = null;
	chevronIcon = null;
	boundHandleOutsideClick = null;


	/**
	 * @description Constructs the OwpStartLanguageSelector instance.
	 * @returns {void}
	 */
	constructor() {
		super();

		const defaultLang = this.languages.find(lang => lang.default);

		this.className = "min-w-64 mb-6";
		this.innerHTML = /*html*/`
			<label for="websiteLanguage" class="block text-slate-300 text-sm font-semibold mb-2">
				Language of the Site
			</label>
			
			<div class="relative flex items-center border border-slate-700 rounded-xl bg-slate-900 w-full h-11 px-3 text-slate-200 text-md leading-tight transition-all duration-300 ease-in-out outline-transparent hover:outline-1 hover:outline-cyan-500 focus-within:outline-2 focus-within:outline-cyan-500 cursor-pointer" id="websiteLanguageInput">

				<span id="selectedLanguageDisplay" class="flex-grow">Select Language</span>
			
				<img src="/wp-content/plugins/owp/assets/icons/chevron-down.svg" class="w-5 h-5 text-slate-100 cursor-pointer chevron-icon transition-transform duration-300 ease-in-out" />
			
				<div id="websiteLanguageDropdown" class="absolute left-0 right-0 top-full mt-2 z-10 bg-slate-900 border border-slate-700 rounded-xl shadow-lg opacity-0 scale-96 pointer-events-none transition-all duration-300 ease-in-out origin-top max-h-50 overflow-y-auto">
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

		if (defaultLang) {
			this.selectedLanguage = defaultLang.code;
		}
	}


	/**
	 * @description Called when the element is added to the document's DOM.
	 * @returns {void}
	 */
	connectedCallback() {
		this.websiteLanguageInput = this.querySelector('#websiteLanguageInput');
		this.selectedLanguageDisplay = this.querySelector('#selectedLanguageDisplay');
		this.websiteLanguageDropdown = this.querySelector('#websiteLanguageDropdown');
		this.chevronIcon = this.querySelector('.chevron-icon');

		this.websiteLanguageInput.addEventListener('click', this.#handleInputClick.bind(this));
		this.websiteLanguageDropdown.querySelectorAll('a').forEach(item => {
			item.addEventListener('click', this.#handleOptionClick.bind(this));
		});

		this.boundHandleOutsideClick = this.#handleClickOutside.bind(this);
		document.addEventListener('click', this.boundHandleOutsideClick);

		this.#loadInitialValue();
	}


	/**
	 * @description Called when the element is removed from the document's DOM.
	 * @returns {void}
	 */
	disconnectedCallback() {
		if (this.websiteLanguageInput) {
			this.websiteLanguageInput.removeEventListener('click', this.#handleInputClick.bind(this));
		}
		if (this.websiteLanguageDropdown) {
			this.websiteLanguageDropdown.querySelectorAll('a').forEach(item => {
				item.removeEventListener('click', this.#handleOptionClick.bind(this));
			});
		}
		document.removeEventListener('click', this.boundHandleOutsideClick);
	}


	/**
	 * @private
	 * @description Handles clicks on the input field to toggle the dropdown.
	 * @param {Event} event - The click event.
	 * @returns {void}
	 */
	#handleInputClick(event) {
		event.stopPropagation(); // Prevent the document click listener from immediately closing it
		this.websiteLanguageDropdown.classList.toggle('opacity-0');
		this.websiteLanguageDropdown.classList.toggle('scale-96');
		this.websiteLanguageDropdown.classList.toggle('pointer-events-none');
		this.chevronIcon.classList.toggle('rotate-180');
	}


	/**
	 * @private
	 * @description Handles clicks on a language option in the dropdown.
	 * @param {Event} event - The click event.
	 * @returns {void}
	 */
	#handleOptionClick(event) {
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
		this.websiteLanguageDropdown.classList.add('opacity-0');
		this.websiteLanguageDropdown.classList.add('scale-96');
		this.websiteLanguageDropdown.classList.add('pointer-events-none');
		this.chevronIcon.classList.remove('rotate-180');
	}


	/**
	 * @private
	 * @description Handles clicks outside the component to close the dropdown.
	 * @param {Event} event - The click event.
	 * @returns {void}
	 */
	#handleClickOutside(event) {
		if (!this.websiteLanguageInput.contains(event.target) && !this.websiteLanguageDropdown.contains(event.target)) {
			this.websiteLanguageDropdown.classList.add('opacity-0');
			this.websiteLanguageDropdown.classList.add('scale-96');
			this.websiteLanguageDropdown.classList.add('pointer-events-none');
			this.chevronIcon.classList.remove('rotate-180');
		}
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
			} else {
				this.selectedLanguageDisplay.textContent = 'Select Language';
			}
		} else {
			this.selectedLanguageDisplay.textContent = 'Select Language';
		}
	}
}

customElements.define('owp-start-language-selector', OwpStartLanguageSelector);