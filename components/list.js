import { useEffect, useRef, useState } from "react";

import { Input } from "./input";
import { GlassButton, SimpleButton } from "./button";
import styles from "../styles/list.module.css";

export default function List({ options = [], refs, label, unique=true, sorted=true, ...props }) {
    const [internalList, setInternalList] = useState(options || []);
    const [query, setQuery] = useState("");
    const inputRef = useRef();

    useEffect(() => {
        if (refs) refs.current = options || [];
    }, [refs])

    function OnQueryChange(e) {
        setQuery(e.target.value);
    }

    function AddItem() {
        if (unique && internalList.filter(i => i === inputRef.current.value).length > 0) return;

        internalList.push(inputRef.current.value);
        inputRef.current.value = "";
        if (refs) refs.current = internalList;
        setQuery("");
    }

    function RemoveItem(index) {
        const listCopy = [...internalList];
        listCopy.splice(index, 1);
        setInternalList(listCopy);
        if (refs) refs.current = listCopy;
    }

    return (
        <div className={styles.mx_list} {...props}>
            <div className={styles.mx_list_head}>
                <Input placeholder={label} ref={inputRef} onChange={OnQueryChange}/>
                <SimpleButton onClick={AddItem}>+</SimpleButton>
            </div>
            <div className={styles.mx_list_container}>
                {
                    (!sorted ? internalList : internalList.sort((a, b) => a.localeCompare(b))).filter(item => {
                        if (!query) return item;
                        else if (item.toLowerCase().includes(query.toLocaleLowerCase())) return item;
                        return item;
                    }).map((item, index) => {
                        return (
                            <div className={styles.mx_list_item} key={index}>
                                <p>{item}</p>
                                <GlassButton onClick={_ => RemoveItem(index)}>-</GlassButton>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}