const Stripe = require('stripe'); 
const stripe = Stripe(process.env.STRIPE_SECRET || "sk_test_51Q1qob02S3FGbgr7P1UQTZoyKN1RBLEkMQw4asG9xdm15IEMqwfeTBK5Cf1az8niSs9v2hLkYgEOQofgCs1mtUYm00QUpPArcO");

const createCheckoutSession = async (req, res) => {
    const { cartItems } = req.body;
    //console.log("Cart Items", cartItems);
    const items = cartItems.map((product) => ({
        price_data: {
            currency: 'inr',
            product_data: {
                name: product.productDetails.title, 
                images: [product.productDetails.image], 
            },
            unit_amount: product.productDetails.price* 100, 
        },
        quantity: product.quantity,
    }));

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items,
            mode: 'payment',
            success_url: 'http://localhost:3000/success', 
            cancel_url: 'http://localhost:3000/cancel', 
        });
        res.json({ id: session.id });
    } catch (error) {
        console.error('Stripe checkout session creation failed:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
};

module.exports = createCheckoutSession;