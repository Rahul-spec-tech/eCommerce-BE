const express = require('express');
const createCheckoutSession = require('../controller/payment-controller');
const app = express.Router();

app.post('/create-checkout-session', createCheckoutSession);

module.exports = app;