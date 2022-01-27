const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const securitySchema = new Schema({
    name: String,
    view: Boolean,
    edit: Boolean,
    admin: Boolean
})

// Model used for a message on home page
const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: String,
    security: [securitySchema]
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);