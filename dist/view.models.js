(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@viewjs/utils'), require('@viewjs/events')) :
    typeof define === 'function' && define.amd ? define(['exports', '@viewjs/utils', '@viewjs/events'], factory) :
    (factory((global.viewjs = global.viewjs || {}, global.viewjs.models = {}),global.viewjs.utils,global.viewjs.events));
}(this, (function (exports,utils,events) { 'use strict';

    (function (MetaKeys) {
      MetaKeys.Attributes = Symbol("attributes");
      MetaKeys.Models = Symbol("models");
    })(exports.MetaKeys || (exports.MetaKeys = {}));

    function isDestroyable(a) {
      return a && utils.isFunction(a.destroy);
    }

    (function (ModelEvents) {
      ModelEvents.Add = "add";
      ModelEvents.BeforeRemove = "before:remove";
      ModelEvents.Remove = "remove";
      ModelEvents.Clear = "clear";
      ModelEvents.BeforeSort = "before:sort";
      ModelEvents.Sort = "sort";
      ModelEvents.Change = "change";
      ModelEvents.BeforeReset = "before:reset";
      ModelEvents.Reset = "reset";
    })(exports.ModelEvents || (exports.ModelEvents = {}));

    var _a;
    function isModel(a) {
      return a && (a instanceof Model || utils.isFunction(a.set) && utils.isFunction(a.get) && utils.isFunction(a.unset) && utils.isFunction(a.clear));
    }

    class Model extends events.EventEmitter {
      constructor(attrs) {
        super();
        this[_a] = new Map();

        if (attrs) {
          for (let k in attrs) {
            this.set(k, attrs[k], {
              silent: true
            });
          }
        }
      }

      get id() {
        return this.get(this.constructor.idAttribute);
      }

      set(key, value, options) {
        let old = this.get(key);

        if (utils.equal(old, value)) {
          return this;
        }

        this[exports.MetaKeys.Attributes].set(key, value);
        if (options && options.silent) return this;
        utils.triggerMethodOn(this, `change:${key}`, old, value);
        utils.triggerMethodOn(this, 'change', {
          [key]: value
        });
        return this;
      }

      get(key) {
        return this[exports.MetaKeys.Attributes].get(key);
      }

      has(key) {
        return this[exports.MetaKeys.Attributes].has(key);
      }

      unset(key) {
        let t = this.get(key);
        this[exports.MetaKeys.Attributes].delete(key);
        return t;
      }

      clear() {
        this[exports.MetaKeys.Attributes] = new Map();
        utils.triggerMethodOn(this, 'clear');
        return this;
      }

      toJSON() {
        let out = {};
        this[exports.MetaKeys.Attributes].forEach((value, key) => {
          out[key] = value;
        });
        return out;
      }

    }

    _a = exports.MetaKeys.Attributes;
    Model.idAttribute = "id";

    function getValue(a, prop) {
      if (isModel(a)) return a.get(prop);else if (utils.isObject(a)) {
        return a[prop];
      }
      return void 0;
    }

    function sort(a, b, prop) {
      let av = getValue(a, prop),
          bv = getValue(b, prop);
      if (utils.isString(av)) av = av.toUpperCase();
      if (utils.isString(bv)) bv = bv.toUpperCase();
      if (av < bv) return -1;else if (av > bv) return 1;else return 0;
    }

    class ArrayCollection extends events.EventEmitter {
      constructor(array = []) {
        super();
        this[exports.MetaKeys.Models] = array;
      }
      /**
       * The length of the array
       *
       * @readonly
       * @type {number}
       * @memberof ArrayCollection
       */


      get length() {
        return this[exports.MetaKeys.Models].length;
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
        if (index >= this[exports.MetaKeys.Models].length) return undefined;
        return this[exports.MetaKeys.Models][index];
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
        this[exports.MetaKeys.Models].push(m);
        if (trigger) this.trigger(exports.ModelEvents.Add, m, this[exports.MetaKeys.Models].length - 1);
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
        let m = this[exports.MetaKeys.Models].pop();
        if (trigger) this.trigger(exports.ModelEvents.Remove, m, this[exports.MetaKeys.Models].length);
        return m;
      }

      insert(m, index) {
        if (index >= this.length) return;
        this[exports.MetaKeys.Models].splice(index, 0, m);
        this.trigger(exports.ModelEvents.Add, m, index);
      }

      indexOf(m) {
        for (let i = 0, ii = this.length; i < ii; i++) {
          if (this[exports.MetaKeys.Models][i] === m) return i;
        }

        return -1;
      }

      removeAtIndex(index) {
        let m = this.item(index);
        if (!m) return undefined;
        this.trigger(exports.ModelEvents.BeforeRemove, m, index);
        this[exports.MetaKeys.Models].splice(index, 1);
        this.trigger(exports.ModelEvents.Remove, m, index);
        return m;
      }

      remove(model) {
        let i = -1;

        if (!~(i = this.indexOf(model))) {
          return void 0;
        }
        return this.removeAtIndex(i);
      }

      find(fn) {
        return this[exports.MetaKeys.Models].find(fn);
      }

      findIndex(fn) {
        return this[exports.MetaKeys.Models].findIndex(fn);
      }

      sort(byComparatorOrProperty) {
        this.trigger(exports.ModelEvents.BeforeSort);

        if (utils.isString(byComparatorOrProperty)) {
          const prop = byComparatorOrProperty;

          byComparatorOrProperty = (a, b) => sort(a, b, prop);
        }

        this[exports.MetaKeys.Models].sort(byComparatorOrProperty);
        this.trigger(exports.ModelEvents.Sort);
      }
      /**
       * Reset the array
       *
       * @param {T[]} [a]
       *
       * @memberof ArrayCollection
       */


      reset(a) {
        this.trigger(exports.ModelEvents.BeforeReset);
        this[exports.MetaKeys.Models] = a || [];
        this.trigger(exports.ModelEvents.Reset);
      }

      filter(fn) {
        return Reflect.construct(this.constructor, [this[exports.MetaKeys.Models].filter(fn)]);
      }

      map(fn) {
        return new ArrayCollection(this[exports.MetaKeys.Models].map(fn));
      }

      forEach(fn) {
        this.forEach(fn);
        return this;
      }

      destroy() {
        for (let i = 0, ii = this[exports.MetaKeys.Models].length; i < ii; i++) {
          if (isDestroyable(this[exports.MetaKeys.Models][i])) this[exports.MetaKeys.Models][i].destroy();
        }

        this[exports.MetaKeys.Models] = [];
      } // Iterator interface


      [(exports.MetaKeys.Models, Symbol.iterator)]() {
        let pointer = 0;
        let components = this[exports.MetaKeys.Models];
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

    class ModelCollection extends ArrayCollection {
      constructor(models) {
        super();
        this.Model = Model;

        if (Array.isArray(models)) {
          models.forEach(m => this.push(m));
        }
      }

      createModel(o) {
        const model = utils.Invoker.get(this.Model);

        if (o) {
          for (let key in o) {
            model.set(key, o[key]);
          }
        }

        if (!model.has(this.Model.idAttribute)) {
          model.set(this.Model.idAttribute, utils.uniqueId());
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
          if (!utils.isPlainObject(m)) throw new TypeError("invalid type");
          m = this.createModel(m);
        } else if (m instanceof Model && !m.has(this.Model.idAttribute)) {
          m.set(this.Model.idAttribute, utils.uniqueId());
        }

        const found = this.find(model => model.id == m.id);

        if (found && found !== m) {
          let json = m.toJSON();

          for (let k in json) {
            m.set(k, json[k]);
          }

          return this.length;
        } else if (found === m) return this.length;

        return super.push(m, trigger);
      }

    }

    function withModel(Base, TModel) {
      return class extends Base {
        constructor() {
          super(...arguments);
          this.Model = TModel || Model;
          this._model = new Model();
          this.modelEvents = {};
        }

        set model(model) {
          this.setModel(model);
        }

        get model() {
          return this._model;
        }

        setModel(model, trigger = true) {
          if (trigger) utils.triggerMethodOn(this, 'before:set:model');

          if (this._model) {
            this._undelegateModelEvents(this._model);
          }

          this._model = model;
          if (model) this._delegateModelEvents(model);
          if (trigger) utils.triggerMethodOn(this, 'set:model');
          return this;
        }

        _undelegateModelEvents(model) {
          if (!this.modelEvents || !model || !events.isEventEmitter(model)) {
            return;
          }

          for (let key in this.modelEvents) {
            this.modelEvents[key].forEach(m => {
              if (utils.isString(m)) {
                if (utils.isFunction(this[m])) {
                  m = this[m];
                } else {
                  throw new Error('not a function');
                }
              }

              model.off(key, m, this);
            });
          }
        }

        _delegateModelEvents(model) {
          if (!this.modelEvents || !model || !events.isEventEmitter(model)) {
            return;
          }

          for (let key in this.modelEvents) {
            this.modelEvents[key].forEach(m => {
              if (utils.isString(m)) {
                if (utils.isFunction(this[m])) {
                  m = this[m];
                } else {
                  throw new Error('not a function');
                }
              }

              model.on(key, m, this);
            });
          }
        }

        destroy() {
          if (this.model) this._undelegateModelEvents(this.model);
          if (Base.prototype.destroy) Base.prototype.destroy.call(this);
          return this;
        }

      };
    }

    exports.isDestroyable = isDestroyable;
    exports.isModel = isModel;
    exports.Model = Model;
    exports.ArrayCollection = ArrayCollection;
    exports.ModelCollection = ModelCollection;
    exports.withModel = withModel;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
