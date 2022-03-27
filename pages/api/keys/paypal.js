async function handler(req, res) {
  if (req.method === "GET") {
    res.status(201).send({ clientId: process.env.PAYPAL_CLIENT_ID || "sb" });
  }
}

export default handler;
