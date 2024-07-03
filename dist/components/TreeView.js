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
const useKeys_1 = require("../hooks/useKeys");
const fa_1 = require("react-icons/fa");
const fa_2 = require("react-icons/fa");
const Modal_1 = __importDefault(require("./Modal"));
const prefixForKey_1 = require("../utils/prefixForKey");
const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0)
        return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i]);
};
function getSizeOfPrefixedKey(keysSize, targetKey) {
    return keysSize().get(targetKey)?.size || 0;
}
function getUnusedSum(tempSize, targetKey) {
    return tempSize?.find((item) => item.key === targetKey)?.sum || 0;
}
function isUnused(keys, targetKey) {
    const item = keys().get(targetKey);
    return item ? !item.used : false;
}
const buildPath = (currentPath, key) => {
    return currentPath ? (0, prefixForKey_1.prefixForKey)(currentPath, key) : key;
};
const getStackTrace = (keys, targetKey) => {
    const stackTrace = keys().get(targetKey)?.stackTrace;
    return stackTrace ? stackTrace : [];
};
const TreeView = ({ data, title, tempSize, isRoot = false, path, onDelete, rootSize = -1, }) => {
    const [expanded, setExpanded] = (0, react_1.useState)(false);
    const [modalIsOpen, setModalIsOpen] = (0, react_1.useState)(false);
    const { keys, keysSize } = (0, useKeys_1.useKeys)();
    rootSize = rootSize === -1 ? getSizeOfPrefixedKey(keysSize, path) : rootSize;
    const curPathSize = getSizeOfPrefixedKey(keysSize, path);
    const unusedPercentage = curPathSize === 0
        ? 0
        : ((getUnusedSum(tempSize, path) / curPathSize) * 100).toFixed(2);
    const unUsedFlag = curPathSize === 0 ? true : isUnused(keys, path);
    const areChildsPresent = Object.keys(data).length > 0;
    const stackTrace = !path.includes(".") ? getStackTrace(keys, path) : [];
    const handleDelete = () => {
        if (stackTrace.length > 0) {
            onDelete(path);
        }
    };
    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);
    return (react_1.default.createElement("div", { style: {
            fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
            fontSize: "14px",
            color: "#333",
            marginLeft: "20px",
            lineHeight: "1.5",
            padding: "4px",
            margin: "5px 0",
            backgroundColor: isRoot ? "#F1F8FF" : "#FFFFFF",
            borderLeft: isRoot ? "5px solid #2196F3" : "3px solid #BBDEFB",
            paddingLeft: isRoot ? "8px" : "12px",
            borderRadius: "4px",
            minHeight: "25px",
        } },
        !isRoot && (react_1.default.createElement("div", { onClick: () => setExpanded(!expanded), style: {
                cursor: "pointer",
                color: unUsedFlag ? "#9E9E9E" : "#424242",
                display: "flex",
                alignItems: "center",
                backgroundColor: "#E3F2FD",
                padding: "6px 8px",
                borderRadius: "6px",
                transition: "background-color 0.3s ease",
            } },
            react_1.default.createElement("span", { style: { marginRight: "4px" } }, areChildsPresent ? (expanded ? (react_1.default.createElement(fa_2.FaChevronDown, null)) : (react_1.default.createElement(fa_1.FaChevronRight, null))) : ("")),
            react_1.default.createElement("span", { style: { fontWeight: "bold", flex: 1 } },
                title,
                react_1.default.createElement("span", { style: {
                        marginLeft: "8px",
                        fontSize: "12px",
                        color: unUsedFlag ? "#9E9E9E" : "#616161",
                    } },
                    "(",
                    unusedPercentage,
                    "% unused of ",
                    formatBytes(curPathSize),
                    ")")),
            stackTrace.length > 0 && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("button", { onClick: (e) => {
                        e.stopPropagation();
                        openModal();
                    }, style: {
                        marginLeft: "12px",
                        padding: "2px 4px",
                        fontSize: "12px",
                        color: "#FFFFFF",
                        backgroundColor: "#4CAF50",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    } }, "View StackTrace"),
                react_1.default.createElement("button", { onClick: (e) => {
                        e.stopPropagation();
                        handleDelete();
                    }, style: {
                        marginLeft: "12px",
                        padding: "2px 4px",
                        fontSize: "12px",
                        color: "#FFFFFF",
                        backgroundColor: "#f44336",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    } }, "Remove"))))),
        (areChildsPresent && expanded) || isRoot ? (react_1.default.createElement("ul", { style: {
                listStyleType: "none",
                paddingLeft: "12px",
                marginTop: "1px",
            } }, Object.keys(data).map((key) => {
            const fullPath = buildPath(path, key);
            return (react_1.default.createElement("li", { key: key, style: { marginTop: "4px" } },
                react_1.default.createElement(TreeView, { data: data[key], tempSize: tempSize, title: key, path: fullPath, rootSize: rootSize, onDelete: () => { } })));
        }))) : null,
        react_1.default.createElement(Modal_1.default, { isOpen: modalIsOpen, onClose: closeModal, contentLabel: "Stack Trace" },
            react_1.default.createElement("div", { style: {
                    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
                    fontSize: "12px",
                    lineHeight: "1.2",
                    color: "#333",
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    height: "400px",
                    overflow: "scroll",
                } }, stackTrace.map((trace, index) => (react_1.default.createElement("div", { style: {
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    background: "#e0f7fa",
                    border: "1px solid #007bff",
                    padding: "10px",
                    margin: "5px",
                    borderRadius: "5px",
                    position: "relative",
                }, key: index }, trace)))))));
};
exports.default = TreeView;
