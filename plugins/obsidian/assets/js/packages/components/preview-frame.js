// Obsidian Editor Preview Frame Component
(function(window) {
    'use strict';

    const { createElement: e, useState, useEffect, useRef } = React;

    // Preview Frame Component
    function PreviewFrame({ editorData, deviceMode }) {
        const [previewUrl, setPreviewUrl] = useState('');
        const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
        const [isResizing, setIsResizing] = useState(false);
        const previewRef = useRef(null);

        // Device constraints
        const deviceConstraints = {
            tablet: { minWidth: 600, maxWidth: 1024, minHeight: 800, maxHeight: 1366 },
            mobile: { minWidth: 320, maxWidth: 428, minHeight: 568, maxHeight: 926 }
        };

        // Default dimensions
        const defaultDimensions = {
            desktop: { width: '100%', height: '100%' },
            tablet: { width: 768, height: 1024 },
            mobile: { width: 375, height: 667 }
        };

        useEffect(() => {
            if (editorData && editorData.preview_url) {
                const url = editorData.preview_url + (editorData.preview_url.includes('?') ? '&' : '?') + 
                           'obsidian_preview=1&t=' + Date.now();
                setPreviewUrl(url);
            }
        }, [editorData]);

        useEffect(() => {
            const defaultDims = defaultDimensions[deviceMode];
            setDimensions(defaultDims);
        }, [deviceMode]);

        // Resize handlers
        const handleMouseDown = (direction) => (e) => {
            if (deviceMode === 'desktop') return;
            
            e.preventDefault();
            setIsResizing(true);
            
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = dimensions.width;
            const startHeight = dimensions.height;
            const constraints = deviceConstraints[deviceMode];

            const handleMouseMove = (e) => {
                let newWidth = startWidth;
                let newHeight = startHeight;

                if (direction.includes('right')) {
                    newWidth = Math.max(constraints.minWidth, 
                              Math.min(constraints.maxWidth, startWidth + (e.clientX - startX)));
                }
                if (direction.includes('bottom')) {
                    newHeight = Math.max(constraints.minHeight, 
                               Math.min(constraints.maxHeight, startHeight + (e.clientY - startY)));
                }

                setDimensions({ width: newWidth, height: newHeight });
            };

            const handleMouseUp = () => {
                setIsResizing(false);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        };

        if (!previewUrl) {
            return e('div', { className: 'obsidian-preview-frame' },
                e('div', { className: 'obsidian-loading' }, 'Loading preview...')
            );
        }

        const wrapperStyle = deviceMode === 'desktop' ? {} : {
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`
        };

        return e('div', { className: 'obsidian-preview-frame' },
            e('div', { 
                ref: previewRef,
                className: 'obsidian-preview-wrapper',
                'data-device': deviceMode,
                style: wrapperStyle
            },
                // Device size indicator
                deviceMode !== 'desktop' && e('div', { className: 'obsidian-device-indicator' },
                    `${Math.round(dimensions.width)} × ${Math.round(dimensions.height)}`
                ),
                
                // Resize handles for tablet and mobile
                deviceMode !== 'desktop' && e('div', { 
                    className: 'obsidian-resize-handle obsidian-resize-handle-right',
                    onMouseDown: handleMouseDown('right')
                }),
                deviceMode !== 'desktop' && e('div', { 
                    className: 'obsidian-resize-handle obsidian-resize-handle-bottom',
                    onMouseDown: handleMouseDown('bottom')
                }),
                deviceMode !== 'desktop' && e('div', { 
                    className: 'obsidian-resize-handle obsidian-resize-handle-corner',
                    onMouseDown: handleMouseDown('right-bottom')
                }),
                
                e('iframe', {
                    src: previewUrl,
                    title: 'Page Preview',
                    style: { pointerEvents: isResizing ? 'none' : 'auto' }
                })
            )
        );
    }

    // Export to global namespace
    window.ObsidianComponents = window.ObsidianComponents || {};
    window.ObsidianComponents.PreviewFrame = PreviewFrame;

})(window);