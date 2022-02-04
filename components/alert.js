import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import styles from "../styles/alert.module.css"

export function SuccessAlert({ data, clearData, lifetime=5 }) {
    const [visible, setVisible] = useState(false);
    const [firstRender, setFirstRender] = useState(true);

    useEffect(() => {
        if (!data) return;

        setFirstRender(false);
        setVisible(true);
        setTimer(lifetime);
    }, [data])

    function setTimer(delay) {
        setTimeout(() => { setVisible(false); }, delay * 1000);
    }

    if (firstRender) return null;
    return  ReactDOM.createPortal(
        <div className={visible ? styles.mx_alert : styles.mx_alert + " " + styles.mx_alert_hidden}>
            <i className="far fa-check-circle" />
            <strong>{data}</strong>
            <button className="far fa-times-circle"></button>
        </div>,
        document.getElementById("alertPortal")
    )
}