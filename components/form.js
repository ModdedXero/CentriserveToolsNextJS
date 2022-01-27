import styles from "../styles/form.module.css";

export function Form({ children, ...props }) {
    return (
        <form className={styles.mx_form} {...props}>
            {children}
        </form>
    )
}

export function FormGroup({ children, final }) {
    return (
        <div className={styles.mx_form_group} style={{ marginTop: final ? "40px" : "0", textAlign: final ? "center" : "unset" }}>
            {children}
        </div>
    )
}