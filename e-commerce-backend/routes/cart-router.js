const express = require('express');
const router = express.Router();
const cart = require('../controller/cart-controller');

router.get('/user/:userId', cart.getCartByUserId); 
router.post('/add', cart.addToCart); 
router.delete('/remove', cart.removeFromCart); 

module.exports = router;