class OwpSidebar extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
            <link rel="stylesheet" href="${window.location.origin}/wp-content/plugins/owp/assets/css/output.css">
            
            <div id="owp-custom-sidebar-container" class="w-1/4 bg-white border-l border-gray-300 shadow-lg p-5 box-border fixed top-0 h-screen overflow-y-auto z-[99999] -right-1/4 transition-all duration-200 ease-out">
                <div class="p-2.5">
                    <h2 class="text-lg font-semibold mb-2">Custom Sidebar Content</h2>
                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" id="alertButton">
                        Click Me
                    </button>
                    <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ml-2" id="toggleButton">
                        Toggle Sidebar
                    </button>
                </div>
            </div>
        `;

        this.sidebarContainer = shadowRoot.getElementById('owp-custom-sidebar-container');
        shadowRoot.getElementById('toggleButton').addEventListener('click', () => this.toggleSidebar());
        shadowRoot.getElementById('alertButton').addEventListener('click', () => alert('Button clicked!'));
    }

    toggleSidebar() {
        this.sidebarContainer.classList.toggle('!right-0');
    }
}

customElements.define('owp-sidebar', OwpSidebar);