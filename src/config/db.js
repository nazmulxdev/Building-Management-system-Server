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

const connectDB = async () => {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );

    // declare of database and connect collection to the data base
    const dataBase = client.db("My-House");
    apartmentsCollection = dataBase.collection("apartments");
    usersCollection = dataBase.collection("users");
  } catch (error) {
    console.log("error from database connection", error);
  }
};

export { apartmentsCollection, connectDB, usersCollection };
