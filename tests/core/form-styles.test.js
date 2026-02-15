/**
 * @fileoverview TDD Tests for shared form-styles module (OPT-4)
 * Verifies shared style application for checkbox/radio/switch.
 */

import { describe, test, expect, beforeAll } from 'bun:test';
import { parseHTML } from 'linkedom';

describe('form-styles Module (OPT-4)', () => {
    let applyFormControlLayout, applyStateLayerStyles, updateFormCursor;

    beforeAll(async () => {
        const dom = parseHTML('<!DOCTYPE html><html><body></body></html>');
        globalThis.document = dom.document;
        globalThis.window = dom.window;
        globalThis.HTMLElement = dom.HTMLElement;

        const module = await import('../../src/core/form-styles.js');
        applyFormControlLayout = module.applyFormControlLayout;
        applyStateLayerStyles = module.applyStateLayerStyles;
        updateFormCursor = module.updateFormCursor;
    });

    test('should export applyFormControlLayout function', () => {
        expect(typeof applyFormControlLayout).toBe('function');
    });

    test('should export applyStateLayerStyles function', () => {
        expect(typeof applyStateLayerStyles).toBe('function');
    });

    test('should export updateFormCursor function', () => {
        expect(typeof updateFormCursor).toBe('function');
    });

    test('applyFormControlLayout should set inline-flex display', () => {
        const el = document.createElement('div');
        applyFormControlLayout(el, false);
        expect(el.style.display).toBe('inline-flex');
    });

    test('applyFormControlLayout should set center alignment', () => {
        const el = document.createElement('div');
        applyFormControlLayout(el, false);
        expect(el.style.alignItems).toBe('center');
    });

    test('applyFormControlLayout should set 12px gap', () => {
        const el = document.createElement('div');
        applyFormControlLayout(el, false);
        expect(el.style.gap).toBe('12px');
    });

    test('applyFormControlLayout should set cursor pointer when enabled', () => {
        const el = document.createElement('div');
        applyFormControlLayout(el, false);
        expect(el.style.cursor).toBe('pointer');
    });

    test('applyFormControlLayout should set cursor not-allowed when disabled', () => {
        const el = document.createElement('div');
        applyFormControlLayout(el, true);
        expect(el.style.cursor).toBe('not-allowed');
    });

    test('applyFormControlLayout should set user-select none', () => {
        const el = document.createElement('div');
        applyFormControlLayout(el, false);
        expect(el.style.userSelect).toBe('none');
    });

    test('applyFormControlLayout should set 48px min-height', () => {
        const el = document.createElement('div');
        applyFormControlLayout(el, false);
        expect(el.style.minHeight).toBe('48px');
    });

    test('applyFormControlLayout should set padding', () => {
        const el = document.createElement('div');
        applyFormControlLayout(el, false);
        expect(el.style.padding).toBe('0 4px');
    });

    test('applyStateLayerStyles should set width and height to 40px', () => {
        const el = document.createElement('span');
        applyStateLayerStyles(el);
        expect(el.style.width).toBe('40px');
        expect(el.style.height).toBe('40px');
    });

    test('applyStateLayerStyles should set border-radius 50%', () => {
        const el = document.createElement('span');
        applyStateLayerStyles(el);
        expect(el.style.borderRadius).toBe('50%');
    });

    test('applyStateLayerStyles should set flex centering', () => {
        const el = document.createElement('span');
        applyStateLayerStyles(el);
        expect(el.style.display).toBe('flex');
        expect(el.style.alignItems).toBe('center');
        expect(el.style.justifyContent).toBe('center');
    });

    test('applyStateLayerStyles should set relative positioning', () => {
        const el = document.createElement('span');
        applyStateLayerStyles(el);
        expect(el.style.position).toBe('relative');
    });

    test('applyStateLayerStyles should set overflow hidden', () => {
        const el = document.createElement('span');
        applyStateLayerStyles(el);
        expect(el.style.overflow).toBe('hidden');
    });

    test('applyStateLayerStyles should set flex-shrink 0', () => {
        const el = document.createElement('span');
        applyStateLayerStyles(el);
        expect(el.style.flexShrink).toBe('0');
    });

    test('updateFormCursor should set pointer when not disabled', () => {
        const el = document.createElement('div');
        updateFormCursor(el, false);
        expect(el.style.cursor).toBe('pointer');
    });

    test('updateFormCursor should set not-allowed when disabled', () => {
        const el = document.createElement('div');
        updateFormCursor(el, true);
        expect(el.style.cursor).toBe('not-allowed');
    });
});
