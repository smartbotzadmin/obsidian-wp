class OwpSidebar extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
            <link rel="stylesheet" href="${window.location.origin}/wp-content/plugins/owp/assets/css/output.css">
            
            <div id="owp-custom-sidebar-container" class="fixed w-1/4 h-screen top-0 -right-1/4 z-[99999] overflow-y-auto bg-white border-l border-gray-200 shadow-lg transition-all duration-200 ease-out">
                <!-- Sidebar content here -->
            </div>
        `;

        this.sidebarContainer = shadowRoot.getElementById('owp-custom-sidebar-container');
        shadowRoot.getElementById('toggleButton').onclick = () => this.toggleSidebar();
        shadowRoot.getElementById('alertButton').onclick = () => alert('Button clicked!');
    }

    toggleSidebar() {
        this.sidebarContainer.classList.toggle('!right-0');
    }
}

customElements.define('owp-sidebar', OwpSidebar);