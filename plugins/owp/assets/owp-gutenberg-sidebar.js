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
    function toggleSidebar() {
        sidebarContainer.classList.toggle('is-open');
    }

    // Use wp.domReady to ensure the DOM is fully loaded before trying to access elements
    function onSettingsElementReady() {
        const settings = document.querySelector('.editor-header__settings');
        console.log(settings);

        const newElement = document.createElement('div');
        newElement.classList.add('owp-settings-icon-container');
        const iconElement = document.createElement('img');
        iconElement.src = '/wp-content/plugins/owp/assets/owp-icon.svg';
        iconElement.classList.add('owp-settings-icon');
        newElement.appendChild(iconElement);

        if (settings) {
            settings.classList.add('owp-editor-header-settings');
            if (settings.children.length >= 2) {
                settings.insertBefore(newElement, settings.children[settings.children.length - 2]);
            } else {
                settings.appendChild(newElement);
            }
            newElement.addEventListener('click', toggleSidebar);
        }
    }

    const observer = new MutationObserver((mutationsList, observer) => {
        if (document.querySelector('.editor-header__settings')) {
            onSettingsElementReady();
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

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

})(window.wp);