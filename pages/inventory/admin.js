import { useRef, useState } from "react";
import axios from "axios";

import { Input } from "../../components/input";
import { SecureComponent } from "../../components/built/context";
import SiteNavbar from "../../components/built/site_navbar";
import InventoryNavbar from "../../components/built/inventory_navbar";
import Select from "../../components/select";
import Modal from "../../components/modal";
import { Form, FormGroup } from "../../components/form";
import { GlassButton } from "../../components/button";
import styles from "../../styles/inventory.module.css";

export default function InventoryPage({ locations }) {
    const [currentCat, setCurrentCat] = useState();

    const [createLocModal, setCreateLocModal] = useState();
    const [updateLocModal, setUpdateLocModal] = useState();
    const [deleteLocModal, setDeleteLocModal] = useState();

    const createLocRef = useRef();

    async function CreateLocation() {
        axios.post("/api/inventory/create")
    }

    async function UpdateLocation() {

    }

    async function DeleteLocation() {

    }

    return (
        <SecureComponent>
            <SiteNavbar />
            <div className={styles.mx_inventory_wrapper}>
                <InventoryNavbar />
                <div className={styles.mx_inventory_page}>
                    <div className={styles.mx_inventory_header}>
                        <div className={styles.mx_inventory_input}>
                            <Select
                                options={locations}
                            />
                        </div>
                        <div className={styles.mx_inventory_input}>
                            <GlassButton onClick={_ => setCreateLocModal(true)}>Create</GlassButton>
                            <GlassButton>Update</GlassButton>
                            <GlassButton>Delete</GlassButton>
                            <Modal open={createLocModal} onClose={setCreateLocModal}>
                                <Form onSubmit={CreateLocation}>
                                    <FormGroup>
                                        <Input 
                                            placeholder="Location Name"
                                            ref={createLocRef}
                                        />
                                    </FormGroup>
                                    <FormGroup final>
                                        <GlassButton type="submit">Submit</GlassButton>
                                    </FormGroup>
                                </Form>
                            </Modal>
                        </div>
                    </div>
                    <div className={styles.mx_inventory_body_admin}>
                        <div className={styles.mx_inventory_body_admin_cat}>
                            <div className={styles.mx_inventory_input}>
                                <p>Category</p>
                            </div>
                            {/* Add the Cateogry List */}
                            <div className={styles.mx_inventory_body_admin_cat_btn}>
                                <GlassButton>Add</GlassButton>
                                <GlassButton>Remove</GlassButton>
                            </div>
                        </div>
                        <div className={styles.mx_inventory_body_admin_cat_body}>
                            <div className={styles.mx_inventory_body_admin_cat_body_head}>
                                <p>Category Settings</p>
                                <GlassButton>Commit Changes</GlassButton>
                            </div>
                            <div className={styles.mx_inventory_body_admin_cat_body_body}>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SecureComponent>
    )
}

import { parseLocations } from "../api/inventory/locations";

export async function getStaticProps({ params }) {
    const req = await parseLocations();

    return {
        props: { locations: req }
    }
}