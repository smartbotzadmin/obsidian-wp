// Obsidian Editor UI Components Package
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

    // Loading Component
    function LoadingSpinner({ message = 'Loading...' }) {
        return e('div', { className: 'obsidian-loading' },
            e('div', { className: 'obsidian-loading-spinner' }),
            message
        );
    }

    // Button Components
    function IconButton({ icon, onClick, className = '', disabled = false, 'aria-label': ariaLabel }) {
        return e('button', {
            className: `obsidian-icon-btn ${className}`,
            onClick,
            disabled,
            'aria-label': ariaLabel
        }, e(icon));
    }

    function Button({ children, onClick, className = '', variant = 'primary', disabled = false }) {
        const baseClass = 'obsidian-btn';
        const variantClass = variant === 'secondary' ? 'obsidian-btn-secondary' : 'obsidian-btn-primary';
        
        return e('button', {
            className: `${baseClass} ${variantClass} ${className}`,
            onClick,
            disabled
        }, children);
    }

    function ModalButton({ children, onClick, className = '', variant = 'primary', disabled = false }) {
        const baseClass = 'obsidian-modal-btn';
        const variantClass = `obsidian-modal-btn-${variant}`;
        
        return e('button', {
            className: `${baseClass} ${variantClass} ${className}`,
            onClick,
            disabled
        }, children);
    }


    // Tab Components
    function TabContainer({ children, className = '' }) {
        return e('div', { className: `obsidian-sidebar-tabs ${className}` }, children);
    }

    function Tab({ isActive, onClick, children, className = '' }) {
        return e('div', { 
            className: `obsidian-tab ${className}`,
            'data-active': isActive,
            onClick
        },
            e('div', { className: 'obsidian-tab-inner' },
                e('div', { className: 'obsidian-tab-text' }, children)
            )
        );
    }

    // Input Components
    function TextArea({ 
        value, 
        onChange, 
        onKeyPress, 
        placeholder, 
        className = '', 
        minHeight = 40, 
        maxHeight = 200,
        autoResize = true 
    }) {
        const textareaRef = useRef(null);

        const handleChange = (e) => {
            onChange(e);
            if (autoResize) {
                adjustHeight();
            }
        };

        const adjustHeight = () => {
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
                const scrollHeight = textareaRef.current.scrollHeight;
                textareaRef.current.style.height = Math.min(scrollHeight, maxHeight) + 'px';
            }
        };

        return e('textarea', {
            ref: textareaRef,
            className: `obsidian-chat-input ${className}`,
            placeholder,
            value,
            onChange: handleChange,
            onKeyPress,
            rows: 1,
            style: { minHeight: `${minHeight}px`, maxHeight: `${maxHeight}px` }
        });
    }

    // Message Components
    function MessageBubble({ type, children, time, className = '' }) {
        const isUser = type === 'user';
        const bubbleClass = isUser ? 'obsidian-message-user-bubble' : 'obsidian-message-assistant-bubble';
        const textClass = isUser ? 'obsidian-message-user-text' : 'obsidian-message-assistant-text';

        return e('div', { className: `obsidian-message-${type} ${className}` },
            e('div', { className: bubbleClass },
                e('div', { className: textClass }, children)
            ),
            time && e('div', { className: 'obsidian-message-time' }, time)
        );
    }

    function PostModifiedNotification({ className = '' }) {
        return e('div', { className: `obsidian-post-modified ${className}` },
            e('div', { className: 'obsidian-post-modified-icon' }),
            e('div', { className: 'obsidian-post-modified-text' }, 'Post modified')
        );
    }

    // List Components
    function HistoryItem({ version, date, isSelected, onClick, className = '' }) {
        return e('div', {
            className: `obsidian-history-item ${isSelected ? 'selected' : ''} ${className}`,
            onClick
        },
            e('div', { className: 'obsidian-history-version' }, `Version #${version}`),
            e('div', { className: 'obsidian-history-date' }, date)
        );
    }

    // Dropdown Components
    function DropdownMenu({ isOpen, children, className = '' }) {
        return e('div', { 
            className: `obsidian-responsive-menu ${isOpen ? 'active' : ''} ${className}` 
        }, children);
    }

    function DropdownOption({ isActive, onClick, icon, label, size, className = '' }) {
        return e('button', {
            className: `obsidian-responsive-option ${isActive ? 'active' : ''} ${className}`,
            onClick
        }, 
            icon && e(icon),
            e('div', { className: 'obsidian-responsive-option-text' },
                e('div', null, label),
                size && e('div', { className: 'obsidian-responsive-option-size' }, size)
            )
        );
    }

    // Export UI components to global namespace
    window.ObsidianUI = {
        LoadingSpinner,
        IconButton,
        Button,
        ModalButton,
        TabContainer,
        Tab,
        TextArea,
        MessageBubble,
        PostModifiedNotification,
        HistoryItem,
        DropdownMenu,
        DropdownOption
    };

})(window);