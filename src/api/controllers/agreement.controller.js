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
    const existingAgreement = await agreementsCollection.findOne({
      userEmail: userEmail,
      status: { $in: ["checked", "pending", "revoked"] },
      $or: [
        { decision: { $in: ["approved", "rejected", "revoked"] } },
        { decision: { $exists: false } },
      ],
    });

    if (existingAgreement) {
      const status = existingAgreement.status;
      const decision = existingAgreement.decision;

      if (status === "pending" && !decision) {
        return res
          .status(400)
          .send({ message: "You already have an pending agreement" });
      }

      if (status === "checked" && decision === "approved") {
        return res
          .status(400)
          .send({ message: "You already have an active agreement" });
      }

      if (status === "checked" && decision === "rejected") {
        return res.status(400).send({
          message:
            "Your agreement has been already rejected. You can't able to make an agreement any more. If any question? please, contact to the Building Authority",
        });
      }

      if (status === "revoked" && decision === "revoked") {
        return res.status(400).send({
          message:
            "Sorry , You are black listed from this building. You can't able to make any agreement.Please, contact to the Building Authority.",
        });
      }
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

const updateAgreement = async (req, res) => {
  try {
    const { id } = req.params;
    const { decision, email, apartmentId } = req.body;
    console.log(id, decision, email, apartmentId);
    // update agreement status
    const result = await agreementsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "checked",
          checkedAt: new Date().toISOString(),
          decision: decision,
        },
      },
    );
    // checking if result not updated
    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Agreement not found" });
    }

    if (decision === "rejected") {
      await apartmentsCollection.updateOne(
        { _id: new ObjectId(apartmentId) },
        {
          $set: {
            status: "available",
          },
        },
      );
    }
    // checking agreement rejected or approved
    if (decision === "approved") {
      await usersCollection.updateOne(
        { email: email },
        {
          $set: {
            role: "member",
          },
        },
      );
      await apartmentsCollection.updateOne(
        { _id: new ObjectId(apartmentId) },
        {
          $set: {
            status: "booked",
          },
        },
      );
    }
    res.send({ success: true, message: `Agreement ${decision} successfully` });
  } catch (error) {
    console.log(error);
  }
};

const getAgreementByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const result = await agreementsCollection.findOne({ userEmail: email });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "No agreement found for this email",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching agreement:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export {
  createAgreement,
  getAllPendingAgreement,
  updateAgreement,
  getAgreementByEmail,
};
