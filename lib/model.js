"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a;
"use strict";
const utils_1 = require("@viewjs/utils");
const types_1 = require("./types");
const events_1 = require("@viewjs/events");
function isModel(a) {
    return a && ((a instanceof Model)
        || (utils_1.isFunction(a.set)
            && utils_1.isFunction(a.get)
            && utils_1.isFunction(a.unset)
            && utils_1.isFunction(a.clear)));
}
exports.isModel = isModel;
function enumerable(value) {
    return function (target, propertyKey, descriptor) {
        if (!descriptor) {
            return {
                enumerable: value,
                writable: true
            };
        }
        descriptor.enumerable = value;
    };
}
exports.enumerable = enumerable;
function define(value) {
    return function (target, propertyKey, descriptor) {
        return descriptor ? utils_1.extend(descriptor, value) : value;
    };
}
exports.define = define;
class Model extends events_1.EventEmitter {
    constructor(attrs) {
        super();
        this[_a] = new Map();
        if (attrs) {
            for (let k in attrs) {
                this.set(k, attrs[k], { silent: true });
            }
        }
    }
    get id() {
        return this.get(this.constructor.idAttribute);
    }
    set(key, value, options) {
        let input = {};
        options = options || {};
        if (utils_1.isString(key) || utils_1.isNumber(key))
            input = { [key]: value };
        else if (utils_1.isPlainObject(input))
            input = key;
        else
            throw new TypeError('invalid key type ' + typeof key);
        let o, v, c = false, changed = {};
        for (let k in input) {
            o = this.get(k);
            v = input[k];
            if (utils_1.equal(o, v)) {
                continue;
            }
            c = true;
            this[types_1.MetaKeys.Attributes].set(k, v);
            changed[k] = v;
            if (!options.silent) {
                this.trigger(`change:${k}`, o, v);
            }
        }
        if (c && !options.silent)
            utils_1.triggerMethodOn(this, 'change', changed);
        return this;
    }
    get(key) {
        return this[types_1.MetaKeys.Attributes].get(key);
    }
    has(key) {
        return this[types_1.MetaKeys.Attributes].has(key);
    }
    unset(key) {
        if (!this.has(key))
            return void 0;
        let t = this.get(key);
        this[types_1.MetaKeys.Attributes].delete(key);
        return t;
    }
    clear() {
        this[types_1.MetaKeys.Attributes].clear();
        utils_1.triggerMethodOn(this, 'clear');
        return this;
    }
    toJSON() {
        let out = {};
        this[types_1.MetaKeys.Attributes].forEach((value, key) => {
            out[key] = value;
        });
        return out;
    }
}
_a = types_1.MetaKeys.Attributes;
Model.idAttribute = "id";
exports.Model = Model;
