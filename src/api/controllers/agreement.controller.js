import { ObjectId } from "mongodb";
import {
  agreementsCollection,
  usersCollection,
  apartmentsCollection,
} from "../../config/db.js";

const createAgreement = async (req, res) => {
  try {
    const { apartmentId } = req.body;
    const userEmail = req.decoded.email;
    if (!ObjectId.isValid(apartmentId)) {
      return res.status(400).json({ message: "Invalid apartment id." });
    }
    // checking agreement for this email
    const existingAgreement = await agreementsCollection.findOne({
      userEmail: userEmail,
    });
    if (existingAgreement) {
      return res
        .status(400)
        .send({ message: "You already have an active agreement" });
    }
    // get user and apartment data
    const [user, apartment] = await Promise.all([
      usersCollection.findOne({ email: userEmail }),
      apartmentsCollection.findOne({ _id: new ObjectId(apartmentId) }),
    ]);
    if (!user) {
      return res.status(404).send({ message: "user not found" });
    }
    if (!apartment) {
      return res.status(404).send({ message: "apartment not found" });
    }
    if (apartment.status !== "available") {
      return res
        .status(404)
        .send({ message: "apartment is not available for booking" });
    }
    // creating agreement document
    const agreementDoc = {
      apartmentId: apartmentId,
      userEmail: user.email,
      userName: user.name,
      floor: apartment.floor,
      block: apartment.block,
      apartmentNo: apartment.apartmentNo,
      rent: apartment.rent,
      status: "pending",
      agreementDate: new Date(),
    };
    const agreementResult = await agreementsCollection.insertOne(agreementDoc);
    const updateStatue = await apartmentsCollection.updateOne(
      { _id: new ObjectId(apartmentId) },
      {
        $set: {
          status: "pending",
        },
      },
    );
    res.status(201).send({ agreementResult, updateStatue });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
};

const getAllPendingAgreement = async (req, res) => {
  try {
    const result = await agreementsCollection
      .find({ status: "pending" })
      .sort({
        agreementDate: -1,
      })
      .toArray();
    res.send(result);
  } catch (error) {
    res.status(404).send({ message: "internal server error" });
  }
};

export { createAgreement, getAllPendingAgreement };
