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
        this.innerHTML = `
            <div class="mb-4">
                <label for="socialMedia" class="block text-gray-700 text-sm font-bold mb-2">Social Media <img class="inline-block ml-1" src="${window.location.origin}/wp-content/plugins/owp/assets/icons/info.svg" alt="info icon"></label>
                <button class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg flex items-center justify-center w-12 h-12 text-2xl">
                    +
                </button>
            </div>
        `;
    }
}

customElements.define('owp-contact-social-media', OwpContactSocialMedia);