"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getAllUniqueKeys_1 = require("../utils/getAllUniqueKeys");
const transformToGetters_1 = require("../utils/transformToGetters");
const react_1 = require("react");
const state_1 = require("../lib/state");
const useProxyData = function ({ data, updatedSource, stackTrace, }) {
    const proxyData = (0, react_1.useMemo)(() => {
        if (!data)
            return undefined;
        const updatedKeys = new Map((0, state_1.keys)());
        updatedKeys.forEach((item, key) => {
            if (item.source === updatedSource) {
                updatedKeys.delete(key);
            }
        });
        const updatedKeysSize = new Map((0, state_1.keysSize)());
        updatedKeysSize.forEach((item, key) => {
            if (key.startsWith(updatedSource)) {
                updatedKeysSize.delete(key);
            }
        });
        (0, getAllUniqueKeys_1.getAllUniqueKeys)(data, updatedSource).forEach((item) => {
            updatedKeys.set(item.key, item);
        });
        updatedKeys.forEach((item, key) => {
            if (item.source === updatedSource) {
                updatedKeys.set(key, {
                    ...item,
                    stackTrace,
                });
            }
        });
        (0, state_1.keys)(updatedKeys);
        (0, state_1.keysSize)(updatedKeysSize);
        return (0, transformToGetters_1.transformToGetters)({
            jsonData: data,
            keys: state_1.keys,
            source: updatedSource,
            keysSize: state_1.keysSize,
        });
    }, [data, updatedSource]);
    return proxyData;
};
exports.default = useProxyData;
