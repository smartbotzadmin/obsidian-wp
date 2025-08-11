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
        this.className = `flex flex-col mb-6`;
        this.innerHTML = `
            <label for="socialMedia" class="block text-slate-300 text-sm font-semibold mb-2">Social Media <img class="inline-block ml-1" src="/wp-content/plugins/owp/assets/icons/info.svg" alt="info icon"></label>
            <button class="bg-slate-700 hover:bg-slate-600 text-slate-100 font-bold py-2 px-4 rounded-lg flex items-center justify-center w-12 h-12 text-2xl">
                +
            </button>
        `;
    }
}

customElements.define('owp-contact-social-media', OwpContactSocialMedia);