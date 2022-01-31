import { useRef, useState } from "react";
import axios from "axios";

import { Checkbox, Input } from "../../components/input";
import { SecureComponent } from "../../components/built/context";
import SiteNavbar from "../../components/built/site_navbar";
import InventoryNavbar from "../../components/built/inventory_navbar";
import Select from "../../components/select";
import Modal from "../../components/modal";
import { Form, FormGroup } from "../../components/form";
import { GlassButton } from "../../components/button";
import styles from "../../styles/inventory.module.css";

export default function InventoryPage({ locations = [], categories = [] }) {
    const [allLocations, setAllLocations] = useState(locations);
    const [allCategories, setAllCategories] = useState(categories);
    const [currentCat, setCurrentCat] = useState();

    // Location Modals
    const [createLocModal, setCreateLocModal] = useState();
    const [updateLocModal, setUpdateLocModal] = useState();
    const [deleteLocModal, setDeleteLocModal] = useState();

    // Category Modals
    const [createCatModal, setCreateCatModal] = useState();
    const [deleteCatModal, setDeleteCatModal] = useState();

    // Location Refs
    const selectedLocRef = useRef();
    const createLocRef = useRef();
    const updateLocRef = useRef();

    // Category Refs 
    const createCatRef = useRef();
    const catNameRef = useRef();
    const catUniqueRef = useRef();
    const catFieldsRef = useRef();

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

    async function CreateCategory(e) {
        e.preventDefault();

        const result = await axios.post("/api/inventory/categories/create", { name: createCatRef.current.value });
        if (result.status === 200) {
            const cats = await axios.get("/api/inventory/categories");
            setAllCategories(cats.data);
        }
        createCatRef.current.value = "";
        setCreateCatModal(false);
    }

    async function DeleteCategory(e) {
        e.preventDefault();

        const result = await axios.delete(`/api/inventory/categories/${currentCat.name}`);
        if (result.status === 200) {
            const cats = await axios.get("/api/inventory/categories");
            setAllCategories(cats.data);
        }
        setCurrentCat(undefined);
        setDeleteCatModal(false);
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
                            <div className={styles.mx_inventory_body_admin_cat_list} key={allCategories.length}>
                            {
                                allCategories.map((cat, index) => {
                                    return (
                                        <GlassButton selected={currentCat ? currentCat.name === cat.name : false} onClick={_ => setCurrentCat(cat)} key={index}>
                                            {cat.name}
                                        </GlassButton>
                                    )
                                })
                            }
                            </div>
                            <div className={styles.mx_inventory_body_admin_cat_btn}>
                                <GlassButton onClick={_ => setCreateCatModal(true)}>Add</GlassButton>
                                <GlassButton onClick={_ => setDeleteCatModal(true)}>Remove</GlassButton>
                                <Modal open={createCatModal} onClose={setCreateCatModal}>
                                    <Form onSubmit={CreateCategory}>
                                        <FormGroup>
                                            <Input 
                                                placeholder="Category Name"
                                                ref={createCatRef}
                                            />
                                        </FormGroup>
                                        <FormGroup final>
                                            <GlassButton type="submit">Submit</GlassButton>
                                        </FormGroup>
                                    </Form>
                                </Modal>
                                <Modal open={deleteCatModal} onClose={setDeleteCatModal}>
                                    <Form onSubmit={DeleteCategory}>
                                        <FormGroup>
                                            <h1>Are you sure?</h1>
                                            <h1>{currentCat ? currentCat.name : null}</h1>
                                        </FormGroup>
                                        <FormGroup final>
                                            <GlassButton type="submit">DELETE</GlassButton>
                                        </FormGroup>
                                    </Form>
                                </Modal>
                            </div>
                        </div>
                        <div className={styles.mx_inventory_body_admin_cat_body}>
                            <div className={styles.mx_inventory_body_admin_cat_body_head}>
                                <p>Category Settings</p>
                                <GlassButton>Commit Changes</GlassButton>
                            </div>
                        {currentCat && 
                            <div className={styles.mx_inventory_body_admin_cat_body_body}>
                                <Input
                                    key={currentCat.name}
                                    placeholder="Category Name" 
                                    defaultValue={currentCat.name || null}
                                />
                                <Checkbox
                                    key={currentCat.unique + currentCat.name}
                                    placeholder="Category Items Unique?" 
                                    defaultChecked={currentCat.unique || false}
                                />
                                <h2>Custom Fields</h2>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </SecureComponent>
    )
}

import { parseLocations } from "../api/inventory/locations";
import { parseCategories } from "../api/inventory/categories";

export async function getStaticProps({ params }) {
    const locations = await parseLocations();
    const categories = await parseCategories();

    return {
        props: { locations: locations, categories: categories }
    }
}