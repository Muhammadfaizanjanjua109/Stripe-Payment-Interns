const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = new express();
const stripe = require('stripe')(process.env.STEIPE_PAYMENT_SECRET_KEY);
app.post('/api/payment/create', async (request, response) => {
  const amount = request.body.amount;
  console.log('request', request.body.amount);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'usd',
  });
  response.status(200).send({
    message: true,
    clientSecret: paymentIntent.client_secret,
  });
});

app.listen(3005, () => {});
