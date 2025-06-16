// Obsidian Editor Icons Package
(function(window) {
    'use strict';

    const { createElement: e } = React;

    // Icon Components
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

    // Export icons to global namespace
    window.ObsidianIcons = {
        SendIcon,
        SettingsIcon,
        MonitorIcon,
        TabletIcon,
        SmartphoneIcon,
        CloudIcon,
        SaveIcon,
        ExitIcon,
        RotateCcwIcon
    };

})(window);