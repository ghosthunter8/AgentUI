/**
 * @fileoverview Unit Tests for au-error-boundary Component
 * Uses patchEmit() and shadow listener registry for event-driven coverage.
 * Covers: render, #handleError, #renderFallback, recover, error registry, window.onerror.
 */

import { describe, test, expect, beforeAll, beforeEach } from 'bun:test';
import { dom, resetBody, patchEmit } from '../helpers/setup-dom.js';
const { document, body, customElements } = dom;

let AuErrorBoundary, getErrors, clearErrors;

describe('au-error-boundary Unit Tests', () => {

    beforeAll(async () => {
        // Ensure window.location exists
        if (!dom.window.location) {
            dom.window.location = { href: 'http://localhost/test' };
        }

        const module = await import('../../src/components/au-error-boundary.js');
        AuErrorBoundary = module.AuErrorBoundary;
        getErrors = module.getErrors;
        clearErrors = module.clearErrors;

        patchEmit(AuErrorBoundary);
    });

    beforeEach(() => {
        resetBody();
        clearErrors();
    });

    // ─── REGISTRATION ──────────────────────────────────────────
    test('should be registered', () => {
        expect(customElements.get('au-error-boundary')).toBe(AuErrorBoundary);
    });

    test('should have correct baseClass', () => {
        expect(AuErrorBoundary.baseClass).toBe('au-error-boundary');
    });

    test('should observe fallback attribute', () => {
        const attrs = AuErrorBoundary.observedAttributes;
        expect(attrs).toContain('fallback');
    });

    // ─── RENDER ────────────────────────────────────────────────
    test('should set display block', () => {
        const el = document.createElement('au-error-boundary');
        body.appendChild(el);
        expect(el.style.display).toBe('block');
    });

    test('should preserve child content', () => {
        const el = document.createElement('au-error-boundary');
        el.innerHTML = '<p>My app content</p>';
        body.appendChild(el);
        expect(el.querySelector('p').textContent).toBe('My app content');
    });

    test('should start without error', () => {
        const el = document.createElement('au-error-boundary');
        body.appendChild(el);
        expect(el.hasError).toBe(false);
        expect(el.error).toBe(null);
    });

    test('should be a block-level element', () => {
        const el = document.createElement('au-error-boundary');
        body.appendChild(el);
        expect(el.style.display).toBe('block');
    });

    // ─── hasError / error getters ──────────────────────────────
    test('hasError getter returns false initially', () => {
        const el = document.createElement('au-error-boundary');
        body.appendChild(el);
        expect(el.hasError).toBe(false);
    });

    test('error getter returns null initially', () => {
        const el = document.createElement('au-error-boundary');
        body.appendChild(el);
        expect(el.error).toBe(null);
    });

    // ─── #handleError via 'error' listener (lines 60-61, 97-137) ──
    test('#handleError should set hasError and error', () => {
        const el = document.createElement('au-error-boundary');
        el.innerHTML = '<p>Content</p>';
        body.appendChild(el);

        // Invoke the 'error' listener from shadow registry
        const testError = new Error('Test error');
        if (el.__listeners?.['error']) {
            const fakeEvent = { detail: { error: testError, message: 'Test error' }, stopPropagation: () => { } };
            for (const fn of el.__listeners['error']) {
                fn.call(el, fakeEvent);
            }
        }
        expect(el.hasError).toBe(true);
        expect(el.error).toBe(testError);
    });

    test('#handleError should add has-error class', () => {
        const el = document.createElement('au-error-boundary');
        el.innerHTML = '<p>Content</p>';
        body.appendChild(el);

        if (el.__listeners?.['error']) {
            const fakeEvent = { detail: { error: new Error('fail'), message: 'fail' }, stopPropagation: () => { } };
            for (const fn of el.__listeners['error']) {
                fn.call(el, fakeEvent);
            }
        }
        expect(el.classList.contains('has-error')).toBe(true);
    });

    test('#handleError should render default fallback UI', () => {
        const el = document.createElement('au-error-boundary');
        el.innerHTML = '<p>Content</p>';
        body.appendChild(el);

        if (el.__listeners?.['error']) {
            const fakeEvent = { detail: { error: new Error('Something broke'), message: 'Something broke' }, stopPropagation: () => { } };
            for (const fn of el.__listeners['error']) {
                fn.call(el, fakeEvent);
            }
        }
        const fallback = el.querySelector('.au-error-boundary__fallback');
        expect(fallback).toBeTruthy();
        expect(fallback.getAttribute('role')).toBe('alert');
        // Should have error message
        const msg = el.querySelector('.au-error-boundary__message');
        expect(msg).toBeTruthy();
        expect(msg.textContent).toContain('Something broke');
    });

    test('#handleError should emit au-error event', () => {
        const el = document.createElement('au-error-boundary');
        el.innerHTML = '<p>Content</p>';
        body.appendChild(el);

        let errorDetail = null;
        el.addEventListener('au-error', (e) => { errorDetail = e.detail; });

        if (el.__listeners?.['error']) {
            const err = new Error('event test');
            const fakeEvent = { detail: { error: err, message: 'event test' }, stopPropagation: () => { } };
            for (const fn of el.__listeners['error']) {
                fn.call(el, fakeEvent);
            }
        }
        expect(errorDetail).toBeTruthy();
        expect(errorDetail.error.message).toBe('event test');
        expect(typeof errorDetail.recover).toBe('function');
    });

    test('#handleError should guard against duplicate errors', () => {
        const el = document.createElement('au-error-boundary');
        el.innerHTML = '<p>Content</p>';
        body.appendChild(el);

        const triggerError = () => {
            if (el.__listeners?.['error']) {
                const fakeEvent = { detail: { error: new Error('dup'), message: 'dup' }, stopPropagation: () => { } };
                for (const fn of el.__listeners['error']) {
                    fn.call(el, fakeEvent);
                }
            }
        };

        triggerError();
        expect(el.hasError).toBe(true);
        const contentAfterFirst = el.innerHTML;

        // Second error should be ignored (guard: if this.#hasError return)
        triggerError();
        expect(el.innerHTML).toBe(contentAfterFirst);
    });

    test('#handleError should call stopPropagation on event', () => {
        const el = document.createElement('au-error-boundary');
        el.innerHTML = '<p>Content</p>';
        body.appendChild(el);

        let stopCalled = false;
        if (el.__listeners?.['error']) {
            const fakeEvent = {
                detail: { error: new Error('stop'), message: 'stop' },
                stopPropagation: () => { stopCalled = true; }
            };
            for (const fn of el.__listeners['error']) {
                fn.call(el, fakeEvent);
            }
        }
        expect(stopCalled).toBe(true);
    });

    // ─── #renderFallback with custom fallback (lines 139-166) ──
    test('#renderFallback should use custom fallback attribute', () => {
        const el = document.createElement('au-error-boundary');
        el.setAttribute('fallback', 'Custom error message');
        el.innerHTML = '<p>Content</p>';
        body.appendChild(el);

        if (el.__listeners?.['error']) {
            const fakeEvent = { detail: { error: new Error('custom'), message: 'custom' }, stopPropagation: () => { } };
            for (const fn of el.__listeners['error']) {
                fn.call(el, fakeEvent);
            }
        }
        const fallback = el.querySelector('.au-error-boundary__fallback');
        expect(fallback).toBeTruthy();
        expect(fallback.textContent).toBe('Custom error message');
    });

    test('#renderFallback custom fallback is safe (text, not HTML)', () => {
        const el = document.createElement('au-error-boundary');
        el.setAttribute('fallback', '<script>alert("xss")</script>');
        el.innerHTML = '<p>Content</p>';
        body.appendChild(el);

        if (el.__listeners?.['error']) {
            const fakeEvent = { detail: { error: new Error('xss'), message: 'xss' }, stopPropagation: () => { } };
            for (const fn of el.__listeners['error']) {
                fn.call(el, fakeEvent);
            }
        }
        // textContent is used, not innerHTML, so script tag is rendered as text
        const fallback = el.querySelector('.au-error-boundary__fallback');
        expect(fallback.innerHTML).not.toContain('<script');
    });

    // ─── recover() (lines 176-183) ─────────────────────────────
    test('recover should reset error state', () => {
        const el = document.createElement('au-error-boundary');
        el.innerHTML = '<p>Original</p>';
        body.appendChild(el);

        // Trigger error
        if (el.__listeners?.['error']) {
            const fakeEvent = { detail: { error: new Error('recoverable'), message: 'recoverable' }, stopPropagation: () => { } };
            for (const fn of el.__listeners['error']) {
                fn.call(el, fakeEvent);
            }
        }
        expect(el.hasError).toBe(true);

        el.recover();
        expect(el.hasError).toBe(false);
        expect(el.error).toBe(null);
    });

    test('recover should remove has-error class', () => {
        const el = document.createElement('au-error-boundary');
        el.innerHTML = '<p>Original</p>';
        body.appendChild(el);

        if (el.__listeners?.['error']) {
            const fakeEvent = { detail: { error: new Error('test'), message: 'test' }, stopPropagation: () => { } };
            for (const fn of el.__listeners['error']) {
                fn.call(el, fakeEvent);
            }
        }
        expect(el.classList.contains('has-error')).toBe(true);
        el.recover();
        expect(el.classList.contains('has-error')).toBe(false);
    });

    test('recover should restore innerHTML to original', () => {
        const el = document.createElement('au-error-boundary');
        el.innerHTML = '<p>Original content</p>';
        body.appendChild(el);

        if (el.__listeners?.['error']) {
            const fakeEvent = { detail: { error: new Error('test'), message: 'test' }, stopPropagation: () => { } };
            for (const fn of el.__listeners['error']) {
                fn.call(el, fakeEvent);
            }
        }
        // Content should be fallback now
        expect(el.querySelector('.au-error-boundary__fallback')).toBeTruthy();

        el.recover();
        expect(el.innerHTML).toContain('Original content');
    });

    test('recover should emit au-recover event', () => {
        const el = document.createElement('au-error-boundary');
        el.innerHTML = '<p>Content</p>';
        body.appendChild(el);

        // Trigger error first
        if (el.__listeners?.['error']) {
            const fakeEvent = { detail: { error: new Error('test'), message: 'test' }, stopPropagation: () => { } };
            for (const fn of el.__listeners['error']) {
                fn.call(el, fakeEvent);
            }
        }

        let recoverFired = false;
        el.addEventListener('au-recover', () => { recoverFired = true; });
        el.recover();
        expect(recoverFired).toBe(true);
    });

    // ─── ERROR REGISTRY (lines 106-123) ────────────────────────
    test('error should be added to registry', () => {
        clearErrors();
        const el = document.createElement('au-error-boundary');
        el.innerHTML = '<p>Content</p>';
        body.appendChild(el);

        if (el.__listeners?.['error']) {
            const fakeEvent = { detail: { error: new Error('registry test'), message: 'registry test' }, stopPropagation: () => { } };
            for (const fn of el.__listeners['error']) {
                fn.call(el, fakeEvent);
            }
        }
        const errors = getErrors();
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[errors.length - 1].error.message).toBe('registry test');
    });

    test('getErrors should return list, clearErrors should empty it', () => {
        expect(getErrors()).toEqual([]);
        clearErrors();
        expect(getErrors()).toEqual([]);
    });

    test('error registry should include context', () => {
        clearErrors();
        const el = document.createElement('au-error-boundary');
        el.id = 'test-boundary';
        el.innerHTML = '<p>Context content</p>';
        body.appendChild(el);

        if (el.__listeners?.['error']) {
            const fakeEvent = { detail: { error: new Error('ctx'), message: 'ctx' }, stopPropagation: () => { } };
            for (const fn of el.__listeners['error']) {
                fn.call(el, fakeEvent);
            }
        }
        const errors = getErrors();
        const last = errors[errors.length - 1];
        expect(last.component).toBe('test-boundary');
        expect(last.context.originalContent).toContain('Context content');
    });

    // ─── Global error catching ──────────────────────────────────

    test('source: should use addEventListener("error") not window.onerror', async () => {
        const fs = await import('fs');
        const source = fs.readFileSync(
            new URL('../../src/components/au-error-boundary.js', import.meta.url),
            'utf-8'
        );
        // Should NOT use window.onerror override (fragile chain)
        expect(source).not.toContain('window.onerror');
        // Should use this.listen(window, 'error', ...) for auto-cleanup
        expect(source).toMatch(/this\.listen\(window/);
    });

    test('source: #isErrorFromChild should check error stack', async () => {
        const fs = await import('fs');
        const source = fs.readFileSync(
            new URL('../../src/components/au-error-boundary.js', import.meta.url),
            'utf-8'
        );
        expect(source).toContain('#isErrorFromChild');
        expect(source).toContain('error.stack');
    });

    test('source: html tagged template should be used in renderFallback', async () => {
        const fs = await import('fs');
        const source = fs.readFileSync(
            new URL('../../src/components/au-error-boundary.js', import.meta.url),
            'utf-8'
        );
        expect(source).toContain("import { html }");
        expect(source).toMatch(/this\.innerHTML\s*=\s*html`/);
    });

    // ─── Multi-boundary coexistence (BUG FIX TDD) ──────────────
    test('multiple boundaries should not override window.onerror', () => {
        // Save original
        const original = dom.window.onerror;

        const el1 = document.createElement('au-error-boundary');
        el1.innerHTML = '<p>Boundary 1</p>';
        body.appendChild(el1);

        const el2 = document.createElement('au-error-boundary');
        el2.innerHTML = '<p>Boundary 2</p>';
        body.appendChild(el2);

        // window.onerror should NOT have been changed
        expect(dom.window.onerror).toBe(original);

        body.removeChild(el2);
        body.removeChild(el1);
    });

    test('removing one boundary should not affect another', () => {
        const el1 = document.createElement('au-error-boundary');
        el1.innerHTML = '<p>Boundary 1</p>';
        body.appendChild(el1);

        const el2 = document.createElement('au-error-boundary');
        el2.innerHTML = '<p>Boundary 2</p>';
        body.appendChild(el2);

        // Remove el1 — el2 should still be functional
        body.removeChild(el1);

        // el2 should still be connected and usable
        expect(el2.isConnected).toBe(true);
        expect(el2.hasError).toBe(false);

        // Trigger error on el2 — should still work
        if (el2.__listeners?.['error']) {
            const fakeEvent = {
                detail: { error: new Error('after sibling remove'), message: 'test' },
                stopPropagation: () => { }
            };
            for (const fn of el2.__listeners['error']) {
                fn.call(el2, fakeEvent);
            }
        }
        expect(el2.hasError).toBe(true);

        body.removeChild(el2);
    });

    test('connect/disconnect cycles should not leak global state', () => {
        const originalOnerror = dom.window.onerror;

        const el = document.createElement('au-error-boundary');
        el.innerHTML = '<p>Content</p>';

        // Cycle 1
        body.appendChild(el);
        body.removeChild(el);
        expect(dom.window.onerror).toBe(originalOnerror);

        // Cycle 2
        body.appendChild(el);
        body.removeChild(el);
        expect(dom.window.onerror).toBe(originalOnerror);
    });

    test('source: should NOT have #originalOnerror field (no manual restore needed)', async () => {
        const fs = await import('fs');
        const source = fs.readFileSync(
            new URL('../../src/components/au-error-boundary.js', import.meta.url),
            'utf-8'
        );
        // The fix removes the fragile #originalOnerror pattern
        expect(source).not.toContain('#originalOnerror');
    });
});
