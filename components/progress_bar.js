import styles from "../styles/progress.module.css";

export default function ProgressBar({ progress }) {
    return (
        <div className={styles.mx_progress}>
            <div className={styles.mx_progress_fill} style={{ width: `${progress}%` }}>
            </div>
            <p>{progress}%</p>
        </div>
    )
}