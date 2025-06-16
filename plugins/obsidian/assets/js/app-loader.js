// Obsidian Editor App Loader
(function() {
    'use strict';

    // Initialize the app
    function initObsidianApp() {
        const appContainer = document.getElementById('obsidian-app');
        if (appContainer && window.ObsidianComponents && window.ObsidianComponents.ObsidianApp) {
            ReactDOM.render(
                React.createElement(window.ObsidianComponents.ObsidianApp), 
                appContainer
            );
        } else {
            console.error('Obsidian App: Missing dependencies or container');
        }
    }

    // Wait for all dependencies to be loaded
    function waitForDependencies() {
        const checkDependencies = () => {
            const hasReact = typeof React !== 'undefined' && typeof ReactDOM !== 'undefined';
            const hasIcons = typeof window.ObsidianIcons !== 'undefined';
            const hasUI = typeof window.ObsidianUI !== 'undefined';
            const hasComponents = typeof window.ObsidianComponents !== 'undefined';
            const hasApp = window.ObsidianComponents && typeof window.ObsidianComponents.ObsidianApp !== 'undefined';

            if (hasReact && hasIcons && hasUI && hasComponents && hasApp) {
                initObsidianApp();
            } else {
                // Log missing dependencies for debugging
                if (!hasReact) console.log('Waiting for React...');
                if (!hasIcons) console.log('Waiting for ObsidianIcons...');
                if (!hasUI) console.log('Waiting for ObsidianUI...');
                if (!hasComponents) console.log('Waiting for ObsidianComponents...');
                if (!hasApp) console.log('Waiting for ObsidianApp...');
                
                setTimeout(checkDependencies, 100);
            }
        };

        checkDependencies();
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForDependencies);
    } else {
        waitForDependencies();
    }

})();