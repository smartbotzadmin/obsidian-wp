class ObsiaSidebar extends HTMLElement {
  sidebarContainer = null;

  /**
   * @description Constructs the ObsiaSidebar instance.
   * @returns {void}
   */
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = `
            <link rel="stylesheet" href="${window.location.origin}/wp-content/plugins/obsia/assets/css/output.css">

            <div id="obsia-custom-sidebar-container" class="fixed max-w-[450px] h-screen top-0 -right-[450px] z-[99999] shadow-lg transition-all duration-200 ease-out">
                <div class=" flex flex-col h-full">
                    <obsia-sidebar-header></obsia-sidebar-header>
                    <obsia-sidebar-chat class="flex-1"></obsia-sidebar-chat>
                    <obsia-sidebar-suggestions></obsia-sidebar-suggestions>
                    <obsia-sidebar-input></obsia-sidebar-input>
                </div>
            </div>
        `;
  }

  /**
   * @description Called when the element is added to the document's DOM.
   * @returns {void}
   */
  connectedCallback() {
    this.sidebarContainer = this.shadowRoot.getElementById("obsia-custom-sidebar-container");
    window.addEventListener("toggle-sidebar", this.toggleSidebar.bind(this));
  }

  /**
   * @description Called when the element is removed from the document's DOM.
   * @returns {void}
   */
  disconnectedCallback() {
    window.removeEventListener("toggle-sidebar", this.toggleSidebar.bind(this));
  }

  /**
   * @description Toggles the visibility of the sidebar.
   * @returns {void}
   */
  toggleSidebar() {
    if (this.sidebarContainer) {
      this.sidebarContainer.classList.toggle("!right-0");
    }
  }
}

customElements.define("obsia-sidebar", ObsiaSidebar);
