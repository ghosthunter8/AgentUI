/**
 * @fileoverview TDD Tests for OPT-1: Slim and Agent entry points
 * Verifies that index-slim.js and index-agent.js export correctly.
 */

import '../setup-dom.js'; // LinkedOM compat patches (dispatchEvent, etc.)
import { describe, test, expect } from 'bun:test';

describe('index-slim (OPT-1)', () => {

    test('should export AuElement', async () => {
        const m = await import('../../src/index-slim.js');
        expect(typeof m.AuElement).toBe('function');
    });

    test('should export Theme', async () => {
        const m = await import('../../src/index-slim.js');
        expect(m.Theme).toBeDefined();
    });

    test('should export bus', async () => {
        const m = await import('../../src/index-slim.js');
        expect(m.bus).toBeDefined();
    });

    test('should export whenReady', async () => {
        const m = await import('../../src/index-slim.js');
        expect(typeof m.whenReady).toBe('function');
    });

    test('should NOT export AgentAPI', async () => {
        const m = await import('../../src/index-slim.js');
        expect(m.AgentAPI).toBeUndefined();
    });

    test('should NOT export ComponentSchema', async () => {
        const m = await import('../../src/index-slim.js');
        expect(m.ComponentSchema).toBeUndefined();
    });

    test('should NOT export getComponentSchema', async () => {
        const m = await import('../../src/index-slim.js');
        expect(m.getComponentSchema).toBeUndefined();
    });

    test('should export utility functions', async () => {
        const m = await import('../../src/index-slim.js');
        expect(typeof m.escapeHTML).toBe('function');
        expect(typeof m.html).toBe('function');
    });

    test('should export render utilities', async () => {
        const m = await import('../../src/index-slim.js');
        expect(typeof m.scheduler).toBeDefined();
        expect(typeof m.debounce).toBe('function');
    });
});

describe('index-agent (OPT-1)', () => {
    test('should export AgentAPI', async () => {
        const m = await import('../../src/index-agent.js');
        expect(m.AgentAPI).toBeDefined();
    });

    test('should export getAuComponentTree', async () => {
        const m = await import('../../src/index-agent.js');
        expect(typeof m.getAuComponentTree).toBe('function');
    });

    test('should export ComponentSchema', async () => {
        const m = await import('../../src/index-agent.js');
        expect(m.ComponentSchema).toBeDefined();
    });

    test('should export getComponentSchema', async () => {
        const m = await import('../../src/index-agent.js');
        expect(typeof m.getComponentSchema).toBe('function');
    });

    test('should export getAllSchemas', async () => {
        const m = await import('../../src/index-agent.js');
        expect(typeof m.getAllSchemas).toBe('function');
    });

    test('should export getMCPActions', async () => {
        const m = await import('../../src/index-agent.js');
        expect(typeof m.getMCPActions).toBe('function');
    });
});
