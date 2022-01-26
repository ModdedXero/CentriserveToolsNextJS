import React, { useEffect, useRef, useState } from "react";

import styles from "../styles/select.module.css"

export default function Select({ options=[], search=false, onChange, defaultValue, width }) {
    const [query, setQuery] = useState("");
    const [current, setCurrent] = useState(defaultValue || "Select");

    const [filteredOptions, setFilteredOptions] = useState([]);

    const searchInputRef = useRef();

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
        if (search) {
            setCurrent("Select");
        } else {
            setQuery("");
            setCurrent(item.label);
            searchInputRef.current.value = "";
        }

        if (onChange) onChange(item);
    }

    return (
        <div className={styles.mx_select} style={{ width: width }}>
            <div className="mx-input-group">
                <input 
                    className="mx-input" 
                    ref={searchInputRef} 
                    placeholder={current} 
                    onChange={OnQueryChange} 
                    style={{ width: width }}
                />
                <label onClick={_ => searchInputRef.current.focus()}>{current}</label>
            </div>
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