/**
 * @fileoverview AgentUI Core Chunk
 * Essential core functionality - always loaded first
 * 
 * When using chunks instead of the full bundle, this file:
 * - Sets up window.AgentUI with core utilities
 * - Emits the 'au-ready' event after all components are registered
 * - Registers the toast listener
 */

// Base class and utilities
export { AuElement, define } from '../core/AuElement.js';
export { bus, UIEvents, showToast } from '../core/bus.js';
export { Theme } from '../core/theme.js';

export { createRipple, attachRipple, RippleMixin } from '../core/ripple.js';

// View transitions
export {
    transition,
    transitionNamed,
    navigateWithTransition,
    supportsViewTransitions
} from '../core/transitions.js';

// Task scheduler
export {
    scheduleTask,
    yieldToMain,
    processWithYield,
    runBackground,
    runImmediate,
    supportsScheduler
} from '../core/scheduler.js';

// Render utilities
export {
    scheduler,
    memo,
    debounce,
    throttle,
    createVisibilityObserver,
    domBatch,
    processInChunks
} from '../core/render.js';

// Theme toggle (essential utility)
export { AuThemeToggle } from '../components/au-theme-toggle.js';
import '../components/au-theme-toggle.js';

// ============================================
// TOAST LISTENER REGISTRATION (Singleton)
// Uses LightBus-native hasListeners() instead of global flags
// ============================================
import { Toast as ToastService } from '../components/au-toast.js';
import { bus as toastBus, UIEvents as ToastEvents } from '../core/bus.js';

if (!toastBus.hasListeners(ToastEvents.TOAST_SHOW)) {
    toastBus.on(ToastEvents.TOAST_SHOW, (data) => {
        ToastService.show(data.message, data);
    });
}

// ============================================
// WINDOW.AGENTUI + AU-READY (Chunk users)
// Full bundle sets these up in index.js.
// When using chunks, core.js must do it.
// ============================================
import { Theme } from '../core/theme.js';
import { bus, UIEvents, showToast } from '../core/bus.js';

import { auConfirm } from '../components/au-confirm.js';
import { AuElement } from '../core/AuElement.js';
import { getAuComponentTree, describe as describeComponent, findByLabel, getRegisteredComponents } from '../core/agent-api.js';
import { loadDescriptions as _loadDescriptions, createDiscoverAll } from '../core/discovery.js';

if (typeof window !== 'undefined' && !window.AgentUI) {
    window.AgentUI = {
        // Theme
        Theme,
        // Bus
        bus,
        UIEvents,
        showToast,

        // Agent utilities
        getAuComponentTree,
        describeComponent,
        findByLabel,
        getRegisteredComponents,
        // Programmatic dialogs
        auConfirm,
        // Ready flag
        ready: false,

        // 🤖 AI AGENT DISCOVERY
        // Lazy-loads the describe catalog — zero cost until called
        discoverAll: createDiscoverAll(AuElement),

        // Pre-load describe catalog via fetch
        async loadDescriptions() {
            await _loadDescriptions(AuElement, { checkChunks: true });
        }
    };

    // ============================================
    // AU-READY EVENT
    // Fires when all AgentUI components are registered
    // Usage: document.addEventListener('au-ready', () => { ... })
    // ============================================
    const emitAuReady = () => {
        if (window.AGENTUI_DEBUG) {
            console.log('[AgentUI] All components registered, emitting au-ready');
        }
        window.AgentUI.ready = true;
        document.dispatchEvent(new CustomEvent('au-ready', {
            detail: {
                timestamp: Date.now()
            }
        }));
    };

    // Emit after all imports have been processed and DOM is ready.
    // setTimeout(0) defers to the next task, guaranteeing all
    // components from all imported chunks are registered.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', emitAuReady, { once: true });
    } else {
        setTimeout(emitAuReady, 0);
    }
}
