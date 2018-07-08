import { isFunction, equal, triggerMethodOn, isString, isObject, Invoker, uniqueId, isPlainObject } from '@viewjs/utils';
import { EventEmitter, isEventEmitter } from '@viewjs/events';

var MetaKeys;

(function (MetaKeys) {
  MetaKeys.Attributes = Symbol("attributes");
  MetaKeys.Models = Symbol("models");
})(MetaKeys || (MetaKeys = {}));

function isDestroyable(a) {
  return a && isFunction(a.destroy);
}
var ModelEvents;

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
})(ModelEvents || (ModelEvents = {}));

var _a;
function isModel(a) {
  return a && (a instanceof Model || isFunction(a.set) && isFunction(a.get) && isFunction(a.unset) && isFunction(a.clear));
}

class Model extends EventEmitter {
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

    if (equal(old, value)) {
      return this;
    }

    this[MetaKeys.Attributes].set(key, value);
    if (options && options.silent) return this;
    triggerMethodOn(this, `change:${key}`, old, value);
    triggerMethodOn(this, 'change', {
      [key]: value
    });
    return this;
  }

  get(key) {
    return this[MetaKeys.Attributes].get(key);
  }

  has(key) {
    return this[MetaKeys.Attributes].has(key);
  }

  unset(key) {
    let t = this.get(key);
    this[MetaKeys.Attributes].delete(key);
    return t;
  }

  clear() {
    this[MetaKeys.Attributes] = new Map();
    triggerMethodOn(this, 'clear');
    return this;
  }

  toJSON() {
    let out = {};
    this[MetaKeys.Attributes].forEach((value, key) => {
      out[key] = value;
    });
    return out;
  }

}

_a = MetaKeys.Attributes;
Model.idAttribute = "id";

function getValue(a, prop) {
  if (isModel(a)) return a.get(prop);else if (isObject(a)) {
    return a[prop];
  }
  return void 0;
}

function sort(a, b, prop) {
  let av = getValue(a, prop),
      bv = getValue(b, prop);
  if (isString(av)) av = av.toUpperCase();
  if (isString(bv)) bv = bv.toUpperCase();
  if (av < bv) return -1;else if (av > bv) return 1;else return 0;
}

class ArrayCollection extends EventEmitter {
  constructor(array = []) {
    super();
    this[MetaKeys.Models] = array;
  }
  /**
   * The length of the array
   *
   * @readonly
   * @type {number}
   * @memberof ArrayCollection
   */


  get length() {
    return this[MetaKeys.Models].length;
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
    if (index >= this[MetaKeys.Models].length) return undefined;
    return this[MetaKeys.Models][index];
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
    this[MetaKeys.Models].push(m);
    if (trigger) this.trigger(ModelEvents.Add, m, this[MetaKeys.Models].length - 1);
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
    let m = this[MetaKeys.Models].pop();
    if (trigger) this.trigger(ModelEvents.Remove, m, this[MetaKeys.Models].length);
    return m;
  }

  insert(m, index) {
    if (index >= this.length) return;
    this[MetaKeys.Models].splice(index, 0, m);
    this.trigger(ModelEvents.Add, m, index);
  }

  indexOf(m) {
    for (let i = 0, ii = this.length; i < ii; i++) {
      if (this[MetaKeys.Models][i] === m) return i;
    }

    return -1;
  }

  removeAtIndex(index) {
    let m = this.item(index);
    if (!m) return undefined;
    this.trigger(ModelEvents.BeforeRemove, m, index);
    this[MetaKeys.Models].splice(index, 1);
    this.trigger(ModelEvents.Remove, m, index);
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
    return this[MetaKeys.Models].find(fn);
  }

  findIndex(fn) {
    return this[MetaKeys.Models].findIndex(fn);
  }

  sort(byComparatorOrProperty) {
    this.trigger(ModelEvents.BeforeSort);

    if (isString(byComparatorOrProperty)) {
      const prop = byComparatorOrProperty;

      byComparatorOrProperty = (a, b) => sort(a, b, prop);
    }

    this[MetaKeys.Models].sort(byComparatorOrProperty);
    this.trigger(ModelEvents.Sort);
  }
  /**
   * Reset the array
   *
   * @param {T[]} [a]
   *
   * @memberof ArrayCollection
   */


  reset(a) {
    this.trigger(ModelEvents.BeforeReset);
    this[MetaKeys.Models] = a || [];
    this.trigger(ModelEvents.Reset);
  }

  filter(fn) {
    return Reflect.construct(this.constructor, [this[MetaKeys.Models].filter(fn)]);
  }

  map(fn) {
    return new ArrayCollection(this[MetaKeys.Models].map(fn));
  }

  forEach(fn) {
    this.forEach(fn);
    return this;
  }

  destroy() {
    for (let i = 0, ii = this[MetaKeys.Models].length; i < ii; i++) {
      if (isDestroyable(this[MetaKeys.Models][i])) this[MetaKeys.Models][i].destroy();
    }

    this[MetaKeys.Models] = [];
  } // Iterator interface


  [(MetaKeys.Models, Symbol.iterator)]() {
    let pointer = 0;
    let components = this[MetaKeys.Models];
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
    const model = Invoker.get(this.Model);

    if (o) {
      for (let key in o) {
        model.set(key, o[key]);
      }
    }

    if (!model.has(this.Model.idAttribute)) {
      model.set(this.Model.idAttribute, uniqueId());
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
      if (!isPlainObject(m)) throw new TypeError("invalid type");
      m = this.createModel(m);
    } else if (m instanceof Model && !m.has(this.Model.idAttribute)) {
      m.set(this.Model.idAttribute, uniqueId());
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
      if (trigger) triggerMethodOn(this, 'before:set:model');

      if (this._model) {
        this._undelegateModelEvents(this._model);
      }

      this._model = model;
      if (model) this._delegateModelEvents(model);
      if (trigger) triggerMethodOn(this, 'set:model');
      return this;
    }

    _undelegateModelEvents(model) {
      if (!this.modelEvents || !model || !isEventEmitter(model)) {
        return;
      }

      for (let key in this.modelEvents) {
        this.modelEvents[key].forEach(m => {
          if (isString(m)) {
            if (isFunction(this[m])) {
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
      if (!this.modelEvents || !model || !isEventEmitter(model)) {
        return;
      }

      for (let key in this.modelEvents) {
        this.modelEvents[key].forEach(m => {
          if (isString(m)) {
            if (isFunction(this[m])) {
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

export { MetaKeys, isDestroyable, ModelEvents, isModel, Model, ArrayCollection, ModelCollection, withModel };
