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

export default function InventoryPage({ locations = [] }) {
    const [currentCat, setCurrentCat] = useState();
    const [allLocations, setAllLocations] = useState(locations);

    const [createLocModal, setCreateLocModal] = useState();
    const [updateLocModal, setUpdateLocModal] = useState();
    const [deleteLocModal, setDeleteLocModal] = useState();

    const selectedLocRef = useRef();
    const createLocRef = useRef();
    const updateLocRef = useRef();

    async function CreateLocation(e) {
        e.preventDefault();

        const result = await axios.post("/api/inventory/locations/create", { name: createLocRef.current.value });
        if (result.status === 200) locations.push(createLocRef.current.value);
        createLocRef.current.value = "";
        setCreateLocModal(false);
    }

    async function UpdateLocation(e) {
        e.preventDefault();

        const result = await axios.post("/api/inventory/locations/update", 
        { oldLoc: selectedLocRef.current, newLoc: updateLocRef.current.value });
        if (result.status === 200) {
            const locCopy = [...allLocations];
            locCopy[locCopy.findIndex(i => i === selectedLocRef.current)] = updateLocRef.current.value;
            setAllLocations(locCopy);
        }
        updateLocRef.current.value = "";
        setUpdateLocModal(false);
    }

    async function DeleteLocation(e) {
        e.preventDefault();

        const result = await axios.delete(`/api/inventory/locations/${selectedLocRef.current}`);
        if (result.status === 200) {
            const locCopy = [...allLocations];
            locCopy.splice(locCopy.findIndex(i => i === selectedLocRef.current), 1);
            setAllLocations(locCopy);
        }
        setDeleteLocModal(false);
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
                                key={allLocations.length + selectedLocRef.current}
                                options={allLocations}
                                onChange={i => selectedLocRef.current = i.value}
                            />
                        </div>
                        <div className={styles.mx_inventory_input}>
                            <GlassButton onClick={_ => setCreateLocModal(true)}>
                                Create
                            </GlassButton>
                            <GlassButton onClick={_ => { selectedLocRef.current ? setUpdateLocModal(true) : null}}>
                                Update
                            </GlassButton>
                            <GlassButton onClick={_ => { selectedLocRef.current ? setDeleteLocModal(true) : null}}>
                                Delete
                            </GlassButton>
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
                            <Modal open={updateLocModal} onClose={setUpdateLocModal}>
                                <Form onSubmit={UpdateLocation}>
                                    <FormGroup>
                                        <Input
                                            placeholder="Update Name"
                                            ref={updateLocRef}
                                            defaultValue={selectedLocRef.current} 
                                        />
                                    </FormGroup>
                                    <FormGroup final>
                                        <GlassButton type="submit">Update</GlassButton>
                                    </FormGroup>
                                </Form>
                            </Modal>
                            <Modal open={deleteLocModal} onClose={setDeleteLocModal}>
                                <Form onSubmit={DeleteLocation}>
                                    <FormGroup>
                                        <h1>Are you sure?</h1>
                                        <h1>{selectedLocRef.current}</h1>
                                    </FormGroup>
                                    <FormGroup final>
                                        <GlassButton type="submit">DELETE</GlassButton>
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