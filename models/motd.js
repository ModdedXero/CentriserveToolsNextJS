const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Model used for a message on home page
const motdSchema = new Schema({
    message: String
});

module.exports = mongoose.models.Motd || mongoose.model("Motd", motdSchema);