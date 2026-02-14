/**
 * @fileoverview TDD Tests for Framework-Level whenReady() Utility
 * 
 * Tests whenReady() Promise that resolves when all AgentUI components are registered.
 * Written BEFORE implementation.
 */

import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import '../setup-dom.js';

describe('whenReady()', () => {

    // Save and restore AgentUI state between tests
    let savedAgentUI;

    beforeEach(() => {
        savedAgentUI = globalThis.window?.AgentUI;
    });

    afterEach(() => {
        if (savedAgentUI !== undefined) {
            globalThis.window.AgentUI = savedAgentUI;
        }
    });

    // T7: whenReady() returns a Promise
    test('returns a Promise', async () => {
        // Import dynamically to get fresh module
        const { whenReady } = await import('../../src/index.js');
        const result = whenReady();
        expect(result).toBeInstanceOf(Promise);
    });

    // T8: whenReady() resolves immediately if already ready
    test('resolves immediately if AgentUI.ready is true', async () => {
        const { whenReady } = await import('../../src/index.js');
        // AgentUI.ready should have been set by index.js import
        if (globalThis.window?.AgentUI) {
            globalThis.window.AgentUI.ready = true;
        }
        const result = await whenReady();
        // Should resolve without hanging
        expect(result).toBeUndefined(); // resolves with undefined (or event)
    });

    // T9: whenReady is exported as a function
    test('is exported as a function from index.js', async () => {
        const mod = await import('../../src/index.js');
        expect(typeof mod.whenReady).toBe('function');
    });
});
