import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({ isOpen, onClose, children }) {

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.body.classList.add("modal-open");
        } else {
            document.body.style.overflow = "auto";
            document.body.classList.remove("modal-open");
        }

        return () => {
            document.body.style.overflow = "auto";
            document.body.classList.remove("modal-open");
        };
    }, [isOpen]);

    if (!isOpen) return null;


    return createPortal(

        <div className="modal-overlay">
            <div className="modal-content">
                {children}
            </div>
        </div>, document.body
    );
}
