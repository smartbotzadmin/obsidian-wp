/**
 * @class OwpContactSocialMedia
 * @augments HTMLElement
 * @description Web component for adding social media links on the contact page.
 */
class OwpContactSocialMedia extends HTMLElement {
	static socialMediaIcons = [
		'discord', 'facebook', 'github', 'instagram', 'linkedin', 'twitch', 'youtube'
	];


	/**
	 * @description Constructs the OwpContactSocialMedia instance.
	 * @returns {void}
	 */
	constructor() {
		super();
		this.className = `flex flex-col mb-6 relative`;
		this.innerHTML = /*html*/`
			<label for="socialMedia" class="flex flex-row items-center gap-1 text-slate-300 text-sm font-semibold mb-2 cursor-default">
				Social Media
				<img class="ml-1" src="/wp-content/plugins/owp/assets/icons/info.svg" alt="info icon">
			</label>
			<button id="socialMenu" class="bg-slate-700 hover:bg-slate-600 text-slate-100 font-bold p-2 rounded-xl flex items-center justify-center h-8 w-8 cursor-pointer transition duration-300 ease-in-out outline outline-transparent hover:outline-1 hover:outline-cyan-500 focus:outline-2 focus:outline-cyan-500">
				<img class="h-full aspect-square" src="/wp-content/plugins/owp/assets/icons/plus.svg" />
			</button>
			<div
				id="socialDropdown"
				class="absolute top-full h-14 p-1 bg-slate-900 rounded-3xl shadow-lg border border-slate-700 flex justify-center items-center gap-4 mt-2 z-10 transition-all duration-300 ease-in-out hidden "
			>
					<!-- Social media icons will be loaded here -->
			</div>
		`;
		this.socialMenuButton = null;
		this.socialDropdown = null;
		this.boundHandleOutsideClick = this.#handleOutsideClick.bind(this);
	}


	/**
	 * @description Called when the element is added to the document's DOM.
	 * @returns {void}
	 */
	connectedCallback() {
		this.socialMenuButton = this.querySelector('#socialMenu');
		this.socialDropdown = this.querySelector('#socialDropdown');
		this.socialMenuButton.addEventListener('click', (event) => {
			event.stopPropagation(); // Prevent the click from bubbling up to the document
			this.toggleSocialDropdown();
		});
		this.#loadSocialIcons();
		this.#loadExistingSocialFields();
		document.addEventListener('click', this.boundHandleOutsideClick);
	}


	/**
	 * @description Called when the element is removed from the document's DOM.
	 * @returns {void}
	 */
	disconnectedCallback() {
		document.removeEventListener('click', this.boundHandleOutsideClick);
		// Remove other event listeners if necessary
		if (this.socialMenuButton) {
			this.socialMenuButton.removeEventListener('click', (event) => {
				event.stopPropagation();
				this.toggleSocialDropdown();
			});
		}
		// Note: Dynamically added event listeners on social icons and trash buttons are handled by their removal from DOM.
	}


