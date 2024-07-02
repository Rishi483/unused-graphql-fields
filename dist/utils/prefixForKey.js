"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prefixForKey = prefixForKey;
function prefixForKey(source, postFix) {
    return source + "." + (postFix ? postFix : "");
}
