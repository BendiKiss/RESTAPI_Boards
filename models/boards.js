const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let boardsSchema = new Schema(
{
    name: {type: String},
    type: {type: String},
    style: {type: String},
    description: {type: String},
    price: {type: Number},
    inStock: {type: Boolean}
}
);

module.exports = mongoose.model("boards", boardsSchema);