const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    _id: {
        //type: String ,
        type: Schema.Types.ObjectId, 
        required: true,
        auto: true,
    },
    id: {
        type: String, 
        required: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: String,
    image: String,
    category: String
});

module.exports = mongoose.model('Product', productSchema);
