// Obsidian Editor Main App Component
(function(window) {
    'use strict';

    const { createElement: e, useState, useEffect } = React;
    const { LoadingSpinner } = window.ObsidianUI;
    const { 
        Sidebar, 
        TopBar, 
        PreviewFrame, 
        ExitModal 
    } = window.ObsidianComponents;

    // Main Content Component
    function MainContent({ editorData, deviceMode, setDeviceMode, showResponsiveMenu, setShowResponsiveMenu, showExitModal, setShowExitModal }) {
        return e('div', { className: 'obsidian-preview-container' },
            e(TopBar, { 
                editorData, 
                deviceMode, 
                setDeviceMode, 
                showResponsiveMenu, 
                setShowResponsiveMenu,
                setShowExitModal
            }),
            e(PreviewFrame, { editorData, deviceMode })
        );
    }

    // Main App Component
    function ObsidianApp() {
        const [isLoading, setIsLoading] = useState(true);
        const [editorData, setEditorData] = useState(null);
        const [activeTab, setActiveTab] = useState('chat');
        const [deviceMode, setDeviceMode] = useState('desktop');
        const [showResponsiveMenu, setShowResponsiveMenu] = useState(false);
        const [showExitModal, setShowExitModal] = useState(false);

        useEffect(() => {
            if (window.obsidianData) {
                setEditorData(window.obsidianData.editorData);
                setIsLoading(false);
            }
        }, []);

        if (isLoading) {
            return e(LoadingSpinner, { message: 'Loading Obsidian Editor...' });
        }

        return e('div', { className: 'obsidian-editor' },
            e(Sidebar, { activeTab, setActiveTab, editorData }),
            e(MainContent, { 
                editorData, 
                deviceMode, 
                setDeviceMode, 
                showResponsiveMenu, 
                setShowResponsiveMenu,
                showExitModal,
                setShowExitModal
            }),
            showExitModal && e(ExitModal, { setShowExitModal })
        );
    }

    // Export to global namespace
    window.ObsidianComponents = window.ObsidianComponents || {};
    window.ObsidianComponents.ObsidianApp = ObsidianApp;
    window.ObsidianComponents.MainContent = MainContent;

})(window);