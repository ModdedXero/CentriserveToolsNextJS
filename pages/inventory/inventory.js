import { useRef, useState } from "react";
import axios from "axios";

import { SecureComponent } from "../../components/built/context";
import SiteNavbar from "../../components/built/site_navbar";
import InventoryNavbar from "../../components/built/inventory_navbar";
import styles from "../../styles/inventory.module.css";
import Button from "../../components/button";
import { GlassButton } from "../../components/button";
import { Navbar, NavGroup } from "../../components/navbar";
import { Form, FormGroup } from "../../components/form";
import { Input, TextArea } from "../../components/input";
import Modal from "../../components/modal";
import Select from "../../components/select";

export default function InventoryPage({ locations }) {
    // Locations and Categories
    const [selectedLocation, setSelectedLocation] = useState();
    const [selectedCategory, setSelectedCategory] = useState();
    const [allCategories, setAllCategories] = useState([]);

    // Add Item
    const [addItemModal, setAddItemModal] = useState(false);
    const [itemCategory, setItemCategory] = useState();

    const itemNameRef = useRef();
    const itemPriceRef = useRef();
    const itemValueRef = useRef();
    const itemAmountRef = useRef();
    const itemMinLevelRef = useRef();
    const itemSerialRef = useRef();
    const itemNotesRef = useRef();
    const itemFieldsRef = useRef([]);

    async function SelectLocation(loc) {
        const result = await axios.post("/api/inventory/client/location", { location: loc });
        if (result.status === 200) {
            setSelectedLocation(result.data);
            const cats = [];
            for (const cat of result.data.categories) {
                cats.push(cat.name)
            }
            setAllCategories(cats);
        }
    }

    async function SubmitAddItem(e) {
        e.preventDefault();


    }

    return (
        <SecureComponent>
            <SiteNavbar />
            <div className={styles.mx_inventory_wrapper}>
                <InventoryNavbar />
                <div className={styles.mx_inventory_page}>
                    <Navbar>
                        <NavGroup>
                            <Select
                                options={locations}
                                onChange={i => SelectLocation(i.value)}
                            />
                            <Select
                                search
                                options={allCategories}
                            />
                        </NavGroup>
                        <NavGroup>
                            <Button onClick={_ => selectedLocation ? setAddItemModal(true) : null}>
                                Add Item
                            </Button>
                            <Modal open={addItemModal} onClose={setAddItemModal}>
                                <Form width="600px" onSubmit={SubmitAddItem}>
                                    <FormGroup>
                                        <FormGroup horitontal>
                                            <Select
                                                strict
                                                options={allCategories}
                                                onChange={i => setItemCategory(selectedLocation.categories.filter(el => el.name === i.value)[0])}
                                            />
                                            <FormGroup horitontal>
                                                <Input
                                                    simple
                                                    placeholder="Price"
                                                    type="number"
                                                    min={0}
                                                    step="0.01"
                                                    defaultValue={0.00}
                                                />
                                                <Input
                                                    simple
                                                    placeholder="Value"
                                                    type="number"
                                                    min={0}
                                                    step="0.01"
                                                    defaultValue={0.00}
                                                />
                                            </FormGroup>
                                        </FormGroup>
                                        <FormGroup horitontal>
                                            {(itemCategory &&
                                            !itemCategory.itemNames.length) &&
                                            <Input
                                                simple
                                                placeholder="Name"
                                            />}
                                            {(itemCategory &&
                                            itemCategory.itemNames.length) &&
                                            <Select
                                                options={itemCategory.itemNames}
                                                placeholder="Name"
                                            />}
                                            <FormGroup horitontal>
                                                <Input
                                                    simple
                                                    placeholder="Amount"
                                                    type="number"
                                                    min={0}
                                                    step="1"
                                                    defaultValue={0}
                                                />
                                                <Input
                                                    simple
                                                    placeholder="Min Amount"
                                                    type="number"
                                                    min={0}
                                                    step="1"
                                                    defaultValue={0}
                                                />
                                            </FormGroup>
                                        </FormGroup>
                                        <Input
                                            simple
                                            placeholder="Serial Number"
                                        />
                                        {
                                            itemCategory &&
                                            itemCategory.customFields.map((field, index) => {
                                                return (
                                                    <Input
                                                        simple
                                                        key={index + itemCategory.name}
                                                        placeholder={field.name}
                                                        type={field.type === "Number" ? "number" : "text"}
                                                        step="0.01"
                                                        min={0}
                                                    />
                                                )
                                            })
                                        }
                                        <TextArea
                                            label="Notes"
                                        />
                                    </FormGroup>
                                    <FormGroup final>
                                        <Button>
                                            Submit
                                        </Button>
                                    </FormGroup>
                                </Form>
                            </Modal>
                        </NavGroup>
                    </Navbar>
                    <div className={styles.mx_inventory_page_body}>
                        <div className={styles.mx_inventory_page_body_cats}>
                            {
                                selectedLocation &&
                                selectedLocation.categories.map((cat, index) => {
                                    return (
                                        <GlassButton 
                                            key={index}
                                            onClick={_ => setSelectedCategory(cat)}
                                            selected={selectedCategory ? selectedCategory.name === cat.name : false}
                                        >
                                            {cat.name}
                                        </GlassButton>
                                    )
                                })
                            }
                        </div>
                        <div className={styles.mx_inventory_page_body_container}>
                            {
                                selectedCategory &&
                                selectedCategory.items.map((item, index) => {
                                    return (
                                        <div>
                                            {item.name}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </SecureComponent>
    )
}

import { parseLocations } from "../api/inventory/locations";

export async function getStaticProps({ params }) {
    const locations = await parseLocations();

    return {
        props: { locations: locations }
    }
}