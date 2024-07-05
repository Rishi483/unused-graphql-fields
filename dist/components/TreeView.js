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
const state_1 = require("../lib/state");
const fa_1 = require("react-icons/fa");
const md_1 = require("react-icons/md");
const go_1 = require("react-icons/go");
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
function getSizeOfPrefixedKey(targetKey) {
    return (0, state_1.keysSize)().get(targetKey)?.size || 0;
}
function getUnusedSum(tempSize, targetKey) {
    return tempSize?.find((item) => item.key === targetKey)?.sum || 0;
}
function isUnused(targetKey) {
    const item = (0, state_1.keys)().get(targetKey);
    return item ? !item.used : false;
}
const buildPath = (currentPath, key) => {
    return currentPath ? (0, prefixForKey_1.prefixForKey)(currentPath, key) : key;
};
const getStackTrace = (targetKey) => {
    const stackTrace = (0, state_1.keys)().get(targetKey)?.stackTrace;
    return stackTrace ? stackTrace : [];
};
const TreeView = ({ data, title, tempSize, isRoot = false, path, onDelete, rootSize = -1, }) => {
    const [expanded, setExpanded] = (0, react_1.useState)(false);
    const [modalIsOpen, setModalIsOpen] = (0, react_1.useState)(false);
    const [hoveredTooltip, setHoveredTooltip] = (0, react_1.useState)(false);
    rootSize = rootSize === -1 ? getSizeOfPrefixedKey(path) : rootSize;
    const curPathSize = getSizeOfPrefixedKey(path);
    const unusedPercentage = curPathSize === 0
        ? 0
        : ((getUnusedSum(tempSize, path) / curPathSize) * 100).toFixed(2);
    const unUsedFlag = curPathSize === 0 ? true : isUnused(path);
    const areChildsPresent = Object.keys(data).length > 0;
    const stackTrace = !path.includes(".") ? getStackTrace(path) : [];
    const handleDelete = () => {
        if (stackTrace.length > 0) {
            onDelete(path);
        }
    };
    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);
    return (react_1.default.createElement("div", { style: {
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
            fontSize: "14px",
            margin: "0.5rem 0",
            color: "black",
        } },
        !isRoot && (react_1.default.createElement("div", { onClick: () => setExpanded(!expanded), style: {
                cursor: "pointer",
                color: unUsedFlag ? "#9E9E9E" : "#424242",
                display: "flex",
                alignItems: "center",
                backgroundColor: "#E9F0FE",
                padding: "6px 8px",
                borderRadius: "5px",
                transition: "background-color 0.3s ease",
            } },
            react_1.default.createElement("span", { style: { marginRight: "4px", marginTop: "4px" } }, areChildsPresent ? (expanded ? (react_1.default.createElement(fa_1.FaChevronDown, { style: { marginTop: "3px" } })) : (react_1.default.createElement(fa_1.FaChevronRight, null))) : ("")),
            react_1.default.createElement("span", { style: { fontWeight: "bold", flex: 1 } }, title),
            react_1.default.createElement("div", { style: {
                    position: "relative",
                    display: "inline-block",
                    cursor: "pointer",
                    margin: 0,
                }, onMouseEnter: () => setHoveredTooltip(true), onMouseLeave: () => setHoveredTooltip(false) },
                react_1.default.createElement(md_1.MdInfoOutline, { fontSize: "1.2rem", style: { marginTop: "4px", color: "black" } }),
                react_1.default.createElement("span", { style: {
                        visibility: hoveredTooltip ? "visible" : "hidden",
                        width: "200px",
                        backgroundColor: "#eef0f1",
                        color: "black",
                        textAlign: "center",
                        borderRadius: "6px",
                        padding: "5px 10px",
                        position: "absolute",
                        zIndex: 1,
                        bottom: "25%",
                        right: "100%",
                        marginLeft: "-80px",
                        opacity: hoveredTooltip ? 1 : 0,
                        transition: "opacity 0.3s",
                        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
                        fontSize: "12px",
                        boxShadow: "0px 0px 6px rgba(0, 0, 0, 0.2)",
                    } },
                    unusedPercentage,
                    "% unused of ",
                    formatBytes(curPathSize))),
            stackTrace.length > 0 && (react_1.default.createElement("div", { style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginLeft: "10px",
                } },
                react_1.default.createElement(go_1.GoStack, { onClick: (e) => {
                        e.stopPropagation();
                        openModal();
                    }, fontSize: "1.1rem", style: { color: "black" } }),
                react_1.default.createElement(md_1.MdDeleteOutline, { onClick: (e) => {
                        e.stopPropagation();
                        handleDelete();
                    }, fontSize: "1.1rem" }))))),
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
                    fontFamily: "system-ui, Tahoma, Geneva, Verdana, sans-serif",
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
                    background: "#E9F0FE",
                    padding: "10px",
                    margin: "4px",
                    borderRadius: "3px",
                    position: "relative",
                }, key: index }, trace)))))));
};
exports.default = TreeView;
