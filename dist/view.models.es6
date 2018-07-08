import { isFunction, equal, triggerMethodOn, extend, isString, isNumber, isPlainObject, isObject, Invoker, uniqueId } from '@viewjs/utils';
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

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

var _a;
function isModel(a) {
  return a && (a instanceof Model || isFunction(a.set) && isFunction(a.get) && isFunction(a.unset) && isFunction(a.clear));
}
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
function define(value) {
  return function (target, propertyKey, descriptor) {
    return descriptor ? extend(descriptor, value) : value;
  };
}

var Model =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(Model, _EventEmitter);

  function Model(attrs) {
    var _this;

    _classCallCheck(this, Model);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Model).call(this));
    _this[_a] = new Map();

    if (attrs) {
      for (var k in attrs) {
        _this.set(k, attrs[k], {
          silent: true
        });
      }
    }

    return _this;
  }

  _createClass(Model, [{
    key: "set",
    value: function set(key, value, options) {
      var input = {};
      options = options || {};
      if (isString(key) || isNumber(key)) input = _defineProperty({}, key, value);else if (isPlainObject(input)) input = key;else throw new TypeError('invalid key type ' + _typeof(key));
      var o,
          v,
          c = false,
          changed = {};

      for (var k in input) {
        o = this.get(k);
        v = input[k];

        if (equal(o, v)) {
          continue;
        }

        c = true;
        this[MetaKeys.Attributes].set(k, v);
        changed[k] = v;
        if (!options.silent) this.trigger(this, "change:".concat(k), o, v);
      }

      if (c && !options.silent) triggerMethodOn(this, 'change', changed);
      return this;
    }
  }, {
    key: "get",
    value: function get(key) {
      return this[MetaKeys.Attributes].get(key);
    }
  }, {
    key: "has",
    value: function has(key) {
      return this[MetaKeys.Attributes].has(key);
    }
  }, {
    key: "unset",
    value: function unset(key) {
      if (!this.has(key)) return void 0;
      var t = this.get(key);
      this[MetaKeys.Attributes].delete(key);
      return t;
    }
  }, {
    key: "clear",
    value: function clear() {
      this[MetaKeys.Attributes].clear();
      triggerMethodOn(this, 'clear');
      return this;
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      var out = {};
      this[MetaKeys.Attributes].forEach(function (value, key) {
        out[key] = value;
      });
      return out;
    }
  }, {
    key: "id",
    get: function get() {
      return this.get(this.constructor.idAttribute);
    }
  }]);

  return Model;
}(EventEmitter);

_a = MetaKeys.Attributes;
Model.idAttribute = "id";

function getValue(a, prop) {
  if (isModel(a)) return a.get(prop);else if (isObject(a)) {
    return a[prop];
  }
  return void 0;
}

function _sort(a, b, prop) {
  var av = getValue(a, prop),
      bv = getValue(b, prop);
  if (isString(av)) av = av.toUpperCase();
  if (isString(bv)) bv = bv.toUpperCase();
  if (av < bv) return -1;else if (av > bv) return 1;else return 0;
}

