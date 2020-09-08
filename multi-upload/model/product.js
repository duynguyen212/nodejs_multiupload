const mongoose = require('mongoose');

var schemaProduct = new mongoose.Schema({ 
    name: { type: String }, 
    price: { type: Number },
    images: { type: Array } 
}, {collection: "products"});

module.exports = mongoose.model("product", schemaProduct);