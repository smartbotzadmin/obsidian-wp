(function (wp) {
    var createElement = wp.element.createElement;
    var PluginSidebarMoreMenuItem = wp.editor.PluginSidebarMoreMenuItem;
    var PluginSidebar = wp.editor.PluginSidebar;
    var __ = wp.i18n.__;


    // --- Your existing sidebar logic ---
    var sidebarContainer = document.createElement('div');
    sidebarContainer.id = 'owp-custom-sidebar-container';
    sidebarContainer.classList.add('owp-custom-sidebar-panel');
    document.body.appendChild(sidebarContainer);
    const settings = document.getElementsByClassName('editor-header__settings');
    console.log(settings, settings[0]);

    function toggleSidebar() {
        sidebarContainer.classList.toggle('is-open');
    }

    wp.element.render(
        createElement(
            'div',
            { className: 'owp-sidebar-content' },
            createElement('h2', null, 'Custom Sidebar Content'),
            createElement('p', null, 'This is a dummy HTML content for the custom sidebar.'),
            createElement('button', {
                onClick: function () {
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

    wp.plugins.registerPlugin('owp-sidebar-toggle-button', {
        render: function () {
            return createElement(
                PluginSidebarMoreMenuItem,
                {
                    target: 'owp-custom-sidebar',
                    icon: 'admin-page',
                    onClick: toggleSidebar
                },
                'Toggle OWP Sidebar'
            );
        }
    });

    wp.plugins.registerPlugin('block-settings-menu-group-test', {
        render: function () {
            return createElement(
                PluginSidebar,
                {
                    name: 'z',
                    title: 'z',
                    icon: 'lightbulb',
                    onClick: toggleSidebar
                }
            )
        }
    });

})(window.wp);