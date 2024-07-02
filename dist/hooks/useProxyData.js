"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getAllUniqueKeys_1 = require("../utils/getAllUniqueKeys");
const transformToGetters_1 = require("../utils/transformToGetters");
const react_1 = require("react");
const useKeys_1 = require("./useKeys");
const addStackTraceInKeys = (keys, stackTrace, source) => {
    return keys().map((item) => {
        if (item.key === source) {
            return {
                ...item,
                used: true,
                stackTrace,
            };
        }
        return item;
    });
};
const useProxyData = function ({ data, updatedSource, stackTrace, }) {
    const { keys, keysSize } = (0, useKeys_1.useKeys)();
    const proxyData = (0, react_1.useMemo)(() => {
        if (!data)
            return undefined;
        const newKeysObjects = Array.from((0, getAllUniqueKeys_1.getAllUniqueKeys)(data, updatedSource));
        const updatedKeys = keys().filter((item) => !(item.source === updatedSource));
        const updatedKeysSize = keysSize().filter((item) => !item.key.startsWith(updatedSource));
        keysSize(updatedKeysSize);
        keys([...updatedKeys, ...newKeysObjects]);
        keys(addStackTraceInKeys(keys, stackTrace, updatedSource));
        return (0, transformToGetters_1.transformToGetters)({
            jsonData: data,
            keys,
            source: updatedSource,
            keysSize,
        });
    }, [data, updatedSource]);
    return proxyData;
};
exports.default = useProxyData;
