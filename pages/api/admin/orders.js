import { connectToDatabase } from "../../../utils/helper/db";

async function handler(req, res) {
  if (req.method === "GET") {
    const client = await connectToDatabase();
    const db = client.db();

    const orders = await db
      .collection("orders")
      .aggregate([
        {
          $lookup: {
            //searching collection name
            from: "clients",
            //setting variable [searchId] where your string converted to ObjectId
            let: { searchId: { $toObjectId: "$userId" } },
            //search query with our [searchId] value
            pipeline: [
              //searching [searchId] value equals your field [_id]
              //   { $match: { $expr: [{ _id: "$$searchId" }] } },
              { $match: { $expr: { $eq: ["$_id", "$$searchId"] } } },
              //projecting only fields you reaaly need, otherwise you will store all - huge data loads
              { $project: { userName: 1 } },
            ],

            as: "user",
          },
        },
      ])
      .toArray();

    client.close();
    res.status(201).json({
      message: "Successful stored message !",
      data: orders,
    });
    // client.close();
    // try {
    // } catch (error) {
    //   res.status(500).json({ message: "Failed to get order on server !" });
    // }
  }
}

export default handler;
