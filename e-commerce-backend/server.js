const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const bodyParser = require('body-parser');
const Stripe = require('stripe');
const Payment = require('./model/Payment');
const authMiddleware = require('./middleware/auth-middleware');
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

//app
const app = express();

//port
const port = process.env.PORT || 8080;

//routes
const productRoute = require('./routes/product-router');
const homeRoute = require('./routes/home-router');
const cartRoute = require('./routes/cart-router');
const userRoute = require('./routes/user-router');
const authRoute = require('./routes/auth-router');
const paymentRoute = require('./routes/payment-router');

//middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET, POST, PUT, DELETE',
  credentials: true,
}));
//app.use(authMiddleware);
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//view engine
app.set('view engine', 'ejs');
app.set('views', 'views');
app.disable('view cache');

app.use('/auth', authRoute); 
app.use('/', authMiddleware, homeRoute);
app.use('/products', productRoute);
app.use('/carts', authMiddleware, cartRoute);
app.use('/users',authMiddleware, userRoute);
app.use('/payment', authMiddleware, paymentRoute);

const stripe = Stripe(process.env.STRIPE_SECRET);
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } 
  catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const paymentDetails = new Payment({
      sessionId: session.id,
      amount: session.amount_total / 100, 
      currency: session.currency,
      cartItems: JSON.parse(session.metadata.cartItems || '[]'), 
    });
    try {
      await paymentDetails.save();
    } 
    catch (err) {
      return res.status(500).send('Server error');
    }
  }
  res.status(200).send('Webhook received');
});

mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;
