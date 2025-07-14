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
    if (!user || !apartment) {
      return res.status(404).send({ message: "user or apartment not found" });
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
    res.status(201).send(agreementResult);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
};




export { createAgreement };
