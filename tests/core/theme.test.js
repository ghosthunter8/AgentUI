/**
 * @fileoverview Unit Tests for theme.js — Theme System
 * TDD: Tests written BEFORE createStore refactor.
 */

import { describe, test, expect, beforeEach, afterEach } from 'bun:test';

// ========================================================================
// Mock localStorage
// ========================================================================
const mockStorage = {};
function clearMockStorage() {
    for (const key of Object.keys(mockStorage)) delete mockStorage[key];
}
const mockLocalStorage = {
    getItem: (key) => mockStorage[key] ?? null,
    setItem: (key, value) => { mockStorage[key] = String(value); },
    removeItem: (key) => { delete mockStorage[key]; },
    clear: clearMockStorage
};

// ========================================================================
// Mock matchMedia
// ========================================================================
let prefersDark = false;
const mediaListeners = [];
const mockMatchMedia = (query) => ({
    matches: prefersDark,
    media: query,
    addEventListener: (type, fn) => { mediaListeners.push(fn); },
    removeEventListener: (type, fn) => {
        const idx = mediaListeners.indexOf(fn);
        if (idx >= 0) mediaListeners.splice(idx, 1);
    },
    addListener: () => { },
    removeListener: () => { },
    dispatchEvent: () => false,
});

// ========================================================================
// Setup globals before import
// ========================================================================
globalThis.localStorage = mockLocalStorage;
globalThis.window = globalThis.window || {};
globalThis.window.matchMedia = mockMatchMedia;
if (typeof globalThis.matchMedia === 'undefined') {
    globalThis.matchMedia = mockMatchMedia;
}

// We need document.documentElement for data-theme attribute
if (!globalThis.document) {
    const { parseHTML } = await import('linkedom');
    const dom = parseHTML('<!DOCTYPE html><html><body></body></html>');
    globalThis.document = dom.document;
    globalThis.window.document = dom.document;
}

describe('Theme Module', () => {
    let Theme, bus, UIEvents;

    beforeEach(async () => {
        // Reset state
        clearMockStorage();
        prefersDark = false;
        mediaListeners.length = 0;
        document.documentElement.removeAttribute('data-theme');

        // Fresh import each time to avoid stale singleton state
        // We need to bust the module cache — but since bun caches ES modules,
        // we import once and reset manually
        if (!Theme) {
            const themeModule = await import('../../src/core/theme.js');
            Theme = themeModule.Theme;
            const busModule = await import('../../src/core/bus.js');
            bus = busModule.bus;
            UIEvents = busModule.UIEvents;
        }

        // Reset theme state — clear store internal state via setState
        Theme.destroy();
        document.documentElement.removeAttribute('data-theme');
        // Reset the store's internal values to defaults so Proxy detects changes
        Theme._store.setState({ current: 'light', preference: 'auto' });
        clearMockStorage();
    });

    afterEach(() => {
        Theme.destroy();
    });

    // ========================================================================
    // BASIC API
    // ========================================================================

    test('Theme object has set, get, toggle, init, destroy methods', () => {
        expect(typeof Theme.set).toBe('function');
        expect(typeof Theme.get).toBe('function');
        expect(typeof Theme.toggle).toBe('function');
        expect(typeof Theme.init).toBe('function');
        expect(typeof Theme.destroy).toBe('function');
    });

    // ========================================================================
    // SET
    // ========================================================================

    test('set("dark") applies data-theme="dark" on <html>', () => {
        Theme.set('dark');
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    test('set("light") applies data-theme="light" on <html>', () => {
        Theme.set('light');
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    test('set("auto") uses system preference (light)', () => {
        prefersDark = false;
        Theme.set('auto');
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    test('set("auto") uses system preference (dark)', () => {
        prefersDark = true;
        Theme.set('auto');
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    // ========================================================================
    // GET
    // ========================================================================

    test('get() returns current theme value', () => {
        Theme.set('dark');
        expect(Theme.get()).toBe('dark');
    });

    test('get() defaults to "light" when no data-theme set', () => {
        document.documentElement.removeAttribute('data-theme');
        expect(Theme.get()).toBe('light');
    });

    // ========================================================================
    // TOGGLE
    // ========================================================================

    test('toggle() flips dark to light', () => {
        Theme.set('dark');
        Theme.toggle();
        expect(Theme.get()).toBe('light');
    });

    test('toggle() flips light to dark', () => {
        Theme.set('light');
        Theme.toggle();
        expect(Theme.get()).toBe('dark');
    });

    // ========================================================================
    // PERSISTENCE
    // ========================================================================

    test('set() persists preference to localStorage', () => {
        Theme.set('dark');
        // createStore persists under the 'agentui:' prefix
        const hasKey = Object.keys(mockStorage).some(key =>
            key.includes('theme') || key.includes('au-theme')
        );
        expect(hasKey).toBe(true);
    });

    test('init() restores saved theme from localStorage', () => {
        // Pre-seed localStorage with old key format for migration test
        mockStorage['au-theme'] = 'dark';
        Theme.init();
        expect(Theme.get()).toBe('dark');
    });

    test('init() falls back to auto when nothing saved', () => {
        // No saved preference
        prefersDark = true;
        Theme.init();
        // Should resolve to dark via auto
        expect(Theme.get()).toBe('dark');
    });

    // ========================================================================
    // BUS INTEGRATION
    // ========================================================================

    test('set() emits THEME_CHANGE event on bus', () => {
        let received = null;
        const unsub = bus.on(UIEvents.THEME_CHANGE, (data) => {
            received = data;
        });
        Theme.set('dark');
        expect(received).toBeTruthy();
        expect(received.theme).toBe('dark');
        unsub();
    });

    test('bus event fires for each set() call', () => {
        let callCount = 0;
        const unsub = bus.on(UIEvents.THEME_CHANGE, () => { callCount++; });
        Theme.set('dark');
        Theme.set('light');
        expect(callCount).toBe(2);
        unsub();
    });

    // ========================================================================
    // DESTROY
    // ========================================================================

    test('destroy() cleans up matchMedia listener', () => {
        Theme.init();
        const listenersBefore = mediaListeners.length;
        Theme.destroy();
        expect(mediaListeners.length).toBeLessThan(listenersBefore);
    });

    // ========================================================================
    // BUG FIX REGRESSION TESTS
    // ========================================================================

    // BUG #7: migration from old 'au-theme' key should work when preference is 'auto' (default)
    test('init() should migrate old au-theme key when store preference is auto', () => {
        // Store preference is 'auto' (default) — migration MUST happen
        mockStorage['au-theme'] = 'dark';
        Theme.init();
        expect(Theme.get()).toBe('dark');
        // Old key should be removed after migration
        expect(mockStorage['au-theme']).toBeUndefined();
    });

    test('init() should NOT migrate old key when preference is explicitly set', () => {
        // Simulate a user who already set a preference
        Theme.set('light');  // This persists 'light' in the store
        mockStorage['au-theme'] = 'dark';  // Old key from previous version
        Theme.init();
        // Should use the explicitly saved preference, not the old key
        expect(Theme.get()).toBe('light');
    });
});
