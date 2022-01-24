const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const motdSchema = new Schema({
    message: String
});

module.exports = mongoose.models.Motd || mongoose.model("Motd", motdSchema);