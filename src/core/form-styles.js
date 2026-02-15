/**
 * @fileoverview Shared Form Control Styles for AgentUI
 * 
 * Eliminates inline style duplication across au-checkbox, au-radio, au-switch.
 * All three share the same base layout pattern and state layer configuration.
 */

/**
 * Apply MD3 form control layout styles to the host element.
 * Shared by au-checkbox, au-radio (full set) and au-switch (partial).
 * 
 * @param {HTMLElement} el - Host element
 * @param {boolean} disabled - Whether the control is disabled
 */
export function applyFormControlLayout(el, disabled) {
    el.style.display = 'inline-flex';
    el.style.alignItems = 'center';
    el.style.gap = '12px';           // MD3: 12dp gap
    el.style.cursor = disabled ? 'not-allowed' : 'pointer';
    el.style.userSelect = 'none';
    el.style.minHeight = '48px';     // MD3: 48dp touch target
    el.style.padding = '0 4px';      // Touch-friendly padding
}

/**
 * Apply MD3 state layer styles (40dp circle for ripple confinement).
 * Used by au-checkbox and au-radio.
 * 
 * @param {HTMLElement} el - State layer element
 */
export function applyStateLayerStyles(el) {
    el.style.cssText = `
        width: 40px; height: 40px;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        position: relative; overflow: hidden;
        flex-shrink: 0;
    `;
}

/**
 * Update cursor style for disabled/enabled state.
 * Shared by all form controls in their updateState methods.
 * 
 * @param {HTMLElement} el - Host element
 * @param {boolean} disabled - Whether the control is disabled
 */
export function updateFormCursor(el, disabled) {
    el.style.cursor = disabled ? 'not-allowed' : 'pointer';
}
