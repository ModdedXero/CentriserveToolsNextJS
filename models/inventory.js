const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const customFieldSchema = new Schema({
    name: String,
    value: String,
    type: String
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
    subItems: [{
        price: Number,
        value: Number,
        serial: String,
        customFields: [customFieldSchema]
    }]
})

const historySchema = new Schema({
    username: String,
    ticket: String,
    items: [{
        category: String,
        items: [itemSchema]
    }],
    reason: String
}, { timestamps: true })

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    unique: Boolean,
    items: [itemSchema],
    itemNames: [String],
    customFields: [customFieldSchema]
})

// Model used for a message on home page
const inventorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    categories: [categorySchema],
    history: [historySchema]
});

module.exports = mongoose.models.Inventory || mongoose.model("Inventory", inventorySchema);