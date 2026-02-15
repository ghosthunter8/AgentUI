/**
 * @fileoverview TDD Tests for shared discovery module (OPT-6)
 * Verifies loadDescriptions() and discoverAll() are shared correctly.
 */

import { describe, test, expect, beforeAll, beforeEach } from 'bun:test';
import { parseHTML } from 'linkedom';

describe('discovery Module (OPT-6)', () => {
    let loadDescriptions, createDiscoverAll;

    beforeAll(async () => {
        const dom = parseHTML('<!DOCTYPE html><html><body></body></html>');
        globalThis.document = dom.document;
        globalThis.window = dom.window;
        globalThis.HTMLElement = dom.HTMLElement;
        globalThis.customElements = dom.customElements;

        const module = await import('../../src/core/discovery.js');
        loadDescriptions = module.loadDescriptions;
        createDiscoverAll = module.createDiscoverAll;
    });

    test('should export loadDescriptions function', () => {
        expect(typeof loadDescriptions).toBe('function');
    });

    test('should export createDiscoverAll function', () => {
        expect(typeof createDiscoverAll).toBe('function');
    });

    test('loadDescriptions should be a function that accepts AuElement class', () => {
        // loadDescriptions(AuElement) populates AuElement._describeCatalog
        expect(loadDescriptions.length).toBeGreaterThanOrEqual(1);
    });

    test('createDiscoverAll should return an async function', () => {
        const discoverAll = createDiscoverAll({});
        expect(typeof discoverAll).toBe('function');
    });

    test('discoverAll returned by createDiscoverAll should return object', async () => {
        // Mock a minimal AuElement with _describeCatalog already loaded
        const mockAuElement = { _describeCatalog: {} };
        const mockContext = {
            loadDescriptions: async () => { }
        };
        const discoverAll = createDiscoverAll(mockAuElement);
        const result = await discoverAll.call(mockContext);
        expect(typeof result).toBe('object');
    });
});
