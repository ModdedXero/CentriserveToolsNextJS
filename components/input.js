import { forwardRef, useEffect, useRef } from "react"

export const Input = forwardRef((props, ref) => {
    return (
        <div className="mx-input-group">
            <input className="mx-input" placeholder={props.placeholder} ref={ref} {...props} />
            <label onClick={_ => ref.current.focus()}>{props.placeholder}</label>
        </div>
    )
})