"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSourceFromQuery = getSourceFromQuery;
function getSourceFromQuery(query) {
    return query.definitions[0].name.value;
}
