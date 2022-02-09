import { useEffect, useRef, useState } from "react";
import axios from "axios";

import { Table, TableBCell, TableBody, TableHCell, TableHead, TableRow } from "../../components/table";
import Select from "../../components/select";
import Button from "../../components/button";
import { Input } from "../../components/input";
import { SecureComponent } from "../../components/built/context";

import styles from "../../styles/admin.module.css";

export default function Admin({ users }) {
    const [selectedUser, setSelectedUser] = useState();
    const [usernames, setUsernames] = useState([]);

    const inventoryRef = useRef();

    useEffect(() => {
        const ret = [];

        for (const user of users) {
            ret.push(user.email);
        }

        setUsernames(ret);
    }, [])

    function UpdateUser() {
        const newSecurity = [
            {
                name: "Inventory",
                state: inventoryRef.current.value
            }
        ];

        axios.post("/api/auth/update", { username: selectedUser.email, user: { ...selectedUser, security: newSecurity } });
    }

    function onSelectUserChange(i) {
        setSelectedUser(users.filter(e => e.email === i.value)[0]);
    }

    return (
        <SecureComponent>
            <div className={styles.mx_admin_page}>
                <Select
                    options={usernames}
                    onChange={onSelectUserChange}
                />
                <Table>
                    <TableHead top="0px">
                        <TableHCell>Page</TableHCell>
                        <TableHCell>Security Level</TableHCell>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableBCell>Inventory</TableBCell>
                            <TableBCell>
                                <Input
                                    key={selectedUser ? selectedUser.email + " Inventory" : "Inv"}
                                    simple 
                                    defaultValue={selectedUser && selectedUser.security.length > 0
                                        ? 
                                        selectedUser.security.filter(i => i.name === "Inventory")[0].state : 0}
                                    ref={inventoryRef}
                                    type="number" 
                                />
                            </TableBCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <br />
                <Button onClick={UpdateUser}>Update User</Button>
            </div>
        </SecureComponent>
    )
}

import { getUserList } from "../api/auth/users";

export async function getServerSideProps({ params }) {
    const req = await getUserList();

    return {
        props: { users: req }
    }
}