import React from "react";
import ReactDOM from "react-dom";
import { MdOutlineClose } from "react-icons/md";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentLabel: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  contentLabel,
  children,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      style={{
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
      }}
    >
      <div
        style={{
          position: "relative",
          backgroundColor: "white",
          padding: "10px",
          minWidth: "300px",
          maxWidth: "600px",
          borderRadius: "8px",
          outline: "none",
          boxShadow: "0 3px 5px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #ccc",
            paddingBottom: "10px",
            marginBottom: "10px",
          }}
        >
          <h2 style={{ margin: 0, color: "black" }}>{contentLabel}</h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <MdOutlineClose style={{ color: "black",fontSize:"20px" }} />
          </button>
        </div>
        <div style={{ padding: "10px", backgroundColor: "white" }}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
