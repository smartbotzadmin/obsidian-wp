// Obsidian Editor Components Package
(function(window) {
    'use strict';

    const { createElement: e, useState, useEffect, useRef } = React;
    const { 
        SendIcon, 
        SettingsIcon, 
        MonitorIcon, 
        TabletIcon, 
        SmartphoneIcon, 
        CloudIcon, 
        ExitIcon, 
        RotateCcwIcon 
    } = window.ObsidianIcons;
    
    const {
        LoadingSpinner,
        IconButton,
        Button,
        ModalButton,
        Modal,
        TabContainer,
        Tab,
        TextArea,
        MessageBubble,
        PostModifiedNotification,
        HistoryItem,
        DropdownMenu,
        DropdownOption
    } = window.ObsidianUI;

    // Sidebar Components
    function SidebarTabs({ activeTab, setActiveTab }) {
        return e(TabContainer, null,
            e(Tab, { 
                isActive: activeTab === 'chat',
                onClick: () => setActiveTab('chat')
            }, 'Chat'),
            e(Tab, { 
                isActive: activeTab === 'history',
                onClick: () => setActiveTab('history')
            }, 'History')
        );
    }

    function ChatContent() {
        const [message, setMessage] = useState('');

        const handleInputChange = (e) => {
            setMessage(e.target.value);
        };

        const handleSend = () => {
            if (message.trim()) {
                console.log('Sending message:', message);
                setMessage('');
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
                // Demo messages
                e('div', { className: 'obsidian-message-group' },
                    e(MessageBubble, { type: 'user', time: '2:38 PM' },
                        'I would like my homepage to display a black friday sale section, i think it should have a classic and a sweet matcha cards. You can make up the third one. Put it above the why us section.'
                    )
                ),
                e('div', { className: 'obsidian-message-group' },
                    e(MessageBubble, { type: 'assistant', time: '2:39 PM' },
                        'Of course! Allow me to take a look at your page and I will modify it for you.'
                    ),
                    e(PostModifiedNotification),
                    e(MessageBubble, { type: 'assistant', time: '2:41 PM' },
                        'Does this seem in line with what you are looking for? I have created a section that makes sense for your brand.\n\nI have also added 3 types of products for the homepage demo.'
                    )
                )
            ),
            e('div', { className: 'obsidian-chat-input-container' },
                e('div', { className: 'obsidian-chat-input-wrapper' },
                    e(TextArea, {
                        placeholder: 'Ask Obsidian...',
                        value: message,
                        onChange: handleInputChange,
                        onKeyPress: handleKeyPress
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
                e(LoadingSpinner, { message: 'Loading revisions...' })
            );
        }

        return e('div', { className: 'obsidian-history-container active' },
            e('div', { className: 'obsidian-history-list' },
                historyItems.length === 0 ?
                    e('div', { className: 'obsidian-history-empty' }, 'No revisions found') :
                    historyItems.map(item =>
                        e(HistoryItem, {
                            key: item.id,
                            version: item.id,
                            date: `${item.date_relative} (${item.date})`,
                            isSelected: selectedVersion === item.id,
                            onClick: () => setSelectedVersion(item.id)
                        })
                    )
            ),
            e('div', { className: 'obsidian-history-actions' },
                e(Button, { 
                    variant: 'secondary',
                    onClick: () => setSelectedVersion(null)
                }, 'Discard'),
                e(Button, { 
                    onClick: handleRollback,
                    disabled: !selectedVersion
                }, 
                    e(RotateCcwIcon),
                    'Rollback'
                )
            )
        );
    }

    function Sidebar({ activeTab, setActiveTab, editorData }) {
        return e('div', { className: 'obsidian-sidebar' },
            e(SidebarTabs, { activeTab, setActiveTab }),
            e('div', { className: 'obsidian-sidebar-content' },
                activeTab === 'chat' ? e(ChatContent) : e(HistoryContent, { editorData })
            )
        );
    }

    // Top Bar Components
    function ResponsiveControls({ deviceMode, setDeviceMode, showResponsiveMenu, setShowResponsiveMenu }) {
        const devices = [
            { 
                key: 'desktop', 
                label: 'Desktop', 
                icon: MonitorIcon, 
                size: 'Full Width',
                description: 'Desktop view with full canvas'
            },
            { 
                key: 'tablet', 
                label: 'Tablet', 
                icon: TabletIcon, 
                size: '768×1024',
                description: 'Tablet view with resizable frame'
            },
            { 
                key: 'mobile', 
                label: 'Mobile', 
                icon: SmartphoneIcon, 
                size: '375×667',
                description: 'Mobile view with resizable frame'
            }
        ];

        const currentDevice = devices.find(d => d.key === deviceMode);

        // Close menu when clicking outside
        useEffect(() => {
            const handleClickOutside = (event) => {
                if (showResponsiveMenu && !event.target.closest('.obsidian-responsive-controls')) {
                    setShowResponsiveMenu(false);
                }
            };

            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, [showResponsiveMenu, setShowResponsiveMenu]);

        return e('div', { className: 'obsidian-responsive-controls' },
            e(IconButton, {
                icon: currentDevice.icon,
                onClick: () => setShowResponsiveMenu(!showResponsiveMenu),
                'aria-label': `Current device: ${currentDevice.label}`
            }),
            e(DropdownMenu, { isOpen: showResponsiveMenu },
                devices.map(device => 
                    e(DropdownOption, {
                        key: device.key,
                        isActive: deviceMode === device.key,
                        onClick: () => {
                            setDeviceMode(device.key);
                            setShowResponsiveMenu(false);
                        },
                        icon: device.icon,
                        label: device.label,
                        size: device.size
                    })
                )
            )
        );
    }

    function TopBar({ editorData, deviceMode, setDeviceMode, showResponsiveMenu, setShowResponsiveMenu, setShowExitModal }) {
        const handlePublish = () => {
            console.log('Publishing...');
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
                e(IconButton, { icon: SettingsIcon })
            ),
            e('div', { className: 'obsidian-top-bar-right' },
                e(IconButton, {
                    icon: ExitIcon,
                    onClick: () => setShowExitModal(true)
                }),
                e(ResponsiveControls, { 
                    deviceMode, 
                    setDeviceMode, 
                    showResponsiveMenu, 
                    setShowResponsiveMenu 
                }),
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

    // Export components to global namespace
    window.ObsidianComponents = {
        Sidebar,
        SidebarTabs,
        ChatContent,
        HistoryContent,
        TopBar,
        ResponsiveControls
    };

})(window);