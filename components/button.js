import styles from "../styles/button.module.css";

export default function Button({ children, ...props }) {
    return (
        <button className={styles.mx_button} {...props}>{children}</button>
    )
}

export function GlassButton({ children, thick=false, selected=false, ...props }) {
    return (
        <button className={selected ? styles.mx_glass_button_selected : styles.mx_glass_button} style={{ padding: thick ? "20px" : null}} {...props}>
            {children}
        </button>
    )
}

export function SimpleButton({ children, ...props }) {
    return (
        <button className={styles.mx_simple_button} {...props}>
            {children}
        </button>
    )
}