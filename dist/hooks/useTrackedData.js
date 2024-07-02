"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commonUtils_1 = require("../utils/commonUtils");
const getSourceFromQuery_1 = require("../utils/getSourceFromQuery");
const commonUtils_2 = require("../utils/commonUtils");
const react_1 = require("react");
const useProxyData_1 = __importDefault(require("./useProxyData"));
const useTrackedData = function (data, query) {
    const id = (0, react_1.useId)();
    let source = (0, react_1.useMemo)(() => (0, getSourceFromQuery_1.getSourceFromQuery)(query), [query]);
    const stackTrace = (0, react_1.useMemo)(() => (0, commonUtils_1.getCallingTrace)(), []);
    const uniqueIdentifier = (0, react_1.useMemo)(() => {
        return process.env.NEXT_PUBLIC_MODE === "development"
            ? (0, commonUtils_2.getHash)(stackTrace)
            : id;
    }, [stackTrace, id]);
    let updatedSource = source + "_" + uniqueIdentifier;
    const proxyData = (0, useProxyData_1.default)({
        data,
        updatedSource,
        stackTrace,
    });
    return proxyData;
};
exports.default = useTrackedData;
