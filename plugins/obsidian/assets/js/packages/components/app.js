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
        const [sessionId, setSessionId] = useState(null);
        const [userId, setUserId] = useState('u_obsidian_user'); // Placeholder for now

        useEffect(() => {
            if (window.obsidianData) {
                setEditorData(window.obsidianData.editorData);
                setCurrentVersion(window.obsidianData.editorData?.id);
                setIsLoading(false);
            }

            // Create session with AI agent
            const createSession = async () => {
                const newSessionId = `s_${Date.now()}`; // Simple unique ID for session
                setSessionId(newSessionId);

                try {
                    const response = await fetch(
                        `https://obsidian-agent-service-313065021854.us-east1.run.app/apps/obsidian_agent/users/${userId}/sessions/${newSessionId}`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            // No data needed for this POST request as per instructions
                        }
                    );

                    if (response.ok) {
                        console.log('AI Agent session created successfully:', newSessionId);
                    } else {
                        console.error('Failed to create AI Agent session:', response.status, response.statusText);
                    }
                } catch (error) {
                    console.error('Error creating AI Agent session:', error);
                }
            };

            createSession();
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
                setHasChanges,
                sessionId,
                userId
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