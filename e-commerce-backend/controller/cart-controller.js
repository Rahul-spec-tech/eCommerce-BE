const mongoose = require('mongoose');
const Cart = require('../model/cart');

const isValidId = (id) => typeof id === 'string' && id.length > 0;

exports.addToCart = async (req, res) => {
    let { userId, productId } = req.body;

    if (!isValidId(userId) || !isValidId(productId)) {
        return res.status(400).send({ message: 'Invalid user or product ID' });
    }

    try {
        let cart = await Cart.findOne({ userId });
        if (cart) {
            const productIndex = cart.products.findIndex(p => p.productId === productId);
            if (productIndex > -1) {
                cart.products[productIndex].quantity += 1;
            } else {
                cart.products.push({ productId, quantity: 1 });
            }
            await cart.save();
        } else {
            cart = await Cart.create({ userId, products: [{ productId, quantity: 1 }] });
        }
        res.status(200).send({ message: 'Product added to cart', cart });
    } catch (error) {
        console.error('Error adding to cart:', error.message);
        res.status(500).send({ message: 'Internal server error', error: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    let { userId, productId } = req.body;

    if (!isValidId(userId) || !isValidId(productId)) {
        return res.status(400).send({ message: 'Invalid user or product ID' });
    }

    try {
        let cart = await Cart.findOne({ userId });
        if (cart) {
            cart.products = cart.products.filter(p => p.productId !== productId);
            await cart.save();
        }
        res.status(200).send({ message: 'Product removed from cart' });
    } catch (error) {
        console.error('Error removing from cart:', error.message);
        res.status(500).send({ message: 'Internal server error' });
    }
};

exports.getCartByUserId = async (req, res) => {
    const { userId } = req.params;

    if (!isValidId(userId)) {
        return res.status(400).send({ message: 'Invalid user ID' });
    }

    try {
        const cart = await Cart.findOne({ userId });
        res.status(200).send(cart || { products: [] });
    } catch (error) {
        console.error('Error fetching cart:', error.message);
        res.status(500).send({ message: 'Internal server error' });
    }
};
