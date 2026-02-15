/**
 * @fileoverview Shared Discovery Functions for AgentUI
 * 
 * Eliminates duplication of loadDescriptions() and discoverAll()
 * between index.js and chunks/core.js.
 */

import { ALL_COMPONENT_TAGS } from './constants.js';

/**
 * Load the describe catalog via fetch().
 * Resolves catalog URL relative to AgentUI script tags.
 * 
 * @param {typeof import('./AuElement.js').AuElement} AuElement - AuElement class to populate
 * @param {Object} [options] - Options
 * @param {boolean} [options.checkChunks=false] - Whether to check for /chunks/ path prefix
 */
export async function loadDescriptions(AuElement, options = {}) {
    if (AuElement._describeCatalog) return;

    const scripts = document.querySelectorAll('script[src]');
    let baseUrl = '';
    for (const s of scripts) {
        if (options.checkChunks
            ? (s.src.includes('agentui') || s.src.includes('chunks'))
            : s.src.includes('agentui')) {
            baseUrl = s.src.substring(0, s.src.lastIndexOf('/') + 1);
            // If we're in chunks/, go up one level
            if (options.checkChunks && baseUrl.includes('/chunks/')) {
                baseUrl = baseUrl.replace('/chunks/', '/');
            }
            break;
        }
    }
    const url = baseUrl + 'describe-catalog.json';
    try {
        const res = await fetch(url);
        if (res.ok) {
            AuElement._describeCatalog = await res.json();
        }
    } catch (e) {
        if (window.AGENTUI_DEBUG) {
            console.warn('[AgentUI] Could not load describe catalog from', url);
        }
    }
}

/**
 * Create a discoverAll() function bound to the given AuElement class.
 * 
 * @param {typeof import('./AuElement.js').AuElement} AuElement - AuElement class
 * @returns {Function} Async discoverAll function
 */
export function createDiscoverAll(AuElement) {
    return async function discoverAll() {
        if (!AuElement._describeCatalog) {
            await this.loadDescriptions();
        }
        const components = {};
        for (const tag of ALL_COMPONENT_TAGS) {
            const cls = customElements.get(tag);
            if (cls?.describe) {
                components[tag] = cls.describe();
            }
        }
        return components;
    };
}
