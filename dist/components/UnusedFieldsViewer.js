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
const vsc_1 = require("react-icons/vsc");
const md_1 = require("react-icons/md");
const TreeViewRenderer_1 = __importDefault(require("./TreeViewRenderer"));
const UnusedFieldsViewer = () => {
    const [isExpanded, setIsExpanded] = (0, react_1.useState)(false);
    const toggleExpansion = () => setIsExpanded(!isExpanded);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { style: {
                display: isExpanded ? "flex" : "none",
                justifyContent: "center",
                position: "fixed",
                bottom: "20px",
                right: "78px",
                backgroundColor: "white",
                padding: "15px 20px",
                zIndex: 100,
                borderRadius: "5px",
                maxHeight: "600px",
                minHeight: "100px",
                overflow: "scroll",
                transition: "all 0.3s ease",
            } },
            react_1.default.createElement(TreeViewRenderer_1.default, null)),
        react_1.default.createElement("div", { style: {
                position: "fixed",
                cursor: "pointer",
                bottom: "20px",
                right: "20px",
                width: "auto",
                minWidth: "50px",
                maxHeight: "80vh",
                padding: "15px 15px 7px 15px",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                overflow: "scroll",
                transition: "all 0.3s ease",
                zIndex: 100,
                color: "black",
            }, onClick: toggleExpansion },
            react_1.default.createElement("span", { style: {
                    fontSize: isExpanded ? 0 : "24px",
                    transition: "all 0.3s ease",
                    opacity: isExpanded ? 0 : 1,
                } },
                react_1.default.createElement(vsc_1.VscDebugAlt, null)),
            react_1.default.createElement("span", { style: {
                    fontSize: !isExpanded ? 0 : "24px",
                    transition: "all 0.3s ease",
                    opacity: isExpanded ? 1 : 0,
                } },
                react_1.default.createElement(md_1.MdOutlineClose, null)))));
};
exports.default = UnusedFieldsViewer;
