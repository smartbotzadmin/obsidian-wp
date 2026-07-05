/**
 * @class ObsiaSidebarInput
 * @augments HTMLElement
 * @description Web component for the sidebar input, including a text area and send button.
 */
class ObsiaSidebarInput extends HTMLElement {
  /**
   * @description Constructs the ObsiaSidebarInput instance.
   * @returns {void}
   */
  constructor() {
    super();
    this.innerHTML = `
            <div class="p-2 border-t border-slate-700 bg-slate-900">
                <textarea class="w-full p-2 border border-slate-700 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 text-md text-slate-100 bg-slate-950" placeholder="How can I help you?" rows="3"></textarea>
                <div class="flex justify-between items-center p-2 text-slate-100 text-sm cursor-default">
                    <span class="w-1/2 text-wrap text-sm">
                        AI Assistant can make mistakes. Please check the results.
                    </span>
                    <button class="flex items-center cursor-pointer">
                        <img class="p-2 bg-cyan-500 hover:bg-cyan-600 rounded-md" src="/wp-content/plugins/obsia/assets/icons/send.svg" alt="Send" />
                    </button>
                </div>
            </div>
        `;
  }

  /**
   * @description Called when the element is added to the document's DOM.
   * @returns {void}
   */
  connectedCallback() {
    // No specific logic needed on connection for this component.
  }

  /**
   * @description Called when the element is removed from the document's DOM.
   * @returns {void}
   */
  disconnectedCallback() {
    // No specific cleanup needed for this component.
  }
}

customElements.define("obsia-sidebar-input", ObsiaSidebarInput);
