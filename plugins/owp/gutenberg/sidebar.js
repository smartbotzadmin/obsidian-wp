(function (wp) {
    // ObsidianWP Gutenberg Icon
    function onSettingsElementReady() {
        const settings = document.querySelector('.editor-header__settings');
        const newElement = document.createElement('div');
        newElement.innerHTML = `
            <img src="/wp-content/plugins/owp/assets/icons/owp-logo-dark.svg" class="w-6 h-6 block mx-auto" />
        `;
        newElement.classList.add('bg-black', 'border-none', 'rounded-md', 'cursor-pointer', 'w-8', 'h-8', 'flex', 'justify-center', 'items-center', 'transition-colors', 'duration-200', 'hover:bg-[#27276f]');

        if (settings) {
            settings.classList.add('flex', 'items-center');
            if (settings.children.length >= 2) {
                settings.insertBefore(newElement, settings.children[settings.children.length - 2]);
            } else {
                settings.appendChild(newElement);
            }
            newElement.addEventListener('click', () => {
                const sidebar = document.querySelector('owp-sidebar');
                if (sidebar) {
                    sidebar.toggleSidebar();
                }
            });
        }
    }

    const observer = new MutationObserver((mutationsList, observer) => {
        if (document.querySelector('.editor-header__settings')) {
            onSettingsElementReady();
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Append the web component to the body
    document.body.appendChild(document.createElement('owp-sidebar'));

})(window.wp || {});