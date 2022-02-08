import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import styles from "../styles/alert.module.css"

export function SuccessAlert({ data, clearData, lifetime=5 }) {
    const [visible, setVisible] = useState(false);
    const [firstRender, setFirstRender] = useState(true);
    const [timer, setTimer] = useState(null);
    const [dataCopy, setDataCopy] = useState(data);

    useEffect(() => {
        if (!data) return;

        setFirstRender(false);
        setDataCopy(data);
        setVisible(true);
        if (timer) clearTimeout(timer);
        setTimer(setTimeout(() => { clearData(null); setVisible(false); }, lifetime * 1000));
    }, [data])

    if (firstRender) return null;
    return  ReactDOM.createPortal(
        <div className={visible ? styles.mx_alert : styles.mx_alert + " " + styles.mx_alert_hidden}>
            <i className="far fa-check-circle" />
            <strong>{dataCopy}</strong>
            <button className="far fa-times-circle" onClick={_ => setVisible(false)}></button>
        </div>,
        document.getElementById("alertPortal")
    )
}