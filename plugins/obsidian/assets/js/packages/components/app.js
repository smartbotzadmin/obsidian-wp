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
    function MainContent({
        editorData,
        deviceMode,
        setDeviceMode,
        showResponsiveMenu,
        setShowResponsiveMenu,
        showExitModal,
        setShowExitModal,
        hasChanges,
        setHasChanges,
        currentVersion,
        setCurrentVersion
    }) {
        return e('div', { className: 'obsidian-preview-container' },
            e(TopBar, {
                editorData,
                deviceMode,
                setDeviceMode,
                showResponsiveMenu,
                setShowResponsiveMenu,
                setShowExitModal,
                hasChanges,
                setHasChanges
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
        const [hasChanges, setHasChanges] = useState(false);
        const [currentVersion, setCurrentVersion] = useState(null);

        useEffect(() => {
            if (window.obsidianData) {
                setEditorData(window.obsidianData.editorData);
                setCurrentVersion(window.obsidianData.editorData?.id);
                setIsLoading(false);
            }
        }, []);

        if (isLoading) {
            return e(LoadingSpinner, { message: 'Loading Obsidian Editor...' });
        }

        return e('div', { className: 'obsidian-editor' },
            e(Sidebar, {
                activeTab,
                setActiveTab,
                editorData,
                currentVersion,
                setCurrentVersion,
                setHasChanges
            }),
            e(MainContent, {
                editorData,
                deviceMode,
                setDeviceMode,
                showResponsiveMenu,
                setShowResponsiveMenu,
                showExitModal,
                setShowExitModal,
                hasChanges,
                setHasChanges,
                currentVersion,
                setCurrentVersion
            }),
            showExitModal && e(ExitModal, {
                setShowExitModal,
                hasChanges,
                editorData
            })
        );
    }

    // Export to global namespace
    window.ObsidianComponents = window.ObsidianComponents || {};
    window.ObsidianComponents.ObsidianApp = ObsidianApp;
    window.ObsidianComponents.MainContent = MainContent;

})(window);