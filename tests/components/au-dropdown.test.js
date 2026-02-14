/**
 * @fileoverview Comprehensive Unit Tests for au-dropdown Component
 * Tests: registration, render trigger, value get/set, select() method,
 *        ARIA attributes, disabled state, au-option registration
 * 
 * Note: Popover API (showPopover/hidePopover) is not available in linkedom.
 * Tests focus on registration, DOM structure, and API surface.
 */

import { describe, test, expect, beforeAll, beforeEach } from 'bun:test';
import { dom, patchEmit, resetBody } from '../helpers/setup-dom.js';
const { document, body, customElements } = dom;

let AuDropdown, AuOption;

describe('au-dropdown Unit Tests', () => {

    beforeAll(async () => {
        const module = await import('../../src/components/au-dropdown.js');
        AuDropdown = module.AuDropdown;
        AuOption = module.AuOption;
        patchEmit(AuDropdown);
    });

    beforeEach(() => resetBody());

    // ========================================
    // REGISTRATION
    // ========================================

    test('should be registered', () => {
        expect(customElements.get('au-dropdown')).toBe(AuDropdown);
    });

    test('should have correct baseClass', () => {
        expect(AuDropdown.baseClass).toBe('au-dropdown');
    });

    test('should observe placeholder, value, disabled', () => {
        const attrs = AuDropdown.observedAttributes;
        expect(attrs).toContain('placeholder');
        expect(attrs).toContain('value');
        expect(attrs).toContain('disabled');
    });

    // ========================================
    // AU-OPTION REGISTRATION
    // ========================================

    test('au-option should be registered', () => {
        expect(customElements.get('au-option')).toBe(AuOption);
    });

    test('au-option should have correct baseClass', () => {
        expect(AuOption.baseClass).toBe('au-dropdown__option');
    });

    test('au-option should set role option on connect', () => {
        const opt = document.createElement('au-option');
        opt.textContent = 'Test';
        body.appendChild(opt);
        expect(opt.getAttribute('role')).toBe('option');
    });

    // ========================================
    // VALUE GET/SET
    // ========================================

    test('value getter should return empty string initially', () => {
        const el = document.createElement('au-dropdown');
        body.appendChild(el);
        expect(el.value).toBe('');
    });

    test('value setter should update attribute', () => {
        const el = document.createElement('au-dropdown');
        body.appendChild(el);
        el.value = 'test-value';
        expect(el.getAttribute('value')).toBe('test-value');
    });

    test('value getter should return set value', () => {
        const el = document.createElement('au-dropdown');
        body.appendChild(el);
        el.value = 'hello';
        expect(el.value).toBe('hello');
    });

    // ========================================
    // PUBLIC API
    // ========================================

    test('should have toggle() method', () => {
        const el = document.createElement('au-dropdown');
        body.appendChild(el);
        expect(typeof el.toggle).toBe('function');
    });

    test('should have open() method', () => {
        const el = document.createElement('au-dropdown');
        body.appendChild(el);
        expect(typeof el.open).toBe('function');
    });

    test('should have close() method', () => {
        const el = document.createElement('au-dropdown');
        body.appendChild(el);
        expect(typeof el.close).toBe('function');
    });

    test('should have select() method', () => {
        const el = document.createElement('au-dropdown');
        body.appendChild(el);
        expect(typeof el.select).toBe('function');
    });

    // ========================================
    // SELECT VS VALUE SETTER BEHAVIOR
    // ========================================

    test('select() should update the value attribute', () => {
        const el = document.createElement('au-dropdown');
        el.innerHTML = '<au-option value="low">Low</au-option><au-option value="high">High</au-option>';
        body.appendChild(el);

        // Wait for render (uses requestAnimationFrame)
        // In linkedom, rAF executes synchronously on next tick
        return new Promise(resolve => {
            setTimeout(() => {
                el.select('high', 'High');
                expect(el.value).toBe('high');
                expect(el.getAttribute('value')).toBe('high');
                resolve();
            }, 0);
        });
    });

    test('select() should update the displayed label text', () => {
        const el = document.createElement('au-dropdown');
        el.innerHTML = '<au-option value="low">Low</au-option><au-option value="high">High</au-option>';
        body.appendChild(el);

        return new Promise(resolve => {
            setTimeout(() => {
                el.select('high', 'High');
                const valueDisplay = el.querySelector('.au-dropdown__value');
                expect(valueDisplay?.textContent).toBe('High');
                resolve();
            }, 0);
        });
    });

    test('value setter should update attribute AND the displayed label', () => {
        const el = document.createElement('au-dropdown');
        el.setAttribute('placeholder', 'Select priority');
        el.innerHTML = '<au-option value="low">Low</au-option><au-option value="high">High</au-option>';
        body.appendChild(el);

        return new Promise(resolve => {
            setTimeout(() => {
                // Using .value = should update BOTH the attribute AND the displayed text
                el.value = 'high';
                expect(el.getAttribute('value')).toBe('high');

                const valueDisplay = el.querySelector('.au-dropdown__value');
                expect(valueDisplay?.textContent).toBe('High');
                resolve();
            }, 0);
        });
    });

    test('select() should emit au-select event', () => {
        const el = document.createElement('au-dropdown');
        el.innerHTML = '<au-option value="a">Option A</au-option>';
        body.appendChild(el);

        return new Promise(resolve => {
            setTimeout(() => {
                const events = [];
                el.addEventListener('au-select', e => events.push(e.detail));
                el.select('a', 'Option A');
                expect(events.length).toBe(1);
                expect(events[0].value).toBe('a');
                expect(events[0].label).toBe('Option A');
                resolve();
            }, 0);
        });
    });

    // ========================================================================
    // BUG FIX TDD TESTS — Dropdown Value Reflection
    // ========================================================================

    test('setAttribute("value") should also update the displayed label', () => {
        const el = document.createElement('au-dropdown');
        el.innerHTML = '<au-option value="x">Option X</au-option><au-option value="y">Option Y</au-option>';
        body.appendChild(el);

        return new Promise(resolve => {
            setTimeout(() => {
                el.setAttribute('value', 'y');
                const valueDisplay = el.querySelector('.au-dropdown__value');
                expect(valueDisplay?.textContent).toBe('Option Y');
                resolve();
            }, 0);
        });
    });

    test('value setter should NOT emit au-select event', () => {
        const el = document.createElement('au-dropdown');
        el.innerHTML = '<au-option value="a">A</au-option><au-option value="b">B</au-option>';
        body.appendChild(el);

        return new Promise(resolve => {
            setTimeout(() => {
                const events = [];
                el.addEventListener('au-select', e => events.push(e));
                el.value = 'b';
                // Programmatic value set should NOT emit au-select
                expect(events.length).toBe(0);
                resolve();
            }, 0);
        });
    });

    test('value setter with unknown value should not crash', () => {
        const el = document.createElement('au-dropdown');
        el.innerHTML = '<au-option value="a">A</au-option>';
        body.appendChild(el);

        return new Promise(resolve => {
            setTimeout(() => {
                // Setting a value that doesn't match any option
                expect(() => { el.value = 'nonexistent'; }).not.toThrow();
                // Attribute is still set
                expect(el.getAttribute('value')).toBe('nonexistent');
                resolve();
            }, 0);
        });
    });

    test('value setter should mark matching option as active', () => {
        const el = document.createElement('au-dropdown');
        el.innerHTML = '<au-option value="a">A</au-option><au-option value="b">B</au-option>';
        body.appendChild(el);

        return new Promise(resolve => {
            setTimeout(() => {
                el.value = 'b';
                const options = el.querySelectorAll('.au-dropdown__option');
                const activeOpt = Array.from(options).find(o => o.classList.contains('is-active'));
                expect(activeOpt?.getAttribute('data-value')).toBe('b');
                resolve();
            }, 0);
        });
    });

    test('disabled attribute should disable trigger button', () => {
        const el = document.createElement('au-dropdown');
        el.innerHTML = '<au-option value="a">A</au-option>';
        body.appendChild(el);

        return new Promise(resolve => {
            setTimeout(() => {
                el.setAttribute('disabled', '');
                const trigger = el.querySelector('.au-dropdown__trigger');
                expect(trigger?.disabled).toBe(true);
                resolve();
            }, 0);
        });
    });
});

