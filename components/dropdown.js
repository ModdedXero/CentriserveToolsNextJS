import styles from "../styles/dropdown.module.css";
import Button from "./button";

export function Dropdown({ children, label }) {
    return (
        <div className={styles.mx_dropdown}>
            <Button>{label}</Button>
            <div>
                {children}
            </div>
        </div>
    )
}

export function DropdownItem({ children, ...props }) {
    return (
        <button className={styles.mx_dropdown_item} {...props}>
            {children}
        </button>
    )
}