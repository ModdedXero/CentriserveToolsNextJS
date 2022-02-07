import { useRef, useState } from "react";
import axios from "axios";

import { SecureComponent, useAuth } from "../../components/built/context";
import SiteNavbar from "../../components/built/site_navbar";
import InventoryNavbar from "../../components/built/inventory_navbar";
import styles from "../../styles/inventory.module.css";
import Button from "../../components/button";
import { GlassButton } from "../../components/button";
import { Navbar, NavGroup } from "../../components/navbar";
import { Form, FormGroup } from "../../components/form";
import { Input, TextArea } from "../../components/input";
import { Table, TableBCell, TableBody, TableHCell, TableHead, TableRow } from "../../components/table";
import Modal from "../../components/modal";
import Select from "../../components/select";

export default function InventoryPage({ locations }) {
    // Current logged in user
    const { currentUser } = useAuth();

    // Alert Messages
    const [successAlert, setSuccessAlert] = useState(null);

    // Locations and Categories
    const [selectedLocation, setSelectedLocation] = useState();
    const [selectedCategory, setSelectedCategory] = useState();
    const [categoryNames, setCategoryNames] = useState([]);
    const [itemNames, setItemNames] = useState([]);
    const [itemQuery, setItemQuery] = useState();

    // Category History
    const [viewCategoryHistory, setViewCategoryHistory] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState();

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

    const [checkoutFinalList, setCheckoutFinalList] = useState([]);

    const checkoutAmountRef = useRef();

    // Checkout View
    const [checkoutViewModal, setCheckoutViewModal] = useState(false);
    const [checkoutCart, setCheckoutCart] = useState([]);

    const checkoutReasonRef = useRef();
    const checkoutTicketRef = useRef();

    async function SelectLocation(loc) {
        setSelectedCategory(undefined);
        setCheckoutCart([]);

        const result = await axios.post("/api/inventory/client/location", { location: loc });
        if (result.status === 200) {
            setSelectedLocation(result.data);
            const cats = [];
            for (const cat of result.data.categories) {
                cats.push(cat.name)
            }
            setCategoryNames(cats);
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
            setSuccessAlert(`Item ${newItem.name} has been added!`);
        }
        
        setAddItemModal(false);
    }

    async function SubmitAddToCheckout(e) {
        e.preventDefault();

        const copy = [...checkoutCart];

        const length =  checkoutCart.length || 1;
        for (let i = 0; i < length; i++) {
            if (copy.filter(i => i.category === selectedCategory.name).length > 0) {
                if (copy[i].category === selectedCategory.name) {
                    if (selectedCategory.unique) {
                        for (const item of checkoutFinalList) {
                            copy[i].items.push({ name: selectedItem.name, ...item });
                            selectedItem.amount -= 1;
                        }

                        break;
                    } else {
                        if (copy[i].items.filter(i => i.name === selectedItem.name).length > 0) {
                            for (const item of copy[i].items) {
                                item.amount += parseInt(checkoutAmountRef.current.value);
                                selectedItem.amount -= parseInt(checkoutAmountRef.current.value);
                                break;
                            }
                        } else {
                            const item = {...selectedItem};
                            item.amount = parseInt(checkoutAmountRef.current.value);
                            selectedItem.amount -= parseInt(checkoutAmountRef.current.value);

                            copy[i].items.push(item);
                            break;
                        }
                    }
                }
            } else {
                const items = [];

                if (selectedCategory.unique) {
                    for (const item of checkoutFinalList) {
                        items.push({ name: selectedItem.name, ...item });
                    }
                } else {
                    const item = {...selectedItem};
                    item.amount = parseInt(checkoutAmountRef.current.value);
                    selectedItem.amount -= parseInt(checkoutAmountRef.current.value);

                    items.push(item);
                }

                copy.push({
                    category: selectedCategory.name,
                    items: items
                })

                break;
            }
        }
        
        if (checkoutAmountRef.current) checkoutAmountRef.current.value = 0;
        setCheckoutUniqueItemModal(false);
        setCheckoutItemModal(false);
        setCheckoutFinalList([]);
        setSuccessAlert("Items added to Checkout!");
        setCheckoutCart(copy);
    }

    function closeUniqueCheckout() {
        for (const item of checkoutFinalList) {
            selectedItem.subItems.push(item);
        }

        setCheckoutFinalList([]);
        setCheckoutUniqueItemModal(false);
    }

    async function SubmitCheckout(e) {
        e.preventDefault();

        const result = await axios.post("/api/inventory/checkout", { 
            location: selectedLocation.name, 
            cart: checkoutCart,
            reason: checkoutReasonRef.current.value,
            ticket: checkoutTicketRef.current.value,
            username: currentUser.email
        })

        if (result.status === 200) {
            setSelectedCategory(undefined);
            await SelectLocation(selectedLocation.name);
            setSuccessAlert("Checkout submitted!");
        }

        checkoutReasonRef.current.value = "";
        checkoutTicketRef.current.value = "";
        setCheckoutViewModal(false);
    }

    function selectCategory(cat) {
        setSelectedCategory(cat);

        const items = [];
        for (const i of cat.items) {
            items.push(i.name);
        }

        setItemNames(items);
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
                        </NavGroup>
                        <NavGroup>
                            <Button onClick={_ => selectedLocation ? setAddItemModal(true) : null}>
                                Add Item
                            </Button>
                            <SuccessAlert data={successAlert} clearData={setSuccessAlert} />
                            <Modal open={addItemModal} onClose={setAddItemModal}>
                                <Form width="600px" onSubmit={SubmitAddItem}>
                                    <FormGroup>
                                        <FormGroup horitontal>
                                            <Select
                                                strict
                                                options={categoryNames}
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
                        <NavGroup align="right">
                            <Button onClick={_ => setViewCategoryHistory(true)}>History</Button>
                            <Modal open={viewCategoryHistory} onClose={setViewCategoryHistory}>
                                <Navbar>
                                    <NavGroup>
                                        <Select
                                            options={[]} 
                                        />
                                    </NavGroup>
                                </Navbar>
                                <div className={styles.mx_inventory_history}>
                                    <div className={styles.mx_inventory_history_list}>
                                        {
                                            selectedLocation &&
                                            selectedLocation.history.map((notes, index) => {
                                                return (
                                                    <div 
                                                        className={styles.mx_inventory_history_item} 
                                                        key={index}
                                                    >
                                                        <Input
                                                            simple
                                                            placeholder="Username"
                                                            defaultValue={notes.username}
                                                            disabled 
                                                        />
                                                        <Input
                                                            simple
                                                            placeholder="Ticket"
                                                            defaultValue={notes.ticket}
                                                            disabled 
                                                        />
                                                        <TextArea label="Reason" defaultValue={notes.reason} readOnly />
                                                        <Button onClick={_ => setSelectedHistory(notes)}>Items</Button>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className={styles.mx_inventory_history_item_list}>
                                        <h1>Items - Ticket: {selectedHistory && selectedHistory.ticket}</h1>
                                        <Table>
                                            <TableHead top="0px">
                                                <TableHCell>Category</TableHCell>
                                                <TableHCell>Item</TableHCell>
                                                <TableHCell>Serial/Amount</TableHCell>
                                            </TableHead>
                                            <TableBody>
                                            {
                                                selectedHistory &&
                                                selectedHistory.items.map((item, index) => {
                                                    return item.items.map((subItem, index1) => {
                                                        return (
                                                            <TableRow>
                                                                <TableBCell>{item.category}</TableBCell>
                                                                <TableBCell>{subItem.name}</TableBCell>
                                                                <TableBCell>
                                                                    {selectedLocation.categories.filter(
                                                                        i => i.name === item.category
                                                                    )[0].unique ?
                                                                        subItem.serial :
                                                                        subItem.amount
                                                                    }
                                                                </TableBCell>
                                                            </TableRow>
                                                        )
                                                    })
                                                })
                                            }
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </Modal>
                            <Button onClick={_ => setCheckoutViewModal(true)}>View Checkout</Button>
                            <Modal open={checkoutViewModal} onClose={setCheckoutViewModal}>
                                <Form width="600px" onSubmit={SubmitCheckout}>
                                    <div className={styles.mx_inventory_checkout_list}>
                                        <Table>
                                            <TableHead top="0px">
                                                <TableHCell>Category</TableHCell>
                                                <TableHCell>Item</TableHCell>
                                                <TableHCell>Value</TableHCell>
                                                <TableHCell>Serial/Amount</TableHCell>
                                            </TableHead>
                                            <TableBody>
                                            {
                                                checkoutCart.sort((a, b) => a.category.localeCompare(b.category)).map((item, index) => {
                                                    return (
                                                        <>
                                                            {
                                                                item.items.map((subItem, index1) => {
                                                                    return (
                                                                        <TableRow key={index1 + "cart" + index}>
                                                                            <TableBCell>{item.category}</TableBCell>
                                                                            <TableBCell>{subItem.name}</TableBCell>
                                                                            <TableBCell>{subItem.value}</TableBCell>
                                                                            <TableBCell>
                                                                                {selectedLocation.categories.filter(
                                                                                    i => i.name === item.category
                                                                                )[0].unique ?
                                                                                    subItem.serial :
                                                                                    subItem.amount
                                                                                }
                                                                            </TableBCell>
                                                                        </TableRow>
                                                                    )
                                                                })
                                                            }
                                                        </>
                                                    )
                                                })
                                            }
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <FormGroup>
                                        <TextArea
                                            label="Reason"
                                            ref={checkoutReasonRef}
                                            required
                                        />
                                        <Input
                                            simple
                                            placeholder="Ticket Number"
                                            ref={checkoutTicketRef}
                                            required
                                        />
                                    </FormGroup>
                                    <FormGroup final>
                                        <Button>Submit</Button>
                                    </FormGroup>
                                </Form>
                            </Modal>
                        </NavGroup>
                    </Navbar>
                    <div className={styles.mx_inventory_page_body}>
                        <div className={styles.mx_inventory_page_body_cats}>
                            {
                                selectedLocation &&
                                selectedLocation.categories.sort((a, b) => a.name.localeCompare(b.name)).map((cat, index) => {
                                    return (
                                        <GlassButton 
                                            key={index}
                                            onClick={_ => selectCategory(cat)}
                                            selected={selectedCategory ? selectedCategory.name === cat.name : false}
                                        >
                                            {cat.name} ({cat.items.length})
                                        </GlassButton>
                                    )
                                })
                            }
                        </div>
                        <div className={styles.mx_inventory_page_body_wrapper}>
                            <Navbar>
                                <NavGroup>
                                    <Select
                                        search
                                        options={itemNames}
                                        getQuery={setItemQuery}
                                        noShow
                                    />
                                </NavGroup>
                            </Navbar>
                            <div className={styles.mx_inventory_page_body_container}>
                                {
                                    selectedCategory &&
                                    selectedCategory.items.sort((a, b) => a.name.localeCompare(b.name)).filter(item => {
                                        if (!itemQuery || item.name.toLowerCase().includes(itemQuery.toLowerCase())) {
                                            return item;
                                        } else {
                                            return null;
                                        }
                                    }).map((item, index) => {
                                        const units = selectedCategory.unique ? item.subItems.length : item.amount;
                                        console.log(item)
                                        return (
                                            <div className={styles.mx_inventory_page_body_container_item} key={index + "item"}>
                                                <h1>{item.name}</h1>
                                                <div>
                                                    <h2>{units} units | ${item.value} | Total: ${units * item.value}</h2>
                                                </div>
                                                {item.minAmount > 0 && <h3>Min Amount: {item.minAmount}</h3>}
                                                <div className={styles.mx_icons}>
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
                                                    {selectedCategory &&
                                                    !selectedCategory.unique &&
                                                    <Input
                                                        simple
                                                        placeholder="Amount"
                                                        defaultValue={selectedItem.amount}
                                                        disabled
                                                    />}
                                                    {selectedCategory &&
                                                    !selectedCategory.unique &&
                                                    <Input
                                                        simple
                                                        placeholder="Min Amount"
                                                        defaultValue={selectedItem.minAmount}
                                                        disabled
                                                    />}
                                                </FormGroup>
                                            </FormGroup>
                                            {selectedCategory &&
                                            selectedCategory.unique &&
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
                                                    {selectedCategory &&
                                                    !selectedCategory.unique &&
                                                    <Input
                                                        simple
                                                        placeholder="Min Amount"
                                                        defaultValue={selectedItem.minAmount}
                                                        disabled
                                                    />}
                                                </FormGroup>
                                            </FormGroup>
                                            <FormGroup>
                                                <h3>Items:</h3>
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
                                                defaultValue={1}
                                                type="number"
                                                min={1}
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
                                <Modal open={checkoutUniqueItemModal} onClose={closeUniqueCheckout}>
                                    <Form width="400px" onSubmit={SubmitAddToCheckout}>
                                        <FormGroup>
                                            <h3>Available List</h3>
                                        </FormGroup>
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
                                        <FormGroup>
                                            <h3>Checkout List</h3>
                                        </FormGroup>
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
            </div>
        </SecureComponent>
    )
}

import { parseLocations } from "../api/inventory/locations";
import { SuccessAlert } from "../../components/alert";

export async function getStaticProps({ params }) {
    const locations = await parseLocations();

    return {
        props: { locations: locations }
    }
}