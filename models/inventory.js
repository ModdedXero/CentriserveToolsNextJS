const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const customFieldSchema = new Schema({
    name: String,
    value: String,
    type: String
})

const subItemSchema = new Schema({
    price: Number,
    value: Number,
    serial: String,
    customFields: [customFieldSchema],
    notes: [String]
})

const itemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: Number,
    value: Number,
    amount: Number,
    minAmount: Number,
    serial: String,
    customFields: [customFieldSchema],
    notes: [String],
    subItems: [subItemSchema]
})

const historySchema = new Schema({
    username: String,
    ticket: String,
    items: [itemSchema],
    reason: String
})

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    unique: Boolean,
    items: [itemSchema],
    itemNames: [String],
    customFields: [customFieldSchema],
    history: [historySchema]
})

// Model used for a message on home page
const inventorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    categories: [categorySchema]
});

module.exports = mongoose.models.Inventory || mongoose.model("Inventory", inventorySchema);