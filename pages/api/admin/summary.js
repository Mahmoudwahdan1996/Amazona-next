import { connectToDatabase } from "../../../utils/helper/db";

async function handler(req, res) {
  if (req.method === "GET") {
    const client = await connectToDatabase();
    const db = client.db();

    try {
      const ordersCount = await db.collection("orders").countDocuments();
      const usersCount = await db.collection("clients").countDocuments();
      const productsCount = await db.collection("products").countDocuments();

      const ordersPriceGroup = await db
        .collection("orders")
        .aggregate([
          {
            $group: {
              _id: null,
              sales: { $sum: "$totalPrice" },
            },
          },
        ])
        .toArray();
      const ordersPrice =
        ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;

      const salesData = await db.collection("orders").aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            totalSales: { $sum: "$totalPrice" },
          },
        },
      ]);

      client.close();
      res.status(201).json({
        message: "Successful stored message !",
        data: {
          ordersCount,
          usersCount,
          productsCount,
          ordersPrice,
          salesData,
        },
      });
    } catch (error) {
      client.close();
      res.status(500).json({ message: "Failed to get order on server !" });
    }
  }
}

export default handler;
