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
const react_dom_1 = __importDefault(require("react-dom"));
const md_1 = require("react-icons/md");
const Modal = ({ isOpen, onClose, contentLabel, children, }) => {
    const modalRef = (0, react_1.useRef)(null);
    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    };
    (0, react_1.useEffect)(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);
    if (!isOpen)
        return null;
    return react_dom_1.default.createPortal(react_1.default.createElement("div", { style: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999999,
            fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
        } },
        react_1.default.createElement("div", { ref: modalRef, style: {
                position: "relative",
                backgroundColor: "white",
                padding: "20px",
                minWidth: "300px",
                maxWidth: "600px",
                borderRadius: "12px",
                outline: "none",
                boxShadow: "0 3px 15px rgba(0,0,0,0.3)",
            } },
            react_1.default.createElement("div", { style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: "5px 8px 5px 8px",
                } },
                react_1.default.createElement("h2", { style: { margin: 0, color: "black", fontSize: "1.5em" } }, contentLabel),
                react_1.default.createElement("button", { onClick: onClose, style: {
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "0",
                        marginLeft: "10px",
                    } },
                    react_1.default.createElement(md_1.MdOutlineClose, { style: { color: "black", fontSize: "24px" } }))),
            react_1.default.createElement("div", { style: { padding: "10px 0", backgroundColor: "white" } }, children))), document.body);
};
exports.default = Modal;
