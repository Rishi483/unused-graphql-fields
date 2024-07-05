"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const md_1 = require("react-icons/md");
const Modal = ({ isOpen, onClose, contentLabel, children, }) => {
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
            zIndex: 1000,
            fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
        } },
        react_1.default.createElement("div", { style: {
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
                    borderBottom: "1px solid #eee",
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
