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
      return a && (a instanceof Model || utils.isFunction(a.set) && utils.isFunction(a.get) && utils.isFunction(a.unset) && utils.isFunction(a.clear));
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
          if (utils.isString(key) || utils.isNumber(key)) input = _defineProperty({}, key, value);else if (utils.isPlainObject(input)) input = key;else throw new TypeError('invalid key type ' + _typeof(key));
          var o,
              v,
              c = false,
              changed = {};

          for (var k in input) {
            o = this.get(k);
            v = input[k];

            if (utils.equal(o, v)) {
              continue;
            }

            c = true;
            this[exports.MetaKeys.Attributes].set(k, v);
            changed[k] = v;

            if (!options.silent) {
              this.trigger("change:".concat(k), o, v);
            }
          }

          if (c && !options.silent) utils.triggerMethodOn(this, 'change', changed);
          return this;
        }
      }, {
        key: "get",
        value: function get(key) {
          return this[exports.MetaKeys.Attributes].get(key);
        }
      }, {
        key: "has",
        value: function has(key) {
          return this[exports.MetaKeys.Attributes].has(key);
        }
      }, {
        key: "unset",
        value: function unset(key) {
          if (!this.has(key)) return void 0;
          var t = this.get(key);
          this[exports.MetaKeys.Attributes].delete(key);
          return t;
        }
      }, {
        key: "clear",
        value: function clear() {
          this[exports.MetaKeys.Attributes].clear();
          utils.triggerMethodOn(this, 'clear');
          return this;
        }
      }, {
        key: "toJSON",
        value: function toJSON() {
          var out = {};
          this[exports.MetaKeys.Attributes].forEach(function (value, key) {
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
    }(events.EventEmitter);

    _a = exports.MetaKeys.Attributes;
    Model.idAttribute = "id";

    function getValue(a, prop) {
      if (isModel(a)) return a.get(prop);else if (utils.isObject(a)) {
        return a[prop];
      }
      return void 0;
    }

    function _sort(a, b, prop) {
      var av = getValue(a, prop),
          bv = getValue(b, prop);
      if (utils.isString(av)) av = av.toUpperCase();
      if (utils.isString(bv)) bv = bv.toUpperCase();
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
        _this[exports.MetaKeys.Models] = array;
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

      }, {
        key: "push",
        value: function push(m) {
          var trigger = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
          this[exports.MetaKeys.Models].push(m);
          this.didAddItem(m, this.length - 1);
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

      }, {
        key: "pop",
        value: function pop() {
          var trigger = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
          var m = this[exports.MetaKeys.Models].pop();
          if (m) this.didRemoveItem(m, this.length);
          if (trigger && m) this.trigger(exports.ModelEvents.Remove, m, this[exports.MetaKeys.Models].length);
          return m;
        }
      }, {
        key: "insert",
        value: function insert(m, index) {
          if (index >= this.length) return;
          this[exports.MetaKeys.Models].splice(index, 0, m);
          this.didAddItem(m, index);
          this.trigger(exports.ModelEvents.Add, m, index);
        }
      }, {
        key: "indexOf",
        value: function indexOf(m) {
          for (var i = 0, ii = this.length; i < ii; i++) {
            if (this[exports.MetaKeys.Models][i] === m) return i;
          }

          return -1;
        }
      }, {
        key: "removeAtIndex",
        value: function removeAtIndex(index) {
          var m = this.item(index);
          if (!m) return undefined;
          this.trigger(exports.ModelEvents.BeforeRemove, m, index);
          this[exports.MetaKeys.Models].splice(index, 1);
          this.didRemoveItem(m, index);
          this.trigger(exports.ModelEvents.Remove, m, index);
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
          return this[exports.MetaKeys.Models].find(fn);
        }
      }, {
        key: "findIndex",
        value: function findIndex(fn) {
          return this[exports.MetaKeys.Models].findIndex(fn);
        }
      }, {
        key: "sort",
        value: function sort(byComparatorOrProperty) {
          this.trigger(exports.ModelEvents.BeforeSort);

          if (utils.isString(byComparatorOrProperty)) {
            var prop = byComparatorOrProperty;

            byComparatorOrProperty = function byComparatorOrProperty(a, b) {
              return _sort(a, b, prop);
            };
          }

          this[exports.MetaKeys.Models].sort(byComparatorOrProperty);
          this.trigger(exports.ModelEvents.Sort);
          return this;
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
          var _this2 = this;

          this.trigger(exports.ModelEvents.BeforeReset, this[exports.MetaKeys.Models]);
          var old = this[exports.MetaKeys.Models];
          this[exports.MetaKeys.Models] = a || [];
          old.forEach(function (m, i) {
            return _this2.didRemoveItem(m, i);
          });
          this[exports.MetaKeys.Models].forEach(function (m, i) {
            return _this2.didAddItem(m, i);
          });
          this.trigger(exports.ModelEvents.Reset, old, this[exports.MetaKeys.Models]);
          return this;
        }
      }, {
        key: "filter",
        value: function filter(fn) {
          return Reflect.construct(this.constructor, [this[exports.MetaKeys.Models].filter(fn)]);
        }
      }, {
        key: "map",
        value: function map(fn) {
          return new ArrayCollection(this[exports.MetaKeys.Models].map(fn));
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
          for (var i = 0, ii = this[exports.MetaKeys.Models].length; i < ii; i++) {
            if (isDestroyable(this[exports.MetaKeys.Models][i])) this[exports.MetaKeys.Models][i].destroy();
          }

          this[exports.MetaKeys.Models] = [];
          return this;
        }
      }, {
        key: "toJSON",
        value: function toJSON() {
          return this[exports.MetaKeys.Models].map(function (m) {
            return utils.isFunction(m.toJSON) ? m.toJSON() : m;
          });
        } // Iterator interface

      }, {
        key: (exports.MetaKeys.Models, Symbol.iterator),
        value: function value() {
          var pointer = 0;
          var components = this[exports.MetaKeys.Models];
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
        key: "didAddItem",
        value: function didAddItem(_, index) {}
      }, {
        key: "didRemoveItem",
        value: function didRemoveItem(_, index) {}
      }, {
        key: "length",
        get: function get() {
          return this[exports.MetaKeys.Models].length;
        }
      }]);

      return ArrayCollection;
    }(events.EventEmitter);

    var ModelCollection =
    /*#__PURE__*/
    function (_ArrayCollection) {
      _inherits(ModelCollection, _ArrayCollection);

      function ModelCollection(models) {
        var _this;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, ModelCollection);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(ModelCollection).call(this));

        if (options.Model) {
          _this.Model = options.Model;
        }

        if (Array.isArray(models)) {
          models.forEach(function (m) {
            return _this.push(m);
          });
        }

        return _this;
      }

      _createClass(ModelCollection, [{
        key: "ensureModel",
        value: function ensureModel(m) {
          if (!(m instanceof this.Model)) {
            if (!utils.isPlainObject(m)) throw new TypeError("invalid type");
            m = this.createModel(m);
          }

          return m;
        }
      }, {
        key: "createModel",
        value: function createModel(o) {
          var model = utils.Invoker.get(this.Model);

          if (o) {
            model.set(o, void 0, {
              silent: true
            });
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
          m = this.ensureModel(m);
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

          var ret = _get(_getPrototypeOf(ModelCollection.prototype), "push", this).call(this, m, trigger);

          return ret;
        }
      }, {
        key: "reset",
        value: function reset(a) {
          var _this2 = this;

          return _get(_getPrototypeOf(ModelCollection.prototype), "reset", this).call(this, (a || []).map(function (m) {
            return _this2.ensureModel(m);
          }));
        }
      }, {
        key: "insert",
        value: function insert(m, index) {
          if (index >= this.length) return;
          m = this.ensureModel(m);
          var found = this.find(function (model) {
            return model.id == m.id;
          });

          if (found && found !== m) {
            var json = m.toJSON();

            for (var k in json) {
              m.set(k, json[k]);
            }

            return;
          } else if (found === m) return;

          _get(_getPrototypeOf(ModelCollection.prototype), "insert", this).call(this, m, index);
        }
      }, {
        key: "Model",
        get: function get$$1() {
          if (!this._Model) return Model;
          return this._Model;
        },
        set: function set(model) {
          this._Model = model;
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
              if (trigger) utils.triggerMethodOn(this, 'before:set:model');

              if (this._model) {
                this._undelegateModelEvents(this._model);
              }

              this._model = model;
              if (model) this._delegateModelEvents(model);
              if (trigger) utils.triggerMethodOn(this, 'set:model');
              return this;
            }
          }, {
            key: "_undelegateModelEvents",
            value: function _undelegateModelEvents(model) {
              var _this2 = this;

              if (!this.modelEvents || !model || !events.isEventEmitter(model)) {
                return;
              }

              var _loop = function _loop(key) {
                _this2.modelEvents[key].forEach(function (m) {
                  if (utils.isString(m)) {
                    if (utils.isFunction(_this2[m])) {
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

              if (!this.modelEvents || !model || !events.isEventEmitter(model)) {
                return;
              }

              var _loop2 = function _loop2(key) {
                _this3.modelEvents[key].forEach(function (m) {
                  if (utils.isString(m)) {
                    if (utils.isFunction(_this3[m])) {
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
      if (!desc) throw new Error('no description');

      if (typeof desc.value !== 'function') {
        throw new TypeError('must be a function');
      }

      var key = event + (property ? ':' + property : '');

      if (target[targetKey] && utils.has(target[targetKey], key)) {
        var old = target[targetKey][key];
        if (!Array.isArray(old)) old = [old];
        old.push(prop);
        target[targetKey][key] = old;
      } else {
        target[targetKey] = utils.extend(target[targetKey] || {}, _defineProperty({}, key, [prop]));
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
      } else if (descriptor.set) {
        descriptor.set = setter(target, prop);
        descriptor.get = getter(target, prop);
        if (descriptor.value) target.set(prop, descriptor.value);
        delete descriptor.value;
      }
    }
    function idAttribute(prop) {
      return function (target) {
        target.idAttribute = prop;
      };
    }
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
    })(model || (model = {}));

    var decorators = /*#__PURE__*/Object.freeze({
        property: property,
        idAttribute: idAttribute,
        get model () { return model; }
    });

    exports.decorators = decorators;
    exports.isDestroyable = isDestroyable;
    exports.isModel = isModel;
    exports.Model = Model;
    exports.ArrayCollection = ArrayCollection;
    exports.ModelCollection = ModelCollection;
    exports.withModel = withModel;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
