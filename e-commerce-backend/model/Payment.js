const mongoose = require('mongoose');
const PaymentSchema = new mongoose.Schema({
  sessionId: { 
    type: String, 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true
  },
  currency: { 
    type: String, 
    required: true 
  },
  cartItems: [{
    productId: { 
      type: String,
      required: true
    },
    quantity: { 
        type: Number, 
        required: true 
    },
  }],
  createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', PaymentSchema);
module.exports = Payment;