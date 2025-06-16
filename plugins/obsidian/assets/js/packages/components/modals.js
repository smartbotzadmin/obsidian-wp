// Obsidian Editor Modal Components
(function(window) {
    'use strict';

    const { createElement: e } = React;

    // Exit Confirmation Modal
    function ExitModal({ setShowExitModal }) {
        const handleDiscard = () => {
            // Exit without saving
            if (window.obsidianData && window.obsidianData.adminUrl) {
                window.location.href = window.obsidianData.adminUrl + 'edit.php?post_type=page';
            }
        };

        const handleSaveAndExit = async () => {
            try {
                console.log('Saving draft...');
                
                // For now, just exit after a brief delay
                setTimeout(() => {
                    if (window.obsidianData && window.obsidianData.adminUrl) {
                        window.location.href = window.obsidianData.adminUrl + 'edit.php?post_type=page';
                    }
                }, 500);
            } catch (error) {
                console.error('Save failed:', error);
            }
        };

        return e('div', { className: 'obsidian-modal-overlay active' },
            e('div', { className: 'obsidian-modal' },
                e('h3', { className: 'obsidian-modal-title' }, 'Exit Editor'),
                e('p', { className: 'obsidian-modal-text' },
                    'You have unsaved changes. What would you like to do before exiting?'
                ),
                e('div', { className: 'obsidian-modal-actions' },
                    e('button', {
                        className: 'obsidian-modal-btn obsidian-modal-btn-cancel',
                        onClick: () => setShowExitModal(false)
                    }, 'Cancel'),
                    e('button', {
                        className: 'obsidian-modal-btn obsidian-modal-btn-discard',
                        onClick: handleDiscard
                    }, 'Discard'),
                    e('button', {
                        className: 'obsidian-modal-btn obsidian-modal-btn-save',
                        onClick: handleSaveAndExit
                    }, 'Save & Exit')
                )
            )
        );
    }

    // Export to global namespace
    window.ObsidianComponents = window.ObsidianComponents || {};
    window.ObsidianComponents.ExitModal = ExitModal;

})(window);