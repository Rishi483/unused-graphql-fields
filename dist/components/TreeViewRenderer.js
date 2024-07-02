"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const TreeView_1 = __importDefault(require("./TreeView"));
const useKeys_1 = require("../hooks/useKeys");
const prefixForKey_1 = require("../utils/prefixForKey");
const TreeViewRenderer = () => {
    const { keys: keysVar, keysSize: keysSizeVar } = (0, useKeys_1.useKeys)();
    const [keys, setKeys] = (0, react_1.useState)(keysVar());
    const [keysSize, setKeysSize] = (0, react_1.useState)(keysSizeVar());
    const [paths, setPaths] = (0, react_1.useState)([]);
    const [tempSize, setTempSize] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        const interval = setInterval(() => {
            const newKeys = keysVar();
            const newKeysSize = keysSizeVar();
            setKeys(newKeys);
            setKeysSize(newKeysSize);
        }, 2000);
        return () => clearInterval(interval);
    }, [keysVar, keysSizeVar]);
    (0, react_1.useEffect)(() => {
        const newPaths = [];
        keys.forEach((keyObject) => {
            if (!keyObject.used) {
                newPaths.push(keyObject.key);
            }
        });
        setPaths(newPaths);
    }, [keys]);
    const isUnused = (keys, targetKey) => {
        const item = keys.find((item) => item.key === targetKey);
        return item ? !item.used : false;
    };
    const getValue = (keysSize, targetKey) => {
        return keysSize.find((item) => item.key === targetKey)?.size || 0;
    };
    const buildTree = (items) => {
        const roots = {};
        items.forEach((item) => {
            const parts = item.key.split(".");
            let current = roots;
            parts.forEach((part, index) => {
                const fullPath = parts.slice(0, index + 1).join(".");
                if (!current[part]) {
                    current[part] = { children: {}, used: !isUnused(items, fullPath) };
                }
                current = current[part].children;
            });
        });
        return roots;
    };
    const calculateSums = (node, keysSize, path, tempSize = []) => {
        let total = 0;
        Object.entries(node.children).forEach(([key, child]) => {
            const childPath = (0, prefixForKey_1.prefixForKey)(path, key);
            const childSum = calculateSums(child, keysSize, childPath, tempSize);
            total += childSum;
        });
        if (node.used === false) {
            total = getValue(keysSize, path);
        }
        if (node.used !== undefined) {
            tempSize.push({ key: path, sum: total });
        }
        return total;
    };
    const transformToNestedObject = (paths) => {
        const result = {};
        paths.forEach((path) => {
            const levels = path.split(".");
            let current = result;
            levels.forEach((level) => {
                if (!current[level]) {
                    current[level] = {};
                }
                current = current[level];
            });
        });
        return result;
    };
    const clearAllEntries = () => {
        keysVar([]);
        keysSizeVar([]);
        setKeys([]);
        setKeysSize([]);
        setPaths([]);
        setTempSize([]);
    };
    const trees = buildTree(keys);
    const tempSizeList = [];
    Object.keys(trees).forEach((rootKey) => {
        calculateSums(trees[rootKey], keysSize, rootKey, tempSizeList);
    });
    (0, react_1.useEffect)(() => {
        setTempSize(tempSizeList);
    }, [keys, keysSize]);
    const nestedObject = transformToNestedObject(paths);
    const handleDelete = (id) => {
        const updatedKeys = keys.filter((keyItem) => !keyItem.key.startsWith(id));
        keysVar(updatedKeys);
        const updatedKeysSize = keysSize.filter((keySizeItem) => !keySizeItem.key.startsWith(id));
        keysSizeVar(updatedKeysSize);
        const updatedPaths = paths.filter((path) => !path.startsWith(id));
        setPaths(updatedPaths);
    };
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("button", { style: {
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                padding: "5px 10px",
                fontSize: "13px",
                cursor: "pointer",
                borderRadius: "5px",
                marginBottom: "10px",
            }, onClick: (e) => {
                e.stopPropagation();
                clearAllEntries();
            } }, "Clear"),
        Object.keys(nestedObject).map((item) => (react_1.default.createElement(TreeView_1.default, { key: item, onDelete: handleDelete, tempSize: tempSize, title: item.split("_")[0], path: item, data: nestedObject[item] })))));
};
exports.default = TreeViewRenderer;
