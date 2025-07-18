import { MongoClient, ServerApiVersion } from "mongodb";
import "dotenv/config";

const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// declared database collection

let apartmentsCollection;
let usersCollection;
let agreementsCollection;
let announcementCollection;
let couponsCollection;
let paymentsCollection;

const connectDB = async () => {
  try {
    const dataBase = client.db("My-House");
    apartmentsCollection = dataBase.collection("apartments");
    usersCollection = dataBase.collection("users");
    agreementsCollection = dataBase.collection("agreements");
    announcementCollection = dataBase.collection("announcements");
    couponsCollection = dataBase.collection("coupons");
    paymentsCollection = dataBase.collection("payments");
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export {
  apartmentsCollection,
  connectDB,
  usersCollection,
  agreementsCollection,
  announcementCollection,
  couponsCollection,
  paymentsCollection,
};
