const express = require('express');
const router = express.Router();
const cart = require('../controller/cart-controller');

router.post('/add', cart.addToCart); 
router.get('/user/:userId', cart.getCartByUserId);
router.put('/update-quantity', cart.updateQuantity); 
router.delete('/remove', cart.removeFromCart); 

module.exports = router;