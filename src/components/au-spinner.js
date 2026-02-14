/**
 * @fileoverview au-spinner - MD3 Circular Progress Indicator
 * GPU-only animation using two-half-circle clipping technique.
 * All animations use transform: rotate() — 100% GPU composited.
 */

import { AuElement, define } from '../core/AuElement.js';

export class AuSpinner extends AuElement {
    static baseClass = 'au-spinner';
    static observedAttributes = ['size', 'color'];

    render() {
        // Idempotent: skip if already rendered
        if (this.querySelector('.au-spinner__layer')) return;

        // Accessibility
        if (!this.hasAttribute('role')) this.setAttribute('role', 'progressbar');
        if (!this.hasAttribute('aria-label')) this.setAttribute('aria-label', 'Loading');

        // MD3 two-half-circle structure:
        // - layer: rotates continuously (container rotation)
        // - clip-left/clip-right: each clips half the circle, overflow:hidden
        // - circles inside each clip: rotate to show/hide the arc
        // - gap: thin patch to cover the seam between halves
        this.innerHTML = `<div class="au-spinner__layer">
    <div class="au-spinner__clip-left"><div class="au-spinner__circle"></div></div>
    <div class="au-spinner__gap"><div class="au-spinner__circle"></div></div>
    <div class="au-spinner__clip-right"><div class="au-spinner__circle"></div></div>
</div>`;
        this.#updateClasses();
    }

    update(attr, newValue, oldValue) {
        this.#updateClasses();
    }

    #updateClasses() {
        const size = this.attr('size', 'md');
        const color = this.attr('color', 'primary');

        const baseClasses = ['au-spinner', `au-spinner--${size}`, `au-spinner--${color}`];
        baseClasses.forEach(cls => this.classList.add(cls));

        Array.from(this.classList).forEach(cls => {
            if (cls.startsWith('au-spinner--') && !baseClasses.includes(cls)) {
                this.classList.remove(cls);
            }
        });
    }
}

define('au-spinner', AuSpinner);
