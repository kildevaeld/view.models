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
    createModel(o) {
        const model = utils_1.Invoker.get(this.Model);
        if (o) {
            for (let key in o) {
                model.set(key, o[key]);
            }
        }
        if (!model.has(this.Model.idAttribute)) {
            model.set(this.Model.idAttribute, utils_1.uniqueId());
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
        if (!(m instanceof this.Model)) {
            if (!utils_1.isPlainObject(m))
                throw new TypeError("invalid type");
            m = this.createModel(m);
        }
        else if ((m instanceof model_1.Model) && !m.has(this.Model.idAttribute)) {
            m.set(this.Model.idAttribute, utils_1.uniqueId());
        }
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
        return super.push(m, trigger);
    }
}
exports.ModelCollection = ModelCollection;
