// Obsidian Editor React App - Professional Design Implementation
(function() {
    'use strict';

    const { createElement: e, useState, useEffect, useRef } = React;

    // SVG Icons
    const SendIcon = () => e('svg', { 
        width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 
    }, 
        e('path', { d: 'M22 2L11 13' }),
        e('path', { d: 'M22 2L15 22L11 13L2 9L22 2Z' })
    );

    const SettingsIcon = () => e('svg', { 
        width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 
    }, 
        e('circle', { cx: 12, cy: 12, r: 3 }),
        e('path', { d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' })
    );

    const MonitorIcon = () => e('svg', { 
        width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 
    }, 
        e('rect', { x: 2, y: 3, width: 20, height: 14, rx: 2, ry: 2 }),
        e('line', { x1: 8, y1: 21, x2: 16, y2: 21 }),
        e('line', { x1: 12, y1: 17, x2: 12, y2: 21 })
    );

    const TabletIcon = () => e('svg', { 
        width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 
    }, 
        e('rect', { x: 4, y: 2, width: 16, height: 20, rx: 2, ry: 2 }),
        e('line', { x1: 12, y1: 18, x2: 12.01, y2: 18 })
    );

    const SmartphoneIcon = () => e('svg', { 
        width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 
    }, 
        e('rect', { x: 5, y: 2, width: 14, height: 20, rx: 2, ry: 2 }),
        e('line', { x1: 12, y1: 18, x2: 12.01, y2: 18 })
    );

    const CloudIcon = () => e('svg', { 
        width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 
    }, 
        e('path', { d: 'M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z' })
    );

    const SaveIcon = () => e('svg', { 
        width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 
    }, 
        e('path', { d: 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z' }),
        e('polyline', { points: '17,21 17,13 7,13 7,21' }),
        e('polyline', { points: '7,3 7,8 15,8' })
    );

    const ExitIcon = () => e('svg', { 
        width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 
    }, 
        e('path', { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' }),
        e('polyline', { points: '16,17 21,12 16,7' }),
        e('line', { x1: 21, y1: 12, x2: 9, y2: 12 })
    );

    const RotateCcwIcon = () => e('svg', { 
        width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 
    }, 
        e('polyline', { points: '1,4 1,10 7,10' }),
        e('path', { d: 'M3.51 15a9 9 0 1 0 2.13-9.36L1 10' })
    );

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
            return e('div', { className: 'obsidian-loading' },
                e('div', { className: 'obsidian-loading-spinner' }),
                'Loading Obsidian Editor...'
            );
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

    // Sidebar Component
    function Sidebar({ activeTab, setActiveTab, editorData }) {
        return e('div', { className: 'obsidian-sidebar' },
            e(SidebarTabs, { activeTab, setActiveTab }),
            e('div', { className: 'obsidian-sidebar-content' },
                activeTab === 'chat' ? e(ChatContent) : e(HistoryContent, { editorData })
            )
        );
    }

    // Sidebar Tabs
    function SidebarTabs({ activeTab, setActiveTab }) {
        return e('div', { className: 'obsidian-sidebar-tabs' },
            e('div', { 
                className: 'obsidian-tab',
                'data-active': activeTab === 'chat',
                onClick: () => setActiveTab('chat')
            },
                e('div', { className: 'obsidian-tab-inner' },
                    e('div', { className: 'obsidian-tab-text' }, 'Chat')
                )
            ),
            e('div', { 
                className: 'obsidian-tab',
                'data-active': activeTab === 'history',
                onClick: () => setActiveTab('history')
            },
                e('div', { className: 'obsidian-tab-inner' },
                    e('div', { className: 'obsidian-tab-text' }, 'History')
                )
            )
        );
    }

    // Chat Content
    function ChatContent() {
        const [message, setMessage] = useState('');
        const textareaRef = useRef(null);

        const handleInputChange = (e) => {
            setMessage(e.target.value);
            adjustTextareaHeight();
        };

        const adjustTextareaHeight = () => {
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
                const scrollHeight = textareaRef.current.scrollHeight;
                const maxHeight = 200; // 10 lines approximately
                textareaRef.current.style.height = Math.min(scrollHeight, maxHeight) + 'px';
            }
        };

        const handleSend = () => {
            if (message.trim()) {
                // TODO: Implement send functionality
                console.log('Sending message:', message);
                setMessage('');
                if (textareaRef.current) {
                    textareaRef.current.style.height = 'auto';
                }
            }
        };

        const handleKeyPress = (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        };

        return e('div', { className: 'obsidian-chat-container' },
            e('div', { className: 'obsidian-chat-messages' },
                // Demo messages from Figma design
                e('div', { className: 'obsidian-message-group' },
                    e('div', { className: 'obsidian-message-user' },
                        e('div', { className: 'obsidian-message-user-bubble' },
                            e('div', { className: 'obsidian-message-user-text' },
                                'I would like my homepage to display a black friday sale section, i think it should have a classic and a sweet matcha cards. You can make up the third one. Put it above the why us section.'
                            )
                        ),
                        e('div', { className: 'obsidian-message-time' }, '2:38 PM')
                    )
                ),
                e('div', { className: 'obsidian-message-group' },
                    e('div', { className: 'obsidian-message-assistant' },
                        e('div', { className: 'obsidian-message-assistant-bubble' },
                            e('div', { className: 'obsidian-message-assistant-text' },
                                'Of course! Allow me to take a look at your page and I will modify it for you.'
                            )
                        ),
                        e('div', { className: 'obsidian-message-time' }, '2:39 PM')
                    ),
                    e('div', { className: 'obsidian-post-modified' },
                        e('div', { className: 'obsidian-post-modified-icon' }),
                        e('div', { className: 'obsidian-post-modified-text' }, 'Post modified')
                    ),
                    e('div', { className: 'obsidian-message-assistant' },
                        e('div', { className: 'obsidian-message-assistant-bubble' },
                            e('div', { className: 'obsidian-message-assistant-text' },
                                'Does this seem in line with what you are looking for? I have created a section that makes sense for your brand.\n\nI have also added 3 types of products for the homepage demo.'
                            )
                        ),
                        e('div', { className: 'obsidian-message-time' }, '2:41 PM')
                    )
                )
            ),
            e('div', { className: 'obsidian-chat-input-container' },
                e('div', { className: 'obsidian-chat-input-wrapper' },
                    e('textarea', {
                        ref: textareaRef,
                        className: 'obsidian-chat-input',
                        placeholder: 'Ask Obsidian...',
                        value: message,
                        onChange: handleInputChange,
                        onKeyPress: handleKeyPress,
                        rows: 1
                    })
                ),
                e('button', {
                    className: 'obsidian-chat-send',
                    onClick: handleSend,
                    disabled: !message.trim()
                }, e(SendIcon))
            )
        );
    }

    // History Content
    function HistoryContent({ editorData }) {
        const [selectedVersion, setSelectedVersion] = useState(null);
        const [historyItems, setHistoryItems] = useState([]);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            if (editorData && editorData.id) {
                fetchRevisions();
            }
        }, [editorData]);

        const fetchRevisions = async () => {
            try {
                const response = await fetch(
                    `${window.obsidianData.apiUrl}posts/${editorData.id}/revisions`,
                    {
                        headers: {
                            'X-WP-Nonce': window.obsidianData.nonce
                        }
                    }
                );
                
                if (response.ok) {
                    const revisions = await response.json();
                    setHistoryItems(revisions);
                }
            } catch (error) {
                console.error('Failed to fetch revisions:', error);
            } finally {
                setLoading(false);
            }
        };

        const handleRollback = async () => {
            if (selectedVersion) {
                try {
                    const response = await fetch(
                        `${window.obsidianData.apiUrl}posts/${editorData.id}/revisions/${selectedVersion}/restore`,
                        {
                            method: 'POST',
                            headers: {
                                'X-WP-Nonce': window.obsidianData.nonce,
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                    
                    if (response.ok) {
                        const result = await response.json();
                        console.log('Rollback successful:', result);
                        // Refresh the preview
                        window.location.reload();
                    } else {
                        console.error('Rollback failed');
                    }
                } catch (error) {
                    console.error('Rollback error:', error);
                }
            }
        };

        if (loading) {
            return e('div', { className: 'obsidian-history-container active' },
                e('div', { className: 'obsidian-loading' }, 'Loading revisions...')
            );
        }

        return e('div', { className: 'obsidian-history-container active' },
            e('div', { className: 'obsidian-history-list' },
                historyItems.length === 0 ?
                    e('div', { className: 'obsidian-history-empty' }, 'No revisions found') :
                    historyItems.map(item =>
                        e('div', {
                            key: item.id,
                            className: `obsidian-history-item ${selectedVersion === item.id ? 'selected' : ''}`,
                            onClick: () => setSelectedVersion(item.id)
                        },
                            e('div', { className: 'obsidian-history-version' }, `Version #${item.id}`),
                            e('div', { className: 'obsidian-history-date' }, `${item.date_relative} (${item.date})`)
                        )
                    )
            ),
            e('div', { className: 'obsidian-history-actions' },
                e('button', { 
                    className: 'obsidian-btn obsidian-btn-secondary',
                    onClick: () => setSelectedVersion(null)
                }, 'Discard'),
                e('button', { 
                    className: 'obsidian-btn obsidian-btn-primary',
                    onClick: handleRollback,
                    disabled: !selectedVersion
                }, 
                    e(RotateCcwIcon),
                    'Rollback'
                )
            )
        );
    }

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

    // Top Bar Component
    function TopBar({ editorData, deviceMode, setDeviceMode, showResponsiveMenu, setShowResponsiveMenu, setShowExitModal }) {
        const handlePublish = () => {
            // TODO: Implement publish functionality
            console.log('Publishing...');
        };

        const handleSaveDraft = () => {
            // TODO: Implement save draft functionality
            console.log('Saving draft...');
        };

        return e('div', { className: 'obsidian-top-bar' },
            e('div', { className: 'obsidian-top-bar-left' },
                e('div', { className: 'obsidian-logo' },
                    e('div', { className: 'obsidian-logo-icon' }),
                    e('div', { className: 'obsidian-logo-text' }, 'OBSIDIAN')
                ),
                e('div', { className: 'obsidian-page-title' }, 
                    `Editing: ${editorData?.title || 'Untitled'}`
                ),
                e('button', { className: 'obsidian-icon-btn' }, e(SettingsIcon))
            ),
            e('div', { className: 'obsidian-top-bar-right' },
                e(ResponsiveControls, { 
                    deviceMode, 
                    setDeviceMode, 
                    showResponsiveMenu, 
                    setShowResponsiveMenu 
                }),
                e('button', {
                    className: 'obsidian-icon-btn',
                    onClick: handleSaveDraft
                }, e(SaveIcon)),
                e('button', {
                    className: 'obsidian-icon-btn',
                    onClick: () => setShowExitModal(true)
                }, e(ExitIcon)),
                e('button', {
                    className: 'obsidian-publish-btn',
                    onClick: handlePublish
                },
                    e('div', { className: 'obsidian-publish-text' }, 'Publish'),
                    e(CloudIcon)
                )
            )
        );
    }

    // Responsive Controls
    function ResponsiveControls({ deviceMode, setDeviceMode, showResponsiveMenu, setShowResponsiveMenu }) {
        const devices = [
            { key: 'desktop', label: 'Desktop', icon: MonitorIcon },
            { key: 'tablet', label: 'Tablet', icon: TabletIcon },
            { key: 'mobile', label: 'Mobile', icon: SmartphoneIcon }
        ];

        const currentDevice = devices.find(d => d.key === deviceMode);

        return e('div', { className: 'obsidian-responsive-controls' },
            e('button', {
                className: 'obsidian-icon-btn',
                onClick: () => setShowResponsiveMenu(!showResponsiveMenu)
            }, e(currentDevice.icon)),
            e('div', { 
                className: `obsidian-responsive-menu ${showResponsiveMenu ? 'active' : ''}` 
            },
                devices.map(device => 
                    e('button', {
                        key: device.key,
                        className: `obsidian-responsive-option ${deviceMode === device.key ? 'active' : ''}`,
                        onClick: () => {
                            setDeviceMode(device.key);
                            setShowResponsiveMenu(false);
                        }
                    }, device.label)
                )
            )
        );
    }

    // Preview Frame Component
    function PreviewFrame({ editorData, deviceMode }) {
        const [previewUrl, setPreviewUrl] = useState('');

        useEffect(() => {
            if (editorData && editorData.preview_url) {
                const url = editorData.preview_url + (editorData.preview_url.includes('?') ? '&' : '?') + 
                           'obsidian_preview=1&t=' + Date.now();
                setPreviewUrl(url);
            }
        }, [editorData]);

        if (!previewUrl) {
            return e('div', { className: 'obsidian-preview-frame' },
                e('div', { className: 'obsidian-loading' }, 'Loading preview...')
            );
        }

        return e('div', { className: 'obsidian-preview-frame' },
            e('div', { 
                className: 'obsidian-preview-wrapper',
                'data-device': deviceMode
            },
                deviceMode !== 'desktop' && e('div', { className: 'obsidian-resize-handle obsidian-resize-handle-left' }),
                deviceMode !== 'desktop' && e('div', { className: 'obsidian-resize-handle obsidian-resize-handle-right' }),
                e('iframe', {
                    src: previewUrl,
                    title: 'Page Preview'
                })
            )
        );
    }

    // Exit Confirmation Modal
    function ExitModal({ setShowExitModal }) {
        const handleExit = () => {
            if (window.obsidianData && window.obsidianData.adminUrl) {
                window.location.href = window.obsidianData.adminUrl + 'edit.php?post_type=page';
            }
        };

        return e('div', { className: 'obsidian-modal-overlay active' },
            e('div', { className: 'obsidian-modal' },
                e('h3', { className: 'obsidian-modal-title' }, 'Save Draft and Exit?'),
                e('p', { className: 'obsidian-modal-text' }, 
                    'Do you want to save your changes as a draft before exiting the editor?'
                ),
                e('div', { className: 'obsidian-modal-actions' },
                    e('button', {
                        className: 'obsidian-btn obsidian-btn-secondary',
                        onClick: () => setShowExitModal(false)
                    }, 'Cancel'),
                    e('button', {
                        className: 'obsidian-btn obsidian-btn-primary',
                        onClick: handleExit
                    }, 'Save & Exit')
                )
            )
        );
    }

    // Initialize the app
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
            setTimeout(initObsidianApp, 100);
        });
    }

})();