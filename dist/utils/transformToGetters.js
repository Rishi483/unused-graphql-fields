"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformToGetters = transformToGetters;
const prefixForKey_1 = require("./prefixForKey");
const onKeyUsed = (keyName, keys) => {
    const updatedKeys = new Map(keys());
    const item = updatedKeys.get(keyName);
    if (!item)
        return updatedKeys;
    updatedKeys.delete(keyName);
    item.used = true;
    updatedKeys.set(keyName, item);
    return updatedKeys;
};
function storeSizeInKeysSize(obj, prefix, keysSize) {
    let cumulativeSize = 0;
    Object.keys(obj).forEach((key, index, array) => {
        const value = obj[key];
        const prefixedKey = (0, prefixForKey_1.prefixForKey)(prefix, key);
        let size = jsonSize(key);
        if (typeof value === "object" && value !== null) {
            if (Array.isArray(value)) {
                let arrayItemsSize = 0;
                value.forEach((item, itemIndex) => {
                    if (typeof item === "object" && item !== null) {
                        arrayItemsSize += storeSizeInKeysSize(item, prefixedKey, keysSize);
                    }
                    else {
                        arrayItemsSize += jsonSize(item);
                    }
                });
                size += arrayItemsSize;
            }
            else {
                size += storeSizeInKeysSize(value, prefixedKey, keysSize);
            }
        }
        else {
            size += jsonSize(value);
        }
        if (keysSize().has(prefixedKey)) {
            const existingSize = keysSize().get(prefixedKey).size;
            keysSize().set(prefixedKey, {
                key: prefixedKey,
                size: existingSize + size,
            });
        }
        else {
            keysSize().set(prefixedKey, { key: prefixedKey, size });
        }
        cumulativeSize += size;
    });
    if (!prefix.includes(".")) {
        if (keysSize().has(prefix)) {
            const existingSize = keysSize().get(prefix).size;
            keysSize().set(prefix, {
                key: prefix,
                size: existingSize + cumulativeSize,
            });
        }
        else {
            keysSize().set(prefix, { key: prefix, size: cumulativeSize });
        }
    }
    return cumulativeSize;
}
function transformToGetters({ jsonData, keys, source, keysSize, prefix, }) {
    if (prefix === undefined) {
        prefix = (0, prefixForKey_1.prefixForKey)(source);
        storeSizeInKeysSize(jsonData, source, keysSize);
    }
    const result = {};
    const processValue = (key, value, currentPrefix) => {
        const prefixedKey = `${currentPrefix}${key}`;
        if (Array.isArray(value)) {
            return value.map((item) => typeof item === "object" && item !== null
                ? transformToGetters({
                    jsonData: item,
                    keys,
                    source,
                    keysSize,
                    prefix: (0, prefixForKey_1.prefixForKey)(prefixedKey),
                })
                : item);
        }
        else if (typeof value === "object" && value !== null) {
            return transformToGetters({
                jsonData: value,
                keys,
                source,
                keysSize,
                prefix: (0, prefixForKey_1.prefixForKey)(prefixedKey),
            });
        }
        return value;
    };
    Object.keys(jsonData).forEach((key) => {
        const value = jsonData[key];
        const updatedValue = processValue(key, value, prefix);
        Object.defineProperty(result, key, {
            get: () => {
                keys(onKeyUsed(`${prefix}${key}`, keys));
                return updatedValue;
            },
            configurable: true,
            enumerable: true,
        });
    });
    return result;
}
function jsonSize(jsonData) {
    return Buffer.byteLength(JSON.stringify(jsonData), "utf8");
}
