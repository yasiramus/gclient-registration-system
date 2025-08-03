import axios from "axios";

interface transactionProp {
  amount: number;
  email: string;
  metadata?: Record<string, any>;
}

const headers = {
  Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
  "Content-Type": "application/json",
};

const PAYSTACK_BASE = "https://api.paystack.co";

export const initializeTransaction = async ({
  amount,
  email,
  metadata,
}: transactionProp) => {
  const res = await axios.post(
    `${PAYSTACK_BASE}/transaction/initialize`,
    {
      amount: amount * 100,
      currency: "GHS",
      email,
      metadata,
    },
    { headers }
  );

  return res.data.data; // returns authorization_url, reference, etc.
};

// export const verifyTransaction = async (reference: string) => {
//   const res = await axios.get(
//     `${PAYSTACK_BASE}/transaction/verify/${reference}`,
//     {
//       headers,
//     }
//   );

//   return res.data.data;
// };
