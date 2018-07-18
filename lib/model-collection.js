"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const array_collection_1 = require("./array-collection");
const model_1 = require("./model");
const utils_1 = require("@viewjs/utils");
class ModelCollection extends array_collection_1.ArrayCollection {
    constructor(models, options = {}) {
        super();
        if (options.Model) {
            this.Model = options.Model;
        }
        if (Array.isArray(models)) {
            models.forEach(m => this.push(m));
        }
    }
    get Model() {
        if (!this._Model)
            return model_1.Model;
        return this._Model;
    }
    set Model(model) {
        this._Model = model;
    }
    ensureModel(m) {
        if (!(m instanceof this.Model)) {
            if (!utils_1.isPlainObject(m))
                throw new TypeError("invalid type");
            m = this.createModel(m);
        }
        return m;
    }
    createModel(o) {
        const model = utils_1.Invoker.get(this.Model);
        if (o) {
            model.set(o, void 0, { silent: true });
        }
        return model;
    }
    /**
     * Push a model to the collection
     *
     * @param {(M | any)} m
     * @param {boolean} [trigger=true]
     * @returns {number}
     * @memberof ModelCollection
     */
    push(m, trigger = true) {
        m = this.ensureModel(m);
        const found = this.find(model => model.id == m.id);
        if (found && found !== m) {
            let json = m.toJSON();
            for (let k in json) {
                m.set(k, json[k]);
            }
            return this.length;
        }
        else if (found === m)
            return this.length;
        const ret = super.push(m, trigger);
        return ret;
    }
    reset(a) {
        return super.reset((a || []).map(m => this.ensureModel(m)));
    }
    insert(m, index) {
        if (index >= this.length)
            return;
        m = this.ensureModel(m);
        const found = this.find(model => model.id == m.id);
        if (found && found !== m) {
            let json = m.toJSON();
            for (let k in json) {
                m.set(k, json[k]);
            }
            return;
        }
        else if (found === m)
            return;
        super.insert(m, index);
    }
}
exports.ModelCollection = ModelCollection;
