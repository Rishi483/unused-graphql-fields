import React from "react";
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    contentLabel: string;
    children: React.ReactNode;
}
declare const Modal: React.FC<ModalProps>;
export default Modal;
//# sourceMappingURL=Modal.d.ts.map