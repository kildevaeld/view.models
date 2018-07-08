"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@viewjs/utils");
function setter(_, prop) {
    return function $observableSetter(value) {
        return this.set(prop, value);
    };
}
function getter(_, prop) {
    return function $observableGetter() {
        return this.get(prop);
    };
}
function _event(event, property, target, prop, desc, targetKey) {
    if (!desc)
        throw new Error('no description');
    if (typeof desc.value !== 'function') {
        throw new TypeError('must be a function');
    }
    const key = event + (property ? ':' + property : '');
    if (target[targetKey] && utils_1.has(target[targetKey], key)) {
        let old = target[targetKey][key];
        if (!Array.isArray(old))
            old = [old];
        old.push(prop);
        target[targetKey][key] = old;
    }
    else {
        target[targetKey] = utils_1.extend(target[targetKey] || {}, {
            [key]: [prop]
        });
    }
}
/**
     *
     * @export
     * @template
     * @param {T} target
     * @param {*} prop
     * @param {TypedPropertyDescriptor<U>} [descriptor]
     */
function property(target, prop, descriptor) {
    descriptor = descriptor || Object.getOwnPropertyDescriptor(target, prop);
    if (!descriptor) {
        return {
            get: getter(target, prop),
            set: setter(target, prop),
            enumerable: false,
            configurable: false
        };
    }
    else if (descriptor.set) {
        descriptor.set = setter(target, prop);
        descriptor.get = getter(target, prop);
        if (descriptor.value)
            target.set(prop, descriptor.value);
        delete descriptor.value;
    }
}
exports.property = property;
function idAttribute(prop) {
    return function (target) {
        target.idAttribute = prop;
    };
}
exports.idAttribute = idAttribute;
var model;
(function (model) {
    function event(event, property) {
        return function (target, prop, desc) {
            return _event(event, property, target, prop, desc, "modelEvents");
        };
    }
    model.event = event;
    function change(property) {
        return event("change", property);
    }
    model.change = change;
})(model = exports.model || (exports.model = {}));
