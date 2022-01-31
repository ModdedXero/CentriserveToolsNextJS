import { forwardRef, useEffect, useRef } from "react"
import styles from "../styles/input.module.css"

export const Input = forwardRef((props, ref) => {
    return (
        <div className="mx-input-group">
            <input className="mx-input" placeholder={props.placeholder} ref={ref} {...props} />
            <label onClick={_ => !props.disabled ? ref.current.focus() : null}>{props.placeholder}</label>
        </div>
    )
})

export const Checkbox = forwardRef((props, ref) => {
    return (
        <div style={{ display: "flex", gap: "10px"}} {...props}>
            <label className={styles.mx_checkbox}>
                <input ref={ref} type="checkbox"/>
                <svg viewBox="0 0 21 21">
                    <polyline points="5 10.75 8.5 14.25 16 6"></polyline>
                </svg>
            </label>
            <label>{props.placeholder}</label>
        </div>
    )
})