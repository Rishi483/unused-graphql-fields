"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAllEntries = void 0;
const state_1 = require("../lib/state");
const clearAllEntries = () => {
    (0, state_1.keys)(new Map());
    (0, state_1.keysSize)(new Map());
};
exports.clearAllEntries = clearAllEntries;
