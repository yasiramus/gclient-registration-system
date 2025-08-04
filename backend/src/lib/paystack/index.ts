import axios from "axios";

interface transactionProp {
  email: string;
  amount: number;
  metadata?: Record<string, any>;
}

const headers = {
  Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
  "Content-Type": "application/json",
};

const PAYSTACK_BASE = "https://api.paystack.co";

/**
 * Initializes a payment transaction with Paystack.
 * @param {transactionProp} transactionData - The transaction data including email, amount, and optional metadata.
 * @returns {Promise<any>} - The response data from Paystack containing transaction details.
 */
export const initializeTransaction = async ({
  email,
  amount,
  metadata,
}: transactionProp) => {
  const response = await axios.post(
    `${PAYSTACK_BASE}/transaction/initialize`,
    {
      amount: amount * 100,
      currency: "GHS",
      email,
      metadata,
    },
    { headers }
  );
  if (response.status !== 200) {
    throw new Error("Failed to initialize transaction");
  }
  return response.data; // returns authorization_url, reference, etc.
};

/**
 * Verifies a payment transaction with Paystack.
 * @param {string} reference - The transaction reference to verify.
 * @returns {Promise<any>} - The response data from Paystack containing verification details.
 */
export const verifyTransaction = async (reference: string) => {
  const response = await axios.get(
    `${PAYSTACK_BASE}/transaction/verify/${reference}`,
    { headers }
  );

  console.log("verifyTransaction response: ", response.data);
  return response.data;
};
// verifyTransaction("w7nisvz2cd");
