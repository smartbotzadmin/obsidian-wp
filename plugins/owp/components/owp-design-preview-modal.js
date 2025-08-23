/**
 * @class OwpDesignPreviewModal
 * @augments HTMLElement
 * @description Web component for displaying a full-screen design preview modal.
 */
class OwpDesignPreviewModal extends HTMLElement {

  constructor() {
    super();
    this.className = `fixed top-0 left-0 z-10 w-full h-full flex p-8`;
    this.innerHTML = /*html*/`
        <div class="relative flex w-full h-full rounded-2xl overflow-hidden border border-slate-700">
            <!-- Sidebar (blank for now) -->
            <div class="w-1/5 bg-slate-900 p-4">
                <!-- Sidebar content goes here -->
            </div>

            <!-- Iframe -->
            <iframe
                src="/?elementor_library=aspera-homepage&owp-preview=true"
                class="w-4/5 h-full bg-slate-100"
                frameborder="0"
            ></iframe>

            <!-- Close Button -->
            <button id="closeModal" class="absolute top-4 right-4 p-2 bg-slate-700 rounded-full hover:bg-slate-600 cursor-pointer">
                <img src="/wp-content/plugins/owp/assets/icons/x.svg" alt="Close Icon" class="w-6 h-6">
            </button>
        </div>
      `;
  }

  connectedCallback() {
    this.closeButton = this.querySelector('#closeModal');
    this.closeButton.addEventListener('click', () => {
      this.remove();
    });

    this.iframe = this.querySelector('iframe');
    this.iframe.onload = () => {
      this.preview = this.iframe.contentDocument || this.iframe.contentWindow.document;
      const previewBody = this.preview.body;
      previewBody.style.zoom = 0.8;
    }
  }
}

customElements.define('owp-design-preview-modal', OwpDesignPreviewModal);