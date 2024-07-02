"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useKeys = void 0;
const state_1 = require("../lib/state");
const result = { keys: state_1.keys, keysSize: state_1.keysSize };
const useKeys = () => {
    return result;
};
exports.useKeys = useKeys;
