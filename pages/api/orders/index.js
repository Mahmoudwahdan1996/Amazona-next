import { connectToDatabase } from "../../../utils/helper/db";
import { getSession } from "next-auth/react";

async function handler(req, res) {
  if (req.method === "POST") {
    const session = await getSession({ req });
    const order = { ...req.body, orderId: session.user.email };
    let client;
    try {
      client = await connectToDatabase();
    } catch (error) {
      res.status(500).json({
        message: "Failed to connect to server !",
      });
    }
    const db = client.db();

    try {
      const result = await db.collection("orders").insertOne({ ...order });
      order.id = result.insertedId;

      client.close();

      res
        .status(201)
        .json({ message: "Successful placeOrder !", order: order });
    } catch (error) {
      client.close();
      res.status(500).json({ message: "Failed to store order on server !" });
    }
  }
}

export default handler;
