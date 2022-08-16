import React, { useEffect, useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

function CheckoutForm({ amount }) {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function getClientSecret(total) {
      try {
        const { data } = await axios.post(
          `http://localhost:3005/api/payment/create/${amount * 100}`
        );
        // All API requests expect amounts to be provided
        // in a currency’s smallest unit.

        setClientSecret(data.clientSecret);
      } catch (error) {
        setErrorMsg(error.message);
      }
    }
    getClientSecret(amount);
  }, [amount]);
  async function paymentHandler(e) {
    e.preventDefault();
    if (!stripe || !elements || errorMsg) {
      return;
    } else {
      setProcessing(true);
      await stripe
        .confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        })
        .then(({ paymentIntent }) => {
          setErrorMsg(false);
          setProcessing(false);
          setSuccess(true);
        })
        .catch((error) => {
          setErrorMsg(error.message);
          setProcessing(false);
          setSuccess(false);
        });
    }
  }

  return (
    <div>
      <form onSubmit={paymentHandler}>
        <CardElement />
        {errorMsg && <div className="errorMsg">{errorMsg}</div>}
        <button disabled={!stripe || !elements || processing || success}>
          Pay Now
        </button>
      </form>
    </div>
  );
}

export default CheckoutForm;
