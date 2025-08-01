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

    // Helper to generate a unique ID for messages
    let messageIdCounter = 0;
    const generateMessageId = () => `msg_${messageIdCounter++}`;

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

    function ChatContent({ sessionId, userId }) {
        const [message, setMessage] = useState('');
        const [chatMessages, setChatMessages] = useState([]);
        const chatMessagesEndRef = useRef(null);

        // Scroll to bottom of messages
        useEffect(() => {
            chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, [chatMessages]);

        const handleInputChange = (e) => {
            setMessage(e.target.value);
        };

        const handleSend = async () => {
            const userMessage = message.trim();
            if (!userMessage) return;

            // Add user message to chat
            setChatMessages(prevMessages => [...prevMessages, { id: generateMessageId(), role: 'user', text: userMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
            setMessage('');

            const agentMessageId = generateMessageId();
            let agentResponseText = '';

            // Add initial agent message placeholder
            setChatMessages(prevMessages => [...prevMessages, { id: agentMessageId, role: 'agent', text: '', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isComplete: false }]);

            try {
                const response = await fetch('https://obsidian-agent-service-313065021854.us-east1.run.app/run_sse', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        app_name: 'obsidian_agent',
                        user_id: userId,
                        session_id: sessionId,
                        new_message: {
                            role: 'user',
                            parts: [{ text: userMessage }]
                        },
                        streaming: true
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder('utf-8');

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n').filter(line => line.startsWith('data:'));

                    for (const line of lines) {
                        const data = line.substring(5).trim();
                        if (data) {
                            try {
                                const json = JSON.parse(data);
                                if (json.content && json.content.parts && json.content.parts[0]) {
                                    const part = json.content.parts[0];

                                    if (part.text) {
                                        const newContent = part.text;
                                        if (json.partial === true) {
                                            agentResponseText += newContent;
                                            setChatMessages(prevMessages =>
                                                prevMessages.map(msg =>
                                                    msg.id === agentMessageId ? { ...msg, text: agentResponseText } : msg
                                                )
                                            );
                                        } else {
                                            agentResponseText = newContent;
                                            setChatMessages(prevMessages =>
                                                prevMessages.map(msg =>
                                                    msg.id === agentMessageId ? { ...msg, text: agentResponseText, isComplete: true } : msg
                                                )
                                            );
                                        }
                                    } else if (part.functionCall) {
                                        const functionCall = part.functionCall;
                                        const functionCallText = `Function Call: ${functionCall.name}\nArgs: ${JSON.stringify(functionCall.args, null, 2)}`;
                                        setChatMessages(prevMessages => [...prevMessages, {
                                            id: generateMessageId(),
                                            role: 'agent',
                                            text: functionCallText,
                                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                            isComplete: true,
                                            type: 'functionCall', // Custom type for styling
                                            subtitle: 'functionCall'
                                        }]);
                                    } else if (part.functionResponse) {
                                        const functionResponse = part.functionResponse;
                                        const functionResponseText = `Function Response: ${functionResponse.name}\nResult: ${JSON.stringify(functionResponse.response.result || functionResponse.response, null, 2)}`;
                                        setChatMessages(prevMessages => [...prevMessages, {
                                            id: generateMessageId(),
                                            role: 'user', // Function responses are from the 'user' perspective (tool output)
                                            text: functionResponseText,
                                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                            isComplete: true,
                                            type: 'functionResponse', // Custom type for styling
                                            subtitle: 'functionResponse'
                                        }]);
                                    }
                                }
                            } catch (e) {
                                console.error('Error parsing SSE data:', e, data);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error sending message or receiving SSE:', error);
                setChatMessages(prevMessages =>
                    prevMessages.map(msg =>
                        msg.id === agentMessageId ? { ...msg, text: 'Error: Could not get a response from the AI agent.', isComplete: true } : msg
                    )
                );
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
                chatMessages.map((msg) =>
                    e('div', { key: msg.id, className: 'obsidian-message-group' },
                        e(MessageBubble, { type: msg.role, time: msg.time, subtitle: msg.subtitle }, msg.text)
                    )
                ),
                e('div', { ref: chatMessagesEndRef }) // Scroll anchor
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

    function HistoryContent({ editorData, currentVersion, setCurrentVersion, setHasChanges }) {
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
            if (selectedVersion && selectedVersion !== currentVersion) {
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
                        setCurrentVersion(selectedVersion);
                        setHasChanges(true);
                        setSelectedVersion(null);
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
                e(LoadingSpinner, { message: 'Loading revisions...' })
            );
        }

        return e('div', { className: 'obsidian-history-container active' },
            e('div', { className: 'obsidian-history-list' },
                historyItems.length === 0 ?
                    e('div', { className: 'obsidian-history-empty' }, 'No revisions found') :
                    historyItems.map(item => {
                        const isCurrentVersion = item.id === currentVersion;
                        const isSelected = selectedVersion === item.id;
                        
                        return e('div', {
                            key: item.id,
                            className: `obsidian-history-item ${isSelected ? 'selected' : ''} ${isCurrentVersion ? 'current' : ''}`,
                            onClick: () => !isCurrentVersion && setSelectedVersion(item.id)
                        },
                            e('div', { className: 'obsidian-history-version' },
                                `Version #${item.id}`,
                                isCurrentVersion && e('span', { className: 'obsidian-current-indicator' }, ' ✓')
                            ),
                            e('div', { className: 'obsidian-history-date' }, `${item.date_relative} (${item.date})`)
                        );
                    })
            ),
            e('div', { className: 'obsidian-history-actions' },
                e(Button, {
                    variant: 'secondary',
                    onClick: () => setSelectedVersion(null)
                }, 'Discard'),
                e(Button, {
                    onClick: handleRollback,
                    disabled: !selectedVersion || selectedVersion === currentVersion
                },
                    e(RotateCcwIcon),
                    'Rollback'
                )
            )
        );
    }

    function Sidebar({ activeTab, setActiveTab, editorData, currentVersion, setCurrentVersion, setHasChanges, sessionId, userId }) {
        return e('div', { className: 'obsidian-sidebar' },
            e(SidebarTabs, { activeTab, setActiveTab }),
            e('div', { className: 'obsidian-sidebar-content' },
                activeTab === 'chat' ?
                    e(ChatContent, { sessionId, userId }) :
                    e(HistoryContent, {
                        editorData,
                        currentVersion,
                        setCurrentVersion,
                        setHasChanges
                    })
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

    function TopBar({ editorData, deviceMode, setDeviceMode, showResponsiveMenu, setShowResponsiveMenu, setShowExitModal, hasChanges, setHasChanges }) {
        const handlePublish = async () => {
            if (!hasChanges || !editorData?.id) return;
            
            try {
                const response = await fetch(
                    `${window.obsidianData.apiUrl}posts/${editorData.id}/publish`,
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
                    console.log('Published successfully:', result);
                    setHasChanges(false);
                    // Optionally show success message
                } else {
                    console.error('Publish failed');
                }
            } catch (error) {
                console.error('Publish error:', error);
            }
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
                    className: `obsidian-publish-btn ${!hasChanges ? 'disabled' : ''}`,
                    onClick: handlePublish,
                    disabled: !hasChanges
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