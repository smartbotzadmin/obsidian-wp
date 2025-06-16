// Obsidian Editor React App
(function() {
    'use strict';

    const { createElement: e, useState, useEffect } = React;

    // Main App Component
    function ObsidianApp() {
        const [isLoading, setIsLoading] = useState(true);
        const [editorData, setEditorData] = useState(null);

        useEffect(() => {
            // Get data from WordPress
            if (window.obsidianData) {
                setEditorData(window.obsidianData.editorData);
                setIsLoading(false);
            }
        }, []);

        if (isLoading) {
            return e('div', { className: 'obsidian-loading' },
                e('div', { className: 'obsidian-loading-spinner' }),
                'Loading Obsidian Editor...'
            );
        }

        return e('div', { className: 'obsidian-editor' },
            // Sidebar
            e(Sidebar),
            // Main Content Area
            e(MainContent, { editorData })
        );
    }

    // Sidebar Component
    function Sidebar() {
        return e('div', { className: 'obsidian-sidebar' },
            e('h2', null, 'Obsidian AI'),
            e('div', { className: 'obsidian-chat-placeholder' },
                'Chat goes here',
                e('br'),
                e('small', { style: { color: '#999', marginTop: '10px', display: 'block' } },
                    'AI chat interface will be implemented here'
                )
            )
        );
    }

    // Main Content Component
    function MainContent({ editorData }) {
        return e('div', { className: 'obsidian-preview-container' },
            // Top Bar
            e(TopBar, { editorData }),
            // Preview Frame
            e(PreviewFrame, { editorData })
        );
    }

    // Top Bar Component
    function TopBar({ editorData }) {
        const handleSave = () => {
            alert('Save functionality will be implemented here');
        };

        const handleExit = () => {
            if (window.obsidianData && window.obsidianData.adminUrl) {
                window.location.href = window.obsidianData.adminUrl + 'edit.php?post_type=' + (editorData?.type || 'page');
            }
        };

        return e('div', { className: 'obsidian-top-bar' },
            e('h1', null, 
                'Editing: ', 
                editorData?.title || 'Untitled'
            ),
            e('div', { className: 'obsidian-top-bar-actions' },
                e('button', {
                    className: 'obsidian-btn obsidian-btn-secondary',
                    onClick: handleExit
                }, 'Exit'),
                e('button', {
                    className: 'obsidian-btn obsidian-btn-primary',
                    onClick: handleSave
                }, 'Save')
            )
        );
    }

    // Preview Frame Component
    function PreviewFrame({ editorData }) {
        const [previewUrl, setPreviewUrl] = useState('');

        useEffect(() => {
            if (editorData && editorData.preview_url) {
                // Add a timestamp to prevent caching
                const url = editorData.preview_url + (editorData.preview_url.includes('?') ? '&' : '?') + 
                           'obsidian_preview=1&t=' + Date.now();
                setPreviewUrl(url);
            }
        }, [editorData]);

        if (!previewUrl) {
            return e('div', { className: 'obsidian-preview-frame' },
                e('div', { className: 'obsidian-loading' },
                    'Loading preview...'
                )
            );
        }

        return e('div', { className: 'obsidian-preview-frame' },
            e('iframe', {
                src: previewUrl,
                title: 'Page Preview',
                onLoad: () => {
                    console.log('Preview loaded');
                }
            })
        );
    }

    // Initialize the app when DOM is ready
    function initObsidianApp() {
        const appContainer = document.getElementById('obsidian-app');
        if (appContainer) {
            ReactDOM.render(e(ObsidianApp), appContainer);
        }
    }

    // Wait for React to be available
    if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
        initObsidianApp();
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            // Retry after a short delay to ensure React is loaded
            setTimeout(initObsidianApp, 100);
        });
    }

})();