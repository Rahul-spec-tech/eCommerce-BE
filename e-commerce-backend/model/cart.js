const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    userId: {
        type: String,
        //type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    products: [
        {
            productId: {
                type: String,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: [1, 'Quantity must be at least 1'],
            },
        },
    ],
});

cartSchema.index({ userId: 1 });
cartSchema.index({ 'products.productId': 1 });

module.exports = mongoose.model('Cart', cartSchema);
