import { forwardRef, useEffect, useRef } from "react"

export const Input = forwardRef((props, ref) => {
    return (
        <div className="mx-input-group">
            <input className="mx-input" placeholder={props.placeholder} ref={ref} {...props} />
            <label onClick={_ => !props.disabled ? ref.current.focus() : null}>{props.placeholder}</label>
        </div>
    )
})