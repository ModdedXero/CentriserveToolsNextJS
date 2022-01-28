import styles from "../styles/button.module.css";

export default function Button({ children, ...props }) {
    return (
        <button className={styles.mx_button} {...props}>{children}</button>
    )
}

export function GlassButton({ children, thick=false, ...props }) {
    return (
        <button className={styles.mx_glass_button} style={{ padding: thick ? "20px" : ""}} {...props}>{children}</button>
    )
}