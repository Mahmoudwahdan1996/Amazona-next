import { connectToDatabase } from "../../../utils/helper/db";
import { getSession } from "next-auth/react";

async function handler(req, res) {
  const session = await getSession({ req });

  if (req.method === "GET") {
    if (!session) {
      res.status(401).json({ message: "Not Authenticated" });
      return;
    }
    let client;
    try {
      client = await connectToDatabase();
    } catch (error) {
      res.status(500).json({
        message: "Failed to connect to server !",
      });
    }
    const db = client.db();

    let ordersInfo = [];
    try {
      await db
        .collection("orders")
        .find({ user: session.user.userId })
        .forEach((order) => {
          ordersInfo.push(order);
        });
      client.close();
      res.status(201).json({
        message: "Successful stored message !",
        ordersInfo,
      });
    } catch (error) {
      client.close();
      res.status(500).json({ message: "Failed to get order on server !" });
    }
  }
}

export default handler;
