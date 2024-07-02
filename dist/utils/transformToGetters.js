"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformToGetters = transformToGetters;
const prefixForKey_1 = require("./prefixForKey");
const storeKeySize = (keyName, size, keysSize) => {
    const isAlreadyPresent = keysSize().find((item) => item.key === keyName);
    const newKeysSize = keysSize().map((item) => {
        if (item.key === keyName)
            return { ...item, size: item.size + size };
        return item;
    });
    if (!isAlreadyPresent) {
        newKeysSize.push({ key: keyName, size });
    }
    return newKeysSize;
};
const onKeyUsed = (keyName, source, keys) => {
    const updatedkeys = keys().map((k) => {
        if (k.key == keyName && k.source == source)
            return { ...k, used: true };
        return k;
    });
    return updatedkeys;
};
function storeSizeInKeysSize(obj, prefix, keysSize) {
    let cumulativeSize = 0;
    Object.keys(obj).forEach((key, index, array) => {
        const value = obj[key];
        const prefixedKey = `${prefix}.${key}`;
        let size = jsonSize(key);
        if (typeof value === "object" && value !== null) {
            if (Array.isArray(value)) {
                let arrayItemsSize = 0;
                value.forEach((item, itemIndex) => {
                    if (typeof item === "object" && item !== null) {
                        arrayItemsSize += storeSizeInKeysSize(item, `${prefixedKey}`, keysSize);
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
        const percentage = size;
        keysSize(storeKeySize(prefixedKey, percentage, keysSize));
        cumulativeSize += size;
    });
    if (!prefix.includes(".")) {
        keysSize(storeKeySize(prefix, cumulativeSize, keysSize));
    }
    return cumulativeSize;
}
function transformToGetters({ jsonData, keys, source, keysSize, prefix, }) {
    if (prefix === undefined) {
        prefix = (0, prefixForKey_1.prefixForKey)(source);
        storeSizeInKeysSize(jsonData, source, keysSize);
    }
    const result = {};
    Object.keys(jsonData).forEach((key) => {
        const value = jsonData[key];
        const prefixedKey = `${prefix}${key}`;
        Object.defineProperty(result, key, {
            get: () => {
                keys(onKeyUsed(prefixedKey, source, keys));
                if (Array.isArray(value)) {
                    return value.map((item) => {
                        if (typeof item === "object" && item !== null) {
                            return transformToGetters({
                                jsonData: item,
                                keys: keys,
                                source: source,
                                keysSize: keysSize,
                                prefix: (0, prefixForKey_1.prefixForKey)(prefixedKey),
                            });
                        }
                        return item;
                    });
                }
                else if (typeof value === "object" && value !== null) {
                    return transformToGetters({
                        jsonData: value,
                        keys: keys,
                        source: source,
                        keysSize: keysSize,
                        prefix: (0, prefixForKey_1.prefixForKey)(prefixedKey),
                    });
                }
                return value;
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