	/**
	 * @private
	 * @description Handles clicks outside the social menu and dropdown to hide the dropdown.
	 * @param {Event} event The click event.
	 * @returns {void}
	 */
	#handleOutsideClick(event) {
		if (!this.socialMenuButton.contains(event.target) && !this.socialDropdown.contains(event.target)) {
			// Only hide if it's currently open (not hidden and has opacity-100)
			if (!this.socialDropdown.classList.contains('hidden') && this.socialDropdown.classList.contains('opacity-100')) {
				this.toggleSocialDropdown(); // Use the toggle function to hide it
			}
		}
	}


	/**
	 * @description Toggles the visibility of the social media dropdown.
	 * @returns {void}
	 */
	toggleSocialDropdown() {
		const isHidden = this.socialDropdown.classList.contains('hidden');

		if (isHidden) {
			// Show dropdown
			this.socialDropdown.classList.remove('hidden');
			// Force reflow to ensure transition applies
			void this.socialDropdown.offsetWidth;
			this.socialDropdown.classList.remove('opacity-0', 'scale-96', 'pointer-events-none');
			this.socialDropdown.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');
		} else {
			// Hide dropdown
			this.socialDropdown.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
			this.socialDropdown.classList.add('opacity-0', 'scale-96', 'pointer-events-none');
			// After transition, add hidden
			this.socialDropdown.addEventListener('transitionend', () => {
				if (this.socialDropdown.classList.contains('opacity-0')) {
					this.socialDropdown.classList.add('hidden');
				}
			}, { once: true });
		}
	}


	/**
	 * @private
	 * @description Loads social media icons into the dropdown.
	 * @returns {void}
	 */
	#loadSocialIcons() {
		OwpContactSocialMedia.socialMediaIcons.forEach(iconName => {
			const iconPath = `/wp-content/plugins/owp/assets/icons/social/${iconName}.svg`;
			const wrapperDiv = document.createElement('div');
			wrapperDiv.className = `h-full p-2 flex items-center justify-center cursor-pointer rounded-3xl transition duration-300 ease-in-out hover:bg-slate-700`;
			wrapperDiv.dataset.social = iconName;

			const img = document.createElement('img');
			img.src = iconPath;
			img.alt = `${iconName} icon`;
			img.className = `size-full aspect-square hover:opacity-75`; // Apply hover opacity to the image itself
			img.dataset.social = iconName; // Keep dataset on img for event delegation if needed, though wrapperDiv will handle click

			wrapperDiv.addEventListener('click', this.#addSocialField.bind(this));
			wrapperDiv.appendChild(img);
			this.socialDropdown.appendChild(wrapperDiv);
		});
	}


	/**
	 * @private
	 * @description Adds a new social media input field.
	 * @param {Event} event The click event or a simulated event object.
	 * @param {string} [initialValue=''] The initial value to pre-fill the input field.
	 * @returns {void}
	 */
	#addSocialField(event, initialValue = '') {
		const socialName = event.target.dataset.social;
		if (!socialName) {
			return;
		}

		// Hide dropdown after selection
		if (!this.socialDropdown.classList.contains('hidden') && this.socialDropdown.classList.contains('opacity-100')) {
			this.toggleSocialDropdown();
		}

		// Check if the social media field already exists
		if (this.querySelector(`.social-field-row[data-social="${socialName}"]`)) {
			return;
		}

		const socialFieldRow2 = document.createElement('div');
		socialFieldRow2.className = "social-field-row h-8 w-[70%] flex items-center gap-4 mb-2"
		socialFieldRow2.dataset.social = `${socialName}`;
		socialFieldRow2.innerHTML = /*html*/`
			<div class="h-full bg-slate-300 rounded-full p-2">
				<img
					src="/wp-content/plugins/owp/assets/icons/social/${socialName}.svg"
					alt="${socialName} icon"
					class="h-full aspect-square"
				/>
			</div>
			<input
				id='${socialName}-field'
				type="text"
				placeholder="Enter ${socialName} Profile URL"
				value="${initialValue}"
				class='h-full flex-grow p-2 rounded-xl bg-slate-900 text-md text-slate-100 border border-slate-700 transition duration-300 ease-in-out outline outline-transparent hover:outline-1 hover:outline-cyan-500 focus:outline-2 focus:outline-cyan-500'
				data-social="${socialName}"
			/>
			<button
				id='${socialName}-trashButton'
				class='h-full aspect-square bg-rose-500 hover:bg-rose-400 text-slate-100 font-bold p-2 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer transition duration-300 ease-in-out outline outline-transparent hover:outline-1 hover:outline-cyan-500 focus:outline-2 focus:outline-cyan-500'
				data-social="${socialName}"
			>
				<img
					src="/wp-content/plugins/owp/assets/icons/trash.svg"
					alt="trash icon"
					class="h-full w-auto"
				/>
			</button>
		`;

		// Insert the new social field row before the social menu button
		this.socialMenuButton.parentNode.insertBefore(socialFieldRow2, this.socialMenuButton);

		// exp
		const field = socialFieldRow2.querySelector(`#${socialName}-field`)
		field.addEventListener('input', this.#updateSocialPayload.bind(this));
		const trashButton = socialFieldRow2.querySelector(`#${socialName}-trashButton`)
		trashButton.addEventListener('click', this.#removeSocialField.bind(this));

		// Initialize payload if not already present
		this.#updateSocialPayload({ target: field });
	}


	/**
	 * @private
	 * @description Updates the owp_payload with social media information.
	 * @param {Event} event The input event.
	 * @returns {void}
	 */
	#updateSocialPayload(event) {
		const socialName = event.target.dataset.social;
		const socialValue = event.target.value;
		const currentPayload = window.owpSessionManager.getPayload();

		if (!currentPayload.contact.social) {
			currentPayload.contact.social = {};
		}
		currentPayload.contact.social[socialName] = socialValue;
		window.owpSessionManager.setPayload(currentPayload);
	}


	/**
	 * @private
	 * @description Removes a social media input field and updates the owp_payload.
	 * @param {Event} event The click event.
	 * @returns {void}
	 */
	#removeSocialField(event) {
		const socialName = event.currentTarget.dataset.social;
		const socialFieldRow = event.currentTarget.closest('.social-field-row');

		if (socialFieldRow) {
			socialFieldRow.remove();
			const currentPayload = window.owpSessionManager.getPayload();
			if (currentPayload.contact.social && currentPayload.contact.social[socialName]) {
				delete currentPayload.contact.social[socialName];
				window.owpSessionManager.setPayload(currentPayload);
			}
		}
	}


	/**
	 * @private
	 * @description Loads existing social media fields from the owp_payload in sessionStorage.
	 * @returns {void}
	 */
	#loadExistingSocialFields() {
		const currentPayload = window.owpSessionManager.getPayload();
		const socialData = currentPayload.contact.social;

		if (socialData) {
			for (const socialName in socialData) {
				if (Object.hasOwnProperty.call(socialData, socialName)) {
					const socialValue = socialData[socialName];
					// Simulate event object for addSocialField
					this.#addSocialField({ target: { dataset: { social: socialName } } }, socialValue);
				}
			}
		}
	}
}

customElements.define('owp-contact-social-media', OwpContactSocialMedia);