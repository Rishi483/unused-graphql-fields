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
const state_1 = require("../lib/state");
const prefixForKey_1 = require("../utils/prefixForKey");
const clearAllEntries_1 = require("../utils/clearAllEntries");
const TreeViewRenderer = ({ showClearAllButton, }) => {
    const [keys, setKeys] = (0, react_1.useState)((0, state_1.keys)());
    const [keysSize, setKeysSize] = (0, react_1.useState)((0, state_1.keysSize)());
    const [paths, setPaths] = (0, react_1.useState)([]);
    const [tempSize, setTempSize] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        const interval = setInterval(() => {
            const newKeys = (0, state_1.keys)();
            const newKeysSize = (0, state_1.keysSize)();
            setKeys(newKeys);
            setKeysSize(newKeysSize);
        }, 100);
        return () => clearInterval(interval);
    }, [state_1.keys, state_1.keysSize]);
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
        const item = keys.get(targetKey);
        return item ? !item.used : false;
    };
    const getValue = (keysSize, targetKey) => {
        const item = keysSize.get(targetKey);
        return item ? item.size : 0;
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
        keys.forEach((value, key) => {
            if (key.startsWith(id)) {
                keys.delete(key);
            }
        });
        (0, state_1.keys)(keys);
        keysSize.forEach((value, key) => {
            if (key.startsWith(id)) {
                keysSize.delete(key);
            }
        });
        (0, state_1.keysSize)(keysSize);
        const updatedPaths = paths.filter((path) => !path.startsWith(id));
        setPaths(updatedPaths);
    };
    const [hoverState, setHoverState] = (0, react_1.useState)(false);
    return (react_1.default.createElement("div", { style: { width: "100%", maxHeight: "600px", padding: "5px" } },
        showClearAllButton && (react_1.default.createElement("button", { onClick: (e) => {
                e.stopPropagation();
                (0, clearAllEntries_1.clearAllEntries)();
            }, style: {
                color: hoverState ? "red" : "black",
                border: `1px solid ${hoverState ? "red" : "gray"}`,
                padding: "7px 13px",
                borderRadius: "4px",
                fontSize: "14px",
                cursor: "pointer",
                margin: "6px 0",
                backgroundColor: "#fff",
                transition: "all 0.3s ease",
                fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
            }, onMouseEnter: () => setHoverState(true), onMouseLeave: () => setHoverState(false) }, "Clear All")),
        Object.keys(nestedObject).map((item) => (react_1.default.createElement(TreeView_1.default, { key: item, onDelete: handleDelete, tempSize: tempSize, title: item.split("_")[0], path: item, data: nestedObject[item] })))));
};
exports.default = TreeViewRenderer;
