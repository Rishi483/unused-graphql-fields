"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@apollo/client");
const useTrackedData_1 = __importDefault(require("./useTrackedData"));
const useTrackedQuery = function (query, options) {
    const result = (0, client_1.useQuery)(query, options);
    const { data } = result;
    const proxyData = (0, useTrackedData_1.default)(data, query);
    return { ...result, data: proxyData };
};
exports.default = useTrackedQuery;
