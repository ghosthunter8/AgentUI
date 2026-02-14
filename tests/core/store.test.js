/**
 * @fileoverview Unit Tests for store.js — Reactive Store Module
 * TDD: Tests written BEFORE implementation.
 */

import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { createStore } from '../../src/core/store.js';

describe('createStore', () => {

    // ========================================================================
    // BASIC API
    // ========================================================================

    test('returns object with state, subscribe, batch, getState, setState, destroy', () => {
        const store = createStore({ count: 0 });
        expect(store.state).toBeDefined();
        expect(typeof store.subscribe).toBe('function');
        expect(typeof store.batch).toBe('function');
        expect(typeof store.getState).toBe('function');
        expect(typeof store.setState).toBe('function');
        expect(typeof store.destroy).toBe('function');
        store.destroy();
    });

    test('state reflects initial values', () => {
        const store = createStore({ name: 'test', count: 42, items: [1, 2, 3] });
        expect(store.state.name).toBe('test');
        expect(store.state.count).toBe(42);
        expect(store.state.items).toEqual([1, 2, 3]);
        store.destroy();
    });

    // ========================================================================
    // REACTIVITY
    // ========================================================================

    test('setting a property notifies subscribers', () => {
        const store = createStore({ count: 0 });
        let received = null;
        store.subscribe('count', (newVal, oldVal) => {
            received = { newVal, oldVal };
        });
        store.state.count = 5;
        expect(received).toEqual({ newVal: 5, oldVal: 0 });
        store.destroy();
    });

    test('setting a property updates the value', () => {
        const store = createStore({ name: 'hello' });
        store.state.name = 'world';
        expect(store.state.name).toBe('world');
        store.destroy();
    });

    test('setting same value does NOT notify subscribers', () => {
        const store = createStore({ count: 5 });
        let callCount = 0;
        store.subscribe('count', () => { callCount++; });
        store.state.count = 5; // same value
        expect(callCount).toBe(0);
        store.destroy();
    });

    test('multiple subscribers on same key all notified', () => {
        const store = createStore({ x: 0 });
        let a = 0, b = 0;
        store.subscribe('x', () => { a++; });
        store.subscribe('x', () => { b++; });
        store.state.x = 1;
        expect(a).toBe(1);
        expect(b).toBe(1);
        store.destroy();
    });

    // ========================================================================
    // SUBSCRIBE / UNSUBSCRIBE
    // ========================================================================

    test('subscribe returns unsubscribe function', () => {
        const store = createStore({ count: 0 });
        const unsub = store.subscribe('count', () => { });
        expect(typeof unsub).toBe('function');
        store.destroy();
    });

    test('unsubscribed callbacks are not called', () => {
        const store = createStore({ count: 0 });
        let called = false;
        const unsub = store.subscribe('count', () => { called = true; });
        unsub();
        store.state.count = 99;
        expect(called).toBe(false);
        store.destroy();
    });

    test('wildcard subscribe receives all changes', () => {
        const store = createStore({ a: 1, b: 2 });
        const changes = [];
        store.subscribe('*', (key, newVal, oldVal) => {
            changes.push({ key, newVal, oldVal });
        });
        store.state.a = 10;
        store.state.b = 20;
        expect(changes).toEqual([
            { key: 'a', newVal: 10, oldVal: 1 },
            { key: 'b', newVal: 20, oldVal: 2 }
        ]);
        store.destroy();
    });

    test('wildcard unsubscribe works', () => {
        const store = createStore({ a: 1 });
        let called = false;
        const unsub = store.subscribe('*', () => { called = true; });
        unsub();
        store.state.a = 99;
        expect(called).toBe(false);
        store.destroy();
    });

    // ========================================================================
    // BATCH
    // ========================================================================

    test('batch fires subscribers once for multiple changes', () => {
        const store = createStore({ a: 0, b: 0 });
        let aCount = 0, bCount = 0;
        store.subscribe('a', () => { aCount++; });
        store.subscribe('b', () => { bCount++; });
        store.batch(() => {
            store.state.a = 1;
            store.state.a = 2;
            store.state.a = 3;
            store.state.b = 10;
        });
        expect(aCount).toBe(1); // only final value notified
        expect(bCount).toBe(1);
        expect(store.state.a).toBe(3);
        expect(store.state.b).toBe(10);
        store.destroy();
    });

    test('batch fires wildcard once per changed key', () => {
        const store = createStore({ x: 0, y: 0 });
        const wildcardCalls = [];
        store.subscribe('*', (key, newVal) => {
            wildcardCalls.push({ key, newVal });
        });
        store.batch(() => {
            store.state.x = 5;
            store.state.y = 10;
        });
        expect(wildcardCalls).toEqual([
            { key: 'x', newVal: 5 },
            { key: 'y', newVal: 10 }
        ]);
        store.destroy();
    });

    test('batch does not fire if value unchanged', () => {
        const store = createStore({ x: 1 });
        let called = false;
        store.subscribe('x', () => { called = true; });
        store.batch(() => {
            store.state.x = 1; // same value
        });
        expect(called).toBe(false);
        store.destroy();
    });

    // ========================================================================
    // getState / setState
    // ========================================================================

    test('getState returns a plain copy, not the proxy', () => {
        const store = createStore({ count: 42 });
        const snapshot = store.getState();
        expect(snapshot).toEqual({ count: 42 });
        // Modifying snapshot should NOT affect store
        snapshot.count = 999;
        expect(store.state.count).toBe(42);
        store.destroy();
    });

    test('setState replaces state and notifies subscribers', () => {
        const store = createStore({ a: 1, b: 2 });
        const changes = [];
        store.subscribe('a', (nv) => changes.push({ key: 'a', val: nv }));
        store.subscribe('b', (nv) => changes.push({ key: 'b', val: nv }));
        store.setState({ a: 10, b: 20 });
        expect(store.state.a).toBe(10);
        expect(store.state.b).toBe(20);
        expect(changes.length).toBe(2);
        store.destroy();
    });

    test('setState only notifies changed keys', () => {
        const store = createStore({ a: 1, b: 2 });
        let bCalled = false;
        store.subscribe('b', () => { bCalled = true; });
        store.setState({ a: 99 }); // b unchanged
        expect(bCalled).toBe(false);
        expect(store.state.a).toBe(99);
        expect(store.state.b).toBe(2);
        store.destroy();
    });

    // ========================================================================
    // PERSISTENCE (localStorage)
    // ========================================================================

    // Mock localStorage for test environment
    let mockStorage = {};
    const mockLocalStorage = {
        getItem: (key) => mockStorage[key] ?? null,
        setItem: (key, value) => { mockStorage[key] = value; },
        removeItem: (key) => { delete mockStorage[key]; },
        clear: () => { mockStorage = {}; }
    };

    beforeEach(() => {
        mockStorage = {};
        globalThis.localStorage = mockLocalStorage;
    });

    afterEach(() => {
        // Don't delete — tests share the global
    });

    test('persist saves state to localStorage on change', () => {
        const store = createStore({ count: 0 }, { persist: 'test-app' });
        store.state.count = 42;
        const saved = JSON.parse(mockLocalStorage.getItem('agentui:test-app'));
        expect(saved.count).toBe(42);
        store.destroy();
    });

    test('persist loads state from localStorage on creation', () => {
        mockLocalStorage.setItem('agentui:test-load', JSON.stringify({ count: 99, name: 'saved' }));
        const store = createStore({ count: 0, name: '' }, { persist: 'test-load' });
        expect(store.state.count).toBe(99);
        expect(store.state.name).toBe('saved');
        store.destroy();
    });

    test('persist handles corrupt JSON silently', () => {
        mockLocalStorage.setItem('agentui:test-corrupt', 'NOT VALID JSON{{{');
        const store = createStore({ count: 0 }, { persist: 'test-corrupt' });
        // Should fall back to initial state
        expect(store.state.count).toBe(0);
        store.destroy();
    });

    test('persist handles missing localStorage data silently (first run)', () => {
        const store = createStore({ count: 0 }, { persist: 'test-missing' });
        expect(store.state.count).toBe(0);
        store.destroy();
    });

    test('persist only restores keys present in initialState', () => {
        mockLocalStorage.setItem('agentui:test-extra', JSON.stringify({
            count: 5, name: 'ok', extraKey: 'should-be-ignored'
        }));
        const store = createStore({ count: 0, name: '' }, { persist: 'test-extra' });
        expect(store.state.count).toBe(5);
        expect(store.state.name).toBe('ok');
        expect(store.state.extraKey).toBeUndefined();
        store.destroy();
    });

    // ========================================================================
    // DESTROY
    // ========================================================================

    test('destroy clears all subscribers', () => {
        const store = createStore({ count: 0 });
        let called = false;
        store.subscribe('count', () => { called = true; });
        store.destroy();
        store.state.count = 99;
        expect(called).toBe(false);
    });

    // ========================================================================
    // ISOLATION
    // ========================================================================

    test('multiple stores do not interfere', () => {
        const store1 = createStore({ x: 1 });
        const store2 = createStore({ x: 2 });
        let s1val = null, s2val = null;
        store1.subscribe('x', (v) => { s1val = v; });
        store2.subscribe('x', (v) => { s2val = v; });
        store1.state.x = 10;
        expect(s1val).toBe(10);
        expect(s2val).toBeNull(); // store2 not affected
        store2.state.x = 20;
        expect(s2val).toBe(20);
        expect(store1.state.x).toBe(10); // store1 not affected
        store1.destroy();
        store2.destroy();
    });

    // ========================================================================
    // BUG FIX REGRESSION TESTS
    // ========================================================================

    // BUG #6: batch() should always persist after flushing (dead code removed)
    test('batch should persist after changes are flushed', () => {
        const store = createStore({ count: 0, name: 'init' }, { persist: 'test-batch-persist' });
        store.batch(() => {
            store.state.count = 42;
            store.state.name = 'updated';
        });
        // After batch, localStorage should have persisted values
        const saved = JSON.parse(mockLocalStorage.getItem('agentui:test-batch-persist'));
        expect(saved.count).toBe(42);
        expect(saved.name).toBe('updated');
        store.destroy();
    });

    test('batch should persist even when all values revert to original', () => {
        const store = createStore({ count: 5 }, { persist: 'test-batch-revert' });
        store.batch(() => {
            store.state.count = 99;  // change
            store.state.count = 5;   // revert to original
        });
        // Persist should still have been called (no dead code gate)
        const saved = JSON.parse(mockLocalStorage.getItem('agentui:test-batch-revert'));
        expect(saved).toBeDefined();
        expect(saved.count).toBe(5);
        store.destroy();
    });
});
