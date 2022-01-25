export default function Button({ children, ...props }) {
    return (
        <button className="mx-btn" {...props}>{children}</button>
    )
}