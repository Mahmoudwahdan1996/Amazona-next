import { connectToDatabase } from "../../../../utils/helper/db";
// import { getSession } from "next-auth/react";
import { ObjectId } from "mongodb";

async function handler(req, res) {
  if (req.method === "PATCH") {
    const client = await connectToDatabase();

    const db = client.db();
    const id = req.query.id;
    const order = await db.collection("orders").findOne({ _id: ObjectId(id) });
    if (order) {
      try {
        const result = await db.collection("orders").updateOne(
          {
            _id: ObjectId(id),
          },
          { $set: { isDelivered: true, deliveredAt: Date.now() } }
        );

        client.close();
        res
          .status(201)
          .json({ message: "Order Delivered Done!!", data: result });
      } catch (error) {
        client.close();
        res.status(422).json({ message: "something went wrong" });
      }
    }
  }
}

export default handler;
