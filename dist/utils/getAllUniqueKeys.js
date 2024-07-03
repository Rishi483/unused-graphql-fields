"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUniqueKeys = getAllUniqueKeys;
const prefixForKey_1 = require("./prefixForKey");
function getAllUniqueKeys(obj, source, prefix, keySet = new Set()) {
    if (prefix === undefined) {
        keySet.add({ key: source, source, used: true, stackTrace: [] });
        prefix = (0, prefixForKey_1.prefixForKey)(source);
    }
    for (let key in obj) {
        keySet.add({ key: `${prefix}${key}`, source, used: false, stackTrace: [] });
        if (typeof obj[key] === 'object') {
            if (Array.isArray(obj[key]) && obj[key].length > 0 && typeof obj[key][0] === 'object') {
                getAllUniqueKeys(obj[key][0], source, `${prefix}${key}.`, keySet);
            }
            else if (!Array.isArray(obj[key])) {
                getAllUniqueKeys(obj[key], source, `${prefix}${key}.`, keySet);
            }
        }
    }
    return keySet;
}
;
