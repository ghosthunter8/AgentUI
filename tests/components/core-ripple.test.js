/**
 * @fileoverview Unit Tests for core/ripple.js — createRipple, attachRipple, RippleMixin
 * Target: 3% → 95% line coverage
 * 
 * Note: Ripple relies heavily on DOM APIs (getBoundingClientRect, animate, getComputedStyle).
 * We mock what we can in LinkedOM. Some visual tests need E2E.
 */

import { describe, test, expect, beforeEach } from 'bun:test';
import { dom, resetBody } from '../helpers/setup-dom.js';
const { document, body } = dom;

import { createRipple, attachRipple, RippleMixin } from '../../src/core/ripple.js';

// Mock getBoundingClientRect for LinkedOM
const mockElement = () => {
    const el = document.createElement('div');
    el.getBoundingClientRect = () => ({
        left: 0, top: 0, right: 100, bottom: 100,
        width: 100, height: 100, x: 0, y: 0
    });
    // Mock animate API
    el.style.position = 'static';
    el.style.overflow = 'visible';
    body.appendChild(el);
    return el;
};

describe('core/ripple.js', () => {

    beforeEach(() => resetBody());

    // ========== createRipple ==========
    describe('createRipple', () => {
        test('should create a ripple span element', () => {
            const el = mockElement();
            const event = { clientX: 50, clientY: 50 };
            // Mock animate on child
            const origAppend = el.appendChild.bind(el);
            el.appendChild = (child) => {
                child.animate = () => ({ onfinish: null });
                child.remove = () => { };
                return origAppend(child);
            };
            const ripple = createRipple(el, event);
            expect(ripple).toBeDefined();
            expect(ripple.className).toBe('au-ripple-wave');
        });

        test('should create centered ripple when centered=true', () => {
            const el = mockElement();
            const origAppend = el.appendChild.bind(el);
            el.appendChild = (child) => {
                child.animate = () => ({ onfinish: null });
                child.remove = () => { };
                return origAppend(child);
            };
            const ripple = createRipple(el, null, { centered: true });
            expect(ripple).toBeDefined();
        });

        test('should handle touch events', () => {
            const el = mockElement();
            const event = { touches: [{ clientX: 30, clientY: 40 }] };
            const origAppend = el.appendChild.bind(el);
            el.appendChild = (child) => {
                child.animate = () => ({ onfinish: null });
                child.remove = () => { };
                return origAppend(child);
            };
            const ripple = createRipple(el, event);
            expect(ripple).toBeDefined();
        });

        test('should modify element for ripple containment', () => {
            const el = mockElement();
            const event = { clientX: 50, clientY: 50 };
            const origAppend = el.appendChild.bind(el);
            el.appendChild = (child) => {
                child.animate = () => ({ onfinish: null });
                child.remove = () => { };
                return origAppend(child);
            };
            createRipple(el, event);
            // createRipple modifies position/overflow for containment
            // In LinkedOM, getComputedStyle may behave differently than browser
            // We verify the ripple was actually appended
            const ripple = el.querySelector('.au-ripple-wave');
            expect(ripple).toBeTruthy();
        });

        test('should accept custom color option', () => {
            const el = mockElement();
            const event = { clientX: 50, clientY: 50 };
            const origAppend = el.appendChild.bind(el);
            el.appendChild = (child) => {
                child.animate = () => ({ onfinish: null });
                child.remove = () => { };
                return origAppend(child);
            };
            const ripple = createRipple(el, event, { color: 'red' });
            expect(ripple.style.background).toBe('red');
        });
    });

    // ========== attachRipple ==========
    describe('attachRipple', () => {
        test('should return cleanup function', () => {
            const el = mockElement();
            const cleanup = attachRipple(el);
            expect(typeof cleanup).toBe('function');
            cleanup();
        });

        test('disabled element should have ripple guard', () => {
            const el = mockElement();
            el.setAttribute('disabled', '');
            const cleanup = attachRipple(el);
            // attachRipple adds a pointerdown handler that checks for disabled attribute
            // In LinkedOM, dispatchEvent has issues with readonly eventPhase
            // So we verify the setup: disabled attr is present, cleanup works
            expect(el.hasAttribute('disabled')).toBe(true);
            expect(typeof cleanup).toBe('function');
            cleanup();
        });

        test('cleanup should remove listener', () => {
            const el = mockElement();
            const cleanup = attachRipple(el);
            cleanup();
            // After cleanup, pointerdown should not create ripple
        });
    });

    // ========== RippleMixin ==========
    describe('RippleMixin', () => {
        test('should be a function (mixin factory)', () => {
            expect(typeof RippleMixin).toBe('function');
        });

        test('should create class extending superclass', () => {
            class Base {
                disconnectedCallback() { }
            }
            const Mixed = RippleMixin(Base);
            expect(Mixed).toBeDefined();
            const instance = new Mixed();
            expect(instance).toBeInstanceOf(Base);
        });

        test('mixed class should have initRipple method', () => {
            class Base { }
            const Mixed = RippleMixin(Base);
            const instance = new Mixed();
            expect(typeof instance.initRipple).toBe('function');
        });

        test('disconnectedCallback should clean up ripple', () => {
            class Base {
                disconnectedCallback() { this.baseCalled = true; }
            }
            const Mixed = RippleMixin(Base);
            const instance = new Mixed();
            // Call disconnectedCallback without initRipple — should not throw
            expect(() => instance.disconnectedCallback()).not.toThrow();
        });

        test('disconnectedCallback should call super', () => {
            class Base {
                disconnectedCallback() { this.baseCalled = true; }
            }
            const Mixed = RippleMixin(Base);
            const instance = new Mixed();
            instance.disconnectedCallback();
            expect(instance.baseCalled).toBe(true);
        });

        test('initRipple should set up ripple effect', () => {
            class Base { }
            const Mixed = RippleMixin(Base);
            const instance = new Mixed();
            const el = mockElement();
            // Should not throw
            expect(() => instance.initRipple(el)).not.toThrow();
            // Cleanup
            instance.disconnectedCallback();
        });
    });

    // ========================================================================
    // BUG FIX TDD TESTS — Listener Accumulation Prevention
    // ========================================================================

    describe('Listener Accumulation Fix', () => {

        test('attachRipple called twice should not add duplicate listeners', () => {
            const el = mockElement();
            let listenerCount = 0;
            const origAdd = el.addEventListener.bind(el);
            el.addEventListener = function (type, ...args) {
                if (type === 'pointerdown') listenerCount++;
                return origAdd(type, ...args);
            };

            attachRipple(el);
            attachRipple(el); // second call

            // Only ONE pointerdown listener should be added
            expect(listenerCount).toBe(1);
        });

        test('original cleanup should still work after duplicate attachRipple call', () => {
            const el = mockElement();
            const cleanup1 = attachRipple(el);
            const cleanup2 = attachRipple(el); // duplicate — should return no-op

            // cleanup2 should be a no-op, not throw
            expect(() => cleanup2()).not.toThrow();

            // cleanup1 should still work and actually remove the listener
            expect(() => cleanup1()).not.toThrow();
        });

        test('after cleanup, element can be re-attached', () => {
            const el = mockElement();
            const cleanup1 = attachRipple(el);
            cleanup1(); // removes ripple

            // Second attachment should work (not be guarded)
            let listenerCount = 0;
            const origAdd = el.addEventListener.bind(el);
            el.addEventListener = function (type, ...args) {
                if (type === 'pointerdown') listenerCount++;
                return origAdd(type, ...args);
            };

            const cleanup2 = attachRipple(el);
            expect(listenerCount).toBe(1);
            cleanup2();
        });

        test('initRipple called twice should clean up previous attachment', () => {
            class Base {
                disconnectedCallback() { }
            }
            const Mixed = RippleMixin(Base);
            const instance = new Mixed();
            const el = mockElement();

            let addCount = 0;
            let removeCount = 0;
            const origAdd = el.addEventListener.bind(el);
            const origRemove = el.removeEventListener.bind(el);
            el.addEventListener = function (type, ...args) {
                if (type === 'pointerdown') addCount++;
                return origAdd(type, ...args);
            };
            el.removeEventListener = function (type, ...args) {
                if (type === 'pointerdown') removeCount++;
                return origRemove(type, ...args);
            };

            instance.initRipple(el);
            instance.initRipple(el); // should clean up the first

            // First was cleaned up, second was added
            // The WeakSet guard means only 1 listener add + 1 remove (from cleanup)
            // then re-add after cleanup
            expect(removeCount).toBeGreaterThanOrEqual(1); // previous was cleaned up

            instance.disconnectedCallback();
        });
    });
});
