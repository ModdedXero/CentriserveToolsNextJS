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
    const [addItemError, setAddItemError] = useState();

    const itemNameRef = useRef(0);
    const itemPriceRef = useRef();
    const itemValueRef = useRef();
    const itemAmountRef = useRef();
    const itemMinAmountRef = useRef();
    const itemSerialRef = useRef();
    const itemFieldsRef = useRef([]);

    // View/Edit Items
    const [selectedItem, setSelectedItem] = useState();

    const [viewItemModal, setViewItemModal] = useState(false);
    const [viewUniqueItemModal, setViewUniqueItemModal] = useState(false);

    // Checkout Item
    const [checkoutItemModal, setCheckoutItemModal] = useState(false);
    const [checkoutUniqueItemModal, setCheckoutUniqueItemModal] = useState(false);

    const [checkoutUniqueList, setCheckoutUniqueList] = useState([]);
    const [checkoutFinalList, setCheckoutFinalList] = useState([]);

    const checkoutAmountRef = useRef();

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

        const newItem = {
            name: itemNameRef.current.value || itemNameRef.current,
            price: parseFloat(itemPriceRef.current.value),
            value: parseFloat(itemValueRef.current.value),
            amount: itemAmountRef.current ? parseInt(itemAmountRef.current.value) || 1 : 1,
            minAmount: itemMinAmountRef.current ? parseInt(itemMinAmountRef.current.value) || 0 : 0,
            serial: itemSerialRef.current ? itemSerialRef.current.value || "" : "",
            customFields: []
        }

        if (itemCategory.customFields.length > 0) {
            for (let i = 0; i < itemFieldsRef.current.length / 2; i++) {
                const mIndex = i * 2;
                newItem.customFields.push({
                    name: itemFieldsRef.current[mIndex + 1],
                    value: itemFieldsRef.current[mIndex].value || ""
                });
            }
        }

        let error;

        for (const [key, value] of Object.entries(newItem)) {
            if (key === "name" ||
            key === "price" || key === "value") {
                if (!value) {
                    error = "Failed to set required values! Please fill out the item!";
                    break;
                }
            }

            if (itemCategory.unique && key === "serial") {
                if (!value) {
                    error = "Failed to set required values! Please fill out the item!";
                    break;
                }
            }
        }

        // TODO: Add error for input
        if (error) {
            setAddItemError(error);
            return;
        };

        const result = await axios.post("/api/inventory/client/item/create", { 
            item: newItem,
            location: selectedLocation.name,
            category: itemCategory.name
        });

        if (result.status === 200) {
            setSelectedCategory(undefined);
            await SelectLocation(selectedLocation.name);
        }
        
        setAddItemModal(false);
    }

    async function SubmitAddToCheckout(e) {
        e.preventDefault();
    }

    function updateCheckoutUniqueList(items) {
        const retList = [];

        for (const item of items) {
            retList.push(item.serial);
        }

        setCheckoutUniqueList(retList);
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
                                                    ref={itemPriceRef}
                                                    required
                                                />
                                                <Input
                                                    simple
                                                    placeholder="Value"
                                                    type="number"
                                                    min={0}
                                                    step="0.01"
                                                    defaultValue={0.00}
                                                    ref={itemValueRef}
                                                    required
                                                />
                                            </FormGroup>
                                        </FormGroup>
                                        <FormGroup horitontal>
                                            {(itemCategory &&
                                            itemCategory.itemNames.length === 0) &&
                                            <Input
                                                simple
                                                placeholder="Name"
                                                ref={itemNameRef}
                                                required
                                            />}
                                            {(itemCategory &&
                                            itemCategory.itemNames.length > 0) &&
                                            <Select
                                                options={itemCategory.itemNames}
                                                placeholder="Name"
                                                onChange={i => itemNameRef.current = i.value}
                                            />}
                                            <FormGroup horitontal>
                                                {(itemCategory&&
                                                !itemCategory.unique) &&
                                                <Input
                                                    simple
                                                    placeholder="Amount"
                                                    type="number"
                                                    min={1}
                                                    step="1"
                                                    defaultValue={1}
                                                    ref={itemAmountRef}
                                                    required
                                                />}
                                                {(itemCategory&&
                                                !itemCategory.unique) &&
                                                <Input
                                                    simple
                                                    placeholder="Min Amount"
                                                    type="number"
                                                    min={0}
                                                    step="1"
                                                    defaultValue={0}
                                                    ref={itemMinAmountRef}
                                                    required
                                                />}
                                            </FormGroup>
                                        </FormGroup>
                                        {(itemCategory&&
                                        itemCategory.unique) &&
                                        <Input
                                            simple
                                            placeholder="Serial Number"
                                            ref={itemSerialRef}
                                            required
                                        />}
                                        {
                                            itemCategory &&
                                            itemCategory.customFields.map((field, index) => {
                                                const mIndex = index * 2;

                                                itemFieldsRef.current[mIndex + 1] = field.name;
                                                return (
                                                    <Input
                                                        simple
                                                        key={index + itemCategory.name}
                                                        placeholder={field.name}
                                                        type={field.type === "Number" ? "number" : "text"}
                                                        step="0.01"
                                                        min={0}
                                                        ref={el => itemFieldsRef.current[mIndex] = el}
                                                        required
                                                    />
                                                )
                                            })
                                        }
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
                                        <div className={styles.mx_inventory_page_body_container_item} key={index + "item"}>
                                            <h1>{item.name}</h1>
                                            <div>
                                                <h2>{item.amount} units | ${item.value} | Total: ${item.amount * item.value}</h2>
                                            </div>
                                            {item.minAmount > 0 && <h3>Min Amount: {item.minAmount}</h3>}
                                            <div className={styles.mx_icons}>
                                                <i className="fas fa-history"/>
                                                <i 
                                                    onClick={_ => { 
                                                        selectedCategory.unique ? setViewUniqueItemModal(true) : setViewItemModal(true); 
                                                        setSelectedItem(item);
                                                    }} 
                                                    className="fas fa-boxes"
                                                />
                                                <i 
                                                    onClick={_ => {
                                                        selectedCategory.unique ? setCheckoutUniqueItemModal(true) : setCheckoutItemModal(true);
                                                        setSelectedItem(item);
                                                        updateCheckoutUniqueList(item.subItems);
                                                    }}
                                                    className="fas fa-shopping-cart"
                                                />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <Modal open={viewItemModal} onClose={setViewItemModal}>
                                {selectedItem &&
                                <Form width="600px" onSubmit={SubmitAddItem}>
                                    <FormGroup>
                                        <Input
                                                simple
                                                placeholder="Name"
                                                defaultValue={selectedItem.name}
                                                disabled
                                        />
                                        <FormGroup horitontal>
                                            <FormGroup horitontal>
                                                <Input
                                                    simple
                                                    placeholder="Price"
                                                    defaultValue={selectedItem.price}
                                                    disabled
                                                />
                                                <Input
                                                    simple
                                                    placeholder="Value"
                                                    defaultValue={selectedItem.value}
                                                    disabled
                                                />
                                            </FormGroup>
                                            <FormGroup horitontal>
                                                {!selectedCategory.unique &&
                                                <Input
                                                    simple
                                                    placeholder="Amount"
                                                    defaultValue={selectedItem.amount}
                                                    disabled
                                                />}
                                                {!selectedCategory.unique &&
                                                <Input
                                                    simple
                                                    placeholder="Min Amount"
                                                    defaultValue={selectedItem.minAmount}
                                                    disabled
                                                />}
                                            </FormGroup>
                                        </FormGroup>
                                        {selectedCategory.unique &&
                                        <Input
                                            simple
                                            placeholder="Serial Number"
                                            disabled
                                        />}
                                        {
                                            selectedItem.customFields.map((field, index) => {
                                                return (
                                                    <Input
                                                        key={index + "field"}
                                                        simple
                                                        disabled
                                                        placeholder={field.name}
                                                        defaultValue={field.value}
                                                    />
                                                )
                                            })
                                        }
                                    </FormGroup>
                                </Form>}
                            </Modal>
                            <Modal open={viewUniqueItemModal} onClose={setViewUniqueItemModal}>
                                {selectedItem &&
                                <Form width="600px" onSubmit={SubmitAddItem}>
                                    <FormGroup>
                                        <Input
                                                simple
                                                placeholder="Name"
                                                defaultValue={selectedItem.name}
                                                disabled
                                        />
                                        <FormGroup horitontal>
                                            <FormGroup horitontal>
                                                <Input
                                                    simple
                                                    placeholder="Price"
                                                    defaultValue={selectedItem.price}
                                                    disabled
                                                />
                                                <Input
                                                    simple
                                                    placeholder="Value"
                                                    defaultValue={selectedItem.value}
                                                    disabled
                                                />
                                            </FormGroup>
                                            <FormGroup horitontal>
                                                <Input
                                                    simple
                                                    placeholder="Amount"
                                                    defaultValue={selectedItem.amount}
                                                    disabled
                                                />
                                                {!selectedCategory.unique &&
                                                <Input
                                                    simple
                                                    placeholder="Min Amount"
                                                    defaultValue={selectedItem.minAmount}
                                                    disabled
                                                />}
                                            </FormGroup>
                                        </FormGroup>
                                        <div className={styles.mx_subitem_list}>
                                        {
                                            selectedItem.subItems.map((subItem, index) => {
                                                return (
                                                    <div key={index + "subItem"}>
                                                        <p>Serial Number: {subItem.serial}</p>
                                                        {
                                                            subItem.customFields.map((field, index1) => {
                                                                return (
                                                                    <p key={index1 + "subField"}>{field.name}: {field.value}</p>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                )
                                            })
                                        }
                                        </div>
                                    </FormGroup>
                                </Form>}
                            </Modal>
                            <Modal open={checkoutItemModal} onClose={setCheckoutItemModal}>
                                {selectedItem &&
                                <Form onSubmit={SubmitAddToCheckout}>
                                    <FormGroup>
                                        <h1>{selectedItem.name}</h1>
                                    </FormGroup>
                                    <FormGroup>
                                        <h3>Available: {selectedItem.amount}</h3>
                                    </FormGroup>
                                    <FormGroup>
                                        <Input
                                            simple
                                            placeholder="Amount to Checkout"
                                            defaultValue={0}
                                            type="number"
                                            min={0}
                                            max={selectedItem.amount}
                                            step="1"
                                            ref={checkoutAmountRef}
                                            required
                                        />
                                    </FormGroup>
                                    <FormGroup final>
                                        <Button>Add to Checkout</Button>
                                    </FormGroup>
                                </Form>}
                            </Modal>
                            <Modal open={checkoutUniqueItemModal} onClose={setCheckoutUniqueItemModal}>
                                <Form width="400px" onSubmit={SubmitAddToCheckout}>
                                    <FormGroup>Available List</FormGroup>
                                    <FormGroup>
                                        <div className={styles.mx_subitem_list}>
                                        {
                                            selectedItem &&
                                            selectedItem.subItems.map((subItem, index) => {
                                                return (
                                                    <div key={index + "subItem"}>
                                                        <p>Serial Number: {subItem.serial}</p>
                                                        {
                                                            subItem.customFields.map((field, index1) => {
                                                                return (
                                                                    <p key={index1 + "subField"}>{field.name}: {field.value}</p>
                                                                )
                                                            })
                                                        }
                                                        <GlassButton type="button" onClick={_ => {
                                                            selectedItem.subItems.splice(index, 1);
                                                            const copy = [...checkoutFinalList];
                                                            copy.push(subItem);
                                                            setCheckoutFinalList(copy);
                                                        }}>Add</GlassButton>
                                                    </div>
                                                )
                                            })
                                        }
                                        </div>
                                    </FormGroup>
                                    <FormGroup>Checkout List</FormGroup>
                                    <FormGroup>
                                        <div className={styles.mx_subitem_list}>
                                        {
                                            checkoutFinalList &&
                                            checkoutFinalList.map((subItem, index) => {
                                                return (
                                                    <div key={index + "subItem"}>
                                                        <p>Serial Number: {subItem.serial}</p>
                                                        {
                                                            subItem.customFields.map((field, index1) => {
                                                                return (
                                                                    <p key={index1 + "subField"}>{field.name}: {field.value}</p>
                                                                )
                                                            })
                                                        }
                                                        <GlassButton type="button" onClick={_ => {
                                                            checkoutFinalList.splice(index, 1);
                                                            const copy = {...selectedItem};
                                                            copy.subItems.push(subItem);
                                                            setSelectedItem(copy);
                                                        }}>Remove</GlassButton>
                                                    </div>
                                                )
                                            })
                                        }
                                        </div>
                                    </FormGroup>
                                    <FormGroup final>
                                        <Button type="submit">Add to Checkout</Button>
                                    </FormGroup>
                                </Form>
                            </Modal>
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