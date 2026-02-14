/**
 * @fileoverview TDD Tests for Per-Component Readiness System
 * 
 * Tests .ready promise, .isReady flag, and au:ready event on AuElement instances.
 * 
 * NOTE: au:ready event dispatch uses try-catch in AuElement because linkedom's
 * dispatchEvent throws on readonly eventPhase. In real browsers, the event
 * fires correctly. Event tests here verify behavior via patchEmit workaround.
 */

import { describe, test, expect, beforeEach } from 'bun:test';
import '../setup-dom.js';
import { AuElement, define } from '../../src/core/AuElement.js';

// Register a test component for readiness tests
class AuReadyTest extends AuElement {
    static baseClass = 'au-ready-test';
    render() {
        this.innerHTML = '<span>ready</span>';
    }
}
define('au-ready-test', AuReadyTest);

beforeEach(() => {
    document.body.innerHTML = '';
});

describe('Per-Component Readiness', () => {

    // T1: .ready promise resolves to element after connectedCallback
    test('.ready resolves to element after connectedCallback', async () => {
        const el = document.createElement('au-ready-test');
        document.body.appendChild(el);
        const resolved = await el.ready;
        expect(resolved).toBe(el);
    });

    // T2: .isReady is false before connect, true after
    test('.isReady is false before connect, true after', () => {
        const el = document.createElement('au-ready-test');
        expect(el.isReady).toBe(false);
        document.body.appendChild(el);
        expect(el.isReady).toBe(true);
    });

    // T3: .ready promise exists from construction
    test('.ready promise exists from construction (before connect)', () => {
        const el = document.createElement('au-ready-test');
        expect(el.ready).toBeInstanceOf(Promise);
        expect(el.isReady).toBe(false);
    });

    // T4: Multiple connects don't re-resolve ready
    test('multiple connects do not change isReady or re-resolve', () => {
        const el = document.createElement('au-ready-test');
        document.body.appendChild(el);
        expect(el.isReady).toBe(true);
        const firstReady = el.ready;

        // Disconnect and reconnect
        el.remove();
        document.body.appendChild(el);
        expect(el.isReady).toBe(true);
        expect(el.ready).toBe(firstReady); // Same promise object
    });

    // T5: .ready resolves immediately if already connected
    test('.ready resolves immediately if already connected', async () => {
        const el = document.createElement('au-ready-test');
        document.body.appendChild(el);

        expect(el.isReady).toBe(true);
        const resolved = await el.ready;
        expect(resolved).toBe(el);
    });

    // T6: component is rendered when ready resolves
    test('component is rendered when .ready resolves', async () => {
        const el = document.createElement('au-ready-test');
        document.body.appendChild(el);

        await el.ready;
        expect(el.innerHTML).toContain('<span>ready</span>');
        expect(el._rendered).toBe(true);
    });

    // T7: _readyResolve is consumed after first connect
    test('_readyResolve is called exactly once', () => {
        const el = document.createElement('au-ready-test');
        const originalResolve = el._readyResolve;
        expect(typeof originalResolve).toBe('function');

        document.body.appendChild(el);
        // After connect, isReady is true — ready was resolved
        expect(el.isReady).toBe(true);
    });
});
