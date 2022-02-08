const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const securitySchema = new Schema({
    name: String,
    state: Number
})

// Model used for a message on home page
const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: String,
    security: [securitySchema],
    hash: String,
    lastLogin: Date
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);