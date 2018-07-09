"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const events_1 = require("@viewjs/events");
const utils_1 = require("@viewjs/utils");
const model_1 = require("./model");
function getValue(a, prop) {
    if (model_1.isModel(a))
        return a.get(prop);
    else if (utils_1.isObject(a)) {
        return a[prop];
    }
    return void 0;
}
function sort(a, b, prop) {
    let av = getValue(a, prop), bv = getValue(b, prop);
    if (utils_1.isString(av))
        av = av.toUpperCase();
    if (utils_1.isString(bv))
        bv = bv.toUpperCase();
    if (av < bv)
        return -1;
    else if (av > bv)
        return 1;
    else
        return 0;
}
class ArrayCollection extends events_1.EventEmitter {
    constructor(array = []) {
        super();
        this[types_1.MetaKeys.Models] = array;
    }
    /**
     * The length of the array
     *
     * @readonly
     * @type {number}
     * @memberof ArrayCollection
     */
    get length() {
        return this[types_1.MetaKeys.Models].length;
    }
    /**
     * Get item at index
     *
     * @param {number} index
     * @returns {(T | undefined)}
     *
     * @memberof ArrayCollection
     */
    item(index) {
        if (index >= this[types_1.MetaKeys.Models].length)
            return undefined;
        return this[types_1.MetaKeys.Models][index];
    }
    /**
     * Push an item and optionally trigger a change event
     *
     * @param {T} m
     * @param {boolean} [trigger=true]
     *
     * @memberof ArrayCollection
     */
    push(m, trigger = true) {
        this[types_1.MetaKeys.Models].push(m);
        if (trigger)
            this.trigger(types_1.ModelEvents.Add, m, this[types_1.MetaKeys.Models].length - 1);
        return this.length;
    }
    /**
     * Pop a item from the array and optinally trigger a change event
     *
     * @param {boolean} [trigger=true]
     * @returns {(T | undefined)}
     *
     * @memberof ArrayCollection
     */
    pop(trigger = true) {
        let m = this[types_1.MetaKeys.Models].pop();
        if (trigger)
            this.trigger(types_1.ModelEvents.Remove, m, this[types_1.MetaKeys.Models].length);
        return m;
    }
    insert(m, index) {
        if (index >= this.length)
            return;
        this[types_1.MetaKeys.Models].splice(index, 0, m);
        this.trigger(types_1.ModelEvents.Add, m, index);
    }
    indexOf(m) {
        for (let i = 0, ii = this.length; i < ii; i++) {
            if (this[types_1.MetaKeys.Models][i] === m)
                return i;
        }
        return -1;
    }
    removeAtIndex(index) {
        let m = this.item(index);
        if (!m)
            return undefined;
        this.trigger(types_1.ModelEvents.BeforeRemove, m, index);
        this[types_1.MetaKeys.Models].splice(index, 1);
        this.trigger(types_1.ModelEvents.Remove, m, index);
        return m;
    }
    remove(model) {
        let i = -1;
        if (!~(i = this.indexOf(model))) {
            return void 0;
        }
        ;
        return this.removeAtIndex(i);
    }
    find(fn) {
        return this[types_1.MetaKeys.Models].find(fn);
    }
    findIndex(fn) {
        return this[types_1.MetaKeys.Models].findIndex(fn);
    }
    sort(byComparatorOrProperty) {
        this.trigger(types_1.ModelEvents.BeforeSort);
        if (utils_1.isString(byComparatorOrProperty)) {
            const prop = byComparatorOrProperty;
            byComparatorOrProperty = (a, b) => sort(a, b, prop);
        }
        this[types_1.MetaKeys.Models].sort(byComparatorOrProperty);
        this.trigger(types_1.ModelEvents.Sort);
    }
    /**
     * Reset the array
     *
     * @param {T[]} [a]
     *
     * @memberof ArrayCollection
     */
    reset(a) {
        this.trigger(types_1.ModelEvents.BeforeReset);
        this[types_1.MetaKeys.Models] = a || [];
        this.trigger(types_1.ModelEvents.Reset);
    }
    filter(fn) {
        return Reflect.construct(this.constructor, [this[types_1.MetaKeys.Models].filter(fn)]);
    }
    map(fn) {
        return new ArrayCollection(this[types_1.MetaKeys.Models].map(fn));
    }
    forEach(fn) {
        this.forEach(fn);
        return this;
    }
    destroy() {
        for (let i = 0, ii = this[types_1.MetaKeys.Models].length; i < ii; i++) {
            if (types_1.isDestroyable(this[types_1.MetaKeys.Models][i]))
                this[types_1.MetaKeys.Models][i].destroy();
        }
        this[types_1.MetaKeys.Models] = [];
    }
    toJSON() {
        return this[types_1.MetaKeys.Models].map(m => utils_1.isFunction(m.toJSON) ? m.toJSON() : m);
    }
    // Iterator interface
    [(types_1.MetaKeys.Models, Symbol.iterator)]() {
        let pointer = 0;
        let components = this[types_1.MetaKeys.Models];
        let len = components.length;
        return {
            next() {
                let done = pointer >= len;
                return {
                    done: done,
                    value: done ? null : components[pointer++]
                };
            }
        };
    }
}
exports.ArrayCollection = ArrayCollection;
