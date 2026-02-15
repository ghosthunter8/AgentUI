/**
 * @fileoverview AgentUI Agent Module Entry Point
 * 
 * Standalone bundle of agent-only APIs (agent-api + component-schema).
 * Adds ~18KB when loaded. Automatically extends window.AgentUI if present.
 */

import { AgentAPI, getAuComponentTree, describe as describeComponent, findByLabel, getRegisteredComponents, enableVisualMarkers, disableVisualMarkers, getMarkerMap, getMarkerElement, getMCPActions } from './core/agent-api.js';

import { ComponentSchema, getComponentSchema, getAllSchemas, getSchemaComponents, getSchemaQuickRef } from './core/component-schema.js';

// Re-export for ESM consumers
export {
    AgentAPI, getAuComponentTree, describeComponent, findByLabel, getRegisteredComponents,
    enableVisualMarkers, disableVisualMarkers, getMarkerMap, getMarkerElement, getMCPActions,
    ComponentSchema, getComponentSchema, getAllSchemas, getSchemaComponents, getSchemaQuickRef
};

// Auto-extend window.AgentUI if the slim bundle is loaded
if (typeof window !== 'undefined' && window.AgentUI) {
    Object.assign(window.AgentUI, {
        AgentAPI,
        getAuComponentTree,
        describeComponent,
        findByLabel,
        getRegisteredComponents,
        enableVisualMarkers,
        disableVisualMarkers,
        getMarkerMap,
        getMarkerElement,
        getMCPActions,
        getComponentSchema,
        getAllSchemas,
        getSchemaComponents,
        getSchemaQuickRef
    });
}
