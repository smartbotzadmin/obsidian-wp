/**
 * @class OwpContactSocialMedia
 * @augments HTMLElement
 * @description Web component for adding social media links on the contact page.
 */
class OwpContactSocialMedia extends HTMLElement {
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
            <button id="socialMenu" class="bg-slate-700 hover:bg-slate-600 text-slate-100 font-bold p-3 rounded-full flex items-center justify-center h-11 w-11 text-2xl cursor-pointer">
                <img class="h-full aspect-square" src="/wp-content/plugins/owp/assets/icons/plus.svg" />
            </button>
            <div id="socialDropdown" class="hidden absolute top-full bg-slate-300 rounded-xl shadow-lg border-2 border-slate-500 flex flex-row gap-5 p-2 mt-2 z-10">
                <!-- Social media icons will be loaded here -->
            </div>
        `;
        this.socialMediaIcons = [
            'discord', 'facebook', 'github', 'instagram', 'linkedin',
            'messenger', 'twitch', 'whatsapp', 'youtube'
        ];
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
        this.loadSocialIcons();
        document.addEventListener('click', this.handleOutsideClick.bind(this));
    }


    /**
     * @description Handles clicks outside the social menu and dropdown to hide the dropdown.
     * @param {Event} event The click event.
     * @returns {void}
     */
    handleOutsideClick(event) {
        if (!this.socialMenuButton.contains(event.target) && !this.socialDropdown.contains(event.target)) {
            this.socialDropdown.classList.add('hidden');
        }
    }


    /**
     * @description Toggles the visibility of the social media dropdown.
     * @returns {void}
     */
    toggleSocialDropdown() {
        this.socialDropdown.classList.toggle('hidden');
    }


    /**
     * @description Loads social media icons into the dropdown.
     * @returns {void}
     */
    loadSocialIcons() {
        this.socialMediaIcons.forEach(iconName => {
            const iconPath = `/wp-content/plugins/owp/assets/icons/social/${iconName}.svg`;
            const img = document.createElement('img');
            img.src = iconPath;
            img.alt = `${iconName} icon`;
            img.className = `w-8 h-8 cursor-pointer hover:opacity-75`;
            img.dataset.social = iconName;
            img.addEventListener('click', this.addSocialField.bind(this));
            this.socialDropdown.appendChild(img);
        });
    }


    /**
     * @description Adds a new social media input field.
     * @param {Event} event The click event.
     * @returns {void}
     */
    addSocialField(event) {
        const socialName = event.target.dataset.social;
        if (!socialName) {
            return;
        }

        // Hide dropdown after selection
        this.socialDropdown.classList.add('hidden');

        // Check if the social media field already exists
        if (this.querySelector(`.social-field-row[data-social="${socialName}"]`)) {
            return;
        }

        const socialFieldRow = document.createElement('div');
        socialFieldRow.className = `social-field-row h-11 flex items-center gap-4 mb-2`;
        socialFieldRow.dataset.social = socialName;

        const icon = document.createElement('img');
        icon.src = `/wp-content/plugins/owp/assets/icons/social/${socialName}.svg`;
        icon.alt = `${socialName} icon`;
        icon.className = `h-full aspect-square flex-shrink-0 p-3 bg-slate-300 rounded-full`;

        const input = document.createElement('input');
        input.type = `text`;
        input.placeholder = `Enter ${socialName} Profile URL`;
        input.className = `h-full flex-grow p-2 rounded-lg bg-slate-800 text-md text-slate-100 border border-slate-700 focus:outline-none focus:border-cyan-500`;
        input.dataset.social = socialName;
        input.addEventListener('input', this.updateSocialPayload.bind(this));

        const trashButton = document.createElement('button');
        trashButton.className = `h-full aspect-square bg-rose-500 hover:bg-rose-400 text-slate-100 font-bold p-3 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer`;
        trashButton.innerHTML = `<img src="/wp-content/plugins/owp/assets/icons/trash.svg" alt="trash icon" class="h-full w-auto">`;
        trashButton.dataset.social = socialName;
        trashButton.addEventListener('click', this.removeSocialField.bind(this));

        socialFieldRow.appendChild(icon);
        socialFieldRow.appendChild(input);
        socialFieldRow.appendChild(trashButton);

        // Insert the new social field row before the social menu button
        this.socialMenuButton.parentNode.insertBefore(socialFieldRow, this.socialMenuButton);

        // Initialize payload if not already present
        this.updateSocialPayload({ target: input });
    }


    /**
     * @description Updates the owp_payload with social media information.
     * @param {Event} event The input event.
     * @returns {void}
     */
    updateSocialPayload(event) {
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
     * @description Removes a social media input field and updates the owp_payload.
     * @param {Event} event The click event.
     * @returns {void}
     */
    removeSocialField(event) {
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
}
customElements.define('owp-contact-social-media', OwpContactSocialMedia);