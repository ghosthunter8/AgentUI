/**
 * @fileoverview Comprehensive Unit Tests for au-spinner Component
 * Tests: registration, render, Material Web DOM structure,
 *        size/color classes, render idempotency, update(), accessibility
 */

import { describe, test, expect, beforeAll, beforeEach } from 'bun:test';
import { dom, resetBody } from '../helpers/setup-dom.js';
const { document, body, customElements } = dom;

let AuSpinner;

describe('au-spinner Unit Tests', () => {

    beforeAll(async () => {
        const module = await import('../../src/components/au-spinner.js');
        AuSpinner = module.AuSpinner;
    });

    beforeEach(() => resetBody());

    // ========================================
    // REGISTRATION
    // ========================================

    test('should be registered', () => {
        expect(customElements.get('au-spinner')).toBe(AuSpinner);
    });

    test('should have correct baseClass', () => {
        expect(AuSpinner.baseClass).toBe('au-spinner');
    });

    test('should observe size and color', () => {
        expect(AuSpinner.observedAttributes).toContain('size');
        expect(AuSpinner.observedAttributes).toContain('color');
    });

    // ========================================
    // RENDER — Material Web DOM STRUCTURE
    // ========================================

    test('should create progress container', () => {
        const el = document.createElement('au-spinner');
        body.appendChild(el);
        expect(el.querySelector('.au-spinner__progress')).not.toBeNull();
    });

    test('should create spinner layer', () => {
        const el = document.createElement('au-spinner');
        body.appendChild(el);
        expect(el.querySelector('.au-spinner__spinner')).not.toBeNull();
    });

    test('should create left clipper', () => {
        const el = document.createElement('au-spinner');
        body.appendChild(el);
        expect(el.querySelector('.au-spinner__left')).not.toBeNull();
    });

    test('should create right clipper', () => {
        const el = document.createElement('au-spinner');
        body.appendChild(el);
        expect(el.querySelector('.au-spinner__right')).not.toBeNull();
    });

    test('should have exactly two circle elements', () => {
        const el = document.createElement('au-spinner');
        body.appendChild(el);
        expect(el.querySelectorAll('.au-spinner__circle').length).toBe(2);
    });

    test('left clipper should contain a circle', () => {
        const el = document.createElement('au-spinner');
        body.appendChild(el);
        const left = el.querySelector('.au-spinner__left');
        expect(left.querySelector('.au-spinner__circle')).not.toBeNull();
    });

    test('right clipper should contain a circle', () => {
        const el = document.createElement('au-spinner');
        body.appendChild(el);
        const right = el.querySelector('.au-spinner__right');
        expect(right.querySelector('.au-spinner__circle')).not.toBeNull();
    });

    test('render should be idempotent', () => {
        const el = document.createElement('au-spinner');
        body.appendChild(el);
        el.render();
        el.render();
        expect(el.querySelectorAll('.au-spinner__spinner').length).toBe(1);
        expect(el.querySelectorAll('.au-spinner__circle').length).toBe(2);
    });

    // ========================================
    // SIZE CLASSES
    // ========================================

    test('should default to md size class', () => {
        const el = document.createElement('au-spinner');
        body.appendChild(el);
        expect(el.classList.contains('au-spinner--md')).toBe(true);
    });

    test('should apply xs size class', () => {
        const el = document.createElement('au-spinner');
        el.setAttribute('size', 'xs');
        body.appendChild(el);
        expect(el.classList.contains('au-spinner--xs')).toBe(true);
    });

    test('should apply sm size class', () => {
        const el = document.createElement('au-spinner');
        el.setAttribute('size', 'sm');
        body.appendChild(el);
        expect(el.classList.contains('au-spinner--sm')).toBe(true);
    });

    test('should apply lg size class', () => {
        const el = document.createElement('au-spinner');
        el.setAttribute('size', 'lg');
        body.appendChild(el);
        expect(el.classList.contains('au-spinner--lg')).toBe(true);
    });

    test('should apply xl size class', () => {
        const el = document.createElement('au-spinner');
        el.setAttribute('size', 'xl');
        body.appendChild(el);
        expect(el.classList.contains('au-spinner--xl')).toBe(true);
    });

    // ========================================
    // COLOR CLASSES
    // ========================================

    test('should default to primary color class', () => {
        const el = document.createElement('au-spinner');
        body.appendChild(el);
        expect(el.classList.contains('au-spinner--primary')).toBe(true);
    });

    test('should apply secondary color class', () => {
        const el = document.createElement('au-spinner');
        el.setAttribute('color', 'secondary');
        body.appendChild(el);
        expect(el.classList.contains('au-spinner--secondary')).toBe(true);
    });

    test('should apply current color class', () => {
        const el = document.createElement('au-spinner');
        el.setAttribute('color', 'current');
        body.appendChild(el);
        expect(el.classList.contains('au-spinner--current')).toBe(true);
    });

    test('should apply white color class', () => {
        const el = document.createElement('au-spinner');
        el.setAttribute('color', 'white');
        body.appendChild(el);
        expect(el.classList.contains('au-spinner--white')).toBe(true);
    });

    test('should have base au-spinner class', () => {
        const el = document.createElement('au-spinner');
        body.appendChild(el);
        expect(el.classList.contains('au-spinner')).toBe(true);
    });

    // ========================================
    // UPDATE
    // ========================================

    test('update should switch size class', () => {
        const el = document.createElement('au-spinner');
        body.appendChild(el);
        expect(el.classList.contains('au-spinner--md')).toBe(true);

        el.setAttribute('size', 'lg');
        el.update('size', 'lg', 'md');
        expect(el.classList.contains('au-spinner--lg')).toBe(true);
        expect(el.classList.contains('au-spinner--md')).toBe(false);
    });

    test('update should switch color class', () => {
        const el = document.createElement('au-spinner');
        body.appendChild(el);
        expect(el.classList.contains('au-spinner--primary')).toBe(true);

        el.setAttribute('color', 'secondary');
        el.update('color', 'secondary', 'primary');
        expect(el.classList.contains('au-spinner--secondary')).toBe(true);
        expect(el.classList.contains('au-spinner--primary')).toBe(false);
    });

    // ========================================
    // ACCESSIBILITY
    // ========================================

    test('should have role="progressbar" for accessibility', () => {
        const el = document.createElement('au-spinner');
        body.appendChild(el);
        expect(el.getAttribute('role')).toBe('progressbar');
    });

    test('should have aria-label', () => {
        const el = document.createElement('au-spinner');
        body.appendChild(el);
        expect(el.getAttribute('aria-label')).toBeTruthy();
    });
});
