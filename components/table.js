import styles from "../styles/table.module.css";

export function Table({ children }) {
    return (
        <div className={styles.mx_table_wrapper}>
            <table>
                {children}
            </table>
        </div>
    )
}

export function TableHead({ children }) {
    return (
        <thead>
            <tr>
                {children}
            </tr>
        </thead>
    )
}

export function TableHCell({ children, width }) {
    return (
        <th style={{ width: width }}>
            {children}
        </th>
    )
}

export function TableBody({ children, height }) {
    return (
        <tbody style={{ height: height }}>
            {children}
        </tbody>
    )
}

export function TableRow({ children }) {
    return (
        <tr>
            {children}
        </tr>
    )
}

export function TableBCell({ children }) {
    return (
        <td>
            {children}
        </td>
    )
}