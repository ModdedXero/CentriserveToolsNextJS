import styles from "../styles/form.module.css";

export function Form({ children, width, ...props }) {
    return (
        <form className={styles.mx_form} style={{ width: width || "300px" }} {...props}>
            {children}
        </form>
    )
}

export function FormGroup({ children, final, horitontal=false }) {
    return (
        <div 
            className={horitontal ? styles.mx_form_group_horizontal : styles.mx_form_group} 
            style={{ marginTop: final ? "40px" : "0", textAlign: final ? "center" : "unset" }}>
            {children}
        </div>
    )
}