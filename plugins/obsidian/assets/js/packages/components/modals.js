// Obsidian Editor Modal Components
(function(window) {
    'use strict';

    const { createElement: e } = React;

    // Exit Confirmation Modal
    function ExitModal({ setShowExitModal, hasChanges, editorData }) {
        const handleDiscard = () => {
            // Exit without saving
            if (window.obsidianData && window.obsidianData.adminUrl) {
                window.location.href = window.obsidianData.adminUrl + 'edit.php?post_type=page';
            }
        };

        const handleSaveAndExit = async () => {
            if (!editorData?.id) {
                handleDiscard();
                return;
            }

            try {
                const response = await fetch(
                    `${window.obsidianData.apiUrl}posts/${editorData.id}/save`,
                    {
                        method: 'POST',
                        headers: {
                            'X-WP-Nonce': window.obsidianData.nonce,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            status: 'draft'
                        })
                    }
                );
                
                if (response.ok) {
                    const result = await response.json();
                    console.log('Draft saved successfully:', result);
                } else {
                    console.error('Save failed');
                }
            } catch (error) {
                console.error('Save error:', error);
            } finally {
                // Exit regardless of save success/failure
                if (window.obsidianData && window.obsidianData.adminUrl) {
                    window.location.href = window.obsidianData.adminUrl + 'edit.php?post_type=page';
                }
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