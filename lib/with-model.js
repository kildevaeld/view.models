"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@viewjs/utils");
const model_1 = require("./model");
const events_1 = require("@viewjs/events");
function withModel(Base, TModel) {
    return class extends Base {
        constructor() {
            super(...arguments);
            this.Model = TModel || model_1.Model;
            this._model = new model_1.Model();
            this.modelEvents = {};
        }
        set model(model) {
            this.setModel(model);
        }
        get model() {
            return this._model;
        }
        setModel(model, trigger = true) {
            if (trigger)
                utils_1.triggerMethodOn(this, 'before:set:model');
            if (this._model) {
                this._undelegateModelEvents(this._model);
            }
            this._model = model;
            if (model)
                this._delegateModelEvents(model);
            if (trigger)
                utils_1.triggerMethodOn(this, 'set:model');
            return this;
        }
        _undelegateModelEvents(model) {
            if (!this.modelEvents || !model || !events_1.isEventEmitter(model)) {
                return;
            }
            for (let key in this.modelEvents) {
                this.modelEvents[key].forEach(m => {
                    if (utils_1.isString(m)) {
                        if (utils_1.isFunction(this[m])) {
                            m = this[m];
                        }
                        else {
                            throw new Error('not a function');
                        }
                    }
                    model.off(key, m, this);
                });
            }
        }
        _delegateModelEvents(model) {
            if (!this.modelEvents || !model || !events_1.isEventEmitter(model)) {
                return;
            }
            for (let key in this.modelEvents) {
                this.modelEvents[key].forEach(m => {
                    if (utils_1.isString(m)) {
                        if (utils_1.isFunction(this[m])) {
                            m = this[m];
                        }
                        else {
                            throw new Error('not a function');
                        }
                    }
                    model.on(key, m, this);
                });
            }
        }
        destroy() {
            if (this.model)
                this._undelegateModelEvents(this.model);
            if (Base.prototype.destroy)
                Base.prototype.destroy.call(this);
            return this;
        }
    };
}
exports.withModel = withModel;
