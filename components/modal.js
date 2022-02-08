import ReactDOM from "react-dom";

import styles from "../styles/modal.module.css";
import Button from "./button";

export default function Modal({ open, zIndex=1000, onClose, children }) {
    if (!open) return null;

    return  ReactDOM.createPortal(
        <div className={styles.mx_modal} style={{ zIndex }} onContextMenu={e => e.stopPropagation()}>
            <div className={styles.mx_modal_content}>
                <Button onClick={_ => onClose(false)}>X</Button>
                {children}
            </div>
        </div>,
        document.getElementById("modalPortal")
    )
}