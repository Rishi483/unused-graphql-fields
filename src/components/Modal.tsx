import React, { useEffect, useRef } from "react";
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
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

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
        fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
      }}
    >
      <div
        ref={modalRef}
        style={{
          position: "relative",
          backgroundColor: "white",
          padding: "20px",
          minWidth: "300px",
          maxWidth: "600px",
          borderRadius: "12px",
          outline: "none",
          boxShadow: "0 3px 15px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin:"5px 8px 5px 8px"
          }}
        >
          <h2 style={{ margin: 0, color: "black", fontSize: "1.5em" }}>{contentLabel}</h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0",
              marginLeft: "10px",
            }}
          >
            <MdOutlineClose style={{ color: "black", fontSize: "24px" }} />
          </button>
        </div>
        <div style={{ padding: "10px 0", backgroundColor: "white" }}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
