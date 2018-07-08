"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@viewjs/utils");
var MetaKeys;
(function (MetaKeys) {
    MetaKeys.Attributes = Symbol("attributes");
    MetaKeys.Models = Symbol("models");
})(MetaKeys = exports.MetaKeys || (exports.MetaKeys = {}));
function isDestroyable(a) {
    return a && utils_1.isFunction(a.destroy);
}
exports.isDestroyable = isDestroyable;
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
})(ModelEvents = exports.ModelEvents || (exports.ModelEvents = {}));
