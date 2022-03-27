// import { connectToDatabase } from "../../utils/helper/db";

// async function handler(req, res) {
//   if (req.method === "POST") {
//     const client = await connectToDatabase();
//     const db = client.db();
//     const data = req.body.products;
//     console.log(data);
//     try {
//       const result = await db.collection("products").insertMany(data);
//       client.close();
//       console.log(result);
//       res.status(201).json({ message: "Data inserted", data: result });
//     } catch (error) {
//       client.close();
//       res.status(422).json({ message: "Failed to post Data" });
//     }
//   }
// }
// export default handler;
