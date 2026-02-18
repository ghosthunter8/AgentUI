/**
 * @fileoverview TDD Tests for shared constants module (OPT-5)
 * Verifies ALL_COMPONENT_TAGS is a single source of truth.
 */

import { describe, test, expect } from 'bun:test';

describe('constants Module (OPT-5)', () => {

    test('should export ALL_COMPONENT_TAGS array', async () => {
        const { ALL_COMPONENT_TAGS } = await import('../../src/core/constants.js');
        expect(Array.isArray(ALL_COMPONENT_TAGS)).toBe(true);
    });

    test('ALL_COMPONENT_TAGS should contain 56 known tags', async () => {
        const { ALL_COMPONENT_TAGS } = await import('../../src/core/constants.js');
        expect(ALL_COMPONENT_TAGS.length).toBe(56);
    });

    test('ALL_COMPONENT_TAGS should include critical components', async () => {
        const { ALL_COMPONENT_TAGS } = await import('../../src/core/constants.js');
        const critical = [
            'au-button', 'au-input', 'au-card', 'au-modal',
            'au-alert', 'au-dropdown', 'au-tabs', 'au-layout',
            'au-icon', 'au-code', 'au-router'
        ];
        for (const tag of critical) {
            expect(ALL_COMPONENT_TAGS).toContain(tag);
        }
    });

    test('ALL_COMPONENT_TAGS should have no duplicates', async () => {
        const { ALL_COMPONENT_TAGS } = await import('../../src/core/constants.js');
        const unique = new Set(ALL_COMPONENT_TAGS);
        expect(unique.size).toBe(ALL_COMPONENT_TAGS.length);
    });

    test('all tags should start with au-', async () => {
        const { ALL_COMPONENT_TAGS } = await import('../../src/core/constants.js');
        for (const tag of ALL_COMPONENT_TAGS) {
            expect(tag.startsWith('au-')).toBe(true);
        }
    });
});
