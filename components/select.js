import { useEffect, useState } from "react";

import styles from "../styles/select.module.css"

export default function Select({ options=[], onChange, defaultValue }) {
    const [query, setQuery] = useState("");
    const [current, setCurrent] = useState(defaultValue || "Select");

    const [filteredOptions, setFilteredOptions] = useState([]);

    useEffect(() => {
        const opt = [];

        for (const item of options) {
            if (!item.label) {
                opt.push({ value: item, label: item });
            } else opt.push(item);
        }

        setFilteredOptions(opt);
    }, []);

    function OnQueryChange(e) {
        setQuery(e.target.value);
    }

    function SelectItem(item) {
        setQuery("");
        setCurrent(item);
        onChange(item.value);
    }

    return (
        <div className={styles.mx_select}>
            <input placeholder="Select" onChange={OnQueryChange} type="search" />
            <div className={styles.mx_select_container}>
                {
                    filteredOptions.sort((a, b) => a.label.localeCompare(b.label)).filter(item => {
                        if (!query || item.label.toLowerCase().includes(query.toLowerCase())) {
                            return item;
                        } else {
                            return null;
                        }
                    }).map((item, index) => {
                        return (
                            <div className={styles.mx_select_item} onClick={_ => SelectItem(item)} key={index}>
                                <div className={styles.mx_select_icon}>
                                    {item.icon && item.icon}
                                </div>
                                <p>
                                    {item.label.toUpperCase()}
                                </p>
                                <div className={styles.mx_select_body}>
                                    {item.description && item.description.toLowerCase()}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}