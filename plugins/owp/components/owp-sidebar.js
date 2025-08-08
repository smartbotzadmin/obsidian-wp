class OwpSidebar extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
            <link rel="stylesheet" href="${window.location.origin}/wp-content/plugins/owp/assets/css/output.css">
            
            <div id="owp-custom-sidebar-container" class="fixed w-1/4 h-screen top-0 -right-1/4 z-[99999] bg-white border-l border-gray-200 shadow-lg transition-all duration-200 ease-out">
                <div class=" flex flex-col h-full">
                    <owp-sidebar-header></owp-sidebar-header>
                    <owp-sidebar-chat class="flex-1"></owp-sidebar-chat>
                    <owp-sidebar-suggestions></owp-sidebar-suggestions>
                    <owp-sidebar-input></owp-sidebar-input>
                </div>
            </div>
        `;

        this.sidebarContainer = shadowRoot.getElementById('owp-custom-sidebar-container');
    }

    /**
     * @description Toggles the visibility of the sidebar.
     * @returns {void}
     */
    toggleSidebar() {
        this.sidebarContainer.classList.toggle('!right-0');
    }
}

customElements.define('owp-sidebar', OwpSidebar);