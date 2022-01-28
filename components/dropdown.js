import { GlassButton as Button } from "./button";
import { Input } from "./input";
import styles from "../styles/dropdown.module.css";

export function Dropdown({ children, label }) {
    return (
        <div className={styles.mx_dropdown}>
            <Input disabled placeholder={label}/>
            <div className={styles.mx_dropdown_container}>
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