var ArrayCollection =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(ArrayCollection, _EventEmitter);

  function ArrayCollection() {
    var _this;

    var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    _classCallCheck(this, ArrayCollection);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ArrayCollection).call(this));
    _this[MetaKeys.Models] = array;
    return _this;
  }
  /**
   * The length of the array
   *
   * @readonly
   * @type {number}
   * @memberof ArrayCollection
   */


  _createClass(ArrayCollection, [{
    key: "item",

    /**
     * Get item at index
     *
     * @param {number} index
     * @returns {(T | undefined)}
     *
     * @memberof ArrayCollection
     */
    value: function item(index) {
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

  }, {
    key: "push",
    value: function push(m) {
      var trigger = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
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

  }, {
    key: "pop",
    value: function pop() {
      var trigger = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var m = this[MetaKeys.Models].pop();
      if (trigger) this.trigger(ModelEvents.Remove, m, this[MetaKeys.Models].length);
      return m;
    }
  }, {
    key: "insert",
    value: function insert(m, index) {
      if (index >= this.length) return;
      this[MetaKeys.Models].splice(index, 0, m);
      this.trigger(ModelEvents.Add, m, index);
    }
  }, {
    key: "indexOf",
    value: function indexOf(m) {
      for (var i = 0, ii = this.length; i < ii; i++) {
        if (this[MetaKeys.Models][i] === m) return i;
      }

      return -1;
    }
  }, {
    key: "removeAtIndex",
    value: function removeAtIndex(index) {
      var m = this.item(index);
      if (!m) return undefined;
      this.trigger(ModelEvents.BeforeRemove, m, index);
      this[MetaKeys.Models].splice(index, 1);
      this.trigger(ModelEvents.Remove, m, index);
      return m;
    }
  }, {
    key: "remove",
    value: function remove(model) {
      var i = -1;

      if (!~(i = this.indexOf(model))) {
        return void 0;
      }
      return this.removeAtIndex(i);
    }
  }, {
    key: "find",
    value: function find(fn) {
      return this[MetaKeys.Models].find(fn);
    }
  }, {
    key: "findIndex",
    value: function findIndex(fn) {
      return this[MetaKeys.Models].findIndex(fn);
    }
  }, {
    key: "sort",
    value: function sort(byComparatorOrProperty) {
      this.trigger(ModelEvents.BeforeSort);

      if (isString(byComparatorOrProperty)) {
        var prop = byComparatorOrProperty;

        byComparatorOrProperty = function byComparatorOrProperty(a, b) {
          return _sort(a, b, prop);
        };
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

  }, {
    key: "reset",
    value: function reset(a) {
      this.trigger(ModelEvents.BeforeReset);
      this[MetaKeys.Models] = a || [];
      this.trigger(ModelEvents.Reset);
    }
  }, {
    key: "filter",
    value: function filter(fn) {
      return Reflect.construct(this.constructor, [this[MetaKeys.Models].filter(fn)]);
    }
  }, {
    key: "map",
    value: function map(fn) {
      return new ArrayCollection(this[MetaKeys.Models].map(fn));
    }
  }, {
    key: "forEach",
    value: function forEach(fn) {
      this.forEach(fn);
      return this;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      for (var i = 0, ii = this[MetaKeys.Models].length; i < ii; i++) {
        if (isDestroyable(this[MetaKeys.Models][i])) this[MetaKeys.Models][i].destroy();
      }

      this[MetaKeys.Models] = [];
    } // Iterator interface

  }, {
    key: (MetaKeys.Models, Symbol.iterator),
    value: function value() {
      var pointer = 0;
      var components = this[MetaKeys.Models];
      var len = components.length;
      return {
        next: function next() {
          var done = pointer >= len;
          return {
            done: done,
            value: done ? null : components[pointer++]
          };
        }
      };
    }
  }, {
    key: "length",
    get: function get() {
      return this[MetaKeys.Models].length;
    }
  }]);

  return ArrayCollection;
}(EventEmitter);

var ModelCollection =
/*#__PURE__*/
function (_ArrayCollection) {
  _inherits(ModelCollection, _ArrayCollection);

  function ModelCollection(models) {
    var _this;

    _classCallCheck(this, ModelCollection);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ModelCollection).call(this));
    _this.Model = Model;

    if (Array.isArray(models)) {
      models.forEach(function (m) {
        return _this.push(m);
      });
    }

    return _this;
  }

  _createClass(ModelCollection, [{
    key: "createModel",
    value: function createModel(o) {
      var model = Invoker.get(this.Model);

      if (o) {
        for (var key in o) {
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

  }, {
    key: "push",
    value: function push(m) {
      var trigger = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (!(m instanceof this.Model)) {
        if (!isPlainObject(m)) throw new TypeError("invalid type");
        m = this.createModel(m);
      } else if (m instanceof Model && !m.has(this.Model.idAttribute)) {
        m.set(this.Model.idAttribute, uniqueId());
      }

      var found = this.find(function (model) {
        return model.id == m.id;
      });

      if (found && found !== m) {
        var json = m.toJSON();

        for (var k in json) {
          m.set(k, json[k]);
        }

        return this.length;
      } else if (found === m) return this.length;

      return _get(_getPrototypeOf(ModelCollection.prototype), "push", this).call(this, m, trigger);
    }
  }]);

  return ModelCollection;
}(ArrayCollection);

function withModel(Base, TModel) {
  return (
    /*#__PURE__*/
    function (_Base) {
      _inherits(_class, _Base);

      function _class() {
        var _this;

        _classCallCheck(this, _class);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).apply(this, arguments));
        _this.Model = TModel || Model;
        _this._model = new Model();
        _this.modelEvents = {};
        return _this;
      }

      _createClass(_class, [{
        key: "setModel",
        value: function setModel(model) {
          var trigger = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
          if (trigger) triggerMethodOn(this, 'before:set:model');

          if (this._model) {
            this._undelegateModelEvents(this._model);
          }

          this._model = model;
          if (model) this._delegateModelEvents(model);
          if (trigger) triggerMethodOn(this, 'set:model');
          return this;
        }
      }, {
        key: "_undelegateModelEvents",
        value: function _undelegateModelEvents(model) {
          var _this2 = this;

          if (!this.modelEvents || !model || !isEventEmitter(model)) {
            return;
          }

          var _loop = function _loop(key) {
            _this2.modelEvents[key].forEach(function (m) {
              if (isString(m)) {
                if (isFunction(_this2[m])) {
                  m = _this2[m];
                } else {
                  throw new Error('not a function');
                }
              }

              model.off(key, m, _this2);
            });
          };

          for (var key in this.modelEvents) {
            _loop(key);
          }
        }
      }, {
        key: "_delegateModelEvents",
        value: function _delegateModelEvents(model) {
          var _this3 = this;

          if (!this.modelEvents || !model || !isEventEmitter(model)) {
            return;
          }

          var _loop2 = function _loop2(key) {
            _this3.modelEvents[key].forEach(function (m) {
              if (isString(m)) {
                if (isFunction(_this3[m])) {
                  m = _this3[m];
                } else {
                  throw new Error('not a function');
                }
              }

              model.on(key, m, _this3);
            });
          };

          for (var key in this.modelEvents) {
            _loop2(key);
          }
        }
      }, {
        key: "destroy",
        value: function destroy() {
          if (this.model) this._undelegateModelEvents(this.model);
          if (Base.prototype.destroy) Base.prototype.destroy.call(this);
          return this;
        }
      }, {
        key: "model",
        set: function set(model) {
          this.setModel(model);
        },
        get: function get() {
          return this._model;
        }
      }]);

      return _class;
    }(Base)
  );
}

export { MetaKeys, isDestroyable, ModelEvents, isModel, enumerable, define, Model, ArrayCollection, ModelCollection, withModel };
