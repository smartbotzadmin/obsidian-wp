(function(wp) {
    var createElement = wp.element.createElement;
    var PluginSidebarMoreMenuItem = wp.editor.PluginSidebarMoreMenuItem; // Updated import
    var Button = wp.components.Button;

    var sidebarContainer = document.createElement('div');
    sidebarContainer.id = 'owp-custom-sidebar-container';
    sidebarContainer.classList.add('owp-custom-sidebar-panel');
    document.body.appendChild(sidebarContainer);

    // Function to toggle sidebar visibility
    function toggleSidebar() {
        sidebarContainer.classList.toggle('is-open');
    }

    // Render the sidebar content
    wp.element.render(
        createElement(
            'div',
            { className: 'owp-sidebar-content' },
            createElement('h2', null, 'Custom Sidebar Content'),
            createElement('p', null, 'This is a dummy HTML content for the custom sidebar.'),
            createElement('button', {
                onClick: function() {
                    alert('Button clicked!');
                }
            }, 'Click Me'),
            createElement('button', {
                onClick: toggleSidebar,
                className: 'owp-inner-toggle-button'
            }, 'Toggle Sidebar')
        ),
        sidebarContainer
    );

    // Register a plugin to add the toggle button to the "More tools & options" menu
    wp.plugins.registerPlugin('owp-sidebar-toggle-button', {
        render: function() {
            return createElement(
                PluginSidebarMoreMenuItem, // Use PluginSidebarMoreMenuItem
                {
                    target: 'owp-custom-sidebar', // Target for the sidebar (not strictly needed for custom DOM)
                    icon: 'admin-page',
                    onClick: toggleSidebar
                },
                'Toggle OWP Sidebar'
            );
        }
    });

})(window.wp);