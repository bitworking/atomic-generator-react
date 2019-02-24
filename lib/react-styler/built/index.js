"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var func = function (tag, className) { return function (props) {
    var _a = props.className, propsClassName = _a === void 0 ? null : _a;
    var classes = propsClassName ? className + " " + propsClassName : className;
    return React.createElement(tag, __assign({}, props, { className: classes }));
}; };
var styled = function (tag) { return function (className) { return function (randomHash) { return func(tag, className); }; }; };
exports.default = styled;
