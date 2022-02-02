import styles from "../styles/alert.module.css"

export function Success() {
    return (
        <div className={styles.mx_alert_success}>
            <button class="close" data-dismiss="alert">
                <span aria-hidden="true">
                    <a>
                        <i class="fa fa-times greencross" />
                    </a>
                </span>
                <span class="sr-only">Close</span>
            </button>
            <i class="start-icon far fa-check-circle faa-tada animated"></i>
            <strong class="font__weight-semibold">Well done!</strong> You successfullyread this important.
        </div>
    )
}