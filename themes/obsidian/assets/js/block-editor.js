/**
 * Obsidian Theme Block Editor JavaScript
 * Enhancements for the WordPress block editor
 *
 * @package Obsidian
 * @since 1.0.0
 */

(function() {
    'use strict';

    const { registerBlockStyle, unregisterBlockStyle } = wp.blocks;
    const { __ } = wp.i18n;

    // Wait for DOM to be ready
    wp.domReady(function() {
        
        // Add additional block styles
        registerBlockStyle('core/paragraph', {
            name: 'obsidian-large-text',
            label: __('Large Text', 'obsidian')
        });

        registerBlockStyle('core/paragraph', {
            name: 'obsidian-small-text',
            label: __('Small Text', 'obsidian')
        });

        registerBlockStyle('core/list', {
            name: 'obsidian-no-bullets',
            label: __('No Bullets', 'obsidian')
        });

        registerBlockStyle('core/list', {
            name: 'obsidian-checkmarks',
            label: __('Checkmarks', 'obsidian')
        });

        registerBlockStyle('core/separator', {
            name: 'obsidian-dots',
            label: __('Dots', 'obsidian')
        });

        registerBlockStyle('core/separator', {
            name: 'obsidian-gradient',
            label: __('Gradient', 'obsidian')
        });

        registerBlockStyle('core/columns', {
            name: 'obsidian-equal-height',
            label: __('Equal Height', 'obsidian')
        });

        registerBlockStyle('core/media-text', {
            name: 'obsidian-overlap',
            label: __('Overlap', 'obsidian')
        });

        // Remove default styles we don't want
        unregisterBlockStyle('core/button', 'outline');
        unregisterBlockStyle('core/quote', 'large');

        // Add custom CSS classes to editor
        const editorStyles = `
            .is-style-obsidian-large-text {
                font-size: 1.25rem;
                line-height: 1.6;
            }
            
            .is-style-obsidian-small-text {
                font-size: 0.875rem;
                opacity: 0.8;
            }
            
            .is-style-obsidian-no-bullets ul,
            .is-style-obsidian-no-bullets ol {
                list-style: none;
                padding-left: 0;
            }
            
            .is-style-obsidian-checkmarks ul li::before {
                content: "✓";
                color: var(--obsidian-color-primary, #2563eb);
                font-weight: bold;
                margin-right: 0.5rem;
            }
            
            .is-style-obsidian-dots.wp-block-separator {
                border: none;
                text-align: center;
            }
            
            .is-style-obsidian-dots.wp-block-separator::before {
                content: "• • •";
                color: var(--obsidian-color-muted, #6b7280);
                font-size: 1.5rem;
                letter-spacing: 1rem;
            }
            
            .is-style-obsidian-gradient.wp-block-separator {
                border: none;
                height: 3px;
                background: linear-gradient(90deg, transparent, var(--obsidian-color-primary, #2563eb), transparent);
            }
            
            .is-style-obsidian-equal-height.wp-block-columns {
                align-items: stretch;
            }
            
            .is-style-obsidian-equal-height .wp-block-column {
                display: flex;
                flex-direction: column;
            }
            
            .is-style-obsidian-overlap.wp-block-media-text .wp-block-media-text__media {
                z-index: 1;
            }
            
            .is-style-obsidian-overlap.wp-block-media-text .wp-block-media-text__content {
                background: rgba(255, 255, 255, 0.95);
                padding: 2rem;
                margin: -2rem;
                border-radius: 0.5rem;
                z-index: 2;
                position: relative;
            }
        `;

        // Inject styles into editor
        const styleElement = document.createElement('style');
        styleElement.textContent = editorStyles;
        document.head.appendChild(styleElement);

        // Add block editor enhancements
        addBlockEditorEnhancements();
    });

    /**
     * Add block editor enhancements
     */
    function addBlockEditorEnhancements() {
        // Add custom toolbar buttons
        addCustomToolbarButtons();
        
        // Add block inspector controls
        addBlockInspectorControls();
        
        // Add keyboard shortcuts
        addKeyboardShortcuts();
        
        // Add drag and drop enhancements
        addDragDropEnhancements();
    }

    /**
     * Add custom toolbar buttons
     */
    function addCustomToolbarButtons() {
        const { createHigherOrderComponent } = wp.compose;
        const { Fragment } = wp.element;
        const { InspectorControls, BlockControls } = wp.blockEditor;
        const { ToolbarGroup, ToolbarButton } = wp.components;

        const withCustomToolbar = createHigherOrderComponent((BlockEdit) => {
            return (props) => {
                const { name, attributes, setAttributes } = props;

                // Add animation toggle for supported blocks
                if (['core/group', 'core/columns', 'core/media-text'].includes(name)) {
                    return (
                        <Fragment>
                            <BlockEdit {...props} />
                            <BlockControls>
                                <ToolbarGroup>
                                    <ToolbarButton
                                        icon="admin-appearance"
                                        label={__('Toggle Animation', 'obsidian')}
                                        onClick={() => {
                                            const hasAnimation = attributes.className?.includes('obsidian-animate');
                                            const newClassName = hasAnimation
                                                ? attributes.className?.replace(/obsidian-animate\s?/g, '')
                                                : `${attributes.className || ''} obsidian-animate`.trim();
                                            setAttributes({ className: newClassName });
                                        }}
                                        isPressed={attributes.className?.includes('obsidian-animate')}
                                    />
                                </ToolbarGroup>
                            </BlockControls>
                        </Fragment>
                    );
                }

                return <BlockEdit {...props} />;
            };
        }, 'withCustomToolbar');

        wp.hooks.addFilter('editor.BlockEdit', 'obsidian/custom-toolbar', withCustomToolbar);
    }

    /**
     * Add block inspector controls
     */
    function addBlockInspectorControls() {
        const { createHigherOrderComponent } = wp.compose;
        const { Fragment } = wp.element;
        const { InspectorControls } = wp.blockEditor;
        const { PanelBody, ToggleControl, SelectControl } = wp.components;

        const withInspectorControls = createHigherOrderComponent((BlockEdit) => {
            return (props) => {
                const { name, attributes, setAttributes } = props;

                // Add custom controls for group blocks
                if (name === 'core/group') {
                    return (
                        <Fragment>
                            <BlockEdit {...props} />
                            <InspectorControls>
                                <PanelBody title={__('Obsidian Settings', 'obsidian')} initialOpen={false}>
                                    <ToggleControl
                                        label={__('Enable Animation', 'obsidian')}
                                        checked={attributes.className?.includes('obsidian-animate')}
                                        onChange={(value) => {
                                            const newClassName = value
                                                ? `${attributes.className || ''} obsidian-animate`.trim()
                                                : attributes.className?.replace(/obsidian-animate\s?/g, '');
                                            setAttributes({ className: newClassName });
                                        }}
                                    />
                                    <SelectControl
                                        label={__('Animation Type', 'obsidian')}
                                        value={getAnimationType(attributes.className)}
                                        options={[
                                            { label: __('Fade In', 'obsidian'), value: 'fade' },
                                            { label: __('Slide Left', 'obsidian'), value: 'slide-left' },
                                            { label: __('Slide Right', 'obsidian'), value: 'slide-right' },
                                            { label: __('Scale', 'obsidian'), value: 'scale' },
                                        ]}
                                        onChange={(value) => {
                                            let newClassName = attributes.className || '';
                                            // Remove existing animation classes
                                            newClassName = newClassName.replace(/obsidian-animate-\w+/g, '');
                                            // Add new animation class
                                            if (value !== 'fade') {
                                                newClassName += ` obsidian-animate-${value}`;
                                            }
                                            setAttributes({ className: newClassName.trim() });
                                        }}
                                        disabled={!attributes.className?.includes('obsidian-animate')}
                                    />
                                </PanelBody>
                            </InspectorControls>
                        </Fragment>
                    );
                }

                return <BlockEdit {...props} />;
            };
        }, 'withInspectorControls');

        wp.hooks.addFilter('editor.BlockEdit', 'obsidian/inspector-controls', withInspectorControls);
    }

    /**
     * Get animation type from className
     */
    function getAnimationType(className) {
        if (!className) return 'fade';
        if (className.includes('obsidian-animate-slide-left')) return 'slide-left';
        if (className.includes('obsidian-animate-slide-right')) return 'slide-right';
        if (className.includes('obsidian-animate-scale')) return 'scale';
        return 'fade';
    }

    /**
     * Add keyboard shortcuts
     */
    function addKeyboardShortcuts() {
        const { registerShortcut } = wp.keyboardShortcuts;
        const { dispatch } = wp.data;

        // Register custom shortcuts
        registerShortcut({
            name: 'obsidian/toggle-animation',
            category: 'block',
            description: __('Toggle animation on selected block', 'obsidian'),
            keyCombination: {
                modifier: 'primaryShift',
                character: 'a',
            },
        });

        // Handle shortcut actions
        wp.hooks.addAction('obsidian.toggleAnimation', 'obsidian/keyboard-shortcuts', () => {
            const selectedBlock = wp.data.select('core/block-editor').getSelectedBlock();
            if (selectedBlock) {
                const { attributes } = selectedBlock;
                const hasAnimation = attributes.className?.includes('obsidian-animate');
                const newClassName = hasAnimation
                    ? attributes.className?.replace(/obsidian-animate\s?/g, '')
                    : `${attributes.className || ''} obsidian-animate`.trim();
                
                dispatch('core/block-editor').updateBlockAttributes(selectedBlock.clientId, {
                    className: newClassName
                });
            }
        });
    }

    /**
     * Add drag and drop enhancements
     */
    function addDragDropEnhancements() {
        // Add visual feedback for drag and drop
        document.addEventListener('dragstart', function(e) {
            if (e.target.closest('.wp-block')) {
                document.body.classList.add('obsidian-dragging');
            }
        });

        document.addEventListener('dragend', function(e) {
            document.body.classList.remove('obsidian-dragging');
        });

        // Add drop zone styling
        const dropZoneStyles = `
            .obsidian-dragging .block-editor-block-list__insertion-point-indicator {
                background: var(--obsidian-color-primary, #2563eb);
                height: 3px;
            }
            
            .obsidian-dragging .block-editor-block-list__insertion-point-inserter {
                background: var(--obsidian-color-primary, #2563eb);
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.textContent = dropZoneStyles;
        document.head.appendChild(styleElement);
    }

    /**
     * Add block variations
     */
    function addBlockVariations() {
        const { registerBlockVariation } = wp.blocks;

        // Add button variations
        registerBlockVariation('core/button', {
            name: 'obsidian-cta-button',
            title: __('CTA Button', 'obsidian'),
            description: __('A call-to-action button with Obsidian styling', 'obsidian'),
            attributes: {
                className: 'is-style-obsidian-cta',
                backgroundColor: 'primary',
                textColor: 'background',
                fontSize: 'large'
            },
            scope: ['inserter']
        });

        // Add group variations
        registerBlockVariation('core/group', {
            name: 'obsidian-feature-box',
            title: __('Feature Box', 'obsidian'),
            description: __('A styled box for featuring content', 'obsidian'),
            attributes: {
                className: 'is-style-obsidian-card obsidian-animate'
            },
            innerBlocks: [
                ['core/heading', { level: 3, placeholder: __('Feature Title', 'obsidian') }],
                ['core/paragraph', { placeholder: __('Feature description...', 'obsidian') }]
            ],
            scope: ['inserter']
        });
    }

    // Initialize block variations
    wp.domReady(addBlockVariations);

})();